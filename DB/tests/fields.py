from helpers import assert_fields
import os
import pathlib

d = pathlib.Path(__file__).parent.parent.absolute()
data_dir = os.path.join(d, "data")

fields = [
    'asin',
    'title',
    'main_cat',
    'imageURL',
    'imageURLHighRes',
    'description',
    'brand',
    'also_view',
    'also_buy',
]

assert_fields(data_dir, fields)
