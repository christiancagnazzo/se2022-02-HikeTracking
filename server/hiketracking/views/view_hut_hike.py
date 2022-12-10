from rest_framework import permissions
from rest_framework.generics import ListCreateAPIView
from hiketracking.models import HutHike, HutWorker, Hike
from hiketracking.serilizers import HikeHutSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

class HutHikeView( ListCreateAPIView ):
    permission_classes = (permissions.AllowAny,)
    serializer_class = HikeHutSerializer
    queryset = HutHike.objects.all()


class HikesHutWorker(APIView):
    #permission_classes = (permissions.AllowAny,)
    def get(self, request):
        user_id = request.user.id
        
        try:
            hut = HutWorker.objects.get(hutworker_id=user_id)
            hike_ids = HutHike.objects.filter(hut_id=hut.id)
          
            result = []
            for h in hike_ids:
                hike = Hike.objects.filter(id=h.hike.id).values()[0]
                result.append(hike)

            return Response(status=status.HTTP_200_OK, data=result)

        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        print(request.data)
        if request.data and \
            'condition' in request.data and \
            'condition_description' in request.data and \
            'hike_id' in request.data:
        
            try:
                hike = Hike.objects.get(id=request.data["hike_id"])
                hike.condition = request.data["condition"]
                hike.condition_description = request.data["condition_description"]
                hike.save()
                return Response(status=status.HTTP_200_OK)

            except:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

