from django.utils import timezone

from django.db import models

from django.contrib.auth.models import AbstractUser 

from hiketracking.manger import  CustomUserManager



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

class Point(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    province = models.CharField(max_length=30)
    village= models.CharField(max_length=30)
    address= models.CharField(max_length=100)
    class Type(models.TextChoices):
        NONE = "none"
        HUT = "hut"
        PARKING_LOT = "parking_lot"
    type = models.CharField(max_length=15, choices=Type.choices)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['latitude','longitude'], name='hikeref')
        ]

class Hike(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=30, unique=True)
    length = models.IntegerField()
    expected_time = models.IntegerField()
    ascent = models.IntegerField()
    difficulty = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    track_file = models.FileField(upload_to='tracks')
    start_point = models.ForeignKey(Point, on_delete=models.CASCADE)
    end_point = models.ForeignKey(Point, on_delete=models.CASCADE)
    local_guide = models.ForeignKey(CustomUser, on_delete=models.CASCADE)



class HikeReferencePoint(models.Model):
    hike = models.ForeignKey(Hike, on_delete=models.CASCADE)
    point = models.ForeignKey(Point, on_delete=models.CASCADE)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['hike', 'point'], name='hikeref')
        ]



class Hut(models.Model):
    name = models.CharField(max_length=50, unique=True)
    n_beds = models.IntegerField()
    fee = models.FloatField()
    point = models.ForeignKey(Point, unique=True,on_delete=models.CASCADE)

class Facility(models.Model):
    name = models.CharField(max_length=100, unique=True)


class HutFacility(models.Model):
    hut = models.ForeignKey(Hut, on_delete=models.CASCADE)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['hut', 'facility'], name='hutfac')
        ]
    


class ParkingLot(models.Model):
    name = models.CharField(max_length=50, unique=True)
    fee = models.FloatField()
    n_cars = models.IntegerField()
    point = models.ForeignKey(Point, unique=True,on_delete=models.CASCADE)
