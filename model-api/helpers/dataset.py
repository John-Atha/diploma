from .Neo4jMovieLensMetadata import Neo4jMovieLensMetaData
import torch
import os.path as osp
import os
import pathlib
import sys
parent_path = pathlib.Path(os.getcwd()).parent.absolute()
sys.path.append(str(parent_path))
import torch_geometric.transforms as T


def load_data_dataset():
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    dataset = Neo4jMovieLensMetaData(
        root='data/MovieLensNeo4jMetaData',
        model_name='all-MiniLM-L6-v2',
        database_url=os.environ.get("DATABASE_URL"),
        database_username=os.environ.get("DATABASE_USERNAME"),
        database_password=os.environ.get("DATABASE_PASSWORD"),
        force_pre_process=True,
        text_features=["title", "tagline"],
        list_features=[],
        fastRP_features=["fastRP_genres", "fastRP_keywords",
                         "fastRP_cast", "fastRP_crew"],
        numeric_features=["vote_average", "vote_count"]
    )
    data = dataset[0].to(device)
    data['user'].x = torch.eye(data['user'].num_nodes, device=device)
    del data['user'].num_nodes
    data = T.ToUndirected()(data)
    # Remove "reverse" label.
    del data['movie', 'rev_rates', 'user'].edge_label

    return dataset, data


def split_dataset(dataset, data):
    train_data, val_data, test_data = T.RandomLinkSplit(
        num_val=0.1,
        num_test=0.1,
        neg_sampling_ratio=0.0,
        edge_types=[('user', 'rates', 'movie')],
        rev_edge_types=[('movie', 'rev_rates', 'user')],
    )(data)
    return train_data, val_data, test_data
