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
