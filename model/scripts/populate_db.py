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
    insert_movies_spoken_languages, add_embeddings, \
    insert_movies_keywords, insert_users_ratings, insert_movies_links, delete_unrated_movies, \
    insert_movies_credits, create_search_indexes

def populate_db(
    graph,
    movies_limit=100,
    skip_data_insert=False,
    skip_embeddings_insert=False,
    data_dir="movies_with_metadata",
    use_small_dataset=True,
    use_custom_graph=False,
):
    print("Populating database...")
    
    if not graph:
        graph = Graph(
            "bolt://localhost:7687",
            auth=("neo4j", "admin"),
            name="neo4j-2",
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
                low_memory=False,
            )
        )
        keywords_json = df_to_json(
            read_csv(
                filename="keywords",
                parent_dir_name=data_dir,
            )
        )
        credits_json = df_to_json(
            read_csv(
                filename="credits",
                parent_dir_name=data_dir,
            )
        )
        links_json = df_to_json(
            read_csv(
                filename="links_small" if use_small_dataset else "links",
                parent_dir_name=data_dir,
            )
        )

        if use_custom_graph:
            movies_imdbIds_to_keep = read_csv(
                filename="movies_imdbIds_subgraph",
                parent_dir_name=data_dir,
                low_memory=False,
            ).values

            movies_tmdbIds_to_keep = read_csv(
                filename="movies_tmdbIds_subgraph",
                parent_dir_name=data_dir,
                low_memory=False,
            ).values

            users_to_keep = read_csv(
                filename="users_subgraph",
                parent_dir_name=data_dir,
                low_memory=False,
            ).values.T[0]

            users = set(int(u) for u in users_to_keep)
            ratings_json_subgraph = []
            for rating in ratings_json:
                user_id = rating["userId"]
                if user_id in users:
                    ratings_json_subgraph.append(rating)

        elif use_small_dataset:
            movies_imdbIds_to_keep = [link["imdbId"] for link in links_json]
            movies_tmdbIds_to_keep = [link["tmdbId"] for link in links_json]

        else:
            movies_imdbIds_to_keep = set([movie["imdbId"] for movie in movies_json[:movies_limit]])

        # save movies metadata and generate embeddings
        insert_movies(graph, movies_json, movies_imdbIds_to_keep)
        insert_movies_genres(graph, movies_json, movies_imdbIds_to_keep)
        insert_movies_production_countries(graph, movies_json, movies_imdbIds_to_keep)
        insert_movies_production_companies(graph, movies_json, movies_imdbIds_to_keep)
        insert_movies_spoken_languages(graph, movies_json, movies_imdbIds_to_keep)
        insert_movies_keywords(graph, keywords_json, movies_imdbIds_to_keep, movies_tmdbIds_to_keep)        
        
        insert_movies_credits(graph, credits_json, movies_tmdbIds_to_keep.T[0])
        if not skip_embeddings_insert:
            add_embeddings(graph)

        # save the users and the ratings
        insert_movies_links(graph, links_json)

        # add bypass with kept users ids (hashSet => O(1))
        insert_users_ratings(graph, ratings_json_subgraph, users_to_keep)

        # delete movies and users without rating edges
        # delete_unrated_movies(graph)

        create_search_indexes(graph)
    
    print("Completed!")

if __name__ == "__main__":
    graph = Graph(
        "bolt://localhost:7687",
        auth=("neo4j", "admin"),
        name="neo4j-2",
    )
    populate_db(graph=graph, use_small_dataset=False)