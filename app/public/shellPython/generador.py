import pprint
import datetime
from config import db

socios= db.socios
deudas= db.deudas
fecha=datetime.datetime(2009, 11, 10, 10, 45)
for post in socios.find():
	importe=100
	#deuda={"fecha":fecha,"detalle":"DEUDA DEL MES","idSocio":str(post["_id"]),"importe":importe,"importeSaldo":importe,"estado":"PENDIENTE","created":fecha}
	#deudas.insert_one(deuda)
	pprint.pprint(post["fechaNacimiento"])
	