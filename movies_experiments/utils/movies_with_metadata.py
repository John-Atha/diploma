from py2neo import Graph, Node, Relationship
from py2neo.bulk import merge_nodes
import ast
from random_username.generate import generate_username

def keep_movie(movie, ids):
    try:
        id = int(movie["id"])
    except Exception as e:
        return False    
    return id in ids

# main methods for movies metadata
def insert_movies(graph: Graph, movies, ids_to_keep: list):
    print("Creating movies nodes...", end="  ")

    data = [movie for movie in movies if keep_movie(movie, ids_to_keep)]
    merge_nodes(
        tx=graph.auto(),
        data=data,
        merge_key=("Movie", "title"),
        labels={"Movie"}
    )
    print("OK")

def insert_movies_genres(graph: Graph, movies_json, movies_ids_to_keep):
    create_helper_nodes(
        movies_ids_to_keep,
        graph,
        movies_json,
        feature_name="genres",
        feature_key="name",
        merge_key=("Genre", "name"),
        labels={"Genre"},
    )
    print("Attaching genres to movies...", end="  ")
    movies = graph.nodes.match("Movie")
    for movie in movies:
        attach_helper_nodes(
            graph,
            movie,
            relationship_type="BELONGS_TO",
            feature_name="genres",
            node_label="Genre",
        )
    print("OK")

def insert_movies_production_countries(graph: Graph, movies_json, movies_ids_to_keep):
    create_helper_nodes(
        movies_ids_to_keep,
        graph,
        movies_json,
        feature_name="production_countries",
        feature_key="name",
        merge_key=("ProductionCountry", "name"),
        labels={"ProductionCountry"},
    )
    print("Attaching production countries to movies...", end="  ")
    movies = graph.nodes.match("Movie")
    for movie in movies:
        attach_helper_nodes(
            graph,
            movie,
            relationship_type="PRODUCED_IN",
            feature_name="production_countries",
            node_label="ProductionCountry",
        )
    print("OK")

def insert_movies_production_companies(graph: Graph, movies_json, movies_ids_to_keep):
    create_helper_nodes(
        movies_ids_to_keep,
        graph,
        movies_json,
        feature_name="production_companies",
        feature_key="name",
        merge_key=("ProductionCompany", "name"),
        labels={"ProductionCompany"},
    )
    print("Attaching production companies to movies...", end="  ")
    movies = graph.nodes.match("Movie")
    for movie in movies:
        attach_helper_nodes(
            graph,
            movie,
            relationship_type="PRODUCED_BY",
            feature_name="production_companies",
            node_label="ProductionCompany",
        )
    print("OK")

def insert_movies_spoken_languages(graph: Graph, movies_json, movies_ids_to_keep):
    create_helper_nodes(
        movies_ids_to_keep,
        graph,
        movies_json,
        feature_name="spoken_languages",
        feature_key="name",
        merge_key=("Language", "name"),
        labels={"Language"},
    )
    print("Attaching spoken languages to movies...", end="  ")
    movies = graph.nodes.match("Movie")
    for movie in movies:
        attach_helper_nodes(
            graph,
            movie,
            relationship_type="SPEAKING",
            feature_name="spoken_languages",
            node_label="Language",
        )
    print("OK")

def insert_movies_keywords(graph: Graph, keywords_json, movies_ids_to_keep):
    print("Creating keywords nodes...", end="  ")
    nodes = get_nodes_set(movies_ids_to_keep, keywords_json, feature_name="keywords", feature_key="name")
    merge_nodes(
        tx=graph.auto(),
        data=nodes,
        merge_key=("Keyword", "name"),
        labels={"Keyword"},
    )
    print("OK")
    print("Attaching keywords to movies...", end="  ")
    for item in keywords_json:
        movie_id = item["id"]
        keywords = transform_json_feature(item, "keywords")
        movie_node = graph.nodes.match("Movie", id=f"{movie_id}").first()
        if movie_node:
            REL = Relationship.type("HAS_KEYWORD")
            for keyword in keywords:
                keyword_node = graph.nodes.match("Keyword", name=keyword["name"]).first()
                if keyword_node:
                    graph.merge(REL(movie_node, keyword_node))
                else:
                    print("Skipping keyword with name:", keyword["name"])
    print("OK")

def add_fastRP_embeddings(graph: Graph):
    embeddings = [
        {
            "name": "fastRP_embedding_genres_keywords",
            "query": """
                ['Movie', 'Genre', 'Keyword'],
                {
                    BELONGS_TO: {
                        orientation: 'UNDIRECTED'
                    },
                    HAS_KEYWORD: {
                        orientation: 'UNDIRECTED'
                    }
                }
            """
        },
        {
            "name": "fastRP_embedding_companies_countries_languages",
            "query": """
                ['Movie', 'ProductionCompany', 'ProductionCountry', 'Language'],
                {
                    PRODUCED_BY: {
                        orientation: 'UNDIRECTED'
                    },
                    PRODUCED_IN: {
                        orientation: 'UNDIRECTED'
                    },
                    SPEAKING: {
                        orientation: 'UNDIRECTED'
                    }
                }
            """
        }
    ]

    for embedding in embeddings:
        name = embedding["name"]
        query = embedding["query"]
        add_fastRP_embedding(graph, name, query)

# main method for users and ratings
def insert_users_ratings(graph: Graph, ratings):
    print("Creating user nodes and ratings edges...", end="  ")
    for rating in ratings:
        insert_rating(
            graph,
            rating["userId"],
            rating["movieId"],
            rating["rating"],
            rating["timestamp"]
        )
    print("OK")

# helpers
def transform_json_feature(movie, feature_name):
    try:
        obj = ast.literal_eval(movie[feature_name])
        # obj = json.loads(movie[feature_name].replace("\'", "\""))
        return obj
    except Exception as e:
        print(f"error at parsing json string: {feature_name}", movie[feature_name])
        print(e)
        return []

def create_helper_nodes(movies_ids_to_keep, graph: Graph, movies_json, feature_name, feature_key, merge_key, labels):
    print(f"Creating {feature_name} nodes...", end="  ")
    nodes = get_nodes_set(movies_ids_to_keep, movies_json, feature_name, feature_key)
    if len(nodes):
        merge_nodes(
            tx=graph.auto(),
            data=nodes,
            merge_key=merge_key,
            labels=labels,
        )
    print("OK")

def get_nodes_set(movies_ids_to_keep, movies_json, feature_name, feature_key):
    # take into account only the movies that exist in our database
    nodes_nested = [
        transform_json_feature(movie, feature_name)
        for movie in movies_json
        if keep_movie(movie, movies_ids_to_keep)
    ]
    nodes_flattened = []
    for nodes_list in nodes_nested:
        if isinstance(nodes_list, list):
            nodes_flattened += nodes_list
    nodes_dict = { node[feature_key]: node for node in nodes_flattened }
    nodes_unique = nodes_dict.values()
    return nodes_unique

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

def insert_rating(graph: Graph, userId: int, movieId: int, rating: float, timestamp: int):
    movie = graph.nodes.match("Movie", id=f"{movieId}").first()
    username = generate_username(1)[0]
    if movie:
        user = Node("User", id=userId, username=username)
        user.__primarylabel__ = "User"
        user.__primarykey__ = "id"
        # datetime_ = datetime.datetime.fromtimestamp(timestamp)
        RATES = Relationship.type("RATES")
        graph.merge(RATES(user, movie, rating=rating, datetime=timestamp))
    else:
        print("Skipping rating of movie:", movieId)