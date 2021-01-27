#!/usr/bin/python
import pprint
import datetime
import time
import sys
from datetime import date
from bson.objectid import ObjectId 
from config import db
from config import getTipoSocio
EDAD_ADHERENTE=20

def getValorConfiguracion(tipo):
  conf=db.settings
  res= conf.find_one({"clave":tipo})
  return res['valor']
  
def getImporteSocio(fechaNacimiento,esActivo):
  tipoSocio=getTipoSocio(fechaNacimiento,esActivo)
  if(esActivo):return getValorConfiguracion("importeActivos")
  if(tipoSocio=="ADHERENTE"):return getValorConfiguracion("imprteAdherentes")
  
  return getValorConfiguracion("importeParticipantes")

def ingresarDeuda(socio,detalle,motivo,importeDebita,importeAcredita,importeCargaActividad,puntoVenta,proxRecivo):
  socios= db.socios
  id=str(ObjectId())
  dataDeuda={"_id":id,"nroRecivo":proxRecivo,"puntoVenta":puntoVenta,"fecha":datetime.datetime.utcnow(),"detalle":detalle+"("+motivo+")","importeDebita":(importeDebita+importeCargaActividad),"importeCuotaSocial":0,"formaPago":"EFECTIVO","importeOtros":0,"importeCarnet":0,"importeCargaActividad":importeCargaActividad,"importeCargaSocial":importeDebita,"importeAcredita":importeAcredita,"motivo":motivo}
  socios.update({"_id":socio['_id']},{"$push":{"movimientosCuenta":dataDeuda}})
  return {"idPago":id,"idSocio":socio['_id']}

def getImporteAcreditaCuotaSocial(idGrupo,importe):
  tabla= db.grupos
  totalDescuento=0
  grupo=tabla.find_one({"_id":idGrupo})
  if grupo !=None:
    if(float(grupo['descuentoCuotaSocial_porcentaje'])>0):
      totalDescuento=totalDescuento+(importe*(float(grupo['descuentoCuotaSocial_porcentaje'])/100))
    totalDescuento=totalDescuento+float(grupo['descuentoCuotaSocial_importe'])
  return totalDescuento

def getImporteAcreditaActividades(idGrupo,importe):
  tabla= db.grupos
  totalDescuento=0
  grupo=tabla.find_one({"_id":idGrupo})
 
  if grupo !=None:
    if(float(grupo['descuentoActividades_porcentaje'])>0):
      totalDescuento=totalDescuento+(importe*(float(grupo['descuentoActividades_porcentaje'])/100))
    totalDescuento=totalDescuento+float(grupo['descuentoActividades_importe'])
   
  return totalDescuento

def getImporteActividades(socio):
	sum=0
	motivo=""
	socios= db.socios
	res=socios.aggregate([{ "$unwind" : "$actividades" },{"$project":{"_id":1,"estado":"$estado","apellido":"$apellido","idGrupo":"$idGrupo","nombre":"$nombre","idActividad":"$actividades.idActividad","importeEspecial":"$actividades.importeEspecial","tieneImporteEspecial":"$actividades.tieneImporteEspecial","estaBaja":"$actividades.estaBaja"}},{"$lookup":{"from":"actividades","localField":"idActividad","foreignField":"_id","as":"actividad"}},{"$match":{"_id":socio['_id'],"estado":"ALTA"}}])
	for socio in res:
		 actividad=socio['actividad'][0]
		 print socio
		 if not socio['estaBaja']:
		 		importeDebita=float(actividad['importe'])
		 		if socio['tieneImporteEspecial']: importeDebita = socio['importeEspecial']
		 		sum=sum+importeDebita
		 		motivo= motivo+" ( + "+actividad['nombreActividad']+" ) "
	return {"importe":sum,"motivo":motivo}

def ingresarDeudaCuotaSocial(detalle,cargaActividades,puntoVenta,proxRecivo):
  socios= db.socios
  res=socios.find({"estado":"ALTA"})
  pagos=[]
  motivo=" + CUOTA SOCIAL"
  proxRecivo=int(proxRecivo)
  i=0
  for socio in res:
    importeAcredita=0
    i=i+1
    activo=(False,True)[socio['esActivo']]
    
    nac=datetime.datetime.utcnow()
    if socio['fechaNacimiento']:nac=socio['fechaNacimiento']
    
    importeDebita=float(getImporteSocio(nac,activo))
    if "idGrupo" in socio:
      importeAcredita=float(getImporteAcreditaCuotaSocial(socio['idGrupo'],importeDebita))
	
    actividades={"importe":0,"motivo":""}
    if cargaActividades: actividades=getImporteActividades(socio)
    pagos.append(ingresarDeuda(socio,detalle+actividades['motivo'],motivo,importeDebita,importeAcredita,actividades['importe'],puntoVenta,proxRecivo))
    proxRecivo=proxRecivo+1
  db.settings.update({"clave":"proxNroRecivoDeudas"},{"$set":{"valor":proxRecivo}})
  return pagos

def actualizarDeudas(idGenerarDeuda,deudas):
  tabla= db.generacionDeudas
  tabla.update({"_id":idGenerarDeuda},{"$set":{"deudas":deudas}})

def getGenerarDeuda(idGenerarDeuda,puntoVenta,proxRecivo):
  tabla= db.generacionDeudas
 
  return tabla.find_one({"_id":idGenerarDeuda})

def generarDeuda(idGenerarDeuda,puntoVenta,proxRecivo):
  deudas=[]
  generarDeuda=getGenerarDeuda(idGenerarDeuda,puntoVenta,proxRecivo)
  deudas.extend(ingresarDeudaCuotaSocial(generarDeuda['detalle'],generarDeuda['cargaActividades'],puntoVenta,proxRecivo))
  actualizarDeudas(idGenerarDeuda,deudas)

generarDeuda(str(sys.argv[1]),str(sys.argv[2]),str(sys.argv[3]))
