from django.db import models
from django.conf import settings

# Create your models here.
class Hike(models.Model):
    title = models.CharField(max_length=30, unique=True)
    length = models.IntegerField()
    expected_time = models.IntegerField()
    ascent = models.IntegerField()
    start_point = models.CharField(max_length=100)
    end_point = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    track_file = models.FileField(upload_to='tracks')
    #local_guide = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)



class HikeReferencePoint(models.Model):
    hike = models.ForeignKey(Hike, on_delete=models.CASCADE)
    reference_point = models.CharField(max_length=100)

    class Meta:
        constraints=[
            models.UniqueConstraint(fields=['hike', 'reference_point'], name='hikeref')
        ]