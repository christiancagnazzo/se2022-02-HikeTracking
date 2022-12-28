from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from hiketracking.models import WeatherAlert

class Weather(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request):
        try:
            alerts = WeatherAlert.objects.all()
            resp = []
            for a in alerts:
                resp.append({
                    'condition': a.condition,
                    'position': [a.weather_lat, a.weather_lon],
                    'radius': a.radius
                })
            return Response(status=status.HTTP_200_OK, data=resp)
        except Exception as e:
            return Response( status=status.HTTP_500_INTERNAL_SERVER_ERROR, data=e )
    
    def post(self, request, format=None):
        try:
            print(".----")
            print(request.data)
            
            data = request.data
            condition = data["condition"]
            weather_lat = data["position"][0]
            weather_lon = data["position"][1]
            radius = data["radius"]
            WeatherAlert.objects.get_or_create(
                condition=condition, 
                weather_lat=weather_lat,
                weather_lon=weather_lon, 
                radius=radius)
            print("--")
            return Response( status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response( status=status.HTTP_500_INTERNAL_SERVER_ERROR, data=e )
    
    def delete(self, request):
        try:
            WeatherAlert.objects.all().delete()
            return Response( status=status.HTTP_200_OK)
        except Exception as e:
            return Response( status=status.HTTP_500_INTERNAL_SERVER_ERROR, data=e )
    


        
