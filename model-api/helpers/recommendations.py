from .Neo4jMovieLensMetadata import Neo4jMovieLensMetaData
import torch_geometric.transforms as T
import torch
import pathlib
import os
import os.path as osp
import sys
import argparse
parent_path = pathlib.Path(os.getcwd()).parent.absolute()
sys.path.append(str(parent_path))


def make_predictions(dataset, data, model, user_id):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    mappings = dataset.my_mappings
    movies_mapping = mappings["movies_mapping"]
    users_mapping = mappings["users_mapping"]

    num_movies = len(movies_mapping)
    num_users = len(users_mapping)

    reverse_movie_mapping = dict(
        zip(movies_mapping.values(), movies_mapping.keys()))
    reverse_user_mapping = dict(
        zip(users_mapping.values(), users_mapping.keys()))

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

    mask = pred.nonzero(as_tuple=True)
    predictions_list = pred.tolist()
    predictions = [
        {
            "movie_id": reverse_movie_mapping[movie_index],
            "rating": predictions_list[movie_index]
        }
        for movie_index in mask[0].tolist()
    ]
    return {'predictedRatings': predictions}


def recommend(dataset, data, model, user_id, limit):
    predictions = make_predictions(dataset, data, model, user_id)["predictedRatings"]
    sorted_predictions = sorted(
        predictions, key=lambda pred: pred["rating"], reverse=True)[:limit]
    return {'recommendations': sorted_predictions}
