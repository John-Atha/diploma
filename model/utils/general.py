import pathlib
import os
from os.path import join
from py2neo import Node
import pandas as pd

def read_csv(filename: str, parent_dir_name="data_small", low_memory=True, sep=None):
    db_directory_path = pathlib.Path(os.getcwd()).parent.absolute()
    data_directory_path = join(db_directory_path, parent_dir_name)
    file_path = join(data_directory_path, f"{filename}.csv")
    print("Reading from:", file_path)
    if sep:
        df = pd.read_csv(file_path, low_memory=low_memory, sep=sep)
    else:
        df = pd.read_csv(file_path, low_memory=low_memory)
    return df

def df_to_json(df):
    return df.to_dict("records")

def get_movie_year(movie: Node):
    title = movie["title"]
    year = movie["year"]
    print(title, year)
    return year

def get_year_from_title(title: str):
    year = None
    title_ = title.strip()
    try:
        year = int(title_[-5:-1])
    except Exception as e:
        # print(e, title_)
        pass
    return year or 1

def remove_year_from_title(movie: Node):
    return remove_year_from_title_str(movie["title"])

def remove_year_from_title_str(title: str):
    title_ = title
    try:
        year = get_year_from_title(title)
        if year:
            return title_.replace(f" ({year})", "").strip()
        return title_
    except Exception as e:
        print(e)
    return title_