import os.path as osp
from collections import defaultdict
import torch
import torch_geometric.transforms as T
from utils.gnn_simple import Model
from utils.train_test import train_test, train_test_mini_batch
from utils.Neo4jMovieLensMetaData import Neo4jMovieLensMetaData
from utils.minibatches_split import split_to_minibatches

def grid_search_data(
    layer_names,
    encoder_nums_layers,
    decoder_nums_layers,
    use_mini_batch,
    epochs,
    features_config,
    encoder_aggregations=[[]],
    hidden_channels=[16, 32],
    lrs=[0.01],
    logging_step=1,
    skip_connections=[True],
    use_weighted_loss=False,
):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    losses = defaultdict(tuple)
    for feature_config in features_config:
        text_features = feature_config.get("text_features") or []
        list_features = feature_config.get("list_features") or []
        fastRP_features = feature_config.get("fastRP_features") or []
        node2vec_features = feature_config.get("node2vec_features") or []
        SAGE_features = feature_config.get("SAGE_features") or []
        numeric_features = feature_config.get("numeric_features") or []

        path = osp.join(osp.dirname(osp.abspath('')), '../../data/MovieLensNeo4jMetaData')
        dataset = Neo4jMovieLensMetaData(
            path,
            model_name='all-MiniLM-L6-v2',
            database_url="bolt://localhost:7687",
            database_username="neo4j",
            database_password="admin",
            force_pre_process=True,
            force_db_restore=False,
            text_features=text_features,
            list_features=list_features,
            fastRP_features=fastRP_features,
            node2vec_features=node2vec_features,
            SAGE_features=SAGE_features,
            numeric_features=numeric_features,
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
                            for encoder_aggr in encoder_aggregations:
                                for hidden_channels_num in hidden_channels:
                                    experiment_config = (
                                        layer_name,
                                        encoder_num_layers,
                                        tuple(encoder_aggr),
                                        encoder_skip_connections,
                                        decoder_num_layers,
                                        hidden_channels_num,
                                        lr,
                                        tuple(text_features),
                                        tuple(list_features),
                                        tuple(fastRP_features),
                                        tuple(node2vec_features),
                                        tuple(SAGE_features),
                                        tuple(numeric_features),
                                    )
                                    print("-->>", experiment_config)
                                    model = Model(
                                        data,
                                        layer_name=layer_name,
                                        encoder_num_layers=encoder_num_layers,
                                        encoder_dropout=0.0,
                                        decoder_dropout=0.0,
                                        encoder_skip_connections=encoder_skip_connections,
                                        encoder_aggr=encoder_aggr,
                                        decoder_num_layers=decoder_num_layers,
                                        hidden_channels=hidden_channels_num,
                                        out_channels=hidden_channels_num,
                                    ).to(device)
                                    
                                    if use_mini_batch:
                                        train_batch, train_loader = split_to_minibatches(
                                            data=train_data,
                                            batch_size=32,
                                            num_neighbours=[15, 5],
                                        )
                                        test_batch, test_loader = split_to_minibatches(
                                            data=test_data,
                                            batch_size=32,
                                            num_neighbours=[15],
                                        )
                                        losses[experiment_config] = train_test_mini_batch(
                                            model=model,
                                            epochs=epochs,
                                            train_batch=train_batch,
                                            train_loader=train_loader,
                                            test_batch=test_batch,
                                            test_loader=test_loader,
                                            lr=lr,
                                        )
                                    else:
                                        losses[experiment_config] = train_test(
                                            model=model,
                                            epochs=epochs,
                                            train_data=train_data,
                                            val_data=val_data,
                                            test_data=test_data,
                                            logging_step=logging_step,
                                            lr=lr,
                                            use_weighted_loss=use_weighted_loss,
                                        )
    return losses