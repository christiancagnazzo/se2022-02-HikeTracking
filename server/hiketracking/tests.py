from django.test import TestCase,Client

# Create your tests here.
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.test import TestCase
from django.http import HttpRequest
from hiketracking.views import Hike, HikeFile,NewHike,Hikes
from hiketracking.models import Hike


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
        user = User.objects.create_user(email= 'normal@user.com',password= 'johnpassword',role='hi')
        self.assertEqual(user.email, 'normal@user.com')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

        c = Client()
        response = c.post('/login/', {'username': 'john', 'password': 'smith'})
        self.assertEqual(response.status_code,404)
        response = c.post('/login/', {'username': 'normal@user.com', 'password': 'johnpassword'})
        self.assertEqual(response.status_code,200)
        response = c.get('/customer/details/')
        response.content

# try to logout and the check result of logout
    def test_logout(self):
        User = get_user_model()
        user = User.objects.create_user(email= 'normal@user.com',password= 'johnpassword',role='hi')
        self.assertEqual(user.email, 'normal@user.com')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        c = Client()
        response = c.post('/login/', {'username': 'normal@user.com', 'password': 'johnpassword'})
        self.assertEqual(response.status_code,404)
        response = c.get('/customer/details/')
        response = c.logout() 
        self.assertIsNone(response,"NoneType")
        
class ListAvailableHikesTest(TestCase):
    
    def test_createNewHike(self):
        #c = Client()
        pass
    def test_createHikeList(self):
        pass
    def test_ListAvailableHikes(self):
        pass

        





            






