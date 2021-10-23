# Generated by Django 3.2.8 on 2021-10-23 20:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='code',
            field=models.CharField(max_length=6),
        ),
        migrations.AlterField(
            model_name='player',
            name='score',
            field=models.IntegerField(blank=True, default=0),
        ),
    ]