# Create your tests here.
from django.contrib.auth import get_user_model
from django.test import TestCase

from hiketracking.models import Hike, Point,CustomerProfile,CustomUser


class recommendedHikeTest(TestCase):
    def setUp(self) -> None:
        User = get_user_model()
        User.objects.create_user(email='test@user.com', password='foo', role='smth')
        user_id = User.objects.get(email='test@user.com')
        p1 = Point(latitude=0.01, longitude=0.01, province="test province", village="test village",address="test address")
        p1.save()
        Hike.objects.create(title='Climbing', length=2, expected_time=1, ascent=1,difficulty='easy',start_point=p1,end_point=p1,local_guide=user_id)
        Hike.objects.create(title='Trekking', length=3, expected_time=2, ascent=0,difficulty='medium',start_point=p1,end_point=p1,local_guide=user_id)
        return super().setUp()
    def test_Hike(self):
        hike1 = Hike.objects.all()
        self.assertEqual(hike1[0].title,"Climbing")
        self.assertEqual(hike1[0].length , 2)
        self.assertEqual(hike1[0].expected_time, 1)
        self.assertEqual(hike1[0].ascent , 1)
        self.assertEqual(hike1[0].difficulty, 'easy')
        self.assertEqual(hike1[0].start_point.latitude, 0.01)
        self.assertEqual(hike1[0].start_point.longitude, 0.01)
        self.assertEqual(hike1[0].start_point.province, "test province")
        self.assertEqual(hike1[0].start_point.village, "test village")
        self.assertEqual(hike1[0].start_point.address, "test address")
        self.assertEqual(hike1[0].end_point.latitude, 0.01)
        self.assertEqual(hike1[0].end_point.longitude, 0.01)
        self.assertEqual(hike1[0].end_point.province, "test province")
        self.assertEqual(hike1[0].end_point.village, "test village")
        self.assertEqual(hike1[0].end_point.address, "test address")

        self.assertEqual(hike1[1].title,"Trekking")
        self.assertEqual(hike1[1].length , 3)
        self.assertEqual(hike1[1].expected_time, 2)
        self.assertEqual(hike1[1].ascent , 0)
        self.assertEqual(hike1[1].difficulty, 'medium')
        self.assertEqual(hike1[1].start_point.latitude, 0.01)
        self.assertEqual(hike1[1].start_point.longitude, 0.01)
        self.assertEqual(hike1[1].start_point.province, "test province")
        self.assertEqual(hike1[1].start_point.village, "test village")
        self.assertEqual(hike1[1].start_point.address, "test address")
        self.assertEqual(hike1[0].end_point.latitude, 0.01)
        self.assertEqual(hike1[0].end_point.longitude, 0.01)
        self.assertEqual(hike1[0].end_point.province, "test province")
        self.assertEqual(hike1[0].end_point.village, "test village")
        self.assertEqual(hike1[0].end_point.address, "test address")
        pass
        

class modifyHikeTest(TestCase):
    def setUp(self) -> None:
        User = get_user_model()
        User.objects.create_user(email='test@user.com', password='foo', role='smth')
        user_id = User.objects.get(email='test@user.com')
        p1 = Point(latitude=0.01, longitude=0.01, province="test province", village="test village",address="test address")
        p1.save()
        Hike.objects.create(title='Climbing', length=2, expected_time=1, ascent=1,difficulty='easy',start_point=p1,end_point=p1,local_guide=user_id)
        Hike.objects.create(title='Trekking', length=3, expected_time=2, ascent=0,difficulty='medium',start_point=p1,end_point=p1,local_guide=user_id)
        return super().setUp()

    def test_modifyHike(self):
        hike1 = Hike.objects.get(title = "Climbing")
        hike1.title="modifyTest"
        hike1.length=10
        hike1.expected_time=10
        hike1.ascent=10
        hike1.difficulty="hard"
        hike1.start_point.latitude=0.1
        hike1.start_point.province="modifyTestProvince"
        hike1.start_point.village="modifyTestVillage"
        hike1.start_point.address="modifyTestAddress"
        hike1.end_point.latitude=0.1
        hike1.end_point.province="modifyTestProvince"
        hike1.end_point.village="modifyTestVillage"
        hike1.end_point.address="modifyTestAddress"
        hike1.save()
        hike1 = Hike.objects.all()
        self.assertEqual(hike1[0].title,"modifyTest")
        self.assertEqual(hike1[0].length , 10)
        self.assertEqual(hike1[0].expected_time, 10)
        self.assertEqual(hike1[0].ascent , 10)
        self.assertEqual(hike1[0].difficulty, 'hard')
        self.assertEqual(hike1[0].start_point.latitude, 0.01)
        self.assertEqual(hike1[0].start_point.longitude, 0.01)
        self.assertEqual(hike1[0].start_point.province, "test province")
        self.assertEqual(hike1[0].start_point.village, "test village")
        self.assertEqual(hike1[0].start_point.address, "test address")
        self.assertEqual(hike1[0].end_point.latitude, 0.01)
        self.assertEqual(hike1[0].end_point.longitude, 0.01)
        self.assertEqual(hike1[0].end_point.province, "test province")
        self.assertEqual(hike1[0].end_point.village, "test village")
        self.assertEqual(hike1[0].end_point.address, "test address")

        self.assertEqual(hike1[1].title,"Trekking")
        self.assertEqual(hike1[1].length , 3)
        self.assertEqual(hike1[1].expected_time, 2)
        self.assertEqual(hike1[1].ascent , 0)
        self.assertEqual(hike1[1].difficulty, 'medium')
        self.assertEqual(hike1[1].start_point.latitude, 0.01)
        self.assertEqual(hike1[1].start_point.longitude, 0.01)
        self.assertEqual(hike1[1].start_point.province, "test province")
        self.assertEqual(hike1[1].start_point.village, "test village")
        self.assertEqual(hike1[1].start_point.address, "test address")
        self.assertEqual(hike1[0].end_point.latitude, 0.01)
        self.assertEqual(hike1[0].end_point.longitude, 0.01)
        self.assertEqual(hike1[0].end_point.province, "test province")
        self.assertEqual(hike1[0].end_point.village, "test village")
        self.assertEqual(hike1[0].end_point.address, "test address")



class deleteHikeTest(TestCase):
    def setUp(self) -> None:
        User = get_user_model()
        User.objects.create_user(email='test@user.com', password='foo', role='smth')
        user_id = User.objects.get(email='test@user.com')
        p1 = Point(latitude=0.01, longitude=0.01, province="test province", village="test village",address="test address")
        p1.save()
        Hike.objects.create(title='Climbing', length=2, expected_time=1, ascent=1,difficulty='easy',start_point=p1,end_point=p1,local_guide=user_id)
        Hike.objects.create(title='Trekking', length=3, expected_time=2, ascent=0,difficulty='medium',start_point=p1,end_point=p1,local_guide=user_id)
        return super().setUp()

    def test_deleteHikeById(self):
        obj = Hike.objects.get(title = "Trekking")
        obj.delete()
        hike2 = Hike.objects.all()
        self.assertTrue(hike2.exists())

    def test_deleteAllHikes(self):
        Hike.objects.all().delete()
        hike2 = Hike.objects.all()
        self.assertFalse(hike2.exists())


class CustomerProfileTest(TestCase):
    def setUp(self) -> None:
        c1 = CustomUser(email = "test@test.com",role = "Testrole")
        c1.save()
        CustomerProfile.objects.create(user =c1,min_length = 0.01,max_length = 0.01,min_time = 1,max_time = 1,min_altitude = 1,max_altitude = 1)
        return super().setUp()

    def test_CustomerProfile(self):
        cp1 = CustomerProfile.objects.all()
        self.assertEqual(cp1[0].user.email, "test@test.com")
        self.assertEqual(cp1[0].user.role, "Testrole")
        self.assertEqual(cp1[0].min_length, 0.01)
        self.assertEqual(cp1[0].max_length, 0.01)
        self.assertEqual(cp1[0].min_time, 1)
        self.assertEqual(cp1[0].max_time, 1)
        self.assertEqual(cp1[0].min_altitude, 1)
        self.assertEqual(cp1[0].max_altitude, 1)

    def test_modifyProfile(self):
        p1 = CustomerProfile.objects.get(min_length = 0.01)
        p1.min_altitude = 2
        p1.min_length =  0.02
        p1.min_time = 2
        p1.max_altitude = 2
        p1.max_length =  0.02
        p1.max_time = 2
        p1.save()
        cp1 = CustomerProfile.objects.all()
        self.assertEqual(cp1[0].min_length, 0.02)
        self.assertEqual(cp1[0].max_length, 0.02)
        self.assertEqual(cp1[0].min_time, 2)
        self.assertEqual(cp1[0].max_time, 2)
        self.assertEqual(cp1[0].min_altitude, 2)
        self.assertEqual(cp1[0].max_altitude, 2)


    def test_deleteAllProfile(self):
        CustomerProfile.objects.all().delete()
        p2 = CustomerProfile.objects.all()
        self.assertFalse(p2.exists())
