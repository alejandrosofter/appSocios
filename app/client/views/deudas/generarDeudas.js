Template.nuevaGeneracionDeudas.helpers({
	"esCuotaSocial":function(){
		
		if($("#cargaActividades:checked").val())return "display:none";else "display:si";
		//return $("#esCuotaSocial:checked").val();
	}
});
Template.nuevaGeneracionDeudas.events({
	"change #cargaActividades":function(){
		console.log($("#cargaActividades:checked").val());
		if($("#cargaActividades:checked").val())$("#contenedorActividades").show("slow");else $("#contenedorActividades").hide("slow");
		
		//return $("#esCuotaSocial:checked").val();
	}
});
Template.generacionDeudas.helpers({
	
  'settings': function() {
    return {
      collection: GeneracionDeudas.find(),
      rowsPerPage: 10,
      class: "table table-condensed",
      showFilter: false,
      fields: [{
          key: 'fecha',
          label: 'Fecha',
				sortOrder:0,
				sortDirection:"descending",
          fn: function(value, object, key) {
            var d = new Date(value);
            return d.toLocaleDateString();
          },
          headerClass: 'col-md-2',
        }, {
          key: 'detalle',
          label: 'Detalle',
          fn: function(value, object, key) {
            return value;
          },
          //  headerClass: 'col-md-2',
        }, {
          key: 'deudas',
          label: 'Cant. Cuotas...',
          fn: function(value, object, key) {
						if(!value.length) return "0"
            return value.length;
          },
          headerClass: 'col-md-1',
        },

        {
          label: '',
          headerClass: 'col-md-1',
          tmpl: Template.accionesGeneracionDeudas
        }
      ]
    };
  }
});

AutoForm.hooks({

	'nuevaGeneracionDeudas_': {

		onSuccess: function(operation, result, template) {
			console.log(result);
			//if (Meteor.isServer)  	
				Meteor.call("ingresarDeudas",result,function(){ 
				swal("GENIAL!", "Se ha ingresado las cuotas a los socios ACTIVOS!", "success");
			Router.go("/generacionDeudas")
				});
			//UIBlock.unblock();
			
		//	Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},



});
Template.nuevaGeneracionDeudas.events({
	 'click #btnAceptar': function() {
	//	swal("Generando Cuotas...", "Se estan generando las cuotas..", "success");
  },
	
});
Template.generacionDeudas.events({
  'click #btnAgregarGenerar': function() {
		Router.go('/nuevaGeneracionDeudas');
		var res=[];
		//cargarDeudaSocios([],false,"",res);
  },

  'mouseover tr': function(ev) {
    $("#tablaGeneracionDeudas").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();

  },
  'mousemove tr': function(ev) {

  },
	'click #btnAcepta': function(){
       UIBlock.block('Agregando cuotas a socios...');
    },
	'click .verCuotas': function(ev) {
    var val=this;
		 console.log(val);
    Modal.show('cuotasGeneracion',function(){
			 
    var setings= {
      collection: val.deudas,
      rowsPerPage: 10,
      class: "table table-condensed",
      showFilter: false,
      fields: [{
          key: 'fecha',
          label: 'Fecha',
          fn: function(value, object, key) {
            var d = new Date(value);
            return d.toLocaleDateString();
          },
          headerClass: 'col-md-2',
        },
							 {
          key: 'socio',
          label: 'Socio',
          fn: function(value, object, key) {
            return value;
          },
          headerClass: 'col-md-2',
        },{
          key: 'detalle',
          label: 'Detalle',
          fn: function(value, object, key) {
            return value;
          },
        }, {
          key: 'importe',
          label: '$ Importe',
          fn: function(value, object, key) {
            return value.toFixed(2);
          },
          headerClass: 'col-md-1',
        },

      ]
    };
  return setings;
});
			
  },
  'click .aplicar': function(ev) {
  Meteor.call("ingresarDeudas",this._id,function(){ 
				swal("GENIAL!", "Se ha ingresado las cuotas a los socios ACTIVOS!", "success");
			Router.go("/generacionDeudas")
				});
  },
  'click .delete': function(ev) {
    var id = this._id;
		console.log(this)
    swal({
      title: "Estas Seguro de quitar?",
      text: "Una vez que lo has quitado sera permanente!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Si, borralo!",
      closeOnConfirm: false
    }, function() {
			UIBlock.block('Quitando elemento...');
			Meteor.call("quitarGeneracionDeuda",id,function(err,res){
				UIBlock.unblock();
				swal("Quitado!", "El registro ha sido borrado y todas las deudas asociadas a el", "success");
			});
      
      
    });

  },
});