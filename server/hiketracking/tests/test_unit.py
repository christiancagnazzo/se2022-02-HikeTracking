# Create your tests here.
from django.contrib.auth import get_user_model, authenticate
from django.test import Client
from django.test import TestCase
import json

from hiketracking.models import Hike, Point, Hut, ParkingLot, Facility, HutFacility,CustomerProfile,CustomUser
from hiketracking.tests.test_utilty import CreateTestUser

class UserProfileUnitTest(TestCase):
    def setUp(self) -> None:
        User = get_user_model()
        self.user = User.objects.create_user(
        email='asdf@gmail.com',
        password='hiwa_asdf',
        role='local guide'
    )
        self.client.force_login(self.user)
        c1 = CustomUser(email = "test@test.com",role = "Testrole")
        c1.save()
        CustomerProfile.objects.create(user =c1,min_length = 0.01,max_length = 0.01,min_time = 1,max_time = 1,min_altitude = 1,max_altitude = 1)
        self.url='/hiketracking/profile/'
        return super().setUp()

    def test_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

   


class recommandHikeUnitTest(TestCase):
    def setUp(self) -> None:
        User = get_user_model()
        User.objects.create_user( email='test@user.com', password='foo', role='smth' )
        user_id = User.objects.get( email='test@user.com' )
        return super().setUp()

    def test_wrong(self):
        c = Client()
        response = c.get('/hiketracking/hikes/recommended')
        self.assertEqual(response.status_code, 401)

        


class modifyAndDeleteHikeUnitTest(TestCase):
    def setUp(self) -> None:
        User = get_user_model()
        User.objects.create_user(email='test@user.com', password='foo', role='smth')
        user_id = User.objects.get(email='test@user.com')
        p1 = Point(latitude=0.01, longitude=0.01, province="test province", village="test village",address="test address")
        p1.save()
        Hike.objects.create(title='Climbing', length=2, expected_time=1, ascent=1,difficulty='easy',start_point=p1,end_point=p1,local_guide=user_id)
        Hike.objects.create(title='Trekking', length=3, expected_time=2, ascent=0,difficulty='medium',start_point=p1,end_point=p1,local_guide=user_id) 
        return super().setUp()
    
    def test_Backfround(self):
        c = Client()
        c.login(username="test@user.com",password="foo")
        response = c.get('/hiketracking/hikes/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content,b'''[{"id":1,"title":"Climbing","length":2,"expected_time":1,"ascent":1,"difficulty":"easy","description":"","track_file":"","start_point_id":1,"end_point_id":1,"local_guide_id":1,"condition":"Open","condition_description":" ","rp":[],"start_point_lat":0.01,"start_point_lng":0.01,"start_point_address":"test address","end_point_lat":0.01,"end_point_lng":0.01,"end_point_address":"test address"},{"id":2,"title":"Trekking","length":3,"expected_time":2,"ascent":0,"difficulty":"medium","description":"","track_file":"","start_point_id":1,"end_point_id":1,"local_guide_id":1,"condition":"Open","condition_description":" ","rp":[],"start_point_lat":0.01,"start_point_lng":0.01,"start_point_address":"test address","end_point_lat":0.01,"end_point_lng":0.01,"end_point_address":"test address"}]''')
        
    def test_modifyHike(self):
        c = Client()
        c.login(username="test@user.com",password="foo")
        response = c.post('/hiketracking/hikes/', {'username': 'john', 'password': 'smith'})
        self.assertEqual(response.status_code, 405)

    def test_deleteHike(self):
        c = Client()
        c.login(username="test@user.com",password="foo")
        c.delete('/hiketracking/hikes/')
        hike2 = Hike.objects.all()
        self.assertTrue(hike2.exists())


