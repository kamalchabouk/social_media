from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse, HttpResponseForbidden
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.contrib.auth.models import User
from django.utils import timezone
from django.views import View
from django.views.generic.edit import UpdateView, DeleteView
from django.db.models import Q
from .models import Post, Comment, Notification, ThreadModel, MessageModel, Image, Tag
from .forms import PostForm, CommentForm, ThreadForm, MessageForm, ShareForm, ExploreForm
from accounts.models import UserProfile
from django.contrib import messages
from cryptography.fernet import Fernet
from django.conf import settings



class PostListView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        logged_in_user = request.user
        posts = Post.objects.filter(
            author__profile__followers__in=[logged_in_user.id]
        )
        form = PostForm()
        share_form = ShareForm()

        context = {
            'post_list': posts,
            'shareform':share_form,
            'form': form,
        }

        return render(request, 'social/post_list.html', context)

    def post(self, request, *args, **kwargs):
        logged_in_user = request.user
        posts = Post.objects.filter(
            author__profile__followers__in=[logged_in_user.id]
        )
        form = PostForm(request.POST, request.FILES)
        share_form = ShareForm()
        files = request.FILES.getlist('image')

        if form.is_valid():
            new_post = form.save(commit=False)
            new_post.author = request.user
            new_post.save()

            new_post.create_tags()

            for f in files:
                img = Image(image=f)
                img.save()
                new_post.image.add(img)

            new_post.save()

        context = {
            'post_list': posts,
            'shareform':share_form,
            'form': form,
        }

        return render(request, 'social/post_list.html', context)

class PostDetailView(LoginRequiredMixin, View):
    def get(self, request, pk, *args, **kwargs):
        post = Post.objects.get(pk=pk)
        form = CommentForm()
        comments = Comment.objects.filter(post=post).order_by('-created_on')

        context = {
            'post': post,
            'form': form,
            'comments': comments,
        }

        return render(request, 'social/post_detail.html', context)

    def post(self, request, pk, *args, **kwargs):
        post = Post.objects.get(pk=pk)
        form = CommentForm(request.POST)

        if form.is_valid():
            new_comment = form.save(commit=False)
            new_comment.author = request.user
            new_comment.post = post
            new_comment.save()

            new_comment.create_tags()
        
        comments = Comment.objects.filter(post=post).order_by('-created_on')

        notification = Notification.objects.create(notification_type=2, from_user=request.user,to_user=post.author,post=post)

        context = {
            'post': post,
            'form': form,
            'comments': comments,
        }

        return render(request, 'social/post_detail.html', context)

class CommentReplyView(LoginRequiredMixin,View):
    def post(self, request, post_pk, pk , *args, **kwargs):
        post = Post.objects.get(pk=post_pk)
        parent_comment = Comment.objects.get(pk=pk)
        form = CommentForm(request.POST)

        if form.is_valid():
            new_comment = form.save(commit=False)
            new_comment.author = request.user
            new_comment.post = post
            new_comment.parent = parent_comment
            new_comment.save()

        notification = Notification.objects.create(notification_type=2, from_user=request.user,to_user=parent_comment.author,comment=new_comment)



        return redirect('post-detail',pk=post_pk)
    


class CommentUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Comment
    fields = ['comment']  # Only allow editing the comment text
    template_name = 'social/comment_edit.html'

    def get_success_url(self):
        pk = self.object.post.pk  # Redirect to the associated post after editing
        return reverse_lazy('post-detail', kwargs={'pk': pk})

    def test_func(self):
        comment = self.get_object()
        return self.request.user == comment.author
    

class PostEditView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Post
    fields = ['body']
    template_name = 'social/post_edit.html'
    
    def get_success_url(self):
        pk = self.kwargs['pk']
        return reverse_lazy('post-detail', kwargs={'pk': pk})
    
    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author

class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Post
    template_name = 'social/post_delete.html'
    success_url = reverse_lazy('post-list')

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author


class SharedPostView(View):
    def post(self, request, pk, *args, **kwargs):
        original_post = get_object_or_404(Post, pk=pk)
        form = ShareForm(request.POST)

        if form.is_valid():
            new_post = Post(
                shared_body=form.cleaned_data['body'],
                body=original_post.body,
                author=original_post.author,
                created_on=original_post.created_on,
                shared_user=request.user,
                shared_on=timezone.now(),
            )
            new_post.save()

            # Link all images from the original post
            new_post.image.set(original_post.image.all())
            new_post.save()

        return redirect('post-list')

class CommentDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Comment
    template_name = 'social/comment_delete.html'

    def get_success_url(self):
        pk = self.kwargs['post_pk']
        return reverse_lazy('post-detail', kwargs={'pk': pk})

    def test_func(self):
        comment = self.get_object()
        post = comment.post
        return self.request.user == comment.author or self.request.user == post.author


class AddLike(LoginRequiredMixin,View):
    def post(self, request, pk, *args, **kwargs):
        post = Post.objects.get(pk=pk)


        is_dislike = False
        
        for dislike in post.dislikes.all():
            if dislike == request.user:
                is_dislike = True
                break
        
        if is_dislike:
            post.dislikes.remove(request.user)
        
        is_like = False

        for like in post.likes.all():
            if like == request.user:
                is_like = True
                break

        if not is_like:
            post.likes.add(request.user)
            notification = Notification.objects.create(notification_type=1, from_user=request.user,to_user=post.author,post=post)

        if is_like:
            post.likes.remove(request.user)

        next = request.POST.get('next','/')

        return HttpResponseRedirect(next)
      

class AddDisLike(LoginRequiredMixin,View):
    def post(self, request, pk, *args, **kwargs):
        post =Post.objects.get(pk=pk)

        is_like = False

        for like in post.likes.all():
            if like == request.user:
                is_like = True
                break
        
        if is_like:
            post.likes.remove(request.user)


        is_dislike = False
        
        for dislike in post.dislikes.all():
            if dislike == request.user:
                is_dislike = True
                break

        if not is_dislike:
            post.dislikes.add(request.user)
            notification = Notification.objects.create(notification_type=1, from_user=request.user,to_user=post.author,post=post)


        if is_dislike:
            post.dislikes.remove(request.user)

        next = request.POST.get('next','/')

        return HttpResponseRedirect(next)


class AddCommentLike(LoginRequiredMixin,View):
    def post(self, request, pk, *args, **kwargs):
        comment = Comment.objects.get(pk=pk)


        is_dislike = False
        
        for dislike in comment.dislikes.all():
            if dislike == request.user:
                is_dislike = True
                break
        
        if is_dislike:
            comment.dislikes.remove(request.user)
        
        is_like = False

        for like in comment.likes.all():
            if like == request.user:
                is_like = True
                break

        if not is_like:
            comment.likes.add(request.user)
            notification = Notification.objects.create(notification_type=1, from_user=request.user,to_user=comment.author,comment=comment)


        if is_like:
            comment.likes.remove(request.user)

        next = request.POST.get('next','/')

        return HttpResponseRedirect(next)
      

class AddCommentDislike(LoginRequiredMixin,View):
    def post(self, request, pk, *args, **kwargs):
        comment = Comment.objects.get(pk=pk)

        is_like = False

        for like in comment.likes.all():
            if like == request.user:
                is_like = True
                break
        
        if is_like:
            comment.likes.remove(request.user)


        is_dislike = False
        
        for dislike in comment.dislikes.all():
            if dislike == request.user:
                is_dislike = True
                break

        if not is_dislike:
            comment.dislikes.add(request.user)

        if is_dislike:
            comment.dislikes.remove(request.user)

        next = request.POST.get('next','/')

        return HttpResponseRedirect(next)

class PostNotification(View):
    def get(self, request, notification_pk, post_pk, *args, **kwargs):
        notification = Notification.objects.get(pk=notification_pk)
        post =Post.objects.get(pk=post_pk)

        notification.user_has_seen= True
        notification.save()
        return redirect('post-detail',pk=post_pk)


class FollowNotification(View):

    def get(self, request, notification_pk, profile_pk, *args, **kwargs):
        notification = Notification.objects.get(pk=notification_pk)
        profile = UserProfile.objects.get(pk=profile_pk)

        notification.user_has_seen= True
        notification.save()
        return redirect('accounts:profile',pk=profile_pk)
    

class ThreadNotification(View):
    def get(self,request,notification_pk,object_pk,*args,**kwargs):
        notification = Notification.objects.get(pk=notification_pk)
        thread = ThreadModel.objects.get(pk=object_pk)

        notification.user_has_seen= True
        notification.save()
        return redirect('thread',pk=object_pk)
    

class RemoveNotification(View):
    def delete(self, request, notification_pk,*args,**kwargs):
        notification =Notification.objects.get(pk=notification_pk)

        notification.user_has_seen =True
        notification.save()


        return HttpResponse('Success',content_type='text/plain')
        

class ListThreads(View):
    def get(self, request, *args, **kwargs):
        threads = ThreadModel.objects.filter(Q(user=request.user) | Q(receiver=request.user))

        context = {
            'threads': threads
        }

        return render(request, 'social/inbox.html', context)

class CreateThread(View):
    def get(self, request, *args, **kwargs):
        form = ThreadForm()

        context = {
            'form': form
        }

        return render(request, 'social/create_thread.html', context)

    def post(self, request, *args, **kwargs):
        form = ThreadForm(request.POST)

        username = request.POST.get('username')
        
        try:
            receiver = User.objects.get(username=username)
            if ThreadModel.objects.filter(user=request.user, receiver=receiver).exists():
                thread = ThreadModel.objects.filter(user=request.user, receiver=receiver)[0]
                return redirect('thread', pk=thread.pk)
            elif ThreadModel.objects.filter(user=receiver, receiver=request.user).exists():
                thread = ThreadModel.objects.filter(user=receiver, receiver=request.user)[0]
                return redirect('thread', pk=thread.pk)

            if form.is_valid():
                thread = ThreadModel(
                    user=request.user,
                    receiver=receiver
                )
                thread.save()

                return redirect('thread', pk=thread.pk)
        except:
            messages.error(request,'Invalid username')
            return redirect('create-thread')

class ThreadView(View):
    def get(self, request, pk, *args, **kwargs):
        form = MessageForm()
        thread = ThreadModel.objects.get(pk=pk)
        message_list = MessageModel.objects.filter(thread__pk__contains=pk)
        
        context = {
            'thread': thread,
            'form': form,
            'message_list': message_list
        }

        return render(request, 'social/thread.html', context)

class CreateMessage(View):
    def post(self, request, pk, *args, **kwargs):
        fernet = Fernet(settings.ENCRYPT_KEY)
        form = MessageForm(request.POST, request.FILES)
        thread = ThreadModel.objects.get(pk=pk)
        if thread.receiver == request.user:
            receiver = thread.user
        else:
            receiver = thread.receiver

        if form.is_valid():
            message = form.save(commit=False)

            # enrypt the messages 
            message_original = form.cleaned_data['body']
            message_bytes = message_original.encode('utf-8')
            message_encrypted = fernet.encrypt(message_bytes)
            message_decoded = message_encrypted.decode('utf-8')
            message.body = message_decoded




            
            message.thread = thread
            message.sender_user = request.user
            message.receiver_user = receiver
            message.save()

        notification = Notification.objects.create(
            notification_type=4,
            from_user=request.user,
            to_user=receiver,
            thread=thread
        )
        return redirect('thread', pk=pk)
    



class Explore(View):
    def get(self, request, *args, **kwargs):
        query = self.request.GET.get('query')
        tag = Tag.objects.filter(name=query).first()
        explore_form = ExploreForm()

        if tag:
            posts = Post.objects.filter(tags__in=[tag])
        else:
            posts = Post.objects.all()

        context = {
            'tag' : tag,
            'posts': posts,
            'explore_form':explore_form,
        }

        return render(request, 'social/explore.html', context)
    
    def post(self,request,*args,**kwargs):
        explore_form = ExploreForm(request.POST)
        if explore_form.is_valid():
            query = explore_form.cleaned_data['query']
            tag = Tag.objects.filter(name=query).first()

            posts = None
            if tag:
                posts = Post.objects.filter(tags__in=[tag])
            
            if posts:
                context = {
                    'tag': tag,
                    'posts':posts,
                }
            else:
                context = {
                    'tag': tag,
                }

            return HttpResponseRedirect(f'/social/explore?query={query}')
        return HttpResponseRedirect('/social/explore')
