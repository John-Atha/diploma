from statistics import mean
from py2neo import Graph, Node, Relationship
import datetime
from .sentiment import sentiment_vader
from random_username.generate import generate_username

def insert_rating(graph: Graph, userId: int, movieId: int, rating: float, timestamp: int):
    movie = graph.nodes.match("Movie", movieId=movieId).first()
    username = generate_username(1)[0]
    if movie:
        user = Node("User", userId=userId, username=username)
        user.__primarylabel__ = "User"
        user.__primarykey__ = "userId"
        # datetime_ = datetime.datetime.fromtimestamp(timestamp)
        RATES = Relationship.type("RATES")
        graph.merge(RATES(user, movie, rating=rating, datetime=timestamp))

def insert_ratings(graph: Graph, ratings, limit: int):
    for rating in ratings[:limit]:
        insert_rating(graph, rating["userId"] , rating["movieId"], rating["rating"], rating["timestamp"])

def insert_users_ratings_stats(graph: Graph):
    users = graph.nodes.match("User")
    for user in users:
        user_ratings = graph.match((user, None), "RATES").all()
        count = len(user_ratings)
        avg = round(mean(map(lambda rating: rating["rating"], user_ratings)), 2)
        user["avg_rating"] = avg
        user["count_rating"] = count
        graph.push(user)

def insert_tag(graph: Graph, userId: int, movieId: int, tag: str, timestamp: int):
    movie = graph.nodes.match("Movie", movieId=movieId).first()
    if movie:
        TAGS = Relationship.type("TAGS")
        user = Node("User", userId=userId)
        user.__primarylabel__ = "User"
        user.__primarykey__ = "userId"
        datetime_ = datetime.datetime.fromtimestamp(timestamp)
        sentiment = sentiment_vader(tag)["overall"]
        graph.merge(TAGS(user, movie, tag=tag, datetime=datetime_, sentiment=sentiment))

def insert_tags(graph, tags, limit):
    for tag in tags[:limit]:
        insert_tag(graph, tag["userId"], tag["movieId"], tag["tag"], tag["timestamp"])

