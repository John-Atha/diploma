from collections import defaultdict
import os
import os.path as osp
from typing import Callable, List, Optional
from py2neo import Graph
import pathlib
import sys
import torch
import pandas as pd
import shutil
import ast
import json
from sentence_transformers import SentenceTransformer
import numpy as np
from torch_geometric.data import (
    HeteroData,
    InMemoryDataset,
    download_url,
    extract_zip,
)

parent_path = pathlib.Path(os.getcwd()).parent.absolute()
sys.path.append(str(parent_path))


def transform_float_embedding_to_tensor(embedding):
    embeddings = [
        torch.from_numpy(np.array(emb)).to(torch.float)
        for emb in embedding
    ]
    embeddings = torch.stack(embeddings)
    return embeddings

graph_mappings_file = open(os.path.join("helpers", "mappings.json"))
graph_mappings = json.load(graph_mappings_file)
graph_mappings_file.close()

class Neo4jMovieLensMetaData(InMemoryDataset):

    url = 'https://files.grouplens.org/datasets/movielens/ml-latest-small.zip'

    def __init__(
        self,
        root,
        database_url: str,
        database_username: str,
        database_password: str,
        text_features: list,
        fastRP_features: list,
        list_features: list,
        numeric_features: list,
        transform: Optional[Callable] = None,
        pre_transform: Optional[Callable] = None,
        model_name: Optional[str] = "all-MiniLM-L6-v2",
        force_pre_process: bool = False,
    ):

        self.model_name = model_name

        if force_pre_process:
            dir = os.path.join(root, "processed")
            if os.path.exists(dir) and os.path.isdir(dir):
                shutil.rmtree(dir)

        self.graph = Graph(
            database_url,
            auth=(database_username, database_password),
        )
        self.movies_query = """
            MATCH (m: Movie)
            return 
                m.id as id,
                m.original_title as original_title,
                m.title as title,
                m.original_title_embedding as original_title_embedding,
                m.title_embedding as title_embedding,
                m.genres as genres,
                m.overview as overview,
                m.tagline as tagline,
                m.vote_average as vote_average,
                m.vote_count as vote_count,
                m.popularity as popularity,
                m.fastRP_genres as fastRP_genres,
                m.fastRP_keywords as fastRP_keywords,
                m.fastRP_production_countries as fastRP_production_countries,
                m.fastRP_production_companies as fastRP_production_companies,
                m.fastRP_spoken_languages as fastRP_spoken_languages,
                m.fastRP_crew as fastRP_crew,
                m.fastRP_cast as fastRP_cast,
                m.fastRP_embedding_companies_countries_languages as fastRP_embedding_companies_countries_languages,
                m.fastRP_embedding_genres_keywords as fastRP_embedding_genres_keywords
        """
        self.ratings_query = """
            MATCH (u:User)-[r:RATES]-(m:Movie)
            return
                u.id as userId,
                r.rating as rating,
                r.datetime as datetime,
                m.id as movieId
        """
        self.movies_df = None
        self.ratings_df = None
        self.text_features = text_features
        self.fastRP_features = fastRP_features
        self.list_features = list_features
        self.numeric_features = numeric_features

        super().__init__(root, transform, pre_transform)
        self.data, self.slices = torch.load(self.processed_paths[0])
 
    
    def fetch_data(self, query: str):
        result = self.graph.run(query)
        return pd.DataFrame([r.values() for r in result], columns=result.keys())

    @property
    def raw_file_names(self) -> List[str]:
        return [
            osp.join('ml-latest-small', 'movies.csv'),
            osp.join('ml-latest-small', 'ratings.csv'),
        ]

    @property
    def processed_file_names(self) -> str:
        return f'data_{self.model_name}.pt'

    def download(self):
        path = download_url(self.url, self.raw_dir)
        extract_zip(path, self.raw_dir)
        os.remove(path)

    def pre_process_movies_df(self):

        model_path = os.path.join("transformer", "models", "sentence-transformer-64dim")
        model = SentenceTransformer(model_path)

        def encode_numeric_features(feature_names):
            print(f"Encoding {feature_names}...")
            embeddings = self.movies_df[feature_names].values
            embeddings_tensor = torch.from_numpy(embeddings).to(torch.float)
            return [embeddings_tensor]

        def encode_text_features(feature_names):
            embeddings = []
            with torch.no_grad():
                for feature_name in feature_names:
                    print(f"Encoding {feature_name}...")
                    emb = None
                    if f"{feature_name}_embedding" in self.movies_df.columns:
                        emb = self.movies_df["title_embedding"].values
                        emb = transform_float_embedding_to_tensor(emb)
                    else:
                        vals = list(map(
                            lambda val: val if isinstance(val, str) else "",
                            self.movies_df[feature_name].values
                        ))
                        emb = model.encode(
                            vals,
                            show_progress_bar=True,
                            convert_to_tensor=True
                        ).cpu() 
                    embeddings.append(emb)
            return embeddings
        
        def encode_fastRP_features(feature_names):
            embeddings = []
            for feature_name in feature_names:
                print(f"Encoding {feature_name}...")
                emb = self.movies_df[feature_name].values
                emb = transform_float_embedding_to_tensor(emb)
                embeddings.append(emb)
            return embeddings
        
        def encode_list_str_features(feature_names):
            embeddings = []
            for feature_name in feature_names:
                print(f"Encoding {feature_name}...")
                rel_node_names = graph_mappings[feature_name]
                relationship_name = rel_node_names["rel_name"]
                node_name = rel_node_names["node_name"]
                merge_key = rel_node_names["merge_key"]
                raw_data = self.graph \
                    .run(f"""
                        match (m:Movie)
                        optional match (m)-[r:{relationship_name}]-(n:{node_name})
                        return m["id"] as movieId, n as {feature_name}
                    """) \
                    .data()
                groupped_data = defaultdict(list)
                for datum in raw_data:
                    movieId, feature = datum["movieId"], datum[feature_name]
                    groupped_data[movieId].append(dict(feature) if feature else {})
                df = pd.DataFrame(groupped_data.items(), columns=["movieId", feature_name])   
                names = df[feature_name] \
                    .map(lambda datum: \
                        "|".join(
                            map(
                                lambda xs: str(xs[merge_key]) if xs else "",
                                ast.literal_eval(datum) if isinstance(datum, str) else datum
                            )
                        )
                    )
                names = names.str.get_dummies('|').values
                embs = torch.from_numpy(names).to(torch.float)
                embeddings.append(embs)
            return embeddings

        embeddings_list = []

        if self.text_features:
            text_embeddings = encode_text_features(self.text_features)
            embeddings_list += text_embeddings
        
        if self.fastRP_features:
            fastRP_embeddings = encode_fastRP_features(self.fastRP_features)
            embeddings_list += fastRP_embeddings
        
        if self.list_features:
            list_str_embeddings = encode_list_str_features(self.list_features)
            embeddings_list += list_str_embeddings
        
        if self.numeric_features:
            numeric_embeddings = encode_numeric_features(self.numeric_features)
            embeddings_list += numeric_embeddings

        print([emb.shape for emb in embeddings_list])
        return torch.cat(embeddings_list, dim=-1)
        
    def process(self):
        data = HeteroData()

        # load the movies from the DB
        if not self.movies_df:
            self.movies_df = self.fetch_data(self.movies_query)
            self.movies_df.set_index("id", inplace=True)
        
        movie_mapping = {idx: i for i, idx in enumerate(self.movies_df.index)}      
        data['movie'].x = self.pre_process_movies_df()

        # load the users and the ratings from the DB
        if not self.ratings_df:
            self.ratings_df = self.fetch_data(self.ratings_query)

        user_mapping = {idx: i for i, idx in enumerate(self.ratings_df['userId'].unique())}
        data['user'].num_nodes = len(user_mapping)
        
        src = [user_mapping[idx] for idx in self.ratings_df['userId']]
        dst = [movie_mapping[idx] for idx in self.ratings_df['movieId']]

        edge_index = torch.tensor([src, dst])
        rating = torch.from_numpy(self.ratings_df['rating'].values).to(torch.long)
        
        data['user', 'rates', 'movie'].edge_index = edge_index
        data['user', 'rates', 'movie'].edge_label = rating

        if self.pre_transform is not None:
            data = self.pre_transform(data)

        torch.save(self.collate([data]), self.processed_paths[0])

    @property
    def my_mappings(self) -> dict:
        import pandas as pd

        movie_mapping = {idx: i for i, idx in enumerate(self.movies_df.index)}
        user_mapping = {idx: i for i, idx in enumerate(self.ratings_df['userId'].unique())}

        return {
            "users_mapping": user_mapping,
            "movies_mapping": movie_mapping,
        }
    
    def get_movie_by_id(self, movie_id):
        query = f"""
            match (m:Movie {{ id: {movie_id} }}) return m;
        """
        return self.fetch_data(query)
    
    def get_ratings_by_user(self, user_id):
        query = f"""
            match (u:User {{ id: {user_id} }})-[r:RATES]-(m:Movie) return u, r, m;
        """
        return self.fetch_data(query)

    def get_rating_by_user_id_and_movie_id(self, user_id, movie_id):
        query = f"""
            match (u:User {{ id: {user_id} }})-[r:RATES]-(m:Movie {{ id: {movie_id} }}) return u, r, m;
        """
        return self.fetch_data(query)
