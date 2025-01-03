from django import forms
from .models import UserProfile

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['name', 'bio', 'birth_date', 'location', 'picture','followers']
        widgets = {
            'birth_date': forms.DateInput(attrs={'type': 'date', 'placeholder': 'Enter your birth date'}),
            'name': forms.TextInput(attrs={'placeholder': 'Enter your full name'}),
            'bio': forms.Textarea(attrs={'placeholder': 'Write a short bio about yourself'}),
            'location': forms.TextInput(attrs={'placeholder': 'Enter your location'}),
        }

    birth_date = forms.DateField(widget=forms.DateInput(attrs={'type':'date'}))