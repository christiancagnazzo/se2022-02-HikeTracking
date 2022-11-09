from django.urls import path
from .views import AddHikeFile

app_name = 'hiketracking'
urlpatterns = [
    path('hike/', AddHikeFile.as_view()),
]