# Imports

import json
import pathlib
import os
import os.path as osp
import sys
parent_path = pathlib.Path(os.getcwd()).parent.absolute()
sys.path.append(str(parent_path))

import torch
import torch_geometric.transforms as T
from torch_geometric.datasets import MovieLens

from utils.grid_search import grid_search
from utils.pick_hyperparams import pick_hyperparams

if len(sys.argv)>2:
    raise Exception("Usage: python simple_grid_search.py [epochs]")

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# #### Read the dataset
path = osp.join(osp.dirname(osp.abspath('')), '../../data/MovieLens')
dataset = MovieLens(path, model_name='all-MiniLM-L6-v2')
data = dataset[0].to(device)

# Preprocess the dataset
# Add user node features for message passing:
data['user'].x = torch.eye(data['user'].num_nodes, device=device)
del data['user'].num_nodes

# Add a reverse ('movie', 'rev_rates', 'user') relation for message passing:
data = T.ToUndirected()(data)
del data['movie', 'rev_rates', 'user'].edge_label  # Remove "reverse" label.

# Perform a link-level split into training, validation, and test edges:
train_data, val_data, test_data = T.RandomLinkSplit(
    num_val=0.1,
    num_test=0.1,
    neg_sampling_ratio=0.0,
    edge_types=[('user', 'rates', 'movie')],
    rev_edge_types=[('movie', 'rev_rates', 'user')],
)(data)

print("Epochs:", sys.argv[1])

# Define the grid search space
layer_names = ["SAGE"]
encoder_min_num_layers=5
encoder_max_num_layers=15
decoder_min_num_layers=5
decoder_max_num_layers=15
epochs=int(sys.argv[1])
logging_step=10

losses = grid_search(
    layer_names=layer_names,
    encoder_min_num_layers=encoder_min_num_layers,
    encoder_max_num_layers=encoder_max_num_layers,
    decoder_min_num_layers=decoder_min_num_layers,
    decoder_max_num_layers=decoder_max_num_layers,
    epochs=epochs,
    data=data,
    train_data=train_data,
    val_data=val_data,
    test_data=test_data,
    device=device,
    logging_step=logging_step,
)

# #### Save output
specs = f"{layer_names}__encoder_{encoder_min_num_layers}_{encoder_max_num_layers}__decoder_{decoder_min_num_layers}_{decoder_max_num_layers}__{epochs}_epochs"
output_path = os.path.join("..", "results", specs+".json")
f = open(output_path, "w")
f.write(json.dumps({str(key): val for key, val in losses.items()}, indent=2))
f.close()

# Pick the best hyper_params
pick_hyperparams(output_path)