var consultarSocios=function(idActividad)
{
  var soloActivos=$("#soloActivos").is(":checked");

   UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("getSociosActividad",idActividad,soloActivos,function(err,res){
    UIBlock.unblock();
    Session.set("sociosActividad",ripData(res) );
  })
}

var ripData=function(data)
{
  var sal=[];
  for(var i=0;i<data.length;i++){
    var aux=data[i];
    aux._id=i+"_server";
    sal.push(aux);
  }
  console.log(sal)
  return sal;
}
var crearExp = function(searchText) {
	// this is a dumb implementation
	var parts = searchText.trim().split(/[ \-\:]+/);
	return new RegExp("(" + parts.join('|') + ")", "ig");
}

// AutoForm.hooks({

//   'nuevoCierre_': {
//     before:{
//       insert: function(doc) {
//         doc.items=Session.get("itemsCaja");
//         return doc;
//       },
//     },
//     onSuccess: function(operation, result, template) {
//       UIBlock.unblock();
      
//       Modal.hide();
//       swal("GENIAL!", "Se ha ingresado el registro!", "success");
//       Router.go('/cierreCajas');

//     },
//     onError: function(operation, error, template) {
// UIBlock.unblock();
//       swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


//     }
//   }
// });
Template.socioAuto.helpers({
  "tipo":function(){
    return getTipoSocio(this.fechaNacimiento,this.esActivo)
  },
  "socio":function(){
    return this.apellido.toUpperCase()+", "+this.nombre;
  },
  "nroSocio":function(){
    return this.nroSocio
  },
})
var salida=function(id){
  Meteor.call("cambiarImportesSocios",id,function(){
    
  })
}
Template.actividades.helpers({
  "ejecutaModifica":function(){
    return salida
  },
"acciones":function()
{

},

"columnas":function(){
  return [
      {
        key: 'nombreActividad',
        label: 'Nombre de la Actividad',
      },
   {
        key: 'importe',
        label: 'Importe',
      fn: function (value, object, key) {
           return "$ "+value.toFixed(2);
         },
        headerClass: 'col-md-2',
      },

   {
        key: 'periodicidad',
        label: 'Cada cuanto se cobra?',
      fn: function (value, object, key) {
           if(value==30)return "Mensual";
        if(value==15)return "Quincenal";
        if(value==7)return "Semanal";
        return "Diario";
         },
        headerClass: 'col-md-3',
      },

 ]
},
});
Template.actividades.rendered=function(){
  Meteor.subscribe('Actividades');

}
Template.sociosActividad.onRendered(function(){
  Meteor.typeahead.inject();
 consultarSocios(this.data._id);
  
})


Template.sociosActividad.helpers({
   "buscadorSocios" : function(query, sync, callback) {
      Meteor.call('buscadorSocios', query, {}, function(err, res) {
        callback(res.map(function(v){ return v; }));
      });
    },
    "socioSeleccion": function(event, suggestion, datasetName) {
   Session.set("socioSeleccion",suggestion);
   
   $("#buscaSocio").attr("placeholder",suggestion.apellido+" "+suggestion.nombre);
  },
  "actividad":function(){
    return this.nombreActividad.toUpperCase();
  },
  "socios":function(){
    return Session.get("sociosActividad");
  },
  "cantidadSocios":function()
  {
    return Session.get("sociosActividad").length;
  },
	'settings': function(){
        return {
 collection: Session.get("sociosActividad"),
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
       var res= new Spacebars.SafeString("<span class='"+clase+"'>"+object.tipoSocio+"</span>");
      return res;
         },
      },
       {
        key: 'estadoActividad',
        label: 'Estado Actividad',
      fn: function (value, object, key) {
         var estado=object.estaBaja?"BAJA":"ACTIVO";
       var res= new Spacebars.SafeString("<span'>"+estado+"</span>");
      return res;
         },
      },
    {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesSociosActividades
      }
 ]
 };
    },
  "settingsSocios": function() {
     //Meteor.subscribe('Socios');
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
Template.cadaSocio.helpers({
  "socio":function(){
    console.log(this)
    return new Spacebars.SafeString("<b>"+this.apellido.toUpperCase()+"</b>, "+this.nombre);
  },
  "fecha":function(){
   var d=new Date(this.created);
    return d.toLocaleDateString()
  },
  "tipo":function(){
    var clase=getClaseTipoSocio(this.fechaNacimientos,this.esActivo,this.estado);
    var tipo=getTipoSocio(this.fechaNacimientos,this.esActivo);
    return  new Spacebars.SafeString("<span class='"+clase+"'>"+tipo+"</span>");
  }
})
Template.accionesSociosActividades.events({
	  "click .delete":function(){
      var id=this.idSocio;
      console.log(this)
         swal({   title: "Estas Seguro de sacalo de la actividad?",   text: "",   type: "success",   showCancelButton: true,   confirmButtonColor: "#4cae4c",   confirmButtonText: "Si, QUITARLO!",   closeOnConfirm: true },
               function(){
             UIBlock.block('Consultando datos, aguarde un momento...');
    Meteor.call("quitarSocioActividad", Session.get("idActividadSeleccion"),id,true,function(err,res){
        UIBlock.unblock();
      consultarSocios(Session.get("idActividadSeleccion"))
    })
         })
   
    },
    "click .activar":function(){
      var id=this.idSocio;
      console.log(this)
         swal({   title: "Estas Seguro de activar la actividad?",   text: "",   type: "success",   showCancelButton: true,   confirmButtonColor: "#4cae4c",   confirmButtonText: "Si, ACTIVAR!",   closeOnConfirm: true },
               function(){
             UIBlock.block('Consultando datos, aguarde un momento...');
    Meteor.call("quitarSocioActividad", Session.get("idActividadSeleccion"),id,false,function(err,res){
        UIBlock.unblock();
      consultarSocios(Session.get("idActividadSeleccion"))
    })
         })
   
    }
	
})
var agregarSocio=function(doc)
{
	 var act=doc;
   console.log(act)
    var socio=doc.apellido.toUpperCase()+", "+doc.nombre;
	$("#agregarSocio").val(socio);
    	 swal({   title: "Estas Seguro de ingresar a "+ socio+" a esta actividad?",   text: "",   type: "success",   showCancelButton: true,   confirmButtonColor: "#4cae4c",   confirmButtonText: "Si, AGREGAR!",   closeOnConfirm: true },
               function(){
             UIBlock.block('IngresandoSocio...');
            Meteor.call('agregarActividadSocio',act._id,Session.get("idActividadSeleccion"),function(err,res){
					UIBlock.unblock();
							$("#agregarSocio").val("");
              consultarSocios(Session.get("idActividadSeleccion"))
          });
          });	
}
Template.sociosActividad.events({
"change #soloActivos":function()
  {
    consultarSocios(Session.get("idActividadSeleccion"))
  },

    "click #imprimir":function(){
    import "/public/importar/printThis.js";
      console.log(this)
    $("#printable").printThis({importCss:true,header:getHeader("SOCIOS POR ACTIVIDAD "+this.nombreActividad.toUpperCase()," listado actual")})
  },
	 "click .agregarSocio":function(){
     agregarSocio(Session.get("socioSeleccion"))
  },
})
Template.actividades.events({

   'click .verSocios': function(ev) {
     var act=this;
     Session.set("idActividadSeleccion",this._id);
    Modal.show('sociosActividad',function(){ return act; });
  },
});
