import torch
import torch.nn.functional as F
import matplotlib.pyplot as plt
from utils.EarlyStopper import EarlyStopper
from tqdm import tqdm

def train_test(model, epochs, train_data, test_data, val_data, logging_step, lr=0.01):

    # Due to lazy initialization, we need to run one model step so the number
    # of parameters can be inferred:
    with torch.no_grad():
        model.encoder(train_data.x_dict, train_data.edge_index_dict)

    optimizer = torch.optim.Adam(model.parameters(), lr=lr)

    weight = torch.bincount(train_data['user', 'movie'].edge_label)
    weight = weight.max() / weight

    def weighted_rmse_loss(pred, target, weight=None):
        # weight = 1. if weight is None else weight[target].to(pred.dtype)
        weight = 1.
        # return (weight * (pred - target.to(pred.dtype)).pow(2)).mean()
        return (weight * (pred - target.to(pred.dtype)).pow(2)).mean().sqrt()
    
    def train(log=False):
        model.train()
        optimizer.zero_grad()
        pred = model(train_data.x_dict, train_data.edge_index_dict,
                        train_data['user', 'movie'].edge_label_index)
        # print(pred[:10])
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
        # print(pred[:10])
        # pred = pred.clamp(min=0, max=5)
        target = data['user', 'movie'].edge_label.float()
        rmse = F.mse_loss(pred, target).sqrt()
        return float(rmse)
    
    # early_stopper = EarlyStopper(patience=100, min_delta=0.1)
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
        # if epoch > 50 and early_stopper.early_stop(val_rmse):
        #     print("Early stopping...")
        #     break
    
    last_losses = losses[-1]
    losses = losses + [last_losses] * (epochs - len(losses))
    return losses


def train_test_mini_batch(model, epochs, train_batch, train_loader, test_batch, test_loader, lr=0.01):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Due to lazy initialization, we need to run one model step so the number
    # of parameters can be inferred:
    with torch.no_grad():
        model.encoder(train_batch.x_dict, train_batch.edge_index_dict)

    optimizer = torch.optim.Adam(model.parameters(), lr=lr)

    weight = None
    # weight = torch.bincount(train_data['user', 'movie'].edge_label)
    # weight = weight.max() / weight

    def weighted_mse_loss(pred, target, weight=None):
        weight = 1. if weight is None else weight[target].to(pred.dtype)
        return (weight * (pred - target.to(pred.dtype)).pow(2)).mean()
    
    def train_on_batch(batch):
        pred = model(batch.x_dict, batch.edge_index_dict, batch['user', 'movie'].edge_label_index)
        pred = pred.clamp(min=0, max=5)
        target = batch['user', 'movie'].edge_label.float()
        loss = weighted_mse_loss(pred, target, weight)
        print(f'\t\t Train Batch: Loss: {loss:.4f}')
        loss.backward()
        optimizer.step()
        return float(loss)

    @torch.no_grad()
    def test_on_batch(batch):
        pred = model(batch.x_dict, batch.edge_index_dict, batch['user', 'movie'].edge_label_index)
        pred = pred.clamp(min=0, max=5)
        target = batch['user', 'movie'].edge_label.float()
        rmse = F.mse_loss(pred, target).sqrt()
        return float(rmse)
    
    def train_one_epoch():
        model.train()
        total_loss = batch_index = 0
        for batch in tqdm(train_loader):
            optimizer.zero_grad()
            batch = batch.to(device, 'edge_index')
            loss = train_on_batch(batch)
            total_loss += loss
            batch_index += 1
        return total_loss / batch_index if batch_index else None

    def test_one_epoch():
        model.eval()
        total_loss = batch_index = 0
        for batch in tqdm(test_loader):
            batch = batch.to(device, 'edge_index')
            loss = test_on_batch(batch)
            print(f'\t\t Test Batch: Loss: {loss:.4f}')
            total_loss += loss
            batch_index += 1
        return total_loss / batch_index if batch_index else None


    losses = []
    for epoch in range(1, epochs+1):
        loss = train_one_epoch()
        test_rmse = test_one_epoch()
        losses.append((loss, 0, 0, test_rmse))
        print(f'Epoch: {epoch:03d}, Loss: {loss:.4f}, Test: {test_rmse:.4f}')
    
    last_losses = losses[-1]
    losses = losses + [last_losses] * (epochs - len(losses))
    return losses