import os
import os.path as osp
from typing import Callable, List, Optional
from py2neo import Graph
import pathlib
import sys
import torch
import pandas as pd
import shutil
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
from scripts.populate_db import populate_db


def transform_float_embedding_to_tensor(embedding):
    embedding = np.vstack(embedding).astype(np.float)
    embedding = torch.from_numpy(embedding).to(torch.float)


class Neo4jMovieLens(InMemoryDataset):

    url = 'https://files.grouplens.org/datasets/movielens/ml-latest-small.zip'

    def __init__(
        self,
        root,
        database_url: str,
        database_username: str,
        database_password: str,
        transform: Optional[Callable] = None,
        pre_transform: Optional[Callable] = None,
        model_name: Optional[str] = "all-MiniLM-L6-v2",
        force_pre_process: bool = False,
        use_movies_fastRP: bool = False,
    ):

        self.model_name = model_name

        if force_pre_process:
            # delete the directory with the downloaded data, to force download and process again
            print(root)
            shutil.rmtree(root)
        
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
                m.overview as overview,
                m.tagline as tagline,
                m.fastRP_embedding_companies_countries_languages as fastRP_embedding_companies_countries_languages,
                m.fastRP_embedding_genres_keywords as fastRP_embedding_genres_keywords,

        """
        self.ratings_query = """
            MATCH (u:User)-[r:RATES]-(m:Movie)
            return
                u.id as userId,
                r.rating as rating,
                r.datetime as datetime,
                m.id as movieId;
        """
        self.movies_df = None
        self.ratings_df = None
        self.use_movies_fastRP = use_movies_fastRP

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

    def store_to_database(self):
        populate_db(self.graph, use_small_dataset=True)

    def download(self):
        path = download_url(self.url, self.raw_dir)
        extract_zip(path, self.raw_dir)
        os.remove(path)
        self.store_to_database()

    def pre_process_movies_df(self):
        
        model = SentenceTransformer(self.model_name)
        with torch.no_grad():
            title_emb = model.encode(
                self.movies_df['title'].values,
                show_progress_bar=True,
                convert_to_tensor=True
            ).cpu()
            original_title_emb = model.encode(
                self.movies_df['original_title'].values,
                show_progress_bar=True,
                convert_to_tensor=True
            ).cpu()
            overview_emb = model.encode(
                self.movies_df['overview'].values,
                show_progress_bar=True,
                convert_to_tensor=True
            ).cpu()
            tagline_emb = model.encode(
                self.movies_df['tagline'].values,
                show_progress_bar=True,
                convert_to_tensor=True
            ).cpu()

        
        if self.use_movies_fastRP:
            fastRP_embedding_companies_countries_languages = self.movies_df['fastRP_embedding_companies_countries_languages'].values
            fastRP_embedding_companies_countries_languages = transform_float_embedding_to_tensor(fastRP_embedding_companies_countries_languages)

            fastRP_embedding_genres_keywords = self.movies_df['fastRP_embedding_genres_keywords'].values
            fastRP_embedding_genres_keywords = transform_float_embedding_to_tensor(fastRP_embedding_genres_keywords)

            return torch.cat([
                title_emb, original_title_emb, overview_emb, tagline_emb,
                fastRP_embedding_companies_countries_languages,
                fastRP_embedding_genres_keywords,
            ], dim=-1)
        
        return torch.cat([
            title_emb, original_title_emb, overview_emb, tagline_emb,
        ], dim=-1)

    
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
