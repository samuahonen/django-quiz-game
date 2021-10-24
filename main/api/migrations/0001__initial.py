from django.db import migrations, models
import django.db.models.deletion
from django.core.validators import MaxValueValidator, MinValueValidator


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('code', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=50)),
                ('answer1', models.CharField(max_length=50)),
                ('answer2', models.CharField(max_length=50)),
                ('answer3', models.CharField(max_length=50)),
                ('correct_answer',models.IntegerField(
        default=1,
        validators=[
            MaxValueValidator(3),
            MinValueValidator(1)
        ]
     ))
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('score', models.IntegerField()),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.game')),
            ],
        ),
        migrations.AddField(
            model_name='game',
            name='questions',
            field=models.ManyToManyField(to='api.Question'),
        ),
    ]