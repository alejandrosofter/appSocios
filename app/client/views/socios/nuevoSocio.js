/*eslint-disable no-undef, semi*/
var crearExp = function(searchText) {
	// this is a dumb implementation
	var parts = searchText.trim().split(/[ \-\:]+/);
	return new RegExp("(" + parts.join('|') + ")", "ig");
}
// var postSubmitHook = {

//     onSubmit: function(insertDoc){
//         Meteor.call('ingresarSocio', insertDoc, function(error, result) {

           
//             Router.go('socios');
//         });
//         return ;
//     }
// };

// AutoForm.addHooks('nuevoSocio_', postSubmitHook);
Template.nuevoSocio.helpers({

  	"settingsGrupo": function() {

		return {
			position: "bottom",
			limit: 5,
			rules: [{
				matchAll: true,
				collection: Grupos,
				field: "nombre",
				template: Template.tmpGrupo
			}, ]
		};
	},
  "settingsSocio": function() {

		return {
			position: "bottom",
			limit: 5,
			rules: [{
				matchAll: true,
				collection: Socios,
				field: "nombre",
        selector: function(match) {
					var exp = crearExp(match);
					
					return {
						'$or': [{
							'apellido': exp
						}, {
							'dni': exp
						}]
					};
				},
				template: Template.tmpSocio
			}, ]
		};
	},
  opcionesSocios: function () {
    return Socios.find().map(function (c) {
      var nombreSocio=c.apellido+" "+c.nombre;
      return {label: nombreSocio, value: c._id};
    });
  },
  opcionesGrupos: function () {
    return Grupos.find().map(function (c) {
      return {label: c.nombre, value: c._id};
    });
  }
});
var calculaTipoSocio=function()
{
	if($("#fechaNacimiento").val()!==""){
		
		var tipo=getTipoSocio($("#fechaNacimiento").val(),$("#esActivo:checked").val());
		var anos=getEdadSocio($("#fechaNacimiento").val());
		var clase=getClaseTipoSocio($("#fechaNacimiento").val());
		$("#tipoSocio").html(tipo);
		$("#tipoSocio").attr("class",clase);
		$("#edad").html("EDAD: "+anos+" Años");
	}else{
			$("#edad").html("");
		$("#tipoSocio").html("");
	}
     
}
function buscarNroSocio(){
	var ts=  $('input:radio[name=tipoSocio]:checked').val();
      Meteor.call("ultimoSocioCargado",ts,function(err,res){
		$("#nroSocio").val(res);
	});
}
Template.nuevoSocio.events({
  
   'click #btnAcepta': function(){
       UIBlock.block('Agregando Socio...');
    },
   'change #fechaNacimiento': function(){
      calculaTipoSocio();
     
     
    },
    'change #tipoSocio': function(){
    	buscarNroSocio();
    },
  'change #esActivo': function(){
     calculaTipoSocio();
  },
  'click #tieneSocioPadre': function(){
       if($("#tieneSocioPadre:checked").val())$("#controlSocioPadre").show("slow");else $("#controlSocioPadre").hide("slow");
    },
  'click #debitaCbu': function(){
       if($("#debitaCbu:checked").val())$("#controlCbu").show("slow");else $("#controlCbu").hide("slow");
    },
  'click #tieneGrupo': function(){
       if($("#tieneGrupo:checked").val())$("#controlGrupo").show("slow");else $("#controlGrupo").hide("slow");
    }
});
Template.modificarSocio.events({

   'change #fechaNacimiento': function(){
      calculaTipoSocio();
     
     
    },
    'change #tipoSocio': function(){
    	buscarNroSocio();
    },
  'change #esActivo': function(){
     calculaTipoSocio();
  },
  'click #tieneSocioPadre': function(){
       if($("#tieneSocioPadre:checked").val())$("#controlSocioPadre").show("slow");else $("#controlSocioPadre").hide("slow");
    },
  'click #debitaCbu': function(){
       if($("#debitaCbu:checked").val())$("#controlCbu").show("slow");else $("#controlCbu").hide("slow");
    },
  'click #tieneGrupo': function(){
       if($("#tieneGrupo:checked").val())$("#controlGrupo").show("slow");else $("#controlGrupo").hide("slow");
    }
});
Template.nuevoSocio.rendered = function() {
  calculaTipoSocio();
	
	$('input:radio[name=tipoSocio]').filter('[value=PERSONAL]').prop('checked', true);
	buscarNroSocio();
   if($("#tieneGrupo:checked").val())$("#controlGrupo").show();else $("#controlGrupo").hide();
   if($("#debitaCbu:checked").val())$("#controlCbu").show();else $("#controlCbu").hide();
  if($("#tieneSocioPadre:checked").val())$("#controlSocioPadre").show();else $("#controlSocioPadre").hide();
};
var getActividades=function(acts,fecha){
	var aux=[];
	if(acts)
	for(var i=0;i<acts.length;i++)
		aux.push({idActividad:acts[i],fechaInicio:fecha,detalle:"DESDE ALTA SOCIO",estaBaja:false})
	return aux;
}
AutoForm.hooks({

	'formSocio_': {
before:{
      insert: function(doc) {
      	var contenedor=this;
      	UIBlock.block('Cargando Socio, aguarde por favor...');
      	Meteor.call("existeSocio", doc.nroSocio,doc.tipoSocio,doc.dni, function (error, result) {

       			doc.promociones=[];
				 doc.deudas=[];
				 doc.actividades=getActividades(doc.actividad,new Date());
				 doc.pagos=[];
				doc.ctaCte=[];
				doc.movimientosCuenta=[];
				doc.cambiosEstado=[{fecha:new Date(),estado:"ALTA",detalle:"POR ALTA INICIAL DE SOCIO",tienePlanEmpresa:doc.planEmpresa?true:false,planEmpresa:doc.planEmpresa}];
				doc.tarjetas=[];
				doc.estado="ALTA";
				var isFirefox = typeof InstallTrigger !== 'undefined';
				if(isFirefox){
					var auxFecha=$("#fechaNacimiento").val();
					var arrFecha=auxFecha.split("/");
					var dia=arrFecha[0]*1;
					var mes=arrFecha[1]*1;
					var ano=arrFecha[2]*1;
					var strFecha=ano+"-"+mes+"-"+dia+"T00:00:00";
					var aux=new Date(strFecha);
					doc.fechaNacimiento=aux;
				}
		if(result){
			UIBlock.unblock();
			contenedor.result(false);

			swal({title: "Ops...", 	
				type:"error",
    text: result,
     html: true,
    confirmButtonText: "Aceptar", 
    allowOutsideClick: "true"})

		}
		else contenedor.result(doc)
      });
				
              }
    },
	
		onSuccess: function(operation, result, template) {
			Router.go('/fichaSocio/'+this.docId);
   //    console.log(this,template)
			// Meteor.call("ultimoIdSocioCargado",function(err,res){
			// 	UIBlock.unblock();
			// 	swal("GENIAL!", "Se ha ingresado el socio! Es importante ahora que le cargues la infromacion del debito automatico!...", "success");
			// Router.go('/fichaSocio/'+res);
			// })
			

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			console.log(operation);console.log(error);console.log(template);
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
	'modificarSocio_': {

		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha modificado el socio!", "success");
			Modal.hide();

		},
		onError: function(operation, error, template) {
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	}
});