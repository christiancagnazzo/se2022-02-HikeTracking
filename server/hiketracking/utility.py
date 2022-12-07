from functools import partial

from geopy.geocoders import Nominatim

from hiketracking.models import Point

geolocator = Nominatim( user_agent="hiketracking" )


def get_province_and_village(lat, lon):
    try:
        reverse = partial( geolocator.reverse, language="it" )
        location = reverse( str( lat ) + ", " + str( lon ) )
        province = location.raw['address']['county']
        village = location.raw['address']['village']
        return {'province': province, 'village': village}
    except:
        return {'province': "", 'village': ""}


def InsertPoint(pointSerializer, pointType="none"):
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
