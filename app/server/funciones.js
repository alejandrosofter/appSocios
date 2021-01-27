/*eslint-disable no-unreachable, semi, no-undef, unknown-require, no-empty-label, no-extra-semi, no-unused-params,
 forbiddenExportImport, no-unused-vars*/
import { Auxiliares } from "./funciones_aux.js";
var _AUX= new Auxiliares();
var edad=Settings.findOne({ clave: "edadAdherente" })?Settings.findOne({ clave: "edadAdherente" }).valor:0;
var edadAdherente=edad*1;
export class Funciones
{	
	getEstadoActividadSocio(idSocio,idActividad){
		var acts=Socios.findOne({_id:idSocio}).actividades;
		console.log(acts)
		for(var i=0;i<acts.length;i++)
			if(acts[i]._id==idActividad)return acts[i].estaBaja?"BAJA":"ALTA";
	}
	getTitularCbu(idCbuAsociado){
		var res=CbuSocios.findOne(
		    {_id: idCbuAsociado }
		);
		if(res) return "CBU BAJA: Titular=> "+res.titular+" Cbu=> "+res.cbu+" Cuil:"+res.cuil;
		return "no hay datos de Cuenta";
	}
	existeSocio(nroSocio,tipoSocio,nroDni)
	{
		var socios= Socios.find({nroSocio:nroSocio,tipoSocio:tipoSocio}).fetch();
		if(socios.length==0){
			var existeDni= Socios.find({dni:nroDni,tipoSocio:tipoSocio}).fetch().length>0;
			if(!existeDni)return "";
			else return "Ya existe un socio con este DNI y mismo tipo de socio!";
		}
		var error="Socio existente: <br>";
		for(var i=0;i<socios.length;i++)
			error+="<b>NOMBRE: </b> "+socios[i].apellido.toUpperCase()+", "+socios[i].nombre+" <b>DNI: </b>  "+socios[i].dni+" <br>";
		return error;
		
	}
	bajaCbuSocio(socio)
	{
		var data=Socios.findOne({_id:socio});
		if(data){
			
			var res = CbuSocios.update(
		    {_id: data.idCbuAsociado }, 
		    { $pull: { "socios": { "idSocio": socio } } },
		    { getAutoValues: false } // SIN ESTE PARAMETRO NO QUITA!!
		);
		Socios.update({_id:data._id},{$unset:{idCbuAsociado:""}})
		}
	}
	actividadInforme(act){
		
	}
	cambiarImportesSocios(idAct){
		var acts=_AUX.sociosActividad();
		var importeActividad=Actividades.findOne({_id:idAct}).importe;
		for(var i=0;i<acts.length;i++){
			var aux=acts[i];

			if(aux.idActividad==idAct)_AUX.actualizarImporteActividad(aux.idSocio,aux._idActividad,importeActividad)
		}
		
	}
	agregarDocumentacion(dataImg,idSocio,fechaVto,tipo)
	{
		var data={_id:Meteor.uuid(),imagen:dataImg,fechaVto:fechaVto,fechaSubida:new Date(),tipo:tipo}
		
		return Socios.update(
                {_id: idSocio }, 
		        { $push: { "documentacion": data } },
		        { getAutoValues: false } // SIN ESTE PARAMETRO NO QUITA!!
            );
	}
	quitarItemGenerico(coleccion,id,subcoleccion,idSubColeccion)
	{
		 console.log("qiotando: "+subcoleccion)
		var Coleccion=eval(coleccion);
		if(subcoleccion){
			var res = Coleccion.update(
		    {_id: id }, 
		    { $pull: { [subcoleccion]: { "_id": idSubColeccion } } },
		    { getAutoValues: false } // SIN ESTE PARAMETRO NO QUITA!!
		    )
		}else{

		}
		var aux= Coleccion.findOne({_id:id});
		console.log(aux[subcoleccion])
		return aux[subcoleccion];
	}
	quitarPuntosDniSocios()
	{
		var sociosError="No se pudo actualizar: ";
		var socios=Socios.find().fetch();
		for(var i=0;i<socios.length;i++){
			var dni=socios[i].dni;
			nuevoDni = dni.split('.').join('').trim();

			try {
			 Socios.update({_id:socios[i]._id},{$set:{dni:nuevoDni}});
			}
			catch(error) {
			  sociosError+="SOCIO "+socios[i].nroSocio+" | ";
			}
			
		}
		return sociosError;
		
	}
	buscarItemsCierres(data,vars)
	{
		console.log(data);
		console.log(vars);
		return _AUX.buscarPagosProfesor(vars.fechaInicio,vars.fechaFin,data.parent._id);
	
	}
	consultarPagosProfesor(data)
	{
		console.log(data)
	}
	agregarSocioProfesor(idSocio,idProfesor,idActividad){
		console.log("idSocio:"+idSocio)
		console.log("ridProfesor:"+idProfesor)
		console.log("ridProfesor:"+idActividad)
		var _idActividad=_AUX.buscarActividadSocio(idSocio,idActividad);
		if(!_idActividad)return false;
		Socios.update(
			{_id:idSocio,"actividades._id":_idActividad},
			{$set:{"actividades.$.idProfesor":idProfesor}},
			{ getAutoValues: false }
			)
		return true;
	}
	quitarSocioProfesor(idSocio,_idActividadSocio){
		console.log("idSocio:"+idSocio)
		console.log("_idActividadSocio:"+_idActividadSocio)
		Socios.update(
			{_id:idSocio,"actividades._id":_idActividadSocio},
			{$set:{"actividades.$.idProfesor":null}},
			{ getAutoValues: false }
			)
	}
	getSociosProfesor(idProfesor,idSocio,idActividad)
	{
		console.log("PROFE: "+idProfesor)
		var ordenar = {
			$sort: {
				_id: 1
			}
		};
		var unw = { $unwind: "$actividades" };
		var match = { $match: {idProfesor:idProfesor,estaBaja:false} };
		var grupo = { $group: {_id:1,total:{$sum:1}} };

		var proyecto = {
			$project: {
				_id: "$actividades._id",
				nombre: "$nombre",
				apellido: "$apellido",
				nroSocio: "$nroSocio",
				tipoSocio: { $cond:[{$eq:["$esActivo",true] },"ACTIVO", {$cond:[ {$gte:[{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },edadAdherente]} ,"ADHERENTE","PARTICIPANTE"] } ] },
				fechaNacimiento: "$fechaNacimiento",
				fechaNacimiento: "$fechaNacimiento",
				esActivo: "$esActivo",
				idSocio: "$_id",
				estado: "$estado",
				idGrupo: "$idGrupo",
				planesEmpresa:"$planesEmpresa",
				idActividad: "$actividades.idActividad",
				_idActividadSocio: "$actividades._id",
				idProfesor: "$actividades.idProfesor",
				tieneImporteEspecial: "$actividades.tieneImporteEspecial",
				importeEspecial: "$actividades.importeEspecial",
				estaBaja: "$actividades.estaBaja",
				
				
			}
		};
		var pipeline = [ unw,proyecto,match ];
		//if(grupo)pipeline.push(grupo)
		
		var res = Socios.aggregate(pipeline);
	
		return res;

	}
	getMargenesTarjetas()
	{
		var frente= Settings.findOne({clave:'leftTarjetas'});
		var dorso= Settings.findOne({clave:'leftTarjetasDorso'});
		var top= Settings.findOne({clave:'topTarjetas'});
		var top2= Settings.findOne({clave:'topTarjetas2'});
		var top3= Settings.findOne({clave:'topTarjetas3'});
		var salida={dorso:-100,frente:-100,top:-100,top2:0,top3:0};
		if(frente)salida.frente=Number(frente.valor);
		if(dorso)salida.dorso=Number(dorso.valor);
		if(top)salida.top=Number(top.valor);
		if(top2)salida.top2=Number(top2.valor);
		if(top3)salida.top3=Number(top3.valor);
		return salida;
	}
	consultaMorosos(agrupar,idSocio)
	{
		console.log("CONSULTANDO morosos "+idSocio);
		var ordenar = {
			$sort: {
				_id: 1
			}
		};
		var unw = { $unwind: "$movimientosCuenta" };
		var match = { $match: {total:{$lt:0} } };
		
		
		var grupo = {
			$group: {
				_id: {id:"$_id",nombre:"$nombre",apellido:"$apellido",estado:"$estado",nroSocio:"$nroSocio"},
				cantidad: { $sum: 1 },
				total:{$sum:"$total"}
				//cantidadConCuotaSocial:{$cond:[{$gt:["$importeCuotaSocial",0]},1,0]},
				//importeCuotaSocial:{$sum:"$importeCuotaSocial"},
				//importes:{$push:{formaPago:"$formaDePago",importe:{$sum:"$importeCuotaSocial"}}}


			}
		};

		var proyecto = {
			$project: {
				_id: 1,
				ano: { $year: "$movimientosCuenta.fecha" },
				mes: { $month: "$movimientosCuenta.fecha" },
				nombre: "$nombre",
				fecha: "$movimientosCuenta.fecha",
				detalle: "$movimientosCuenta.detalle",
				importeDebita: { $multiply:["$movimientosCuenta.importeDebita",-1]},
				importeAcredita: "$movimientosCuenta.importeAcredita",
				total:{$add:[{ $multiply:["$movimientosCuenta.importeDebita",-1]},"$movimientosCuenta.importeAcredita"]},
				apellido: "$apellido",
				nroSocio: "$nroSocio",
				estado: "$estado",
				edad:{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },
				tipoSocio: { $cond:[{$eq:["$esActivo",true] },"ACTIVO", {$cond:[ {$gte:[{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },edadAdherente]} ,"ADHERENTE","PARTICIPANTE"] } ] },
				fechaNacimiento: "$fechaNacimiento",
				formaDePago: "$movimientosCuenta.formaPago",
				importeFormaPago: "$movimientosCuenta.importeFormaPago",
				formaDePago2: "$movimientosCuenta.formaPago2",
				importeFormaPago2: "$movimientosCuenta.importeFormaPago2",
				importeCuotaSocial: "$movimientosCuenta.importeCuotaSocial",
				importeCarnet: "$movimientosCuenta.importeCarnet",
				importeOtros: "$movimientosCuenta.importeOtros",
				
			}
		};

		var pipeline = [unw, proyecto ];
		if(agrupar)pipeline.push(grupo)
			if(!agrupar && idSocio)match.$match._id=idSocio;
		pipeline.push(match)
		var res = Socios.aggregate(pipeline);
		return res;
	}
	consultaPlanesEmpresaTipoSocio(mesSeleccion,anoSeleccion,agrupa,tipoSocio)
	{
		console.log("CONSULTANDO consultaPlanesEmpresaTipoSocio "+tipoSocio+" mes: "+mesSeleccion+" ano: "+anoSeleccion);
		var ordenar = {
			$sort: {
				_id: 1
			}
		};
		var unw = { $unwind: "$planesEmpresa" };
		var match = { $match: {estaActivo:true } };
		if(tipoSocio)match.$match.tipoSocio=tipoSocio;
		var grupo = {
			$group: {
				_id: {tipoSocio:"$tipoSocio"},
				cantidad: { $sum: 1 },
				//cantidadConCuotaSocial:{$cond:[{$gt:["$importeCuotaSocial",0]},1,0]},
				//importeCuotaSocial:{$sum:"$importeCuotaSocial"},
				//importes:{$push:{formaPago:"$formaDePago",importe:{$sum:"$importeCuotaSocial"}}}


			}
		};

		var proyecto = {
			$project: {
				_id: 1,
				id: "$_id",
				nombre: "$nombre",
				planeEmpresa: "$planesEmpresa.idPlanEmpresa",
				estaActivo: {$not:["$planesEmpresa.estaInactiva"]},
				apellido: "$apellido",
				nroSocio: "$nroSocio",
				estado: "$estado",
				edad:{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },
				tipoSocio: { $cond:[{$eq:["$esActivo",true] },"ACTIVO", {$cond:[ {$gte:[{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },edadAdherente]} ,"ADHERENTE","PARTICIPANTE"] } ] },
				fechaNacimiento: "$fechaNacimiento",
				
			}
		};

		var pipeline = [unw, proyecto,match ];
		if(agrupa)pipeline.push(grupo)
		var res = Socios.aggregate(pipeline);
		return res;
	}
	consultaCantidadSocios(mesSeleccion,anoSeleccion,agrupa,tipoSocio)
	{
		console.log("CONSULTANDO consultaCantidadSocios "+tipoSocio+" mes: "+mesSeleccion+" ano: "+anoSeleccion);
		var ordenar = {
			$sort: {
				_id: 1
			}
		};
		var unw = { $unwind: "$cambiosEstado" };
		var match = { $match: {estado:"ALTA" } };
		if(tipoSocio)match.$match.tipoSocio=tipoSocio;
		var grupo = {
			$group: {
				_id: {tipoSocio:"$tipoSocio"},
				cantidad: { $sum: 1 },
				//cantidadConCuotaSocial:{$cond:[{$gt:["$importeCuotaSocial",0]},1,0]},
				//importeCuotaSocial:{$sum:"$importeCuotaSocial"},
				//importes:{$push:{formaPago:"$formaDePago",importe:{$sum:"$importeCuotaSocial"}}}


			}
		};

		var proyecto = {
			$project: {
				_id: 1,
				id: "$_id",
				nombre: "$nombre",
				// planeEmpresa: "$planesEmpresa.idPlanEmpresa",
				// estaActivo: {$not:["$planesEmpresa.estaInactiva"]},
				apellido: "$apellido",
				nroSocio: "$nroSocio",
				cambiosEstado:"$cambiosEstado",
				estado: "$estado",
				edad:{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },
				tipoSocio: { $cond:[{$eq:["$esActivo",true] },"ACTIVO", {$cond:[ {$gte:[{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },edadAdherente]} ,"ADHERENTE","PARTICIPANTE"] } ] },
				fechaNacimiento: "$fechaNacimiento",
				
			}
		};

		var pipeline = [proyecto,match ];
		if(agrupa)pipeline.push(grupo)
		var res = Socios.aggregate(pipeline);
		return res;
	}
	quitarCuentasCbu(filtro)
	{
		var arr=CbuSocios.find(filtro).fetch();
        var conta=0;
        console.log("quitando "+arr.length);
        console.log(filtro);
        for(var i=0;i<arr.length;i++){
	        conta++;
	        _AUX.desligarCuentaSocio(arr[i].socios);
	        CbuSocios.remove({_id:arr[i]._id});
        }
        return conta
	}

	consultaPlanesEmpresa(mesSeleccion,anoSeleccion,agrupa,planEmpresa)
	{
		console.log("CONSULTANDO consultaPlanesEmpresa mes: "+mesSeleccion+" ano: "+anoSeleccion);
		var ordenar = {
			$sort: {
				_id: 1
			}
		};
		var unw = { $unwind: "$planesEmpresa" };
		var match = { $match: {estaActivo:true } };
		if(planEmpresa)match.$match.planEmpresa=planEmpresa;
		var grupo = {
			$group: {
				_id: {planEmpresa:"$planEmpresa"},
				cantidad: { $sum: 1 },
				//cantidadConCuotaSocial:{$cond:[{$gt:["$importeCuotaSocial",0]},1,0]},
				//importeCuotaSocial:{$sum:"$importeCuotaSocial"},
				//importes:{$push:{formaPago:"$formaDePago",importe:{$sum:"$importeCuotaSocial"}}}


			}
		};

		var proyecto = {
			$project: {
				_id: 1,
				id: "$_id",
				nombre: "$nombre",
				planEmpresa: "$planesEmpresa.idPlanEmpresa",
				estaActivo: {$not:["$planesEmpresa.estaInactiva"]},
				apellido: "$apellido",
				nroSocio: "$nroSocio",
				estado: "$estado",
				edad:{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },
				tipoSocio: { $cond:[{$eq:["$esActivo",true] },"ACTIVO", {$cond:[ {$gte:[{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },edadAdherente]} ,"ADHERENTE","PARTICIPANTE"] } ] },
				fechaNacimiento: "$fechaNacimiento",
				
			}
		};

		var pipeline = [unw, proyecto,match ];
		if(agrupa)pipeline.push(grupo);
		var res = Socios.aggregate(pipeline);
		console.log(res)
		return res;
	}
	consultaCuotaSocial(mesSeleccion,anoSeleccion,agrupar,tipoSocio)
	{
		console.log("CONSULTANDO consultaCuotaSocial "+tipoSocio+" mes: "+mesSeleccion+" ano: "+anoSeleccion);
		var ordenar = {
			$sort: {
				_id: 1
			}
		};
		var unw = { $unwind: "$movimientosCuenta" };
		var match = { $match: { mes: mesSeleccion,ano:anoSeleccion,importeCuotaSocial:{$gt:0}} };
		if(tipoSocio)match.$match.tipoSocio=tipoSocio;
		var grupo = {
			$group: {
				_id: {tipoSocio:"$tipoSocio"},
				cantidad: { $sum: {$cond:[{$gt:["$importeCuotaSocial",0]},1,0]} },
				//cantidadConCuotaSocial:{$cond:[{$gt:["$importeCuotaSocial",0]},1,0]},
				importeTotal:{$sum:"$importeCuotaSocial"},

	 			importeEfectivo: { $sum: {$cond:[{$eq:["$formaDePago","EFECTIVO"]},"$importeCuotaSocial",0]} },
	 			importePosnet: { $sum: {$cond:[{$eq:["$formaDePago","POSNET"]},"$importeCuotaSocial",0]} },
	 			importeOtros: { $sum: {$cond:[{$eq:["$formaDePago","OTROS BANCOS"]},"$importeCuotaSocial",0]} },
	 			importeChubut: { $sum: {$cond:[{$eq:["$formaDePago","BANCO CHUBUT"]},"$importeCuotaSocial",0]} },


			}
		};
		var grupo2 = {
			$group: {
				_id: {tipoSocio:"$_id.tipoSocio"},
				cantidad: {$sum:"$cantidad"},
				importeCuotaSocial:{$sum:"$importeCuotaSocial"},
				importes:{$push:{formaPago:"$formaDePago",importe:{$sum:"$importeCuotaSocial"}}}

			}
		};
		var proyecto = {
			$project: {
				ano: { $year: "$movimientosCuenta.fecha" },
				mes: { $month: "$movimientosCuenta.fecha" },
				nombre: "$nombre",
				fecha: "$movimientosCuenta.fecha",
				importeDebita: "$movimientosCuenta.importeDebita",
				importeAcredita: "$movimientosCuenta.importeAcredita",
				apellido: "$apellido",
				nroSocio: "$nroSocio",
				estado: "$estado",
				edad:{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },
				tipoSocio: { $cond:[{$eq:["$esActivo",true] },"ACTIVO", {$cond:[ {$gte:[{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },edadAdherente]} ,"ADHERENTE","PARTICIPANTE"] } ] },
				fechaNacimiento: "$fechaNacimiento",
				formaDePago: "$movimientosCuenta.formaPago",
				importeFormaPago: "$movimientosCuenta.importeFormaPago",
				formaDePago2: "$movimientosCuenta.formaPago2",
				importeFormaPago2: "$movimientosCuenta.importeFormaPago2",
				importeCuotaSocial: "$movimientosCuenta.importeCuotaSocial",
				importeCarnet: "$movimientosCuenta.importeCarnet",
				importeOtros: "$movimientosCuenta.importeOtros",
			}
		};

		var pipeline = [unw, proyecto,match ];
		if(agrupar)pipeline.push(grupo);
		var res = Socios.aggregate(pipeline);
		return res;
	}
	consultarGeneralActividad(mesSeleccion,anoSeleccion,agrupar,idActividad)
	{
		console.log("CONSULTANDO actividades---------------------"+idActividad);
	
		var unw = { $unwind: "$actividades" };
		var match = { $match: { estaBaja: false,estado:"ALTA" } };
		var grupo = {
			$group: {
				_id: {idActividad:"$idActividad"
				//,tipoSocio:"$tipoSocio"
			},
				cantidad: { $sum: 1 },
			}
		};
		var proyecto = {
			$project: {
				_id: 1,
				fechaInicio: "$actividades.fecha" ,
				tipoSocio: { $cond:[{$eq:["$esActivo",true] },"ACTIVO", {$cond:[ {$gte:[{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },edadAdherente]} ,"ADHERENTE","PARTICIPANTE"] } ] },
				idActividad: "$actividades.idActividad",
				estaBaja: "$actividades.estaBaja",
				edad:{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },
				estado:"$estado",
				esActivo:"$esActivo",
				nroSocio:"$nroSocio",
				nombre:"$nombre",
				apellido:"$apellido",
				fechaBaja: "$actividades.fechaBaja",
				fecha: "$actividades.fecha",
				
			}
		};
		if(idActividad)match.$match.idActividad=idActividad;
		var pipeline = [unw, proyecto,match ];
		if(agrupar)pipeline.push(grupo);

		var res = Socios.aggregate(pipeline);
		if (res.length > 0) return res;
		return [];
	}
	consultarDatosGral(mesSeleccion,anoSeleccion,agrupar,actividad)
	{
		console.log("consultarDatosGral mes: "+mesSeleccion+" ano: "+anoSeleccion);
		var ordenar = {
			$sort: {
				_id: 1
			}
		};
		console.log("ACT:"+actividad)
		var unw = { $unwind: "$movimientosCuenta" };
		var unw2 = { $unwind: "$itemsActividades" };
		var match = { $match: { mes: mesSeleccion,ano:anoSeleccion } };
		var match2 = { $match: { "itemsActividades.idActividad":actividad} };

		if(actividad)match.$match.idActividad=actividad;
		var grupo = {
			$group: {
				_id: {idActividad:"$itemsActividades.idActividad"},
				totalActividad: { $sum: "$itemsActividades.importe" },
	 			cantidad: { $sum: {$cond:[{$gt:["$cantidadPagosActividad",0]},1,0]} },

	 			importeEfectivo: { $sum: {$cond:[{$eq:["$formaDePago","EFECTIVO"]},"$itemsActividades.importe",0]} },
	 			importePosnet: { $sum: {$cond:[{$eq:["$formaDePago","POSNET"]},"$itemsActividades.importe",0]} },
	 			importeOtros: { $sum: {$cond:[{$eq:["$formaDePago","OTROS BANCOS"]},"$itemsActividades.importe",0]} },
	 			importeChubut: { $sum: {$cond:[{$eq:["$formaDePago","BANCO CHUBUT"]},"$itemsActividades.importe",0]} },

			}
		};
		var grupo2 = {
			$group: {
				_id: {idActividad:"$_id.idActividad"},
				totalActividad: { $sum: "$totalActividad" },
	 			cantidad: { $sum: "$cantidad" },
			}
		};
		var proyecto = {
			$project: {
			
				ano: { $year: "$movimientosCuenta.fecha" },
				mes: { $month: "$movimientosCuenta.fecha" },
				nombre: "$nombre",
				fecha: "$movimientosCuenta.fecha",
				importeDebita: "$movimientosCuenta.importeDebita",
				importeAcredita: "$movimientosCuenta.importeAcredita",
				apellido: "$apellido",
				nroSocio: "$nroSocio",
				fechaNacimiento: "$fechaNacimiento",
				estado: "$estado",
				importe:{$sum:"$movimientosCuenta.itemsActividades.importe"},
				fechaNacimiento: "$fechaNacimiento",
				formaDePago: "$movimientosCuenta.formaPago",
				importeFormaPago: "$movimientosCuenta.importeFormaPago",
				formaDePago2: "$movimientosCuenta.formaPago2",
				importeFormaPago2: "$movimientosCuenta.importeFormaPago2",
				importeCuotaSocial: "$movimientosCuenta.importeCuotaSocial",
				importeCarnet: "$movimientosCuenta.importeCarnet",
				importeOtros: "$movimientosCuenta.importeOtros",
				idActividad: "$movimientosCuenta.itemsActividades.idActividad",
				importeActividad: "$movimientosCuenta.itemsActividades.importe",
				itemsActividades: "$movimientosCuenta.itemsActividades",
				cantidadPagosActividad: { $size: {$ifNull:["$movimientosCuenta.itemsActividades",[]]}},
			}
		};

		var pipeline = [unw, proyecto,match,unw2 ];
		if(actividad)pipeline.push(match2)
		if(agrupar)pipeline.push(grupo)
		
		//pipeline.push(match)
		var res = Socios.aggregate(pipeline);
		console.log(res)
		return res;
	}
	quitarCbu(idCbu)
	{
		return CbuSocios.remove({_id:idCbu});
	}
	generarArchivoBanco(act)
	{

     var fe=new Date(act.fecha);
     var separador=" ";
     var vto1=new Date(act.primerVto);
     var vto2=new Date(act.segundoVto);
     var vto3=new Date(act.tercerVto);
     var tipoNovedad="D"; //ES DEBITO! si no es R rechazo **1
     var cuitEmpresa=Settings.findOne({ clave: "cuitEmpresa"}).valor; // **11
     var sector= "001" // valor fijo **3
     var prestacion="CUOTAS    " //  **10
     var fechaVto=ripFechaArchivo(vto1) // **8 10 dias de vto
     
    //  var cbuBloque1=cbu1; // **8
    //  var cbuBloque2="000"; //valor fijo **3
    //  var cbuBloque3=cbu2; // **14 ultimos 14 digitos
    //  var idCliente=cbuCompleto; // **22 id del idCliente
     
     var vtoDebito="00000000"; // siempre 8 ceros **8
     var refDebito="CUOTA SOCIAL".rpad(" ",15); // **15
     
    //  var importe= importeDebito; // 8 enteros mas 2 decimales **10
    
     var monedaDebito="80"; // 80 pesos 02 dolares **2
     var fechaVto2=ripFechaArchivo(vto2); // **8 
     
    //  var importe2Vto="0000000000"; // **10 opcional
     
     var fechaVto3=ripFechaArchivo(vto3); // **8 opcional
     
    //  var importe3vto="0000000000"; //**10
     
     var idPagador="".lpad("0",22); //**22 siempre 22 digitos
     var codigoRechazo="   "; // **3
     var nroOrden="".lpad("0",20); // **10
     var saltoLinea="\n"
     var sal="";
     var sum=0;
     var cantidadRegistros=0;
     for(var i=0;i<act.cuentas.length;i++){
         var aux=act.cuentas[i];
         sum+=getImporteTotalSocios(aux.sociosAsociados);
         cantidadRegistros++;
         
         var cbuCompleto=aux.cbu;
         cbuCompleto=cbuCompleto.replace("-","")
         cbuCompleto=cbuCompleto.replace("-","")
         cbuCompleto=cbuCompleto.replace("-","")

         var cbuBloque1=cbuCompleto.substring(0,8).rpad("0",8); // **8
         var cbuBloque2="000"; //valor fijo **3
         var cbuBloque3=cbuCompleto.substring(cbuCompleto.length-14,cbuCompleto.length).rpad("0",14); // **14 ultimos 14 digitos
         var idCliente=aux.idCbu.substring(aux.idCbu.length-22,aux.idCbu.length).rpad(" ",22); // **22 id del idCliente
         
         var importe= ripImporteArchivo(aux.importe+aux.importeAnterior).lpad(separador,8);; // 8 enteros mas 2 decimales **10
         
         var importe2Vto=ripImporteArchivo(aux.importe+aux.importeAnterior).lpad("0",8); // **10 opcional
         var importe3vto=ripImporteArchivo(aux.importe+aux.importeAnterior).lpad("0",8); //**10
         
         if(sum>0)
         sal+=tipoNovedad+cuitEmpresa+sector+prestacion+fechaVto+cbuBloque1+cbuBloque2+cbuBloque3+idCliente+vtoDebito+refDebito+importe+monedaDebito+fechaVto2+importe2Vto+fechaVto3+importe3vto+idPagador+codigoRechazo+nroOrden+saltoLinea     
         
     }
     
     
     var t_tipoNovedad="T";
     var t_cantidadRegistros=cantidadRegistros.toString().lpad("0",10);
     var t_cantidadRegistrosMonetarios=cantidadRegistros.toString().lpad("0",7);
     var t_cantidadRegistrosNoMonetarios="".lpad("0",7);
     var t_fechaProceso=ripFechaArchivo(fe);
     var t_filer="".lpad(separador,70);
     var t_sumatoria=ripImporteArchivo(sum).rpad("0",10);
     var t_filer2="".lpad(separador,137);
     
     sal+=t_tipoNovedad+t_cantidadRegistros+t_cantidadRegistrosMonetarios+t_cantidadRegistrosNoMonetarios+t_fechaProceso+t_filer+t_sumatoria+t_filer2+saltoLinea;
     return sal;
	}
	unicoNroRecivo(nro)
	{
		return false
	}
    guardarArchivoBanco(id,data)
    {
        return ArchivoBancos.update({_id:id},{$push:{cuentas:{ $each:data }}});
    }
    agregarRtaBancoPerfiles(data,socios,idSeleccion)
    {
        var arr=[];
       for(var i=0;i<socios.length;i++)
          arr=arr.concat(_AUX.cargarPagoSociosRta(socios[i].socios,socios[i].estado,data.fecha)) 
       
        ArchivoBancos.update(
            {_id:idSeleccion,"rtaBancos.idItem":data.idItem},
            { $set: {"rtaBancos.$.estado":"CANCELADO","rtaBancos.$.pagosSocios":arr } },
            { getAutoValues: false }
        )
       
    }
    quitarRtaBancoPerfiles(data,socios,idSeleccion)
    {
        for(var i=0;i<data.pagosSocios.length;i++)
            _AUX.quitarPagoSociosRta(data.pagosSocios)
        ArchivoBancos.update(
            {_id:idSeleccion,"rtaBancos.idItem":data.idItem},
            {$set:{"rtaBancos.$.estado":"PENDIENTE","rtaBancos.$.pagosSocios":[]}},
            { getAutoValues: false }
        )
    }
    pasarCuentasDebito()
    {
        CbuSocios.remove({});
        Socios.update({},{$set:{formaDePagoPrincipal:"EFECTIVO"}},{ getAutoValues: false });
        var data=_AUX.getTodasCuentasDebito();
        for(var i=0;i<data.length;i++){
             var idAsignacion = Math.round((new Date()).getTime() / 1000)+i;
              _AUX.ingresarCbuSocio(data[i],idAsignacion)
        }
           
    }
    cargarItemsRta(idRta,idItem,arr)
    {
        ArchivoBancos.update(
            {_id:idRta,"rtaBancos.idItem": idItem},
            {$set:{"rtaBancos.$.estadoCbu":arr}},
            { getAutoValues: false }
            
            
        )
    }
    modificaSocioCbu(idSocio,idCbu,estaInactiva,fechaBaja)
    {
        Socios.update({_id:idSocio},{$set:{idCbuAsociado:idCbu}})
    }
    buscadorSocios(query, options) {
			options = options || {};

			// guard against client-side DOS: hard limit to 50
			if (options.limit) {
				options.limit = Math.min(50, Math.abs(options.limit));
			} else {
				options.limit = 50;
			}

			// TODO fix regexp to support multiple tokens
			var bus="/^"+query+".*/"
			var regex = new RegExp("/^"+query+".*/","i");
		
			var data= Socios.find({$or:[{apellido: new RegExp(query , 'i')},{nroSocio: (query*1)}]}, options).fetch();
			
			return data
		}

    quitarSocioCbuAsociado(id, item,idSocio) {
		var res = CbuSocios.update(
		    {_id: id }, 
		    { $pull: { "socios": { "_id": item } } },
		    { getAutoValues: false } // SIN ESTE PARAMETRO NO QUITA!!
		);
		Socios.update({_id:idSocio},{$unset:{idCbuAsociado:""}})
	}
   quitarRtaBanco (idRta, item) {
       
		var res = ArchivoBancos.update(
		    {_id: idRta }, 
		    { $pull: { "rtaBancos": { "idItem": item } } },
		    { getAutoValues: false } // SIN ESTE PARAMETRO NO QUITA!!
		);
	}
    buscarCuentas(id,banco,fecha)
    {
        var aux=ArchivoBancos.findOne({_id:id});
        return _AUX.buscarCuentas(banco,fecha);
        
    }
	quitarPuntos()
	{
	var socios=Socios.find({}).fetch();
	for(var i=0;i<socios.length;i++){
		var aux=socios[i].dni.replace(".","").trim();
		Socios.update({_id:socios[i]._id},{$set:{dni:aux}});
	}
	}
	marcarMensajesLeidos(emisor,receptor)
	{
		_AUX.marcarMensajesLeidos(emisor,receptor)
	}
	consultaMensajesChat(emisor,receptor)
	{
		var res=MensajesInternos.find({$or:[{$and:[{idUsuarioReceptor:receptor},{idUsuarioEmisor:emisor}]},{$and:[{idUsuarioEmisor:receptor},{idUsuarioReceptor:emisor}]}]},{sort:{created:1}} );
		
		return res.fetch().reverse()
	}
	
  consultarMensajesNuevos(receptor)
  {
  		var arr=[];
  		var res = Meteor.users.find().fetch();
		for(var i=0;i<res.length;i++) if(res[i]._id!=receptor)arr.push(res[i]) //saco al usuariuo en cuestion
		
		
		for(var i=0;i<arr.length;i++){
		var res=MensajesInternos.find({idUsuarioReceptor:receptor,idUsuarioEmisor:arr[i]._id,estaLeido:false}).fetch();
		arr[i].cantidadMensajesNoLeidos=res.length;
		arr[i].mensajes=res;
		}
		return arr;
  }
     usuariosChat (usuario) {
     var arr=[];
		var res = Meteor.users.find().fetch();
		for(var i=0;i<res.length;i++) if(res[i]._id!=usuario)arr.push(res[i])
		return arr;
	}
	agregarMensajeInterno(mensaje,usuarioDesde,usuarioHasta){
	_AUX.marcarMensajesLeidos(usuarioDesde,usuarioHasta)
	   var aux={mensaje:mensaje,idUsuarioEmisor:usuarioDesde,idUsuarioReceptor:usuarioHasta,estaLeido:false,estado:"OK"};
	  
	   MensajesInternos.insert(aux)
   }
	buscarSocio(query, options)
	{
	
			options = options || {};

			// guard against client-side DOS: hard limit to 50
			if (options.limit) {
				options.limit = Math.min(50, Math.abs(options.limit));
			} else  options.limit = 50;
			
			return Socios.find({$or:[{apellido: {$regex:query,$options:"-i"  }}]}, options).fetch();
	}
    fileUploadSocios(fileInfo, fileData) 
    {
    	console.log("fileUploadSocios")
         fs = Npm.require('fs');
		var path = process.cwd() + "/tmpSocios.csv";
		console.log(path);
		var resultados = "DATA PROCESADA";
		// buf = iconv.encode("Sample input string", 'win1251');
		fs.writeFile(path, fileData, {
			encoding: "ascii"
		}, function(err) {
			if (!err) console.log("SUBIO OK socios")
		});
    }
    enviarMensajes(idMensaje) 
    {
    console.log("ENVIANDO?")
    var seting=Settings.findOne({clave:"cadenaConexionMail"});
    var empresa=Settings.findOne({clave:"nombreEmpresa"});
    var contacto=Settings.findOne({clave:"datosContacto"});

	var valorMail=seting?seting.valor:"";
	
	
	process.env.MAIL_URL=valorMail; 
    var mensaje=Mensajes.findOne({_id:idMensaje});
    if(mensaje){
    var socios=_AUX.getSociosMensaje(mensaje);

	
    var arrEnviados=[];
    SSR.compileTemplate('htmlEmail', Assets.getText('email_1.html')); //ESTA EN CARPETA /private/email_1.html
    var imag = _AUX.getImagen("logoEmpresa");
    var estadoMensaje=socios.length+" socios para enviar: ";
    Mensajes.update(idMensaje,{$set: {estado:"ENVIANDO",estadoMensaje:estadoMensaje}});
    
    for(var i=0;i<socios.length;i++){
    var mensajePersonal=mensaje.mensaje;
    var socio=socios[i];
    mensajePersonal=mensajePersonal.replace("%nombre",socio.nombre);
    mensajePersonal= mensajePersonal.replace("%apellido",socio.apellido);
    mensajePersonal=mensajePersonal.replace("%nroSocio",socio.nroSocio);
    
    var titulo=mensaje.titulo;
    titulo=titulo.replace("%nombre",socio.nombre);
    titulo=titulo.replace("%apellido",socio.apellido);
    titulo=titulo.replace("%nroSocio",socio.nroSocio);
	
	var emailData={
	  mensaje: mensajePersonal,
	  datosEmpresa: empresa.valor,
	  imagen:imag,
	  contacto:contacto.valor
	};
	var cuerpoMensaje=SSR.render('htmlEmail', (emailData));
	// console.log(cuerpoMensaje)
	try{
    Email.send({
				from: "administracion@caicr.com.ar",
				to: socio.email,
				subject: titulo,
				html:cuerpoMensaje,
	
//				attachments: [{
//				filename: 'adjunto.pdf',
//				filePath:path,
//  }],	 
});
     estadoMensaje+=socio.email+"(ok),";
     Mensajes.update(idMensaje,{$set: {estadoMensaje:estadoMensaje}});
 }catch(e){
 	 estadoMensaje+=socio.email+"("+e+"),";
     Mensajes.update(idMensaje,{$set: {estadoMensaje:estadoMensaje}});
 }
var nombreSocio=socio.apellido+", "+socio.nombre;
var aux={nroSocio:socio.nroSocio,idSocio:socio._id,mensaje:mensajePersonal,nombreSocio:nombreSocio,idMensaje:mensaje._id,email:socio.email};
arrEnviados.push(aux);
    }
   // console.log(arrEnviados)
   Mensajes.update(idMensaje, {$set:{mensajes:arrEnviados,estado:"ENVIADO"}});
    }
    	
    }
    exportarSocios()
    {
        Future = Npm.require('fibers/future');
		var fut1 = new Future();
		var PythonShell = require('python-shell');
		var archi = './exportarSocios.py';
		var path = process.cwd() + '/../web.browser/app/shellPython';
		var options = {
			mode: 'text',
			scriptPath: path,
			args: []
		};
		PythonShell.run(archi, options, function(err, res) {
			if (err) throw err;
			fut1.return(res) 

		});
		return fut1.wait();
    }
    cargarSocios(borrar,formatoFecha,tieneApellidoJunto,campos)
    {
        var borraAnterior=borrar?true:false;
        Future = Npm.require('fibers/future');
		var fut1 = new Future();
        console.log("cargando?")
		var PythonShell = require('python-shell');
		var archi = './importarSocios.py';
		var path = process.cwd() + '/../web.browser/app/shellPython';
		var options = {
			mode: 'text',
			scriptPath: path,
			args: [borraAnterior,formatoFecha,campos,tieneApellidoJunto]
		};
		PythonShell.run(archi, options, function(err, res) {
			if (err) throw err;
            console.log(res)
			fut1.return(res[0])

		});
		return fut1.wait();
    }
    imprimir(res)
    {
        console.log(res)
    }
countGetSociosActivos (id,banco,fecha)
{
	return CbuSocios.find({banco:banco}).count()
}
getSociosActivos (id,banco,fecha,desde,cantidad)
    {
        //var arr= CbuSocios.find({banco:banco}).skip(desde).limit(cantidad).fetch();
        var options={skip:desde,limit:cantidad}
        var arr= CbuSocios.find({banco:banco},options).fetch();
        console.log(arr)
        for(var i=0;i<arr.length;i++){
            var socios=arr[i].socios?arr[i].socios:[];
            for(var j=0;j< socios.length;j++)
            arr[i].socios[j].socio=Socios.findOne({_id:arr[i].socios[j].idSocio})
          
     
         //var aux={"cbu":arr[i]._id, detalle:ref,importe:imp,importeAnterior:0,estado:"PENDIENTE",sociosAsociados:arr[i].socios};
        
        }
       // console.log(arr)
         return arr   
    }
    
     sociosActividad (mes,ano,agrupa)
    {
        return sociosActividad(mes,ano,agrupa)
    }
    
    yaCerroCaja (fecha,usuario){
        console.log(usuario)
        fecha=new Date(fecha);
        console.log(fecha)
        var cierres=CierreCaja.find({fechaCierre:fecha,usuario:usuario}).fetch();
        console.log(cierres.length)
        return cierres.length>0
    }
    
     consultarCajaGeneral (fecha){
        var ordenar = {
		$sort: {
			_id: 1
		}
	};
	var arr=fecha.split("/");
	console.log(arr)
	var proyecto = {
		$project: {
			_id: 1,
			fecha: "$fecha",
			ano: {
				$year: "$fecha"
			},
			mes: {
				$month: "$fecha"
			},
			dia: {
				$dayOfMonth: "$fecha"
			},
			tipoMovimiento: "$tipoMovimiento",
			importeDebe: "$importeDebe",
			importeHaber: "$importeHaber",
			detalle: "$detalle",
			quien: "$quien",
			estado: "$estado",
			nroComprobante: "$nroComprobante",
		}
	};
	var match = {
		$match: {
			ano: Number(arr[2]),
			mes:Number(arr[1]),
			dia:Number(arr[0])
		}
	};
	var pipeline = [ proyecto, match];
	console.log(pipeline)
	return MovimientosGenerales.aggregate(pipeline);

    }
    
	 getFuentes ()
	{
		Future = Npm.require('fibers/future');
		var fut1 = new Future();
		var fuentesPdf={};
		Meteor.call("getFuente","roboto-medium.ttf",function(err,res){
  			fuentesPdf['Roboto-Medium.ttf']=res;
  		//fut1.return(fuentesPdf)
  		});
  		Meteor.call("getFuente","roboto-regular.ttf",function(err,res){
  			fuentesPdf['Roboto-Regular.ttf']=res;
  		
  			fut1.return(fuentesPdf)
  		});
  		return fut1.wait();
  		
	}
	
	 getFuente (fuente)
	{
		Future = Npm.require('fibers/future');
		var fut1 = new Future();
		var path = process.cwd() + '/../web.browser/app/fonts/';
		var fs = require('fs');//roboto-medium.ttf
  		return fs.readFileSync(path+fuente, "utf8");
  		
	}
	
	 googleDriveRestaurar (id) {
		var drive = getDrive();
		var fs = Npm.require('fs');
		var fileId = id;
		console.log(id);
		var dest = fs.createWriteStream('/tmp/restore.tar');
		drive.files.get({
			fileId: fileId,
			acknowledgeAbuse:true,
			alt: 'media'
		}).pipe(dest);
	}
	
	 googleDriveUpload (file) {
		return _AUX.subirArchivo(file)
	}
	
	 googleDriveBackup () {

		Future = Npm.require('fibers/future');
		var fut1 = new Future();

		var PythonShell = require('python-shell');
		var archi = './back.py';
		var path = process.cwd() + '/../web.browser/app/shellPython';
		console.log(path)
		var options = {
			mode: 'text',
			scriptPath: path,
			//args: [idDeuda]
		};
		PythonShell.run(archi, options, function(err, res) {
			if (err) throw err;

			fut1.return(res[0])

		});
		return fut1.wait();
	}
	
	 googleGetArchivos () {
		Future = Npm.require('fibers/future');
		var fut1 = new Future();
		var drive = getDrive();

		drive.files.list({
			pageSize: 10,
			q: "mimeType = 'application/vnd.google-apps.folder' and name='backupsBases'",
			fields: "nextPageToken, files(id, name)"
		}, function(err, response) {
			if (err) {
				console.log('The API returned an error: ' + err);
				return;
			}
			var files = response.data.files;
			if (files.length === 0) {
				console.log('No files found.');
			} else {

				for (var i = 0; i < files.length; i++) {
					var file = files[i];
					console.log("buscando archivos de " + file.name + "id: " + file.id);
					drive.files.list({
						q: "'" + file.id + "' in parents",
						fields: "nextPageToken, files(id, name,modifiedTime)"
					}, function(err, res) {
						fut1.return(res.data.files)
					})
				}
			}
		});
		return fut1.wait()
	}
	
	 googleDriveAutorizar () {
		var clientId = Settings.findOne({
			clave: "googleDrive_idCliente"
		}).valor;
		var clientSecret = Settings.findOne({
			clave: "googleDrive_secret"
		}).valor;

		var redirectUrl = Settings.findOne({
			clave: "googleDrive_url"
		}).valor;
		var token = (Settings.findOne({
			clave: "googleDrive_token"
		}).valor);
		var codigo = (Settings.findOne({
			clave: "googleDrive_codigo"
		}).valor);

		var google = require('googleapis');
		var googleAuth = require('google-auth-library');
		clientId = Settings.findOne({
			clave: "googleDrive_idCliente"
		}).valor;
		clientSecret = Settings.findOne({
			clave: "googleDrive_secret"
		}).valor;

		var SCOPES = ['https://www.googleapis.com/auth/drive'];
		var auth = new googleAuth();
		var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
		var authUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES
		});
		console.log('Authorize this app by visiting this url: ', authUrl);
		return authUrl;

	}
	
	 googleDriveSolicitarToken () {
		var clientId = Settings.findOne({
			clave: "googleDrive_idCliente"
		}).valor;
		var clientSecret = Settings.findOne({
			clave: "googleDrive_secret"
		}).valor;

		var redirectUrl = Settings.findOne({
			clave: "googleDrive_url"
		}).valor;
		var token = (Settings.findOne({
			clave: "googleDrive_token"
		}).valor);
		var codigo = (Settings.findOne({
			clave: "googleDrive_codigo"
		}).valor);

		Future = Npm.require('fibers/future');
		var fut1 = new Future();
		var google = require('googleapis');
		var googleAuth = require('google-auth-library');
		var auth = new googleAuth();

		var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
	
		oauth2Client.getToken(codigo, function(err, token) {
			if (err) {
				fut1.return('Error para conseguir TOKEN: ' + err)
				return;
			}
			console.log(token)
			oauth2Client.credentials = token;
			fut1.return(token)

		});
		return fut1.wait()
	}
	
	 userInsert (doc) {
		console.log(doc)
		id = Accounts.createUser({
			username: doc.username,
			password: doc.password,
			profile: doc.profile
		});
		console.log(Meteor.users.find().fetch())
		return id;
	}
	 usuarios () {
		var res = Meteor.users.find().fetch();
		console.log(res);
		return res;
	}
	 modificarClave (id, clave) {
		var res = Accounts.setPassword(id, clave, {
			logout: false
		});
		console.log(res)
		console.log(id)
		console.log(clave)
	}
	 userRemove (id) {

		Meteor.users.remove(id);

		return id;
	}
	
	 back (idSocio_, imagen) {
		//meteor-backup
	}
	
	 buscarCaja (fechaDesde,fechaHasta, actividad, formaPago, soloMias) {
		return _AUX.getTotalesCaja(fechaDesde,fechaHasta, actividad, formaPago, soloMias)
	}
	
	 buscarCajaGeneral (fecha) {
	    var arrFecha=fecha.split("-");
		var proyecto = {
		$project: {
			_id: 1,
			quien: "$quien",
			tipoMovimiento: "$tipoMovimiento",
			fecha: "$fecha",
			esGeneral:true,
			ano: {
				$year: "$fecha"
			},
			mes: {
				$month: "$fecha"
			},
			dia: {
				$dayOfMonth: "$fecha"
			},
			importeDebe: "$importeDebe",
			importeHaber: "$importeHaber",
			estado: "$estado",
			id:"$_id",
			nroComprobante: "$nroComprobante",
			detalle: "$detalle",
		}
	};
	var match = {
		$match: { ano: Number(arrFecha[0]),mes: Number(arrFecha[1]),dia: Number(arrFecha[2])}
	};
	var pipeline = [ proyecto,match];
		console.log(arrFecha);
	var res = MovimientosGenerales.aggregate(pipeline);
		console.log(res)
		return res;
	}
	
	 incrementaProxNroRecivo (esDebito) {
	 	if(esDebito){
	 		var dataproxNroRecivo = Settings.findOne({
			clave: "proxNroDebitos"
		});
		var prox = Number(dataproxNroRecivo.valor) + 1;
		Settings.update({
			clave: "proxNroDebitos"
		}, {
			$set: {
				valor: prox,
				clave: "proxNroDebitos"
			}
		}); 
		return;
	 	}
		var dataproxNroRecivo = Settings.findOne({
			clave: "proxNroRecivo"
		});
		var prox = Number(dataproxNroRecivo.valor) + 1;
		Settings.update({
			clave: "proxNroRecivo"
		}, {
			$set: {
				valor: prox,
				clave: "proxNroRecivo"
			}
		});
	}
	
	  proxNroRecivo (esDebito) {
	  	if(esDebito){
	  		var dataproxNroRecivo = Settings.findOne({
			clave: "proxNroDebitos"
		});
	  	}else{
	  		var dataproxNroRecivo = Settings.findOne({
			clave: "proxNroRecivo"
		});
	  	}
		
		
		if (dataproxNroRecivo) return dataproxNroRecivo.valor;
		return 0
	}

	 subirActividades (idSocio, idMovimiento, items) {
		var selector = "movimientosCuenta.$.itemsActividades";
		console.log("ACTUALIZA: idmov:" + idMovimiento + " idSocio:" + idSocio)
		console.log(items)
		Socios.update({
			_id: idSocio,
			"movimientosCuenta._id": idMovimiento
		}, {
			$set: {
				"movimientosCuenta.$.itemsActividades": items
			}
		}, true)

	}
	
	 generarVariables () {
		//Settings.remove({});
    	if (!Settings.findOne({
    			clave: "chatActivado"
    		})) Settings.insert({
    		clave: "chatActivado",
    		valor: "1"
    	});
    		if (!Settings.findOne({
    			clave: "topTarjetas"
    		})) Settings.insert({
    		clave: "topTarjetas",
    		valor: "337"
    	});
    		if (!Settings.findOne({
    			clave: "topTarjetas2"
    		})) Settings.insert({
    		clave: "topTarjetas2",
    		valor: "5"
    	});
    	if (!Settings.findOne({
    			clave: "cuitEmpresa"
    		})) Settings.insert({
    		clave: "cuitEmpresa",
    		valor: "30670251140001"
    	});
		if (!Settings.findOne({ 
				clave: "cadenaLugarImportacionSocio"
			})) Settings.insert({
			clave: "cadenaLugarImportacionSocio",
			valor: "nroSocio=0;nombre=1;apellido=2;fechaNac=3;dni=4;telefono=5;domicilio=6;email=7;banco=8;tipoCta=9;titular=10;cbu=11"
		});
		
		if (!Settings.findOne({
				clave: "importeActivos"
			})) Settings.insert({
			clave: "importeActivos",
			valor: "0"
		});
		if (!Settings.findOne({
				clave: "datosContacto"
			})) Settings.insert({
			clave: "datosContacto",
			valor: "email:su email, domicilio:suDomicilio otros datos"
		});
		if (!Settings.findOne({
				clave: "cadenaConexionMail"
			})) Settings.insert({
			clave: "cadenaConexionMail",
			valor: "smtp://USUARIO%40gmail.com:CLAVE@smtp.gmail.com:465/"
		});
		// if (!Settings.findOne({
		// 		clave: "mail_usuario"
		// 	})) Settings.insert({
		// 	clave: "mail_usuario",
		// 	valor: "xxxxxxxx@xxxxxx.xxx"
		// });
		// if (!Settings.findOne({
		// 		clave: "mail_host"
		// 	})) Settings.insert({
		// 	clave: "mail_host",
		// 	valor: "xxxxxxx.xxx"
		// });
		// if (!Settings.findOne({
		// 		clave: "mail_host"
		// 	})) Settings.insert({
		// 	clave: "mail_host",
		// 	valor: "xxxxxxx.xxx"
		// });
		// if (!Settings.findOne({
		// 		clave: "mail_puerto"
		// 	})) Settings.insert({
		// 	clave: "mail_puerto",
		// 	valor: "xxx"
		// });
		if (!Settings.findOne({
				clave: "diaLimiteDebito"
			})) Settings.insert({
			clave: "diaLimiteDebito",
			valor: "10"
		});
		if (!Settings.findOne({
				clave: "imprteAdherentes"
			})) Settings.insert({
			clave: "imprteAdherentes",
			valor: "0"
		});
			if (!Settings.findOne({
				clave: "leftTarjetas"
			})) Settings.insert({
			clave: "leftTarjetas",
			valor: "70"
		});
			if (!Settings.findOne({
    			clave: "leftTarjetasDorso"
    		})) Settings.insert({
    		clave: "leftTarjetasDorso",
    		valor: "70"
    	});
		if (!Settings.findOne({
				clave: "importeParticipantes"
			})) Settings.insert({
			clave: "importeParticipantes",
			valor: "0"
		});
		if (!Settings.findOne({
				clave: "proxNroRecivo"
			})) Settings.insert({
			clave: "proxNroRecivo",
			valor: "1"
		});
		if (!Settings.findOne({
				clave: "proxNroDebitos"
			})) Settings.insert({
			clave: "proxNroDebitos",
			valor: "1"
		});
		if (!Settings.findOne({
				clave: "puntoVentaDeudas"
			})) Settings.insert({
			clave: "puntoVentaDeudas",
			valor: "3"
		});
		if (!Settings.findOne({
				clave: "pathImagenesExterno"
			})) Settings.insert({
			clave: "pathImagenesExterno",
			valor: "/var/www/appsPhp/imagenesExterno/"
		});
			if (!Settings.findOne({
				clave: "edadAdherente"
			})) Settings.insert({
			clave: "edadAdherente",
			valor: "20"
		});
		if (!Settings.findOne({
				clave: "tieneServidor"
			})) Settings.insert({
			clave: "tieneServidor",
			valor: "no"
		});
		if (!Settings.findOne({
				clave: "colorDefecto"
			})) Settings.insert({
			clave: "colorDefecto",
			valor: "#000faf"
		});
			if (!Settings.findOne({
				clave: "cantidadGuardarBancos"
			})) Settings.insert({
			clave: "cantidadGuardarBancos",
			valor: "20"
		});
		if (!Settings.findOne({
				clave: "modoServidor"
			})) Settings.insert({
			clave: "modoServidor",
			valor: "PRODUCCION"
		});
		if (!Settings.findOne({
				clave: "nombreEmpresa"
			})) Settings.insert({
			clave: "nombreEmpresa",
			valor: "Nombre Fantasia"
		});
		if (!Settings.findOne({
				clave: "googleDrive_idCliente"
			})) Settings.insert({
			clave: "googleDrive_idCliente",
			valor: "123456"
		});
		if (!Settings.findOne({
				clave: "googleDrive_secret"
			})) Settings.insert({
			clave: "googleDrive_secret",
			valor: "123456"
		});
		if (!Settings.findOne({
				clave: "googleDrive_url"
			})) Settings.insert({
			clave: "googleDrive_url",
			valor: "---"
		});
		if (!Settings.findOne({
				clave: "googleDrive_codigo"
			})) Settings.insert({
			clave: "googleDrive_codigo",
			valor: "---"
		});
		if (!Settings.findOne({
				clave: "proxNroRecivoDeudas"
			})) Settings.insert({
			clave: "proxNroRecivoDeudas",
			valor: "1"
		});
			

		if (!Settings.findOne({
				clave: "googleDrive_token"
			})) Settings.insert({
			clave: "googleDrive_token",
			valor: "---"
		});
	}
	  getTotales (tipo, mes, ano, acumula) {
		if (tipo == "ACTIVOS") return _AUX.getTotalesActivos(mes, ano, acumula);
		return _AUX.getTotalesEdad(tipo, mes, ano, acumula);
		
	}
	
	 quitarImportacionPagos (idIm, quitaImportacion) {
		var data = ImportarPagos.findOne({
			_id: idIm
		});
		if (data.pagos)
			for (var i = 0; i < data.pagos.length; i++) {
				console.log("QUITANDO PAGO:" + data.pagos[i].idPago);
				console.log(data.pagos[i])
				var idPago = data.pagos[i].idPago + "";
				Socios.update({
					_id: data.pagos[i].idSocio
				}, {
					$pull: {
						movimientosCuenta: {
							_id: idPago
						}
					}
				}, {
					getAutoValues: false
				});

			}
		if (quitaImportacion) ImportarPagos.remove({
			_id: idIm
		});
		else {
			ImportarPagos.update({
				_id: idIm
			}, {
				$set: {
					estado: "PENDIENTE",
					pagos: []
				}
			});
		}
	}
	
	 quitarGeneracionDeuda (id) {
		var aux = GeneracionDeudas.findOne({
			_id: id
		});
		console.log(aux);
		if (aux.deudas)
			for (var i = 0; i < aux.deudas.length; i++) {
				console.log("QUITAD");
				var idSocio = (typeof aux.deudas[i].idSocio === "object") ? new Meteor.Collection.ObjectID(aux.deudas[i].idSocio) : aux.deudas[i].idSocio;
				console.log(aux.deudas[i]);
				Socios.update({
					_id: idSocio
				}, {
					$pull: {
						movimientosCuenta: {
							_id: aux.deudas[i].idPago
						}
					}
				}, {
					getAutoValues: false
				});
			}
		GeneracionDeudas.remove(id);
		return true;
	}
	
	 agregarImportacion (idImportacion) {
		var PythonShell = require('python-shell');

		var archi = './agregarImportacion.py';
		var path = process.cwd() + '/../web.browser/app/shellPython';
		console.log(archi)
		var options = {
			mode: 'text',
			scriptPath: path,
			args: [idImportacion]
		};
		PythonShell.run(archi, options, function(err) {
			if (err) throw err;
			console.log('finished');
		});
	}
	
	 ingresarDeudas (idDeuda) {
		var PythonShell = require('python-shell');
		var puntoVenta=Settings.findOne({clave:"puntoVentaDeudas"}).valor;
		var prox=Settings.findOne({ clave: "proxNroRecivoDeudas" }).valor;
		var archi = './generarDeudas.py';
		var path = process.cwd() + '/../web.browser/app/shellPython';
		var options = {
			mode: 'text',
			scriptPath: path,
			args: [idDeuda,puntoVenta,prox]
		};
		PythonShell.run(archi, options, function(err,res) {
		console.log(res)
			if (err) throw err;
		});
	}
	
	 ingresarActividadesPlanSocio (plan,socioid,fechaInicio,idPlanEmpresaSocio,tieneVto_,fechaVto_)
	{
		console.log(tieneVto_)
		console.log(fechaVto_)
		var planEmpresa=PlanesEmpresa.findOne({_id:plan});
		var socio=Socios.findOne({_id:socioid});
		for(var i=0;i<planEmpresa.actividades.length;i++){
			_AUX.quitarActividadesDuplicadoPlan(socio.actividades,planEmpresa.actividades[i].idActividad,socioid,fechaInicio)
		}
		
		for( i=0;i<planEmpresa.actividades.length;i++){
			var aux=planEmpresa.actividades[i];
			var detalleAux="Por plan empresa";
			var actAux={idPlanEmpresa:idPlanEmpresaSocio, tieneVto:tieneVto_,fechaVto:fechaVto_,idActividad:aux.idActividad,estaBaja:false,_id:Meteor.uuid(),importeEspecial:aux.importe,tieneImporteEspecial:true,fechaInicio:fechaInicio,detalle:detalleAux};

			Socios.update({ _id: socioid
			}, {
				$push: {
					actividades: actAux
				}
			});
			
		}
		
		 Socios.update({
			_id: socioid,
			"planesEmpresa._id": idPlanEmpresaSocio
		}, {
			$set: {
				"planesEmpresa.$.estaAplicado":true
			}
		});
	}
	
	 asignarSocioCbu (docSocio, idImp, importe, idItemImportacion) {
		var idSocio = (typeof docSocio._id == 'object') ? docSocio._id._str : docSocio._id
		//console.log("importacion:"+idImp)
		var timestamp = Math.floor(new Date().getTime() / 1000) + "_";
		var detalle = docSocio.apellido.toUpperCase() + ", " + docSocio.nombre + " NRO: " + docSocio.nroSocio;
		var aux = {
			idSocio: idSocio,
			importe: importe,
			_id: timestamp,
			detalle: detalle,
			idFila: idItemImportacion
		};

		var res = ImportarPagos.update({
			_id: idImp,
			"items.id": idItemImportacion
		}, {
			$push: {
				"items.$.sociosAsociados": aux
			}
		});
		// 		var r=ImportarPagos.findOne({_id:idImp,"items.id":idItemImportacion});
		// 		console.log(r)
	}
	
	  asignarSocioCbu2 (docSocio, idImp, importe, idItemImportacion) {
		var idSocio = (typeof docSocio._id == 'object') ? docSocio._id._str : docSocio._id
		console.log("importacion:" + idImp)
		var timestamp = Math.floor(new Date().getTime() / 1000) + "_";
		var detalle = docSocio.apellido.toUpperCase() + ", " + docSocio.nombre + " NRO: " + docSocio.nroSocio;
		var PythonShell = require('python-shell');
		var archi = './asignarSocio.py';
		var path = process.cwd() + '/../web.browser/app/shellPython';
		var options = {
			mode: 'text',
			scriptPath: path,
			args: [idSocio, importe, timestamp, detalle, idItemImportacion, idImp]
		};
		PythonShell.run(archi, options, function(err, res) {

			if (err) throw err;
			console.log(res)
		});

	}
	
	 modificarImporteAsociacion (idImp, idItemImportacion, idItem, importe, indice) {
		var selector = "items.$.sociosAsociados." + indice + ".importe";

		var res = ImportarPagos.update({
			_id: idImp,
			"items.id": idItemImportacion,
			"items.sociosAsociados._id": idItem
		}, {
			$set: {
				[selector]: importe
			}
		});

	}
	
	 btnQuitarAsociaciones (idImp) {
		var res = ImportarPagos.update({
			_id: idImp
		}, {
			$pull: {
				"items.$.sociosAsociados": {
					idItem: "items.$._id"
				}
			},
		});
	}

	 quitarSocioCbu (idImp, idItemImportacion, idAsociacion) {
		var res = ImportarPagos.update({
			_id: idImp,
			"items.id": idItemImportacion
		}, {
			$pull: {
				"items.$.sociosAsociados": {
					"_id": idAsociacion
				}
			}
		});
		var r = ImportarPagos.findOne({
			_id: idImp,
			"items.id": idItemImportacion
		});
		console.log(r)
	}
	
	 quitarFilaImportacion (idImp, idItemImportacion) {

		var res = ImportarPagos.update({
			_id: idImp
		}, {
			$pull: {
				"items": {
					"id": idItemImportacion
				}
			}
		});
	}
	 itemsImportacion (id) {

		// var ordenar={ $sort : { _id : 1 } };
		var unw = {
			$unwind: "$items"
		};

		var proyecto = {
			$project: {
				_id: 0,
				idImportacion: "$_id",
				idItem: "$items.id",
				idFila: "$items.idFila",
				sociosAsociados: "$items.sociosAsociados",
				importe: "$items.importe",
				cbu: "$items.cbu",
				estado: "$items.estado",
				nombreSocio: "$items.nombreSocio"
			}
		};
		var group = {
			$group: {
				_id: "$_id"
			}
		}
		var match = {
			$match: {
				idImportacion: id
			}
		};
		var pipeline = [unw, proyecto, match];
		var res = ImportarPagos.aggregate(pipeline);

		return res;
	}

	 ingresarImportacion2 (desc, formaPago, fechaCarga) {
		var PythonShell = require('python-shell');
		console.log(fechaCarga)
		var path = process.cwd() + '/../web.browser/app/shellPython';
		var archi = './importarPagos.py';
		var options = {
			mode: 'text',
			scriptPath: path,
			args: [desc, formaPago, fechaCarga]
		};
		PythonShell.run(archi, options, function(err) {
			if (err) throw err;
			console.log('finished');
		});
	}
 saldoSocio (idSocio) {
		var ordenar = {
			$sort: {
				_id: 1
			}
		};
		var unw = {
			$unwind: "$movimientosCuenta"
		};
		var match = {
			$match: {
				id: idSocio
			}
		};
		var grupo = {
			$group: {
				_id: null,
				totalDebitos: {
					$sum: "$importeDebita"
				},
				totalCreditos: {
					$sum: "$importeAcredita"
				}
			}
		};
		var proyecto = {
			$project: {
				_id: 1,
				id: "$_id",
				nombre: "$nombre",
				importeDebita: "$movimientosCuenta.importeDebita",
				importeAcredita: "$movimientosCuenta.importeAcredita",
				apellido: "$apellido"
			}
		};

		var pipeline = [unw, proyecto, match, grupo];

		var res = Socios.aggregate(pipeline);
		console.log(res);
		if (res.length > 0) return res[0];
		return null;
	}
	
	 consultarSocio (socio,esId,tipoSocio){
		// SINO ES ID  es NRO SDE SOCIO
		if(esId)return Socios.findOne({_id:socio});
		if(tipoSocio) return Socios.findOne({nroSocio:socio,tipoSocio:tipoSocio});
		return Socios.findOne({nroSocio:socio});
	}
	 agregarActividadSocio (idSocio, idAct) {
		var act = {
			_id: Meteor.uuid(),
			idActividad: idAct,
			fechaInicio: new Date(),
			estaBaja:false,
			detalle: ""
		};
		console.log(act);
		var res = Socios.find({
			_id: idSocio,
			actividades: {
				$elemMatch: {
					idActividad: idAct
				}
			}
		}).fetch();
		if (res.length === 0)
			Socios.update({
				_id: idSocio
			}, {
				$push: {
					actividades: act
				}
			}, {
				getAutoValues: false
			});
		else return false;
		return true;
	}
	
	 agregarGrupoSocio (idGrupo, idSocio) {
		console.log("agergado:"+idGrupo+" idoscio:"+idSocio)
		Socios.update({
			_id: idSocio
		}, {
			$set: {
				idGrupo: idGrupo
			}
		});
	}
    agregarPlanEmpresaSocio (idPlanEmpresa, idSocio,fechaInicio,fechaVto) {
		var arrInicio =fechaInicio.split('/');
    fechaInicio = new Date(arrInicio[2], arrInicio[1]-1, arrInicio[0]); 
		var tienePlan=Socios.findOne({_id:idSocio}).planEmpresa;
		if(tienePlan===idPlanEmpresa)return true;
		var arrVto =fechaVto.split('/');
    var tieneVto_=false;
		console.log(fechaVto);
		if(arrVto.length>2){
			fechaVto = new Date(arrVto[2], arrVto[1]-1, arrVto[0]); 
			tieneVto_=true;
			console.log(fechaVto);
		}
		var socio=Socios.findOne({_id:idSocio});
		Socios.update({
			_id: idSocio
		}, {
			$set: {
				planEmpresa: idPlanEmpresa
			}
		});
		
		var bajaSocio={fecha:fechaInicio,tieneVto:tieneVto_,fechaVto:fechaVto,estado:"BAJA",detalle:"BAJA por alta de PLAN EMPRESA",planEmpresaAplicado:true};
		var altaSocio={fecha:fechaInicio,tieneVto:tieneVto_,fechaVto:fechaVto,estado:"ALTA",detalle:"ALTA por alta de PLAN EMPRESA",planEmpresaAplicado:true,tienePlanEmpresa:true,planEmpresa:idPlanEmpresa};
			
		if(socio.estado=="ALTA"){
			Socios.update({_id:idSocio},{$push:{cambiosEstado:bajaSocio}}); //LO BAJO
			var resAlta=Socios.update({_id:idSocio},{$push:{cambiosEstado:altaSocio}}); //alta
		Meteor.call("ingresarActividadesPlanSocio",idPlanEmpresa, idSocio,fechaInicio,null,tieneVto_,fechaVto); 
			
			
		}else{
			var resBaja=Socios.update({_id:idSocio},{$push:{cambiosEstado:altaSocio}}); //alta
			console.log(resBaja)
		Meteor.call("ingresarActividadesPlanSocio",idPlanEmpresa, idSocio,fechaInicio,resBaja.docId,tieneVto_,fechaVto); 
		}
	}
	 quitarSocioActividad (idAct, idSocio,estado) {
	 	console.log("idact:"+idAct+" idosocio:"+idSocio)
		Socios.update({
			_id: idSocio, "actividades.idActividad":idAct
		}, {
			$set: {"actividades.$.estaBaja": estado}
		}, {
			getAutoValues: false
		});
	}
	
	 quitarSocioGrupo (idGrupo, idSocio) {
		console.log("quitando:"+idGrupo+" id socio:"+idSocio)
		Socios.update({
			_id: idSocio
		}, {
			$set: {
				idGrupo:null
			}
		});
	}
	
	 
	getSociosActividad(idAct,soloAltas){
	var ordenar = {
			$sort: {
				_id: 1
			}
		};
		var unw = { $unwind: "$actividades" };
		var match = { $match: {idActividad:idAct,estado:"ALTA"} };
		var grupo = { $group: {_id:1,total:{$sum:1}} };
		var proyecto = {
			$project: {
				_id: "$actividades._id",
				nombre: "$nombre",
				apellido: "$apellido",
				nroSocio: "$nroSocio",
				tipoSocio: { $cond:[{$eq:["$esActivo",true] },"ACTIVO", {$cond:[ {$gte:[{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },edadAdherente]} ,"ADHERENTE","PARTICIPANTE"] } ] },
				fechaNacimiento: "$fechaNacimiento",
				fechaNacimiento: "$fechaNacimiento",
				esActivo: "$esActivo",
				idSocio: "$_id",
				estado: "$estado",
				idActividad: "$actividades.idActividad",
				estaBaja: "$actividades.estaBaja",
				
				
			}
		};
		if(soloAltas)match.$match.estaBaja=false;

		var pipeline = [ unw,proyecto,match ];
		//if(grupo)pipeline.push(grupo)
		
		var res = Socios.aggregate(pipeline);
	
		return res;
	}
	
	 getSociosGrupos (idGrupo) {
		var ahora=new Date();
		var res = Socios.find({
			$and:[
				{idGrupo:idGrupo
				},
				{estado:"ALTA"},
			]
			
		}).fetch();
		return res;
	}
	
	 getSociosPlanEmpresa (idPlanEmpresa) {
		var ahora=new Date();
		var res = Socios.find({
			$and:[
				{planEmpresa:idPlanEmpresa
				},
				{estado:"ALTA"},
			]
			
		}).fetch();
		return res;
	}
	
	 quitarMovimientoCuenta (idSocio, idMov) {
		console.log("quitando idSocio: " + idSocio + " con idMov: " + idMov);
		Socios.update({
			_id: idSocio
		}, {
			$pull: {
				movimientosCuenta: {
					_id: idMov
				}
			}
		}, {
			getAutoValues: false
		});
		//return [semana1,semana2,semana3,semana4];
	}
 totalCarnets (ano, mes, estado, agrupa) {
	   return _AUX.getTotalCarnets(ano, mes, estado, agrupa);
	}
	 totalPagos (ano, mes, estado, agrupa) {
		return _AUX.getTotalPagos(ano, mes, estado, agrupa);
	}
	 totalDebitosAutomaticos (ano, mes, estado, agrupa) {
		return _AUX.getTotalDebitosAutomaticos(ano, mes, estado, agrupa);
	}
	 mensualCarnets (ano, estado, agrupa) {
		var res = [];
		for (var i = 1; i <= 12; i++) {
			var auxData = _AUX.getTotalCarnets(ano, i, null, agrupa);
			var aux = {
				data: auxData,
				mes: i,
				mesLetras: mesLetras(i)
			};
			res.push(aux);
		}
		//	res.push("dd");
		return res
	}
	
	 mensualPagos (ano, estado, agrupa) {
		var res = [];
		for (var i = 1; i <= 12; i++) {
			var auxData = _AUX.getTotalPagos(ano, i, null, agrupa);
			var aux = {
				data: auxData,
				mes: i,
				mesLetras: mesLetras(i)
			};
			res.push(aux);
		}
		//	res.push("dd");
		return res
	}
	 mensualDebitosAutomaticos (ano, estado, agrupa) {
		var res = [];
		for (var i = 1; i <= 12; i++) {
			var auxData = _AUX.getTotalDebitosAutomaticos(ano, i, null, agrupa);
			var aux = {
				data: auxData,
				mes: i,
				mesLetras: mesLetras(i)
			};
			res.push(aux);
		}
		//	res.push("dd");
		return res
	}
	 proximoSocioLibre () {
		var so = Socios.find({}, {
			sort: {
				nroSocio: -1
			},
			limit: 1
		}).fetch().pop();

		return so.nroSocio + 1;
	}
	 mensualCambioEstados (ano, estado, agrupa) {
		var res = [];
		for (var i = 1; i <= 12; i++) {
			var auxData = _AUX.getTotalCambiosEstado(ano, i, null, agrupa);
			var aux = {
				data: auxData,
				mes: i,
				mesLetras: mesLetras(i)
			};
			res.push(aux);
		}
		//	res.push("dd");
		return res
	}
	 totalCambiosEstado (ano, mes, estado, agrupa) {
		return _AUX.getTotalCambiosEstado(ano, mes, estado, agrupa);
	}
	 modificarImagenSocioAdjunto (idSocio_, imagen) {
		_AUX.subirImagenSocio(idSocio_, imagen);
	}
	 ingresarSocio (dataSocio_) {
		return Socios.insert(dataSocio_);
	}
	 getImagenSocio (idSocio) {
		var res = Imagenes.find({
			idSocio: idSocio
		});

		if (res !== null) return res.data;
		return "-";
	}
	 quitarSocio (idSocio_) {
		console.log("quitando " + idSocio_);
		Socios.remove({
			_id: (idSocio_)
		});
	}
	 cambiarImagenSocio (imagen, idSocio_) {
	 console.log("cambiando imagen");
	 _AUX.subirImagenSocio(idSocio_, imagen)
	}
	 ultimoSocioCargado (tipoSocio) {
		var so = Socios.find({tipoSocio:tipoSocio}, {
			sort: {
				nroSocio: -1
			},
			limit: 1
		}).fetch().pop();
		if (so == null) return 1;
		return so.nroSocio + 1;
	}
	  ultimoIdSocioCargado () {
		var so = Socios.find({}, {
			sort: {
				nroSocio: -1
			},
			limit: 1
		}).fetch().pop();
		if (so == null) return 1;
		return so._id;
	}
	 dataSocio (id) {
		var sal = null;
		if (id.length > 17)
			sal = Socios.findOne({
				_id: new Meteor.Collection.ObjectID(id)
			});
		else sal = Socios.findOne({
			_id: id
		});

		console.log("DATOS SOCIO:" + sal);
		return sal;
	}
	 quitarDeuda (idSocio, idDeuda) {
		console.log("quitando socio: " + idSocio + " con deuda: " + idDeuda);
		var sal;
		if (idSocio.length > 17)
			sal = new Meteor.Collection.ObjectID(idSocio);
		else sal = idSocio;
		Deudas.remove(idDeuda);
		//return [semana1,semana2,semana3,semana4];
	}
	 getSocio (idSocio) {
		return Socios.findOne({
			_id: idSocio
		});
	}
	getSocioNro (nroSocio) {
		var res= Socios.findOne({nroSocio: Number(nroSocio) });
		if(!res)res=Socios.findOne({nroSocio: nroSocio });
		res.fotoCarnet=Imagenes.findOne({idSocio:res._id});
		return res;
	}
	 quitarPromocion (idSocio, idPromocion) {
		console.log("quitando socio: " + idSocio + " con idPromocion: " + idPromocion);
		Socios.update({
			_id: idSocio
		}, {
			$pull: {
				promociones: {
					_id: idPromocion
				}
			}
		}, {
			getAutoValues: false
		});
		//return [semana1,semana2,semana3,semana4];
	}
	 defaultDebito2 (idSocio) {
		Socios.update({
			_id: idSocio,
			"debitoAutomatico.default": true
		}, {
			$set: {
				"debitoAutomatico.$.default": false
			}
		});
		var res = Socios.aggregate([{
			$unwind: "$debitoAutomatico"
		}, {
			$project: {
				_id: 1,
				fecha: "$debitoAutomatico.created",
				idDebito: "$debitoAutomatico._id"
			}
		}, {
			$group: {
				_id: "$debitoAutomatico._id",
				fe: {
					$last: "$created"
				}
			}
		}, {
			$sort: {
				created: 1
			}
		}, {
			$match: {
				_id: "8fG5S6XpKryC5A9Tj"
			}
		}]);
		console.log("DEFAULT");
		console.log(res);
		if (res.length > 0) {
			Socios.update({
				_id: idSocio,
				"debitoAutomatico._id": res[0]._id
			}, {
				$set: {
					"debitoAutomatico.$.default": true
				}
			});
		}


		//return [semana1,semana2,semana3,semana4];
	}
	 defaultDebito (idSocio, idDeb) {
		// 		 var res=Socios.aggregate([{$unwind:"$debitoAutomatico"},{$project:{_id:1,fecha:"$debitoAutomatico.created",idDebito:"$debitoAutomatico._id"}},
		// 															 {$group:{_id:"$debitoAutomatico._id",fe:{$last:"$created"}}},{$sort:{created:1}},
		// 															 {$match:{_id:idDeb}}]);

		Socios.update({
			_id: idSocio,
			"debitoAutomatico.default": true
		}, {
			$set: {
				"debitoAutomatico.$.default": false
			}
		});

		Socios.update({
			_id: idSocio,
			"debitoAutomatico._id": idDeb
		}, {
			$set: {
				"debitoAutomatico.$.default": true
			}
		});



		//return [semana1,semana2,semana3,semana4];
	}
	
 quitarActividad (idSocio, idActividad) {
		console.log("quitando act: " + idSocio + " con act: " + idActividad);
		Socios.update({
			_id: idSocio
		}, {
			$pull: {
				actividades: {
					_id: idActividad
				}
			}
		}, {
			getAutoValues: false
		});
		//return [semana1,semana2,semana3,semana4];
	}
	 quitarPlanEmpresa (idSocio, idPlan) {
		console.log("quitando idSocio: " + idSocio + " con idPlan: " + idPlan);
		Socios.update({
			_id: idSocio
		}, {
			$pull: {
				planesEmpresa: {
					_id: idPlan
				}
			}
		}, {
			getAutoValues: false
		});
		//return [semana1,semana2,semana3,semana4];
	}
	 quitarDebitoAutomatico (idSocio, idDebito) {
		console.log("quitando deb: " + idSocio + " con idDebito: " + idDebito);
		Socios.update({
			_id: idSocio
		}, {
			$pull: {
				debitoAutomatico: {
					_id: idDebito
				}
			}
		}, {
			getAutoValues: false
		});
		//return [semana1,semana2,semana3,semana4];
	}
	 fileUpload (fileInfo, fileData) {
         fs = Npm.require('fs');
		var path = process.cwd() + "/tmp.csv";
		console.log(path);
		var resultados = "DATA PROCESADA";
		// buf = iconv.encode("Sample input string", 'win1251');
		fs.writeFile(path, fileData, {
			encoding: "ascii"
		}, function(err) {
			if (!err) console.log("SUBIO OK")
		});

	}
 subirImagen (nombreImagen, formato, fileData) {
		var fs = Npm.require('fs');
		var nombre = nombreImagen + "." + formato;
		var path = process.cwd() + "/../web.browser/app/images/" + nombre;
		var resultados = "DATA PROCESADA";
		fs.writeFile(path, fileData, {
			encoding: "ascii"
		}, function(err) {
			if (!err) console.log("SUBIO OK");
			else console.log(err)
		});

	}
	 getImagen (nombreImagen) {
		var fs = Npm.require('fs');
		var base64Img = require('base64-img');
		var nombre = nombreImagen + ".png";
		var path = process.cwd() + "/../web.browser/app/images/" + nombre;

		if (fs.existsSync(path)) {
			return base64Img.base64Sync(path);
		}
		return null

	}
 getArchivo (file) {
		var fs = Npm.require('fs');
		var nombre = file + ".pdf";
		var path = process.cwd() + "/../web.browser/app/" + nombre;
		console.log(path)
		if (fs.existsSync(path)) return true

		return null

	}
 fileUploadBanco (fileInfo, fileData) {
		var fs = Npm.require('fs');
		var path = process.cwd() + "/tmp.txt";
		console.log(path);
		var resultados = "DATA PROCESADA";
		// buf = iconv.encode("Sample input string", 'win1251');
		fs.writeFile(path, fileData, {
			encoding: "ascii"
		}, function(err) {
			if (!err) console.log("SUBIO OK")
		});
		var readline = require('readline');
		var rd = readline.createInterface({
			input: fs.createReadStream(path),
		});
		rd.on('line', (function(line) {
			var cbu = line.substring(33, 58);
			var estado = line.substring(173, 176);
			console.log(cbu);
			console.log(estado);

		}));
	}
	loginUser (data) {
		// Meteor.call('loginUser',{email: "vxxxxx@xxxx.com",password: "123456"}, function(error, result){
		//      if(!error) Meteor.loginWithToken(result.token);
		// });
		console.log(data);
		var user = Meteor.users.findOne({
			'emails.address': data.email
		});
		if (user) {
			var password = data.password;
			var result = Accounts._checkPassword(user, password);
			console.log(result);
			if (result.error) {
				return result.error;
			} else {
				return result;
			}
		} else {
			return {
				error: "user not found"
			}
		}
	}

}

