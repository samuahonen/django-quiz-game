from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render,get_object_or_404
from .models import *
from .serializers import *
# Create your views here.

class Test(APIView):
    def get(self, request):
        return Response("toimii")


class GameAPI(APIView):
    def post(self,request):
        print(request.data[0])
        if not "code" in request.data[0]:
            return Response([{"error":"code missing"}])
        if not "username" in request.data[0]:
            return Response({"error":"username missing"})
        code = request.data[0]["code"]
        username = request.data[0]["username"]
        game = get_object_or_404(Game,code=code)
        serializer = GameSerializer(game)
        player = Player.objects.create(name=username,game=game)
        return Response(serializer.data)

class AnswerAPI(APIView):
    def post(self,request):
        pass