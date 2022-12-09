from functools import partial

from geopy.geocoders import Nominatim

from hiketracking.models import Point
from hiketracking.serilizers import HikeHutSerializer

geolocator = Nominatim( user_agent="hiketracking" )


def get_province_and_village(lat, lon):
    try:
        reverse = partial( geolocator.reverse, language="it" )
        location = reverse( str( lat ) + ", " + str( lon ) )
        province = location.raw['address']['county']
        village = location.raw['address']['village']
        return {'province': province, 'village': village}
    except Exception :
        return {'province': "", 'village': ""}


def insert_point(pointSerializer, pointType="none"):
    sp = get_province_and_village(
        pointSerializer.data.get( 'latitude' ), pointSerializer.data.get( 'longitude' ) )
    point, created = Point.objects.get_or_create(
        latitude=pointSerializer.data.get( 'latitude' ),
        longitude=pointSerializer.data.get( 'longitude' ),
        defaults={
            'province': sp['province'],
            'village': sp['village'],
            'address': pointSerializer.data.get( 'address' ),
            'type': pointType
        }
    )
    return point


def link_hike_to_hut(hike, hut):
    if hike:
        hike_hut = {'hike': hike, 'hut': hut.id}
        hikeHutSerializer = HikeHutSerializer(data=hike_hut )
        if hikeHutSerializer.is_valid():

            hikeHutSerializer.save()
