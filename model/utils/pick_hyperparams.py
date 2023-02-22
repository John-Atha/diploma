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

def pick_min_loss_key_2(losses_dict):
    min_loss_key = min(losses_dict, key=losses_dict.get)
    min_loss = losses_dict[min_loss_key]
    return min_loss_key, min_loss

def compare_losses(final_epoch, legend=[]):
    titles = ["Loss", "Train Loss", "Val Loss", "Test Loss"]
    if len(final_epoch.values())>5:
        fig, axs = plt.subplots(nrows=4, ncols=1)
        fig.set_figheight(30)
        fig.tight_layout(h_pad=5)
        index = 0
        for row in axs:
            final_losses = get_final_losses(final_epoch, index)
            row.bar(legend or final_losses.keys(), final_losses.values())
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
                col.bar(legend or final_losses.keys(), final_losses.values())
                col.set_title(titles[index])
                index += 1
    # plt.bar(final_losses.keys(), final_losses.values())
    # plt.title(title)
    plt.show()

def plot_compare(min_train_losses, min_train_eval_losses, min_val_losses, min_test_losses, legend=[]):
    
    entries = {
        "Train Loss": min_train_losses,
        "Train eval loss": min_train_eval_losses,
        "Val loss": min_val_losses,
        "Test loss": min_test_losses,
    }
    losses = list(entries.values())
    titles = list(entries.keys())
    
    if len(min_train_losses.values())>5:
        fig, axs = plt.subplots(nrows=4, ncols=1)
        fig.set_figheight(30)
        fig.tight_layout(h_pad=5)
        index = 0
        for row in axs:
            final_losses = losses[index]
            row.bar(legend or final_losses.keys(), final_losses.values())
            row.set_title(titles[index])
            index += 1    
    else:
        fig, axs = plt.subplots(nrows=2, ncols=2)
        fig.set_figheight(10)
        fig.tight_layout(h_pad=5)
        index = 0
        for row in axs:
            for col in row:
                final_losses = losses[index]
                col.bar(legend or final_losses.keys(), final_losses.values())
                col.set_title(titles[index])
                index += 1
    # plt.bar(final_losses.keys(), final_losses.values())
    # plt.title(title)
    plt.show()

def min_losses_of_each_model(losses, index):
    index_losses = { key: [epoch_losses[index] for epoch_losses in values] for key, values in losses.items() }
    min_index_losses = { key: min(losses) for key, losses in index_losses.items() }
    return min_index_losses

def pick_hyperparams(results_path, legend=[]):
    with open(results_path) as f:
        losses = json.load(f)
        final_epoch = { key: values[-1] for key, values in losses.items() }
        compare_losses(final_epoch, legend=legend)

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

def pick_hyperparams_2(results_path, legend=[]):
    with open(results_path) as f:
        losses = json.load(f)

        min_train_losses = min_losses_of_each_model(losses, index=0)
        min_train_eval_losses = min_losses_of_each_model(losses, index=1)
        min_val_losses = min_losses_of_each_model(losses, index=2)
        min_test_losses = min_losses_of_each_model(losses, index=3)
        plot_compare(min_train_losses, min_train_eval_losses, min_val_losses, min_test_losses, legend=legend)
        min_loss_key, min_loss = pick_min_loss_key_2(min_train_losses)
        min_train_loss_key, min_train_loss = pick_min_loss_key_2(min_train_eval_losses)
        min_val_loss_key, min_val_loss =pick_min_loss_key_2(min_val_losses)
        min_test_loss_key, min_test_loss =pick_min_loss_key_2(min_test_losses)

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