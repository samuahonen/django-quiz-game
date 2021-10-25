from functools import partial
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render,get_object_or_404
from .models import *
from .serializers import *
from rest_framework import status
# Create your views here.




class GameAPI(APIView):
    def post(self,request):
        if not "game_code" in request.data:
            return Response({"detail":"code missing"},status=status.HTTP_404_NOT_FOUND)
        if not "username" in request.data:
            return Response({"detail":"username missing"},status=status.HTTP_404_NOT_FOUND)
        code = request.data["game_code"]
        username = request.data["username"]
        game = get_object_or_404(Game,code=code)
        serializer = GameSerializer(game)
        all_player = Player.objects.filter(game=game.id).filter(name=username)
        if all_player.exists():
            return Response({"detail":"username is taken"},status=status.HTTP_404_NOT_FOUND)
        player = Player.objects.create(name=username,game=game)
        return Response(serializer.data)

class AnswerAPI(APIView):
    def post(self,request):
        serializer = AnswerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"detail":"something missing"},status=status.HTTP_404_NOT_FOUND)
        game = get_object_or_404(Game,code=request.data["game_code"])
        player = Player.objects.filter(name=request.data["username"]).filter(game=game.id)
        question = game.questions.all()
        if question.count() < int(request.data["question"]):
            return Response({"detail":"question out of range"},status=status.HTTP_404_NOT_FOUND)
        if not player.exists():
            return Response({"detail":"username not exists"},status=status.HTTP_404_NOT_FOUND)
        player = player[0]
        if question[int(request.data["question"])-1].correct_answer == int(request.data["answer"]):
            player.score += 1
            player.save()
            return Response(True)
        return Response(False)
        

class PlayerstatsAPI(APIView):
    def get(self,request):
        if not "username" in request.GET:
            return Response({"detail":"username missing"},status=status.HTTP_404_NOT_FOUND)
        if not "game_code" in request.GET:
            return Response({"detail":"game code missing"},status=status.HTTP_404_NOT_FOUND)
        game = get_object_or_404(Game,code=request.GET["game_code"])
        player = Player.objects.filter(name=request.GET["username"]).filter(game=game.id)
        if not player.exists():
            return Response({"detail":"player not found"},status=status.HTTP_404_NOT_FOUND)
        player = player[0]
        serializer = PlayerSerializer(player)
        return Response(serializer.data)

class AllStatsAPI(APIView):
    def get(self,request):
        if not "game_code" in request.GET:
            return Response({"detail":"game code missing"},status=status.HTTP_404_NOT_FOUND)
        game = get_object_or_404(Game,code=request.GET["game_code"])
        players = Player.objects.filter(game=game.id).order_by("-score")
        serializer = PlayerSerializer(players,many=True)
        return Response(serializer.data)

class CreateGameAPI(APIView):
    def post(self,request):
        serializers = CreateGameSerializer(data=request.data)
        if not serializers.is_valid():
            return Response({"detail":"something missing"},status=status.HTTP_404_NOT_FOUND)
        all_questions = []
        for i in request.data["questions"]:
            question = Question.objects.create(question=i["question"],answer1=i["answer1"],answer2=i["answer2"],answer3=i["answer3"],correct_answer=i["correct_answer"])
            all_questions.append(question)
        game = Game.objects.create(name=request.data["name"])
        for i in all_questions:
            game.questions.add(i)
        return Response({"code":game.code})
        