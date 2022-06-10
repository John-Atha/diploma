from py2neo import Graph

def add_to_catalog(graph: Graph, PROJECTION_NAME: str):
    graph.run("""
        CALL gds.graph.project("""+
            '"'+PROJECTION_NAME+'"'+""",
            ['Product', 'Category'],
            {
                Similarity: {
                    properties: "weight",
                    orientation: "UNDIRECTED"
                },
                BELONGS_TO: {
                    properties: "weight",
                    orientation: "UNDIRECTED"
                }
            }
        )
    """)

def remove_from_catalog(graph: Graph, PROJECTION_NAME: str):
    graph.run(f"""
        CALL gds.graph.drop("{PROJECTION_NAME}")
    """)

def add_embedding(graph: Graph, PROJECTION_NAME: str, method):
    print("* Adding to graph catalog")
    add_to_catalog(graph, PROJECTION_NAME)
    print("* Writting embeddings")
    method(PROJECTION_NAME)
    print("* Removing from catalog")
    remove_from_catalog(graph, PROJECTION_NAME)

