# Imports

import json
import pathlib
import os
import sys
parent_path = pathlib.Path(os.getcwd()).parent.absolute()
sys.path.append(str(parent_path))

from utils.grid_search_data import grid_search_data
from utils.pick_hyperparams import pick_hyperparams

if len(sys.argv)>2:
    raise Exception("Usage: python simple_grid_search.py [epochs]")

print("Epochs:", sys.argv[1])

# Define the grid search space

# 2 combinations
layer_names = ["GAT"]
# [min, max, step]
encoder_num_layers = [6, 6, 1]
skip_connections = [True]
# [min, max, step]
decoder_num_layers = [8, 8, 1]
hidden_channels = [16, 32]
# 1 combination
epochs = int(sys.argv[1])
logging_step = 10
lrs = [0.012]
# 2 combinations
features_config=[
    {
        "text_features": ["title", "original_title"],
        "list_features": ["genres"],
        "use_movies_fastRP": False,
        "fastRP_features": [],
    },
    {
        "text_features": ["title", "original_title", "overview"],
        "list_features": ["genres"],
        "use_movies_fastRP": False,
        "fastRP_features": [],
    }
]

# perform the grid search
losses = grid_search_data(
    layer_names=layer_names,
    encoder_nums_layers=encoder_num_layers,
    decoder_nums_layers=decoder_num_layers,
    hidden_channels=hidden_channels,
    epochs=epochs,
    logging_step=logging_step,
    lrs=lrs,
    skip_connections=skip_connections,
    features_config=features_config,
)

# #### Save output
def features_config_to_specs(features_config):
    feature_config_to_spec = lambda config: f"{'_'.join(config.get('text_features'))}{'_'.join(config.get('list_features'))}{'_'.join(config.get('fastRP_features'))}"
    spec = "__".join([feature_config_to_spec(config) for config in features_config])
    return spec
specs = f"{layer_names}__encoder_{'_'.join(map(str, encoder_num_layers))}__decoder_{'_'.join(map(str, decoder_num_layers))}__{epochs}_epochs__{lrs}_lrs__hidden_channels{'_'.join(map(str, hidden_channels))}__{features_config_to_specs(features_config)}"
output_path = os.path.join("..", "results", specs+".json")
f = open(output_path, "w")
f.write(json.dumps({str(key): val for key, val in losses.items()}, indent=2))
f.close()

# Pick the best hyper_params
pick_hyperparams(output_path)