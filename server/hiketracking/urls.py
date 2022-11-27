from django.urls import include, path
from knox import views as knox_views

from .views import (HikeFile, Hikes, LoginAPI, RegisterAPI, Huts, Facilities,
                    UserDetail, UserList, Sessions, Huts, ActivateAccount, ListParkingLotAPI)

app_name = 'hiketracking'
urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('hikes/', Hikes.as_view()),
    path('huts/', Huts.as_view()),
    path('hike/file/<str:hike_id>', HikeFile.as_view()),
    path('users/', UserList.as_view()),
    path('users/<int:pk>/', UserDetail.as_view()),
    path('login/', LoginAPI.as_view(), name='login'),
    path('logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='logoutall'),
    path('sessions/', Sessions.as_view()),
    path('activate/<slug:uidb64>/<slug:token>/', ActivateAccount.as_view(), name='activate'),
    path('parkingLots/', ListParkingLotAPI.as_view()),
    path('hut/', Huts.as_view()),
    path('facilities/', Facilities.as_view()),
]
