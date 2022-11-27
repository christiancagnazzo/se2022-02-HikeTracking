import json
from http import HTTPStatus
from django.test import TestCase
from django.contrib.auth import get_user_model, authenticate
from hiketracking.models import Hike, Point, Hut, ParkingLot, Facility, HutFacility

class HutTest(TestCase):
    def setUp(self):
        self.data = {
            "name": "mona131376st@gmail.com",
            "position": {
                "latitude": 45.178562524475273,
                "longitude": 7.081797367594325,
                "address": "First Parking lot to be uploaded"
            },

            "desc": "life",
            "fee": 10,
            "n_beds": 10,
            "services": ["shower", "sona"]

        }

    def testAddHut(self):
        response = self.client.post("/hiketracking/huts/",
                                    json.dumps(self.data),
                                    content_type="application/json"
                                    )

        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data.get("name"), "mona131376st@gmail.com")
        self.assertEqual(response.data.get("desc"), "life")
        self.assertEqual(response.data.get("fee"), 10)
        self.assertEqual(response.data.get("n_beds"), 10)

    def testAddHutBadcordination(self):
        self.data['position']['longitude'] = 'two'

        response = self.client.post("/hiketracking/huts/",
                                    json.dumps(self.data),
                                    content_type="application/json"
                                    )

        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)

    def testAddHutEmptyAdress(self):
        self.data['position']['adress'] = ""
        response = self.client.post("/hiketracking/huts/",
                                    json.dumps(self.data),
                                    content_type="application/json"
                                    )

        self.assertEqual(response.status_code, HTTPStatus.OK)

    def testAddHutNullDiscriptiomn(self):
        self.data['desc'] = None
        response = self.client.post("/hiketracking/huts/",
                                    json.dumps(self.data),
                                    content_type="application/json"
                                    )

        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)

#this not work

class RetrieveHutAPITest(TestCase):

    def setUp(self):
        User = get_user_model()
        User.objects.create_user(email='test@user.com', password='foo', role='smth')
        user_id = User.objects.get(email='test@user.com')
        Point.objects.create(latitude=0.01, longitude=0.01, province="test province", village="test village", address="test address")
        p1 = Point.objects.get(latitude = 0.01)
        h1 = Hut(name = "TestHut", n_beds = 1, fee = 20, point_id = p1.id)
        print("H1 is: ", h1)
        self.data = {
            "name": h1.name,
            "position":{
                "latitude": p1.latitude,
                "longitude": p1.longitude,
                "address": p1.address
            },
            "n_beds": h1.n_beds,
            "fee": h1.fee,
            "services": ["shower", "sona"]

        }
        print("Data is: ", self.data)


    def test_retrieve_hut_api(self):
        response = self.client.get('/hiketracking/huts', json.dumps(self.data), content_type = "application/json")
        self.assertEqual(response.status_code, HTTPStatus.OK)

class AddParkingLotAPI(TestCase):

    def setUp(self):
        self.data = {
            "name": "test@gmail.com",
            "position": {
                "latitude": 1,
                "longitude": 1,
                "address": "First Parking lot to be uploaded"
            },

            "desc": "life",
            "fee": 10,
            "n_cars": 10,

        }

    def test_add_parking_lot(self):
        response = self.client.post('/hiketracking/parkingLots/', json.dumps(self.data), content_type="application/json")
        self.assertEqual(response.status_code, HTTPStatus.CREATED)