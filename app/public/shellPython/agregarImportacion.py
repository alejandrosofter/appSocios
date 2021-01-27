#!/usr/bin/python
import pprint
import time
import datetime
from datetime import  timedelta
import time
import sys
from bson.objectid import ObjectId 
from config import db
  
EDAD_ADHERENTE=20

def getImportacion(idImp):
  tabla= db.importarPagos
  return tabla.find_one({"_id":idImp})

def buscarDebitoSocio(idSocio,cbu):
  tabla= db.socios
  print idSocio
  print cbu
  res=tabla.find_one({"_id":idSocio,"debitoAutomatico.cbu":cbu})
  return res

def getProxRecivo():
  aux=db.settings.find_one({"clave":"proxNroRecivo"})
  return int(aux['valor'])

def incrementaRecivo():
  prox=getProxRecivo()+1
  aux=db.settings.update({"clave":"proxNroRecivo"},{"valor":prox,"clave":"proxNroRecivo"})

def ingresarPago(data,cbu,estado,fecha,formaPago,importe):
  tabla= db.socios
  
  id=ObjectId()
  detalle="PAGO POR DEBITO AUTOMATICO ARCHIVO (RESULTADO: "+estado+" )"
  prox=getProxRecivo()
  print(fecha)
  fecha = datetime.datetime.strptime(str(fecha), '%Y-%m-%d %H:%M:%S')
  datosPago={"_id":str(id),"esDebitoAutomatico":True,"fecha":fecha,"nroRecivo":prox,"detalle":detalle,"formaPago":formaPago,"importeDebita":0,"importeAcredita":importe,"importeCargaActividad":0,"importeCarnet":0,"importeCargaSocial":0,"importeOtros":0,"importeCuotaSocial":importe,"importeFormaPago":importe,"motivo":"PAGO DEBITO AUTOMATICO"}
  try:
    tabla.update({"_id":data['idSocio']},{"$push":{"movimientosCuenta":datosPago}})
    incrementaRecivo()
  except KeyError:
    print("no se puede cargar pago")
  return id

def agregarDebito(data,cbu,titular):
  tabla= db.socios
  id=ObjectId()
  tabla.update({"_id":data['idSocio'],"debitoAutomatico.default":True},{"$set":{"debitoAutomatico.$.default":False}})
  datosDebito={"_id":str(id), "fecha":datetime.datetime.utcnow(), "default":True, "cbu":cbu, "banco":"A definir", "titular":titular, "cuil":"0", "nroCuenta":"0", "tipoCuenta":"CUENTA OTRAS"}
  tabla.update({"_id":data['idSocio']},{"$push":{"debitoAutomatico":datosDebito}})
  
def ingresarDebitoSocio(data,cbu,titular):
  try:
    deb=buscarDebitoSocio(data['idSocio'],cbu)
  except:
    deb=None
  if deb==None:
    agregarDebito(data,cbu,titular)

def procesarImportacion(idImportacion):
  importacion= getImportacion(idImportacion)
  
  pagos=[]
  for imp in importacion["items"]:
    for dataSocio in imp["sociosAsociados"]:
      le=len(imp["sociosAsociados"])
      importe=0
      try:
        if(imp["estado"]=="ACE"): importe=float(dataSocio['importe'])
      except:
        print("erro importe")
      
      try:
        idPago=ingresarPago(dataSocio,imp["cbu"],imp["estado"],importacion['fechaCarga'],importacion['formaPago'],importe)
        ingresarDebitoSocio(dataSocio,imp["cbu"],imp["nombreSocio"])
        pagos.append({"idSocio":dataSocio['idSocio'],"idPago":idPago})
      except:
        print("error cbu "+imp["cbu"])
  return pagos

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
  
def ingresarImportacion(idImportacion):
  tabla= db.importarPagos
  pagos= procesarImportacion(idImportacion)
  tabla.update({"_id":idImportacion},{"$set":{"estado":"PROCESADO","pagos":pagos}})

print "INGRESANDO "+str(sys.argv[1])
ingresarImportacion(str(sys.argv[1]))