from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from hiketracking.models import ParkingLot, Point
from hiketracking.serilizers.serilizer_parkinglot import PorkingLotSerializer
from hiketracking.serilizers.serilizer_point import PointSerializer
from hiketracking.utility import InsertPoint


class ParkingLotAPI( APIView ):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PorkingLotSerializer

    def get(self, request):
        try:
            result = []
            listParkigLot = ParkingLot.objects.all().values()
            for p in listParkigLot:
                point = Point.objects.get( id=p['point_id'] )
                p['lat'] = point.latitude
                p['lon'] = point.longitude
                p['address'] = point.address
                result.append( p )

            return Response( result )
        except Exception as e:
            return Response( status=status.HTTP_500_INTERNAL_SERVER_ERROR, data=e )

    def post(self, request):
        pointSerializer = PointSerializer( data=request.data['position'] )
        if pointSerializer.is_valid():
            point = InsertPoint( pointSerializer, 'parking_lot' )
            serializer = self.serializer_class( data={**request.data, 'point': point.id} )
            if serializer.is_valid():
                serializer.save()
                return Response( serializer.data, status=status.HTTP_201_CREATED )
            return Response( serializer.errors, status=status.HTTP_400_BAD_REQUEST )
        else:
            return Response( pointSerializer.errors, status=status.HTTP_400_BAD_REQUEST )
