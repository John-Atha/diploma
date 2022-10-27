from py2neo import Graph, Node, Relationship
from py2neo.bulk import merge_nodes
from ..utils.general import get_movie_year, remove_year_from_title

def insert_movies(graph: Graph, movies, limit: int):
    merge_nodes(
        tx=graph.auto(),
        data=movies[:limit],
        merge_key=("Movie", "title"),
        labels={"Movie"}
    )

def create_attach_genre(graph: Graph, movie: Node, relationship, genre_name: str):
    genre = Node("Genre", name=genre_name)
    genre.__primarylabel__ = "Genre"
    genre.__primarykey__ = "name"
    graph.merge(relationship(movie, genre))

def insert_movie_genres(graph: Graph, movie: Node):
    BELONGS_TO = Relationship.type("BELONGS_TO")
    genres = movie["genres"]
    genres_list = genres.split("|") if genres else []
    for genre_name in genres_list:
        create_attach_genre(graph, movie, BELONGS_TO, genre_name)

def insert_movies_genres(graph: Graph):
    movies = graph.nodes.match("Movie")
    for movie in movies:
        insert_movie_genres(graph, movie)

def insert_movie_year(graph: Graph, movie: Node):
    date = get_movie_year(movie)
    if date:
        PUBLISHED_IN = Relationship.type("PUBLISHED_IN")
        year = Node("Year", date=date)
        year.__primarylabel__ = "Year"
        year.__primarykey__ = "date"
        graph.merge(PUBLISHED_IN(movie, year))

def insert_movies_years(graph: Graph):
    movies = graph.nodes.match("Movie")
    for movie in movies:
        insert_movie_year(graph, movie)

def update_movies_titles(graph: Graph):
    movies = graph.nodes.match("Movie")
    for movie in movies:
        movie["new_title"] = remove_year_from_title(movie)
        graph.push(movie)

def connect_neighbour_years(graph: Graph):
    years = graph.nodes.match("Year")
    for year1 in years:
        for year2 in years:
            y1 = int(year1["date"])
            y2 = int(year2["date"])
            if y1<y2<=y1+2:
                IS_CLOSE = Relationship.type("IS_CLOSE")
                weight = round(10/abs(y1-y2), 2)
                graph.merge(IS_CLOSE(year1, year2, weight=weight))