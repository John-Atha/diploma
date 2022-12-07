import pathlib, os
import os.path as osp
import sys
import argparse
parent_path = pathlib.Path(os.getcwd()).parent.absolute()
sys.path.append(str(parent_path))

import torch
import torch_geometric.transforms as T
from .Neo4jMovieLensMetadata import Neo4jMovieLensMetaData


def make_recommendations(dataset, data, model, user_id):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    mappings = dataset.my_mappings
    movies_mapping = mappings["movies_mapping"]
    users_mapping = mappings["users_mapping"]

    num_movies = len(movies_mapping)
    num_users = len(users_mapping)

    reverse_movie_mapping = dict(zip(movies_mapping.values(),movies_mapping.keys()))
    reverse_user_mapping = dict(zip(users_mapping.values(),users_mapping.keys()))

    results = []

    """
    * to predict the ratings for each user to all the movies
    * add one edge from the user to each one of the movies to the: `edge_label_index`
    * the Model will predict the rating that the user would give to each one of the movies
    """
    row = torch.tensor([user_id] * num_movies)
    col = torch.arange(num_movies)
    edge_label_index = torch.stack([row, col], dim=0)

    pred = model(data.x_dict, data.edge_index_dict,
                edge_label_index)
    pred = pred.clamp(min=0, max=5)

    user_neo4j_id = reverse_user_mapping[user_id]

    mask = (pred == 5).nonzero(as_tuple=True)

    predictions = [reverse_movie_mapping[el] for el in  mask[0].tolist()]
    results.append({'user': user_neo4j_id, 'movies': predictions})
    
    return results