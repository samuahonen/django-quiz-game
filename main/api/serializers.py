from django.db.models.fields import IntegerField
from rest_framework import serializers
from .models import *

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id","question","answer1","answer2","answer3"]


class GameSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    class Meta:
        model = Game
        fields = ["name","code","questions"]

class AnswerSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    answer = serializers.IntegerField(min_value=1,max_value=3)
    question = serializers.IntegerField()
    game_code = serializers.CharField(max_length=6)


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ["name","score"]

class CreateQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"
    
class CreateGameSerializer(serializers.Serializer):
    questions = CreateQuestionSerializer(many=True)
    name = serializers.CharField(max_length=50)
