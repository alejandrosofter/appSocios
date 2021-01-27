AutoForm.hooks({
'modificaDocumentoSocio_': {

		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha modificado el registro del socio!", "success");
			console.log(this);
			Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},


	'nuevoDocumentoSocio_': {
before:{
      insert: function(doc) {
       // doc.estado="ALTA";
        return doc;
        }
    },
	
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha ingresado el registro al socio!", "success");
			console.log(this);
			Modal.hide();

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
	
});

Template.documentosSocio.events({
	'click .quitar': function(ev) {
   
    var id=Session.get('socio')._id;
		var res=this._id+"";
		 console.log("quitando:"+res);
		swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: true }, 
				 function(){ 
		 Meteor.call("quitarItemGenerico","Socios",id,"documentacion",res,function(err,res){
        if(!err)swal("Quitado!", "El registro ha sido borrado", "success");
        else swal("Ops...", "Ha ocurrido un error para quitar! .. por favor chekear nuevamente", "error");
      });
			
		});
  
  },
  "click .verImagen":function(){
  	var imagen=this.imagen;
  	Modal.show("imagenDocumento",function(dat){
  		return imagen;
  	})
  },

	
	'click .update': function(ev) {
    var val=this;
    Modal.show('modificaDocumentoSocio',function(){
			return val;
			
		});
  },
	
});
Template.documentosSocio.events({
  'click #agregarDocumentoSocio': function(ev) {
    var act=this;
    Modal.show('nuevoDocumentoSocio',function(){ return act; });
  },

	
    
});
Template.nuevoDocumentoSocio.onRendered(function(){
	//agregarPlanes(Session.get("socio").planesEmpresa);
})
Template.nuevoDocumentoSocio.events({
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
Template.modificaDocumentoSocio.events({
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
	var arr=Session.get("socio").documentacion;
	for (var i = 0; i < arr.length; i++)
		if(arr[i]._id==busca)return i;
	return -1;
}
Template.modificaDocumentoSocio.onRendered(function(){
	//agregarPlanes(Session.get("socio").planesEmpresa);

})
Template.modificaDocumentoSocio.helpers({
	"docu":function(){
		return Session.get("socio");
	},
	
	"eti_fechaSubida":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'documentacion.'+ind+'.fechaSubida';
	},
	"eti_fechaVto":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'documentacion.'+ind+'.fechaVto';
	},
	"eti_tipo":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'documentacion.'+ind+'.tipo';
	},
	
});

Template.documentosSocio.helpers({
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
 collection: this.documentacion,
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: false,
					
						rowClass: function(item) {
							//return "deshabilitado"
},
 fields: [
	 	{
					key: 'fecha',
					label: 'Fecha',
					headerClass: 'col-md-2',
					sortOrder: 0, sortDirection: 'descending' ,hidden: true
				}, 
		      {
		        key: 'fechaSubida',
		        label: 'Fecha',
						headerClass: 'col-md-2',
		        fn: function (value, object, key) {
		          var d=new Date(value);
		           return moment(value).format("D/M/YYYY")
		         }
		      },
   {
        key: 'tipo',
        label: 'Tipo',
		  //  headerClass: 'col-md-1',
        fn: function (value, object, key) {
           
		return value
         },
      },
       {
        key: 'fechaVto',
        label: 'Fecha Vto.',
		  //  headerClass: 'col-md-1',
        fn: function (value, object, key) {
           
		return moment(value).format("D/M/YYYY")
         },
      },
   
    
    {
        label: '',
        headerClass: 'col-md-3',
        tmpl:Template.accionesDocumentosSocios
      }
 ]
 };
    },
	"items":function(){
		var acts=new Meteor.Collection(this.actividades);
		return this.actividades;
	},
	
	'mouseover tr': function(ev) {
    $("#tabla").find(".acciones").hide();
   $("#tabla").find(".acciones").show();
    
  },
	
});