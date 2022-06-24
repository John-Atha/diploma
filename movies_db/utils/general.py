import pathlib
import os
from os.path import join
from py2neo import Node
import pandas as pd

def read_csv(filename: str):
    db_directory_path = pathlib.Path(os.getcwd()).parent.absolute()
    data_directory_path = join(db_directory_path, "data")
    file_path = join(data_directory_path, f"{filename}.csv")
    print("Reading from:", file_path)
    df = pd.read_csv(file_path)
    return df

def df_to_json(df):
    return df.to_dict("records")

def get_movie_year(movie: Node):
    title = movie["title"]
    return get_year_from_title(title)

def get_year_from_title(title: str):
    year = None
    title_ = title.strip()
    try:
        year = int(title_[-5:-1])
    except Exception as e:
        # print(e, title_)
        pass
    return year or 2000

def remove_year_from_title(movie: Node):
    return remove_year_from_title_str(movie["title"])

def remove_year_from_title_str(title: str):
    title_ = title
    try:
        year = get_year_from_title(title)
        return title_.replace(f" ({year})", "").strip()
    except Exception as e:
        print(e)
    return title_