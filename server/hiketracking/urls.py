from django.urls import include, path
from knox import views as knox_views

from .views import (HikeFile, Hikes, LoginAPI, NewHike, RegisterAPI,
                    UserDetail, UserList, Sessions, Huts)

app_name = 'hiketracking'
urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('hike/', NewHike.as_view()),
    path('allhikes/', Hikes.as_view()),
    path('allhuts/', Huts.as_view()),
    path('hike/file/<str:hike_id>', HikeFile.as_view()),
    path('users/', UserList.as_view()),
    path('users/<int:pk>/', UserDetail.as_view()),
    path('login/', LoginAPI.as_view(), name='login'),
    path('logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='logoutall'),
    path('sessions/', Sessions.as_view()),
]  
