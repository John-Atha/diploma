from py2neo import Graph
from .general import add_embedding

graph = Graph(
    "bolt://localhost:7687",
    auth=("neo4j", "admin"),
)

def write_fastRP_embeddings(projection_name):
    graph.run("""
        CALL gds.fastRP.write("""+
            '"'+projection_name+'"'+""",
            {
                embeddingDimension: 128,
                writeProperty: 'fastrp-embedding',
                relationshipWeightProperty: 'weight'
            }
        )    
    """)

def add_fastRP_embeddings():
    add_embedding(
        graph,
        "fastRP_embedding",
        write_fastRP_embeddings
    )

if __name__ == '__main__':
    add_fastRP_embeddings()