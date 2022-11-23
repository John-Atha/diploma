# https://towardsdatascience.com/integrate-neo4j-with-pytorch-geometric-to-create-recommendations-21b0b7bc9aa
import torch
from tqdm import tqdm
from statistics import mean

def make_recommendations(dataset, data, model):
    mappings = dataset.my_mappings
    movies_mapping = mappings["movies_mapping"]
    users_mapping = mappings["users_mapping"]

    num_movies = len(movies_mapping)
    num_users = len(users_mapping)

    reverse_movie_mapping = dict(zip(movies_mapping.values(),movies_mapping.keys()))
    reverse_user_mapping = dict(zip(users_mapping.values(),users_mapping.keys()))

    results = []

    for user_id in range(0, num_users): 
        """
        * to predict the ratings for each user to all the movies
        * add one edge from the user to each one of the movies to the: `edge_label_index`
        * the Model will predict the rating that the user would give to each one of the movies
        """
        row = torch.tensor([user_id] * num_movies)
        col = torch.arange(num_movies)
        edge_label_index = torch.stack([row, col], dim=0)

        pred = model(data.x_dict, data.edge_index_dict,
                    edge_label_index)
        pred = pred.clamp(min=0, max=5)

        user_neo4j_id = reverse_user_mapping[user_id]

        mask = (pred == 5).nonzero(as_tuple=True)

        predictions = [reverse_movie_mapping[el] for el in  mask[0].tolist()]
        results.append({'user': user_neo4j_id, 'movies': predictions})
    
    return results


def get_reviews_suggestions_intersection(dataset, results):
    all_users = 0
    problem_users = 0
    num_suggested = []
    num_reviewed = []
    for suggestions in tqdm(results):
    # for suggestions in results:
        user_id = suggestions["user"]
        suggested_movies_ids = suggestions["movies"]
        reviewed_movies = dataset.get_ratings_by_user(user_id)
        reviewed_movies_ids = reviewed_movies["movieId"].values
        all_users += 1
        common_movies = set(suggested_movies_ids).intersection(set(reviewed_movies_ids))
        num_suggested.append(len(set(suggested_movies_ids)))
        num_reviewed.append(len(set(reviewed_movies_ids)))
        if len(common_movies):
            problem_users += 1
            # print(user_id, len(common_movies)/len(suggested_movies_ids))
    print("Users that got suggestions of movies they have already rated:", round((problem_users/all_users)*100), "%")
    print("Average number of suggested movies per user:", round(mean(num_suggested)))
    print("Average number of rated movies per user:", round(mean(num_reviewed)))


def get_user_suggestions(dataset, results, userId: int):
    movies_ids = []
    movies = []
    for sugg in results:
        if sugg["user"] == userId:
            movies_ids = sugg["movies"]
            break
    for movie_id in movies_ids:
        movie = dataset.get_movie_by_id(movie_id).iloc[0]
        if not movie.empty:
            movies.append(movie["title"])
    return movies

def get_user_reviews(dataset, userId: int):
    reviews_ = []

    reviews = dataset.get_ratings_by_user(userId)
    movies_ratings = reviews[["movieId", "rating"]].values
    for movie_rating in movies_ratings:
        movie_id, rating = movie_rating
        movie = dataset.get_movie_by_id(int(movie_id)).iloc[0]
        if not movie.empty:
            reviews_.append((movie["title"], rating))
    return sorted(reviews_, key=lambda review: review[1], reverse=True)

def analyze_user(dataset, results, user_id):
    print(get_user_reviews(dataset, user_id))
    print("-----------------------")
    print(get_user_suggestions(dataset, results, user_id))