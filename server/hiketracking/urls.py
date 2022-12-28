from django.urls import path
from knox import views as knox_views

from .views import (HikeFile, Hikes, LoginAPI, RegisterAPI, HikesHutWorker,
                    Facilities, AccountConfirmation, HutHikeView,
                    UserDetail, UserList, Sessions, Huts, ActivateAccount,
                    ParkingLotAPI, Recommended, Profile,Hike_, Weather, HutFile
                    ,Hiking)

app_name = 'hiketracking'
urlpatterns = [
    path( 'register/', RegisterAPI.as_view(), name='register' ),
    path( 'hikes/', Hikes.as_view() ),
    path( 'hikes/<str:title>', Hike_.as_view() ),
    path( 'hike/file/<str:hike_id>', HikeFile.as_view() ),
    path( 'users/', UserList.as_view() ),
    path( 'users/<int:pk>/', UserDetail.as_view() ),
    path( 'login/', LoginAPI.as_view(), name='login' ),
    path( 'logout/', knox_views.LogoutView.as_view(), name='logout' ),
    path( 'logoutall/', knox_views.LogoutAllView.as_view(), name='logoutall' ),
    path( 'sessions/', Sessions.as_view() ),
    path( 'activate/<slug:uidb64>/<slug:token>/', ActivateAccount.as_view(), name='activate' ),
    path( 'parkingLots/', ParkingLotAPI.as_view() ),
    path( 'hut/', Huts.as_view() ),
    path( 'HutHikeView/', HutHikeView.as_view() ),
    path( 'facilities/', Facilities.as_view() ),
    path( 'users/validate/', AccountConfirmation.as_view() ),
    path( 'hikes/recommended/', Recommended.as_view() ),
    path( 'profile/', Profile.as_view() ),
    path( 'worker/hikes/', HikesHutWorker.as_view() ),
    path( 'platformmanager/weatheralert/', Weather.as_view()),
    path( 'hiking/<int:pk>/', Hiking.as_view() ),
    path( 'hut/file/<str:hut_id>', HutFile.as_view() ),
]
