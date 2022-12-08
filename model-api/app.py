from flask import Flask, jsonify
from helpers.recommendations import make_predictions, recommend
from helpers.train_test import train_test
from helpers.dataset import load_data_dataset, split_dataset
from helpers.get_model import get_model
import torch

app = Flask(__name__)
dataset, data = load_data_dataset()
train_data, val_data, test_data = split_dataset(dataset, data)


@app.route('/users/<id>/predict')
def predict_for_user(id: int):
    if not id.isnumeric():
        return "User id must be an integer", 400
    model = get_model(data)
    results = make_predictions(dataset, data, model, int(id))
    return jsonify(results)

@app.route('/users/<id>/recommend/<limit>')
def recommend_for_user(id: int, limit: int):
    if not id.isnumeric():
        return "User id must be an integer", 400
    if not limit.isnumeric() or int(limit) <= 0:
        return "Limit must be a positive integer", 400
    model = get_model(data)
    results = recommend(dataset, data, model, int(id), int(limit))
    return jsonify(results)

@app.route('/train/<epochs>', methods=["POST"])
def re_train_model(epochs):
    if not epochs.isnumeric():
        return "Epochs must be an integer", 400
    refresh()
    model = get_model(data)
    model, losses = train_test(
        model=model,
        epochs=int(epochs),
        train_data=train_data,
        val_data=val_data,
        test_data=test_data,
        logging_step=5,
        lr=0.012,
    )
    torch.save(model, "pickled_model")
    return "OK"

@app.route('/refresh', methods=["POST"])
def refresh():
    global dataset, data, train_data, val_data, test_data
    dataset, data = load_data_dataset()
    train_data, val_data, test_data = split_dataset(dataset, data)
    return "OK"