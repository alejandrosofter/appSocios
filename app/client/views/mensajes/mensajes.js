AutoForm.hooks({

	'nuevoMensaje_': {
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha ingresado el registro !", "success");
			Router.go('/mensajes');

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},'modificaMensaje_': {
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha modificado el registro !", "success");
			Router.go('/mensajes');

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	}
});
Template.mensajes.helpers({
    'settings': function(){
        return {
 collection: Mensajes.find(),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: true,
 fields: [
 {
        key: 'fecha',
		 sortOrder: 0, sortDirection: 'descending' ,hidden: true,
      },
      {
        key: 'fecha',
        label: 'Fecha',
        headerClass: 'col-md-1',
        fn: function (value, object, key) {
         if(value)  return value.getFecha2();
					 return "-"
         },
      },
   {
        key: 'titulo',
        label: 'Titulo',
         headerClass: 'col-md-3',
     
      },
      {
        key: 'mensaje',
        label: 'Detalle',
        fn: function (value, object, key) {
         return new Spacebars.SafeString(value)
         },
     
      },
      
      {
        key: 'estado',
        label: 'Estado',
     
        headerClass: 'col-md-1',  
      },
      {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesMensajes
      }


 ]
 };
    }
});

Template.nuevoMensaje.rendered = function() {
  Meteor.typeahead.inject();
  $('#socios').bind('typeahead:selected', function(obj, datum, name) {
  var nom=datum.apellido.toUpperCase()+","+datum.nombre.capitalize();
  console.log(nom)
   $("#socios").val(nom)
  })
};

Template.estadoMensajes.helpers({
    'settings': function(){
    console.log(this);
    var mens=this.mensajes;
        return {
 collection: mens,
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: true,
 fields: [
      {
        key: 'nombreSocio',
        label: 'Socio',
        headerClass: 'col-md-2',
      },
   {
        key: 'email',
        label: 'Email',
         headerClass: 'col-md-3',
     
      },
      


 ]
 };
    }
});

Template.accionesMensajes.helpers({
"paraAplicar":function(){

return this.estado=="PENDIENTE"
},
"enviado":function(){
return this.estado=="ENVIADO"
}
})
Template.modificarMensaje.events({
 'change #mensajeEspecifico': function(){
       if( $('#mensajeEspecifico').prop('checked') ) $("#muestraSocios").show();
       else $("#muestraSocios").hide();
    },
 
})

Template.nuevoMensaje.helpers({
 "settings": function() {
        return {
            position: "top",
            limit: 5,
            rules: [{
                collection: 'Socios',
                subscription: 'autocompleteSocios',
                field: "apellido",
                template: Template.socioAuto
            }]
        };
    }
});

Template.modificarMensaje.helpers({
 "settings": function() {
        return {
            position: "top",
            limit: 5,
            rules: [{
                collection: 'Socios',
                subscription: 'autocompleteSocios',
                field: "apellido",
                template: Template.socioAuto
            }]
        };
    },
 'muestraSocios': function(){
        if( $('#mensajeEspecifico').prop('checked') ) return true;
        return false
    },
 
})
Template.nuevoMensaje.events({
 'typeahead:selected': function(ev,itm){
       console.log(this.apellido)
       console.log(itm)
    },
    'change #mensajeEspecifico': function(){
       if( $('#mensajeEspecifico').prop('checked') ) $("#muestraSocios").show();
       else $("#muestraSocios").hide();
    },
 
})
Template.nuevoMensaje.helpers({
"selected": function(event, suggestion, datasetName) {
     console.log("suggestion");
    console.log(suggestion);
  },
 "buscarSocio" : function(query, sync, callback) {

      Meteor.call('buscarSocio', query, {}, function(err, res) {
       console.log(res)
       console.log(query)
        if (err) {
          console.log(err);
          return;
        }
        callback(res);
      });
    }
 
})
Template.mensajes.events({
  'click #btnAgregar': function(){
        Router.go('/nuevoMensaje');
    },
 

  'mouseover tr': function(ev) {
    $("#tablaMensajes").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ Mensajes.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
   'click .aplicar': function(ev) {
     var act=this;
     console.log(act)
     Session.set("idMensajeSeleccion",this._id);
    swal({   title: "Estas seguro de enviar los mensajes?",   text: "Una vez finalizado cambiara el estado del mensaje!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, enviar!",   closeOnConfirm: true }, 
    function(){ 
    Meteor.call("enviarMensajes",act._id,function(err,res){
    
    }) 
    
    });
  },
   'click .verMensajes': function(ev) {
     var act=this;
     Session.set("idMensajeSeleccion",this._id);
    Modal.show('estadoMensajes',function(){ return act; });
  },
  'click .update': function(ev) {
    Router.go('/modificarMensaje/'+this._id);
  },
});
