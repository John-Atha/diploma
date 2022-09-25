import json
from py2neo.bulk import merge_nodes, merge_relationships
from py2neo import Graph, Node, Relationship

def filter_product(product, category):
    properties = [
        "asin",
        "title",
        "description",
        "also_buy",
        "also_view",
        "brand",
        "imageURL",
        "imageURLHighRes",
    ]
    res = {
        key: product.get(key)
        for key in properties
    }
    res['category'] = category
    return res

def create_attach_category_node(graph: Graph, name: str):
    print(f"* Adding category: {name}")
    category = Node("Category", name=name)
    category.__primarylabel__ = "Category"
    category.__primarykey__ = "name"
    products = graph.nodes.match("Product", category=name)
    BELONGS_TO = Relationship.type("BELONGS_TO")
    for product in products:
        graph.merge(BELONGS_TO(product, category, weight=1))


def insert_category(graph: Graph, filename: str, products_limit=100):
    print(f"* Inserting products metadata from file: {filename}")
    with open(filename) as data:
        category_name = filename.split("meta_")[-1].replace('.json', '').lower()
        products = json.load(data)
        products = list(map(
            lambda x: filter_product(x, category_name),
            products[:products_limit]
        ))
        merge_nodes(
            tx=graph.auto(),
            data=products,
            merge_key=("Product", "title"),
            labels={"Product"}
        )
        print(f"* Counting: {graph.nodes.match('Product').count()} products now")
        create_attach_category_node(graph, category_name)
