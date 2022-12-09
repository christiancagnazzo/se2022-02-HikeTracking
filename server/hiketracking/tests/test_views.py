import json
from http import HTTPStatus

from django.contrib.auth import get_user_model
from django.test import TestCase

from hiketracking.models import Point, Hut, Hike


class HutTest( TestCase ):
    def setUp(self):
        self.data = {
            "name": "hutTest12",
            "n_beds": 10,
            "fee": 10,
            "ascent": 3,
            "phone": "+989128029591",
            "email": "test@g.com",
            "web_site": "www.google.com",
            "desc": "",
            "position": {
                "latitude": 45.1352,
                "longitude": 7.0852,
                "address": "First Parking lot to be uploaded"
            },
            "services": [
                "shower"
            ],
            "relatedHike": [1, 2]
        }

        self.url = "/hiketracking/hut/"
        self.context_type = "application/json"

    def testAddHut(self):
        response = self.client.post( self.url,
                                     json.dumps( self.data ),
                                     content_type=self.context_type
                                     )

        self.assertEqual( response.status_code, HTTPStatus.OK )
        self.assertEqual( response.data.get( "name" ), self.data.get( "name" ) )
        self.assertEqual( response.data.get( "n_beds" ), self.data.get( "n_beds" ) )
        self.assertEqual( response.data.get( "fee" ), self.data.get( "fee" ) )
        self.assertEqual( response.data.get( "ascent" ), self.data.get( "ascent" ) )
        self.assertEqual( response.data.get( "phone" ), self.data.get( "phone" ) )
        self.assertEqual( response.data.get( "email" ), self.data.get( "email" ) )
        self.assertEqual( response.data.get( "web_site" ), self.data.get( "web_site" ) )
        self.assertEqual( response.data.get( "desc" ), self.data.get( "desc" ) )

    def testAddHutBadcordination(self):
        self.data['position']['longitude'] = 'two'

        response = self.client.post( self.url,
                                     json.dumps( self.data ),
                                     content_type=self.context_type
                                     )

        self.assertEqual( response.status_code, HTTPStatus.BAD_REQUEST )

    def testAddHutEmptyAdress(self):
        self.data['position']['adress'] = ""
        response = self.client.post( self.url,
                                     json.dumps( self.data ),
                                     content_type=self.context_type
                                     )

        self.assertEqual( response.status_code, HTTPStatus.OK )

    def testAddHutNullDiscriptiomn(self):
        self.data['desc'] = None
        response = self.client.post( self.url,
                                     json.dumps( self.data ),
                                     content_type=self.context_type
                                     )

        self.assertEqual( response.status_code, HTTPStatus.BAD_REQUEST )

    def testemptyrelatedHike(self):
        self.data['relatedHike'] = []
        response = self.client.post( self.url,
                                     json.dumps( self.data ),
                                     content_type=self.context_type
                                     )

        self.assertEqual( response.status_code, HTTPStatus.OK )

    def testbadPhoneNumber(self):
        self.data['phone'] = ["hi12413"]
        response = self.client.post( self.url,
                                     json.dumps( self.data ),
                                     content_type=self.context_type
                                     )

        self.assertEqual( response.status_code, HTTPStatus.BAD_REQUEST )

    def testbadPhoneNumber2(self):
        self.data['phone'] = "12345678909876543"
        response = self.client.post( self.url,
                                     json.dumps( self.data ),
                                     content_type=self.context_type
                                     )

        self.assertEqual( response.status_code, HTTPStatus.BAD_REQUEST )

    def testPhoneNumber(self):
        self.data['phone'] = "9128029591"
        response = self.client.post( self.url,
                                     json.dumps( self.data ),
                                     content_type=self.context_type
                                     )

        self.assertEqual( response.status_code, HTTPStatus.OK )


class HutHikeTest( TestCase ):
    def setUp(self):
        User = get_user_model()
        User.objects.create_user( email='test@user.com', password='foo', role='smth' )
        user_id = User.objects.get( email='test@user.com' )
        p1 = Point( latitude=0.01, longitude=10.01, province="test province", village="test village",
                    address="test" )
        p2 = Point( latitude=0.31, longitude=10.01, province="test province", village="test village",
                    address="addresstest" )
        hunt = Hut( name="test parking pot name 1", n_beds=2,
                    fee=10, ascent=10,
                    phone="+999222", email="md@gmail.com",
                    web_site="www.hi.com",
                    desc="testHunt", point_id=2 )

        p1.save()
        p2.save()
        hunt.Point = p1
        hike = Hike.objects.create( title='Climbing', length=2, expected_time=1, ascent=1, difficulty='easy',
                                    start_point=p2,
                                    end_point=p2, local_guide=user_id )
        hunt.save()
        hike.save()
        self.data = {
            'hike': '1',
            'hut': '1'}
        self.url = self.url = '/hiketracking/HutHikeView/'
        self.context_type = "application/json"

    def test_hut_hike(self):
        response = self.client.post( self.url, json.dumps( self.data ),
                                     content_type=self.context_type )
        self.assertEqual( response.status_code, HTTPStatus.CREATED )


class AddParkingLotAPI( TestCase ):

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
        self.url = '/hiketracking/parkingLots/'
        self.context_type = "application/json"

    def test_add_parking_lot(self):
        response = self.client.post( self.url, json.dumps( self.data ),
                                     content_type="application/json" )
        self.assertEqual( response.status_code, HTTPStatus.CREATED )
        self.assertEqual( response.data.get( "name" ), "test@gmail.com" )
        self.assertEqual( response.data.get( "desc" ), "life" )
        self.assertEqual( response.data.get( "fee" ), 10 )
        self.assertEqual( response.data.get( "n_cars" ), 10 )

    def test_Wrong_Position(self):
        self.data['position']['longitude'] = 'two'
        response = self.client.post( self.url, json.dumps( self.data ),
                                     content_type=self.context_type )
        self.assertEqual( response.status_code, HTTPStatus.BAD_REQUEST )

    def test_Wrong_Fee(self):
        self.data['fee'] = 'sixty-nine'
        response = self.client.post( self.url, json.dumps( self.data ),
                                     content_type=self.context_type )
        self.assertEqual( response.status_code, HTTPStatus.BAD_REQUEST )
