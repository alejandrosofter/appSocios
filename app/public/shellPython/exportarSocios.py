import xlsxwriter
import datetime
import time
import sys
import os
from datetime import date
from bson.objectid import ObjectId 
from config import db
from config import getTipoSocio

def getCbu(socio):
   idCbu=socio.get("idCbuAsociado","")
   cbu=db.cbuSocios.find_one({"_id":idCbu})

   if cbu is not None:
      return cbu['cbu']
   return ''

def getTitular(socio):
   idCbu=socio.get("idCbuAsociado","")
   cbu=db.cbuSocios.find_one({"_id":idCbu})

   if cbu is not None:
      return cbu['titular']
   return ''

def getCuilTitular(socio):
   idCbu=socio.get("idCbuAsociado","")
   cbu=db.cbuSocios.find_one({"_id":idCbu})

   if cbu is not None:
      return cbu['cuil']
   return ''
   
def getActividades(actividades):
	acts=""
	tablaAct=db.actividades
	
	for act in actividades:
		if "estaBaja" in act:
			if not act['estaBaja']:
				actividad=tablaAct.find_one({"_id":act['idActividad']})
				if actividad:acts+=actividad['nombreActividad']+", "
	return acts

path=os.path.dirname(os.path.realpath(__file__))+"/" 
nombreArchivo=datetime.datetime.now().strftime('%s')+'.xlsx'
nombreArchivo="excel.xlsx"
file=path+nombreArchivo

workbook = xlsxwriter.Workbook(file)
worksheet = workbook.add_worksheet()

i=1;
socios= db.socios
res=socios.find({})
worksheet.write("A"+str(i), "NRO SOCIO")
# worksheet.write("B"+str(i), "NOMBRE")
worksheet.write("C"+str(i), "NOMBRES")
worksheet.write("D"+str(i), "TIPO SOCIO")
worksheet.write("E"+str(i), "DNI")
worksheet.write("F"+str(i), "DOMICILIO")
worksheet.write("G"+str(i), "FECHA NAC.")
worksheet.write("H"+str(i), "TEL.")
worksheet.write("I"+str(i), "EMAIL")
worksheet.write("J"+str(i), "GRUPO")
worksheet.write("K"+str(i), "ACTIVIDADES")
worksheet.write("L"+str(i), "FORMA DE PAGO PRINCIPAL")
worksheet.write("M"+str(i), "CBU")
worksheet.write("N"+str(i), "ESTADO")
worksheet.write("O"+str(i), "NOMBRE TITULAR")
worksheet.write("P"+str(i), "CUIL")


for socio in res:
   i=i+1
   tipoSocio=getTipoSocio(socio['fechaNacimiento'],socio['esActivo']);
   if "idGrupo" in  socio:auxGrupo=db.grupos.find_one({"_id":socio['idGrupo']})
   else: auxGrupo=None
   
   grupo=""
   if(auxGrupo):grupo=auxGrupo['nombre']
   worksheet.write("A"+str(i), socio['nroSocio'])
   # worksheet.write("B"+str(i), socio['apellido'])
   worksheet.write("C"+str(i), socio['apellido']+" "+socio['nombre'])
   worksheet.write("D"+str(i), tipoSocio)
   worksheet.write("E"+str(i), socio['dni'])
   worksheet.write("F"+str(i), socio['domicilio'])
   worksheet.write("G"+str(i), str(socio['fechaNacimiento']))
   worksheet.write("H"+str(i), socio['telefonoMobil'])
   worksheet.write("I"+str(i), socio['email'])
   worksheet.write("J"+str(i), grupo)
   worksheet.write("K"+str(i), getActividades(socio['actividades']))
   worksheet.write("L"+str(i), socio['formaDePagoPrincipal'])
   worksheet.write("M"+str(i), getCbu(socio))
   worksheet.write("N"+str(i), socio['estado'])
   worksheet.write("O"+str(i), getTitular(socio))
   worksheet.write("P"+str(i), getCuilTitular(socio))
   
   


workbook.close()
print file
