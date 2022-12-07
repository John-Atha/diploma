from .model import Model

def get_model():
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
    ).to(device)

    return model