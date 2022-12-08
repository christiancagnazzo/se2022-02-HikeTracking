from rest_framework import permissions, status
from rest_framework.generics import ListAPIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
import geopy.distance
from hiketracking.models import Hut, HutFacility, Point, Facility
from hiketracking.serilizers.serilizer_huts import HuntsSerializer, FacilitySerializer
from hiketracking.serilizers.serilizer_point import PointSerializer
from hiketracking.utility import InsertPoint


class Huts( ListCreateAPIView ):
    permission_classes = (permissions.AllowAny,)
    serializer_class = HuntsSerializer

    queryset = Hut.objects.all()

    # needs more work
    # def get_queryset(self):
    #     huts = Hut.objects.all()
    #     filters = self.request.GET.get( 'filters', None )
    #     if filters:
    #         name = self.request.GET.get( 'name', None )
    #         nbeds = self.request.GET.get( 'nbeds', None )
    #         fee = self.request.GET.get( 'fee', None )
    #         services = self.request.GET.get( 'services', None )
    #         if name:
    #             huts = huts.filter( name=name )
    #         if nbeds:
    #             huts = huts.filter( n_beds__gte=nbeds )
    #         if fee:
    #             huts = huts.filter( fee__lte=fee )
    #         if services:
    #             services_list = services.split( "-" )
    #             hl = HutFacility.objects.filter( facility_id__in=services_list ).values( 'hut_id' )
    #             huts_list = []
    #             for h in hl:
    #                 huts_list.append( h['hut_id'] )
    #             huts = Hut.objects.filter( id__in=huts_list )
    #         for h in huts:
    #
    #             point = Point.objects.get( id=h.point_id )
    #             h.app
    #             # h['lat'] = point.latitude
    #             # h['lon'] = point.longitude
    #             # h['address'] = point.address
    #
    #             all_facilities = HutFacility.objects.filter( hut_id=h.id )
    #         huts.prefetch_related( all_facilities ).all()
    #
    #     return huts

    def get(self, request, *args, **kwargs):
        RADIUS = 5

        try:

            filters = request.GET.get( 'filters', None )

            if filters:
                name = request.GET.get( 'name', None )
                nbeds = request.GET.get( 'nbeds', None )
                fee = request.GET.get( 'fee', None )
                services = request.GET.get( 'services', None )
                start_lat = request.GET.get( 'start_lat', None )
                start_lon = request.GET.get( 'start_lon', None )

                huts = Hut.objects.all()
                    
                if name:
                    huts = huts.filter( name=name )
                if nbeds:
                    huts = huts.filter( n_beds__gte=nbeds )
                if fee:
                    huts = huts.filter( fee__lte=fee )
                if services:
                    services_list = services.split( "-" )
                    hl = HutFacility.objects.filter( facility_id__in=services_list ).values( 'hut_id' )
                    huts_list = []
                    for h in hl:
                        huts_list.append( h['hut_id'] )
                    huts = Hut.objects.filter( id__in=huts_list )

                huts = huts.values()

            else:
                huts = Hut.objects.values()
            
            if filters and start_lat and start_lon:
                filtered_huts = []
                input_coordinates = (start_lat, start_lon)

                for h in huts:
                    refer_p = Point.objects.get( id=h['point_id'] )
                    huts_coordinates = (refer_p.latitude, refer_p.longitude)
                    distance = geopy.distance.geodesic(
                        input_coordinates, huts_coordinates ).km

                    if distance <= float( RADIUS ):
                        filtered_huts.append( h )

                huts = filtered_huts
                
            result = []

            for h in huts:
                point = Point.objects.get( id=h['point_id'] )
                h['lat'] = point.latitude
                h['lon'] = point.longitude
                h['address'] = point.address

                facilities_list = []
                all_facilities = HutFacility.objects.filter( hut_id=h['id'] )
                for f in all_facilities:
                    fac_name = Facility.objects.get( id=f.facility_id ).name
                    facilities_list.append( fac_name )

                h['services'] = facilities_list

                result.append( h )

            return Response( result, status=status.HTTP_200_OK )
        except Exception as e:
            print( e )
            return Response( status=status.HTTP_500_INTERNAL_SERVER_ERROR )

    def post(self, request, *args, **kwargs):
        pointSerializer = PointSerializer( data=request.data['position'] )

        if pointSerializer.is_valid():
            point = InsertPoint( pointSerializer, 'hut' )
            serializer = self.serializer_class( data={**request.data, 'point': point.id} )
            if serializer.is_valid():
                hut = serializer.save()
                for service in request.data['services']:
                    try:
                        obj, created = Facility.objects.get_or_create( name=service )
                        HutFacility.objects.get_or_create( hut=hut, facility=obj )
                    except Exception as exc:
                        print( exc )
                        return Response( data={'message': 'error in crating the services', 'exception': exc},
                                         status=status.HTTP_400_BAD_REQUEST )
                return Response( serializer.data, status=status.HTTP_200_OK )
            else:
                return Response( serializer.errors, status=status.HTTP_400_BAD_REQUEST )
        else:
            return Response( pointSerializer.errors, status=status.HTTP_400_BAD_REQUEST )


class Facilities( ListAPIView ):
    permission_classes = (permissions.AllowAny,)
    queryset = Facility.objects.all().values()
    serializer_class = FacilitySerializer
