from shutil import ExecError
from py2neo import Graph, Node, Relationship, NodeMatcher
from py2neo.bulk import merge_nodes, merge_relationships
import ast, os, json
from random_username.generate import generate_username
from tqdm import tqdm
from datetime import datetime
from sentence_transformers import SentenceTransformer

graph_mappings_file = open(os.path.join("..", "utils", "mappings.json"))
graph_mappings = json.load(graph_mappings_file)
graph_mappings_file.close()

def chunks(l, n):
    sublists = []
    for i in range(0, len(l), n):
        sublists.append(l[i:i + n])
    return sublists

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
    credits = [movie_credits for movie_credits in credits_json if movie_credits["id"] in movies_tmdbIds_to_keep]
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

    crew_chunks = chunks(crew_relationships_data, 10000)
    crew_chunk_index = 0
    for chunk in crew_chunks:
        print(f"Storing HAS_CREW chunk: {crew_chunk_index}")
        merge_relationships(
            tx=graph.auto(),
            data=chunk,
            merge_key="HAS_CREW",
            start_node_key=("Movie", "id"),
            end_node_key=("Person", "id"),
        )
        crew_chunk_index += 1

    cast_chunks = chunks(cast_relationships_data, 10000)
    cast_chunk_index = 0
    for chunk in list(cast_chunks):
        print(f"Storing HAS_CAST chunk: {cast_chunk_index}")
        merge_relationships(
            tx=graph.auto(),
            data=chunk,
            merge_key="HAS_CAST",
            start_node_key=("Movie", "id"),
            end_node_key=("Person", "id"),
        )
        cast_chunk_index += 1

def add_embeddings(graph: Graph, kind="fastRP"):
    relationships_to_be_embedded = [
        "genres",
        "keywords",
        "production_companies",
        "production_countries",
        "spoken_languages",
        "cast",
        "crew",
    ]

    embeddings = []
    for feature_name in relationships_to_be_embedded:
        rel_node_names = graph_mappings[feature_name]
        relationship_name = rel_node_names["rel_name"]
        node_name = rel_node_names["node_name"]
        embedding = {
            "name": f"{kind}_{feature_name}",
            "query": f"""
                ['Movie', '{node_name}'],
                {{
                    {relationship_name}: {{
                        orientation: 'UNDIRECTED'
                    }}
                }}
            """,
            "dimension": 256,
        }
        embeddings.append(embedding)
    
    total_embedding = {
        "name": f"{kind}_COMBINED",
        "query": f"""
            ['Movie', 'Genre', 'Keyword', 'ProductionCompany', 'ProductionCountry', 'Language', 'Person'],
            {{
                BELONGS_TO: {{
                    orientation: 'UNDIRECTED'
                }},
                HAS_KEYWORD: {{
                    orientation: 'UNDIRECTED'
                }},
                PRODUCED_IN: {{
                    orientation: 'UNDIRECTED'
                }},
                PRODUCED_BY: {{
                    orientation: 'UNDIRECTED'
                }},
                SPEAKING: {{
                    orientation: 'UNDIRECTED'
                }},
                HAS_CAST: {{
                    orientation: 'UNDIRECTED'
                }},
                HAS_CREW: {{
                    orientation: 'UNDIRECTED'
                }}
            }}
        """,
        "dimension": 256,
    }
    embeddings.append(total_embedding)
        
    for embedding in tqdm(embeddings):
        name = embedding["name"]
        query = embedding["query"]
        dimension = embedding["dimension"]
        add_embedding(graph, name, query, kind=kind, dimension=dimension)
        # add_embedding(graph, name, query, kind="SAGE")

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

def insert_users_ratings(graph: Graph, ratings, users_to_keep):

    user_ids = set(rating["userId"] for rating in ratings)
    
    users = [
        {
            "id": int(user_id),
            "username": generate_username(1)[0],
        }
        for user_id in (users_to_keep or user_ids) 
    ]

    print(f"Creating users nodes ({len(users_to_keep)})...")
    users_chunks = chunks(users, 10000)
    users_chunk_index = 0
    for chunk in users_chunks:
        print(f"Storing USERS chunk: {users_chunk_index}")
        merge_nodes(
            tx=graph.auto(),
            data=chunk,
            merge_key=("User", "id"),
            labels={"User"}
        )
        users_chunk_index += 1

    relationships_data = []
    for rating in tqdm(ratings, desc="Creating ratings edges..."):
        rel_data = {
            "rating": rating["rating"],
            "datetime": rating["timestamp"],
        }
        relationships_data.append((
            int(rating["movieId"]),
            rel_data,
            rating["userId"],
        ))
    ratings_chunks = chunks(relationships_data, 10000)
    ratings_chunk_index = 1
    # chunk = ratings_chunks[-1]
    for chunk in ratings_chunks:
        print(f"{datetime.now()}: storing RATINGS chunk: {ratings_chunk_index}")
        merge_relationships(
            tx=graph.auto(),
            data=chunk,
            merge_key="RATES",
            start_node_key=("Movie", "linkMovieId"),
            end_node_key=("User", "id")
        )
        ratings_chunk_index += 1

# some DB cleaner method
def delete_unrated_movies(graph: Graph):
    print("Deletting the unrated movies...", end="  ")
    graph.run("""
        match (m:Movie)
        where not (m)-[:RATES]-(:User)
        detach delete m;
    """)
    print("OK")

def create_search_indexes(graph: Graph):
    configs = [
        {
            "indexName": "MoviesSearch",
            "entityName": "Movie",
            "fields": ["m.title", "m.original_title", "m.release_date"], 
        },
        {
            "indexName": "GenresSearch",
            "entityName": "Genre",
            "fields": ["m.name"], 
        },
        {
            "indexName": "KeywordsSearch",
            "entityName": "Keyword",
            "fields": ["m.name"],
        },
        {
            "indexName": "ProductionCompaniesSearch",
            "entityName": "ProductionCompany",
            "fields": ["m.name"],
        },
        {
            "indexName": "ProductionCountriesSearch",
            "entityName": "ProductionCountry",
            "fields": ["m.name", "m.iso_3166_1"],
        },
        {
            "indexName": "LanguagesSearch",
            "entityName": "Language",
            "fields": ["m.name", "m.iso_639_1"],
        },
        {
            "indexName": "PeopleSearch",
            "entityName": "Person",
            "fields": ["m.name"],
        },
    ]

    for config in configs:
        index_name = config["indexName"]
        entity_name = config["entityName"]
        fields = config["fields"]
        graph.run(f"""
            CREATE FULLTEXT INDEX {index_name} FOR (m:{entity_name}) ON EACH [{', '.join(fields)}]
        """)

def dummy_initialize_users(graph: Graph):
    graph.run("""
    match (u:User)
    set u.hashedPassword = "$2b$10$RGSWd8D/q5iUj4lHkVh8N.0KNeIJZZ67Jy6nWCVSTweaF1chAkkbW";
    """)

def transform_title_original_title_to_embeddings(graph: Graph):
    model = SentenceTransformer('all-MiniLM-L6-v2')

    def string_to_embedding(string):
        nonlocal model
        emb = model.encode(movie["title"])
        emb = [float(i) for i in emb]
        return list(emb)
    
    matcher = NodeMatcher(graph)
    movies = matcher.match("Movie").all()
    for movie in tqdm(movies):
        if movie.get("title"):
            movie['title_embedding'] = string_to_embedding(movie["title"])
        if movie.get("original_title"):
            movie['original_title_embedding'] = string_to_embedding(movie["original_title"])
        graph.push(movie)

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
        keep = keep_movie_by_tmdb_id(movie, movies_tmdbIds_to_keep) if movies_tmdbIds_to_keep.any() else keep_movie(movie, movies_imdbIds_to_keep)
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

def add_embedding(graph: Graph, name, query, kind, dimension):
    run_projection(graph, name, query)
    
    if kind == "fastRP":
        write_fastRP_projection_embedding(graph, name, dimension)
    elif kind == "node2vec":
        write_node2vec_projection_embedding(graph, name, dimension)
    elif kind == "SAGE":
        train_SAGE_on_projection_graph(graph, name, dimension)
        drop_SAGE(graph, name)
    
    drop_projection(graph, name)

def run_projection(graph, name, query):
    print(f"Running projection... {name}", end="  ")
    graph.run(f"CALL gds.graph.project('{name}', {query})")
    # graph.run(f"""
    #     CALL gds.degree.mutate(
    #         '{name}',
    #         {{
    #             mutateProperty: 'degree'
    #         }}
    #     )
    # """)

    print("OK")

def write_fastRP_projection_embedding(graph, name, dimension):
    print("Writting generated embeddings...", end="  ")
    graph.run(f"""
        CALL gds.fastRP.write(
            '{name}',
            {{
                embeddingDimension: {dimension},
                writeProperty: '{name}',
                iterationWeights: [0.0, 1.0, 0.7, 0.3]
            }}
        )    
    """)
    print("OK")

def write_node2vec_projection_embedding(graph, name, dimension):
    print("Writting generated embeddings...", end="  ")
    graph.run(f"""
        CALL gds.beta.node2vec.write(
            '{name}',
            {{
                embeddingDimension: {dimension},
                writeProperty: '{name}'
            }}
        )    
    """)
    print("OK")

def train_SAGE_on_projection_graph(graph, name, dimension):
    print("Training SAGE for generating embeddings...")
    graph.run(f"""
       CALL gds.degree.mutate(
        '{name}',
        {{
            mutateProperty: 'degree'
        }}
        )
    """)
    graph.run(f"""
        CALL gds.beta.graphSage.train(
            '{name}',
            {{
                modelName: '{name}',
                projectedFeatureDimension: {dimension},
                featureProperties: ['degree'],
                aggregator: 'mean',
                activationFunction: 'sigmoid',
                randomSeed: 1337,
                sampleSizes: [25, 10]
            }}
        )
    """)
    print("Writting the SAGE embeddings...")
    graph.run(f"""
        CALL gds.beta.graphSage.write(
            '{name}',
            {{
                writeProperty: '{name}',
                modelName: '{name}'
            }}
        )
    """)

def drop_SAGE(graph, name):
    graph.run(f"""
        call gds.beta.model.drop("{name}")
    """)

def drop_projection(graph, name):
    print("Dropping projection...", end="  ")
    graph.run(f"""
        CALL gds.graph.drop("{name}")
    """)
    print("OK")

