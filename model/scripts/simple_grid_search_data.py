# Imports

import json
import pathlib
import os
import sys
from datetime import datetime

parent_path = pathlib.Path(os.getcwd()).parent.absolute()
sys.path.append(str(parent_path))

from utils.grid_search_data import grid_search_data
from utils.pick_hyperparams import pick_hyperparams

if len(sys.argv)>2:
    raise Exception("Usage: python simple_grid_search.py [epochs]")

print("Epochs:", sys.argv[1])

experiments_file = open(os.path.join("..", "scripts", "experiments.json"))
experiments = json.load(experiments_file)
experiments_file.close()

experiment_index = 1

config = None

if experiment_index is not None:
    config = experiments[experiment_index]
else:
    config = {
        "filename":  "SAGE_GAT_embeddings_hidden_channels_8_16",
        "layer_names": ["SAGE", "GAT"],
        "encoder_nums_layers": [6, 6, 1],
        "skip_connections": [1],
        "decoder_nums_layers": [8, 8, 1],
        "hidden_channels": [8, 16],
        "lrs": [0.012],
        "features_config": [
            {
                "text_features": ["title", "tagline"],
                "list_features": [],
                "fastRP_features": ["fastRP_genres"],
                "numeric_features": ["vote_average", "vote_count"]
            },
            {
                "text_features": ["title", "tagline", "overview"],
                "list_features": [],
                "fastRP_features": ["fastRP_genres", "fastRP_keywords"],
                "numeric_features": ["vote_average", "vote_count"]
            },
            {
                "text_features": ["title", "tagline", "overview"],
                "list_features": [],
                "fastRP_features": ["fastRP_genres", "fastRP_keywords", "fastRP_cast", "fastRP_crew"],
                "numeric_features": ["vote_average", "vote_count"]
            },
        ]
    }

epochs = int(sys.argv[1])
logging_step = 10

conf = dict(config)
del conf["filename"]
# perform the grid search
losses = grid_search_data(
    **conf,
    epochs=epochs,
    logging_step=logging_step,
)

time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
output_path = os.path.join("..", "results", config["filename"]+time+".json")
f = open(output_path, "w")
f.write(json.dumps({str(key): val for key, val in losses.items()}, indent=2))
f.close()

# Pick the best hyper_params
pick_hyperparams(output_path)