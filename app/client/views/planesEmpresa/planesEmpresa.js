var crearExp = function(searchText) {
	// this is a dumb implementation
	var parts = searchText.trim().split(/[ \-\:]+/);
	return new RegExp("(" + parts.join('|') + ")", "ig");
}
Template.sociosPlanesEmpresa.helpers({
  "planEmpresa":function(){
    return this.nombrePlanEmpresa.toUpperCase();
  },
	"fechaInicioDef":function(){
    var d=new Date();
		return d.getFecha()
  },
  "socios":function(){
    return Session.get("sociosGrupos");
  },
	'settings': function(){
        return {
 collection: Session.get("sociosPlanesEmpresa"),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: true,
rowClass(  data ) {
    if(data.estado=="BAJA"){
      return "deshabilitado"
    }
     if(data.estado=="SUSPENDIDO"){
      return "suspendido";
    }
  },
 fields: [

   {
        key: 'nroSocio',
        label: 'Nro Socio',
      },
	  {
        key: 'socio',
        label: 'Socio',
			 fn: function (value, row, key) {
             var nombre=row.nombre.substr(0, 1).toUpperCase() + row.nombre.substr(1);
         var color=(row.estado=="BAJA")?"#ccc":"#337ab7";
      var clase=row.estado=="BAJA"?"deshabilitado":"";
      if(row.estado=="SUSPENDIDO")clase="suspendido";
      if(row.estado=="SUSPENDIDO")color="orange";
         return new Spacebars.SafeString("<span id='"+row._id+"' class='nombreSocio "+clase+"' style='cursor:pointer;'> <b>"+row.apellido.toUpperCase()+"</b>, "+nombre+"</a>");
         
         },
      },
	 {
        key: 'tipo',
        label: 'Tipo Socio',
		  fn: function (value, object, key) {
           var clase=getClaseTipoSocio(object.fechaNacimiento,object.esActivo,object.estado);
        if(object.estado=="SUSPENDIDO"){
       clase="suspendido"
    }
       var res= new Spacebars.SafeString("<span class='"+clase+"'>"+getTipoSocio(object.fechaNacimiento,object.esActivo)+"</span>");
      return res;
         },
      },
	 {
        key: 'fechaVto',
        label: 'Vto Plan',
		  fn: function (value, object, key) {
				if(value) return value.getFecha();
				return '-'
			}
      },
    {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesSociosPlanesEmpresa
      }
 ]
 };
    },
  "settingsSocios": function() {
     Meteor.subscribe('Socios');
    	return {
			position: "bottom",
			limit: 25,
			rules: [{
				token: '',
				collection: Socios,
				field: "nroSocio",
				matchAll: false,
				selector: function(match) {
					var exp = crearExp(match);
					console.log(exp);
					return {
						'$or': [{
							'nroSocio': exp
						}, {
							'apellido': exp
						}]
					};
				},
				template: Template.socioAuto
			}, ]
		};
  }
})
Template.accionesSociosPlanesEmpresa.events({
	"click .delete":function()
	{
		var doc=this;
		console.log(doc)
		 swal({   title: "Estas Seguro de quitar al SOCIO de este plan?",   text: "",   type: "success",   showCancelButton: true,   confirmButtonColor: "#4cae4c",   confirmButtonText: "Si, QUITAR!",   closeOnConfirm: true },
               function(){
             UIBlock.block('Sacando al Socio...');
            Meteor.call('quitarPlanEmpresaSocio',Session.get("idPlanEmpresaSeleccion"),doc._id,function(err,res){
					UIBlock.unblock();
							$("#agregarSocio").val("");
              consultarSociosPlanEmpresa(Session.get("idPlanEmpresaSeleccion"))
          });
          });
	}
})
Template.sociosPlanesEmpresa.events({

  "autocompleteselect input": function(event, template, doc) {
		Session.set("socioPlanEmpresa",doc);
    var socio=doc.apellido.toUpperCase()+", "+doc.nombre;
	$("#agregarSocio").val(socio);
    	
  },
	"click #agregar":function()
	{
		var doc=Session.get("socioPlanEmpresa");
	var socio=doc.apellido.toUpperCase()+", "+doc.nombre;
			 swal({   title: "Estas Seguro de ingresar a "+ socio+" a este plan?",   text: "",   type: "success",   showCancelButton: true,   confirmButtonColor: "#4cae4c",   confirmButtonText: "Si, AGREGAR!",   closeOnConfirm: true },
               function(){
             UIBlock.block('Ingresando Socio...');
            Meteor.call('agregarPlanEmpresaSocio',Session.get("idPlanEmpresaSeleccion"),doc._id,$("#fechaInicio").val(),$("#fechaFin").val(),function(err,res){
					UIBlock.unblock();
							if(res){
								swal("Ups..","Ya esta agregado a este plan el socio!!","error");return;
							}
							$("#agregarSocio").val("");
              consultarSociosPlanEmpresa(Session.get("idPlanEmpresaSeleccion"))
          });
          });
	}

})
Template.accionesSociosGrupo.events({
	  "click .delete":function(){
			var id=this._id;
				 swal({   title: "Estas Seguro de sacalo del plan?",   text: "",   type: "success",   showCancelButton: true,   confirmButtonColor: "#4cae4c",   confirmButtonText: "Si, QUITARLO!",   closeOnConfirm: true },
               function(){
					   UIBlock.block('Consultando datos, aguarde un momento...');
    Meteor.call("quitarSocioPlanEmpresa", Session.get("idPlanEmpresaSeleccion"),id,function(err,res){
      	UIBlock.unblock();
      consultarSociosGrupo(Session.get("idPlanEmpresaSeleccion"))
    })
				 })
   
		}
	
})

AutoForm.hooks({
'modificarPlanEmpresa_': {

		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha modificado el registro!", "success");
			Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},


	'nuevoPlanEmpresa_': {
before:{
      insert: function(doc) {
       // doc.estado="ALTA";
        return doc;
        }
    },
	
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha ingresado el registro!", "success");
			Modal.hide();

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
	
});
Template.planesEmpresa.helpers({
    'settings': function(){
        return {
 collection: PlanesEmpresa.find(),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: true,
 fields: [
      {
        key: 'nombrePlanEmpresa',
        label: 'Nombre del Plan',
        headerClass: 'col-md-2',
      },
     {
        key: 'importe',
        label: 'ACTIVIDADES',
      fn: function (value, object, key) {
        var sum=0;
        var acts="";
          for (var i = 0;i<object.actividades.length; i++){
            var act=Actividades.findOne({_id:object.actividades[i].idActividad}).nombreActividad;
            acts+=act+": $ "+String(object.actividades[i].importe)+", ";
            sum+=Number(object.actividades[i].importe);
          }
        return acts
         },
        
      },
   {
        key: 'importe',
        label: 'Importe TOTAL',
      fn: function (value, object, key) {
        var sum=0;
          for (var i = 0;i<object.actividades.length; i++)
            sum+=Number(object.actividades[i].importe);
        return sum.formatMoney(2)
         },
        headerClass: 'col-md-2',
      },
   
    {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesPlanesEmpresa
      }
 ]
 };
    }
});
Template.actividades.rendered=function(){
 
  
}

Template.planesEmpresa.events({
  'click #btnAgregar': function(){
    var val=this;
        Modal.show('nuevoPlanEmpresa',function(){
			return val._id;
			
		});
    },
 
  'mouseover tr': function(ev) {
    $("#tablaPlanesEmpresa").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ PlanesEmpresa.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },

  'click .update': function(ev) {
   var val=this;
        Modal.show('modificarPlanEmpresa',function(){
			return val;
			
		});
  },
});
