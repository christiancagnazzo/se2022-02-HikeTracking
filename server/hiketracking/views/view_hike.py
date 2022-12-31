import geopy.distance
from django.http import FileResponse
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum
from hiketracking.models import Hike, Point, HikeReferencePoint, CustomUser, CustomerProfile, UserHikeLog
from hiketracking.serilizers import HikeCounterIncludeSerializer, UserHikeLogSerializer, PointSerializerWithaddress
from hiketracking.utility import get_province_and_village, findcoordinateInGpx


class HikeFile( APIView ):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, hike_id):
        try:
            track = Hike.objects.get( id=hike_id ).track_file
            response = FileResponse( open( str( track ), 'rb' ) )
            response['Content-Language'] = 'attachment; filename=' + track.name
            return response
        except Exception as e:
            print( e )
            return Response( status=status.HTTP_500_INTERNAL_SERVER_ERROR )

    def put(self, request, hike_id):
        try:
            hikeFile = request.FILES['File']
        except Exception:
            Hike.objects.filter( id=hike_id ).delete()
            return Response( status=status.HTTP_400_BAD_REQUEST, data={"Error": "File Requested"} )

        try:
            hike = Hike.objects.get( id=hike_id )
            hike.track_file = hikeFile
            hike.save()
            return Response( status=status.HTTP_200_OK )
        except Exception:
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
            hike = Hike.objects.get( title=data['title'] )
            hike.track_file.delete()
            hike.delete()
        except:
            pass

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

                rp_hike[0].save()

            return Response( status=status.HTTP_200_OK, data={"hike_id": hike.id} )
        except Exception as e:
            print( e )
            return Response( status=status.HTTP_400_BAD_REQUEST, data={"Error": str( e )} )


class Hike_( APIView ):
    def get(self, request, title):

        try:
            hike = Hike.objects.filter( title=title ).values()
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

                return Response( status=status.HTTP_200_OK, data={"hike": h} )
        except Exception as e:
            print( e )
            return Response( status=status.HTTP_404_NOT_FOUND )

    def delete(self, request, title):
        try:
            hike = Hike.objects.get( title=title )
            hike.track_file.delete()
            hike.delete()
            return Response( status=status.HTTP_200_OK )
        except Exception as e:
            return Response( status=status.HTTP_404_NOT_FOUND )


class Recommended( APIView ):

    def get(self, request):
        user_id = request.user.id

        try:
            profile = CustomerProfile.objects.get( user=user_id )
            hikes = Hike.objects.all()

            if profile.min_length:
                hikes = hikes.filter( length__gte=profile.min_length )
            if profile.max_length:
                hikes = hikes.filter( length__lte=profile.max_length )
            if profile.min_time:
                hikes = hikes.filter( expected_time__gte=profile.min_time )
            if profile.max_time:
                hikes = hikes.filter( expected_time__lte=profile.max_time )
            if profile.min_altitude:
                hikes = hikes.filter( ascent__gte=profile.min_altitude )
            if profile.max_altitude:
                hikes = hikes.filter( ascent__lte=profile.max_altitude )
            if profile.difficulty:
                hikes = hikes.filter( difficulty=profile.difficulty )

            hikes = hikes.values()

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

        except Exception as e:
            print( e )
            return Response( status=status.HTTP_400_BAD_REQUEST )


class Hiking( APIView ):
    permission_classes = (permissions.AllowAny,)
    serializer_class = HikeCounterIncludeSerializer

    def get(self, request):
        try:
            # don't forget to test it christian
            user = CustomUser.objects.get( request.user.id )
            user_log = UserHikeLog.objects.filter( user=user ).values()
            display_hikes = []
            filters = request.GET.get( 'done', None )
            for log in user_log:

                hike = Hike.objects.get( id=log['hike_id'] )
                hike.counter = log['counter']
                if filters == "true" and hike.end_point.id == log['point_id']:
                    display_hikes.append( self.serializer_class( hike ).data )

                elif filters == "false" and hike.end_point.id != log['point_id']:
                    display_hikes.append( self.serializer_class( hike ).data )
            #    remove repeated hikes

            return Response( data=display_hikes,
                             status=status.HTTP_200_OK )
        except Exception as e:
            print( e )
            return Response( data=e, status=status.HTTP_404_NOT_FOUND )

    def checkStartVslidation(self):
        if self.userHikelogSerializer.is_valid():
            self.userHikelogSerializer.save()
            return Response( data=self.userHikelogSerializer.data,
                             status=status.HTTP_200_OK )
        else:
            return Response( data=self.userHikelogSerializer.errors,
                             status=status.HTTP_400_BAD_REQUEST )

    def startHikeSerilizer(self, hike, user):
        userHikeLogCount = UserHikeLog.objects.filter(
            hike=hike,
            user=user ).count() + 1
        userHikelogSerializer = UserHikeLogSerializer( data={
            'user': user.id,
            'hike': hike.id,
            'counter': userHikeLogCount,
            'point': hike.start_point.id
        } )
        return userHikelogSerializer

    def post(self, request):
        try:
            filters = request.data.get( 'state', None )
            data = request.data
            hike = Hike.objects.get( id=data['hike'] )
            user = CustomUser.objects.get( id=data['user'] )
            # user = CustomUser.objects.get( request.user.id )
            if filters == 'start':
                self.userHikelogSerializer = self.startHikeSerilizer( hike, user )
                return self.checkStartVslidation()
            elif filters == 'reachpoint':
                pointData = data['point']
                try:
                    point = Point.objects.get( latitude=pointData['latitude'],
                                               longitude=pointData['longitude'] )
                    self.userHikelogSerializer = UserHikeLogSerializer( data={
                        'user': user.id,
                        'hike': hike.id,
                        'counter': data['counter'],
                        'point': point.id
                    } )
                    if self.userHikelogSerializer.is_valid():
                        self.userHikelogSerializer.save()
                        return Response( data=self.userHikelogSerializer.data, status=status.HTTP_200_OK )
                    else:
                        return Response( status=status.HTTP_400_BAD_REQUEST )
                except Exception as e:
                    return self.createPointHandler( pointData, hike, user, data )
            else:
                return Response( status=status.HTTP_400_BAD_REQUEST )

        except Exception as e:
            return Response( status=status.HTTP_404_NOT_FOUND )

    def createPointHandler(self, pointData, hike, user, data):

        if findcoordinateInGpx(
                lat=pointData['latitude'],
                long=pointData['longitude'],
                address=hike.track_file
        ):

            info = get_province_and_village( pointData['latitude'], pointData['longitude'], True )
            pointserilizer = PointSerializerWithaddress( data={
                'latitude': pointData['latitude'],
                'longitude': pointData['longitude'],
                'province': info['province'],
                'village': info['village'],
                'address': info['address'],
                'type': "none"

            } )
            if pointserilizer.is_valid():
                pointserilizer.save()
                self.userHikelogSerializer = UserHikeLogSerializer( data={
                    'user': user.id,
                    'hike': hike.id,
                    'counter': data['counter'],
                    'point': pointserilizer.data['id']
                } )
                if self.userHikelogSerializer.is_valid():
                    self.userHikelogSerializer.save()
                    return Response( data=self.userHikelogSerializer.data, status=status.HTTP_200_OK )
                else:
                    return Response( status=status.HTTP_400_BAD_REQUEST )
            else:
                return Response( status=status.HTTP_400_BAD_REQUEST )
        else:
            return Response( data={"massege": "the latitude and longitude are not on the track "},
                             status=status.HTTP_400_BAD_REQUEST )

    def put(self, request):
        try:
            filters = request.data.get( 'state', None )
            data = request.data
            hike = Hike.objects.get( id=data['hike'] )
            user = CustomUser.objects.get( request.user.id )
            if filters == 'end':
                return self.endValidation( data, hike, user )
            else:
                return Response( status=status.HTTP_400_BAD_REQUEST )
        except Exception as e:
            return Response( status=status.HTTP_400_BAD_REQUEST )

    def endValidation(self, data, hike, user):
        if UserHikeLog.objects.filter( user=user,
                                       hike=hike,
                                       counter=data['counter'] ).exists():
            userHikelogSerializer = self.endSerilizer( data, hike, user )
            if userHikelogSerializer.is_valid():
                if not self.endHikePointExsistes( data, hike, user ):
                    userHikelogSerializer.save()
                    return Response( data=userHikelogSerializer.data,
                                     status=status.HTTP_200_OK )
                else:
                    respData, responseData = self.endOutputSerilizer( data, hike, user )
                    if responseData.is_valid():
                        return Response( data={**responseData.data, "timestamp": str( respData.timestamp )},
                                         status=status.HTTP_200_OK )
                    else:
                        return Response( status=status.HTTP_400_BAD_REQUEST )
            else:
                return Response( status=status.HTTP_400_BAD_REQUEST )
        else:
            return Response( status=status.HTTP_400_BAD_REQUEST )

    def endOutputSerilizer(self, data, hike, user):
        respData = UserHikeLog.objects.filter(
            user=user,
            hike=hike,
            counter=data['counter'],
            point=hike.end_point.id ).all()[0]
        responseData = UserHikeLogSerializer(
            data={
                'user': respData.user.id,
                'hike': respData.hike.id,
                'counter': respData.counter,
                'point': respData.point.id,
                'timestamp': str( respData.timestamp )

            } )
        return respData, responseData

    def endHikePointExsistes(self, data, hike, user):
        UserHikeLog.objects.filter( user=user,
                                    hike=hike,
                                    counter=data['counter'],
                                    point=hike.end_point.id ).exists()

    def endSerilizer(self, data, hike, user):
        userHikelogSerializer = UserHikeLogSerializer( data={
            'user': user.id,
            'hike': hike.id,
            'counter': data['counter'],
            'point': hike.end_point.id
        } )
        return userHikelogSerializer


class HikePicture( APIView ):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, hike_id):
        try:
            picture = Hike.objects.get( id=hike_id ).picture
            response = FileResponse( open( str( picture ), 'rb' ) )
            response['Content-Language'] = 'attachment; filename=' + picture.name
            return response
        except Exception as e:
            print( e )
            return Response( status=status.HTTP_500_INTERNAL_SERVER_ERROR )

    def put(self, request, hike_id):
        try:
            hikePicture = request.FILES['Picture']
            hike = Hike.objects.get( id=hike_id )
            hike.picture = hikePicture
            hike.save()
            return Response( status=status.HTTP_200_OK )

        except Exception as e:
            print( e )
            return Response( status=status.HTTP_400_BAD_REQUEST, data={"Error": "Hike not found"} )


class Statistics(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        user_id = CustomUser.objects.get( email=request.user )
        statistics = {}

        finished_log = UserHikeLog.objects.filter(user_id=user_id).filter(end=True)
        finished_hikes = Hike.objects.filter(id__in=finished_log)
        
        statistics['finished_hikes'] = finished_log.count()

        km_tot = 0
        time_spent = {}

        for f in finished_log:

            # Total Km
            km_tot += Hike.objects.get(id=f.hike.id).length

            # Longest / Shortest (hours)
            logs = UserHikeLog.objects\
                .filter(user_id=user_id)\
                .filter(hike_id=f.hike) \
                .filter(counter=f.counter)\
                .order_by('timestamp')
            start = logs.first()
            end = logs.last()
            time = end.timestamp - start.timestamp
            time_spent[(f.hike, f.counter)] = time

        statistics['km_walked'] = km_tot

        max_hike_time = (max(time_spent, key=time_spent.get), max(time_spent.values()))
        min_hike_time = (min(time_spent, key=time_spent.get), min(time_spent.values()))
        statistics['longest_hike_hours'] = {'title': max_hike_time[0][0].title, 'time': str(max_hike_time[1])}
        statistics['shortest_hike_hours'] = {'title': min_hike_time[0][0].title, 'time': str(min_hike_time[1])}
                
        hike_length =  finished_hikes.order_by('length')  
        longest_hike = hike_length.first()
        shortest_hike = hike_length.last()
        statistics['longest_hike_km'] = {'title': longest_hike.title, 'length': longest_hike.length}
        statistics['shortest_hike_km'] = {'title': shortest_hike.title, 'length': shortest_hike.length}


        return Response(status=status.HTTP_200_OK, data=statistics)


"""
total nr of hikes finished ---------DONE
total nr of kms walked  ---------DONE
highest altitude reached
highest altitude range done
longest (km) hike completed  ---------DONE
longest (hours) hike completed  ---------DONE
shortest (km) hike completed  ---------DONE
shortest (hours) hike completed  ---------DONE
average pace (min/km)
fastest paced hike (min/km)
average vertical ascent speed (m/hour)
"""