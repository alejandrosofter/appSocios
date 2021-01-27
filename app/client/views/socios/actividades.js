AutoForm.hooks({
'modificaActividadSocio_': {

		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha modificado la actividad del socio!", "success");
			console.log(this);
			Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},


	'nuevaActividadSocio_': {
before:{
      insert: function(doc) {
       // doc.estado="ALTA";
        return doc;
        }
    },
	
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha ingresado la actividad al socio!", "success");
			console.log(this);
			Modal.hide();

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
	
});

Template.actividadesSocio.events({
	'click .quitar': function(ev) {
    console.log(this);
    var id=Session.get('socio')._id;
		var res=this._id+"";
		
		swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, 
				 function(){ 
		 Meteor.call("quitarActividad",id,res,function(err,res){
        if(!err)swal("Quitado!", "El registro ha sido borrado", "success");
        else swal("Ops...", "Ha ocurrido un error para quitar! .. por favor chekear nuevamente", "error");
      });
			
		});
  
  },
	 'click .aplicarPlan': function(ev) {
    var val=this;
		 var plan=this.planEmpresa;
				var socio=Session.get("socio")._id;
				var fecha=this.fecha;
		  console.log($(".aplicarPlan").attr("tieneVto"));
		 	swal({   title: "Asignar ACTIVIDADES ?",   text: "Le has ingresado un plan de empresa, deseas ingresarle las actividades.. en caso de que tenga activas actividades que tenga el plan, estas se daran de baja.",   type: "warning",   showCancelButton: true,   confirmButtonColor: "green",   confirmButtonText: "Si, INGRESA ACTIVIDADES!",   closeOnConfirm: true }, 
						 function(){ 
				UIBlock.block('Cargando actividades...');
				var tieneVto=($(".aplicarPlan").attr("tieneVto")==="true"?true:false);
				console.log(tieneVto)
				Meteor.call("ingresarActividadesPlanSocio",plan,socio,fecha,val._id,tieneVto,new Date($(".aplicarPlan").attr("vto")),function(err,res){
					UIBlock.unblock();
				}) });
  },
	 'click .delete': function(ev) {
    var val=this;
		 console.log(val);
    Modal.show('bajaActividadSocio',function(){
			return val._id;
			
		});
  },
	'click .update': function(ev) {
    var val=this;
    Modal.show('modificaActividadSocio',function(){
			return val;
			
		});
  },
	
});
Template.actividadesSocio.events({
  'click #agregarActividadSocio': function(ev) {
    var act=this;
    Modal.show('nuevaActividadSocio',function(){ return act; });
  },

	
    
});
Template.nuevaActividadSocio.onRendered(function(){
	//agregarPlanes(Session.get("socio").planesEmpresa);
})
Template.nuevaActividadSocio.events({
  'click #tieneImporteEspecial': function(ev) {
    if($("#tieneImporteEspecial").prop("checked")) $("#conte_importeEspecial").show();
		else $("#conte_importeEspecial").hide();
  },
	'click #estaBaja': function(ev) {
    if($("#estaBaja").prop("checked")) $("#conte_fechaBaja").show();
		else $("#conte_fechaBaja").hide();
  },
	'click #tieneVto': function(ev) {
    if($("#tieneVto").prop("checked")) $("#conte_vto").show();
		else $("#conte_vto").hide();
  },
	
    
});
Template.modificaActividadSocio.events({
  'click #tieneImporteEspecial': function(ev) {
    if($("#tieneImporteEspecial").prop("checked")) $("#conte_importeEspecial").show();
		else $("#conte_importeEspecial").hide();
  },
	'click #estaBaja': function(ev) {
    if($("#estaBaja").prop("checked")) $("#conte_fechaBaja").show();
		else $("#conte_fechaBaja").hide();
  },
	'click #tieneVto': function(ev) {
    if($("#tieneVto").prop("checked")) $("#conte_vto").show();
		else $("#conte_vto").hide();
  },
	
	
    
});
var buscarIndice=function(busca)
{
	var arr=Session.get("socio").actividades;
	for (var i = 0; i < arr.length; i++)
		if(arr[i]._id==busca)return i;
	return -1;
}
var agregarPlanes=function(items)
{
	 $("#idPlanEmpresa").select2("destroy");
	 console.log(items)
	 $("#idPlanEmpresa").append("<option value=''>Ninguno...</option>");
     for(var i=0;i<items.length;i++){
     	console.log(items[i])
     	var pe=PlanesEmpresa.findOne({_id:items[i].idPlanEmpresa});
     	var fe=moment(items[i].fechaInicio).format("DD-MM-YYYY");
     	var lab=pe.nombrePlanEmpresa+" fecha inicio "+fe;
     	if(!items[i].estaInactiva) $("#idPlanEmpresa").append("<option value='"+items[i]._id+"'>"+lab+"</option>");
     }
     $('#idPlanEmpresa').trigger('change');
		
}
Template.modificaActividadSocio.onRendered(function(){
	//agregarPlanes(Session.get("socio").planesEmpresa);

})
Template.modificaActividadSocio.helpers({
	"docu":function(){
		return Session.get("socio");
	},
	"mostrarImporteEspecial":function()
	{
		console.log(this)
		return this.tieneImporteEspecial?"":"none"
	},
	"mostrarFechaBaja":function()
	{
		return this.estaBaja?"":"none"
	},
	"mostrarVto":function()
	{
		return this.tieneVto?"":"none"
	},
	"etiquetaFecha":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'actividades.'+ind+'.fechaInicio';
	},
	"eti_idPlanEmpresa":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'actividades.'+ind+'.idPlanEmpresa';
	},
	"eti_tieneVto":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'actividades.'+ind+'.tieneVto';
	},
	"eti_fechaVto":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'actividades.'+ind+'.fechaVto';
	},
	"etiquetaNroChequera":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'actividades.'+ind+'.nroChequera';
	},
	"eti_tieneImporteEspecial":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'actividades.'+ind+'.tieneImporteEspecial';
	},
	"eti_importeEspecial":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'actividades.'+ind+'.importeEspecial';
	},
	"eti_estaBaja":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'actividades.'+ind+'.estaBaja';
	},
	"eti_fechaBaja":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'actividades.'+ind+'.fechaBaja';
	},
	"etiquetaIdActividad":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'actividades.'+ind+'.idActividad';
	},
	"eti_idProfesor":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'actividades.'+ind+'.idProfesor';
	},
	"etiquetaDetalle":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'actividades.'+ind+'.detalle';
	}
});

Template.actividadesSocio.helpers({
	'esAdmin': function(){
     if(!Meteor.user())return false;
     if(Meteor.user().profile==="admin")return true;
       return false;
     },
	"tieneActividadesParaAplicar":function()
	{
		var aux=this.cambiosEstado;
		for(var i=0;i<aux.length;i++)
			if(!aux[i].planEmpresaAplicado&&aux[i].tienePlanEmpresa&&aux[i].estado=="ALTA")return true;
		return false;
	},
	"planesParaAplicar":function()
	{
		var aux=this.cambiosEstado;
		var planes=[];
		for(var i=0;i<aux.length;i++)
			if(!aux[i].planEmpresaAplicado&&aux[i].tienePlanEmpresa&&aux[i].estado=="ALTA")planes.push(aux[i])
		return planes;
	},
	"tienePlanEmpresa":function()
	{
		return Session.get("socio").planEmpresa;
	},
	"planEmpresa":function()
	{
		var plan= PlanesEmpresa.findOne({_id:Session.get("socio").planEmpresa});
		if(plan)return plan.nombrePlanEmpresa;
		return "";
	},
	'settings': function(){
        return {
 collection: this.actividades,
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: false,
					
						rowClass: function(item) {
							var fechaActual=new Date();
  var fecha = item.estaBaja;
  if(fecha)return "deshabilitado";
	if(item.tieneVto && item.fechaVto<fechaActual)return "deshabilitado"
},
 fields: [
	 	{
					key: 'fechaInicio',
					label: 'Fecha',
					headerClass: 'col-md-2',
					sortOrder: 0, sortDirection: 'descending' ,hidden: true
				}, 
      {
        key: 'fechaInicio',
        label: 'Fecha',
				headerClass: 'col-md-2',
        fn: function (value, object, key) {
          var d=new Date(value);
           return d.getFecha();
         }
      },
   {
        key: 'idActividad',
        label: 'Actividad',
		  //  headerClass: 'col-md-1',
        fn: function (value, object, key) {
           var act=Actividades.findOne({_id:value});
		return act.nombreActividad;
         },
      },
   {
        key: 'idActividad',
        label: '$ Importe',
        headerClass: 'col-md-2',
		  fn: function (value, object, key) {
           var act=Actividades.findOne({_id:value});
				var fechaActual=new Date();
				console.log(object)
				var color=(object.estaBaja)?"#ccc":"blue";
				if(object.tieneImporteEspecial)return  new Spacebars.SafeString("<span style='color:"+color+"'>"+object.importeEspecial.formatMoney(2)+" <small>($ esp.)</small></span>")
						return act.importe.toFixed(2);
         },
      },
    
    {
        label: '',
        headerClass: 'col-md-3',
        tmpl:Template.accionesActividadesSocios
      }
 ]
 };
    },
	"items":function(){
		var acts=new Meteor.Collection(this.actividades);
		return this.actividades;
	},
	
	'mouseover tr': function(ev) {
    $("#tablaActividadesSocio").find(".acciones").hide();
   $("#tablaActividadesSocio").find(".acciones").show();
    
  },
	
});