import json
from py2neo import Graph, Node, Relationship
from py2neo.bulk import merge_nodes

# main methods
def insert_movies(graph: Graph, movies, limit: int):
    merge_nodes(
        tx=graph.auto(),
        data=movies[:limit],
        merge_key=("Movie", "title"),
        labels={"Movie"}
    )

def insert_movies_genres(graph: Graph, movies_json):
    create_helper_nodes(
        graph,
        movies_json,
        feature_name="genres",
        feature_key="name",
        merge_key=("Genre", "name"),
        labels={"Genre"},
    )
    movies = graph.nodes.match("Movie")
    for movie in movies:
        attach_helper_nodes(
            graph,
            movie,
            relationship_type="BELONGS_TO",
            feature_name="genres",
            node_label="Genre",
        )
    print("Created and attached movies genres.")

def insert_movies_production_countries(graph: Graph, movies_json):
    create_helper_nodes(
        graph,
        movies_json,
        feature_name="production_countries",
        feature_key="name",
        merge_key=("ProductionCountry", "name"),
        labels={"ProductionCountry"},
    )
    movies = graph.nodes.match("Movie")
    for movie in movies:
        attach_helper_nodes(
            graph,
            movie,
            relationship_type="PRODUCED_IN",
            feature_name="production_countries",
            node_label="ProductionCountry",
        )
    print("Created and attached movies production countries.")


# helpers
def transform_json_feature(movie, feature_name):
    try:
        obj = json.loads(movie[feature_name].replace("\'", "\""))
        return obj
    except Exception as e:
        print("error at parsing json string:", movie[feature_name])
        print(e)
        return []

def attach_helper_nodes(
    graph: Graph,
    movie: Node,
    relationship_type: str,
    feature_name: str,
    node_label: str,
):
    REL = Relationship.type(relationship_type)
    objects = transform_json_feature(movie, feature_name)
    for object in objects:
        node = graph.nodes.match(node_label, name=object["name"]).first()
        graph.merge(REL(movie, node))

def create_helper_nodes(graph: Graph, movies_json, feature_name, feature_key, merge_key, labels):
    nodes = get_nodes_set(movies_json, feature_name, feature_key)
    if len(nodes):
        merge_nodes(
            tx=graph.auto(),
            data=nodes,
            merge_key=merge_key,
            labels=labels,
        )

def get_nodes_set(movies_json, feature_name, feature_key):
    nodes_nested = map(lambda movie: transform_json_feature(movie, feature_name), movies_json)
    nodes_flattened = []
    for nodes_list in nodes_nested:
        if isinstance(nodes_list, list):
            nodes_flattened += nodes_list
    nodes_dict = { node[feature_key]: node for node in nodes_flattened }
    nodes_unique = nodes_dict.values()
    return nodes_unique