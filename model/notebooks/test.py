import pandas as pd

# movies_small = pd.read_csv("../movies_with_metadata/links_small.csv")

# movies_ratings = pd.read_csv("../movies_with_metadata/ratings_small.csv", low_memory=False)

# movies_small_ids = set(str(i) for i in movies_small["movieId"].values)
# movies_ratings_ids = set(str(i) for i in movies_ratings["movieId"].values)

# print(len(movies_small_ids))
# print(len(movies_ratings_ids))
# print(len(movies_small_ids.difference(movies_ratings_ids)))
# print(movies_small_ids.difference(movies_metadata_ids))


# movies = pd.read_csv("../movies_with_metadata/movies_metadata.csv")

# for id in movies["imdb_id"].values:
#     try:
#         x = id.startswith("tt")
#         print(id.replace("tt", ""))
#     except Exception as e:
#         print(id)

# rated_movies_metadata = pd.read_csv("../movies_with_metadata/ratings_small.csv")
# links_small_movies_metadata = pd.read_csv("../data_small/links.")

# rated_movies_simple = pd.read_csv("../data_small/ratings.csv")
# rated_movies_metadata_ids = set(rated_movies_metadata["movieId"].values)


imdb_ids_metadata = pd.read_csv("../movies_with_metadata/links.csv")
imdb_ids_simple = pd.read_csv("../data/links.csv")

imdb_ids_metadata_ids = set(str(i) for i in imdb_ids_metadata["imdbId"].values)
imdb_ids_simple_ids = set(str(i) for i in imdb_ids_simple["imdbId"].values)

print(len(imdb_ids_metadata_ids))
print(len(imdb_ids_simple_ids))

print(len(imdb_ids_simple_ids.difference(imdb_ids_metadata_ids)))
print(len(imdb_ids_metadata_ids.difference(imdb_ids_simple_ids)))

# test
# users_metadata_ids = set(rated_movies_metadata["userId"].values)
# rated_movies_simple_ids = set(rated_movies_simple["movieId"].values)
# users_simple_ids = set(rated_movies_simple["userId"].values)

# print(len(rated_movies_metadata_ids), len(users_metadata_ids))
# print(len(rated_movies_simple_ids), len(users_simple_ids))

