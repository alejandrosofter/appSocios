/*eslint-disable no-unused-vars, no-unused-params, no-undef-expression, no-undef*/
AutoForm.hooks({
'modificaPlanEmpresaSocio_': {

		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha modificado la PlanEmpresa del socio!", "success");
			console.log(this);
			Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},


	'nuevaPlanEmpresaSocio_': {
before:{
      insert: function(doc) {
       // doc.estado="ALTA";
        return doc;
        }
    },
	
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha ingresado la PlanEmpresa al socio!", "success");
			console.log(this);
			Modal.hide();

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
	
});
Template.accionesPlanEmpresaSocios.helpers({
  "estaAplicado":function()
  {
      return !this.estaAplicado
  }
})
Template.accionesPlanEmpresaSocios.events({
	'click .quitar': function(ev) {
    console.log(this);
    var id=Session.get('socio')._id;
		var res=this._id+"";
		
		swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, 
				 function(){ 
		 Meteor.call("quitarPlanEmpresa",id,res,function(err,res){
        if(!err)swal("Quitado!", "El registro ha sido borrado", "success");
        else swal("Ops...", "Ha ocurrido un error para quitar! .. por favor chekear nuevamente", "error");
      });
			
		});
  
  },
	 'click .aplicarPlan': function(ev) {
    var val=this;
		 var plan=this.planEmpresa;
				var socio=Session.get("socio")._id;
				var fecha=this.fechaInicio;
		 	swal({   title: "Deseas aplicar las actividades al socio?",   text: "Una vez aplicado se generan las actividades con los precios correspondientes..",   type: "warning",   showCancelButton: true,   confirmButtonColor: "green",   confirmButtonText: "Si, INGRESA ACTIVIDADES!",   closeOnConfirm: true }, 
						 function(){ 
				UIBlock.block('Aplicando PLAN...');
				
				Meteor.call("ingresarActividadesPlanSocio",val.idPlanEmpresa, Session.get("socio")._id,fecha, val._id,val.estaInactiva, val.fechafechaFinaliza,function(err,res){
					UIBlock.unblock();
				}) });
  },
	 'click .delete': function(ev) {
	     UIBlock.block('Quiando plan ...');
    Meteor.call("quitarPlanEmpresa",this._id,function(err,res){
        UIBlock.unblock();
       swal({   title: "Bien!",text:"El plan se ha eliminado!"})
    })
  },
	'click .update': function(ev) {
    var val=this;
    Modal.show('modificaPlanEmpresaSocio',function(){
			return val;
			
		});
  },
  'click .imprimir': function(ev) {
   var val={socio:Session.get("socio"),alta:this};
    Modal.show('impresionPlanEmpresa',function(){
			return val;
			
		});
  },

	
});
Template.impresionPlanEmpresa.events({
  'click #btnPrint': function(ev) {
    window.print()
  },
	
	
    
});
Template.planesEmpresaSocio.events({
  'click #agregarPlanEmpresaSocio': function(ev) {
    var act=this;
    Modal.show('nuevaPlanEmpresaSocio',function(){ return act; });
  },
	
	
    
});
Template.impresionPlanEmpresa.helpers({
    "fechaAlta":function(){
		console.log(this);
		 var d=new Date(this.alta.fechaInicio);
		return d.getFecha();
	},
	"nombreSocio":function(){
		return (this.socio.apellido+" ",this.socio.nombre).toUpperCase();
	},
	"empresa":function(){
	   var grupo=Grupos.findOne({_id:this.socio.idGrupo});
	   console.log(grupo)
	   if(grupo) return grupo.nombre
	   return "-"

	},
	"nombrePlanEmpresa":function(){
		return PlanesEmpresa.findOne({_id:this.alta.idPlanEmpresa}).nombrePlanEmpresa;
	},
	"contratoPlanEmpresa":function(){
		return PlanesEmpresa.findOne({_id:this.alta.idPlanEmpresa}).detalleContrato;
	},
	"tieneVto":function(){
		return this.alta.estaInactiva;
	},
	"fechaVtoPlan":function(){
	  return this.alta.fechaFinaliza  
	},
	"mes":function(){
		console.log(this);
	
		var d=new Date(this.alta.fechaInicio);
		return mesLetras(d.getMes());
	},
	"ano":function(){
		console.log(this);
		 var d=new Date(this.alta.fechaInicio);
		return d.getAno();
	},
	"dia":function(){
		console.log(this);
		 var d=new Date(this.alta.fechaInicio);
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
})
Template.nuevaPlanEmpresaSocio.events({
  
	'click #estaInactiva': function(ev) {
    if($("#estaInactiva").prop("checked")) $("#conte_vto").show();
		else $("#conte_vto").hide();
  },
	
    
});
Template.modificaPlanEmpresaSocio.events({
  'click #estaInactiva': function(ev) {
    if($("#estaInactiva").prop("checked")) $("#conte_vto").show();
		else $("#conte_vto").hide();
  },
	
	
    
});
Template.modificaPlanEmpresaSocio.rendered=function(){
     if($("#estaInactiva").prop("checked")) $("#conte_vto").show();
		else $("#conte_vto").hide();
}
	

var buscarIndice=function(busca)
{
	var arr=Session.get("socio").planesEmpresa;
	for (var i = 0; i < arr.length; i++)
		if(arr[i]._id==busca)return i;
	return -1;
}

Template.modificaPlanEmpresaSocio.helpers({
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
	
	"eti_fechaFinaliza":function(){
		var idSeleccion=this._id;
		console.log("fecha?"+ind)
		var ind=buscarIndice(idSeleccion);
	return 'planesEmpresa.'+ind+'.fechaFinaliza';
	},
	"eti_idPlanEmpresa":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'planesEmpresa.'+ind+'.idPlanEmpresa';
	},
	"eti_estaInactiva":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'planesEmpresa.'+ind+'.estaInactiva';
	},
	"eti_fechaInicio":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'planesEmpresa.'+ind+'.fechaInicio';
	},
	
	
});

Template.planesEmpresaSocio.helpers({
	'esAdmin': function(){
     if(!Meteor.user())return false;
     if(Meteor.user().profile==="admin")return true;
       return false;
     },
	"tienePlanEmpresaesParaAplicar":function()
	{
		var aux=this.cambiosEstado;
		console.log(this)
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
 collection: this.planesEmpresa,
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: false,
					
						rowClass: function(item) {
							var fechaActual=new Date();
  var fecha = item.estaInactiva;
  if(item.estaInactiva)return "deshabilitado";
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
           return d.getFecha2();
         }
      },
   {
        key: 'idPlanEmpresa',
        label: 'PlanEmpresa',
		  //  headerClass: 'col-md-1',
        fn: function (value, object, key) {
           var act=PlanesEmpresa.findOne({_id:value});
		return act.nombrePlanEmpresa;
         },
      },

    
    {
        label: '',
        headerClass: 'col-md-4',
        tmpl:Template.accionesPlanEmpresaSocios
      }
 ]
 };
    },
	"items":function(){
		var acts=new Meteor.Collection(this.PlanEmpresaes);
		return this.PlanEmpresaes;
	},
	
	'mouseover tr': function(ev) {
    $("#tablaPlanEmpresaesSocio").find(".acciones").hide();
   $("#tablaPlanEmpresaesSocio").find(".acciones").show();
    
  },
	
});