from django.utils import timezone

from django.db import models

from django.contrib.auth.models import AbstractUser

from hiketracking.manger import CustomUserManager


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField('email address', unique=True)
    role = models.CharField(max_length=200)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['role']
    objects = CustomUserManager()

    def __str__(self):
        return self.email


class CustomerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    min_length = models.FloatField(null=True)
    max_length = models.FloatField(null=True)
    min_time = models.IntegerField(null=True)
    max_time = models.IntegerField(null=True)
    min_altitude = models.IntegerField(null=True)
    max_altitude = models.IntegerField(null=True)

    class Difficulty(models.TextChoices):
        TOURIST = "Tourist"
        HIKER = "Hiker"
        PRO_HIKER = "Pro Hiker"

    difficulty = models.CharField(choices=Difficulty.choices, max_length=30)


class Point(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    province = models.CharField(max_length=100)
    village = models.CharField(max_length=30)
    address = models.CharField(max_length=100)

    class Type(models.TextChoices):
        NONE = "none"
        HUT = "hut"
        PARKING_LOT = "parking_lot"

    type = models.CharField(max_length=15, choices=Type.choices)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['latitude', 'longitude'], name='point')
        ]

    def __str__(self):
        return self.id.__str__() + '_' + self.type


class Hike(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=30, unique=True)
    length = models.IntegerField()
    expected_time = models.IntegerField()
    ascent = models.IntegerField()
    difficulty = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    track_file = models.FileField(upload_to='tracks')
    start_point = models.ForeignKey(Point, on_delete=models.CASCADE, related_name="start_point")
    end_point = models.ForeignKey(Point, on_delete=models.CASCADE, related_name="end_point")
    local_guide = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    class Condition(models.TextChoices):
        OPEN = "Open"
        CLOSED = "Closed"
        PARTLY_BLOCKED = "Partly blocked"
        SPECIAL_GEAR = "Requires special gear"

    condition = models.CharField(max_length=30, choices=Condition.choices)
    condition_description = models.CharField(max_length=100)

    def __str__(self):
        return self.title


class HikeReferencePoint(models.Model):
    hike = models.ForeignKey(Hike, on_delete=models.CASCADE)
    point = models.ForeignKey(Point, on_delete=models.CASCADE)

    def __str__(self):
        return self.hike.title + " " + self.point.type

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['hike', 'point'], name='hikeref')
        ]


class Hut(models.Model):
    name = models.CharField(max_length=50, unique=True)
    n_beds = models.IntegerField()
    fee = models.FloatField()
    ascent = models.IntegerField()
    phone = models.CharField(max_length=10)
    email = models.EmailField()
    web_site = models.CharField(max_length=50, blank=True, default='')
    desc = models.TextField(blank=True, default=" ")
    point = models.OneToOneField(Point, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class HutPhoto(models.Model):
    hut = models.ForeignKey(Hut, on_delete=models.CASCADE)
    track_file = models.FileField(upload_to='hutimages')


class Facility(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class HutFacility(models.Model):
    hut = models.ForeignKey(Hut, on_delete=models.CASCADE)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)

    def __str__(self):
        return self.hut.name + " " + self.facility.name

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['hut', 'facility'], name='hutfac')
        ]


class ParkingLot(models.Model):
    name = models.CharField(max_length=50, unique=True)
    fee = models.FloatField()
    n_cars = models.IntegerField()
    desc = models.TextField(blank=True, default=" ")
    point = models.OneToOneField(Point, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class HutHike(models.Model):
    hike = models.ForeignKey(Hike, on_delete=models.CASCADE)
    hut = models.ForeignKey(Hut, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['hut', 'hike'], name='huthike')
        ]


class UserHikeLog(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    hike = models.ForeignKey(Hike, on_delete=models.CASCADE)
    counter = models.IntegerField()  # useful to differentiate different run of the same hike
    point = models.ForeignKey(Point, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    end = models.BooleanField(default=False)
