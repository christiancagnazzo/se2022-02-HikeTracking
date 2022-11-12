# Create your tests here.
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.test import TestCase
from rest_framework.test import APITestCase

class UsersManagersTests(TestCase):

    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(email='normal@user.com', password='foo', role="hi")
        self.assertEqual(user.email, 'normal@user.com')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        try:
            # username is None for the AbstractUser option
            # username does not exist for the AbstractBaseUser option
            self.assertIsNone(user.username)
        except AttributeError:
            pass
        with self.assertRaises(TypeError):
            User.objects.create_user()
        with self.assertRaises(TypeError):
            User.objects.create_user(email='')
        with self.assertRaises(ValueError):
            User.objects.create_user(email='', password="foo", role="hi")

    def test_create_superuser(self):
        User = get_user_model()
        admin_user = User.objects.create_superuser(email='super@user.com', role="hi", password='foo')
        self.assertEqual(admin_user.email, 'super@user.com')
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        try:
            # username is None for the AbstractUser option
            # username does not exist for the AbstractBaseUser option
            self.assertIsNone(admin_user.username)
        except AttributeError:
            pass
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email='super@user.com', password='foo',role="hi" ,is_superuser=False)


class LoginTest(TestCase):

    def setUp(self):
        User = get_user_model()
        user = User.objects.create_user(email = 'test@user.com', password = 'foo', role = 'smth')


    def test_credentials(self):
        user = authenticate(email = 'test@user.com', password = 'foo')
        self.assertTrue((user is not None ) and user.is_authenticated)

    def test_invalid_email(self):
        user = authenticate(email='invlaid', password='foo')
        self.assertFalse(user is not None and user.is_authenticated)

    def test_invalid_password(self):
        user = authenticate(email='test@user.com', password='doo')
        self.assertFalse(user is not None and user.is_authenticated)

