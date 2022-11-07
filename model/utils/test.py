import pandas as pd

ratings_small = pd.read_csv("../movies_with_metadata/ratings_small.csv")
s = ratings_small.groupby((["userId"])).size().reset_index(name='counts')
print(s)

ratings_small2 = pd.read_csv("../data_small/ratings.csv")
s2 = ratings_small2.groupby((["userId"])).size().reset_index(name='counts')
print(s2)

# metadata = pd.read_csv("../movies_with_metadata/movies_metadata.csv")
# metadata_movies = set(metadata["id"].values)
# print(len(metadata_movies))

