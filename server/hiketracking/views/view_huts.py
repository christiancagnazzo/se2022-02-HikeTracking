from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from hiketracking.models import Hut, HutFacility, Point, Facility
from hiketracking.serializers import HuntsSerializer, PointSerializer, FacilitySerializer
from hiketracking.utility import InsertPoint
from rest_framework.generics import ListAPIView


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

                h['services'] = facilities_list

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


class Facilities(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Facility.objects.all().values()
    serializer_class = FacilitySerializer
