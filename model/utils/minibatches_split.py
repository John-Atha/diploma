from torch_geometric.loader import LinkNeighborLoader

def split_to_minibatches(data, batch_size, num_neighbours=[15, 5], neg_sampling_ratio=0.0):
        edge_label_index = data["user", "rates", "movie"].edge_label_index
        edge_label = data["user", "rates", "movie"].edge_label
        loader = LinkNeighborLoader(
            data=data,
            num_neighbors=num_neighbours,
            neg_sampling_ratio=neg_sampling_ratio,
            edge_label_index=(("user", "rates", "movie"), edge_label_index),
            edge_label=edge_label,
            batch_size=batch_size,
            shuffle=True,
        )
        batch = next(iter(loader))
        return batch, loader