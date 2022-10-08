import json
import pathlib
import os
import sys
from py2neo import Graph

parent_path = pathlib.Path(os.getcwd()).parent.absolute()
sys.path.append(str(parent_path))

from utils.general import read_csv, df_to_json
from utils.movies_with_metadata import \
    insert_movies, insert_movies_genres, \
    insert_movies_production_countries, insert_movies_production_companies, \
    insert_movies_spoken_languages, add_fastRP_embeddings

graph = Graph(
    "bolt://localhost:7687",
    auth=("neo4j", "admin"),
)

MOVIES_LIMIT = 100
SKIP_DATA_INSERT = False
SKIP_EMBEDDINGS_INSERT = False

if not SKIP_DATA_INSERT:
    movies_df = read_csv(
        filename="movies_metadata",
        parent_dir_name="movies_with_metadata",
    )
    movies_json = df_to_json(movies_df)

    insert_movies(graph, movies_json, MOVIES_LIMIT)
    insert_movies_genres(graph, movies_json)
    insert_movies_production_countries(graph, movies_json)
    insert_movies_production_companies(graph, movies_json)
    insert_movies_spoken_languages(graph, movies_json)
if not SKIP_EMBEDDINGS_INSERT:
    add_fastRP_embeddings(graph)
