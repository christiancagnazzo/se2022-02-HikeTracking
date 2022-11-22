from django.contrib.auth import login, authenticate
from django.shortcuts import render
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from geopy.geocoders import Nominatim
from functools import partial
import geopy.distance
from django.contrib.sites.shortcuts import get_current_site
from django.shortcuts import render, redirect
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.contrib.auth.models import User
from django.core.mail import EmailMessage

from .models import CustomUser, Hike, HikeReferencePoint, Point, Hut, ParkingLot
from .serializers import (AuthTokenCustomSerializer, RegisterSerializer,
                          UserSerializer)

geolocator = Nominatim(user_agent="hiketracking")

class NewHike(APIView):
    # permission_classes = (permissions.AllowAny,)

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

            return Response(status=200, data={"hike_id": hike.id})
        except Exception as e:
            print(e)
            return Response(status=400, data={"Error": str(e)})


class HikeFile(APIView):
    # permission_classes = (permissions.AllowAny,)

    def put(self, request, hike_id):
        try:
            file = request.FILES['File']
        except:
            Hike.objects.filter(id=hike_id).delete()
            return Response(status=400, data={"Error": "File Requested"})

        try:
            hike = Hike.objects.get(id=hike_id)
            hike.track_file = file
            hike.save()
            return Response(status=200)
        except:
            Hike.objects.filter(id=hike_id).delete()
            return Response(status=400, data={"Error": "Hike not found"})


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
        email.send()
        return Response(status=200, data={
            "message": 'Please confirm your email address to complete the registration'})


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

            return Response(status=200, data={"user": user.email, "role": user.role.lower().replace(" ", ""),
                                              "token": result.data['token'],
                                              "massage": 'Your account have been confirmed.'})
        else:
            return Response(status=200, data={
                "massage": 'The confirmation link was invalid, possibly because it has already been used.'})


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenCustomSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        result = super(LoginAPI, self).post(request, format=None)
        return Response(status=200, data={"user": user.email, "role": user.role.lower().replace(" ", ""),
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
                inner_query = Point.objects.filter(village=village)
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

            try:
                with open(h['track_file'], 'r') as f:
                    file_data = f.read()
                    h['file'] = file_data

            except Exception as e:
                print(e)
                return Response(status=500)

        return Response(hikes)


class Sessions(APIView):

    def get(self, request):
        user = CustomUser.objects.get(email=request.user)
        return Response(status=200, data={"user": user.email, "role": user.role.lower().replace(" ", "")})


def get_province_and_village(lat, lon):
    try:
        reverse = partial(geolocator.reverse, language="it")
        location = reverse(str(lat) + ", " + str(lon))
        province = location.raw['address']['county']
        village = location.raw['address']['village']
        return {'province': province, 'village': village}
    except:
        return {'province': "", 'village': ""}

class Huts(APIView):
    
    def get(self, request):
        result = []

        huts = Hut.objects.all().values()

        for h in huts:
            point = Point.objects.get(id=h['point_id'])
            h['lat'] = point.latitude
            h['lon'] = point.longitude
            result.append(h)

        return Response(result)
      
class listParkingLotAPI(APIView):
    permission_classes = (permissions.AllowAny,) 
    def get(self,request):
        try:
            listParkigLot = ParkingLot.objects.all()
            return Response(data = listParkigLot,status=200)
        except:
            return Response(status=400, data={"Error": "ParkingLot not found"})
       
