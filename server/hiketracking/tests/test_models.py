from django.test import TestCase, Client

# Create your tests here.
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.test import TestCase, RequestFactory
from django.http import HttpRequest
from hiketracking.views import Hike, HikeFile, NewHike, Hikes
from hiketracking.models import Hike, Point, Hut, ParkingLot
from rest_framework.test import APITestCase
from ..models import *
import json


class UsersManagersTests(TestCase):

    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(email='mona131376st@gmail.com', password='foo', role="hi")
        self.assertEqual(user.email, 'mona131376st@gmail.com')
        self.assertFalse(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        try:
            # username is None for the AbstractUser option
            # username does not exist for the AbstractBaseUser option
            self.assertIsNone(user.username)
        except AttributeError:
            pass
        with self.assertRaises(TypeError):
            User.objects.create_user()
        with self.assertRaises(TypeError):
            User.objects.create_user(email='')
        with self.assertRaises(ValueError):
            User.objects.create_user(email='', password="foo", role="hi")

    def test_create_superuser(self):
        User = get_user_model()
        admin_user = User.objects.create_superuser(email='super@user.com', role="hi", password='foo')
        self.assertEqual(admin_user.email, 'super@user.com')
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        try:
            # username is None for the AbstractUser option
            # username does not exist for the AbstractBaseUser option
            self.assertIsNone(admin_user.username)
        except AttributeError:
            pass
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email='super@user.com', password='foo', role="hi", is_superuser=False)

    # try to log in and the check result of login
    # password is incorrect and login failed
    # current information and login success
    # because of this project uses django default login, it tests django api using in fact
    def test_login(self):
        User = get_user_model()
        user = User.objects.create_user(email='normal@user.com', password='johnpassword', role='hi')
        self.assertEqual(user.email, 'normal@user.com')
        self.assertFalse(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        user.is_active = True
        c = Client()
        response = c.post('/login/', {'username': 'john', 'password': 'smith'})
        self.assertEqual(response.status_code, 404)

    # try to log out and the check result of logout
    def test_logout(self):
        User = get_user_model()
        user = User.objects.create_user(email='normal@user.com', password='johnpassword', role='hi')
        self.assertEqual(user.email, 'normal@user.com')
        self.assertFalse(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        user.is_active = True
        c = Client()
        response = c.post('/login/', {'username': 'normal@user.com', 'password': 'johnpassword'})
        self.assertEqual(response.status_code, 404)
        response = c.get('/customer/details/')
        response = c.logout()
        self.assertIsNone(response, "NoneType")


class LoginTest(TestCase):

    def setUp(self):
        User = get_user_model()
        user = User.objects.create_user(email='test@user.com', password='foo', role='smth')
        self.assertEqual(user.email, 'test@user.com')
        self.assertFalse(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        user.is_active = True

    def test_credentials(self):
        user = authenticate(email='test@user.com', password='foo')
        self.assertTrue((user is not None) and user.is_authenticated)

    def test_invalid_email(self):
        user = authenticate(email='invlaid', password='foo')
        self.assertFalse(user is not None and user.is_authenticated)

    def test_invalid_password(self):
        user = authenticate(email='test@user.com', password='doo')
        self.assertFalse(user is not None and user.is_authenticated)


class FullListHikeTest(TestCase):

    def setUp(self):
        User = get_user_model()
        User.objects.create_user(email='test@user.com', password='foo', role='smth')
        user_id = User.objects.get(email='test@user.com')
        Hike.objects.create(title='Climbing', length=2, expected_time=1, ascent=1, start_point_lat=69,
                            start_point_lng=23, difficulty='easy', start_point_address='Cappucini',
                            end_point_lat=72, end_point_lng=26.2, end_point_address='Cappucini Top',
                            description='A beginner Hike', local_guide=user_id)

        Hike.objects.create(title='Trekking', length=3, expected_time=2, ascent=0, start_point_lat=75,
                            start_point_lng=25, difficulty='medium', start_point_address='Superga',
                            end_point_lat=78, end_point_lng=28, end_point_address='Top',
                            description='A trek', local_guide=user_id)

    # Test to get full list of hikes
    def test_get_full_list_of_hikes(self):
        hike_list = Hike.objects.all()
        self.assertEqual(len(hike_list), 2)
        h_list = list(hike_list.values())
        val_list = list(h_list[0].values())
        val_list_1 = list(h_list[1].values())
        final_test_list = [val_list, val_list_1]
        self.assertEqual(final_test_list[0][1], 'Climbing')
        self.assertEqual(final_test_list[1][8], 'Superga')


class AddHikeDescriptionTest(TestCase):
    def setUp(self):
        User = get_user_model()
        User.objects.create_user(email='test@user.com', password='foo', role='smth')
        user_id = User.objects.get(email='test@user.com')
        Hike.objects.create(title='Climbing', length=2, expected_time=1, ascent=1, start_point_lat=69,
                            start_point_lng=23, difficulty='easy', start_point_address='Cappucini',
                            end_point_lat=72, end_point_lng=26.2, end_point_address='Cappucini Top',
                            local_guide=user_id)

    def test_add_hike_description(self):
        hike_concerned = Hike.objects.get(id=1)
        self.assertEqual(hike_concerned.description, '')
        Hike.objects.filter(id=1).update(description='A beginner Hike')
        hike_updated = Hike.objects.get(id=1)
        self.assertEqual(hike_updated.description, 'A beginner Hike')


class listParkingPotTest(TestCase):
    def setUp(self):
        User = get_user_model()
        User.objects.create_user(email='test@user.com', password='foo', role='smth')
        user_id = User.objects.get(email='test@user.com')
        p1 = Point(latitude=0.01, longitude=0.01, province="test province", village="test village",
                   address="test address")
        park1 = ParkingLot(name="test parking pot name 1", fee=0.01, n_cars=1, point_id=1)
        print(park1)
        p1.save()
        park1.Point = p1
        park1.save()
        return super().setUp()

    def testListParkingPot(self):
        list = ParkingLot.objects.all()
        self.assertEqual(list[0].fee, 0.01)
        self.assertEqual(list[0].name, "test parking pot name 1")
        self.assertEqual(list[0].n_cars, 1)
        self.assertEqual(list[0].point_id, 1)


class AddHutTest(TestCase):
    def setUp(self):
        User = get_user_model()
        User.objects.create_user(email='test@user.com', password='foo', role='smth')
        self.user_id = User.objects.get(email='test@user.com')
        return super().setUp()

    def testHut(self):
        p1 = Point(latitude=0.01, longitude=10.01, province="test province", village="test village",
                   address="test address")
        hunt = Hut(name="test parking pot name 1", fee=10.01, n_beds=2, desc="testHunt", point_id=1)
        service = ["serve1", "serve2"]
        p1.save()
        hunt.Point = p1
        hunt.save()

        list = Hut.objects.all()
        self.assertEqual(list[0].fee, 10.01)
        self.assertEqual(list[0].name, "test parking pot name 1")
        self.assertEqual(list[0].n_beds, 2)
        self.assertEqual(list[0].point_id, 1)
        for service_ in service:
            obj, isNew = Facility.objects.get_or_create(name=service_)
            self.assertTrue(isNew)
            HutFacility.objects.get_or_create(hut=hunt, facility=obj)
        services = Facility.objects.all()
        self.assertEqual(len(services), 2)
        self.assertEqual(len(HutFacility.objects.filter(hut=hunt).all()), 2)

    def testHutTextFee(self):
        p1 = Point(latitude=0.01, longitude=10.01, province="test province", village="test village",
                   address="")
        hunt = Hut(name="test parking pot name 1", fee="dieci", n_beds=2, desc="testHunt", point_id=1)
        service = ["serve1", "serve2"]
        p1.save()
        hunt.Point = p1
        hunt.save()

        list = Hut.objects.all()
        self.assertEqual(list[0].fee, 10.01)
        self.assertEqual(list[0].name, "test parking pot name 1")
        self.assertEqual(list[0].n_beds, 2)
        self.assertEqual(list[0].point_id, 1)
        for service_ in service:
            obj, isNew = Facility.objects.get_or_create(name=service_)
            self.assertTrue(isNew)
            HutFacility.objects.get_or_create(hut=hunt, facility=obj)
        services = Facility.objects.all()
        self.assertEqual(len(services), 2)
        self.assertEqual(len(HutFacility.objects.filter(hut=hunt).all()), 2)
