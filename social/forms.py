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
    image =forms.ImageField(required=False)
    class Meta:
        model = Post
        fields = ['body','image']


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



class ThreadForm(forms.Form):
    username = forms.CharField(label='',max_length=100)


class MessageForm(forms.Form):
    message = forms.CharField(label='',max_length=1000)