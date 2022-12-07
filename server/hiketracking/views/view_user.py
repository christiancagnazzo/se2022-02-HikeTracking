from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.shortcuts import render
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from knox.views import LoginView as KnoxLoginView
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from hiketracking.models import CustomUser
from hiketracking.serilizers.serilizer_user import UserSerializer, RegisterSerializer, AuthTokenCustomSerializer, \
    SessionsSerializer
from hiketracking.tokens import account_activation_token


class UserList( generics.ListAPIView ):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class UserDetail( generics.RetrieveAPIView ):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class RegisterAPI( generics.GenericAPIView ):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer( data=request.data )
        serializer.is_valid( raise_exception=True )
        serializer.is_active = False
        user = serializer.save()
        current_site = get_current_site( request )
        mail_subject = 'Activation link has been sent to your email id'
        message = render_to_string( './acc_active_email.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode( force_bytes( user.pk ) ),
            'token': account_activation_token.make_token( user ),
        } )
        to_email = user.email
        email = EmailMessage(
            mail_subject, message, to=[to_email]
        )
        try:
            email.send()
            return Response( status=status.HTTP_200_OK, data={
                "message": 'Please confirm your email address to complete the registration'} )
        except Exception as e:
            user = CustomUser.objects.get( user.id )
            user.delete()
            return Response( status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={
                "message": 'Server error', "exception": e} )


class ActivateAccount( KnoxLoginView ):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, uidb64, token, *args, **kwargs):
        try:
            uid = force_str( urlsafe_base64_decode( uidb64 ) )
            user = CustomUser.objects.get( pk=uid )
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and account_activation_token.check_token( user, token ):
            user.is_active = True
            user.save()
            login( request, user )
            super( ActivateAccount, self ).post( request, format=None )

            return render( request, "emailConfirmed.html" )
        else:
            return Response( status=status.HTTP_400_BAD_REQUEST, data={
                "massage": 'The confirmation link was invalid, possibly because it has already been used.'} )


class LoginAPI( KnoxLoginView ):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = AuthTokenCustomSerializer( data=request.data )
        serializer.is_valid( raise_exception=True )
        user = serializer.validated_data['user']
        login( request, user )
        result = super( LoginAPI, self ).post( request, format=None )
        return Response( status=status.HTTP_200_OK,
                         data={"user": user.email, "role": user.role.lower().replace( " ", "" ),
                               "token": result.data['token']} )


class Sessions( generics.RetrieveAPIView ):
    serializer_class = SessionsSerializer

    # permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        email = self.request.user
        return CustomUser.objects.get( email=email )
