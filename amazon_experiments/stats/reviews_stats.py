from collections import defaultdict
import json
import os, pathlib
from os.path import join
from pathlib import Path
from statistics import mean, median
import sys

file_path = Path(os.path.realpath(__file__)).parent.parent.absolute()
sys.path.append(str(file_path))

from tests.helpers import get_reviews_files

d = pathlib.Path(__file__).parent.parent.absolute()

def main():
    data_path = join(d, "data")
    filenames = get_reviews_files(data_path)
    reviews_count = defaultdict(int)

    for file in filenames:
        filename = join(data_path, file)
        print(f"* Reading reviews from '{file}'")
        try:
            with open(filename) as data:
                reviews = json.load(data)
                for review in reviews:
                    reviewer_id = review.get("reviewerID")
                    reviews_count[reviewer_id] += 1
        except Exception as err:
            print(err)
    counts = reviews_count.values()
    print(f"* Reviews: {len(counts)}")
    print(f"* Mean: {mean(counts)}")
    print(f"* Median: {median(counts)}")

if __name__ == '__main__':
    main()
