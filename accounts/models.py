from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User,primary_key=True,verbose_name='user',related_name='profile',on_delete=models.CASCADE)
    name = models.CharField(max_length=30 , blank=True , null=True)
    bio = models.TextField(max_length=500 , blank=True , null=True)
    birth_date = models.DateField(null=True,blank=True)
    location = models.CharField(max_length=100,blank=True , null=True)
    picture = models.ImageField(upload_to='uploads/profile_pictures', default='uploads/profile_pictures/default.png',blank=True) 


