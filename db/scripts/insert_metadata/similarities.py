from py2neo import Graph, Node, Relationship

graph = Graph(
    "bolt://localhost:7687",
    auth=("neo4j", "admin"),
)

SEEN_TOGETHER_SCORE = 1
BOUGHT_TOGETHER_SCORE = 3

def delete_one_type_edges(edge_name):
    graph.run(f"""
        match (p)-[l:{edge_name}]->(p1) delete l;
    """)

def use_one_type_edges(edge_name, weight):
    query = f"""
        match (p1:Product)
        match (p2:Product)
        match (p1)-[l]->(p2)
        with count(distinct l) as rels, p1 as p1, p2 as p2, l as l
        where p1<>p2
        and rels=1
        and type(l)="{edge_name}"        
        merge (p1)-[s: Similarity
    """ + " { weight:"+ str(weight) +"}]->(p2)"
    graph.run(query)

def use_seen_together_edges():
    use_one_type_edges(
        edge_name="SEEN_TOGETHER",
        weight=SEEN_TOGETHER_SCORE,
    )

def use_bought_together_edges():
    use_one_type_edges(
        edge_name="BOUGHT_TOGETHER",
        weight=BOUGHT_TOGETHER_SCORE,
    )

def use_seen_and_bought_together_edges():
    query = """
        match (p1:Product)
        match (p2:Product)
        match (p1)-[l]->(p2)
        with count(distinct l) as rels, p1 as p1, p2 as p2, l as l
        where p1<>p2
        and rels=2
        create (p1)-[s: Similarity { weight:
    """ + str(SEEN_TOGETHER_SCORE+BOUGHT_TOGETHER_SCORE) + "}]->(p2)"
    graph.run(query)

def add_similarities():
    print("* Adding similarities for both seen and bought together")
    use_seen_and_bought_together_edges()
    print("* Adding similarities only for seen together")
    use_seen_together_edges()
    print("* Adding similarities only for bought together")
    use_bought_together_edges()
    print("* Delete seen together edges ")
    delete_one_type_edges("BOUGHT_TOGETHER")
    print("* Delete bought together edges ")
    delete_one_type_edges("SEEN_TOGETHER")

if __name__ == '__main__':
    add_similarities()