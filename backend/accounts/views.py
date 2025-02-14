from django.shortcuts import render,redirect
from django.db.models import Q
from .models import UserProfile
from .forms import UserProfileForm
from social.forms import ShareForm
from django.views import View
from social.models import Post,Notification
from django.views.generic.edit import UpdateView
from django.contrib.auth.mixins import UserPassesTestMixin,LoginRequiredMixin
from django.urls import reverse_lazy
from django.contrib.auth.decorators import login_required
#from rest_framwork_simplejwt.token import RefreshToken
from rest_framework import generics ,status,permissions
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from allauth.socialaccount.models import SocialToken,SocialAccount
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json
from .serializers import UserProfileSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser



class UserProfileListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [AllowAny]

class ProfileAPIView(APIView):
    permission_classes = [AllowAny] 
    def get(self, request, pk, *args, **kwargs):
        try:
            profile = UserProfile.objects.get(pk=pk)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        user = profile.user
#        posts = Post.objects.filter(author=user)
        followers = profile.followers.all()
        is_following = request.user in followers

        # Serialize the profile data, passing the request context
        serializer = UserProfileSerializer(profile, context={'request': request})
        profile_data = serializer.data

        response_data = {
            'user': profile_data['user'],
            'profile': profile_data,
#            'posts': posts_data,
            'number_of_followers': followers.count(),
            'is_following': is_following,
        }

        return Response(response_data, status=status.HTTP_200_OK)

class ProfileEditAPIView(generics.UpdateAPIView):
    queryset = UserProfile.objects.all()
    authentication_classes = [JWTAuthentication]
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Ensure users can only update their own profile."""
        return UserProfile.objects.filter(user=self.request.user)

    def get_object(self):
        """Restrict access to the profile owner."""
        profile = get_object_or_404(UserProfile, pk=self.kwargs["pk"])
        if self.request.user != profile.user:
            self.permission_denied(self.request, message="You do not have permission to edit this profile.")
        return profile


class AddFollower(LoginRequiredMixin, View):
    def post(self, request, pk, *args, **kwargs):
        profile = UserProfile.objects.get(pk=pk)
        profile.followers.add(request.user)

        notification = Notification.objects.create(notification_type=3, from_user=request.user,to_user=profile.user)


        return redirect('accounts:profile', pk=profile.pk)

class RemoveFollower(LoginRequiredMixin, View):
    def post(self, request, pk, *args, **kwargs):
        profile = UserProfile.objects.get(pk=pk)
        profile.followers.remove(request.user)

        return redirect('accounts:profile', pk=profile.pk)
    

class UserSearch(View):
    def get(self, request, *args, **kwargs):
        query = self.request.GET.get('query')

        profile_list = UserProfile.objects.filter(
            Q(user__username__icontains=query)
        )

        context = {
            'profile_list': profile_list
        }

        return render(request, 'accounts/search.html', context)
    
class ListFollowers(View):
    def get(self, request, pk, *args, **kwargs):
        profile = UserProfile.objects.get(pk=pk)
        followers = profile.followers.all()

        context = {
            'profile': profile,
            'followers': followers,
        }

        return render(request, 'accounts/followers_list.html', context)