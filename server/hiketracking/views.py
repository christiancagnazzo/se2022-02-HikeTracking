from django.contrib.auth import login
from django.http import FileResponse
from django.shortcuts import render
from knox.views import LoginView as KnoxLoginView
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
import geopy.distance
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.contrib.auth.models import User
from django.core.mail import EmailMessage
from django.db.models import Q
from .models import CustomUser, Hike, HikeReferencePoint, Point, Hut, ParkingLot, Facility, HutFacility
from .serializers import (AuthTokenCustomSerializer, RegisterSerializer,
                          UserSerializer, PorkingLotSerializer, PointSerializer, HuntsSerializer)
from rest_framework import status

from .utility import get_province_and_village, InsertPoint


    

class HikeFile(APIView):
    # permission_classes = (permissions.AllowAny,)

    def get(self, request, hike_id):
        try:
            track = Hike.objects.get(id=hike_id).track_file
            return FileResponse(open(str(track), 'rb'))
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, hike_id):
        try:
            file = request.FILES['File']
        except:
            Hike.objects.filter(id=hike_id).delete()
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"Error": "File Requested"})

        try:
            hike = Hike.objects.get(id=hike_id)
            hike.track_file = file
            hike.save()
            return Response(status=status.HTTP_200_OK)
        except:
            Hike.objects.filter(id=hike_id).delete()
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"Error": "Hike not found"})


class UserList(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class RegisterAPI(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.is_active = False
        user = serializer.save()
        current_site = get_current_site(request)
        mail_subject = 'Activation link has been sent to your email id'
        message = render_to_string('./acc_active_email.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': account_activation_token.make_token(user),
        })
        to_email = user.email
        email = EmailMessage(
            mail_subject, message, to=[to_email]
        )
        try:
            email.send()
            return Response(status=status.HTTP_200_OK, data={
                "message": 'Please confirm your email address to complete the registration'})
        except:
            user = CustomUser.objects.get(user.id)
            user.delete()
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={
                "message": 'Server error'})


class ActivateAccount(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, uidb64, token, *args, **kwargs):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            login(request, user)
            result = super(ActivateAccount, self).post(request, format=None)

            return render(request, "emailConfirmed.html")
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={
                "massage": 'The confirmation link was invalid, possibly because it has already been used.'})


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenCustomSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        result = super(LoginAPI, self).post(request, format=None)
        return Response(status=status.HTTP_200_OK, data={"user": user.email, "role": user.role.lower().replace(" ", ""),
                                                         "token": result.data['token']})


class Hikes(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):

        filters = request.GET.get('filters', None)

        if filters:
            minLength = request.GET.get('minLength', None)
            maxLength = request.GET.get('maxLength', None)
            minTime = request.GET.get('minTime', None)
            maxTime = request.GET.get('maxTime', None)
            minAscent = request.GET.get('minAscent', None)
            maxAscent = request.GET.get('maxAscent', None)
            difficulty = request.GET.get('difficulty', None)
            province = request.GET.get('province', None)
            village = request.GET.get('village', None)

            hikes = Hike.objects.all()

            if minLength:
                hikes = hikes.filter(length__gte=minLength)
            if maxLength:
                hikes = hikes.filter(length__lte=maxLength)
            if minTime:
                hikes = hikes.filter(expected_time__gte=minTime)
            if maxTime:
                hikes = hikes.filter(expected_time__lte=maxTime)
            if minAscent:
                hikes = hikes.filter(ascent__gt=minAscent)
            if maxAscent:
                hikes = hikes.filter(ascent__lte=maxAscent)
            if difficulty:
                hikes = hikes.filter(difficulty=difficulty)

            if province:
                inner_query = Point.objects.filter(province=province)
                hikes = hikes.filter(start_point__in=inner_query)

            if village:
                inner_query = Point.objects.filter(village=village.lower().capitalize())
                hikes = hikes.filter(start_point__in=inner_query)

            hikes = hikes.values()

        else:
            hikes = Hike.objects.values()

        around = request.GET.get('around', None)

        if filters and around:
            filtered_hikes = []
            fields = around.split("-")
            radius = fields[2]
            input_coordinates = (fields[0], fields[1])

            for h in hikes:
                refer_p = Point.objects.get(id=h['start_point_id'])
                hike_coordinates = (refer_p.latitude, refer_p.longitude)
                distance = geopy.distance.geodesic(
                    input_coordinates, hike_coordinates).km

                if (distance <= float(radius)):
                    filtered_hikes.append(h)

            hikes = filtered_hikes

        result = {}
        for h in hikes:
            result = HikeReferencePoint.objects.filter(
                hike_id=h['id']).values()
            list = []
            for r in result:
                refer_p = Point.objects.get(id=r['point_id'])
                list.append({
                    'reference_point_lat': refer_p.latitude,
                    'reference_point_lng': refer_p.longitude,
                    'reference_point_address': refer_p.address})

            h['rp'] = list

            startP = Point.objects.get(id=h['start_point_id'])
            endP = Point.objects.get(id=h['end_point_id'])

            h['start_point_lat'] = startP.latitude
            h['start_point_lng'] = startP.longitude
            h['start_point_address'] = startP.address
            h['end_point_lat'] = endP.latitude
            h['end_point_lng'] = endP.longitude
            h['end_point_address'] = endP.address

        return Response(hikes, status=status.HTTP_200_OK)

    def post(self, request):
        user_id = CustomUser.objects.get(email=request.user)
        data = request.data

        try:
            sp = get_province_and_village(
                data['start_point_lat'], data['start_point_lng'])
            start_point_type = 'none'

            start_point = Point.objects.get_or_create(
                latitude=data['start_point_lat'],
                longitude=data['start_point_lng'],
                defaults={
                    'province': sp['province'],
                    'village': sp['village'],
                    'address': data['start_point_address'],
                    'type': start_point_type
                }
            )

            ep = get_province_and_village(
                data['end_point_lat'], data['end_point_lng'])
            end_point_type = 'none'

            end_point = Point.objects.get_or_create(
                latitude=data['end_point_lat'],
                longitude=data['end_point_lng'],
                defaults={
                    'province': ep['province'],
                    'village': ep['village'],
                    'address': data['end_point_address'],
                    'type': end_point_type
                }
            )

            hike = Hike.objects.create(
                title=data['title'],
                length=data['length'],
                expected_time=data['expected_time'],
                ascent=data['ascent'],
                difficulty=data['difficulty'],
                description=data['description'],
                local_guide=user_id,
                start_point=start_point[0],
                end_point=end_point[0])

            hike.save()

            for rp in data['rp_list']:
                rp_cp = get_province_and_village(
                    rp['reference_point_lat'], rp['reference_point_lng'])
                ref_point_type = 'none'
                ref_point = Point.objects.get_or_create(
                    latitude=rp['reference_point_lat'],
                    longitude=rp['reference_point_lng'],
                    defaults={
                        'province': rp_cp['province'],
                        'village': rp_cp['village'],
                        'address': rp['reference_point_address'],
                        'type': ref_point_type
                    }
                )

                rp_hike = HikeReferencePoint.objects.create(
                    hike=hike,
                    point=ref_point[0]
                )
                rp_hike.save()

            return Response(status=status.HTTP_200_OK, data={"hike_id": hike.id})
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"Error": str(e)})


class Sessions(APIView):

    def get(self, request):
        user = CustomUser.objects.get(email=request.user)
        return Response(status=200, data={"user": user.email, "role": user.role.lower().replace(" ", "")})


class Huts(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = HuntsSerializer

    def get(self, request):
        try:

            filters = request.GET.get('filters', None)

            if filters:
                name = request.GET.get('name', None)
                nbeds = request.GET.get('nbeds', None)
                fee = request.GET.get('fee', None)
                services = request.GET.get('services', None)

                huts = Hut.objects.all()

                if name:
                    huts = huts.filter(name=name)
                if nbeds:
                    huts = huts.filter(n_beds__gte=nbeds)
                if fee:
                    huts = huts.filter(fee__lte=fee)
                if services:
                    services_list = services.split("-")
                    hl = HutFacility.objects.filter(facility_id__in=services_list).values('hut_id')
                    huts_list = []
                    for h in hl:
                        huts_list.append(h['hut_id'])
                    huts = Hut.objects.filter(id__in=huts_list)

                huts = huts.values()

            else:
                huts = Hut.objects.values()

            result = []

            for h in huts:
                point = Point.objects.get(id=h['point_id'])
                h['lat'] = point.latitude
                h['lon'] = point.longitude
                h['address'] = point.address

                facilities_list = []
                all_facilities = HutFacility.objects.filter(hut_id=h['id'])
                for f in all_facilities:
                    fac_name = Facility.objects.get(id=f.facility_id).name
                    facilities_list.append(fac_name)
        
                h['services'] = str(facilities_list).replace("[", "").replace("]", "")

                result.append(h)

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, format=None):
        pointSerializer = PointSerializer(data=request.data['position'])

        if pointSerializer.is_valid():
            point = InsertPoint(pointSerializer, 'hut')
            serializer = self.serializer_class(data={**request.data, 'point': point.id})
            if serializer.is_valid():
                hut = serializer.save()
                for service in request.data['services']:
                    try:
                        obj, created = Facility.objects.get_or_create(name=service)
                        HutFacility.objects.get_or_create(hut=hut, facility=obj)
                    except Exception as exc:
                        print(exc)
                        return Response(data={'message': 'error in crating the services', 'exception': exc},
                                        status=status.HTTP_400_BAD_REQUEST)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(pointSerializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListParkingLotAPI(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PorkingLotSerializer

    def get(self, request):
        try:
            result = []
            listParkigLot = ParkingLot.objects.all().values()
            for p in listParkigLot:
                point = Point.objects.get(id=p['point_id'])
                p['lat'] = point.latitude
                p['lon'] = point.longitude
                p['address'] = point.address
                result.append(p)

            return Response(result)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, format=None):
        pointSerializer = PointSerializer(data=request.data['position'])
        if pointSerializer.is_valid():
            point = InsertPoint(pointSerializer, 'parking_lot')
            serializer = self.serializer_class(data={**request.data, 'point': point.id})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(pointSerializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Facilities(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request):
        fac = Facility.objects.all().values()
        return Response(fac, status=status.HTTP_200_OK)
