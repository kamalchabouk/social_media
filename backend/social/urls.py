from django.urls import path
from .views import *


urlpatterns = [
    path('posts/', PostListAPIView.as_view(), name='post-list'),
    path('post/create/', PostCreateAPIView.as_view(), name='post-create'),
    path('post/<int:pk>/', PostDetailAPIView.as_view(), name='post-detail'),
    path('post/<int:pk>/comment/', CommentCreateAPIView.as_view(), name='comment-create'),
    path("post/<int:post_id>/delete/", PostDeleteView.as_view(), name="post-delete"),
    path('post/<int:post_pk>/comments/<int:comment_pk>/', CommentDetailAPIView.as_view(), name='comment-detail'),
    path('post/<int:pk>/edit/', PostEditAPIView.as_view(), name='post-edit'),
#    path('post/edit/<int:post_pk>/', PostEditView.as_view(), name='post-edit'),
#    path('post/delete/<int:post_pk>/', PostDeleteView.as_view(), name='post-delete'),
#    path('post/<int:post_pk>/comment/delete/<int:pk>/', CommentDeleteView.as_view(), name='comment-delete'),
#    path('post/<int:post_pk>/comment/<int:pk>/like', AddCommentLike.as_view(), name='comment-like'),
#    path('post/<int:post_pk>/comment/<int:pk>/dislike', AddCommentDislike.as_view(), name='comment-dislike'),
#    path('post/<int:post_pk>/comment/<int:pk>/reply',CommentReplyView.as_view(),name='comment-reply'),
#    path('post/<int:post_pk>/comment/<int:pk>/edit',CommentUpdateView.as_view(),name='comment-edit'),
#    path('post/<int:pk>/share',SharedPostView.as_view(),name='share-post'),
    path('post/<int:pk>/like', AddLike.as_view(), name='like'),
    path('post/<int:pk>/dislike', AddDisLike.as_view(), name='dislike'),
    path('notification/<int:notification_pk>/post/<int:post_pk>',PostNotification.as_view(),name='post-notification'),
    path('notification/<int:notification_pk>/post/<int:profile_pk>',FollowNotification.as_view(),name='follow-notification'),
    path('notification/delete/<int:notification_pk>',RemoveNotification.as_view(),name='notification-delete'),
    path('notification/<int:notification_pk>/thread/<int:object_pk>',ThreadNotification.as_view(),name='thread-notification'),
    path('inbox/',ListThreads.as_view(),name='inbox'),
    path('inbox/create-thread',CreateThread.as_view(),name='create-thread'),
    path('inbox/<int:pk>/',ThreadView.as_view(),name='thread'),
    path('inbox/<int:pk>/create-message',CreateMessage.as_view(),name='create-message'),
    path('explore/',Explore.as_view(),name='explore'),
]