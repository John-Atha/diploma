from shutil import ExecError
from py2neo import Graph, Node, Relationship
from py2neo.bulk import merge_nodes
import ast
from random_username.generate import generate_username
from tqdm import tqdm

def keep_movie(movie, imdbIds):
    try:
        imdbId = int(movie["imdb_id"].replace("tt", ""))
    except Exception as e:
        return False
    return imdbId in imdbIds

def keep_movie_by_tmdb_id(movie, tmdbIds):
    return movie["id"] in tmdbIds
    
# main methods for movies metadata
def insert_movies(graph: Graph, movies, ids_to_keep: list):
    data = [movie for movie in tqdm(movies, desc="Creating movies nodes...") if keep_movie(movie, ids_to_keep)]
    merge_nodes(
        tx=graph.auto(),
        data=data,
        merge_key=("Movie", "title"),
        labels={"Movie"}
    )

def insert_movies_genres(graph: Graph, movies_json, movies_imdbIds_to_keep):
    create_helper_nodes(
        movies_imdbIds_to_keep,
        graph,
        movies_json,
        feature_name="genres",
        feature_key="name",
        merge_key=("Genre", "name"),
        labels={"Genre"},
    )
    movies = graph.nodes.match("Movie")
    for movie in tqdm(movies, desc="Attaching genres to movies..."):
        attach_helper_nodes(
            graph,
            movie,
            relationship_type="BELONGS_TO",
            feature_name="genres",
            node_label="Genre",
        )

def insert_movies_production_countries(graph: Graph, movies_json, movies_imdbIds_to_keep):
    create_helper_nodes(
        movies_imdbIds_to_keep,
        graph,
        movies_json,
        feature_name="production_countries",
        feature_key="name",
        merge_key=("ProductionCountry", "name"),
        labels={"ProductionCountry"},
    )
    movies = graph.nodes.match("Movie")
    for movie in tqdm(movies, desc="Attaching production countries to movies..."):
        attach_helper_nodes(
            graph,
            movie,
            relationship_type="PRODUCED_IN",
            feature_name="production_countries",
            node_label="ProductionCountry",
        )

def insert_movies_production_companies(graph: Graph, movies_json, movies_imdbIds_to_keep):
    create_helper_nodes(
        movies_imdbIds_to_keep,
        graph,
        movies_json,
        feature_name="production_companies",
        feature_key="name",
        merge_key=("ProductionCompany", "name"),
        labels={"ProductionCompany"},
    )
    movies = graph.nodes.match("Movie")
    for movie in tqdm(movies, desc="Attaching production companies to movies..."):
        attach_helper_nodes(
            graph,
            movie,
            relationship_type="PRODUCED_BY",
            feature_name="production_companies",
            node_label="ProductionCompany",
        )

def insert_movies_spoken_languages(graph: Graph, movies_json, movies_imdbIds_to_keep):
    create_helper_nodes(
        movies_imdbIds_to_keep,
        graph,
        movies_json,
        feature_name="spoken_languages",
        feature_key="name",
        merge_key=("Language", "name"),
        labels={"Language"},
    )
    movies = graph.nodes.match("Movie")
    for movie in tqdm(movies, desc="Attaching spoken languages to movies..."):
        attach_helper_nodes(
            graph,
            movie,
            relationship_type="SPEAKING",
            feature_name="spoken_languages",
            node_label="Language",
        )

def insert_movies_keywords(graph: Graph, keywords_json, movies_imdbIds_to_keep, movies_tmdbIds_to_keep):
    nodes = get_nodes_set(movies_imdbIds_to_keep, keywords_json, feature_name="keywords", feature_key="name", movies_tmdbIds_to_keep=movies_tmdbIds_to_keep)

    merge_nodes(
        tx=graph.auto(),
        data=nodes,
        merge_key=("Keyword", "name"),
        labels={"Keyword"},
    )

    for item in tqdm(keywords_json, desc="Attaching keywords to movies..."):
        movie_id = item["id"]
        keywords = transform_json_feature(item, "keywords")
        movie_node = graph.nodes.match("Movie", id=f"{movie_id}").first()
        if movie_node:
            REL = Relationship.type("HAS_KEYWORD")
            for keyword in keywords:
                keyword_node = graph.nodes.match("Keyword", name=keyword["name"]).first()
                if keyword_node:
                    graph.merge(REL(movie_node, keyword_node))

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

    for embedding in tqdm(embeddings):
        name = embedding["name"]
        query = embedding["query"]
        add_fastRP_embedding(graph, name, query)

# main methods for users and ratings

def insert_movies_links(graph:Graph, links):
    not_found_movies_counter = 0
    found_movies_counter = 0
    for link in tqdm(links, desc="Inserting link ids on movies..."):
        imdbId_init = link["imdbId"]

        imdbId_with_7_digits='{:0>7}'.format(imdbId_init)
        imdbId = f'tt{imdbId_with_7_digits}'
        movie = graph.nodes.match("Movie", imdb_id=imdbId).first()
        if movie:
            movie["linkMovieId"] = link["movieId"]
            graph.push(movie)
            found_movies_counter += 1
        else:
            not_found_movies_counter += 1
            # print(f"Movie with imdb_id {imdbId} not found.")
    print("Found movies:    ", found_movies_counter)
    print("Not Found movies:", not_found_movies_counter)

def insert_users_ratings(graph: Graph, ratings):
    found_movies_counter = 0
    not_found_movies_counter = 0
    for rating in tqdm(ratings, desc="Creating user nodes and ratings edges..."):
        found = insert_rating(
            graph,
            rating["userId"],
            rating["movieId"],
            rating["rating"],
            rating["timestamp"]
        )
        if found:
            found_movies_counter += 1
        else:
            not_found_movies_counter += 1
    print("Found movies ratings:   ", found_movies_counter)
    print("Not Found movies movies:", not_found_movies_counter)

# some DB cleaner method
def delete_unrated_movies(graph: Graph):
    print("Deletting the unrated movies...", end="  ")
    graph.run("""
        match (m:Movie)
        where not (m)-[:RATES]-(:User)
        detach delete m;
    """)
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

def create_helper_nodes(movies_imdbIds_to_keep, graph: Graph, movies_json, feature_name, feature_key, merge_key, labels):
    nodes = get_nodes_set(movies_imdbIds_to_keep, movies_json, feature_name, feature_key)
    if len(nodes):
        merge_nodes(
            tx=graph.auto(),
            data=nodes,
            merge_key=merge_key,
            labels=labels,
        )

def get_nodes_set(movies_imdbIds_to_keep, movies_json, feature_name, feature_key, movies_tmdbIds_to_keep=[]):
    # take into account only the movies that exist in our database
    nodes_flattened = []
    for movie in tqdm(movies_json, desc=f"Collecting {feature_name} data..."):
        keep = keep_movie_by_tmdb_id(movie, movies_tmdbIds_to_keep) if movies_tmdbIds_to_keep else keep_movie(movie, movies_imdbIds_to_keep)
        if keep:
            nodes_list = transform_json_feature(movie, feature_name)
            if isinstance(nodes_list, list):
                nodes_flattened += nodes_list
    nodes_dict = { node[feature_key]: node for node in tqdm(nodes_flattened, desc=f"Creating {feature_name}...") }
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
                embeddingDimension: 32,
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
    movie = graph.nodes.match("Movie", linkMovieId=movieId).first()
    username = generate_username(1)[0]

    if movie:
        user = Node("User", id=userId, username=username)
        user.__primarylabel__ = "User"
        user.__primarykey__ = "id"
        # datetime_ = datetime.datetime.fromtimestamp(timestamp)
        RATES = Relationship.type("RATES")
        graph.merge(RATES(user, movie, rating=rating, datetime=timestamp))
        return True
    else:
        # print("Skipping rating of movie:", movieId)
        return False
