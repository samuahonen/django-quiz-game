from django.db import models
from django.db.models.fields import CharField
import secrets

# Create your models here.
class Question(models.Model):
    question = models.CharField(max_length=50)
    correct_answer = models.CharField(max_length=50)
    wrong_answer1 = models.CharField(max_length=50)
    wrong_answer2 = models.CharField(max_length=50)

    

    def __str__(self):
        return self.question

class Game(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=6)
    questions = models.ManyToManyField(Question)

    def save(self, *args, **kwargs):
        if self.code == "":
            while True:
                code = secrets.token_hex(3)
                self.code = code
                all_codes = Game.objects.filter(code=code)
                if not all_codes.exists():
                    break
        super(Game,self).save(*args, **kwargs)

        
    def __str__(self):
        return f"Name: {self.name}, Code: {self.code}"

class Player(models.Model):
    name = models.CharField(max_length=50)
    score = models.IntegerField(blank=True,default=0)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)

    def __str__(self):
        return f"Name: {self.name}, Score {self.score}"