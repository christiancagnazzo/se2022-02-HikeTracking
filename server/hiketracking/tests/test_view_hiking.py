import json
from http import HTTPStatus
from django.contrib.auth import get_user_model, authenticate
from django.test import Client
from django.test import TestCase, TransactionTestCase
from hiketracking.models import Hike, Point, Hut, ParkingLot, Facility, HutFacility, CustomerProfile, CustomUser, HutWorker, HutHike, WeatherAlert, UserHikeLog
from hiketracking.tests.test_utilty import CreateTestUser

class HikingAPItest(TestCase):

    def setUp(self):
        pass
