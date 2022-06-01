import os
import re
from unzipper import unzip

data_dir = "../../data"

categories = [
    'AMAZON_FASHION',
    'All_Beauty',
    'Appliances',
]

base_urls = [
    'http://deepyeti.ucsd.edu/jianmo/amazon/categoryFiles/',
    'http://deepyeti.ucsd.edu/jianmo/amazon/metaFiles2/meta_',
]

for category in categories:
    for base_url in base_urls:
        source_url = base_url+category+".json.gz"
        filename = re.split(pattern="/", string=base_url)[-1]+category+".json"
        unzip(
            source_url=source_url,
            target_file=filename,
            data_dir=data_dir,
        )
        os.remove(re.split(pattern="/", string=source_url)[-1])