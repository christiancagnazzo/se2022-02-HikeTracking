<<<<<<< HEAD
from django.urls import path
from .views import NewHike, HikeFile

app_name = 'hiketracking'
urlpatterns = [
    path('hike/', NewHike.as_view()),
    path('hike/file/<str:hike_id>', HikeFile.as_view()),
]
=======
from django.urls import path, include

from .views import AddHikeFile, RegisterAPI

app_name = 'hiketracking'
urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('hike/', AddHikeFile.as_view()),

]
>>>>>>> 89a529f (Fixed merged commits)
