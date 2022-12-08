from .model import Model
import torch
import os

def get_model(data):
    model_name = get_model_name()
    try:
        model = torch.load(model_name)
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

def get_model_name():
    use_large_model = os.environ.get("USE_LARGE_MODEL") == "1"
    model_name = "pickled_model_large" if use_large_model else "pickled_model_small"
    return model_name