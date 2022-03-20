# Generated by Django 3.1.1 on 2020-11-27 15:40

import utils.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("routedb", "0014_auto_20201017_0631"),
    ]

    operations = [
        migrations.AddField(
            model_name="rastermap",
            name="_latitude",
            field=models.FloatField(
                default=0, validators=[utils.validators.validate_latitude]
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="rastermap",
            name="_longitude",
            field=models.FloatField(
                default=0, validators=[utils.validators.validate_longitude]
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="rastermap",
            name="country",
            field=models.CharField(default="-", max_length=2),
            preserve_default=False,
        ),
    ]
