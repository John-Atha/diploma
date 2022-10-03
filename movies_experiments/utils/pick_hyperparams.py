import json
import os
from tabulate import tabulate

def pick_min_loss_key(final_epoch, loss_index):
    final_losses = { key: values[loss_index] for key, values in final_epoch.items() }
    min_loss_key = min(final_losses, key=final_losses.get)
    min_loss = final_losses[min_loss_key]
    return min_loss_key, min_loss

def pick_hyperparams(results_path):
    with open(results_path) as f:
        losses = json.load(f)
        final_epoch = { key: values[-1] for key, values in losses.items() }
        min_loss_key, min_loss = pick_min_loss_key(final_epoch, 0)
        min_train_loss_key, min_train_loss = pick_min_loss_key(final_epoch, 1)
        min_val_loss_key, min_val_loss = pick_min_loss_key(final_epoch, 2)
        min_test_loss_key, min_test_loss = pick_min_loss_key(final_epoch, 3)
        print(
            tabulate(
                [
                    ("Min Loss", min_loss_key, min_loss),
                    ("Min Train loss", min_train_loss_key, min_train_loss),
                    ("Min Val Loss", min_val_loss_key, min_val_loss),
                    ("Min Test Loss", min_test_loss_key, min_test_loss)
                ],
                headers=["Loss Type", "Best Hyperparams", "Best Value"]
            )
        )
