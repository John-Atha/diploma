import os
import os.path as osp
from typing import Callable, List, Optional
from py2neo import Graph

import torch

from torch_geometric.data import (
    HeteroData,
    InMemoryDataset,
    download_url,
    extract_zip,
)


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
    ):
        self.model_name = model_name
        
        self.graph = Graph(
            database_url,
            auth=(database_username, database_password),
        )
        self.movies_query = """
            MATCH (m: Movie)
            return m.movieId as movieId, m.title as title, m.genres as genres, m.year as year, m['fastrp-embedding'] as fastrp
        """
        self.ratings_query = """
            MATCH (u:User)-[r:RATES]-(m:Movie)
            return u.userId as userId, r.rating as rating, r.datetime as datetime, m.movieId as movieId;
        """
        self.movies_df = None
        self.ratings_df = None

        super().__init__(root, transform, pre_transform)
        self.data, self.slices = torch.load(self.processed_paths[0])
 
    
    def fetch_data(self, query: str):
        import pandas as pd

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

    def process(self):
        import pandas as pd
        from sentence_transformers import SentenceTransformer

        data = HeteroData()

        # load the movies from the DB
        if not self.movies_df:
            self.movies_df = self.fetch_data(self.movies_query)
            self.movies_df.set_index("movieId", inplace=True)
        
        movie_mapping = {idx: i for i, idx in enumerate(self.movies_df.index)}
        genres = self.movies_df['genres'].str.get_dummies('|').values
        genres = torch.from_numpy(genres).to(torch.float)
        model = SentenceTransformer(self.model_name)
        with torch.no_grad():
            emb = model.encode(
                self.movies_df['title'].values,
                show_progress_bar=True,
                convert_to_tensor=True
            ).cpu()
        data['movie'].x = torch.cat([emb, genres], dim=-1)

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
            match (m:Movie \{ movieId: {movie_id} \}) return m;
        """
        return self.fetch_data(query)
    
    def get_ratings_by_user(self, user_id):
        # obviously not optimized, parses the csv every time
        query = f"""
            match (u:User \{ userId: {user_id} \})-[r:RATES]-(m:Movie) return u, r, m;
        """
        return self.fetch_data(query)

    def get_rating_by_user_id_and_movie_id(self, user_id, movie_id):
        query = f"""
            match (u:User \{ userId: {user_id} \})-[r:RATES]-(m:Movie \{ movieId: {movie_id} \}) return u, r, m;
        """
        return self.fetch_data(query)
