from django import forms
from .models import Post,Comment,MessageModel


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True

# Custom Field to handle multiple file uploads
class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('widget', MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = [single_file_clean(data, initial)]
        return result
    

class PostForm(forms.ModelForm):
    body = forms.CharField(
        label='',
        widget=forms.Textarea(attrs={
            'rows': '3',
            'placeholder': 'Say Something...'
            }))

    # Use MultipleFileField to handle multiple image uploads it only works this way on this django version
    image = MultipleFileField(
        required=False,
        widget=MultipleFileInput(attrs={
            'multiple': True  # Allows selecting multiple files in the form 
        })
    )

    class Meta:
        model = Post
        fields = ['body']


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


class MessageForm(forms.ModelForm):
    body = forms.CharField(label='', max_length=1000)

    image = forms.ImageField(required=False)

    class Meta:
        model = MessageModel
        fields = ['body', 'image']