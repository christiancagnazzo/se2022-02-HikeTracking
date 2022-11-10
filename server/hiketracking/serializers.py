from rest_framework import serializers
from .models import Hike


class HikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hike
        fields = '__all__'

from hiketracking.models import CustomUser


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'role']


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'password', 'role')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(validated_data['email'], validated_data['role'], validated_data['password'])

        return user
