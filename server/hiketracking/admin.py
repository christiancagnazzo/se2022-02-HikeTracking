from django.contrib.gis import admin

from hiketracking.models import Hike, HikeReferencePoint

# Register your models here.
admin.site.register(Hike, admin.OSMGeoAdmin)
admin.site.register(HikeReferencePoint, admin.OSMGeoAdmin)
