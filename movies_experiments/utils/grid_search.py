from collections import defaultdict
from utils.gnn_simple import Model
from utils.train_test import train_test

def grid_search(
    layer_names,
    encoder_min_num_layers,
    encoder_max_num_layers,
    decoder_min_num_layers,
    decoder_max_num_layers,
    epochs,
    data,
    train_data,
    val_data,
    test_data,
    device,
    lrs=[0.01],
    logging_step=1,
    skip_connections=[True],
    decoder_num_layers_step=1,
    encoder_num_layers_step=1,
):
    losses = defaultdict(tuple)
    for lr in lrs:
        for layer_name in layer_names:
            for encoder_num_layers in range(encoder_min_num_layers, encoder_max_num_layers+1, encoder_num_layers_step):
                for encoder_skip_connections in skip_connections:
                    for decoder_num_layers in range(decoder_min_num_layers, decoder_max_num_layers+1, decoder_num_layers_step):
                        print("--->>", (layer_name, encoder_num_layers, encoder_skip_connections, decoder_num_layers, lr))
                        model = Model(
                            data,
                            layer_name="SAGE",
                            encoder_num_layers=encoder_num_layers,
                            encoder_dropout=0.1,
                            encoder_skip_connections=encoder_skip_connections,
                            decoder_num_layers=decoder_num_layers,
                            hidden_channels=32
                        ).to(device)
                        losses[(layer_name, encoder_num_layers, encoder_skip_connections, decoder_num_layers, lr)] = train_test(
                            model=model,
                            epochs=epochs,
                            train_data=train_data,
                            val_data=val_data,
                            test_data=test_data,
                            logging_step=logging_step,
                            lr=lr,
                        )
    return losses