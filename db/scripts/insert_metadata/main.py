import os
from os.path import join
from py2neo import Graph
from category import insert_category
from pathlib import Path
import sys
file_path = Path(os.path.realpath(__file__)).parent.parent.parent.absolute()
sys.path.append(str(file_path))
from tests.helpers import get_metadata_files

graph = Graph(
    "bolt://localhost:7687",
    auth=("neo4j", "admin"),
)

def main():
    data_path = "../../data"
    filenames = get_metadata_files(data_path)
    for file in filenames:
        insert_category(
            graph,
            filename=join(data_path, file),
            products_limit=100
        )

try:
    graph.run("Match () Return 1 Limit 1")
    main()
    print('ok')
except Exception as e:
    print(e)
    print(e.with_traceback)
    print('not ok')