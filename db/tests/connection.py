from py2neo import Graph

graph = Graph(
    # "bolt://0.0.0.0:7687",
    "bolt://localhost:7687",
    # "http://0.0.0.0:7687",
    # "bolt+s://localhost:7687",
    auth=("neo4j", "admin"),
    # name="neo4j"
)

try:
    graph.run("Match () Return 1 Limit 1")
    print('ok')
except Exception as e:
    print(e)
    print(e.with_traceback)
    print('not ok')