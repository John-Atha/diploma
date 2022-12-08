from .model import Model
import torch


def get_model(data):
    try:
        model = torch.load("pickled_model")
    except Exception as e:
        print("Could not load model")
        print(e)
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        model = Model(
            data,
            layer_name="SAGE",
            encoder_num_layers=6,
            encoder_dropout=0.1,
            encoder_skip_connections=True,
            decoder_num_layers=8,
            hidden_channels=32,
            out_channels=32,
            encoder_aggr=["mean"],
        ).to(device)
    return model
