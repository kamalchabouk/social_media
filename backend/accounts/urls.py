from django.urls import path 
from .views import ProfileAPIView,ProfileEditAPIView

app_name = 'users'


urlpatterns = [
    path('api/profile/<int:pk>/', ProfileAPIView.as_view(), name='profile-api'),
    path('api/profile/<int:pk>/edit/', ProfileEditAPIView.as_view(), name='profile-edit'),

    #path('profile/<int:pk>/', ProfileView.as_view(), name='profile'),
    #path('profile/edit/<int:pk>/', ProfileEditView.as_view(), name='profile-edit'),
    #path('profile/<int:pk>/followers/',ListFollowers.as_view(),name='list-followers'),
    #path('profile/<int:pk>/followers/add',AddFollower.as_view(),name='add-follower'),
    #path('profile/<int:pk>/followers/remove',RemoveFollower.as_view(),name='remove-follower'),
    #path('search/',UserSearch.as_view(),name='profile-search'),
]
