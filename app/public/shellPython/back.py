import os
from os.path import join
import datetime
from bson.json_util import dumps
from config import db
import tarfile

collections = db.collection_names()
path=os.getcwd()+"/"+"../web.browser/app/shellPython/"

archivo="backup___"+datetime.datetime.now().strftime("%Y-%m-%d|%H:%M:%S")+".tar"
for i, collection_name in enumerate(collections):
	col = getattr(db,collections[i])
	collection = col.find()
	jsonpath = collection_name + ".json"
	jsonpath = path+ join("back", jsonpath)
	with open(jsonpath, 'wb') as jsonfile:
		jsonfile.write(dumps(collection))
tar = tarfile.open(path+archivo, "w")
tar.add(path+"/back")
tar.close()
print(archivo) 