from rest_framework import permissions
from rest_framework.generics import ListCreateAPIView

from hiketracking.models import HutHike
from hiketracking.serilizers import HikeHutSerializer


class HutHikeView( ListCreateAPIView ):
    permission_classes = (permissions.AllowAny,)
    serializer_class = HikeHutSerializer
    queryset = HutHike.objects.all()
