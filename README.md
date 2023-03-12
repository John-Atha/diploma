# Diploma

A movie recommender platform implemented as the link weight prediction task with Graph Neural Networks and Graph Databases

![Alt Landing](./readme_images/home_page.png?raw=true "Title")


## System Architecture

![Alt Architecture](./readme_images/deployment_diagram.png?raw=true "Title")

The platform consists of the following main components:

- Graph Database
    - A [Neo4j](https://neo4j.com/) instance is utilized to store the dataset
- Movies API
    - A REST API responsible for serving the movies and their metadata to the front-end component
    - Developed with [NodeJS](https://nodejs.org/en/) in [Typescript](https://www.typescriptlang.org/)
- Users API
    - A REST API responsible for performing the CRUD operations on users accounts and their ratings on the movies
    - Developed with [NodeJS](https://nodejs.org/en/) in [Typescript](https://www.typescriptlang.org/)
- Model API
    - A REST API responsible for the integration of the machine learning model that performs the predictions into the platform
    - Developed with [Flask](https://flask.palletsprojects.com/en/2.2.x/) in [Python](https://www.python.org/)
- Model
    - A machine learning model that utilizes Graph Neural Networks to perform predictions on the movies ratings for each user
    - Developed with [Pytorch Geometric](https://www.pyg.org/) in [Python](https://www.python.org/)
- Front-end
    - A friendly and easy-to-use web app that allows users to:
        - explore multiple movies and their metadata
        - gain insights on the underlying graph structure of the data via numerous graph visualizations
        - submit their ratings on the platform's movies
        - access personalized predictions on the movies' ratings
    - Developed with [ReactJS](https://reactjs.org/) in [Javascript](https://www.javascript.com/) and [Typescript](https://www.typescriptlang.org/)