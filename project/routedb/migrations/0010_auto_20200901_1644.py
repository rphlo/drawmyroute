# Generated by Django 3.1.1 on 2020-09-01 16:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("routedb", "0009_usersettings"),
    ]

    operations = [
        migrations.AlterField(
            model_name="usersettings",
            name="strava_access_token",
            field=models.TextField(),
        ),
    ]
