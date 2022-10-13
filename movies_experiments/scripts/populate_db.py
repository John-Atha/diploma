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
    insert_movies_spoken_languages, add_fastRP_embeddings, \
    insert_movies_keywords, insert_users_ratings

def populate_db(
    graph,
    movies_limit=100,
    skip_data_insert=False,
    skip_embeddings_insert=False,
    data_dir="movies_with_metadata",
    use_small_dataset=True,
):
    print("Populating database...")
    
    if not graph:
        graph = Graph(
            "bolt://localhost:7687",
            auth=("neo4j", "admin"),
        )

    if not skip_data_insert:

        ratings_json = df_to_json(
            read_csv(
                filename="ratings_small" if use_small_dataset else "ratings",
                parent_dir_name=data_dir,
            )
        )
        movies_json = df_to_json(
            read_csv(
                filename="movies_metadata",
                parent_dir_name=data_dir,
            )
        )
        keywords_json = df_to_json(
            read_csv(
                filename="keywords",
                parent_dir_name=data_dir,
            )
        )

        movies_ids_to_keep = []
        if use_small_dataset: 
            movies_ids_to_keep = [rating["movieId"] for rating in ratings_json]
        else:
            movies_ids_to_keep = set([movie["id"] for movie in movies_json[:movies_limit]])

        # save movies metadata and generate embeddings
        insert_movies(graph, movies_json, movies_ids_to_keep)
        insert_movies_genres(graph, movies_json, movies_ids_to_keep)
        insert_movies_production_countries(graph, movies_json, movies_ids_to_keep)
        insert_movies_production_companies(graph, movies_json, movies_ids_to_keep)
        insert_movies_spoken_languages(graph, movies_json, movies_ids_to_keep)
        insert_movies_keywords(graph, keywords_json, movies_ids_to_keep)        
        if not skip_embeddings_insert:
            add_fastRP_embeddings(graph)

        # save the users and the ratings
        insert_users_ratings(graph, ratings_json)
    
    print("Completed!")

if __name__ == "__main__":
    graph = Graph(
        "bolt://localhost:7687",
        auth=("neo4j", "admin"),
    )
    populate_db(graph=graph)