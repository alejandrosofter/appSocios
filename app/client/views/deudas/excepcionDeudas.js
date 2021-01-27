Template.nuevaExcepcionDeudas.helpers({
	"esCuotaSocial":function(){
		
		if($("#esCuotaSocial:checked").val())return "display:none";else "display:si";
		//return $("#esCuotaSocial:checked").val();
	}
});
Template.nuevaExcepcionDeudas.events({
	"change #esCuotaSocial":function(){
		console.log($("#esCuotaSocial:checked").val());
		if($("#esCuotaSocial:checked").val())$("#contenedorActividades").hide("slow");else $("#contenedorActividades").show("slow");
		
		//return $("#esCuotaSocial:checked").val();
	}
});
Template.excepcionDeudas.helpers({
	
  'settings': function() {
    return {
      collection: ExcepcionesDeudas.find(),
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
        }, 
							 {
          key: 'idActividades',
          label: 'Actividades...',
          fn: function(value, object, key) {
						var sal="";
						for(var i=0;i<value.length;i++){
								var res=Actividades.findOne({_id:value[i]});
							sal+=res.nombreActividad;
						}
					
            return sal;
          },
          headerClass: 'col-md-1',
        },
 {
          key: 'importe',
          label: 'Importe',
          fn: function(value, object, key) {
            return (value*1).toFixed(2);
          },
          //  headerClass: 'col-md-2',
        },
							  {
          key: 'porcentajeDescuento',
          label: '% desc.',
          fn: function(value, object, key) {
            return (value*1).toFixed(2);
          },
          //  headerClass: 'col-md-2',
        },
							 {
          key: 'detalle',
          label: 'Detalle',
          fn: function(value, object, key) {
            return value;
          },
          //  headerClass: 'col-md-2',
        },
        {
          label: '',
          headerClass: 'col-md-1',
          tmpl: Template.accionesExcepcionDeudas
        }
      ]
    };
  }
});

AutoForm.hooks({
'modifdicarExcepcionDeudas_': {

	
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha modificado la excepcion!", "success");
			Router.go('/excepcionDeudas');

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
	'nuevaExcepcionDeudas_': {

		onSuccess: function(operation, result, template) {
			console.log(this);
			//if (Meteor.isServer)  	
				Meteor.call("ingresarDeudas",{doc:this.insertDoc,idDeuda:this.docId },function(){ 	});
			//UIBlock.unblock();
			swal("GENIAL!", "Se ha ingresado la excepcion!", "success");
			Router.go("/excepcionDeudas")
		//	Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},



});
Template.nuevaExcepcionDeudas.events({
	 'click #btnAceptar': function() {
	//	swal("Generando Cuotas...", "Se estan generando las cuotas..", "success");
  },
	
});
Template.excepcionDeudas.events({
  'click #btnAgregarGenerar': function() {
		Router.go('/nuevaExcepcionDeudas');
		var res=[];
		//cargarDeudaSocios([],false,"",res);
  },

  'mouseover tr': function(ev) {
    $("#tablaExcepcionDeudas").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();

  },
  'mousemove tr': function(ev) {

  },
	'click #btnAcepta': function(){
       UIBlock.block('Agregando excepcion...');
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
  'click .delete': function(ev) {
    var id = this._id;
    swal({
      title: "Estas Seguro de quitar?",
      text: "Una vez que lo has quitado sera permanente!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Si, borralo!",
      closeOnConfirm: true
    }, function() {
			//UIBlock.block('Quitando elemento...');
			ExcepcionesDeudas.remove({_id:id});
		
      
      
    });

  },
	 'click .modificar': function(ev) {
    Router.go('/modificarExcepcionDeudas/'+this._id);

  },
});
Template.modificarExcepcionDeudas.helpers({
	"esCuotaSocial":function(){
		
		if($("#esCuotaSocial:checked").val())return "display:none";else "display:si";
		//return $("#esCuotaSocial:checked").val();
	}
});