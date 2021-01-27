import pymongo
from pymongo import MongoClient
import socket
import datetime
from datetime import date
import os
import getpass
from glob import glob

EDAD_ADHERENTE=20
HOST="localhost"
db=None

def getCarpetaPrograma():
    path=os.path.dirname(os.path.abspath(__file__+"/../../../../../"))
    arr=path.split("/")
    tam=len(arr)
    return arr[tam-1].strip()

def setBase():
    nombreBase=getCarpetaPrograma()
    global db
    global HOST
    if(nombreBase!="www"):
      PORT=3001
      print "es desarrrolo"
      client = MongoClient(HOST, PORT)
      db = client.meteor
    else:
      PORT= 27017
      client = MongoClient(HOST, PORT)
      db=client[nombreBase]

def getValorConfiguracion(tipo):
  conf=db.settings
  res= conf.find_one({"clave":tipo})
  return res['valor']
  
def getTipoSocio(fechaNacimiento,esActivo):
  today = date.today()
  edad=today.year - fechaNacimiento.year - ((today.month, today.day) < (fechaNacimiento.month, fechaNacimiento.day))
 
  EDAD_ADHERENTE=int(getValorConfiguracion("edadAdherente"))
  tipo="ADHERENTE"
  if(esActivo): tipo= "ACTIVO"
  if(edad<EDAD_ADHERENTE): tipo= "PARTICIPANTE"
  return tipo
  
setBase()