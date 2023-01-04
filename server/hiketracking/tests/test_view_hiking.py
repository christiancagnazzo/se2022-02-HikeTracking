
import json
from http import HTTPStatus
from django.contrib.auth import get_user_model, authenticate, login
from django.test import Client
from django.test import TestCase, TransactionTestCase
from hiketracking.models import Hike, Point, Hut, ParkingLot, Facility, HutFacility, CustomerProfile, CustomUser, HutWorker, HutHike, WeatherAlert, UserHikeLog, HikeReferencePoint
from hiketracking.tests.test_utilty import CreateTestUser

class HikingAPItest(TestCase):

    def setUp(self):
        User = get_user_model()
        c3 = User.objects.create_user(email='meepo@user.com', password='foo', role='Hiker', is_staff=0, is_confirmed=1, is_active=1)
        c1 = CustomUser(email="meepo@test.com", role="Hiker",
                        is_staff=0, is_confirmed=1, is_active=1)

        c1.save()
        c2 = CustomUser(email="cm@test.com", role="Local Guide", is_staff=0, is_confirmed=1, is_active=1)
        c2.save()
        # User.objects.create_user(email='test@user.com', password='foo', role='smth')
        # user_id = User.objects.get(email='test@user.com')
        p1 = Point(latitude=0.06, longitude=0.06, province="test1 province", village="test1 village",
                   address="test1 address", type="Hut")
        p1.save()
        h1 = Hike.objects.create(title='Climbing', length=2, expected_time=1, ascent=1, difficulty='easy',
                                 start_point=p1, end_point=p1, local_guide=c2)
        h2 = Hike.objects.create(title='Trekking', length=3, expected_time=2, ascent=0, difficulty='medium',
                                 start_point=p1, end_point=p1, local_guide=c2)
        h3 = Hike.objects.create(title='Trek', length=3, expected_time=2, ascent=0, difficulty='medium',
                                 start_point=p1, end_point=p1, local_guide=c2)
        log1 = UserHikeLog.objects.create(user=c3, hike=h1, counter=2, point=p1, end=False)
        log2 = UserHikeLog.objects.create(user=c3, hike=h2, counter=1, point=p1, end=True)
        log3 = UserHikeLog.objects.create(user=c1, hike=h3, counter=1, point=p1, end=False)
        self.context_type = "application/json"

    def test_start_hike(self):
        self.data = {
            "hike_id" : 1
        }
        print("i am here")
        User = get_user_model()
        user_u = User.objects.get(email="meepo@user.com")
        print("users are", user_u.id)
        t = user_u.is_anonymous
        print(t)
        print(type(user_u))
        c = Client()
        resp = c.login(username="meepo@user.com", password="foo")
        print("resp", resp)
        response = c.post('/hiketracking/hiking/', json.dumps(self.data), content_type=self.context_type)
        print("response is :", response.data)
        self.assertEqual(response.status_code, HTTPStatus.OK)



class GetWeatherAlertAPI(TestCase):

    def setUp(self):
        User = get_user_model()

        c1 = CustomUser(email="test@test.com", role="Platform Manager",
                        is_staff=0, is_confirmed=1, is_active=1)
        c1.save()
        c2 = CustomUser(email="test@atest.com",
                        role="Hiker", is_staff=0, is_confirmed=1, is_active=1)
        c2.save()
        c3 = User.objects.create_user(email='meepo@user.com', password='foo', role='Hiker', is_staff=0, is_confirmed=1, is_active=1)
        p1 = Point(latitude=0.06, longitude=0.06, province="test1 province", village="test1 village",
                   address="test1 address", type="Hut")
        p1.save()
        p2 = Point(latitude=0.10, longitude=0.69, province="test1 province", village="test1 village",
                   address="test1 address", type="Hut")
        p2.save()
        weath = WeatherAlert.objects.create(condition="Snow", weather_lat=2.3, weather_lon=2.4, radius=6)
        weath1 = WeatherAlert.objects.create(condition="Hail", weather_lat=3.3, weather_lon=4.4, radius=6)
        weath2 = WeatherAlert.objects.create(condition="Rain", weather_lat=6.3, weather_lon=5.4, radius=6)
        h1 = Hike.objects.create(title='Climbing', length=2, expected_time=1, ascent=1, difficulty='easy',
                                 start_point=p1, end_point=p1, local_guide=c2)
        h2 = Hike.objects.create(title='Trekking', length=3, expected_time=2, ascent=0, difficulty='medium',
                                 start_point=p1, end_point=p2, local_guide=c2)
        h3 = Hike.objects.create(title='Trek', length=3, expected_time=2, ascent=0, difficulty='medium',
                                 start_point=p1, end_point=p1, local_guide=c2)
        rp = HikeReferencePoint.objects.create(hike_id=h2.id, point_id = p1.id)
        rp_2 = HikeReferencePoint.objects.create(hike_id=h2.id, point_id = p2.id)
        #log1 = UserHikeLog.objects.create(user=c3, hike=h1, counter=2, point=p1, end=True)
        log2 = UserHikeLog.objects.create(user=c3, hike=h2, counter=1, point=p1, end=False)
        #log3 = UserHikeLog.objects.create(user=c3, hike=h3, counter=1, point=p1, end=False)

        self.url = '/hiketracking/hike/alert/'
        self.context_type = "application/json"

    def test_get_Weather_alert(self):
        print("i am here")
        User = get_user_model()
        user_u = User.objects.get(email = "meepo@user.com")
        print("users are", user_u.id)
        t = user_u.is_anonymous
        print(t)
        print(type(user_u))
        c = Client()
        resp = c.login(username="meepo@user.com", password="foo")
        print("resp", resp)
        print("i am here")
        response = c.get('/hiketracking/hike/alert/', content_type = self.context_type)
        print("response is :", response.data)
        self.assertEqual(response.status_code, HTTPStatus.OK)
