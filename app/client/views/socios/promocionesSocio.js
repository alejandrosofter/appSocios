
AutoForm.hooks({
	'nuevaPromocionSocio_': {
		onSuccess: function(operation, result, template) {
			swal("GENIAL!", "Se ha ingresado la promocion al socio!", "success");
			Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},



});


Template.nuevaPromocionSocio.helpers({
	"opciones":function(){
		
        return _.map(Promociones.find().fetch(), function (c, i) {
          return {label: c.nombrePromocion, value: c._id};
				});
		
	}
});
Template.promocionesSocio.helpers({

	'settings': function() {
		return {
			collection: this.promociones,
			rowsPerPage: 10,
			class: "table table-condensed",
			showFilter: false,
			fields: [
				{
					key: 'fecha',
					label: 'Fecha',
					headerClass: 'col-md-2',
					fn: function(value, object, key) {
						var d = new Date(value);
						return d.toLocaleDateString();
					}
				}, 

				{
					key: 'idPromocion',
					label: 'Promocion',
					//headerClass: 'col-md-2',
					fn: function(value, object, key) {
            var promocion=Promociones.findOne({_id:value});
            if(promocion)return promocion.nombrePromocion;
						return "No se encuentra la promocion";
					},
				},

				{
					label: '',
					headerClass: 'col-md-2',
					tmpl: Template.accionesPromocionesSocio
				}
			]
		};
	},
	"items": function() {
		return this.deudas;
	},

	'mouseover tr': function(ev) {

	},

});
var buscarCampoDeuda=function(deuda,campo)
{
	var imp=0;
	$(Session.get("socio").deudas).each(function(i,item){
		if(deuda==item._id){imp=item[campo];return;}
	});
	return imp;
}

Template.promocionesSocio.events({
	'click #btnAgregarPromocion': function(ev) {
		var act = this;

		Modal.show('nuevaPromocionSocio', function() {
			return act;
		});
	},
	'click .delete': function(ev) {
		var val = this;
		console.log(this);
		swal({
				title: "Estas Seguro de quitar la promocion?",
				text: "Una vez que lo has quitado sera permanente!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Si, borralo!",
				closeOnConfirm: false
			},
			function() {
				var id = Session.get('socio')._id;
				Meteor.call("quitarPromocion", id, val._id, function(err, res) {
					if (!err) swal("Quitado!", "El registro ha sido borrado", "success");
					else swal("Ops...", "Ha ocurrido un error para quitar! .. por favor chekear nuevamente", "error");
				});
				//Socios.update({_id:id},{$pull:{deudas:{_id:val.doc._id}}},{getAutoValues: false});
			});

	},
	'click .update': function(ev) {
		var val = this;
		Modal.show('modificaDeudaSocio', function() {
			return val._id;

		});
	},

});