from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Hike

# Create your views here.

class AddHikeFile(APIView):
    def post(self, request):
        
        hike = Hike(1,"prova", 1,1,1,"a","b","desc", request.FILES['File'])
        hike.save()
        return Response(status = 200, data = "OK")
