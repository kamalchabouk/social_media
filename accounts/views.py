from django.shortcuts import render
from .models import UserProfile
from django.views import View
from social.models import Post
from django.views.generic.edit import UpdateView,DeleteView
from django.contrib.auth.mixins import UserPassesTestMixin,LoginRequiredMixin
from django.urls import reverse_lazy


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
    
class ProfileEditView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = UserProfile
    fields = ['name', 'bio', 'birth_date', 'location', 'picture']
    template_name = 'accounts/profile_edit.html'

    def get_success_url(self):
        pk = self.kwargs['pk']
        return reverse_lazy('accounts:profile', kwargs={'pk': pk})

    def test_func(self):
        profile = self.get_object()
        return self.request.user == profile.user