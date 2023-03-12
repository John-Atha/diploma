import json
import os
from matplotlib import pyplot as plt

def plot_loss_by_index(index, losses, ylim=1.5, ylim_bottom=0.0, title="", legend=[], y_label="", font_size=22):
    i = 0
    for type, values in losses.items():
        label = legend[i] if legend else type
        plt.plot([val[index] for val in values], label=label)
        i += 1
    plt.xlabel("Epoch", fontsize=font_size)
    plt.ylabel(y_label or "Loss", fontsize=font_size)
    plt.rcParams["figure.figsize"] = (10,10)
    plt.ylim(ylim_bottom or 0.0, ylim or 1.5)
    # print the legend with font size of the function argument
    plt.legend(fontsize=font_size)
    plt.title(title)
    plt.show()

def plot_loss(losses, ylim=None, ylim_bottom=None, title="", legend=[], y_label="", font_size=22):
    plot_loss_by_index(0, losses, ylim, ylim_bottom=ylim_bottom, legend=legend, title=title, y_label=y_label, font_size=font_size)

def plot_train(losses, ylim=1.5, ylim_bottom=0.0, title="", legend=[], y_label="", font_size=22):
    plot_loss_by_index(1, losses, ylim, title, ylim_bottom=ylim_bottom, legend=legend, y_label=y_label, font_size=font_size)

def plot_val(losses, ylim=1.5, ylim_bottom=0.0, title="", legend=[], y_label="", font_size=22):
    plot_loss_by_index(2, losses, ylim, title=title, ylim_bottom=ylim_bottom, legend=legend, y_label=y_label, font_size=font_size)

def plot_test(losses, ylim=1.5, ylim_bottom=None, title="", legend=[], y_label="", font_size=22):
    plot_loss_by_index(3, losses, ylim, title=title, ylim_bottom=ylim_bottom, legend=legend, y_label=y_label, font_size=font_size)

def plot_results(results_path, ylim=1.5):
    with open(results_path) as f:
        losses = json.load(f)
        plot_loss(losses, title="Loss")
        plot_train(losses, ylim=ylim, title="Train loss")
        plot_val(losses, ylim=ylim, title="Validation loss")
        plot_test(losses, ylim=ylim, title="Test loss")