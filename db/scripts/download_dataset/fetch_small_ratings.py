import os
import re
from unzipper import unzip
import pathlib
from urllib import request

d = pathlib.Path(__file__).parent.parent.parent.absolute()
data_dir = os.path.join(d, "data")

categories = [
    'AMAZON_FASHION',
    # 'All_Beauty',
    # 'Appliances',
]

base_urls = [
    'http://deepyeti.ucsd.edu/jianmo/amazon/categoryFilesSmall/',
]

for category in categories:
    for base_url in base_urls:
        source_url = base_url+category+".csv"

        filename = re.split(pattern="/", string=source_url)[-1]
        request.urlretrieve(
            url=source_url,
            filename=filename
        )