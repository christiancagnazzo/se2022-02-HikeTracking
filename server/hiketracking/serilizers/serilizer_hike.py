from rest_framework import serializers

from hiketracking.models import Hike


class HikeSerializer( serializers.ModelSerializer ):
    class Meta:
        model = Hike
        fields = '__all__'
