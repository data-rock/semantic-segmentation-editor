import pymongo, os, json
import ipdb
from pathlib import Path
import cv2
import numpy as np
import matplotlib.pyplot as plt
import bz2
from skimage.measure import find_contours
import datetime
from tqdm import tqdm
from copy import deepcopy

conn_url = 'mongodb://127.0.0.1:3001/meteor'
print(conn_url)
conn = pymongo.MongoClient(conn_url)
db = 'meteor'
coll = conn[db]['SseSamples']

for i, d in enumerate(coll.find()):
    if i % 100 == 0: print(i)
    coll.delete_one({'_id': d['_id']})

exit(1)
count = 0
for i, d in enumerate(coll.find()):
    if i % 100 == 0: print(i, count)
    if d['folder'] == '/SPF-129':
        count += 1
        coll.delete_one({'_id': d['_id']})
print(count)
