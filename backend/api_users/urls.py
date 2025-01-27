from django.urls import path,include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView


app_name = 'api_users'

urlpatterns = [
    path('api/user/register/',UserCreate.as_view(),name='user_create'),
    path('api/token/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('api/token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path('callback/',google_login_callback,name='callback'),
    path('api/auth/user/',UserDetailView.as_view(),name='user_detail'),
    path('api/google/validate_token',validate_google_token),
]


