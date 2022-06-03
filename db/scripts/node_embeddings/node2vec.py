from py2neo import Graph
from .general import add_embedding

graph = Graph(
    "bolt://localhost:7687",
    auth=("neo4j", "admin"),
)

def write_node2vec_embeddings(projection_name):
    graph.run("""
        CALL gds.beta.node2vec.write("""+
            '"'+projection_name+'"'+""",
            {
                embeddingDimension: 128,
                writeProperty: 'node2vec-embedding',
                relationshipWeightProperty: 'weight'
            }
        ) 
    """)

def add_node2vec_embeddings():
    add_embedding(
        graph,
        "node2vec_embedding",
        write_node2vec_embeddings
    )

if __name__ == '__main__':
    add_node2vec_embeddings()