from shutil import ExecError
from py2neo import Graph, Node, Relationship
from py2neo.bulk import merge_nodes, merge_relationships
import ast, os, json
from random_username.generate import generate_username
from tqdm import tqdm

graph_mappings_file = open(os.path.join("..", "utils", "mappings.json"))
graph_mappings = json.load(graph_mappings_file)
graph_mappings_file.close()

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
    print(f"Found {len(data)}({len(set(movie['id'] for movie in data))}) nodes...")
    merge_nodes(
        tx=graph.auto(),
        data=data,
        merge_key=("Movie", "id"),
        labels={"Movie"}
    )

def insert_movies_genres(graph: Graph, movies_json, movies_imdbIds_to_keep):
    create_helper_nodes(
        movies_imdbIds_to_keep,
        graph,
        movies_json,
        feature_name="genres",
        feature_key="id",
        merge_key=("Genre", "id"),
        labels={"Genre"},
    )
    movies = graph.nodes.match("Movie")
    attach_helper_nodes(
        graph,
        movies,
        relationship_type="BELONGS_TO",
        feature_name="genres",
        node_label="Genre",
        feature_key="id",
    )

def insert_movies_production_countries(graph: Graph, movies_json, movies_imdbIds_to_keep):
    create_helper_nodes(
        movies_imdbIds_to_keep,
        graph,
        movies_json,
        feature_name="production_countries",
        feature_key="iso_3166_1",
        merge_key=("ProductionCountry", "iso_3166_1"),
        labels={"ProductionCountry"},
    )
    movies = graph.nodes.match("Movie")
    attach_helper_nodes(
        graph,
        movies,
        relationship_type="PRODUCED_IN",
        feature_name="production_countries",
        node_label="ProductionCountry",
        feature_key="iso_3166_1",
    )

def insert_movies_production_companies(graph: Graph, movies_json, movies_imdbIds_to_keep):
    create_helper_nodes(
        movies_imdbIds_to_keep,
        graph,
        movies_json,
        feature_name="production_companies",
        feature_key="id",
        merge_key=("ProductionCompany", "id"),
        labels={"ProductionCompany"},
    )
    movies = graph.nodes.match("Movie")
    attach_helper_nodes(
        graph,
        movies,
        relationship_type="PRODUCED_BY",
        feature_name="production_companies",
        node_label="ProductionCompany",
        feature_key="id",
    )

def insert_movies_spoken_languages(graph: Graph, movies_json, movies_imdbIds_to_keep):
    create_helper_nodes(
        movies_imdbIds_to_keep,
        graph,
        movies_json,
        feature_name="spoken_languages",
        feature_key="iso_639_1",
        merge_key=("Language", "iso_639_1"),
        labels={"Language"},
    )
    movies = graph.nodes.match("Movie")
    attach_helper_nodes(
        graph,
        movies,
        relationship_type="SPEAKING",
        feature_name="spoken_languages",
        node_label="Language",
        feature_key="iso_639_1",
    )

def insert_movies_keywords(graph: Graph, keywords_json, movies_imdbIds_to_keep, movies_tmdbIds_to_keep):
    nodes = get_nodes_set(movies_imdbIds_to_keep, keywords_json, feature_name="keywords", feature_key="id", movies_tmdbIds_to_keep=movies_tmdbIds_to_keep)
    print("Creating keywords nodes...")
    merge_nodes(
        tx=graph.auto(),
        data=nodes,
        merge_key=("Keyword", "id"),
        labels={"Keyword"},
    )
    print("Attaching keywords to movies...")
    relationships_data = [
        (str(item["id"]), {}, keyword["id"])
        for item in keywords_json
        for keyword in transform_json_feature(item, "keywords")
    ]
    merge_relationships(
        tx=graph.auto(),
        data=relationships_data,
        merge_key="HAS_KEYWORD",
        start_node_key=("Movie", "id"),
        end_node_key=("Keyword", "id"),
    )

def insert_movies_credits(graph: Graph, credits_json, movies_tmdbIds_to_keep):
    
    # # create Person nodes
    credits = [movie_credits for movie_credits in credits_json if movie_credits["id"] in set(movies_tmdbIds_to_keep)]
    crews = [ast.literal_eval(movie_credits["crew"]) for movie_credits in credits]
    casts = [ast.literal_eval(movie_credits["cast"]) for movie_credits in credits]
    get_member_from_cast_crew_item = lambda item: {
        "id": item["id"],
        "name": item["name"],
        "gender": item["gender"],
        "profile_path": item["profile_path"],
    }
    crew_members = [get_member_from_cast_crew_item(item) for crew in crews for item in crew]
    cast_members = [get_member_from_cast_crew_item(item) for cast in casts for item in cast]
    members = crew_members + cast_members
    members = list(dict((member["id"], member) for member in members).values())

    merge_nodes(
        tx=graph.auto(),
        data=members,
        merge_key=("Person", "id"),
        labels={"Person"},
    )

    # attach cast and crew to movies (add edges between Movie - Person )
    crew_relationships_data = []
    cast_relationships_data = []
    
    for item in tqdm(credits_json, desc="Attaching cast and crew to movies..."):
        movie_id = item["id"]
        if movie_id in set(movies_tmdbIds_to_keep):
            crew = ast.literal_eval(item["crew"])
            for cr in crew:
                id = cr["id"]
                rel_data = {
                    "credit_id": cr["credit_id"],
                    "department": cr["department"],
                    "job": cr["job"]
                }
                crew_relationships_data.append((str(movie_id), rel_data, id))
            
            cast = ast.literal_eval(item["cast"])
            for ca in cast:
                id = ca["id"]
                rel_data = {
                    "credit_id": ca["credit_id"],
                    "cast_id": ca["cast_id"],
                    "character": ca["character"],
                    "order": ca["order"],
                }
                cast_relationships_data.append((str(movie_id), rel_data, id))

    print("Crew rels:", len(crew_relationships_data))
    print("Cast rels:", len(cast_relationships_data))
    cr_movies = set([d[0] for d in crew_relationships_data])
    ca_movies = set([d[0] for d in cast_relationships_data])
    print("Movie ids in crews:",  len(cr_movies))
    print("Movie ids in casts:",  len(ca_movies))
    cr_person = set([d[2] for d in crew_relationships_data])
    ca_person = set([d[2] for d in cast_relationships_data])
    print(f"Person id in crews:", len(cr_person))
    print(f"Person id in casts:", len(ca_person))

    merge_relationships(
        tx=graph.auto(),
        data=crew_relationships_data,
        merge_key="HAS_CREW",
        start_node_key=("Movie", "id"),
        end_node_key=("Person", "id"),
    )
    merge_relationships(
        tx=graph.auto(),
        data=cast_relationships_data,
        merge_key="HAS_CAST",
        start_node_key=("Movie", "id"),
        end_node_key=("Person", "id"),
    )


def add_fastRP_embeddings(graph: Graph):

    relationships_to_be_embedded = [
        "genres",
        "keywords",
        "production_companies",
        "production_countries",
        "spoken_laguages",
        "cast",
        "crew",
    ]

    embeddings = []
    for feature_name in relationships_to_be_embedded:
        rel_node_names = graph_mappings[feature_name]
        relationship_name = rel_node_names["rel_name"]
        node_name = rel_node_names["node_name"]
        embedding = {
            "name": f"fastRP_{feature_name}",
            "query": f"""
                ['Movie', '{node_name}'],
                {{
                    {relationship_name}: {{
                        orientation: 'UNDIRECTED'
                    }}
                }}
            """
        }
        embeddings.append(embedding)
        
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

    users = [
        {
            "id": rating["userId"],
            "username": generate_username(1)[0],
        }
        for rating in ratings
    ]
    merge_nodes(
        tx=graph.auto(),
        data=users,
        merge_key=("User", "id"),
        labels={"User"}
    )

    relationships_data = []
    for rating in tqdm(ratings, desc="Creating user nodes and ratings edges..."):
        rel_data = {
            "rating": rating["rating"],
            "datetime": rating["timestamp"],
        }
        relationships_data.append((
            str(rating["movieId"]),
            rel_data,
            rating["userId"],
        ))
    
    merge_relationships(
        tx=graph.auto(),
        data=relationships_data,
        merge_key="RATES",
        start_node_key=("Movie", "id"),
        end_node_key=("User", "id")
    )

# some DB cleaner method
def delete_unrated_movies(graph: Graph):
    print("Deletting the unrated movies...", end="  ")
    graph.run("""
        match (m:Movie)
        where not (m)-[:RATES]-(:User)
        detach delete m;
    """)
    print("OK")


# -------------------------------------------------
# ---------------- helpers ------------------------
# -------------------------------------------------

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
    print(f"Creating {feature_name}...")
    nodes = get_nodes_set(movies_imdbIds_to_keep, movies_json, feature_name, feature_key)
    if len(nodes):
        print(f"Found {len(nodes)}({len(set([node[feature_key] for node in nodes]))}) nodes...")
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
    movies,
    relationship_type: str,
    feature_name: str,
    node_label: str,
    feature_key: str,
):
    print(f"Attaching {feature_name} to movies...")
    relationships_data = [
        (movie["id"], {}, object[feature_key])
        for movie in movies
        for object in transform_json_feature(movie, feature_name)
    ]
    merge_relationships(
        tx=graph.auto(),
        data=relationships_data,
        merge_key=relationship_type,
        start_node_key=("Movie", "id"),
        end_node_key=(node_label, feature_key)
    )

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


