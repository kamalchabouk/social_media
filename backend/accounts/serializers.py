from rest_framework import serializers
from .models import UserProfile
from social.models import Post
from django.contrib.auth.models import User


class UserProfileSerializer(serializers.ModelSerializer):
    # Modify the `user` field to return the user ID as a number to be able to fetch from the frontend 
    user = serializers.IntegerField(source='user.id')
    # Modify the `name` field to return the user's name instead of `user` so the user can see their profile as there username
    user_name = serializers.CharField(source='user.username', default=None)
    picture = serializers.ImageField(required=False)
    class Meta:
        model = UserProfile
        fields = [ 'user','user_name', 'name', 'bio', 'birth_date', 'location', 'picture']

    def get_picture(self,obj):
        request =self.context.get("request")

        if obj.picture:
            return request.build_absolute_uri(obj.picture.url)
        return request.build_absolute_uri("/media/uploads/profile_pictures/default.png")       


