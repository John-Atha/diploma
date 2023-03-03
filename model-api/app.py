import os
import threading
from flask import Flask, jsonify, request
from helpers.recommendations import make_predictions, recommend
from helpers.train_test import train_test_async
from helpers.dataset import load_data_dataset, split_dataset
from helpers.get_model import get_model, get_model_name
from helpers.refresh import sync_users
import torch

app = Flask(__name__)
dataset, data = load_data_dataset()
train_data, val_data, test_data = split_dataset(dataset, data)


@app.route('/users/<id>/predict')
def predict_for_user(id: int):
    if not id.isnumeric():
        return "User id must be an integer", 400
    # get value of query param with name 'round'
    round = int(request.args.get('round')) if request.args.get('round') is not None else 0
    model = get_model(data)
    results = make_predictions(dataset, data, model, int(id), use_round=round)
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
    # start a thread to execute the train_async function
    thread = threading.Thread(target=train_async, args=(epochs,))
    thread.setDaemon(True)
    thread.start()
    return "OK"

@app.route('/refresh', methods=["POST"])
def refresh():
    # start a thread to execute the refresh_async function
    thread = threading.Thread(target=refresh_async)
    thread.setDaemon(True)
    thread.start()
    return "OK"

def refresh_async():
    global dataset, data, train_data, val_data, test_data
    dataset, data = load_data_dataset()
    train_data, val_data, test_data = split_dataset(dataset, data)
    model = get_model(data)
    # sync the weights
    sync_users(
        model,
        database_url=os.environ.get("DATABASE_URL"),
        database_username=os.environ.get("DATABASE_USERNAME"),
        database_password=os.environ.get("DATABASE_PASSWORD")
    )
    # save it back to disk
    model_name = get_model_name()
    torch.save(model, model_name)

def train_async(epochs):
    refresh_async()
    train_test_async(data, epochs, train_data, test_data, val_data)