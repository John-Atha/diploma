import json
import os
from matplotlib import pyplot as plt

def plot_loss_by_index(index, losses, ylim=1.5, title=""):
    for type, values in losses.items():
        plt.plot([val[index] for val in values], label=type)
    plt.rcParams["figure.figsize"] = (30,10)
    plt.ylim(0, ylim or 1.5)
    plt.legend()
    plt.title(title)
    plt.show()

def plot_loss(losses, ylim=None, title=""):
    plot_loss_by_index(0, losses, ylim)

def plot_train(losses, ylim=1.5, title=""):
    plot_loss_by_index(1, losses, ylim, title)

def plot_val(losses, ylim=1.5, title=""):
    plot_loss_by_index(2, losses, ylim, title)

def plot_test(losses, ylim=1.5, title=""):
    plot_loss_by_index(3, losses, ylim, title)

def plot_results(results_path, ylim=1.5):
    with open(results_path) as f:
        losses = json.load(f)
        plot_loss(losses, title="Loss")
        plot_train(losses, ylim=ylim, title="Train loss")
        plot_val(losses, ylim=ylim, title="Validation loss")
        plot_test(losses, ylim=ylim, title="Test loss")