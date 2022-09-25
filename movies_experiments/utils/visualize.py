from matplotlib import pyplot as plt

def plot_loss_by_index(index, losses, ylim=1.5):
    for type, values in losses.items():
        plt.plot([val[index] for val in values], label=type)
    plt.rcParams["figure.figsize"] = (30,30)
    plt.ylim(0, ylim)
    plt.legend()
    plt.show()

def plot_loss(losses, ylim):
    plot_loss_by_index(0, losses, ylim)

def plot_train(losses, ylim=1.5):
    plot_loss_by_index(1, losses, ylim)

def plot_val(losses, ylim=1.5):
    plot_loss_by_index(2, losses, ylim)

def plot_test(losses, ylim=1.5):
    plot_loss_by_index(3, losses, ylim)