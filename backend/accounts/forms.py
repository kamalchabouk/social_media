from django import forms
from .models import UserProfile

class UserProfileForm(forms.ModelForm):
    birth_date = forms.DateField(
        input_formats=['%d-%m-%Y'],  # Accepts d-m-Y format
        widget=forms.DateInput(attrs={'type': 'date'})
    )
    class Meta:
        model = UserProfile
        fields = ['name', 'bio', 'birth_date', 'location', 'picture']
        widgets = {
            'birth_date': forms.DateInput(attrs={'type': 'date', 'placeholder': 'Enter your birth date'}),
            'name': forms.TextInput(attrs={'placeholder': 'Enter your full name'}),
            'bio': forms.Textarea(attrs={'placeholder': 'Write a short bio about yourself'}),
            'location': forms.TextInput(attrs={'placeholder': 'Enter your location'}),
        }

