# Diploma

## Link prediction using Neo4j Graph Data Science library and GNNs

## Dataset
[Amazon Review Data (2018)](https://nijianmo.github.io/amazon/index.html)

Citation: 
    Justifying recommendations using distantly-labeled reviews and fined-grained aspects
    Jianmo Ni, Jiacheng Li, Julian McAuley
    Empirical Methods in Natural Language Processing (EMNLP), 2019

---

## Dataset download

1. Cd into the `/db/scripts/` directory and in the `fetch_data.py` script:
    * Specify the categories names via the `categories` list
    * You can see the available categories at: https://nijianmo.github.io/amazon/index.html
    * Specify the name `data_dir` of the directory where the data will be stored
2. Run the `fetch_data.py` script

* Two json files are stored for each category
    * one having the same name with the category, containing reviews about its products
    * one with metadata about the category's products

---

## Database

* [Neo4j](https://neo4j.com/) 
* Official docker image from: https://hub.docker.com/_/neo4j?tab=description
* Run image with:
    ```
    docker run \
        --publish=7474:7474 --publish=7687:7687 \
        --volume=$HOME/neo4j/data:/data \
        neo4j
    ```

* Some dummy tests:
    * Run `db/tests/connection.py` to test the connection with the database
    * Run `db/tests/fields.py` to see a review of the dataset's products' fields

* To store the downloaded categories in the database:
    * cd into the `scripts/insert_metadata` directory
    * run `python3 main.py`

* You can then run some queries on the neo4j GUI, and see a schema with:
    * Nodes:
        * `Product` (100 products from each category are saved by default)
        * `Category`
    * Edges:
        * (product)-[BELONGS_TO]->(category)
---