from django.urls import path, include
from knox import views as knox_views
from .views import NewHike, HikeFile, RegisterAPI, UserList, UserDetail, LoginAPI

app_name = 'hiketracking'
urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('hike/', NewHike.as_view()),
    path('hike/file/<str:hike_id>', HikeFile.as_view()),
    path('users/', UserList.as_view()),
    path('users/<int:pk>/', UserDetail.as_view()),
    path('login/', LoginAPI.as_view(), name='login'),
    path('logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='logoutall'),

]
