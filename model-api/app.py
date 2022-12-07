from flask import Flask, jsonify
from helpers.recommendations import make_recommendations
from helpers.train_test import train_test
from helpers.dataset import load_data_dataset, split_dataset
from helpers.get_model import get_model

app = Flask(__name__)
dataset, data = load_data_dataset()
train_data, val_data, test_data = split_dataset(dataset, data)


@app.route('/users/<id>/predict')
def predict_for_user(id: int):
    model = None
    results = make_recommendations(dataset, data, model)
    movies = [
        {
            "title": "Toy Story",
            "id": "124214",
            "rating": 3.5,
        },
        {
            "title": "Superman",
            "id": "05962834",
            "rating": 4.5,
        }
    ]
    return jsonify(movies)


@app.route('/train/<epochs>', methods=["POST"])
def re_train_model(epochs: int):
    model = get_model()
    losses = train_test(
        model=model,
        epochs=epochs,
        train_data=train_data,
        val_data=val_data,
        test_data=test_data,
        logging_step=5,
        lr=0.012,
    )
    return "OK"
