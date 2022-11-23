# Diploma

## Link weight prediction using Neo4j Graph Database and Pytorch Geometric GNNs

## Dataset
> * [The movies Dataset](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset)
> * Two versions of the dataset will be used:
>   * small version (100K ratings)
>   * a full version (1M ratings)

## The Task
> * The task is to recommend movies to users 
> * To achieve that
>   * We represent the dataset as a graph, where
>       * users and movies are nodes
>       * a rating by a user to a movie is an edge between the two nodes 
>       * the value of the rating (0-5) is the weight of the edge
>   * We train a Model (GNN+DNN) to perform the link weight prediction task, and therefore predict the rating a user would give to a movie
>   * Using the predicted rating, we can the recommend new movies to a specific user
## Database initialization
> * Database used: [Neo4j](https://neo4j.com/) 
> * Steps (assuming that [Neo4j Desktop](https://neo4j.com/download/) is installed):
>     * create a new local DMBS with password: `admin`
>     * add the Neo4j [Graph Data Science Library](https://neo4j.com/docs/graph-data-science/current/) plugin to the DBMS
>     * download and extract the (Movies Dataset) under the directory `/model/movies_with_metadata`
>     * run the script `/model/scripts/popylate_db.py` (specifying the dataset version -small of full- that you would like to use)
>       * The following graph will be built:
>           * nodes:
>               * Movie
>               * User
>               * Genre
>               * ProductionCompany
>               * ProductionCountry
>               * Language
>               * Keyword
>               * Person
>           * edges:
>               * (Movie)-[BELONGS_TO]-(Genre)
>               * (User)-[RATES]-(Movie)
>               * (Movie)-[HAS_KEYWORD]-(Keyword)
>               * (Movie)-[SPEAKING]-(Language)
>               * (Movie)-[PRODUCED_BY]-(ProductionCompany)
>               * (Movie)-[PRODUCED_IN]-(ProductionCountry)
>               * (Movie)-[HAS_CAST]-(Person)
>               * (Movie)-[HAS_CREW]-(Person)

## Node Embeddings
> * When running the `populate_db` script, there are also produced some node embeddings for the movies
> * These embeddings can (and will) be used as input to the `Model`
>   * For example, instead of providing a list with the genres of each movie to the GNN, this information will be provided to the GNN via the corresponding embedding
> * One embedding (its dimension can be defined by the programmer) will be written to each movie node for each one of the previous relationship types, with the usage of the [Neo4j Graph Data Science Library](https://neo4j.com/docs/graph-data-science/current/)
> * Each movie will have 7 new features in total
> * Neo4j GDS Library has 3 main methods for producing the [node embeddings](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/):
>   * [fastRP](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/fastrp/)
>   * [GraphSAGE](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/graph-sage/)
>   * [Node2Vec](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/node2vec/)

## Model Structure
> * Main Library: [Pytorch Geometric](https://pytorch-geometric.readthedocs.io/en/latest/)
> * Model input and output:
>   * input: the subgraph consisting of the movies, the users and their ratings
>   * output: the predicted weights for all the rating edges in the graph provided
> * Model structure:
>   * the model consists of two sub-models:
>       1. GNNEncoder: a Graph Neural Network that produces embeddings for the users and the movies
>           * input for `forward`:
>               1. `data.x_dict`: Node feature matrix
>               2. `data.edge_index_dict`: Graph connectivity in COO format
>           * output of `forward`:
>               `z_dict`: A dictionary with the embeddings of the users and the movies nodes
>       2. EdgeDecoder: a simple Deep Neural Network that takes as input the embeddings of a user and a movie and predicts the rating given by the user on the movie (it computes the weight of the edge on the graph)
>           * input for `forward`:
>               1. `data.z_dict`: The output of the `GNNEncoder`
>               2. `data.edge_label_index`: The indices of the edges (whose weight will be computed)
>           * output of `forward`:
>               * A tensor with the predicted weights for all the edges of the `edge_label_index` provided
>   * For each training epoch, the model:
>       * takes as input the `data.x_dict`, `data.edge_index_dict`, and `data.edge_label_dict`
>       * the GNN computes the embeddings of the nodes (users and movies) using the node features of the `data.x_dict`, and the graph connectivity of `data.edge_index_dict`
>       * the EdgeDecoder predicts the weight of all the edges in the `data.edge_label_index`, using the node embeddings `data.z_dict` of the GNN

## How to recommend movies to a specific user
>   * the model predicts the ratings for all the users and movies of the `edge_label_index` dictionary
>   * to predict the ratings of a specific user to all the movies
>   * add one edge from the user to each one of the movies to the: `edge_label_index`
>   * the Model will predict the rating that the user would give to each one of the movies
>   * You can use these predicted ratings to recommend new movies to the user
>   * this process in defined in the `make_recommendations` function of the `model/utils/suggestions.py` file
## Main hyperparams of the GNN
> * Layers [type](https://pytorch-geometric.readthedocs.io/en/latest/modules/nn.html#convolutional-layers):
>   * [GraphSAGE](https://pytorch-geometric.readthedocs.io/en/latest/modules/nn.html#torch_geometric.nn.conv.SAGEConv)
>   * [GraphConv](https://pytorch-geometric.readthedocs.io/en/latest/modules/nn.html#torch_geometric.nn.conv.GraphConv)
>   * [GATConv](https://pytorch-geometric.readthedocs.io/en/latest/modules/nn.html#torch_geometric.nn.conv.GATConv)
>   * [GINConv](https://pytorch-geometric.readthedocs.io/en/latest/modules/nn.html#torch_geometric.nn.conv.GINConv) (this layer type is expected to compose the most expressive GNN because of the way it aggregates the node embeddings)
> * The [aggregation](https://pytorch-geometric.readthedocs.io/en/latest/modules/nn.html#aggregation-operators) used on each layer (max, mean, etc...)
> * Number of hidden layers
> * Number of hidden channels (neurons in each hidden layer)
> * Usage of skip connections

## Main hyperparams of the EdgeDecoder
> * Number of hidden layers
> * Number of hidden channels (neurons in each hidden layer)

## Training Flow:
>   * define a grid search space of hyperparameters about:
>       * the model (layer types, number of layers, aggregation type, number of hidden neurons, etc...)
>       * the dataset (which movies embeddings will be used as input to the model, etc...)
>       * the training (epochs, learning rate, etc...)
>   * build and train multiple models iterating over the grid search space
>   * save the train-validation-test losses of all the models of the grid search space as json files under the `/movies_with_metadata/results` directory
>   * visualize and compare the produced losses
> * Most important scripts
>   * `utils/simple_grid_search.py`
>   * `utils/simple_grid_search_data.py`
>   * These scripts take as input the hyperparameters space and perform the grid search, saving the losses
>   * usage `python3 simple_grid_search_data.py [number_of_epochs_to_train]`


## Code
> * Most important helper methods and classes:
> 
>  | file | type | name | args | description | output |
>  | --- | --- | --- | --- | --- | --- |
>  | `utils/train_test.py` | method | train_test | model, epochs, splitted datasets | trains the specified models for the specified number of epochs | a python dictionary with the recorded losses
>  | `utils/grid_search` | method | grid_search | model (layers type, number, hidden neurons number,  etc...) and training (epochs, splitted datasets, etc...) related hyperparameters | iterates over the hyperparameters space, builds and trains the model, keeping track of the losses | a python dictionary with the recorded losses of all the models
>  | `utils/grid_search_data` | method | grid_search_data | model, dataset (features and nodes to use) and training related hyperparameters | same as the grid_search method, but now the grid search space can contain dataset configuration options | a python dictionary with the recorded losses of all the models
>  | `utils/visualize` | method | multiple plotting methods | a losses dictionary or the path of the json file with the losses | plots the train-validation-test loss values with reference to the training epochs | some simple [matplotlib](https://matplotlib.org/) line plots
>  | `utils/pick_hyperparams` | method | pick_hyper_params | the path of the losses file | compares the final epoch train-validation-test losses of each model and prints the best model and its losses, plots a bar plot comparing the losses achieved by each model | a simple [tabulate](https://pypi.org/project/tabulate/) array and some [matplotlib](https://matplotlib.org/) bar plots
> | `utils/gnn_simple` | class | GNNEncoder, EdgeDecoder, Model | model hyperparameters (layer types, number, skip connections, dropout, etc...) | build the model specified by the specified hyperparams | a Pytorch Geometric model