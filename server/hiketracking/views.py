from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Hike, HikeReferencePoint

# Create your views here.

class NewHike(APIView):
    def post(self, request):

        try:
            data = request.data
            hike = Hike.objects.create(
                title=data['title'], 
                length=data['length'],
                expected_time=data['expected_time'],
                ascent=data['ascent'],
                difficulty=data['difficulty'],
                start_point_lat=data['start_point_lat'],
                start_point_lng=data['start_point_lng'],
                start_point_address=data['start_point_address'],
                end_point_lat=data['end_point_lat'],
                end_point_lng=data['end_point_lng'],
                end_point_address=data['end_point_address'],
                description=data['description'])
            
            
            hike.save()

            for rp in data['rp_list']:
                
                rp_hike = HikeReferencePoint.objects.create(
                    hike = hike,
                    reference_point_lan=rp['lat'],
                    reference_point_lng=rp['lng'],
                    reference_point_address=rp['address']
                )
                rp_hike.save()
                

            return Response(status = 200, data = {"hike_id": hike.id})
        except Exception as e:
            Hike.objects.filter(id=hike.id).delete()
            HikeReferencePoint.objects.filter(hike=hike).delete()
            return Response(status = 400, data={"Error": str(e)})

class HikeFile(APIView):
    def put(self, request, hike_id):
        try:
            file = request.FILES['File']
        except:
            return Response(status = 400, data = {"Error": "File Requested"})
        
        try:
            hike = Hike.objects.get(id=hike_id)
            hike.track_file = file
            hike.save()
            return Response(status = 200)
        except:
            return Response(status = 400, data = {"Error": "Hike not found"})
    