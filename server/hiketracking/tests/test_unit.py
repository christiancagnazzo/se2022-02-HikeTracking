# Create your tests here.
from django.contrib.auth import get_user_model
from django.test import Client
from django.test import TestCase
from unittest import mock
from hiketracking.models import Hike, Point,CustomerProfile,CustomUser

RESPONSE_UTIL = b'[{"id":1,'\
        b'"title":"Climbing",'\
        b'"length":2,"expected_time":1,'\
        b'"ascent":1,'\
        b'"difficulty":"easy",'\
        b'"description":"",'\
        b'"track_file":"",'\
        b'"start_point_id":1,'\
        b'"end_point_id":1,'\
        b'"local_guide_id":1,'\
        b'"condition":"Open",'\
        b'"condition_description":" ",'\
        b'"rp":[],'\
        b'"start_point_lat":0.01,'\
        b'"start_point_lng":0.01,'\
        b'"start_point_address":"test address",'\
        b'"end_point_lat":0.01,'\
        b'"end_point_lng":0.01,'\
        b'"end_point_address":"test address"},'\
        b'{"id":2,'\
        b'"title":"Trekking",'\
        b'"length":3,'\
        b'"expected_time":2,'\
        b'"ascent":0,'\
        b'"difficulty":"medium",'\
        b'"description":"",'\
        b'"track_file":"",'\
        b'"start_point_id":1,'\
        b'"end_point_id":1,'\
        b'"local_guide_id":1,'\
        b'"condition":"Open",'\
        b'"condition_description":" ",'\
        b'"rp":[],'\
        b'"start_point_lat":0.01,'\
        b'"start_point_lng":0.01,'\
        b'"start_point_address":"test address",'\
        b'"end_point_lat":0.01,'\
        b'"end_point_lng":0.01,'\
        b'"end_point_address":"test address"}]'

MOCK_UTIL = {
            "user":
            {
            "email":"test@test.com",
            "role":"Testrole"
        },
            "min_length":0.01,
            "max_length":0.01,
            "min_time":1,
            "max_time":1,
            "min_altitude":1,
            "max_altitude":1
        }


class MockResponse:
    def __init__(self):
        self.status_code = 200
 
    def json(self):
        return MOCK_UTIL

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
   
    def assert_util(self, response):
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["min_length"],0.01)
        self.assertEqual(response.json()["max_length"],0.01)
        self.assertEqual(response.json()["min_time"],1)
        self.assertEqual(response.json()["max_time"],1)
        self.assertEqual(response.json()["min_altitude"],1)
        self.assertEqual(response.json()["max_altitude"],1)

    @mock.patch("django.test.Client.get",return_value=MockResponse())
    def test_get(self,mocked):
        self.client.force_login(self.user)
        response = self.client.get(self.url)
        self.assert_util(response)
    
    @mock.patch("django.test.Client.post",return_value=MockResponse())
    def test_post(self,mocked):
        self.client.force_login(self.user)
        response = self.client.post(self.url,MOCK_UTIL)
        self.assert_util(response)


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

    def test_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

   


class recommandHikeUnitTest(TestCase):
    def setUp(self) -> None:
        User = get_user_model()
        User.objects.create_user( email='test@user.com', password='foo', role='local guide' )
        return super().setUp()
    
    @mock.patch("django.test.Client.get",return_value=MockHike())
    def test_get(self,mocked):
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

def set_up():
    User = get_user_model()
    User.objects.create_user(email='test@user.com', password='foo', role='smth')
    user_id = User.objects.get(email='test@user.com')
    p1 = Point(latitude=0.01, longitude=0.01, province="test province", village="test village",address="test address")
    p1.save()
    Hike.objects.create(title='Climbing', length=2, expected_time=1, ascent=1,difficulty='easy',start_point=p1,end_point=p1,local_guide=user_id)
    Hike.objects.create(title='Trekking', length=3, expected_time=2, ascent=0,difficulty='medium',start_point=p1,end_point=p1,local_guide=user_id) 
    
 
class modifyAHikeUnitTest(TestCase):
    def setUp(self) -> None:
       set_up()
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
        self.assertEqual(response.content, RESPONSE_UTIL)
    
    @mock.patch("django.test.Client.post",return_value=MockHike())
    def test_modifyHike(self,mocked):
        c = Client()
        c.login(username="test@user.com",password="foo")
        response = c.post('/hiketracking/hikes/', {'username': 'john', 'password': 'smith'})
        self.assertEqual(response.status_code, 200)



class DeleteHikeUnitTest(TestCase):
    def setUp(self) -> None:
       set_up()
       return super().setUp()
    
    def test_Backfround(self):
        c = Client()
        c.login(username="test@user.com",password="foo")
        response = c.get('/hiketracking/hikes/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, RESPONSE_UTIL)
    
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

