import json
from py2neo import Graph, Node, Relationship, NodeMatcher

def insert_reviews(graph: Graph, filename: str, reviews_limit=1000):
    print(f"* Inserting reviews from '{filename}'")
    with open(filename) as data:
        reviews = json.load(data)
        existing_nodes = NodeMatcher(graph)
        for review in reviews[:reviews_limit]:
            insert_review(graph, existing_nodes, review)


def insert_review(graph: Graph, existing_nodes: NodeMatcher, review):
    # validations
    if not review.get("reviewerID") or not review.get("reviewerName"):
        return
    asin = review.get("asin")
    if not asin:
        return
    product = existing_nodes.match("Product", asin=asin).first()
    if not product:
        return
    
    # insertions
    reviewer = Node(
        'User',
        id=review.get("reviewerID"),
        name=review.get("reviewerName")
    )
    reviewer.__primarykey__ = "id"
    reviewer.__primarylabel__ = "User"
    graph.merge(reviewer)

    REVIEWS = Relationship.type("REVIEWS")
    graph.merge(
        REVIEWS(
            reviewer,
            product,
            overall = review.get("overall"),
            reviewTime = review.get("reviewTime"),
            reviewText = review.get("reviewText"),
            summary = review.get("summary"),
            unixReviewTime = review.get("unixReviewTime"),
        ),
    )
    