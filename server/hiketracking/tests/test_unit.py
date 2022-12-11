# Create your tests here.
from django.contrib.auth import get_user_model, authenticate
from django.test import Client
from django.test import TestCase
import json
from django.contrib.auth import get_user
from unittest import mock

from hiketracking.models import Hike, Point,CustomerProfile,CustomUser
from hiketracking.tests.test_utilty import CreateTestUser

class MockResponse:
    def __init__(self):
        self.status_code = 200
 
    def json(self):
        return {
            "user":"c1",
            "min_length":0.01,
            "max_length":0.01,
            "min_time":1,
            "max_time":1,
            "min_altitude":1,
            "max_altitude":1
        }

class UserProfileUnitTest(TestCase):
    def setUp(self) -> None:
        User = get_user_model()
        self.user = User.objects.create_user(
        email='asdf@gmail.com',
        password='hiwa_asdf',
        role='local guide'
    )
        c1 = CustomUser(email = "test@test.com",role = "Testrole")
        c1.save()
        CustomerProfile.objects.create(user =c1,min_length = 0.01,max_length = 0.01,min_time = 1,max_time = 1,min_altitude = 1,max_altitude = 1)
        self.url='/hiketracking/profile/'
        return super().setUp()
   
    @mock.patch("django.test.Client.get",return_value=MockResponse())
    def test_get(self,mocked):
        self.client.force_login(self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["min_length"],0.01)
        self.assertEqual(response.json()["max_length"],0.01)
        self.assertEqual(response.json()["min_time"],1)
        self.assertEqual(response.json()["max_time"],1)
        self.assertEqual(response.json()["min_altitude"],1)
        self.assertEqual(response.json()["max_altitude"],1)

class MockHike:
    def __init__(self):
        self.status_code = 200
 
    def json(self):
        return {
            'id': 1,
            'title':'test_title',
            'length': 1,
            'expected_time': 1,
            'ascent':  1,
            'difficulty': 'hard',
            'description': "test description",
            'track_file': "test file",
        }

class recommandHikeUnitTest(TestCase):
    def setUp(self) -> None:
        User = get_user_model()
        User.objects.create_user( email='test@user.com', password='foo', role='local guide' )
        user_id = User.objects.get( email='test@user.com' )
        return super().setUp()
    
    @mock.patch("django.test.Client.get",return_value=MockHike())
    def test_wrong(self,mocked):
        c = Client()
        c.login(username="test@user.com",password="foo")
        response = c.get('/hiketracking/hikes/recommended')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["length"],1)
        self.assertEqual(response.json()["title"],'test_title')
        self.assertEqual(response.json()["expected_time"],1)
        self.assertEqual(response.json()["ascent"],1)
        self.assertEqual(response.json()["difficulty"],'hard')
        self.assertEqual(response.json()["description"],"test description")
        self.assertEqual(response.json()["track_file"],'test file')

        


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
        self.assertEqual(response.content,b'[{"id":1,'
        b'"title":"Climbing",'
        b'"length":2,"expected_time":1,'
        b'"ascent":1,'
        b'"difficulty":"easy",'
        b'"description":"",'
        b'"track_file":"",'
        b'"start_point_id":1,'
        b'"end_point_id":1,'
        b'"local_guide_id":1,'
        b'"condition":"Open",'
        b'"condition_description":" ",'
        b'"rp":[],'
        b'"start_point_lat":0.01,'
        b'"start_point_lng":0.01,'
        b'"start_point_address":"test address",'
        b'"end_point_lat":0.01,'
        b'"end_point_lng":0.01,'
        b'"end_point_address":"test address"},'
        b'{"id":2,'
        b'"title":"Trekking",'
        b'"length":3,'
        b'"expected_time":2,'
        b'"ascent":0,'
        b'"difficulty":"medium",'
        b'"description":"",'
        b'"track_file":"",'
        b'"start_point_id":1,'
        b'"end_point_id":1,'
        b'"local_guide_id":1,'
        b'"condition":"Open",'
        b'"condition_description":" ",'
        b'"rp":[],'
        b'"start_point_lat":0.01,'
        b'"start_point_lng":0.01,'
        b'"start_point_address":"test address",'
        b'"end_point_lat":0.01,'
        b'"end_point_lng":0.01,'
        b'"end_point_address":"test address"}]')
    
    @mock.patch("django.test.Client.post",return_value=MockHike())
    def test_modifyHike(self,mocked):
        c = Client()
        c.login(username="test@user.com",password="foo")
        response = c.post('/hiketracking/hikes/', {'username': 'john', 'password': 'smith'})
        self.assertEqual(response.status_code, 200)

    def test_deleteHike(self):
        c = Client()
        c.login(username="test@user.com",password="foo")
        c.delete('/hiketracking/hikes/')
        hike2 = Hike.objects.all()
        self.assertTrue(hike2.exists())














