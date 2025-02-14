from rest_framework import serializers
from .models import Post,Image

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('id','image')

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id','name')




class PostSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True,source='image',read_only=True)
    image = serializers.listField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    likes =serializers.SerializerMethodField()
    dislikes =serializers.SerializerMethodField()
    tags = TagSerializer(many=True,read_only=True)


    class Meta:
        model = Post
        fields = ('id','author','body','created_on','image')