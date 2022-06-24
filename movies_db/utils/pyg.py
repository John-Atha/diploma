import torch
import pandas as pd
from sentence_transformers import SentenceTransformer
from py2neo import Graph

def fetch_data(graph: Graph, query: str):
    result = graph.run(query)
    return pd.DataFrame([r.values() for r in result], columns=result.keys())

# https://github.com/pyg-team/pytorch_geometric/blob/master/examples/hetero/load_csv.py
# https://towardsdatascience.com/integrate-neo4j-with-pytorch-geometric-to-create-recommendations-21b0b7bc9aa

def load_node(graph: Graph, query: str, index_col, encoders=None):
    df = fetch_data(graph, query)
    df.set_index(index_col, inplace=True)
    
    # define node mappings node: index
    mapping = { index: i for i, index in enumerate(df.index.unique()) }
    
    # define node features
    x = None
    if encoders is not None:
        try:
            print("items:", encoders.items())
            xs = [encoder(df[col]) for col, encoder in encoders.items()]
            x = torch.cat(xs, dim=-1)
        except Exception as err:
            print(err)
            print("------------------------------")
            print(df)
            print("------------------------------")
            raise Exception
    return x, mapping

# https://github.com/pyg-team/pytorch_geometric/blob/master/examples/hetero/load_csv.py
# https://towardsdatascience.com/integrate-neo4j-with-pytorch-geometric-to-create-recommendations-21b0b7bc9aa

def load_edge(graph: Graph, query, src_index_col, src_mapping, dst_index_col, dst_mapping, encoders=None):
    df = fetch_data(graph, query)
    
    # define edge index
    src = [src_mapping[index] for index in df[src_index_col]]
    dst = [dst_mapping[index] for index in df[dst_index_col]]
    edge_index = torch.tensor([src, dst])
       
    # define edge features
    edge_attr = None
    if encoders is not None:
        edge_attrs = [encoder(df[col]) for col, encoder in encoders.items()]
        edge_attr = torch.cat(edge_attrs, dim=-1)
    
    return edge_index, edge_attr

# https://github.com/pyg-team/pytorch_geometric/blob/master/examples/hetero/load_csv.py
class SequenceEncoder(object):
    # The 'SequenceEncoder' encodes raw column strings into embeddings.
    def __init__(self, model_name='all-MiniLM-L6-v2', device=None):
        self.device = device
        self.model = SentenceTransformer(model_name, device=device)

    @torch.no_grad()
    def __call__(self, df):
        x = self.model.encode(df.values, show_progress_bar=True,
                              convert_to_tensor=True, device=self.device)
        return x.cpu()

# https://github.com/pyg-team/pytorch_geometric/blob/master/examples/hetero/load_csv.py
# https://colab.research.google.com/github/tomasonjo/blogs/blob/master/pyg2neo/Movie_recommendations.ipynb#scrollTo=n1QiEzKZ348J
class IdentityEncoder(object):
    # The 'IdentityEncoder' takes the raw column values and converts them to
    # PyTorch tensors.
    def __init__(self, dtype=None, is_list=False):
        self.dtype = dtype
        self.is_list = is_list

    def __call__(self, df):
        if self.is_list:
            return torch.stack([torch.tensor(el) for el in df.values])
        return torch.from_numpy(df.values).to(self.dtype)

class ListEncoder(object):
    # The 'ListEncoder' splits the raw column strings by 'sep' and converts
    # individual elements to categorical labels.
    def __init__(self, sep='|'):
        self.sep = sep

    def __call__(self, df):
        genres = set(g for col in df.values for g in col.split(self.sep))
        mapping = {genre: i for i, genre in enumerate(genres)}

        x = torch.zeros(len(df), len(mapping))
        for i, col in enumerate(df.values):
            for genre in col.split(self.sep):
                x[i, mapping[genre]] = 1
        return x