var crearExp = function(searchText) {
	// this is a dumb implementation
	var parts = searchText.trim().split(/[ \-\:]+/);
	return new RegExp("(" + parts.join('|') + ")", "ig");
}
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
Template.sociosGrupo.helpers({
  "grupo":function(){
		console.log(this)
    return this.nombre.toUpperCase();
  },
  "socios":function(){
    return Session.get("sociosGrupos");
  },
	'settings': function(){
        return {
 collection: Session.get("sociosGrupos"),
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
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesSociosGrupo
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
Template.sociosGrupo.events({

  "autocompleteselect input": function(event, template, doc) {
		
    var socio=doc.apellido.toUpperCase()+", "+doc.nombre;
	$("#agregarSocio").val(socio);
    	 swal({   title: "Estas Seguro de ingresar a "+ socio+" a este grupo?",   text: "",   type: "success",   showCancelButton: true,   confirmButtonColor: "#4cae4c",   confirmButtonText: "Si, AGREGAR!",   closeOnConfirm: true },
               function(){
             UIBlock.block('IngresandoSocio...');
            Meteor.call('agregarGrupoSocio',Session.get("idGrupoSeleccion"),doc._id,function(err,res){
					UIBlock.unblock();
							$("#agregarSocio").val("");
              consultarSociosGrupo(Session.get("idGrupoSeleccion"))
          });
          });	
  }})
Template.accionesSociosGrupo.events({
	  "click .delete":function(){
			var id=this._id;
				 swal({   title: "Estas Seguro de sacalo del grupo?",   text: "",   type: "success",   showCancelButton: true,   confirmButtonColor: "#4cae4c",   confirmButtonText: "Si, QUITARLO!",   closeOnConfirm: true },
               function(){
					   UIBlock.block('Consultando datos, aguarde un momento...');
    Meteor.call("quitarSocioGrupo", Session.get("idGrupoSeleccion"),id,function(err,res){
      	UIBlock.unblock();
      consultarSociosGrupo(Session.get("idGrupoSeleccion"))
    })
				 })
   
		}
	
})
Template.grupos.helpers({
    'settings': function(){
        return {
 collection: Grupos.find(),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: true,
 fields: [
      {
        key: 'nombre',
        label: 'Nombre del Grupo',
      },
	  {
        key: 'descuentoCuotaSocial_importe',
        label: '$ DESC. CUOTA.S',
      },
	 {
        key: 'descuentoCuotaSocial_porcentaje',
        label: '% DESC. CUOTA.S',
      },
	 {
        key: 'descuentoActividades_importe',
        label: '$ DESC. ACTS',
      },
	 {
        key: 'descuentoCuotaSocial_porcentaje',
        label: '% DESC. ACTS',
      },
	       {
        key: 'imagen',
        label: 'Imagen',
					 fn: function (value, object, key) {
           return new Spacebars.SafeString("<img src='"+value+"'></img>");
         },
      },
 
    {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesGrupos
      }
 ]
 };
    }
});
Template.grupos.rendered=function(){
  
  
}
Template.grupos.events({
	 "change .file-upload-input": function(event, template){
   var func = this;
   var file = event.currentTarget.files[0];
   console.log('ddd');
   var reader = new FileReader();
   reader.onload = function(fileLoadEvent) {
		 
   };
   reader.readAsBinaryString(file);
},
  'click #btnAgregar': function(){
        Router.go('/nuevoGrupo');
    },
 
  'mouseover tr': function(ev) {
    $("#tablaGrupos").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ Grupos.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
  'click .update': function(ev) {
    Router.go('/modificarGrupo/'+this._id);
  },
});

//--------------MODIFICAR
Template.modificarGrupo.events({
 "change .file-upload-input": function(event, template){
   var func = this;
   var file = event.currentTarget.files[0];
   console.log(file);
   var reader = new FileReader();
   reader.onload = function(fileLoadEvent) {
		 $("#imagen").val(reader.result);
   };
    if (file) {
    reader.readAsDataURL(file);
  }
},
   'click #btnAceptar': function(){
       UIBlock.block('Modificando...');
    }
});
AutoForm.hooks({

	'modificarGrupo_': {

	
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha modificado la actividad!", "success");
			Router.go('/grupos');

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	}
});
//----------------------NUEVO
Template.nuevoGrupo.events({
	 "change .file-upload-input": function(event, template){
   var func = this;
   var file = event.currentTarget.files[0];
   console.log('ddd');
   var reader = new FileReader();
   reader.onload = function(fileLoadEvent) {
		 
   };
   reader.readAsBinaryString(file);
},
  'click #btnAgregar': function(){
        Router.go('/nuevoGrupo');
    },
   'click #btnAceptar': function(){
       UIBlock.block('Agregando Grupo...');
    }
});
AutoForm.hooks({

	'nuevoGrupo_': {
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha ingresado el grupo!", "success");
			Router.go('/grupos');

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	}
});
