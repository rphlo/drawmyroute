# Generated by Django 3.2.14 on 2022-07-31 06:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('routedb', '0019_auto_20220718_1755'),
    ]

    operations = [
        migrations.AddField(
            model_name='route',
            name='is_private',
            field=models.BooleanField(default=False),
        ),
    ]
