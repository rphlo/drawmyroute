# Generated by Django 4.2.15 on 2024-09-19 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('routedb', '0023_alter_thumbup_route'),
    ]

    operations = [
        migrations.AddField(
            model_name='usersettings',
            name='date_fetched_likes',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
