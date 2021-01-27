var buscarPosicionDeuda=function(idDeuda,deudas){

		for (var i = 0; i < deudas.length; i++){
			console.log(deudas[i]._id);
			if(deudas[i]._id==idDeuda)return i;
		}
			
		return null;
};
var getDeudas=function(idDeuda,_idSocio){
var deudas=Deudas.find({idSocio:_idSocio});
		for (var i = 0; i < deudas.length; i++){
			console.log(deudas[i]._id);
			if(deudas[i]._id==idDeuda)return deudas[i];
		}
			
		return null;
};
var cambiarEstadoDeudas=function(res){
		console.log("CAMBIANDO ESTADO");
	var importeSaldo=res.insertDoc.importe; // importe a debitar de deudas
	$(res.insertDoc.deudasPago).each(function(i,item){
		console.log("item "+item);
		var deuda=Deudas.findOne({_id:item});
		var resto=importeSaldo-deuda.importeSaldo;
		var estado=resto>=0?"CANCELADO":"PENDIENTE";
		importeSaldo=resto;
		
		var saldo=resto>=0?0:(-resto);
	
			console.log("saldo:"+saldo);
		console.log("resto:"+resto);
		console.log("importeSaldo:"+importeSaldo);
		Deudas.update({_id:deuda._id},{$set:{estado:estado,saldo:saldo}});
	});
};

AutoForm.hooks({

	'nuevoPagoSocio_': {

		onSuccess: function(operation, result, template) {
			UIBlock.unblock();
				cambiarEstadoDeudas(this);
			
			swal("GENIAL!", "Se ha ingresado el pago!", "success");
			
			Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},



});

var filtroDeudas=function(data){
	return data.estado=="PENDIENTE";
};

Template.nuevoPago.helpers({
		"idSocio":function(){
		console.log(this);
		return this._id._str;
	},
	"opcionesDeuda":function(){
		
        return _.map(Deudas.find({estado:"PENDIENTE"}).fetch(), function (c, i) {
					var detalle=c.detalle+" $"+c.importe.toFixed(2);
          return {label: detalle, value: c._id};
				});
		
	}
});
Template.pagosSocio.helpers({

	'settings': function() {
		Meteor.subscribe('Pagos',this._id._str);
		return {
			collection: Pagos.find(),
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
				}, {
					key: 'fecha',
					label: 'Fecha',
					sortOrder: 0,
					sortDirection: 'descending',
					hidden: true
				}, {
					key: 'formaPago',
					label: 'Vto.',
					//headerClass: 'col-md-1',

				},

				{
					key: 'importe',
					label: '$ Importe',
					headerClass: 'col-md-2',
					fn: function(value, object, key) {
						return value.toFixed(2);
					},
				},

				{
					label: '',
					headerClass: 'col-md-2',
					tmpl: Template.accionesPagosSocio
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
Template.nuevoPago.events({
	'change #deudasPago': function(ev) {
		var act = this;
		console.log($("#deudasPago").val());
		var importe=0;
		$($("#deudasPago").val()).each(function(i,item){
		
			var deuda=Deudas.findOne({_id:item});
			console.log(deuda);
			importe+=deuda.importeSaldo;
		});
		$("#importe").val(importe);
	},

});
Template.deudasSocio.events({
	'click #agregarDeudaSocio': function(ev) {
		var act = this;

		Modal.show('nuevaDeudaSocio', function() {
			return act;
		});
	},
	'click .delete': function(ev) {
		var val = this;
		console.log(this);
		swal({
				title: "Estas Seguro de quitar la deuda?",
				text: "Una vez que lo has quitado sera permanente!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Si, borralo!",
				closeOnConfirm: false
			},
			function() {
				var id = Session.get('socio')._id;
				Meteor.call("quitarDeuda", id, val._id, function(err, res) {
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