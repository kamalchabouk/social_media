# Generated by Django 5.1.3 on 2025-01-14 16:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('social', '0010_notification_thread'),
    ]

    operations = [
        migrations.AlterField(
            model_name='messagemodel',
            name='body',
            field=models.TextField(blank=True, null=True),
        ),
    ]
