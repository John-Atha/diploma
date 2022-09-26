import json
import os
from tabulate import tabulate

def pick_min_loss_key(final_epoch, loss_index):
    final_losses = { key: values[loss_index] for key, values in final_epoch.items() }
    min_loss_key = min(final_losses, key=final_losses.get)
    return min_loss_key

def pick_hyperparams(results_path):
    with open(results_path) as f:
        losses = json.load(f)
        final_epoch = { key: values[-1] for key, values in losses.items() }
        min_loss_key = pick_min_loss_key(final_epoch, 0)
        min_train_loss_key = pick_min_loss_key(final_epoch, 1)
        min_val_loss_key = pick_min_loss_key(final_epoch, 2)
        min_test_loss_key = pick_min_loss_key(final_epoch, 3)
        print(
            tabulate(
                [
                    ("Min Loss", min_loss_key),
                    ("Min Train loss", min_train_loss_key),
                    ("Min Val Loss", min_val_loss_key),
                    ("Min Test Loss", min_test_loss_key)
                ],
                headers=["Loss", "Hyperparams"]
            )
        )
