from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    # Modify the `user` field to return the user ID as a number to be able to fetch from the frontend
    user = serializers.IntegerField(source='user.id', read_only=True)  # Keep this read-only
    # Modify the `name` field to return the user's username
    user_name = serializers.CharField(source='user.username', default=None)
    picture = serializers.ImageField(required=False, allow_null=True)

    birth_date = serializers.DateField(format="%d/%m/%Y", required=False, allow_null=True)
    followers = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['user', 'user_name', 'name', 'bio', 'birth_date', 'location', 'picture', 'followers']

        read_only_fields = ['user', 'user_name']  # Keep user and username read-only

    def get_followers(self, obj):
        return [user.username for user in obj.followers.all()]

    def update(self, instance, validated_data):
        # Avoid updating the 'user' field since it's tied to the request user
        validated_data.pop('user', None)  # Ensure 'user' isn't included in the update data
        
        # Keep existing values for fields if they are not provided in the update request
        if 'name' in validated_data:
            instance.name = validated_data['name']
        if 'bio' not in validated_data:
            validated_data['bio'] = instance.bio
        if 'birth_date' not in validated_data:
            validated_data['birth_date'] = instance.birth_date
        if 'location' not in validated_data:
            validated_data['location'] = instance.location
        if 'picture' not in validated_data:
            validated_data['picture'] = instance.picture  # Keep existing picture if not updated

        return super().update(instance, validated_data)

    def get_picture(self, obj):
        """Build an absolute URI for the picture."""
        request = self.context.get('request')
        if obj.picture:
            return request.build_absolute_uri(obj.picture.url)
        return request.build_absolute_uri("/media/uploads/profile_pictures/default.png")  # Default image if no picture
