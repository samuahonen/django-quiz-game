from django.contrib import admin
from .models import *
from django.contrib.auth.models import User,Group
from django.contrib.auth.forms import forms
# Register your models here.

admin.site.unregister(User)
admin.site.unregister(Group)


class GameAdmin(admin.ModelAdmin):
   display = ("name","code")
   fields = ("name","questions")

admin.site.register(Question)
admin.site.register(Game,GameAdmin)
admin.site.register(Player)

