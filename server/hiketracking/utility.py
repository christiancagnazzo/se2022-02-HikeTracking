from functools import partial
from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="hiketracking")


def get_province_and_village(lat, lon):
    try:
        reverse = partial(geolocator.reverse, language="it")
        location = reverse(str(lat) + ", " + str(lon))
        province = location.raw['address']['county']
        village = location.raw['address']['village']
        return {'province': province, 'village': village}
    except:
        return {'province': "", 'village': ""}
