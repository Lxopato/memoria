from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .serializers import *
from django.conf import settings
from django.db import connection

import psycopg2


import os
import csv
import random

@api_view(['GET', 'POST'])
def create_graph(request):
    if request.method == "GET":
        chunk_size = 20000
        cursor = connection.cursor()
        cursor.execute("DROP TABLE IF EXISTS edges;")
        cursor.execute("CREATE TABLE edges(source_vertex INTEGER, target_vertex INTEGER, weight INTEGER);")
        query = f"INSERT INTO edges(source_vertex, target_vertex, weight) VALUES %s"
        with open(os.path.join(settings.BASE_DIR, "data/planarity_testing.e")) as graph_file:
            reader = csv.reader(graph_file, delimiter=" ")
            rows = []
            for row in reader:
                weight = random.randint(1, 10)
                rows.append((row[0], row[1], weight))
                if len(rows) == chunk_size:
                    print("insert chunk")
                    psycopg2.extras.execute_values(cursor, query, rows)
                    connection.commit()
                    rows = []
            if rows:
                psycopg2.extras.execute_values(cursor, query, rows)
                connection.commit()
        print("created table")
        cursor.execute("SELECT * FROM edges LIMIT 100;")
        result = cursor.fetchall()
        cursor.close()
        return Response(result)
    
    if request.method == "POST":
        vertices = int(request.data.get("input"))
        cursor = connection.cursor()
        cursor.execute("DROP TABLE IF EXISTS edges;")
        cursor.execute("CREATE TABLE edges(source_vertex INTEGER, target_vertex INTEGER, weight INTEGER);")
        edges = []
        for i in range(1, vertices + 1):
            for j in range(i + 1, vertices + 1):
                if random.random() < 0.05:
                    weight = random.randint(1, 10)
                    edges.append((i, j, weight))
        for edge in edges:
            cursor.execute("INSERT INTO edges (source_vertex, target_vertex, weight) VALUES (" + str(edge[0]) + "," + str(edge[1]) + "," + str(edge[2]) + ");" )
        print("created table")

        cursor.execute("SELECT * FROM edges LIMIT 100;")
        
        result = cursor.fetchall()
        cursor.close()
        print(result)
        return Response(result)                
    

@api_view(['POST'])
def execute_query(request):
    if request.method == "GET":
        return Response()

    if request.method == "POST":
        cursor = connection.cursor()
        print(request.data.get("input"))
        cursor.execute(request.data.get("input"))
        colnames = [desc[0] for desc in cursor.description]
        print(colnames)
        result = cursor.fetchall()
        print(result)

        analyze_query = "EXPLAIN ANALYZE " + request.data.get("input")
        cursor.execute(analyze_query)
        analyze_result = cursor.fetchall()
        print(analyze_result)

        response = {
            "query": result,
            "colnames": colnames, 
            "analyze": analyze_result
        }
        return Response(response)
