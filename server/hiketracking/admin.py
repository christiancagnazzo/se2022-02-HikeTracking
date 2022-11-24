from django.contrib import admin

from hiketracking.form import CustomUserCreationForm, CustomUserChangeForm
from hiketracking.models import Hike, HikeReferencePoint, CustomUser, Point, Hut, Facility, HutFacility, ParkingLot
from django.contrib.auth.admin import UserAdmin

# Register your models here.
admin.site.register(Hike)
admin.site.register(HikeReferencePoint)
admin.site.register(Point)
admin.site.register(Hut)
admin.site.register(Facility)
admin.site.register(HutFacility)
admin.site.register(ParkingLot)


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('email', 'is_staff', 'is_active', 'role')
    list_filter = ('email', 'is_staff', 'is_active', 'role')
    fieldsets = (
        (None, {'fields': ('email', 'password', 'role')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active', 'role')}
         ),
    )
    search_fields = ('email',)
    ordering = ('email',)


admin.site.register(CustomUser, CustomUserAdmin)
