import torch
from torch.nn import Linear, LazyLinear
import torch.nn.functional as F
from torch_geometric.nn import SAGEConv, GATv2Conv, GCNConv, TransformerConv, GraphConv, to_hetero

layers = {
    "SAGE": SAGEConv,
    "GAT": GATv2Conv,
    "GCN": GCNConv,
    "Transformer": TransformerConv,
    "GraphConv": GraphConv,
}


class GNNEncoder(torch.nn.Module):
    def __init__(self, layer_name="SAGE", num_layers=4, in_channels=-1, hidden_channels=32, out_channels=32, dropout=0.1, skip_connections=True):
        assert num_layers > 4
        super().__init__()
        self.dropout = dropout
        self.num_layers = num_layers
        self.in_channels = in_channels
        self.hidden_channels = hidden_channels
        self.out_channels = out_channels
        self.dropout = dropout
        self.skip_connections = skip_connections
        self.layer = layers.get(layer_name) or SAGEConv
        
        first_layer_args = {
            "in_channels": self.in_channels,
            "out_channels": self.hidden_channels,
        }
        hidden_layer_args = {
            "in_channels": self.hidden_channels,
            "out_channels": self.hidden_channels,
        }
        last_layer_args = {
            "in_channels": self.hidden_channels,
            "out_channels": self.out_channels,
        }

        if layer_name in ["GCN", "GAT"]:
            first_layer_args["add_self_loops"] = False
            hidden_layer_args["add_self_loops"] = False
            last_layer_args["add_self_loops"] = False

        self.convs = torch.nn.ModuleList()
        self.convs.append(self.layer(**first_layer_args))
        for _ in range(self.num_layers-2):
            self.convs.append(self.layer(**hidden_layer_args))
        self.convs.append(self.layer(**last_layer_args))

    def forward(self, x, edge_index):
        prev_x = None
        for i in range(len(self.convs)-1):
            prev_x = x
            x = self.convs[i](x, edge_index)
            if i > 0 and self.skip_connections:
                x = x + prev_x
            x = x.relu()
            x = F.dropout(x, p=self.dropout, training=self.training)
        x = self.convs[-1](x, edge_index)
        return x


class EdgeDecoder(torch.nn.Module):
    def __init__(self, hidden_channels, num_layers):
        assert num_layers > 2
        super().__init__()
        self.num_layers = num_layers
        self.hidden_channels = hidden_channels
        self.layers = torch.nn.ModuleList()

        self.layers.append(LazyLinear(self.hidden_channels))
        for _ in range(self.num_layers-2):
            self.layers.append(
                Linear(self.hidden_channels, self.hidden_channels))
        self.layers.append(Linear(self.hidden_channels, 1))

    def forward(self, z_dict, edge_label_index):
        row, col = edge_label_index
        user_embeddings = z_dict['user'][row]
        movie_embeddings = z_dict['movie'][col]
        z = torch.cat([user_embeddings, movie_embeddings], dim=-1)
        for i in range(self.num_layers-1):
            z = self.layers[i](z).relu()
        z = self.layers[self.num_layers-1](z)
        return z.view(-1)


class Model(torch.nn.Module):
    def __init__(self, data, in_channels=-1, hidden_channels=32, out_channels=32, encoder_num_layers=5, decoder_num_layers=4, layer_name="SAGE", encoder_dropout=0.1, encoder_skip_connections=True):
        super().__init__()
        self.encoder = GNNEncoder(
            in_channels=in_channels,
            hidden_channels=hidden_channels,
            out_channels=out_channels,
            layer_name=layer_name,
            num_layers=encoder_num_layers,
            dropout=encoder_dropout,
            skip_connections=encoder_skip_connections,
        )
        self.in_channels = in_channels
        self.hidden_channels = hidden_channels
        self.out_channels = out_channels
        self.encoder = to_hetero(self.encoder, data.metadata(), aggr='sum')
        self.decoder = EdgeDecoder(
            hidden_channels,
            num_layers=decoder_num_layers
        )

    def forward(self, x_dict, edge_index_dict, edge_label_index):
        z_dict = self.encoder(x_dict, edge_index_dict)
        return self.decoder(z_dict, edge_label_index)
