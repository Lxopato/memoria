from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Graph
from .serializers import *
from django.conf import settings
from django.db import connection

import psycopg2


import os
import csv
import itertools
import random

@api_view(['GET', 'POST'])
def create_graph(request):
    if request.method == "GET":
        chunk_size = 20000
        cursor = connection.cursor()
        cursor.execute("DROP TABLE IF EXISTS grafo;")
        cursor.execute("CREATE TABLE grafo(input VARCHAR(100000), output VARCHAR(100000));")
        query = f"INSERT INTO grafo (input, output) VALUES %s"
        with open(os.path.join(settings.BASE_DIR, "data/wiki-Talk.e")) as graph_file:
            reader = csv.reader(graph_file, delimiter=" ")
            rows = []
            for row in reader:
                rows.append((row[0], row[1]))
                if len(rows) == chunk_size:
                    print("insert chunk")
                    psycopg2.extras.execute_values(cursor, query, rows)
                    connection.commit()
                    rows = []
            if rows:
                psycopg2.extras.execute_values(cursor, query, rows)
                connection.commit()
            # for row in itertools.islice(reader, 1000):
               # cursor.execute("INSERT INTO grafo (input, output) VALUES (" + row[0] + "," + row[1] + ");" )
        #cursor.execute("SELECT * FROM grafo;")
        print("created table")
        cursor.close()
        return Response("created table")
    
    if request.method == "POST":
        print("aaaaaaaaaaa")
        vertices = int(request.data.get("input"))
        cursor = connection.cursor()
        cursor.execute("DROP TABLE IF EXISTS grafo;")
        cursor.execute("CREATE TABLE grafo(input VARCHAR(100000), output VARCHAR(100000));")
        edges = []
        for i in range(1, vertices + 1):
            for j in range(i + 1, vertices + 1):
                if random.random() < 0.5:
                    edges.append((i, j))
        for edge in edges:
            cursor.execute("INSERT INTO grafo (input, output) VALUES (" + str(edge[0]) + "," + str(edge[1]) + ");" )
        print("created table")

        cursor.execute("SELECT * FROM grafo LIMIT 100;")
        
        result = cursor.fetchall()
        cursor.close()
        print(result)
        return Response(result)                
    

@api_view(['POST'])
def execute_query(request):
    if request.method == "GET":
        #print(request.__dict__)

        return Response()

    if request.method == "POST":
        #print(request.__dict__)
        cursor = connection.cursor()
        cursor.execute(request.data.get("input"))
        result = cursor.fetchall()
        print(result)

        return Response(result)
