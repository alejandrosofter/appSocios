/*eslint-disable no-undef, semi*/
Template.movimientosGenerales.events({
  "click #btnAgregar":function(){
    var val=this;
    Modal.show('nuevoMovimientoGeneral',function(){
			return val;
			
		});
  },
  "click #btnBuscar":function(){
  	consultarCajaGeneral();
  },
  "click #btnCerrar":function(){
    var val={items:[],usuario:Meteor.user()._id,esCajaGral:false,fechaCierre:new Date(),importe:0}
    Modal.show('cerrarCaja',function(){
			return val;
			
		});
  },
   "click #tipoMovimiento":function(){
    console.log($( "#tipoMovimiento option:selected" ).text())
  },
   'mouseover tr': function(ev) {
    $("#tablaMovimientosGeneral").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ MovimientosGenerales.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
  'click .update': function(ev) {
    var act=this;
    Modal.show('modificarMovimientoGeneral',function(){ return act; });
  },
   'click .imprimir': function(ev) {
    var act=this;
    Modal.show('imprimirMovimientoGeneral',function(){ return act; });
  },
  
})

Template.imprimirMovimientoGeneral.helpers({

	"mes":function(){
		var d=new Date(this.fecha);
		return mesLetras(d.getMes());
	},
	"ano":function(){
		console.log(this);
		 var d=new Date(this.fecha);
		return d.getAno();
	},
	"dia":function(){
		console.log(this);
		 var d=new Date(this.fecha);
		return d.getDia();
	},
  "fecha":function(){
		 var d=new Date(this.fecha);
		return d.getFecha();
	},
  "importeLetras":function()
  {
    return numeroALetras(this.importeDebe, {
  plural: 'pesos',
  singular: 'peso',
  centPlural: 'centavos',
  centSingular: 'centavo'
});
  },
	
})
AutoForm.hooks({

	'_nuevoMovimientoGral': {
		onSuccess: function(operation, result, template) {
      
			Modal.hide();
			swal("GENIAL!", "Se ha ingresado el registro!", "success");

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
  '_modificarMovimientoGral': {
		onSuccess: function(operation, result, template) {
      
			
//       $(".modal").on("hidden.bs.modal", function () {
//     $('body').removeClass('modal-open');	
// $('.modal-backdrop').remove();
// });
			swal("GENIAL!", "Se ha modificado el registro!", "success");
      Modal.hide();
     
		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	}
});
var consultarCajaGeneral=function()
{
	var fecha=$("#fechaCaja").val();
	 UIBlock.block('Consultando datos, aguarde un momento...');
	Meteor.call("consultarCajaGeneral",fecha,function(err,res){
		saldoAuxiliar=0;
		Session.set("consultarCajaGeneral",res);
		UIBlock.unblock();
	})
}
Template.movimientosGenerales.rendered=function(){
	var hoy=new Date();
	$("#fechaCaja").datepicker({format: 'dd/mm/yyyy',clearBtn:true,autoclose:true,todayHighlight:true});
	$("#fechaCaja").val(hoy.getFecha());
	consultarCajaGeneral();
}
var saldoAuxiliar=0;
Template.movimientosGenerales.helpers({
    'settings': function(){
        return {
 collection: Session.get("consultarCajaGeneral"),
 rowsPerPage: 50,
//           rowClass: function(item) {
//             if(item.estado==="CERRADO")return "deshabilitado"
//           },
 class: "table table-condensed",
 showFilter: true,
 fields: [
    {
        key: 'fecha',
        label: 'Fecha',
      fn: function (value, object, key) {
           return value.getFecha2();
         },
        headerClass: 'col-md-1',
      },
    {
        key: 'quien',
        label: 'Quien?...',
      fn: function (value, object, key) {
           return value;
         },
        headerClass: 'col-md-1',
      },
      {
        key: 'tipoMovimiento',
        label: 'Tipo de E/S',
        headerClass: 'col-md-2',
      },
      {
        key: 'detalle',
        label: 'Detalle',
      fn: function (value, object, key) {
           return value;
         },
        
      },
   {
        key: 'importeDebe',
        label: '$ Egreso',
      fn: function (value, object, key) {
        console.log(object)
           return "$ "+value.formatMoney(2);
         },
        headerClass: 'col-md-1',
      },
   {
        key: 'importeHaber',
        label: '$ Ingreso',
      fn: function (value, object, key) {
           return "$ "+value.formatMoney(2);
         },
        headerClass: 'col-md-1',
      },
       {
        key: 'importeHaber',
        label: '$ Saldo',
      fn: function (value, object, key) {
      	var saldoAux=Number(object.importeHaber-object.importeDebe);
      	   saldoAuxiliar+=saldoAux;
      	   var clase=saldoAuxiliar<0?"claseBaja":"claseAlta";
      	   return new Spacebars.SafeString("<span class='"+clase+"'>$ "+saldoAuxiliar.formatMoney(2)+"</span>");
         
         },
        headerClass: 'col-md-1',
      },
//    {
//         key: 'estado',
//         label: 'Estado',
//       fn: function (value, object, key) {
//            return value;
//          },
        
//       },

    {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesMovimientosGenerales
      }
 ]
 };
    }
});
Template.actividades.rendered=function(){
 
  
}
Template.sociosActividad.rendered=function(){

  
}