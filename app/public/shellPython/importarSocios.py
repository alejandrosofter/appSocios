import pprint
import time
import datetime
import pymongo
import config
import sys

from pymongo.errors import PyMongoError
from config import db
from bson.objectid import ObjectId
import string

camposArchivo=None

def getDato(arr,campo,esNumber):
	pos=getPosicion(campo)
	dato="no"
	try:
		dato=arr[pos]
		dato=dato.replace("\"","")
		dato=dato.replace("\'","")
	except Exception as e:
		dato="sin"
	if esNumber: return dato*1
	return dato

def getDatoApellido(arr,campo,tieneApellidoJunto,pos):
	pos=getPosicion(campo)
	dato="no"
	try:
		dato=arr[pos]
		dato=dato.replace("\"","")
		dato=dato.replace("\'","")
	except Exception as e:
		dato="sin"
	if tieneApellidoJunto=="on":
		auxApellido=dato.split(" ",2)
		print auxApellido
		try: 
			dato= auxApellido[pos]
		except Exception as e:
			dato= "s/n"
	return dato

def getPosicion(campo):
	#cad=db.settings.find_one({"clave":"cadenaLugarImportacionSocio"})
	
	arr=camposArchivo.split(";")
	
	for vari in arr:
		arr2=vari.split("=")
		if arr2[0]==campo: return int(arr2[1])
	return -1
	
def getItems(archivo,borrarDatos,formatoFecha,tieneApellidoJunto): 
	file = open(archivo,"r")
	items=[]
	socios= db.socios
	cbus= db.cbuSocios
	print formatoFecha
	if borrarDatos=="true":
		socios.remove({})
		cbus.remove({})
	i=0
	for line in file:
		i=i+1
		arr=line.split(",")
		nroSocio=getDato(arr,"nroSocio",True)

		apellido=getDato(arr,"apellido",False)
		nombre=getDato(arr,"nombre",False)
		if tieneApellidoJunto=="on":
			auxApellido=apellido.split(" ",2)
			try:
				nombre=auxApellido[1]
			except Exception as e:
				nombre="s/n"
			try:
				nombre=nombre+" "+auxApellido[2]
			except Exception as e:
				nombre=nombre
			try:
				apellido=auxApellido[0]
			except Exception as e:
				apellido="s/n"


		tutor=getDato(arr,"tutor",False)
		tutor=tutor.replace("\"","")
		tutor=tutor.replace("\'","")
		
		telefono=getDato(arr,"telefono",False)
		telefono=telefono.replace("-","")
		telefono=telefono.replace(" ","") 

		domicilio=getDato(arr,"domicilio",False)
		mobil=getDato(arr,"mobil",False)
		mobil=mobil.replace("-","")
		mobil=mobil.replace(" ","")

		email=getDato(arr,"email",False)
		nacimiento=getDato(arr,"fechaNac",False)

		try:
			nacimiento=datetime.datetime.strptime(nacimiento.strip(),formatoFecha)
		except Exception as e:
			nacimiento=datetime.datetime.now()
			
		estadoCivil=getDato(arr,"estadoCivil",False)
		sexo=getDato(arr,"sexo",False)
		dni=getDato(arr,"dni",False)
		dni=dni.replace(".","")
	        if dni=="":  dni=str(int(time.time()+i))
		nacionalidad=getDato(arr,"nacionalidad",False)
		localidad=getDato(arr,"localidad",False)
		banco=getDato(arr,"banco",False)
		tipoCta=getDato(arr,"tipoCta",False)
		titular=getDato(arr,"titular",False)
		cbu=getDato(arr,"cbu",False)
		idSocio=str(ObjectId());
		idSocioCbu=str(ObjectId())
		debitos=[]
		formaPago="EFECTIVO"
		idCbuAsociado=None
		if banco!="sin":
			nomSocio=nombre+" "+apellido
			formaPago="CUENTA"
			if banco=="CHUBUT": tipoBanco="CHUBUT"
			else: tipoBanco="OTROS"
			idCbu=str(ObjectId())
			idCbuAsociado=idCbu
			socioCbu={"_id":idSocioCbu,"idSocio":idSocio,"comentario":"","estaInactiva":False,"nombreSocio":nomSocio,"fechaInicio":datetime.datetime.utcnow()}
			auxDebito={"_id":idCbu,"socios":[socioCbu],"fecha":datetime.datetime.utcnow(),"cbu":cbu,"banco":tipoBanco,"titular":titular,"tipoCuenta":tipoCta}
			try:
				print cbus.insert(auxDebito)
			except Exception as e:
				err=True
			

		if nacimiento=="":
			nacimiento=datetime.datetime.utcnow()
		if localidad=="":
			localidad="-" 
		if email=="": 
			email="-"
		if dni=="": 
			email=i
		
		
		
		elemAlta={"fecha":datetime.datetime.utcnow(),"estado":"ALTA","_id":datetime.datetime.utcnow().strftime('%s')}
		auxSocio={"_id":idSocio,"movimientosCuenta":[],"idCbuAsociado":idCbuAsociado,"cambiosEstado":[elemAlta],"tarjetas":[],"actividades":[],"promociones":[],"cbu":"","formaDePagoPrincipal":formaPago,"localidad":localidad,"debitaCbu":False,"esActivo":False,"estado":"ALTA","actividadSocio":[],"nroSocio":nroSocio,"sexo":sexo,"nombre":nombre,"apellido":apellido,"actividad":"","telefonoFijo":telefono,"telefonoMobil":telefono, "domicilio":domicilio,"fechaNacimiento":nacimiento,"dni":dni,"estadoCivil":estadoCivil, "nacionalidad":nacionalidad,"email":email,"tutor":tutor}
		try:
			res=socios.insert(auxSocio)
		except Exception as e:
			err=True
	return items
camposArchivo=str(sys.argv[3]).strip();
items=getItems("tmpSocios.csv",str(sys.argv[1]),str(sys.argv[2]),str(sys.argv[4]))