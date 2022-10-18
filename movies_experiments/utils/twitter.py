from py2neo import Graph, Node, Relationship
from py2neo.bulk import merge_nodes
import ast

# main methods for movies metadata
def insert_users(graph: Graph, users):
    print("Creating users nodes...", end="  ")
    users_exclude_friends = map(
        lambda user: {
            "user_id": user["id"],
            "screenName": user["screenName"],
            "tags": user["tags"],
            "avatar": user["avatar"],
            "followersCount": user["followersCount"],
            "friendsCount": user["friendsCount"],
            "lang": user["lang"],
            "lastSeen": user["lastSeen"],
            "tweetId": user["tweetId"],
            "friends": user["friends"],
        }, users)
    merge_nodes(
        tx=graph.auto(),
        data=users_exclude_friends,
        merge_key=("User", "user_id"),
        labels={"User"}
    )
    print("OK")

def insert_users_tags(graph: Graph, users_json):
    print("Creating tags nodes...", end="  ")
    tags = set(user["tags"] for user in users_json)
    tags_json = [{ "id": id, "name": name } for id, name in enumerate(tags)]
    
    merge_nodes(
        tx=graph.auto(),
        data=tags_json,
        merge_key=("Tag", "name"),
        labels={"Tag"},
    )

    print("Attaching tags to users...", end="  ")
    users = graph.nodes.match("User")
    REL = Relationship.type("HAS_USED")
    for user_node in users:
        tags = user_node["tags"]
        for tag in tags:
            tag_node = graph.nodes.match("Tag", name=tag)
            graph.merge(REL(user_node, tag_node))
    print("OK")

def insert_friendships(graph: Graph):
    print("Attaching friends...", end="  ")
    users = graph.nodes.match("User").all()
    REL = Relationship.type("FOLLOWS")
    for user_node in users:
        friends = user_node["friends"]
        for friend_id in friends:
            friend_node = graph.nodes.match("User", user_id=friend_id).first()
            if friend_node:
                graph.merge(REL(user_node, friend_node))
    print("OK")

def add_fastRP_embeddings(graph: Graph):
    embeddings = [
        {
            "name": "fastRP_embedding_users_tags",
            "query": """
                ['User', 'Tag'],
                {
                    HAS_USED: {
                        orientation: 'UNDIRECTED'
                    }
                }
            """
        },
    ]

    for embedding in embeddings:
        name = embedding["name"]
        query = embedding["query"]
        add_fastRP_embedding(graph, name, query)

# helpers

def add_fastRP_embedding(graph: Graph, name, query):
    run_fastRP_projection(graph, name, query)
    write_fastRP_projection_embedding(graph, name)
    drop_fastRP_projection(graph, name)

def run_fastRP_projection(graph, name, query):
    print(f"Running projection... {name}", end="  ")
    graph.run(f"CALL gds.graph.project('{name}', {query})")
    print("OK")

def write_fastRP_projection_embedding(graph, name):
    print("Writting generated embeddings...", end="  ")
    graph.run(f"""
        CALL gds.fastRP.write(
            '{name}',
            {{
                embeddingDimension: 128,
                writeProperty: '{name}'
            }}
        )    
    """)
    print("OK")

def drop_fastRP_projection(graph, name):
    print("Dropping projection...", end="  ")
    graph.run(f"""
        CALL gds.graph.drop("{name}")
    """)
    print("OK")
