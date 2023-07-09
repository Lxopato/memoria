from rest_framework import serializers
from .models import Graph

class GraphSerializer(serializers.ModelSerializer):

    class Meta:
        model = Graph
        fields = ("pk", "input", "output")