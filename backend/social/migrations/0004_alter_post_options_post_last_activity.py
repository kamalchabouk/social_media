# Generated by Django 5.1.3 on 2025-01-18 18:04

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('social', '0003_alter_post_options_post_shared_body_post_shared_on_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='post',
            options={'ordering': ['-last_activity']},
        ),
        migrations.AddField(
            model_name='post',
            name='last_activity',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
