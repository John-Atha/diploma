from insert_metadata.main import main
from insert_metadata.seen_bought_together import add_seen_bought_together
from insert_metadata.similarities import add_similarities
from node_embeddings.fastRP import add_fastRP_embeddings
from node_embeddings.node2vec import add_node2vec_embeddings
from py2neo import Graph

graph = Graph(
    "bolt://localhost:7687",
    auth=("neo4j", "admin"),
)

def reset():
    print("* Resetting DB...")
    graph.run("""
        MATCH (p) detach delete p;
    """)

reset()
main()
add_seen_bought_together()
add_similarities()
add_fastRP_embeddings()
add_node2vec_embeddings()