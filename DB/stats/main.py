from py2neo import Graph, Node, Relationship
from tabulate import tabulate

graph = Graph(
    "bolt://localhost:7687",
    auth=("neo4j", "admin"),
)

def compute_one_stat(metric="adamicAdar", keyword="max"):
    return graph \
        .run(
            f"""
                match (p1: Product)
                match (p2: Product)
                with p1 as node1, p2 as node2, gds.alpha.linkprediction.{metric}(p1, p2) as metric
                where node1<>node2
                return {keyword}(metric);
            """) \
        .evaluate()

def compute_stats(metric="adamicAdar"):
    min = compute_one_stat(metric, "min")
    max = compute_one_stat(metric, "max")
    avg = compute_one_stat(metric, "avg")
    return min, max, avg

def compute_distribution(metric):
    data = graph \
        .run(
            f"""
                match (p1:Product)
                match (p2: Product)
                with p1 as node1, p2 as node2, gds.alpha.linkprediction.{metric}(p1, p2) as metric
                where node1<>node2
                return metric
            """
        ) \
        .data()
    values = [datum['metric'] for datum in data]
    return values

def table_row(metric):
    return [metric, *(i for i in compute_stats(metric))]

table = [
    ["Metric", "min", "max", "avg"],
    table_row("adamicAdar"),
    table_row("commonNeighbors"),
    table_row("preferentialAttachment"),
    table_row("resourceAllocation"),
    table_row("sameCommunity"),
    table_row("totalNeighbors"),
]

print(tabulate(table, headers="firstrow", tablefmt="github"))