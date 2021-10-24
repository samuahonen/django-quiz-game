from django.urls import path
from .views import *

urlpatterns = [
    path("test",Test.as_view()),
    path("game",GameAPI.as_view()),
    path("answer",AnswerAPI.as_view()),
    path("stats",PlayerstatsAPI.as_view()),
    path("all-stats",AllStatsAPI.as_view()),
    

]
