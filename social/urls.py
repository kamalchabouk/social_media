from django.urls import path
from .views import (
    PostListView,
    PostDetailView,
    PostEditView,
    PostDeleteView,
    CommentDeleteView,
    AddCommentLike,
    AddCommentDislike,
    CommentUpdateView,
    AddLike,
    AddDisLike,
    CommentReplyView,
    PostNotification,
    FollowNotification,
    RemoveNotification
)


urlpatterns = [
    path('', PostListView.as_view(), name='post-list'),
    path('post/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('post/edit/<int:pk>/', PostEditView.as_view(), name='post-edit'),
    path('post/delete/<int:pk>/', PostDeleteView.as_view(), name='post-delete'),
    path('post/<int:post_pk>/comment/delete/<int:pk>/', CommentDeleteView.as_view(), name='comment-delete'),
    path('post/<int:post_pk>/comment/<int:pk>/like', AddCommentLike.as_view(), name='comment-like'),
    path('post/<int:post_pk>/comment/<int:pk>/dislike', AddCommentDislike.as_view(), name='comment-dislike'),
    path('post/<int:post_pk>/comment/<int:pk>/reply',CommentReplyView.as_view(),name='comment-reply'),
    path('post/<int:post_pk>/comment/<int:pk>/edit',CommentUpdateView.as_view(),name='comment-edit'),
    path('post/<int:pk>/like', AddLike.as_view(), name='like'),
    path('post/<int:pk>/dislike', AddDisLike.as_view(), name='dislike'),
    path('notification/<int:notification_pk>/post/<int:post_pk>',PostNotification.as_view(),name='post-notification'),
    path('notification/<int:notification_pk>/post/<int:profile_pk>',FollowNotification.as_view(),name='follow-notification'),
    path('notification/delete/<int:notification_pk>',RemoveNotification.as_view(),name='notification-delete'),

]