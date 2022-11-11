from django.contrib.auth.base_user import AbstractBaseUser
from django.utils import timezone

from django.db import models

from django.contrib.auth.models import AbstractUser, PermissionsMixin

from hiketracking.manger import  CustomUserManager
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField('email address',unique=True)
    role = models.CharField(max_length=200)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['role']
    objects = CustomUserManager()

    def __str__(self):
        return self.email
        
# Create your models here.
class Hike(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=30, unique=True)
    length = models.IntegerField()
    expected_time = models.IntegerField()
    ascent = models.IntegerField()
    start_point_lat = models.FloatField()
    start_point_lng = models.FloatField()
    difficulty = models.CharField(max_length=100)
    start_point_address = models.CharField(max_length=100)
    end_point_lat = models.FloatField()
    end_point_lng = models.FloatField()
    end_point_address = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    track_file = models.FileField(upload_to='tracks')
    local_guide = models.ForeignKey(CustomUser, on_delete=models.CASCADE)



class HikeReferencePoint(models.Model):
    hike = models.ForeignKey(Hike, on_delete=models.CASCADE)
    reference_point_lat = models.FloatField()
    reference_point_lng = models.FloatField()
    reference_point_address = models.CharField(max_length=100)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['hike', 'reference_point_lat', 'reference_point_lng'], name='hikeref')
        ]

