from rest_framework import serializers
from .models import Post,Image,Tag,Comment

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('id','image')

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id','name')

class CommentCreateSerializer(serializers.ModelSerializer):
    created_on = serializers.ReadOnlyField()
    author_username = serializers.ReadOnlyField(source='author.username')
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all(), write_only=True)

    class Meta:
        model = Comment
        fields = ['comment', 'post', 'parent', 'created_on', 'author_username']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user

        # The post is already present in validated_data, so we don't need to pass it manually
        post = validated_data['post']

        # Create the comment with the rest of the validated data (no need to pass post again)
        comment = Comment.objects.create( **validated_data)
        
        # If necessary, create tags for the comment
        
        
        return comment






class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    likes_count = serializers.SerializerMethodField()
    dislikes_count = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()  # Nested replies
    tags = TagSerializer(many=True, read_only=True)
    comment_author_picture = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id', 'comment', 'created_on', 'author_id', 'author_username', 
            'likes_count', 'dislikes_count', 'post', 'parent', 'replies', 'tags','comment_author_picture',
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_dislikes_count(self, obj):
        return obj.dislikes.count()

    def get_replies(self, obj):
        """Fetch nested comments (replies)"""
        if obj.is_parent:
            replies = obj.children  # Fetch replies
            return CommentSerializer(replies, many=True).data
        return []

    def get_comment_author_picture(self, obj):
        """Fetch the author's profile picture from UserProfile."""
        if obj.author.profile.picture:
            return obj.author.profile.picture.url
        return None 

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    shared_user_username = serializers.ReadOnlyField(source='shared_user.username', default=None)
    images = ImageSerializer(many=True, source='image', read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    dislikes_count = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, source='comment_set', read_only=True)
    author_picture = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'body', 'shared_body', 'created_on', 'shared_on',
            'author_id', 'author_username', 'visibility', 'shared_user_username',
            'images', 'video', 'likes_count', 'dislikes_count', 'tags', 'comments', 'author_picture',
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_dislikes_count(self, obj):
        return obj.dislikes.count()

    def get_author_picture(self, obj):
        """Fetch the author's profile picture from UserProfile."""
        if obj.author.profile.picture:
            return obj.author.profile.picture.url
        return None   # Return None if no picture exists


class PostCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), 
        write_only=True, 
        required=False
    )

    class Meta:
        model = Post
        fields = ['body', 'visibility', 'images', 'video']

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])  # Get list of images
        post = Post.objects.create(**validated_data)  # Create post without images

        # Save each image and associate it with the post
        for image in images_data:
            img = Image.objects.create(image=image)
            post.image.add(img)

        post.create_tags()
        return post


