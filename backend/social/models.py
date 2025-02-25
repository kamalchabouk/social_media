from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from cryptography.fernet import Fernet
from django.conf import settings

class Post(models.Model):
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('followers', 'Followers Only'),
    ]
    shared_body = models.TextField(blank=True,null=True)
    body =models.TextField()
    created_on = models.DateTimeField(default=timezone.now)
    shared_on = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='public')
    shared_user= models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True,related_name='+')
    image = models.ManyToManyField('Image', blank=True)
    video = models.FileField(upload_to='posts/videos/', null=True, blank=True)
    likes = models.ManyToManyField(User,blank=True,related_name='likes')
    dislikes = models.ManyToManyField(User,blank=True,related_name='dislike')
    tags = models.ManyToManyField('Tag',blank=True)
    
    def create_tags(self):
        for word in self.body.split():
            if (word[0] == '#'):
                tag = Tag.objects.filter(name=word[1:]).first()
                if tag:
                    self.tags.add(tag.pk)
                else:
                    tag = Tag(name=word[1:])
                    tag.save()
                    self.tags.add(tag.pk)

                self.save()

        if self.shared_body:
            for word in self.shared_body.split():
                if (word[0] == '#'):
                    tag = Tag.objects.filter(name=word[1:]).first()
                    if tag:
                        self.tags.add(tag.pk)
                    else:
                        tag = Tag(name=word[1:])
                        tag.save()
                        self.tags.add(tag.pk)

                    self.save()
                     

    class Meta:
        ordering = ['-created_on', '-shared_on']

        
class Image(models.Model):
	image = models.ImageField(upload_to='uploads/post_photos', blank=True, null=True)
     

class Tag (models.Model):
     name = models.CharField(max_length=35)


class Comment(models.Model):
    comment = models.TextField()
    created_on = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey('Post', on_delete=models.CASCADE)
    likes = models.ManyToManyField(User,blank=True,related_name='comment_likes')
    dislikes = models.ManyToManyField(User,blank=True,related_name='comment_dislikes')
    parent = models.ForeignKey('self', on_delete=models.CASCADE,blank=True,null=True,related_name='+')
    tags = models.ManyToManyField('Tag',blank=True)

    def create_tags(self):
        for word in self.comment.split():
            if (word[0] == '#'):
                tag = Tag.objects.filter(name=word[1:]).first
                if tag:
                    self.tags.add(tag.pk)
                else:
                    tag = Tag(name=word[1:])
                    tag.save()
                    self.tags.add(tag.pk)

                self.save()


        for word in self.shared_body.split():
            if (word[0] == '#'):
                tag = Tag.objects.filter(name=word[1:]).first
                if tag:
                    self.tags.add(tag.pk)
                else:
                    tag = Tag(name=word[1:])
                    tag.save()
                    self.tags.add(tag.pk)

                self.save()

    @property
    def children(self):
        return Comment.objects.filter(parent=self).order_by('-created_on').all()
    
    @property
    def is_parent(self):
        if self.parent is None:
            return True
        return False
    

class Notification(models.Model):
	# 1 = Like, 2 = Comment, 3 = Follow, #4 = DM
	notification_type = models.IntegerField()
	to_user = models.ForeignKey(User, related_name='notification_to', on_delete=models.CASCADE, null=True)
	from_user = models.ForeignKey(User, related_name='notification_from', on_delete=models.CASCADE, null=True)
	post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
	comment = models.ForeignKey('Comment', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
	thread = models.ForeignKey('ThreadModel', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
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
    body = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='uploads/message_photos',blank=True,null=True)
    date = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

    @property
    def body_decrypted(self):
        """
        Decrypts the encrypted body if it's valid. Returns None or a fallback message if not decryptable.
        """
        if not self.body:
            return ('not working')  # No message body to decrypt
        try:
            fernet = Fernet(settings.ENCRYPT_KEY)
            decrypted_message = fernet.decrypt(self.body.encode('utf-8'))
            return decrypted_message.decode('utf-8')
        except Exception as e:
            return "Unable to decrypt message"  # Fallback message

