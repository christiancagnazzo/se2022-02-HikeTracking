from django.contrib.auth import login
from django.shortcuts import render
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
import json

from .models import CustomUser, Hike, HikeReferencePoint
from .serializers import (AuthTokenCustomSerializer, RegisterSerializer,
                          UserSerializer)

# Create your views here.

class NewHike(APIView):
    #permission_classes = (permissions.AllowAny,)

    def post(self, request):
        user_id = CustomUser.objects.get(email=request.user)
        print(user_id)

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
                description=data['description'],
                local_guide=user_id)
            
            
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
           # Hike.objects.filter(id=hike.id).delete()
           # HikeReferencePoint.objects.filter(hike=hike).delete()
            return Response(status = 400, data={"Error": str(e)})

class HikeFile(APIView):
    #permission_classes = (permissions.AllowAny,)
    
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
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenCustomSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        result = super(LoginAPI, self).post(request, format=None)
        return Response(status=200, data = { "user": user.email, "role": user.role.lower().replace(" ",""), "token": result.data['token']})
        
        
class Hikes(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        result = {}
        hikes = Hike.objects.values()
        for h in hikes:
            result = HikeReferencePoint.objects.filter(hike_id=h['id']).values()
            list = []
            for r in result:
                list.append(r)
            
            h['rp'] = list

            try:
                with open(h['track_file'], 'r') as f:
                    file_data = f.read()
                    h['file'] = file_data
                    
            except:
                return Response(status=500)
                
        return Response(hikes)