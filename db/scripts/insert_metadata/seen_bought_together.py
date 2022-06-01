from py2neo import Graph, Node, Relationship

graph = Graph(
    "bolt://localhost:7687",
    auth=("neo4j", "admin"),
)

def add_also_buy_view_edges(product: Node, attr: str, edge: str):
    print(f"Adding {edge} for product {product.get('asin')}")
    neighbours_asins = product.get(attr) or []
    EDGE = Relationship.type(edge)
    for asin in neighbours_asins:
        neighbour = graph.nodes.match("Product", asin=asin).first()
        if neighbour:
            graph.merge(EDGE(product, neighbour))
            graph.merge(EDGE(neighbour, product))
        

def add_product_edges(product: Node):
    add_also_buy_view_edges(
        product,
        'also_buy',
        'BOUGHT_TOGETHER'
    )
    add_also_buy_view_edges(
        product,
        'also_view',
        'SEEN_TOGETHER'
    )

def main():
    products = graph.nodes.match("Product")
    for product in products:
        add_product_edges(product)

main()
