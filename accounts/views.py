from django.shortcuts import render
from .models import UserProfile
from django.views import View
from social.models import Post


class ProfileView(View):
    def get(self,request,pk,*args,**kwargs):
        profile = UserProfile.objects.get(pk=pk)
        user = profile.user
        posts = Post.objects.filter(author=user).order_by('created_on')

        context = {
            'user': user,
            'profile': profile,
            'posts': posts,
        }
        return render(request, 'accounts/profile.html', context)