# Diploma

## Link prediction using Neo4j Graph Database and Pytorch Geometric GNNs

## Dataset
[The movies Dataset](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset)

## Database initialization
> * Database used: [Neo4j](https://neo4j.com/) 
> * Steps (assuming that [Neo4j Desktop](https://neo4j.com/download/) is installed):
>     * create a new local DMBS with password: `admin`
>     * add the Neo4j [Graph Data Science Library](https://neo4j.com/docs/graph-data-science/current/) plugin to the DBMS
>     * download and extract the (Movies Dataset) under the directory `/movies_experiments/movies_with_metadata`
>     * run the script `/movies_experiments/scripts/popylate_db.py`
>       * The following graph will be built:
>           * nodes:
>               * Movie
>               * User
>               * Genre
>               * ProductionCompany
>               * ProductionCountry
>               * Language
>               * Keyword
>           * edges:
>               * (Movie)-[BELONGS_TO]-(Genre)
>               * (User)-[RATES]-(Movie)
>               * (Movie)-[HAS_KEYWORD]-(Keyword)
>               * (Movie)-[SPEAKING]-(Language)
>               * (Movie)-[PRODUCED_BY]-(ProductionCompany)
>               * (Movie)-[PRODUCED_IN]-(ProductionCountry)

## Training a model
> * Main Library: [Pytorch Geometric](https://pytorch-geometric.readthedocs.io/en/latest/)
> * Flow:
>   * define a grid search space of hyperparameters about
>       * the model (layer types, number of layers, number of hidden neurons, etc...)
>       * the dataset (nodes and features used as input to the model, etc...)
>       * the training (epochs, learning rate, etc...)
>   * build the dataset and the model and train, iterating over the grid search space
>   * save the train-validation-test losses as json files under the `/movies_with_metadata/results` directory
>   * visualize and compare the produced losses
> * Most important scripts
>   * `utils/simple_grid_search.py`
>   * `utils/simple_grid_search_data.py`
>   * These scripts take as input the hyperparameters space and perform the grid search, saving the losses
>   * usage `python3 simple_grid_search_data.py [number_of_epochs_to_train]`
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