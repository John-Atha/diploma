from fileinput import filename
from urllib import request
import json
import gzip
import re
from pathlib import Path

def unzip(
    source_url="http://example.com/python_list_turned_into.json.gz",
    target_file='target.json',
    data_dir='../data'
):
    print("* Downloading file from url:", source_url)
    filename = re.split(pattern="/", string=source_url)[-1]
    request.urlretrieve(
        url=source_url,
        filename=filename
    )
    with gzip.open(filename, 'rb') as file:
        data = []
        for line in file:
            datum = json.loads(line.strip())
            data.append(datum)
        Path(data_dir).mkdir(parents=True, exist_ok=True)
        f = open(f"{data_dir}/{target_file}", "w+")
        f.write(json.dumps(data, indent=2))
        print("OK")