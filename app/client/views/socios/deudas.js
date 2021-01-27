var buscarIndiceDeuda=function(busca)
{
	var arr=Session.get("socio").deudas;
	for (var i = 0; i < arr.length; i++)
		if(arr[i]._id==busca)return i;
	return -1;
}
AutoForm.hooks({

	'nuevaDeudaSocio_': {

		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha modificado la actividad del socio!", "success");
			console.log(this);
			Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
	'modificaDeudaSocio_': {

	
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha modificado el registro de deuda!", "success");
			Modal.hide();

		},
		onError: function(operation, error, template) {
      
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},

	
});
Template.modificaDeudaSocio.helpers({
	"docu":function(){
		return Session.get("socio");
	},
	"labFecha":function(){
		var idSeleccion=this;
		var ind=buscarIndiceDeuda(idSeleccion);
	return 'deudas.'+ind+'.fecha';
	},
	"labFechaVto":function(){
		var idSeleccion=this;
		var ind=buscarIndiceDeuda(idSeleccion);
	return 'deudas.'+ind+'.fechaVto';
	},
	"labDetalle":function(){
		var idSeleccion=this;
		var ind=buscarIndiceDeuda(idSeleccion);
	return 'deudas.'+ind+'.detalle';
	},
	"labImporte":function(){
		var idSeleccion=this;
		var ind=buscarIndiceDeuda(idSeleccion);
	return 'deudas.'+ind+'.importe';
	},
	"labImporteSaldo":function(){
		var idSeleccion=this;
		var ind=buscarIndiceDeuda(idSeleccion);
	return 'deudas.'+ind+'.importeSaldo';
	}
});
var filtroDeudas=function(data){
	return data.estado=="PENDIENTE";
};
Template.nuevaDeudaSocio.helpers({
	"idSocio":function(){
	//	console.log("nueva");
		//console.log(this);
		return this._id;
	}
});
Template.deudasSocio.helpers({
	
	 
	'settings': function(){
			console.log("FICHA SOCIO");
 //Meteor.subscribe('Deudas',this._id._str);
 
        return {
 collection: Deudas.find({estado:"PENDIENTE"}),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: false,
 fields: [
      {
        key: 'fecha',
        label: 'Fecha',
				headerClass: 'col-md-2',
        fn: function (value, object, key) {
          var d=new Date(value);
           return d.toLocaleDateString();
         }
      },
	 {
        key: 'fecha',
        label: 'Fecha',
				 sortOrder:0,
       sortDirection: 'descending',
       hidden:true
      },
	
   {
        key: 'detalle',
        label: 'Detalle',
		  //  headerClass: 'col-md-1',
       
      },
   {
        key: 'importe',
        label: '$ Importe',
        headerClass: 'col-md-2',
		  fn: function (value, object, key) {
						return value.toFixed(2);
         },
      },
	  {
        key: 'importeSaldo',
        label: '$ Saldo',
        headerClass: 'col-md-2',
		  fn: function (value, object, key) {
						return value.toFixed(2);
         },
      },
    
    {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesDeudasSocio
      }
 ]
 };
    },
	"items":function(){
		return this.deudas;
	},
	
	'mouseover tr': function(ev) {
  
  },
	
});

Template.deudasSocio.events({
  'click #agregarDeudaSocio': function(ev) {
    var act=this;
		
   Modal.show('nuevaDeudaSocio',function(){
			return act;
		});
  },
	 'click .delete': function(ev) {
    var val=this;
     console.log(this);
    swal({   title: "Estas Seguro de quitar la deuda?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false },
         function(){ 
          var id=Session.get('socio')._id;
      Meteor.call("quitarDeuda",id,val._id,function(err,res){
        if(!err)swal("Quitado!", "El registro ha sido borrado", "success");
        else swal("Ops...", "Ha ocurrido un error para quitar! .. por favor chekear nuevamente", "error");
      });
      //Socios.update({_id:id},{$pull:{deudas:{_id:val.doc._id}}},{getAutoValues: false});
       });

  },
	'click .update': function(ev) {
    var val=this;
		console.log(this);
    Modal.show('modificaDeudaSocio',function(){
			return val;
			
		});
  },
    
});