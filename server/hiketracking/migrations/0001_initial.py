# Generated by Django 4.1.2 on 2022-11-06 16:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Hike',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30, unique=True)),
                ('length', models.IntegerField()),
                ('expected_time', models.IntegerField()),
                ('ascent', models.IntegerField()),
                ('start_point', models.CharField(max_length=100)),
                ('end_point', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=200)),
                ('track_file', models.FileField(upload_to='tracks')),
            ],
        ),
        migrations.CreateModel(
            name='HikeReferencePoint',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reference_point', models.CharField(max_length=100)),
                ('hike', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hiketracking.hike')),
            ],
        ),
        migrations.AddConstraint(
            model_name='hikereferencepoint',
            constraint=models.UniqueConstraint(fields=('hike', 'reference_point'), name='hikeref'),
        ),
    ]
