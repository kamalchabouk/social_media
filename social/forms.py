from django import forms
from .models import Post,Comment

class PostForm(forms.ModelForm):
    body = forms.CharField(
        label='',
        widget=forms.Textarea(
            attrs={
                'placeholder': 'Share something with the world...',
                'class': 'form-control',
                'rows': 3,
            }
        )
    )
    class Meta:
        model = Post
        fields = ['body','image','video']


class CommentForm(forms.ModelForm):
    comment = forms.CharField(
        label='',
        widget=forms.Textarea(
            attrs={
                'placeholder': 'Write your Comment here...',
                'rows': 3,
            }
        )
    )

    class Meta:
        model = Comment
        fields = ['comment']

