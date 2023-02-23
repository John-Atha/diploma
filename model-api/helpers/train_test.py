import torch
import torch.nn.functional as F
import matplotlib.pyplot as plt

def train_test(model, epochs, train_data, test_data, val_data, logging_step, lr=0.01, use_weighted_loss=False):

    # Due to lazy initialization, we need to run one model step so the number
    # of parameters can be inferred:
    with torch.no_grad():
        model.encoder(train_data.x_dict, train_data.edge_index_dict)

    optimizer = torch.optim.Adam(model.parameters(), lr=lr)

    weight = None
    if use_weighted_loss:
        weight = torch.bincount(train_data['user', 'movie'].edge_label)
        weight = weight.max() / weight

    def weighted_rmse_loss(pred, target, weight=None):
        weight = 1. if weight is None else weight[target].to(pred.dtype)
        # return (weight * (pred - target.to(pred.dtype)).pow(2)).mean()
        return (weight * (pred - target.to(pred.dtype)).pow(2)).mean().sqrt()
    
    def train(log=False):
        model.train()
        optimizer.zero_grad()
        pred = model(train_data.x_dict, train_data.edge_index_dict,
                        train_data['user', 'movie'].edge_label_index)
        target = train_data['user', 'movie'].edge_label
        loss = weighted_rmse_loss(pred, target, weight)
        loss.backward()
        optimizer.step()
        return float(loss)

    @torch.no_grad()
    def test(data, log=False):
        model.eval()
        pred = model(data.x_dict, data.edge_index_dict,
                    data['user', 'movie'].edge_label_index)
        pred = pred.clamp(min=0, max=5)
        target = data['user', 'movie'].edge_label.float()
        rmse = F.mse_loss(pred, target).sqrt()
        return float(rmse)
    
    losses = []
    for epoch in range(1, epochs+1):
        loss = train(log=not(epoch%20))
        train_rmse = test(train_data)
        val_rmse = test(val_data)
        test_rmse = test(test_data, log=not(epoch%20))
        losses.append((loss, train_rmse, val_rmse, test_rmse))
        if (logging_step and not epoch%logging_step) or (not logging_step):
            print(f'Epoch: {epoch:03d}, Loss: {loss:.4f}, Train: {train_rmse:.4f}, '
                f'Val: {val_rmse:.4f}, Test: {test_rmse:.4f}')
    
    last_losses = losses[-1]
    losses = losses + [last_losses] * (epochs - len(losses))

    return model, losses