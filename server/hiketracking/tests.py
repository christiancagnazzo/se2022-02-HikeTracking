from django.test import TestCase

# Create your tests here.
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.test import TestCase
from django.http import request


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

# try to login and the check result of login
# password is incurrect and login failed
# currect information and login success
# because of this project uses njango default login, it test njango api using in fact
    def test_login(self):
        User = get_user_model()
        user = User.objects.create_user(username='john',email= 'normal@user.com',password= 'johnpassword')
        self.assertEqual(user.email, 'normal@user.com')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

        username = request.POST['john']
        password = request.POST['johnpassword']
        user = authenticate(request, username=username, password=password)
        self.assertIsNotNone(user)
        with assertRaises(ValueError):
            login(request, user)

        username = request.POST['john']
        password = request.POST['normal@user.com']
        login(request, user)
        self.assertTrue(request.user.is_authenticated)

# try to logout and the check result of logout
    def test_logout(self):
        User = get_user_model()
        user = User.objects.create_user('john', 'normal@user.com', 'johnpassword')
        self.assertEqual(user.email, 'normal@user.com')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

        username = request.POST['john']
        password = request.POST['normal@user.com']
        user = authenticate(request, username=username, password=password)
        self.assertIsNotNone(user)
        login(request, user)
        self.assertTrue(request.user.is_authenticated)
        logout(request)
        self.assertFalse(request.user.is_authenticated)




            




