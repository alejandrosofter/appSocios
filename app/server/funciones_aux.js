//************************* FUNCIONES AUX ************************************************//
/*eslint-disable no-undef, semi, semi, eqeqeq, no-undef, no-unreachable, unknown-require, forbiddenExportImport, no-unused-vars, no-empty-label, forbiddenExportImport*/
    import "../lib/utils.js";
var exec = Npm.require('child_process').exec;
var Fiber = Npm.require('fibers');
var Future = Npm.require('fibers/future');

var estaEnCuenta=function(arr,idSocio)
{
    if(arr)
    for(var i=0;i<arr.length;i++)
        if(arr[i].idSocio==idSocio)return true;
    return false;
}
export class Auxiliares {
	actualizarImporteActividad(idSocio,idActividad,importe){
		
		Socios.update(
			{_id:idSocio,"actividades._id":idActividad},
			{$set:{"actividades.$.importe":importe}},
			{ getAutoValues: false }
			)
	}
	buscarPagosProfesor(fechaInicio,fechaFin,idProfesor)
	{
		fechaInicio=new Date(fechaInicio)
		fechaFin=new Date(fechaFin)
		fechaInicio=fechaInicio.addDays(1);
		fechaFin=fechaFin.addDays(1);

		var profe=Profesores.findOne({_id:idProfesor});
		var unw1={ 	$unwind:  { path: "$movimientosCuenta" } }
		var unw2={ 	$unwind:  { path: "$itemsActividades" } }
		var proy1={ 	$project: {
				_id: 1,
				idSocio:"$_id",
				edad:{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },
				estado:"$estado",
				esActivo:"$esActivo",
				nroSocio:"$nroSocio",
				nombre:"$nombre",
				actividades:"$actividades",
				estaEnFecha:{$and:[{$gte:["$movimientosCuenta.fecha",fechaInicio]},{$lte:["$movimientosCuenta.fecha",fechaFin]}]},
				apellido:"$apellido",
				idMovimientoCuenta:"$movimientosCuenta._id",
				itemsActividades:"$movimientosCuenta.itemsActividades",
				planesEmpresa:"$planesEmpresa"
			}
		}
		var proy2={ 	$project: {
				_id: {"$concat":["$idMovimientoCuenta","$idSocio"]},
				idSocio:"$idSocio",
				edad:"$edad",
				idMovimientoCuenta:"$idMovimientoCuenta",
				estado:"$estado",
				esActivo:"$esActivo",
				nroSocio:"$nroSocio",
				importe:"$itemsActividades.importe",
				idActividad:"$itemsActividades.idActividad",
				estaEnFecha:"$estaEnFecha",
				apellido:"$apellido",
				nombre:"$nombre",
				planesEmpresa:"$planesEmpresa"
			}
		}
		var match1={
			$match: {
				idActividad: profe.idActividad,
				// estaEnFecha:true,
				estaBaja:false
			}
		}
		return Socios.aggregate([
        	unw1, proy1,unw2,proy2

        	]);

	}
	buscarPagosProfesor2(fechaInicio,fechaFin,idProfesor)
	{
		fechaInicio=new Date(fechaInicio)
		fechaFin=new Date(fechaFin)
		fechaInicio=fechaInicio.addDays(1);
		fechaFin=fechaFin.addDays(1);

		var profe=Profesores.findOne({_id:idProfesor});
		var edadAdherente=Settings.findOne({ clave: "edadAdherente" })?(Settings.findOne({ clave: "edadAdherente" }).valor*1):0;
		 var unw1={ 	$unwind:  { path: "$actividades",  preserveNullAndEmptyArrays: true } }
		 var proy1={ 	$project: {
				_id: 1,
				tipoSocio: { $cond:[{$eq:["$esActivo",true] },"ACTIVO", {$cond:[ {$gte:[{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },edadAdherente]} ,"ADHERENTE","PARTICIPANTE"] } ] },
				idSocio:"$_id",
				edad:{ $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] },
				estado:"$estado",
				esActivo:"$esActivo",
				nroSocio:"$nroSocio",
				nombre:"$nombre",
				apellido:"$apellido",
				idActividad:"$actividades.idActividad",
				idProfesor:"$actividades.idProfesor",
				estaBaja:"$actividades.estaBaja",
				movimientosCuenta:"$movimientosCuenta",
				planesEmpresa:"$planesEmpresa"
			}
		}
		var match1={
			$match: {
				idProfesor: idProfesor,

				estaBaja:false
			}
		}
		var grupo1={
			$group: {
				_id: "$idSocio",
				nombre: { $last: "$nombre" },
				idSocio: { $last: "$idSocio" },
				apellido: { $last: "$apellido" },
				estado: { $last: "$estado" },
				edad: { $last: "$edad" },
				nroSocio: { $last: "$nroSocio" },
				tipoSocio: { $last: "$tipoSocio" },
				movimientosCuenta: { $last: "$movimientosCuenta" },
				planesEmpresa: { $last: "$planesEmpresa" },
				estaBaja: { $last: "$actividades.estaBaja" },
				importeEspecial: { $last: {$cond:["$actividades.tieneImporteEspecial","$actividades.importeEspecial",0]} },
				idProfesor: { $last: "$actividades.idProfesor" },
				idActividad: { $last: "$actividades.idActividad" },
			}
		}

		 var unw2={ 	$unwind: { path: "$movimientosCuenta",  preserveNullAndEmptyArrays: true } }
		 var proy2={ 	$project: {
				_id: "$movimientosCuenta._id",
				idSocio:"$idSocio",
				idPago:"$movimientosCuenta._id",
				tipoSocio:"$tipoSocio",
				edad:"$edad",
				estado:"$estado",
				esActivo:"$esActivo",
				nroSocio:"$nroSocio",
				nombre:"$nombre",
				apellido:"$apellido",
				idActividad:"$idActividad",
				importeEspecial:"$importeEspecial",
				idProfesor:"$idProfesor",

				nroRecivo:"$movimientosCuenta.nroRecivo",
				fecha:"$movimientosCuenta.fecha",
				
				planesEmpresa:"$planesEmpresa",

				itemsActividades:"$movimientosCuenta.itemsActividades",
				countItemsActividades:{$cond:[{$not:"$movimientosCuenta.itemsActividades"},1,{$size:"$movimientosCuenta.itemsActividades"}]},
				fecha:"$movimientosCuenta.fecha",
				
				
			}
		}
		var match2={
			$match: {
				//countItemsActividades:{$gt:0},

			}
		}
		
		 var unw3={ 	$unwind: { path: "$itemsActividades",  preserveNullAndEmptyArrays: true } }
		var proy3={ 	$project: {
				_id: 1,
				tipoSocio: "$tipoSocio",
				edad:"$edad",
				idSocio:"$idSocio",
				idPago:"$idPago",
				estado:"$estado",
				esActivo:"$esActivo",
				nroSocio:"$nroSocio",
				nombre:"$nombre",
				apellido:"$apellido",
				nroRecivo:"$nroRecivo",
				fecha:"$fecha",
				importeEspecial:"$importeEspecial",
				idActividad:"$idActividad",
				idProfesor:"$idProfesor",
				planesEmpresa:"$planesEmpresa",
				
				importe:"$itemsActividades.importe",
				idActividadPago:{$cond:[{$not:"$itemsActividades.idActividad"},profe.idActividad,"$itemsActividades.idActividad"]},
				fecha:"$fecha",
				estaEnFecha:{$and:[{$gte:["$fecha",fechaInicio]},{$lte:["$fecha",fechaFin]}]}
				
			}
		}
var match3={
			$match: {
				//idActividadPago:profe.idActividad,
				//fecha:{$gte:fechaInicio,$lte:fechaFin}
			}
		}
		var grupo3={
			$group: {
				_id: "$idSocio",
				nombre: { $last: "$nombre" },
				idSocio: { $last: "$idSocio" },
				apellido: { $last: "$apellido" },
				estado: { $last: "$estado" },
				edad: { $last: "$edad" },
				nroSocio: { $last: "$nroSocio" },
				tipoSocio: { $last: "$tipoSocio" },
				movimientosCuenta: { $last: "$movimientosCuenta" },
				planesEmpresa: { $last: "$planesEmpresa" },
				estaBaja: { $last: "$estaBaja" },
				idProfesor: { $last: "$idProfesor" },
				importeEspecial: { $last: "$importeEspecial" },
				nroRecivo: { $push: {$cond:["$estaEnFecha","$nroRecivo",0]} },
				idActividad: { $last: "$idActividad" },
				estaEnFecha: { $last: "$estaEnFecha" },
				fecha: { $push: {$cond:["$estaEnFecha","$fecha","no"] }},
				aplicable: { $push: "$fecha" },

				importe: { $sum: {$cond:["$estaEnFecha","$importe",0]}},
			}
		}
		var unw4={ 	$unwind: { path: "$planesEmpresa",  preserveNullAndEmptyArrays: true } }
		var proy4={ 	$project: {
				_id: 1,
				tipoSocio: "$tipoSocio",
				edad:"$edad",
				idSocio:"$idSocio",
				idPago:"$idPago",
				estado:"$estado",
				esActivo:"$esActivo",
				nroSocio:"$nroSocio",
				nombre:"$nombre",
				apellido:"$apellido",
				nroRecivo:"$nroRecivo",
				fecha:"$fecha",
				importeEspecial:"$importeEspecial",
				idActividad:"$idActividad",
				idProfesor:"$idProfesor",
				
				importe:"$importe",
				planInactivo:"$planesEmpresa.estaInactiva",
				idPlanEmpresa:"$planesEmpresa.idPlanEmpresa",
				fecha:"$fecha",
				
			}
		}
		var grupo4={
			$group: {
				_id: "$idSocio",
				nombre: { $last: "$nombre" },
				idSocio: { $last: "$idSocio" },
				apellido: { $last: "$apellido" },
				estado: { $last: "$estado" },
				edad: { $last: "$edad" },
				nroSocio: { $last: "$nroSocio" },
				tipoSocio: { $last: "$tipoSocio" },
				movimientosCuenta: { $last: "$movimientosCuenta" },
				planesEmpresa: { $last:{ "$arrayElemAt": [ "$planEmpresa", 0 ] } },
				estaBaja: { $last: "$estaBaja" },
				idProfesor: { $last: "$idProfesor" },
				importeEspecial: { $last: "$importeEspecial" },
				nroRecivo: { $last: "$nroRecivo" },
				idActividad: { $last: "$idActividad" },
				estaEnFecha: { $last: "$estaEnFecha" },
				fecha:{ $last: "$fecha" },
				aplicable: { $last: "$fecha" },

				importe: { $last: "$importe" },
			}
		}
		var look={
   $lookup:
     {
       from: "planesEmpresa",
       localField: "idPlanEmpresa",
       foreignField: "_id",
       as: "planEmpresa",
     }
}
var unw5={ 	$unwind: { path: "$planesEmpresa.actividades",  preserveNullAndEmptyArrays: true } }
var proy5={ 	$project: {
				_id: 1,
				tipoSocio: "$tipoSocio",
				edad:"$edad",
				idSocio:"$idSocio",
				idPago:"$idPago",
				estado:"$estado",
				esActivo:"$esActivo",
				nroSocio:"$nroSocio",
				nombre:"$nombre",
				apellido:"$apellido",
				nroRecivo:"$nroRecivo",
				fecha:"$fecha",
				importeEspecial:"$importeEspecial",
				idActividad:"$idActividad",
				idProfesor:"$idProfesor",
				
				importe:"$importe",
				planInactivo:"$planInactivo",
				idPlanEmpresa:"$idPlanEmpresa",
				idActividadPlanEmpresa:"$planesEmpresa.actividades.idActividad",
				importePlanEmpresa:"$planesEmpresa.actividades.importe",
				fecha:"$fecha",
				
			}
		}
		var grupo5={
			$group: {
				_id: "$idSocio",
				nombre: { $last: "$nombre" },
				idSocio: { $last: "$idSocio" },
				apellido: { $last: "$apellido" },
				estado: { $last: "$estado" },
				edad: { $last: "$edad" },
				nroSocio: { $last: "$nroSocio" },
				tipoSocio: { $last: "$tipoSocio" },
				movimientosCuenta: { $last: "$movimientosCuenta" },
				planesEmpresa: { $last: "$planesEmpresa" },
				estaBaja: { $last: "$estaBaja" },
				idProfesor: { $last: "$idProfesor" },
				importeEspecial: { $last: "$importeEspecial" },
				nroRecivo: { $last: "$nroRecivo" },
				idActividad: { $last: "$idActividad" },
				estaEnFecha: { $last: "$estaEnFecha" },
				fecha:{ $last: "$fecha" },
				idActividadPlanEmpresa:{$push: {$cond:[{$eq:["$idActividadPlanEmpresa",profe.idActividad]},"$idActividadPlanEmpresa",""]}  },
				importePlanEmpresa:{$last:"$importePlanEmpresa"},
				aplicable: { $last: "$fecha" },

				importe: { $last: "$importe" },
			}
		}
        var res = Socios.aggregate([
        	unw1, proy1,match1,grupo1,
        	unw2, proy2,match2,
        	unw3,proy3,match3,grupo3,
			unw4,proy4,
			look,grupo4,
			unw5,proy5,grupo5

        	]);
		
		return res;
	}
    buscarActividadSocio(idSocio,idActividad)
    {
    	var socio=Socios.findOne({_id:idSocio});
    	var acts=socio.actividades;
    	for(var i=0;i<acts.length;i++)
    		if(acts[i].idActividad==idActividad && !acts[i].estaBaja) return acts[i]._id;
    	return null;
    }
    desligarCuentaSocio(socios)
	{
		console.log(socios);
		for(var i=0;i<socios.length;i++)
			Socios.update({_id:socios[i].idSocio},{$set:{formaDePagoPrincipal:"EFECTIVO",idCbuAsociado:null}});
	}
	
    ingresarCbuSocio(data,idAsignacion)
    {
        var bancoSocio="OTROS";
        data.cbu_debito=data.cbu_debito.replace("-","");
        data.cbu_debito=data.cbu_debito.replace("-","");
        var bloque1cbu=data.cbu_debito.substring(0,8);
        var fillerCbu="000";
        
        
         
        var bloque2cbu=data.cbu_debito.substring(data.cbu_debito.length-14,data.cbu_debito.length);
        if(bloque1cbu=="08300195")  bancoSocio="CHUBUT"; //ES CHUBUT
        var cbuCuenta= (bloque1cbu+bloque2cbu);
        var cbuEnBase=CbuSocios.findOne({cbu:cbuCuenta});
        if(!data.fechaInicio_debito)data.fechaInicio_debito=new Date();
        if(data.titular_debito=="")data.titular_debito="SIN DATOS"
         
        var socioCbu={_id:idAsignacion, idSocio:data.idSocio,nombreSocio:(data.apellidoSocio+" "+data.nombreSocio),estaInactiva:data.estaInactiva_debito,fechaInicio:data.fechaInicio_debito,fechaFinaliza:data.fechaFinaliza_debito};
        
        //console.log(cbuCuenta)
        
        if(!cbuEnBase){
            var aux={socios:[socioCbu],cbu:cbuCuenta,banco:bancoSocio,titular:data.titular_debito,nroCuenta:data.nroCuenta_debito,cuil:data.cuil_debito,tipoCuenta:data.titular_debito}
            
            CbuSocios.insert(aux,function(err,id){
              Socios.update({_id:data.idSocio},{$set:{formaDePagoPrincipal:"CUENTA",idCbuAsociado:id}});  
            });
        }else{
            if(!estaEnCuenta(socioCbu.socios,data.idSocio)){
                 CbuSocios.update({_id:cbuEnBase._id},{$push:{socios:socioCbu}},{ getAutoValues: false });
                 Socios.update(
                     {_id:data.idSocio},
                     {$set:{formaDePagoPrincipal:"CUENTA",idCbuAsociado:cbuEnBase._id}},
                     { getAutoValues: false }
                     );
            }
                
        }
        
        
    }
    getTodasCuentasDebito()
    {
        var unw={ 	$unwind: "$debitoAutomatico" }
        var proy={ 	$project: {
				_id: 1,
				fecha: "$debitoAutomatico.created",
				idDebito: "$debitoAutomatico._id",
				idSocio:"$_id",
				nombreSocio:"$nombre",
				apellidoSocio:"$apellido",
				fecha_debito:"$debitoAutomatico.fecha",
				default_debito:"$debitoAutomatico.default",
				estaInactiva_debito:"$debitoAutomatico.estaInactiva",
				fechaFinaliza_debito:"$debitoAutomatico.fechaFinaliza",
				cbu_debito:"$debitoAutomatico.cbu",
			    banco_debito:"$debitoAutomatico.banco",
				fechaInicio_debito:"$debitoAutomatico.fechaInicio",
				titular_debito:"$debitoAutomatico.titular",
				nroCuenta_debito:"$debitoAutomatico.nroCuenta",
				cuil_debito:"$debitoAutomatico.cuil",
				tipoCuenta_debito:"$debitoAutomatico.tipoCuenta",
				
			}
		}
		var grupo={
			$group: {
				_id: "$debitoAutomatico._id",
				fe: {
					$last: "$created"
				}
			}
		}
		var sort={
			$sort: {
				created: 1
			}
		}
		var mat={
			$match: {
				_id: "8fG5S6XpKryC5A9Tj"
			}
		}
        var res = Socios.aggregate([unw, proy ]);
		
		return res;
    }
    quitarPagoSociosRta(data)
    {
        var idPagos=[];
        var contador=0;
        var cantidad=Settings.findOne({ clave: "proxNroDebitos" }).valor;
        for(var i=0;i<data.length;i++){
            contador++;
            Socios.update(
                {_id: data[i].idSocio }, 
		        { $pull: { "movimientosCuenta": { "_id": data[i].idPago } } },
		        { getAutoValues: false } // SIN ESTE PARAMETRO NO QUITA!!
            )
        }
        cantidad=cantidad-contador;
        Settings.update({ clave: "proxNroDebitos" },{$set:{valor:cantidad}});
        return idPagos
            
    }
    cargarPagoSociosRta(data,estado,fecha)
    {
        var idPagos=[];
        
        for(var i=0;i<data.length;i++){
            var id = Math.round((new Date()).getTime() / 1000)+i;
            var detalle="PAGO POR DEBITO AUTOMATICO ARCHIVO (RESULTADO: "+estado+" )";
            var  importe=data[i].importe;
            if(estado!="ACE")importe=0;
            var proximo=Settings.findOne({ clave: "proxNroDebitos" }).valor+1;
            var nro=proximo;
            
             var datosPago={"_id":(id),"esDebitoAutomatico":true,"fecha":fecha,"nroRecivo":nro,puntoVenta:2,"detalle":detalle,"formaPago":"DEBITO CUENTA","importeDebita":0,"importeAcredita":importe,"importeCargaActividad":0,"importeCarnet":0,"importeCargaSocial":0,"importeOtros":0,"importeCuotaSocial":importe,"importeFormaPago":importe,"motivo":"PAGO DEBITO AUTOMATICO"}
            Socios.update({"_id":data[i].idSocio},{$push:{"movimientosCuenta":datosPago}});
            Settings.update({ clave: "proxNroDebitos" },{$set:{valor:proximo}});
            idPagos.push({idPago:id+"",idSocio:data[i].idSocio});
            
        }
        return idPagos
            
    }
    buscarCuentas(banco,cuenta)
    {
        var match = { $match: {"estado":"ALTA","banco":banco} 	};
        var unw = { 	$unwind: "$debitoAutomatico" };
        var proyecto = {
		$project: {
			_id: 1,
			nombre: "$nombre",
			edad: { $divide: [{ $subtract: [new Date(), "$fechaNacimiento"] }, (365 * 24 * 60 * 60 * 1000) ] } ,
			detalle:{$concat:["$apellido",", ","$nombre"," (","$nroSocio",")"]},
			nroSocio: "$nroSocio",
			esActivo: "$esActivo",
			fechaNacimiento: "$fechaNacimiento",
			estado: "$estado",
			estadoPago:{$concat:["PENDIENTE"]},
			activo: "$esActivo",
			banco: "$debitoAutomatico.banco",
			cbu: "$debitoAutomatico.cbu"
		}
	};
        var pipeline = [unw, proyecto,match];
	    return Socios.aggregate(pipeline);
    }
    marcarMensajesLeidos(emisor,receptor)
    {

		return MensajesInternos.update({idUsuarioReceptor:receptor,idUsuarioEmisor:emisor,estaLeido:false},{$set:{estaLeido:true}});
		
    }
getSociosMensaje(mensaje)
{
if(mensaje.mensajeEspecifico){
	var arrAux=[];
	var socios=Socios.find({idGrupo:mensaje.idGrupo}).fetch();
    for(var i=0;i<socios.length;i++){
    
    arrAux.push(Socios.findOne({_id:socios[i]._id}));
    }
    return arrAux;
     
    }
  if(mensaje.excluirSociosGrupo) return Socios.find({idGrupo:null,estado:"ALTA"}).fetch();
   return Socios.find({estado:"ALTA"}).fetch();
    
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
imprimir(text)
{
    console.log(text)
}
getTotalCambiosEstado(ano, mes, estado, agrupa) {
	var ordenar = {
		$sort: {
			_id: 1
		}
	};
	var unw = {
		$unwind: "$cambiosEstado"
	};
	var grupo = {
		$group: {
			_id: {
				estado: "$estado"
			},
			total: {
				$sum: 1
			}
		}
	};
	var proyecto = {
		$project: {
			_id: 1,
			nombre: "$nombre",
			"edad": {
				$divide: [{
						$subtract: [new Date(), "$fechaNacimiento"]
					},
					(365 * 24 * 60 * 60 * 1000)
				]
			},
			apellido: "$apellido",
			nroSocio: "$nroSocio",
			esActivo: "$esActivo",
			fechaNacimiento: "$fechaNacimiento",
			total: 1,
			fecha: "$cambiosEstado.fecha",
			ano: {
				$year: "$cambiosEstado.fecha"
			},
			mes: {
				$month: "$cambiosEstado.fecha"
			},
			motivo: "$cambiosEstado.motivo",
			estado: "$cambiosEstado.estado"
		}
	};
	var match = {
		$match: {}
	};
	if (ano !== null) match.$match.ano = ano;
	if (mes !== null) match.$match.mes = mes;
	if (estado !== null) match.$match.estado = estado;

	var pipeline = [unw, proyecto, match];
	if (agrupa) pipeline.push(grupo);

	var res = Socios.aggregate(pipeline);
	if (res.length > 0) return res;
	return null;
};

getTotalDebitosAutomaticos(ano, mes, estado, agrupa) {
	//console.log("ano: "+ano+" mes:"+mes+" estadi:"+estado+" agrupa:"+agrupa);
	var ordenar = {
		$sort: {
			_id: 1
		}
	};
	var unw = {
		$unwind: "$debitoAutomatico"
	};
	var grupo = {
		$group: {
			_id: null,
			total: {
				$sum: 1
			}
		}
	};
	var proyecto = {
		$project: {
			_id: 1,
			nombre: "$nombre",
			apellido: "$apellido",
			total: 1,
			fecha: "$debitoAutomatico.fecha",
			ano: {
				$year: "$debitoAutomatico.fecha"
			},
			mes: {
				$month: "$debitoAutomatico.fecha"
			},
			titular: "$debitoAutomatico.titular",
			cbu: "$debitoAutomatico.cbu",
			banco: "$debitoAutomatico.estado",
			tipoCuenta: "$debitoAutomatico.tipoCuenta",
			nroCuenta: "$debitoAutomatico.nroCuenta",
			cuil: "$debitoAutomatico.cuil"
		}
	};
	var match = {
		$match: {
			ano: ano
		}
	};
	if (mes !== null) match.$match.mes = mes;
	if (estado !== null) match.$match.default = estado;

	var pipeline = [unw, proyecto, match];
	if (agrupa) pipeline.push(grupo);

	var res = Socios.aggregate(pipeline);

	if (res.length > 0) return res;
	return null;
};

getTotalCarnets(ano, mes, estado, agrupa) {
	//console.log("ano: "+ano+" mes:"+mes+" estadi:"+estado+" agrupa:"+agrupa);
	var ordenar = {
		$sort: {
			_id: 1
		}
	};
	var unw = {
		$unwind: "$tarjetas"
	};
	var grupo = {
		$group: {
			_id: null,
			total: {
				$sum: 1
			}
		}
	};
	var join = {
		$lookup: {
			from: "imagenes",
			localField: "_id",
			foreignField: "idSocio",
			as: "imagen"
		}
	};
	var proyecto = {
		$project: {
			_id: 1,
			nombre: "$nombre",
			apellido: "$apellido",
			total: 1,
			fecha: "$tarjetas.fecha",
			ano: {
				$year: "$tarjetas.fecha"
			},
			mes: {
				$month: "$tarjetas.fecha"
			},
			detalle: "$tarjetas.detalle"
		}
	};
	var match = {
		$match: {
			ano: ano
		}
	};
	if (mes !== null) match.$match.mes = mes;
	if (estado !== null) match.$match.default = estado;

	var pipeline = [unw, proyecto, join, match];
	if (agrupa) pipeline.push(grupo);

	var res = Socios.aggregate(pipeline);
	if (res.length > 0) return res;
	return null;
};

getTotalPagos(ano, mes, estado, agrupa) {
	//console.log("ano: "+ano+" mes:"+mes+" estadi:"+estado+" agrupa:"+agrupa);
	var ordenar = {
		$sort: {
			_id: 1
		}
	};
	var unw = {
		$unwind: "$movimientosCuenta"
	};
	var grupo = {
		$group: {
			_id: null,
			total: {
				$sum: 1
			}
		}
	};

	var proyecto = {
		$project: {
			_id: 1,
			nombre: "$nombre",
			apellido: "$apellido",
			total: 1,
			fecha: "$movimientosCuenta.fecha",
			ano: {
				$year: "$movimientosCuenta.fecha"
			},
			mes: {
				$month: "$movimientosCuenta.fecha"
			},
			detalle: "$movimientosCuenta.detalle",
			importeDebita: "$movimientosCuenta.importeDebita",
			importeAcredita: "$movimientosCuenta.importeAcredita",
			motivo: "$movimientosCuenta.motivo"
		}
	};
	var match = {
		$match: {
			ano: ano
		}
	};
	if (mes !== null) match.$match.mes = mes;
	if (estado !== null) match.$match.default = estado;

	var pipeline = [unw, proyecto, match];
	if (agrupa) pipeline.push(grupo);

	var res = Socios.aggregate(pipeline);

	if (res.length > 0) return res;
	return null;
}

sociosActividad(ano, mes, agrupa) {
	//console.log("ano: "+ano+" mes:"+mes+" estadi:"+estado+" agrupa:"+agrupa);
	var ordenar = {
		$sort: {
			_id: 1
		}
	};
	var unw = {
		$unwind: "$actividades"
	};
	var grupo = {
		$group: {
			_id: "$idActividad",
			total: {
				$sum: 1
			}
		}
	};
    var join = {
		$lookup: {
			from: "actividades",
			localField: "_id",
			foreignField: "_id",
			as: "actividad"
		}
	};
	var proyecto = {
		$project: {
			_id: 1,
			nombre: "$nombre",
			apellido: "$apellido",
			total: 1,
			idActividad: "$actividades.idActividad",
			_idActividad: "$actividades._id",
			idSocio:"$_id",
			bajaActividad:"$actividades.estaBaja",
			estadoSocio:"$estado",
			ano: {
				$year: "$actividades.fechaInicio"
			},
			mes: {
				$month: "$actividades.fechaInicio"
			},
			tieneVto: "$actividades.tieneVto",
		}
	};
	var match = {
		$match: {tieneVto:false }
	};
	if (mes !== null) match.$match.mes = mes;
	if (ano !== null) match.$match.ano = ano;

	var pipeline = [unw, proyecto];
	if (agrupa) pipeline.push(grupo);
	 pipeline.push(join);

	var res = Socios.aggregate(pipeline);

	if (res.length > 0) return res;
	return null;
}

subirImagenSocio(idSocio_, imagen) {

	idSocio_ = idSocio_ + "";
	var imagenSocio = Imagenes.findOne({
		idSocio: idSocio_,
		descripcion: "carnet"
	});
	var idImagen_ = null;
	if (imagenSocio != null) {
		idImagen_ = imagenSocio._id;
		var res = Imagenes.update(idImagen_, {
			$set: {
				data: imagen
			}
		});
		console.log("actualiza " + res);
	} else {
		console.log("id " + idSocio_);
		idImagen_ = Imagenes.insert({
			idSocio: idSocio_,
			data: imagen,
			descripcion: "carnet"
		});
		console.log("imagen nueva " + idImagen_);
	}
	Socios.update(idSocio_, {
		$set: {
			idImagen: idImagen_
		}
	});
}

getSocioCbu(cbu, importe, idItemImportacion) {
	var res = Socios.aggregate({
		$unwind: "$debitoAutomatico"
	}, {
		$match: {
			"$debitoAutomatico.cbu": cbu
		}
	});
	if (res.length > 0) {
		var docSocio = res[0];
		var timestamp = Math.floor(new Date().getTime() / 1000) + "_" + i;
		var detalle = docSocio.apellido.toUpperCase() + ", " + docSocio.nombre + " NRO: " + docSocio.nroSocio;
		return {
			idSocio: docSocio._id,
			importe: importe,
			_id: timestamp,
			detalle: detalle,
			idFila: idItemImportacion
		};
	}
	return null

}

getTotalesEdad(tipo, mes, ano, acumula) {
	var edadAdherente = parseFloat(Settings.findOne({
		clave: "edadAdherente"
	}).valor);

	var match = {
		$match: {
			edad: {
				$lt: edadAdherente
			},
			esActivo: false
		}
	};
	if (tipo == "ADHERENTES") match = {
		$match: {
			edad: {
				$gte: edadAdherente
			}
		}
	};
	match.$match.estado = "ALTA";
	if (acumula) {
		if (ano !== null) match.$match.ano = ano;
		if (mes !== null) match.$match.mes = {
			$lte: mes
		};
	} else {
		if (ano !== null) match.$match.ano = ano;
		if (mes !== null) match.$match.mes = mes;
	}

	var unw = {
		$unwind: "$cambiosEstado"
	};
	var proyecto = {
		$project: {
			_id: 1,
			estado: "$cambiosEstado.estado",
			estadoSocio: "$estado",
			ano: {
				$year: "$cambiosEstado.fecha"
			},
			mes: {
				$month: "$cambiosEstado.fecha"
			},
			nombre: "$nombre",
			apellido: "$apellido",
			total: 1,
			edad: {
				$divide: [{
						$subtract: [new Date(), "$fechaNacimiento"]
					},
					(365 * 24 * 60 * 60 * 1000)
				]
			},
			esActivo: "$esActivo"
		}
	};

	var ordenar = {
		$sort: {
			_id: 1
		}
	};
	var grupo = {
		$group: {
			_id: null,
			total: {
				$sum: 1
			}
		}
	};

	var pipeline = [unw, proyecto, match, grupo];
	var res = Socios.aggregate(pipeline);
	if (res.length > 0) return res[0].total;
	return 0;

};

getTotalesCaja(fechaDesde,fechaHasta, actividad, formaPago_, soloMias) {
	var arrDesde=fechaDesde.split("/");
	
	var dia_ = Number(arrDesde[0])
	var	mes_ = Number(arrDesde[1])
	var ano_ = Number(arrDesde[2])
	var d=new Date(ano_,mes_-1,dia_);
	d.addHours(-24);
	var d2=new Date(ano_,mes_-1,dia_);
	d2.addHours(-24);
	
	if(fechaHasta){
	    var arrHasta=fechaHasta.split("/");
    	
    	var dia_2 = Number(arrHasta[0])
    	var	mes_2 = Number(arrHasta[1])
    	var ano_2 = Number(arrHasta[2]);
    	d2=new Date(ano_2,mes_2-1,dia_2);
	
	}

d2.addHours(24);

	var match = {
		$match: {
			fecha:{"$gte":d,"$lte":d2},
			esDebitoAutomatico: false
		}
	};
	var match2 = {
		$match: {
			"importe":{"$gt":0},
		}
	};

	if (actividad.length > 0) match.$match.actividades = {
		$elemMatch: {
			"idActividad": {
				$nin: actividad
			}
		}
	};
	if (formaPago_ !== "TODAS") match2.$match.formaPago=formaPago_;
	
	if (soloMias) match.$match.usuario = Meteor.user()._id;
	var unw = {
		$unwind: "$movimientosCuenta"
	};
	var unw2 = {
		$unwind: "$pagos"
	};
	var proyecto = {
		$project: {
			_id: 1,
			estadoSocio: "$estado",
			actividades: "$movimientosCuenta.itemsActividades",
			esDebitoAutomatico: "$movimientosCuenta.esDebitoAutomatico",
			hay2FormaPago: "$movimientosCuenta.hay2FormaPago",
			tieneActividades: {
				$size: {
					"$ifNull": ["$movimientosCuenta.itemsActividades", []]
				}
			},
			detalle: "$movimientosCuenta.detalle",
			importeCuotaSocial: "$movimientosCuenta.importeCuotaSocial",
			nroRecibo: "$movimientosCuenta.nroRecivo",
			formaPago: "$movimientosCuenta.formaPago",
			usuario: "$movimientosCuenta.usuario",
			fecha: "$movimientosCuenta.fecha",
			pagos:[{importe:"$movimientosCuenta.importeFormaPago",formaPago:"$movimientosCuenta.formaPago"},{importe:"$movimientosCuenta.importeFormaPago2",formaPago:"$movimientosCuenta.formaPago2"}],
			formaPago2: "$movimientosCuenta.formaPago2",
			importe: "$movimientosCuenta.importeFormaPago",
			importe2: "$movimientosCuenta.importeFormaPago2",
			nroSocio: "$nroSocio",
			id:"$_id",
			ano: {
				$year: "$movimientosCuenta.fecha"
			},
			mes: {
				$month: "$movimientosCuenta.fecha"
			},
			dia: {
				$dayOfMonth: "$movimientosCuenta.fecha"
			},
			nombre: "$nombre",
			apellido: "$apellido",
			total: 1,
			edad: {
				$divide: [{
						$subtract: [new Date(), "$fechaNacimiento"]
					},
					(365 * 24 * 60 * 60 * 1000)
				]
			},
			esActivo: "$esActivo"
		}
	};
	var proyecto2 = {
		$project: {
			_id: "$_id",
			estadoSocio: "$estado",
			actividades: "$itemsActividades",
			esDebitoAutomatico: "$esDebitoAutomatico",
			hay2FormaPago: "$hay2FormaPago",
			tieneActividades:"$tieneActividades",
			detalle: "$detalle",
			importeCuotaSocial: "$importeCuotaSocial",
			nroRecibo: "$nroRecibo",
			usuario: "$usuario",
			fecha: "$fecha",
			formaPago: "$pagos.formaPago",
			importe: "$pagos.importe",
			nroSocio: "$nroSocio",
			id:"$_id",
			ano:"$ano",
			mes: "$mes",
			dia: "$dia",
			nombre: "$nombre",
			apellido: "$apellido",
			edad:"$edad",
			esActivo: "$esActivo"
		}
	};
	var sort={ $sort : { nroRecibo : 1 } };
	var pipeline = [unw, proyecto, match,unw2,proyecto2,match2,sort];
	var res = Socios.aggregate(pipeline);
	console.log(res)
	return res


};

subirImagenSocio222(mes, ano, acumula) {
	var proyecto = {
		$project: {
			_id: 1,
			estado: "$estado",
			nombre: "$nombre",
			apellido: "$apellido",
			total: 1,
			esActivo: "$esActivo",
			ano: {
				$year: "$cambiosEstado.fecha"
			},
			mes: {
				$month: "$cambiosEstado.fecha"
			}
		}
	};
	var unw = {
		$unwind: "$cambiosEstado"
	};

	var ordenar = {
		$sort: {
			_id: 1
		}
	};
	var grupo = {
		$group: {
			_id: null,
			total: {
				$sum: 1
			}
		}
	};
	var match = {
		$match: {
			esActivo: true,
			estado: "ALTA"
		}
	};

	if (acumula) {
		if (ano !== null) match.$match.ano = { $lte: ano };
		if (mes !== null) match.$match.mes = { $lte: mes };
	} else {
		if (ano !== null) match.$match.ano = ano;
		if (mes !== null) match.$match.mes = mes;
	}

	var pipeline = [unw, proyecto, match, grupo];
	var res = Socios.aggregate(pipeline);
	if (res.length > 0) return res[0].total;
	return 0;
}

getDrive() {
	var {
		google
	} = require('googleapis');

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


	var googleAuth = require('google-auth-library');

	var e = JSON.parse(token)

	var OAuth2 = google.auth.OAuth2;
	var oauth2Client = new OAuth2(
		clientId,
		clientSecret,
		redirectUrl
	);
	oauth2Client.credentials = e;
	var drive = google.drive({
		version: 'v3',
		auth: oauth2Client
	});
	return drive;
};

subirArchivo2(archivo)
{
		var fs = Npm.require('fs');
		//var archivo="test.tar";
	var token = (Settings.findOne({
			clave: "googleDrive_token"
		}).valor);
	var path = process.cwd() + "/../web.browser/app/shellPython/" + archivo;
	const stats = fs.statSync(path)
const fileSizeInBytes = stats.size

	var request = require('request');

request({
    url: "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
    method: "POST",
    json: true,   // <--Very important!!!
    body: fs.createReadStream(path),
	 headers: { 
        "Authorization" : "Bearer "+token,
        "Content-Type": "application/json; charset=utf-8",
				"Content-Length": fileSizeInBytes,
				
      },
}, function (error, response, body){
    console.log(response);
	console.log(error);
	console.log(body);
})
	.on('data', function(data) {
    // decompressed data as it is received
    console.log('decoded chunk: ' + data)
  })
  .on('response', function(response) {
    // unmodified http.IncomingMessage object
    response.on('data', function(data) {
      // compressed data as it is received
      console.log('received ' + data.length + ' bytes of compressed data')
    })
})
};

subirArchivo(archivo) {
	Future = Npm.require('fibers/future');
	var fut1 = new Future();
	var fs = Npm.require('fs');
archivo="test.tar";
	var path = process.cwd() + "/../web.browser/app/shellPython/" + archivo;
	var drive = getDrive();

	var media = {
		
		body: fs.createReadStream(path)
	};
	drive.files.list({
		
		q: "mimeType = 'application/vnd.google-apps.folder' and name='backupsBases'",
		fields: "nextPageToken, files(id, name)"
	}, function(err, response) {
		var files = response.data.files;
		var id = response.data.files.length > 0 ? (response.data.files[0].id) : null;
		console.log("subiendo a carpeta " + id + " nom: " + response.data.files[0].name)
		var fileMetadata = {
			'name': archivo,
			parents: [id],
		};

		drive.files.create({
			"resource": fileMetadata,
			"media": media,
			
		}, function(err) {
			console.log(err)
		});
	})

}
quitarActividadesDuplicadoPlan(actividades,idActividad,idsocio,fechaCambioEstado){

	for(var i=0;i<actividades.length; i++)
		if(actividades[i].idActividad==idActividad){
			console.log("quitar");
			console.log(actividades[i])
			 Socios.update({ _id: idsocio,  "actividades._id":actividades[i]._id }, { $set: { "actividades.$.estaBaja": true,"actividades.$.fechaBaja": fechaCambioEstado,}});
		
		}
}

}










 
//getTotalDebitosAutomaticos(2017,null,null,null);


// db.socios.aggregate([{$unwind: "$cambiosEstado"},{$project:{_id:1,estado:"$estado",ano:{$year:"$cambiosEstado.fecha"},mes:{$month:"$cambiosEstado.fecha"},nombre:"$nombre",apellido:"$apellido",total:1,edad: {
//                  $divide: [{$subtract: [ new Date(), "$fechaNacimiento" ] }, 
//                     (365 * 24*60*60*1000)]
//             },esActivo:"$esActivo"}},{$match:{edad:{$gte:20},estado:"ALTA",ano:2017,mes:11}},{$group: {_id: null,total:{$sum:1}}}])



//*******************************FUNCIONES AUX***************************************//