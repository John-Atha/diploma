import os.path as osp
from collections import defaultdict
import torch
import torch_geometric.transforms as T
from utils.gnn_simple import Model
from utils.train_test import train_test
from utils.Neo4jMovieLensMetaData import Neo4jMovieLensMetaData

def grid_search_data(
    layer_names,
    encoder_nums_layers,
    decoder_nums_layers,
    epochs,
    hidden_channels=[16, 32],
    features_config=[{
        "text_features": ["title", "original_title"],
        "list_features": ["genres"],
        "use_movies_fastRP": False,
        "fastRP_features": ["fastRP_embedding_genres_keywords"],
    }],
    lrs=[0.01],
    logging_step=1,
    skip_connections=[True],
):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    losses = defaultdict(tuple)
    for feature_config in features_config:
        text_features = feature_config.get("text_features") or []
        list_features = feature_config.get("list_features") or []
        use_movies_fastRP = bool(feature_config.get("use_movies_fastRP"))
        fastRP_features = feature_config.get("fastRP_features") or []

        path = osp.join(osp.dirname(osp.abspath('')), '../../data/MovieLensNeo4jMetaData')
        dataset = Neo4jMovieLensMetaData(
            path,
            model_name='all-MiniLM-L6-v2',
            database_url="bolt://localhost:7687",
            database_username="neo4j",
            database_password="admin",
            force_pre_process=True,
            force_db_restore=False,
            use_movies_fastRP=use_movies_fastRP,
            text_features=text_features,
            list_features=list_features,
            fastRP_features=fastRP_features,
        )
        data = dataset[0].to(device)
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

        for lr in lrs:
            for layer_name in layer_names:
                for encoder_num_layers in range(encoder_nums_layers[0], encoder_nums_layers[1]+1, encoder_nums_layers[2]):
                    for encoder_skip_connections in skip_connections:
                        for decoder_num_layers in range(decoder_nums_layers[0], decoder_nums_layers[1]+1, decoder_nums_layers[2]):
                            for hidden_channels_num in hidden_channels:
                                experiment_config = (
                                    layer_name,
                                    encoder_num_layers,
                                    encoder_skip_connections,
                                    decoder_num_layers,
                                    hidden_channels_num,
                                    lr,
                                    tuple(text_features),
                                    tuple(list_features),
                                    tuple(fastRP_features),
                                )
                                print("-->>", experiment_config)
                                model = Model(
                                    data,
                                    layer_name="SAGE",
                                    encoder_num_layers=encoder_num_layers,
                                    encoder_dropout=0.1,
                                    encoder_skip_connections=encoder_skip_connections,
                                    decoder_num_layers=decoder_num_layers,
                                    hidden_channels=hidden_channels_num,
                                    out_channels=hidden_channels_num,
                                ).to(device)
                                losses[experiment_config] = train_test(
                                    model=model,
                                    epochs=epochs,
                                    train_data=train_data,
                                    val_data=val_data,
                                    test_data=test_data,
                                    logging_step=logging_step,
                                    lr=lr,
                                )
    return losses