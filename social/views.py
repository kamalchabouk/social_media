from django.shortcuts import render,redirect,get_object_or_404
from django.urls import reverse_lazy
from django.http import HttpResponseRedirect,HttpResponse,JsonResponse,HttpResponseForbidden
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.contrib.auth.models import User
from django.views import View
from django.views.generic.edit import UpdateView, DeleteView
from django.db.models import Q
from .models import Post, Comment,Notification,ThreadModel,MessageModel
from .forms import PostForm, CommentForm,ThreadForm,MessageForm
from accounts.models import UserProfile




class PostListView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        logged_in_user =request.user
        posts = Post.objects.filter(
            author__profile__followers__in =[logged_in_user]
        ).order_by('-created_on')
        form = PostForm()

        context = {
            'post_list': posts,
            'form': form,
        }
        return render(request, 'social/post_list.html', context)

    def post(self, request, *args, **kwargs):
        logged_in_user =request.user
        posts = Post.objects.filter(
            author__profile__followers__in =[logged_in_user]
        ).order_by('-created_on')        
        form = PostForm(request.POST,request.FILES)

        if form.is_valid():
            new_post = form.save(commit=False)
            new_post.author = request.user
            new_post.save()

        context = {
            'post_list': posts,
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
        thread = ThreadModel.objects.get(pk=pk)
        if thread.receiver == request.user:
            receiver = thread.user
        else:
            receiver = thread.receiver

        message = MessageModel(
            thread=thread,
            sender_user=request.user,
            receiver_user=receiver,
            body=request.POST.get('message')
        )

        message.save()
        return redirect('thread', pk=pk)

""" class MessageView(View):
    def get(self, request, message_id):
        message = get_object_or_404(MessageModel, id=message_id)

        # Ensure only sender or receiver can access the message
        if request.user != message.sender_user and request.user != message.receiver_user:
            return HttpResponseForbidden('You are not authorized to view this message.')

        decrypted_body = message.get_decrypted_body()
        return JsonResponse({'body': decrypted_body, 'date': message.date}) """