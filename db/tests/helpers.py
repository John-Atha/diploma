from os import listdir
from os.path import isfile, join
import json

def is_metadata(path, filename):
    return isfile(join(path, filename)) and filename.startswith('meta_')

def is_review(path, filename):
    return isfile(join(path, filename)) and not filename.startswith('meta_')

def get_metadata_files(data_path):
    data_files = [
        f for f in listdir(data_path)
        if is_metadata(data_path, f)
    ]
    return data_files

def get_reviews_files(data_path):
    data_files = [
        f for f in listdir(data_path)
        if is_review(data_path, f)
    ]
    return data_files

def assert_fields(data_path, fields):
    counter = { field: 0 for field in fields }
    filenames = get_metadata_files(data_path)
    print("Testing files:", filenames)
    for file in filenames[:1]:
        with open(join(data_path, file), 'rb') as f:
            products = json.load(f)
            for product in products:
                for field in fields:
                    try:
                        assert product.get(field)
                    except AssertionError:
                        counter[field] += 1
    for field in fields:
        if not counter[field]:                
            print(f"✔️  All product objects have the field: '{field}'")
        else:
            print(f"⚠️  {counter[field]} products do not have the field '{field}'")