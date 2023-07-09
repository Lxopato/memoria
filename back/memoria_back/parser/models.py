from django.db import models

# Create your models here.

class Graph(models.Model):
    input = models.CharField("input")
    output = models.CharField("output")

    