import os
import pathlib
from os.path import join
from py2neo import Graph
from review import insert_reviews
from pathlib import Path
import sys

file_path = Path(os.path.realpath(__file__)).parent.parent.parent.absolute()
sys.path.append(str(file_path))
from tests.helpers import get_reviews_files

graph = Graph(
    "bolt://localhost:7687",
    auth=("neo4j", "admin"),
)

def main():
    d = pathlib.Path(__file__).parent.parent.parent.absolute()
    data_path = join(d, "data")
    filenames = get_reviews_files(data_path)
    for file in filenames:
        insert_reviews(
            graph,
            filename=join(data_path, file),
            reviews_limit=1000,
        )

if __name__ == '__main__':
    try:
        graph.run("Match () Return 1 Limit 1")
        main()
        print('ok')
    except Exception as e:
        print(e)
        print(e.with_traceback)
        print('not ok')