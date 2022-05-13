from helpers import assert_fields

data_path = "../data"
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

assert_fields(data_path, fields)
