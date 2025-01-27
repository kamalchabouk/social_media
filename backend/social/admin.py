from django.contrib import admin
from .models import Post,Comment,Notification,MessageModel,ThreadModel,Tag,Image

admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Notification)
admin.site.register(MessageModel)
admin.site.register(ThreadModel)
admin.site.register(Tag)
admin.site.register(Image)

