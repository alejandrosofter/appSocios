AutoForm.hooks({

	'nuevaPromocion_': {
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha ingresado la promocion!", "success");
			Router.go('/promociones');

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
  'modificarPromocion_': {
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha modificado la promocion!", "success");
			Router.go('/promociones');

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	}
});
Template.promociones.helpers({
  'settings': function() {
    return {
      collection: Promociones.find(),
      rowsPerPage: 10,
      class: "table table-condensed",
      showFilter: true,
        headerClass: 'col-md-2',
      fields: [{
        key: 'nombrePromocion',
        label: 'Nombre de la Actividad',
      }, {
        key: 'idGrupo',
        label: 'Grupo?',
        fn: function(value, object, key) {
          var grupo = Grupos.findOne({
            _id: value
          });
          return grupo.nombre;
        },
        headerClass: 'col-md-1',
      }, {
        key: 'porcentajeDescuento',
        label: '% desc.',
        fn: function(value, object, key) {
          return value.toFixed(2) + " %";
        },
        headerClass: 'col-md-1',
      },
               {
        key: 'importeDescuento',
        label: '$ desc.',
        fn: function(value, object, key) {
          return value.toFixed(2);
        },
        headerClass: 'col-md-1',
      },{
        key: 'actividades',
        label: 'Actividades',
        fn: function(value, object, key) {
          var lab="";
          $(value).each(function(i,val){
            var act=Actividades.findOne({_id:val});
            var nombreAct=act?act.nombreActividad:"";
            lab+=nombreAct+", ";
          });
          return lab;
        },
        //headerClass: 'col-md-2',
      }, {
        label: '',
        headerClass: 'col-md-2',
        tmpl: Template.accionesPromociones
      }]
    };
  }
});
Template.promociones.events({
  'click #btnAgregarPromocion': function() {
    Router.go('/nuevaPromocion');
  },

  'mouseover tr': function(ev) {
    $("#tablaPromociones").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();

  },
  'mousemove tr': function(ev) {

  },
  'click .delete': function(ev) {
    var id = this._id;
    swal({
      title: "Estas Seguro de quitar?",
      text: "Una vez que lo has quitado sera permanente!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Si, borralo!",
      closeOnConfirm: false
    }, function() {
      Promociones.remove(id);
      swal("Quitado!", "El registro ha sido borrado", "success");
    });

  },
  'click .update': function(ev) {
    Router.go('/modificarPromocion/' + this._id);
  },
});