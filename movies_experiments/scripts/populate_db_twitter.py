import pathlib
import os
import sys
from py2neo import Graph

parent_path = pathlib.Path(os.getcwd()).parent.absolute()
sys.path.append(str(parent_path))

from utils.general import read_csv, df_to_json
from utils.twitter import \
    insert_users, insert_users_tags, \
    insert_friendships, add_fastRP_embeddings

def populate_db(
    graph,
    skip_data_insert=False,
    skip_embeddings_insert=False,
    data_dir="twitter_data",
):
    print("Populating database...")
    
    if not graph:
        graph = Graph(
            "bolt://localhost:7687",
            auth=("neo4j", "admin"),
        )

    if not skip_data_insert:

        users_json = df_to_json(
            read_csv(
                filename="data",
                parent_dir_name=data_dir,
                low_memory=True,
                sep=',(?=\S)',
            )
        )[:1000]

    #     # save movies metadata and generate embeddings
        insert_users(graph, users_json)
        insert_users_tags(graph, users_json)
        insert_friendships(graph)
    #     if not skip_embeddings_insert:
    #         add_fastRP_embeddings(graph)

    print("Completed!")

if __name__ == "__main__":
    graph = Graph(
        "bolt://localhost:7687",
        auth=("neo4j", "admin"),
    )
    populate_db(graph=graph)