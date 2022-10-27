import json
import os
from tabulate import tabulate
import matplotlib.pyplot as plt

get_final_losses = lambda final_epoch, loss_index: { key: values[loss_index] for key, values in final_epoch.items() }

def pick_min_loss_key(final_epoch, loss_index):
    final_losses = get_final_losses(final_epoch, loss_index)
    min_loss_key = min(final_losses, key=final_losses.get)
    min_loss = final_losses[min_loss_key]
    return min_loss_key, min_loss

def compare_losses(final_epoch):
    titles = ["Loss", "Train Loss", "Val Loss", "Test Loss"]
    if len(final_epoch.values())>5:
        fig, axs = plt.subplots(nrows=4, ncols=1)
        fig.set_figheight(30)
        fig.tight_layout(h_pad=5)
        index = 0
        for row in axs:
            final_losses = get_final_losses(final_epoch, index)
            row.bar(final_losses.keys(), final_losses.values())
            row.set_title(titles[index])
            index += 1    
    else:
        fig, axs = plt.subplots(nrows=2, ncols=2)
        fig.set_figheight(10)
        fig.tight_layout(h_pad=5)
        index = 0
        for row in axs:
            for col in row:
                final_losses = get_final_losses(final_epoch, index)
                col.bar(final_losses.keys(), final_losses.values())
                col.set_title(titles[index])
                index += 1
    # plt.bar(final_losses.keys(), final_losses.values())
    # plt.title(title)
    plt.show()

def pick_hyperparams(results_path):
    with open(results_path) as f:
        losses = json.load(f)
        final_epoch = { key: values[-1] for key, values in losses.items() }
        compare_losses(final_epoch)

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
