import geopy.distance
from django.http import FileResponse
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from hiketracking.models import Hike, Point, HikeReferencePoint, CustomUser, CustomerProfile
from hiketracking.utility import get_province_and_village


class HikeFile( APIView ):
    def get(self, request, hike_id):
        try:
            track = Hike.objects.get( id=hike_id ).track_file
            response =  FileResponse( open( str( track ), 'rb' ) )
            response['Content-Language'] = 'attachment; filename=' + track.name
            return response
        except Exception as e:
            print( e )
            return Response( status=status.HTTP_500_INTERNAL_SERVER_ERROR )

    def put(self, request, hike_id):
        try:
            hikeFile = request.FILES['File']
        except Exception :
            Hike.objects.filter( id=hike_id ).delete()
            return Response( status=status.HTTP_400_BAD_REQUEST, data={"Error": "File Requested"} )

        try:
            hike = Hike.objects.get( id=hike_id )
            hike.track_file = hikeFile
            hike.save()
            return Response( status=status.HTTP_200_OK )
        except Exception :
            Hike.objects.filter( id=hike_id ).delete()
            return Response( status=status.HTTP_400_BAD_REQUEST, data={"Error": "Hike not found"} )


class Hikes( APIView ):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):

        filters = request.GET.get( 'filters', None )

        hikes = self.hikeView( filters, request )

        around = request.GET.get( 'around', None )

        if filters and around:
            filtered_hikes = []
            fields = around.split( "-" )
            radius = fields[2]
            input_coordinates = (fields[0], fields[1])

            for h in hikes:
                refer_p = Point.objects.get( id=h['start_point_id'] )
                hike_coordinates = (refer_p.latitude, refer_p.longitude)
                distance = geopy.distance.geodesic(
                    input_coordinates, hike_coordinates ).km

                if distance <= float( radius ):
                    filtered_hikes.append( h )

            hikes = filtered_hikes

        result = {}
        for h in hikes:
            result = HikeReferencePoint.objects.filter(
                hike_id=h['id'] ).values()
            reference_list = []
            for r in result:
                refer_p = Point.objects.get( id=r['point_id'] )
                reference_list.append( {
                    'reference_point_lat': refer_p.latitude,
                    'reference_point_lng': refer_p.longitude,
                    'reference_point_address': refer_p.address} )

            h['rp'] = reference_list

            startP = Point.objects.get( id=h['start_point_id'] )
            endP = Point.objects.get( id=h['end_point_id'] )

            h['start_point_lat'] = startP.latitude
            h['start_point_lng'] = startP.longitude
            h['start_point_address'] = startP.address
            h['end_point_lat'] = endP.latitude
            h['end_point_lng'] = endP.longitude
            h['end_point_address'] = endP.address

        return Response( hikes, status=status.HTTP_200_OK )

    def hikeView(self, filters, request):
        if filters:
            minLength = request.GET.get( 'minLength', None )
            maxLength = request.GET.get( 'maxLength', None )
            minTime = request.GET.get( 'minTime', None )
            maxTime = request.GET.get( 'maxTime', None )
            minAscent = request.GET.get( 'minAscent', None )
            maxAscent = request.GET.get( 'maxAscent', None )
            difficulty = request.GET.get( 'difficulty', None )
            province = request.GET.get( 'province', None )
            village = request.GET.get( 'village', None )

            hikes = Hike.objects.all()

            if minLength:
                hikes = hikes.filter( length__gte=minLength )
            if maxLength:
                hikes = hikes.filter( length__lte=maxLength )
            if minTime:
                hikes = hikes.filter( expected_time__gte=minTime )
            if maxTime:
                hikes = hikes.filter( expected_time__lte=maxTime )
            if minAscent:
                hikes = hikes.filter( ascent__gte=minAscent )
            if maxAscent:
                hikes = hikes.filter( ascent__lte=maxAscent )
            if difficulty:
                hikes = hikes.filter( difficulty=difficulty )

            if province:
                inner_query = Point.objects.filter( province=province )
                hikes = hikes.filter( start_point__in=inner_query )

            if village:
                inner_query = Point.objects.filter( village=village.lower().capitalize() )
                hikes = hikes.filter( start_point__in=inner_query )

            hikes = hikes.values()

        else:
            hikes = Hike.objects.values()
        return hikes

    def put(self, request, format=None):
        user_id = CustomUser.objects.get( email=request.user )
        data = request.data
        try:
            
            hike = Hike.objects.get(title=data['title'])
            hike.delete()
            hike.track_file.delete()
        except Exception as e:
            print(e)
        finally:
            try:
                sp = get_province_and_village(
                    data['start_point_lat'], data['start_point_lng'] )
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
                    data['end_point_lat'], data['end_point_lng'] )
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
                    end_point=end_point[0] )

                hike.save()

                for rp in data['rp_list']:
                    rp_cp = get_province_and_village(
                        rp['reference_point_lat'], rp['reference_point_lng'] )
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

                    rp_hike = HikeReferencePoint.objects.get_or_create(
                        hike=hike,
                        point=ref_point[0]
                    )
                    rp_hike.save()

                return Response( status=status.HTTP_200_OK, data={"hike_id": hike.id} )
            except Exception as e:
                print( e )
                return Response( status=status.HTTP_400_BAD_REQUEST, data={"Error": str( e )} )

class Hike_( APIView ):
    def get(self, request,title):
        
        try:
            hike = Hike.objects.filter(title=title).values()
            for h in hike: 
                result = HikeReferencePoint.objects.filter(
                    hike_id=h['id'] ).values()
                reference_list = []
                for r in result:
                    refer_p = Point.objects.get( id=r['point_id'] )
                    reference_list.append( {
                        'reference_point_lat': refer_p.latitude,
                        'reference_point_lng': refer_p.longitude,
                        'reference_point_address': refer_p.address} )

                h['rp'] = reference_list

                startP = Point.objects.get( id=h['start_point_id'] )
                endP = Point.objects.get( id=h['end_point_id'] )

                h['start_point_lat'] = startP.latitude
                h['start_point_lng'] = startP.longitude
                h['start_point_address'] = startP.address
                h['end_point_lat'] = endP.latitude
                h['end_point_lng'] = endP.longitude
                h['end_point_address'] = endP.address
                print(h)
                return Response(status=status.HTTP_200_OK, data={"hike" : h})
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, title):
        try:
            hike = Hike.objects.get(title=title)
            hike.delete()
            hike.track_file.delete()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)

class Recommended( APIView ):

    def get(self, request):
        user_id = request.user.id

        try:
            profile = CustomerProfile.objects.get( user=user_id )
            hikes = Hike.objects.all() \
                .filter( length__gte=profile.min_length ) \
                .filter( length__lte=profile.max_length ) \
                .filter( expected_time__gte=profile.min_time ) \
                .filter( expected_time__lte=profile.max_time ) \
                .filter( ascent__gte=profile.min_altitude ) \
                .filter( ascent__lte=profile.max_altitude ) \
                .filter( difficulty=profile.difficulty ) \
                .values()

            result = {}
            for h in hikes:
                result = HikeReferencePoint.objects.filter( hike_id=h['id'] ).values()
                reference_list = []
                for r in result:
                    refer_p = Point.objects.get( id=r['point_id'] )
                    reference_list.append( {
                        'reference_point_lat': refer_p.latitude,
                        'reference_point_lng': refer_p.longitude,
                        'reference_point_address': refer_p.address} )

                h['rp'] = reference_list

                startP = Point.objects.get( id=h['start_point_id'] )
                endP = Point.objects.get( id=h['end_point_id'] )

                h['start_point_lat'] = startP.latitude
                h['start_point_lng'] = startP.longitude
                h['start_point_address'] = startP.address
                h['end_point_lat'] = endP.latitude
                h['end_point_lng'] = endP.longitude
                h['end_point_address'] = endP.address

            return Response( hikes, status=status.HTTP_200_OK )

        except Exception:
            return Response( status=status.HTTP_400_BAD_REQUEST )
