from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from cryptography.fernet import Fernet
""" from django.conf import settings
from .services.encryption_service import EncryptionService """

class Post(models.Model):
    body =models.TextField()
    created_on = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='posts/images/', null=True, blank=True)
    video = models.FileField(upload_to='posts/videos/', null=True, blank=True)
    likes = models.ManyToManyField(User,blank=True,related_name='likes')
    dislikes = models.ManyToManyField(User,blank=True,related_name='dislike')


class Comment(models.Model):
    comment = models.TextField()
    created_on = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey('Post', on_delete=models.CASCADE)
    likes = models.ManyToManyField(User,blank=True,related_name='comment_likes')
    dislikes = models.ManyToManyField(User,blank=True,related_name='comment_dislikes')
    parent = models.ForeignKey('self', on_delete=models.CASCADE,blank=True,null=True,related_name='+')

    @property
    def children(self):
        return Comment.objects.filter(parent=self).order_by('-created_on').all()
    
    @property
    def is_parent(self):
        if self.parent is None:
            return True
        return False
    

class Notification(models.Model):
	# 1 = Like, 2 = Comment, 3 = Follow
	notification_type = models.IntegerField()
	to_user = models.ForeignKey(User, related_name='notification_to', on_delete=models.CASCADE, null=True)
	from_user = models.ForeignKey(User, related_name='notification_from', on_delete=models.CASCADE, null=True)
	post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
	comment = models.ForeignKey('Comment', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
	date = models.DateTimeField(default=timezone.now)
	user_has_seen = models.BooleanField(default=False)
     

class ThreadModel(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='+')
    receiver = models.ForeignKey(User,on_delete=models.CASCADE,related_name='+')


class MessageModel(models.Model):
    thread =models.ForeignKey('ThreadModel',related_name='+',on_delete=models.CASCADE, blank=True,null=True)
    sender_user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='+')
    receiver_user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='+')
    encrypted_body = models.TextField(blank=True, null=True)  # Encrypted field for message body
    body = models.CharField(max_length=1000)
    image = models.ImageField(upload_to='uploads/message_photos',blank=True,null=True)
    date = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

"""     def save(self, *args, **kwargs):
        encryption_service = EncryptionService(settings.ENCRYPTION_KEY)

        # Encrypt message body
        if self.body:
            self.encrypted_body = encryption_service.encrypt_text(self.body)
            self.body = None  # Clear plaintext after encryption

        # Encrypt image if present
        if self.image and not self._state.adding:  # Only encrypt on update
            encryption_service.encrypt_file(self.image.path)

        super().save(*args, **kwargs)

    def get_decrypted_body(self):
        encryption_service = EncryptionService(settings.ENCRYPTION_KEY)
        return encryption_service.decrypt_text(self.encrypted_body)

    def decrypt_image(self):
        if self.image:
            encryption_service = EncryptionService(settings.ENCRYPTION_KEY)
            encryption_service.decrypt_file(self.image.path) """