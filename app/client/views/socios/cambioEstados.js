AutoForm.hooks({
	'modificarCambioEstado_': {
		onSuccess: function(operation, result, template) {
			swal("GENIAL!", "Se ha MODIFICADO el cambio de estado!", "success");
			console.log(this);
			Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
'nuevoCambioEstado_': {
 onSubmit: function (doc) {
      
				
        //return doc;
              
    },
	 after: {
    // Replace `formType` with the form `type` attribute to which this hook applies
   update: function(error, result) {console.log("cambiooo!")}
  },
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
      		swal("GENIAL!", "Se ha ingresado el cambio de estado!", "success");
			
			if(this){
				var planEmpresaAux=this.insertDoc.tienePlanEmpresa?this.insertDoc.planEmpresa:null;
				Socios.update({_id:this.docId},{$set:{estado:this.insertDoc.estado,planEmpresa:planEmpresaAux} });
			}

			if(this.insertDoc.tienePlanEmpresa){
				var plan=this.insertDoc.planEmpresa;
				var socio=Session.get("socio")._id;
				var fecha=this.insertDoc.fecha;
				var id=this._id;
				swal({   title: "Asignar ACTIVIDADES ?",   text: "Le has ingresado un plan de empresa, deseas ingresarle las actividades.. en caso de que tenga activas actividades que tenga el plan, estas se daran de baja.",   type: "warning",   showCancelButton: true,   confirmButtonColor: "green",   confirmButtonText: "Si, INGRESA ACTIVIDADES!",   closeOnConfirm: true }, 
						 function(){ 
				UIBlock.block('Cargando actividades...');
				Meteor.call("ingresarActividadesPlanSocio",plan,socio,fecha,id,function(err,res){
					UIBlock.unblock();
				}) });
			}
			if(this.insertDoc.estado=="BAJA"&&Session.get("socio").idCbuAsociado){
				//TENGO QUE SACARLO Y LUEGO PONERLO EN LA BAJA
				Meteor.call("bajaCbuSocio",Session.get("socio")._id,function(err,res){
					swal("Bien...","Se ha quitado también de la cuenta de BANCO ASOCIADA")
				})
			}
			Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},


	
});

Template.impresionDebito.helpers({
	"fechaAlta":function(){
		console.log(this);
		 var d=new Date(this.alta.fecha);
		return d.getFecha();
	},
	"nombreSocio":function(){
		return (this.socio.apellido+" ",this.socio.nombre).toUpperCase();
	},
	"mes":function(){
		console.log(this);
	
		var d=new Date(this.alta.fecha);
		return mesLetras(d.getMes());
	},
	"ano":function(){
		console.log(this);
		 var d=new Date(this.alta.fecha);
		return d.getAno();
	},
	"dia":function(){
		console.log(this);
		 var d=new Date(this.alta.fecha);
		return d.getDia();
	},
		"importe":function(){
		return getImporteSocio(this.socio._id);
	},
	"tipoSocio":function(){
		return getTipoSocio(this.socio.fechaNacimiento,this.socio.esActivo);
	},
	"proximoMes":function(){
		console.log(this);
		 var d=new Date();
		var aux= d.getMonth()+2;
		if(aux>13)return "ENERO del AÑO entrante";
		return mesLetras(aux);
	},
	"debita":function(){
	if(this.socio.debitaCbu)return this.socio.cbu;
		return "NO";
	},
	"fechaNac":function(){
		 var d=new Date(this.socio.fechaNacimiento);
		return d.getFecha();
	}
});
Template.impresionAlta.helpers({
	"fechaAlta":function(){
		console.log(this);
		 var d=new Date(this.alta.fecha);
		return moment(this.alta.fecha).format("DD/MM/YYYY");
	},
	"nombreSocio":function(){
		return (this.socio.apellido+" ",this.socio.nombre).toUpperCase();
	},
	"tienePlan":function(){
		console.log(this)
		return this.alta.tienePlanEmpresa
	},
	"fechaVtoPlan":function(){
		return this.alta.fechaVto.getFecha()
	},
	"nombrePlanEmpresa":function(){
		return PlanesEmpresa.findOne({_id:this.alta.planEmpresa}).nombrePlanEmpresa
	},
	"contratoPlanEmpresa":function(){
		return new Spacebars.SafeString(PlanesEmpresa.findOne({_id:this.alta.planEmpresa}).detalleContrato)
	},
		"importe":function(){
		return getImporteSocio(this.socio._id);
	},
	"tipoSocio":function(){
		return getTipoSocio(this.socio.fechaNacimiento,this.socio.esActivo);
	},
	"actividades":function(){
	var aux="";
		for(var i=0;i<this.socio.actividad.length;i++)
		aux+=Actividades.findOne({_id:this.socio.actividad[i]}).nombreActividad+", ";
	
		return aux;
	},
	"debita":function(){
	if(this.socio.debitaCbu)return this.socio.cbu;
		return "NO";
	},
	"mes":function(){
		console.log(this);
	
		 var d=new Date(this.alta.fecha);
		return mesLetras(d.getMes());
	},
	"ano":function(){
		console.log(this);
		 var d=new Date(this.alta.fecha);
		return d.getAno();
	},
	"dia":function(){
		console.log(this);
		 var d=new Date(this.alta.fecha);
		return d.getDia();
	},
	"fechaNac":function(){
		 var d=new Date(this.socio.fechaNacimiento);
		d.setDate(d.getDate() + 1);
		return d.toLocaleDateString();
	}
});
Template.impresionBaja.helpers({
	"fechaAlta":function(){
		console.log(this);
		 var d=new Date(this.baja.fecha);
		return moment(this.baja.fecha).format("DD/MM/YYYY")
	},
	"nombreSocio":function(){
		return (this.socio.apellido+" ",this.socio.nombre).toUpperCase();
	},
	"mes":function(){
		console.log(this);
	
		var d=new Date(this.baja.fecha);
		return mesLetras(d.getMes());
	},
	"ano":function(){
		var d=new Date(this.baja.fecha);
		return d.getAno();
	},
	"dia":function(){
		var d=new Date(this.baja.fecha);
		return d.getDia();
	},
	"estado":function(){
		var clase=this.estado=="BAJA"?"claseBaja":"claseAlta";
		return  new Spacebars.SafeString("<span class='"+clase+"'> "+this.estado+" </span>")
	},
		"importe":function(){
		return getImporteSocio(this.socio._id);
	},
	"tipoSocio":function(){
		return getTipoSocio(this.socio.fechaNacimiento,this.socio.esActivo);
	},
	
	"debita":function(){
	if(this.socio.debitaCbu)return this.socio.cbu;
		return "NO";
	},
	"fechaNac":function(){
		 var d=new Date(this.socio.fechaNacimiento);
		d.setDate(d.getDate() + 1);
		return d.toLocaleDateString();
	}
});
Template.impresionAlta.events({
	"click #btnPrint":function(){
		console.log("print");
		window.print()
	},
});
Template.impresionDebito.events({
	"click #btnPrint":function(){
		console.log("print");
		window.print()
	},
});
Template.accionesCambioEstados.helpers({
	"tieneDebito":function(){
		console.log("tiene deb?");console.log(this);
		var debito=Session.get("socio").debitaCbu;
		var esAlta=this.estado=="ALTA";
		return debito && esAlta;
	},
});
Template.impresionBaja.helpers({
	"fechaBaja":function(){
		 var d=new Date(this.baja.fecha);
		return d.getFecha()
	},
	"mes":function(){
		 var d=new Date();
		return mesLetras(d.getMes());
	},
	"ano":function(){
		console.log(this);
		 var d=new Date(this.baja.fecha);
		return d.getAno();
	},
	"dia":function(){
		console.log(this);
		 var d=new Date(this.baja.fecha);
		return d.getDia();
	},
	"fechaNac":function(){
		 var d=new Date(this.socio.fechaNacimiento);
		return d.getFecha();
	}
});
Template.impresionBaja.events({
	"click #btnPrint":function(){
		console.log("print");
		window.print()
		//printElement(document.getElementById("printThis"));
    
    //var modThis = document.querySelector("#printSection .modifyMe");
    //modThis.appendChild(document.createTextNode(" new"));
    
    //window.print();
	//	printElement(document.getElementById("alta"));
	},
});
Template.nuevoCambioEstado.rendered=function(){
	
}
function buscarTitularCuenta(){
	Meteor.call("getTitularCbu",Session.get("socio").idCbuAsociado,function(err,res){
		$("#infoExtra").val(res)
	})
}
Template.nuevoCambioEstado.events({
  'click #tienePlanEmpresa': function(ev) {
    if($("#tienePlanEmpresa").prop("checked")) $("#conte_planEmpresa").show();
		else $("#conte_planEmpresa").hide();
  },
  'change #estado': function(ev) {
    if($("input[name='estado']:checked").val()=="BAJA")
    	buscarTitularCuenta()
    else $("#infoExtra").val("")
  },
	 'click #tieneVto': function(ev) {
    if($("#tieneVto").prop("checked")) $("#conte_vto").show();
		else $("#conte_vto").hide();
  },
    
});
Template.modificarCambioEstado.events({
  'click #tienePlanEmpresa': function(ev) {
    if($("#tienePlanEmpresa").prop("checked")) $("#conte_planEmpresa").show();
		else $("#conte_planEmpresa").hide();
  },
	  'click #tieneVto': function(ev) {
    if($("#tieneVto").prop("checked")) $("#conte_vto").show();
		else $("#conte_vto").hide();
  },
    
});
var buscarIndice=function(busca)
{
	var arr=Session.get("socio").cambiosEstado;
	console.log(arr)
	for (var i = 0; i < arr.length; i++)
		if(arr[i]._id==busca)return i;
	return -1;
}

Template.modificarCambioEstado.helpers({
	"muestraPlanEmpresa":function()
	{
		return this.tienePlanEmpresa?"":"none"
	},
	"mostrarVto":function()
	{
		return this.tieneVto?"":"none"
	},
	"eti_fecha":function(){
		console.log(this)
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'cambiosEstado.'+ind+'.fecha';
	},
	"eti_fechaVto":function(){
		console.log(this)
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'cambiosEstado.'+ind+'.fechaVto';
	},
	"eti_tieneVto":function(){
		console.log(this)
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'cambiosEstado.'+ind+'.tieneVto';
	},
	"eti_planEmpresaAplicado":function(){
		console.log(this)
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'cambiosEstado.'+ind+'.planEmpresaAplicado';
	},
	"eti_tienePlanEmpresa":function(){
		console.log(this)
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'cambiosEstado.'+ind+'.tienePlanEmpresa';
	},
	"eti_planEmpresa":function(){
		console.log(this)
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'cambiosEstado.'+ind+'.planEmpresa';
	},
	"docu":function(){
		return Session.get("socio");
	},
		"eti_detalle":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'cambiosEstado.'+ind+'.detalle';
	},
		"eti_estado":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'cambiosEstado.'+ind+'.estado';
	},
})
Template.cambiosEstado.events({
	 'click .delete': function(ev) {
    var val=this;
    Modal.show('bajaActividadSocio',function(){
			return val._id;
			
		});
  },
	
	'click .imprimir': function(ev) {
    var act=this;
		console.log(ev);
		if(this.estado=="ALTA")
    Modal.show('impresionAlta',function(){ return {socio:Session.get("socio"),alta:act} });
		else  Modal.show('impresionBaja',function(){ return {socio:Session.get("socio"),baja:act} });
  },
	'click .editar': function(ev) {
    var act=this;
		Modal.show('modificarCambioEstado',function(){ return act; });
  },
	'click .imprimirDebito': function(ev) {
    var act=this;
		console.log(ev);
		Modal.show('impresionDebito',function(){ return {socio:Session.get("socio"),alta:act} });
  },
	
});
Template.cambiosEstado.events({
  'click #btnAgregarEstado': function(ev) {
    var act=this;
    Modal.show('nuevoCambioEstado',function(){ return act; });
  },
	
    
});

Template.cambiosEstado.helpers({
	'esAdmin': function(){
     if(!Meteor.user())return false;
     if(Meteor.user().profile==="admin")return true;
       return false;
     },
	'settings': function(){
		
        return {
 collection: this.cambiosEstado,
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: false,
 fields: [
	

      {
        key: 'fecha',
        label: 'Fecha',
				headerClass: 'col-md-2',
        fn: function (value, object, key) {
          var d=new Date(value);
					var clase=object.estado=="BAJA"?"claseBaja":"claseAlta";
					if(object.estado=="SUSPENDIDO")clase="calseSuspendido";
					var fecha=object.estado=="ALTA"?moment(d).format("DD/MM/YYYY"):d.getFecha();
		return  new Spacebars.SafeString("<span class='"+clase+"'> "+fecha+" </span>")
           
         }
      },
	 	{
					key: 'fecha',
					label: 'Fecha',
					headerClass: 'col-md-2',
					sortOrder: 0, sortDirection: 'descending' ,hidden: true
				}, 
	 {
        key: 'estado',
        label: 'Estado',
				headerClass: 'col-md-1',
        fn: function (value, object, key) {
          var clase=value=="BAJA"?"claseBaja":"claseAlta";
					if(object.estado=="SUSPENDIDO")clase="calseSuspendido";
		return  new Spacebars.SafeString("<span class='"+clase+"'> "+value+" </span>")
         }
      },
   
   {
        key: 'detalle',
        label: 'Detalle',
         fn: function (value, object, key) {
          var d=new Date(value);
					var clase=object.estado=="BAJA"?"claseBaja":"claseAlta";
					 if(object.estado=="SUSPENDIDO")clase="calseSuspendido";
					 var detalle=value==null?"-":value;
					 if(object.planEmpresa){
						 detalle+=object.tienePlanEmpresa?(' <span  class="label label-danger">'+PlanesEmpresa.findOne({_id:object.planEmpresa}).nombrePlanEmpresa+"</span>"):"";					 }
		return  new Spacebars.SafeString("<small class='"+clase+"'><i> "+detalle+"</i> </small>")
           
         }
		
      },
    
    {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesCambioEstados
      }
 ]
 };
    },
	"items":function(){
	//	var acts=new Meteor.Collection(this.actividades);
		return this.cambiosEstado;
	},
	
  'mouseover tr': function(ev) {
    $("#tablaCambiosEstado").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
	
});