#!/usr/bin/python
import pprint
import datetime
import time
import sys

from config import db
EDAD_ADHERENTE=20

def getSocioCbu(cbu,idItemImportacion,importe):
	socios= db.socios
	res=socios.aggregate([{ "$unwind" : "$debitoAutomatico" },{"$match":{"debitoAutomatico.cbu":cbu,"debitoAutomatico.default":True}}])
	
	salida=[]
	i=0
	for document in res:
		i=i+1
		timestamp = str(time.time()+i).replace(".","")
		detalleNombre= document["apellido"]+", "+document["nombre"]+" NRO: "+str(document["nroSocio"])
		salida.append({"idSocio":document["_id"],"importe":importe,"_id":timestamp+"_","detalle":detalleNombre,"idFila":idItemImportacion})
	if(len(salida)==0): return False
	if(len(salida)>1): salida=reasignarImportes(salida)
	return salida

def reasignarImportes(sociosAsignados):
	aux=[]
	for socio in sociosAsignados:
		socio['importe']=getImporteSocio(socio['idSocio'])
		aux.append(socio)
	return aux

def getImporteSocio(idSocio):
  tabla=db.socios
  socio=tabla.find_one({"_id":idSocio})
  print(socio)
  fechaNacimiento=socio["fechaNacimiento"]
  esActivo=socio["esActivo"]
  if(socio):
    today = datetime.date.today()
    edad=today.year - fechaNacimiento.year - ((today.month, today.day) < (fechaNacimiento.month, fechaNacimiento.day))
    
    if(esActivo):return getValorConfiguracion("importeActivos")
    if(edad>=EDAD_ADHERENTE):return getValorConfiguracion("importeAdherentes")
    return getValorConfiguracion("importeParticipantes")
  
def getValorConfiguracion(tipo):
  conf=db.settings
  res= conf.find_one({"clave":tipo})
  return res['valor']
  
def ingresarImportacion(data):
	importaciones= db.importarPagos
	importaciones.insert_one(data)
	
def getDataImportacion(items,desc,formaPago,fechaCarga):
	timestamp = str(time.time()).replace(".","")
	d = datetime.datetime.strptime(fechaCarga, "%Y-%m-%d")

	fechaAct=datetime.datetime.utcnow()
	return {"_id":timestamp,"descripcion":desc,"created":fechaAct,"estado":"PENDIENTE","items":items,"formaPago":formaPago,"fechaCarga":d,"pagos":[]};

def getItems(archivo):
	file = open(archivo,"r")
	items=[]
	i=0
	for line in file: 
		cbu= line[33:58]
		estado= line[173:176]
		nombres= line[58:80]
		importes= line[107:111]
		ts = (str(time.time())+"_"+str(i)).replace(".","")
		nombres=unicode(nombres, errors='replace')
		aux={"cbu":cbu,"estado":estado,"nombreSocio":nombres,"id":ts,"importe":importes,"sociosAsociados":[]}
		socio=getSocioCbu(cbu,ts,importes)
		if(socio!=False):
			aux["sociosAsociados"]=socio
		items.append(aux)
		i=i+1
	return items

items=getItems("tmp.csv")
importacion=getDataImportacion(items,str(sys.argv[1]),str(sys.argv[2]),str(sys.argv[3]))
ingresarImportacion(importacion)

