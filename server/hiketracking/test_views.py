import json
from http import HTTPStatus
from django.test import TestCase

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
