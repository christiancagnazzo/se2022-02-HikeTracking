from django.contrib import admin

from hiketracking.form import CustomUserCreationForm, CustomUserChangeForm
from hiketracking.models import Hike, HikeReferencePoint, CustomUser
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User as DjangoUser

# Register your models here.
admin.site.register(Hike)
admin.site.register(HikeReferencePoint)


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
