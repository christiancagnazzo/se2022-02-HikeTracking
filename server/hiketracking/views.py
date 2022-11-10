from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, permissions, viewsets
from .serializers import UserSerializer, RegisterSerializer
from .models import Hike, CustomUser, HikeReferencePoint

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
    

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = CustomUser.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
        })

# class LoginAPI(KnoxLoginView):
#     permission_classes = (permissions.AllowAny,)
#
#     def post(self, request, format=None):
#         serializer = AuthTokenSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         login(request, user)
#         return super(LoginAPI, self).post(request, format=None)
