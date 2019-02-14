import pymongo
from collections import Counter

conn_url = 'mongodb://127.0.0.1:3001/meteor'
print(conn_url)
conn = pymongo.MongoClient(conn_url)
db = 'meteor'
print(conn[db].list_collection_names())
coll = conn[db]['SseSamples']


def remove_dups(folder):
    count_fns = Counter()
    for d in coll.find({'folder': folder}): count_fns[d['file']] += 1
    dup_fns = [fn for fn in count_fns if count_fns[fn] > 1]
    for fn in dup_fns:
        for i, d in enumerate(coll.find({'folder': folder, 'file': fn})):
            if i == 0: continue
            coll.delete_one({'_id': d['_id']})

remove_dups('/STR-06-030C_pred')
remove_dups('/SPF-157_pred')
