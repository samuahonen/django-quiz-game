from django.urls import path
from .views import *

urlpatterns = [
    path("test",Test.as_view()),
    path("game",GameAPI.as_view()),
    
]
