var consultaSaldo=function()
{
	  Meteor.call("saldoSocio",Session.get("socio")._id,function(err,res){
    Session.set("resSaldo",res);
  })
}

var getImporteCreditos=function()
{
	var creditos=0;
	var res= Actividades.find().fetch();
		for(var i=0;i<res.length;i++){
			var selector="#"+res[i]._id;
			creditos+=$(selector).length?Number($(selector).val()):0;
		}
	return Number($("#importeInscripcion").val())+Number($("#importeCuotaSocial").val())+Number($("#importeCarnet").val())+Number($("#importeOtros").val())+creditos;
}
var getImporteDebitos=function()
{
	return Number($("#importeCargaSocial").val())+Number($("#importeCargaActividad").val());
}
var getItemsActividades=function()
{
	var res= Actividades.find().fetch();
	var sal=[];
		for(var i=0;i<res.length;i++){
			var selector="#"+res[i]._id;
			
			var impAux=$(selector).length? Number($(selector).val()):0;
			if(impAux>0)sal.push({importe:impAux,idActividad:res[i]._id});
		}
	return sal;
}

Socios.before.update(function(userid,doc, fieldNames, modifier, options){
	
	if(fieldNames.length>0 && fieldNames[0]=="movimientosCuenta" && modifier.$push)
	modifier.$push.movimientosCuenta.itemsActividades=getItemsActividades();
})
AutoForm.hooks({
	'nuevoMovimientosCuenta_': {
	
		onSuccess: function(operation, result, template) {
			swal("GENIAL!", "Se ha ingresado el registro!", "success");
      consultaSaldo();
				Meteor.call("incrementaProxNroRecivo",function(err,res){
					
				})
			Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
      consultaSaldo();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
  'modificarMovimientosCueenta_': {
		before:{
      update: function(doc) {
				var sel="movimientosCuenta."+Session.get("indiceSeleccion");
        doc.$set[sel+".itemsActividades"]=getItemsActividades();
				doc.$set[sel+".importeDebita"]=getImporteDebitos();
			  doc.$set[sel+".importeAcredita"]=getImporteCreditos();
			
			 // if(doc.$set[sel+".importeAcredita"]>0 ){
			 // var prox=Settings.findOne({clave:"proxNroRecivo"}).valor
			 // doc.$set[sel+".nroRecivo"]=prox;
			 // console.log(doc)
			 
		  //}  POR QUE CHOTA PUSE ESOO???

        return doc;
        }
    },
		onSuccess: function(operation, result, template) {
			swal("GENIAL!", "Se ha modificado el registro!", "success");
			Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},



});
var buscarIndice=function(busca)
{
	var arr=Session.get("socio").movimientosCuenta;
	for (var i = 0; i < arr.length; i++)
		if(arr[i]._id==busca)return i;
	return -1;
}
Template.detalleItems.helpers({
	"docu":function(){
		
	},
})
var getImporteActividades=function(idSeleccion,idActividad)
{
		var socio=Session.get("socio");
	console.log(socio)
	idSeleccion=Number(idSeleccion);
			for(var i =0;i<socio.movimientosCuenta[idSeleccion].itemsActividades.length;i++){
				console.log(socio.movimientosCuenta[idSeleccion]);
				if(socio.movimientosCuenta[idSeleccion].itemsActividades[i].idActividad==idActividad)return socio.movimientosCuenta[idSeleccion].itemsActividades[i].importe;
			}
				
  return 0;
}
Template.actividadPago.helpers({
	"getImporteActividad":function(idActividad,esNuevo){
		var idSeleccion=Session.get("indiceSeleccion");
		if(esNuevo)return 0;
			return getImporteActividades(idSeleccion,idActividad);
	},
	"indexMovimiento":function()
	{
		return Session.get("contadorMovimientos");
	}

})
Template.actividadPago.rendered=function(){
	Session.set("contadorMovimientos",Session.get("socio").movimientosCuenta.length);
}
Template.actividadPago2.helpers({
	"getImporteActividad":function(idActividad,esNuevo){
		var idSeleccion=Session.get("indiceSeleccion");
		if(esNuevo)return 0;
			return getImporteActividades(idSeleccion,idActividad);
	},
	
})
Template.modificarMovimientoCeenta.helpers({
  "docu":function(){
		return Session.get("socio");
	},
	"actividades":function(){
		var res= Actividades.find().fetch();
		res.map(function(document, index) {
            document.index = index + 1;
           // if(socioTieneActividad(document._id))
            return document;
        });
        var salida=[];
        for (var i = 0; i<res.length; i++)
        	if(socioTieneActividad(res[i]._id))salida.push(res[i])
        
		return salida;
	},
	"eti_importeInscripcion":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
		Session.set("indiceSeleccion",ind);
	return 'movimientosCuenta.'+ind+'.importeInscripcion';
		
	},
	"eti_fecha":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
		Session.set("indiceSeleccion",ind);
	return 'movimientosCuenta.'+ind+'.fecha';
		
	},
	"eti_usuario":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
		Session.set("indiceSeleccion",ind);
	return 'movimientosCuenta.'+ind+'.usuario';
		
	},
	"eti_items":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
		Session.set("indiceSeleccion",ind);
	return 'movimientosCuenta.'+ind+'.itemsActividades';
		
	},
	"eti_hay2FormaPago":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
	return 'movimientosCuenta.'+ind+'.hay2FormaPago';
	},
	"eti_formaPago2":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
	return 'movimientosCuenta.'+ind+'.formaPago2';
	},
  "eti_detalle":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
	return 'movimientosCuenta.'+ind+'.detalle';
		
	},
  "eti_motivo":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
	return 'movimientosCuenta.'+ind+'.motivo';
		
	},
  "eti_importeFormaPago":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
	return 'movimientosCuenta.'+ind+'.importeFormaPago';
		
	},
	"eti_nroRecivo":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
	return 'movimientosCuenta.'+ind+'.nroRecivo';
		
	},
	 "eti_formaPago":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
	return 'movimientosCuenta.'+ind+'.formaPago';
		
	},
	"eti_importeCuotaSocial":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
	return 'movimientosCuenta.'+ind+'.importeCuotaSocial';
	},
	"eti_importeCarnet":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
	return 'movimientosCuenta.'+ind+'.importeCarnet';
	},
	"eti_importeCargaSocial":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
	return 'movimientosCuenta.'+ind+'.importeCargaSocial';
	},
	"eti_importeOtros":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
	return 'movimientosCuenta.'+ind+'.importeOtros';
	},
  "eti_importeCargaActividad":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
	return 'movimientosCuenta.'+ind+'.importeCargaActividad';
		
	},
	"eti_importeFormaPago2":function(){
		var idSeleccion=this;
		var ind=buscarIndice(idSeleccion);
	return 'movimientosCuenta.'+ind+'.importeFormaPago2';
	},
	// "actividades":function(){
	// 	var res= Actividades.find().fetch();
		
	// 	return res;
	// },
	"importeFinal":function(){
		return Session.get("importeFinal")
	},
  
});

var cambiaImportes=function(){
	
		var creditos=getImporteCreditos();
		var debitos=getImporteDebitos();

	 $("#importeDebita").val(debitos);$("#importeAcredita").val(creditos);
		$("#importeFormaPago").val((creditos));
		console.log(creditos)
		Session.set("importeFinal", (creditos).formatMoney(2));
}
var consultarCaja=function(){
    Meteor.call("yaCerroCaja",$("#fecha").val(),Meteor.user()._id,function(err,res){
       if(res){
           $("#btnAceptar").attr("disabled","disabled");
           swal({title:"Opss..",type:"warning", text:"La caja de este dia ya esta cerrada!.. por favor elija otra fecha para imputar"});
       } else{
           $("#btnAceptar").removeAttr("disabled");
       }
    });
}
Template.nuevoMovimientoCuneta.rendered=function(){
	Session.set("importeFinal","00.00");
	consultarCaja();
    var id = Math.round((new Date()).getTime() / 1000);
	$("#_id").val(id)
	Meteor.call("proxNroRecivo",function(err,res){
		$("#nroRecivo").val(res)
	})
}
Template.modificarMovimientoCeenta.rendered=function(){
	Session.set("importeFinal","00.00");
	cambiaImportes();
	if($("#nroRecivo").val()==""){
	Meteor.call("proxNroRecivo",function(err,res){
		$("#nroRecivo").val(res)
	})
	}
	 var res=$("#hay2FormaPago").is(':checked');
		if(res)$("#contenedor_formaPago2").show();
		else $("#contenedor_formaPago2").hide()
	
}
function setImporteDiferencia()
{

	var importeFinal=Number(Session.get("importeFinal"));
		var importeFormaPago=Number($("#importeFormaPago").val());
	console.log(importeFinal,importeFormaPago)
		if(importeFormaPago<importeFinal){
			var dif=importeFinal-importeFormaPago;
			$("#importeFormaPago2").val(dif.formatMoney(2));
		}else $("#importeFormaPago2").val(0);
}
Template.modificarMovimientoCeenta.events({
	"change .importesPagos":function(){
		cambiaImportes()
	},
	"change #hay2FormaPago":function(){
		var res=$("#hay2FormaPago").is(':checked');
		if(res)$("#contenedor_formaPago2").show();
		else $("#contenedor_formaPago2").hide();
		setImporteDiferencia()
	},
	"keyup #importeFormaPago":function()
	{
		setImporteDiferencia();
	}
})
Template.nuevoMovimientoCuneta.events({
	"change .importesPagos":function(){
		cambiaImportes()
	},
	"change #fecha":function(){
		consultarCaja()
	},
	"keyup #importeFormaPago":function()
	{
		setImporteDiferencia();
	},
	"change #hay2FormaPago":function(){
		var res=$("#hay2FormaPago").is(':checked');
		if(res)$("#contenedor_formaPago2").show();
		else $("#contenedor_formaPago2").hide()
			setImporteDiferencia();
	},
"keyup #importeFormaPago":function()
	{
		setImporteDiferencia();
	}
})
function socioTieneActividad(idActividad)
{
	var acts=Session.get("socio").actividades;

	for (var i = 0; i<acts.length; i++) 
		if(acts[i].idActividad==idActividad && !acts[i].estaBaja)return true;
	return false;
}
Template.nuevoMovimientoCuneta.helpers({
	"usuario":function()
	{
		return Meteor.user()._id;
	},
	"actividades":function(){
		var res= Actividades.find().fetch();
		res.map(function(document, index) {
            document.index = index + 1;
           // if(socioTieneActividad(document._id))
            return document;
        });
        var salida=[];
        for (var i = 0; i<res.length; i++)
        	if(socioTieneActividad(res[i]._id))salida.push(res[i])
        
		return salida;
	},
	"importeFinal":function(){
		return Session.get("importeFinal")
	},
	"fechaActual":function(){
		var d=new Date();
		return d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear();
	}
})


Template.movimientosCuenta.helpers({
"totalDebitos":function(){
  if(Session.get("resSaldo"))return  Session.get("resSaldo").totalDebitos.toFixed(2);
  return 0
},
  "total":function(){
  if( Session.get("resSaldo"))return  (Session.get("resSaldo").totalCreditos-Session.get("resSaldo").totalDebitos).toFixed(2);
  return 0
},
  "creditosTotal":function(){
  if( Session.get("resSaldo"))return  Session.get("resSaldo").totalCreditos.toFixed(2);
    return 0;
},
	'settings': function() {
		return {
			collection: this.movimientosCuenta,
			rowsPerPage: 10,
			class: "table table-condensed",
			showFilter: false,
			fields: [
			    	{
					key: 'nroRecivo',
					label: 'Nro',
					headerClass: 'col-md-2',
					fn: function(value, object, key) {
					return String(object.puntoVenta).lpad("0",3)+" - "+ String(value).lpad("0",6)
					}
				}, 
				{
					key: 'fecha',
					label: 'Fecha',
					headerClass: 'col-md-1',
					fn: function(value, object, key) {
						var d = new Date(value);
						return d.getFecha2();
					}
				}, 
				
	{
					key: 'fecha',
					label: 'Fecha',
					headerClass: 'col-md-2',
					sortOrder: 0, sortDirection: 'descending' ,hidden: true
				}, 
		
        
        {
					key: 'detalle',
					label: 'Detalle',
					//headerClass: 'col-md-2',
					fn: function(value, object, key) {
						var conc="";
						if(object.importeCuotaSocial>0)conc+="PAGO CUOTA SOCIAL ";
						if(object.itemsActividades)if(object.itemsActividades.length>0)conc+="PAGO ACTIVIDADES ";
						if(object.detalle)conc+="<small> - "+object.detalle+"</small>";
					return new Spacebars.SafeString("<small>"+conc+"</small>");
						
					},
				},
        {
					key: 'importeDebita',
					label: '$ DEB',
					//headerClass: 'col-md-2',
					fn: function(value, object, key) {
					    if(value)
            return new Spacebars.SafeString("<span style='color:red'>"+value.toFixed(2)+"<span>");
					},
				},
        {
					key: 'importeAcredita',
					label: '$ ACRE',
					//headerClass: 'col-md-2',
					fn: function(value, object, key) {
					     if(value)
            return new Spacebars.SafeString("<span style='color:green'>"+value.toFixed(2)+"<span>");
					},
				},

				{
					label: '',
					headerClass: 'col-md-2',
					tmpl: Template.accionesMovimientosCuenta
				}
			]
		};
	},

	'mouseover tr': function(ev) {

	},

});
var buscarCampoDeuda=function(deuda,campo)
{
	var imp=0;
	$(Session.get("socio").deudas).each(function(i,item){
		if(deuda==item._id){imp=item[campo];return;}
	});
	return imp;
}
Template.accionesMovimientosCuenta.helpers({
	"puedoBorrar":function(){
		if(Meteor.user().profile==="admin")return true;
		return this.usuario===Meteor.user()._id;
	}
})
Template.movimientosCuenta.onRendered(function(){
	
  consultaSaldo();
})
Template.imprimirRecivo.events({
	"click #btnPrint":function(){
		
		window.print()
	},
});
Template.cobroActividad.helpers({
	"nombreActividad":function(){
		var aux=Actividades.findOne({_id:this.idActividad});
		return "ACTIVIDAD CUOTA "+aux.nombreActividad;
	},
	"importe":function()
	{
		return this.importe.formatMoney(2)
	}
})
Template.imprimirRecivo.helpers({
	"socio":function(){
		return Session.get("socio").apellido.toLocaleUpperCase()+", "+Session.get("socio").nombre.toLocaleUpperCase();
	},
	"importe":function(){
		var saldo=this.importeAcredita;
		return saldo.formatMoney(2,3,",",".");
	},
	"nroSocio":function()
	{
		var socio= Session.get("socio").nroSocio+"";
		return socio.lpad("0",4);
	},
	"mes":function(){
		 var d=new Date(this.fecha);
		var mes=d.getMes();
		return mesLetras(mes);
	},
	"nroRecivo":function(){
		var aux= this.nroRecivo+"";
		 return aux.lpad("0",5)
	},
	"ano":function(){
		var d=new Date(this.fecha);
		return d.getAno();
	},
	"dia":function(){
		var d=new Date(this.fecha);
		return d.getDia();
	},
	"importeLetras":function(){
		var saldo=this.importeAcredita;
		return numeroALetras(saldo, {
  plural: 'pesos',
  singular: 'peso',
  centPlural: 'centavos',
  centSingular: 'centavo'
});
	},
})
Template.movimientosCuenta.events({
	'click #btnAgregarMov': function(ev) {
		var act = this;

		Modal.show('nuevoMovimientoCuneta', function() {
			return act;
		});
		$(".modal").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
	},
	'click .imprimir': function(ev) {
		var val=this;
    Modal.show('imprimirRecivo',function(){
			return val;
			
		});
	},
	'click .delete': function(ev) {
		var val = this;
		swal({
				title: "Estas Seguro de quitar la promocion?",
				text: "Una vez que lo has quitado sera permanente!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Si, borralo!",
				closeOnConfirm: false
			},
			function() {
				var id = Session.get('socio')._id;
				Meteor.call("quitarMovimientoCuenta", id, val._id, function(err, res) {
					if (!err) {
            swal("Quitado!", "El registro ha sido borrado", "success");
            consultaSaldo()
          }
					else swal("Ops...", "Ha ocurrido un error para quitar! .. por favor chekear nuevamente", "error");
				});
				//Socios.update({_id:id},{$pull:{deudas:{_id:val.doc._id}}},{getAutoValues: false});
			});

	},
	'click .update': function(ev) {
		var val = this;
		Modal.show('modificarMovimientoCeenta', function() {
			return val._id;

		});
	},

});