Template.editarImportarPagos.rendered=function(){
	var salida = new ReactiveVar();
	
};
var consultarItems=function(idImp)
{
	Session.set("idImportacion",idImp);
	  UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("itemsImportacion",idImp,function(err,res){
    //Session.set("itemsImportacion",res);

	Session.set("itemsImportacion",res)

		UIBlock.unblock();
  })
}
var resul="";
var getAsociaciones=function(fila)
{
	console.log("fila: "+fila)
	var items=Session.get("itemsImportacion");
	for(var i=0;i< items.length;i++){

		if(items[i].idItem===fila)return items[i].sociosAsociados;
	}
		
	return []
}
var getIndice=function(fila,id){
	console.log("id: "+id);
	var res= getAsociaciones(fila);

	for(var i=0;i< res.length;i++)
		if(res[i]._id===id)return i;
	return -1;
}
Template.itemsAsociacion.events({
	"click .quitarAsociacion":function()
	{
		console.log(this)
		Meteor.call("quitarSocioCbu",Session.get("idImportacion"),this.idFila,this._id,function(err,res){
			
		})
	},
	"change .importeAsociacion":function()
	{
		modificarEnVista(this.idFila,this._id,$("#importe_"+this._id).val())
		Meteor.call("modificarImporteAsociacion",Session.get("idImportacion"),this.idFila,this._id,$("#importe_"+this._id).val(),getIndice(this.idFila,this._id),function(err,res){
			
		})
	}
})
function modificarEnVista(fila,id,importe)
{
	var arr=Session.get("itemsImportacion");
	var filaAux=null;
	for(var i=0;i<arr.length;i++) 
 		if(arr[i].idItem==fila)arr[i].sociosAsociados=modificaEnVista_item(arr[i].sociosAsociados,id,importe);
	Session.set("itemsImportacion",arr)
}
function modificaEnVista_item(item,id,importe)
{
	for(var i=0;i<item.length;i++){
		if(item[i]._id==id)item[i].importe=importe;
	}
  return item
}
Template.itemsAsociacion.helpers({
	"nombreSocioAsoc":function(){
	return this.detalle+" $";
	},
})
Template.editarImportarPagos.helpers({
	'settings': function(){
        return {
 collection: Session.get("itemsImportacion"),
 rowsPerPage: 100,
 class: "table table-condensed",
 showFilter: true,
 fields: [
      {
        key: 'nombreSocio',
        label: 'Titular(imputado)',
      },

   {
        key: 'cbu',
        label: 'Cbu(imputado)',
      fn: function (value, object, key) {
           return value;
         },
        headerClass: 'col-md-2',
      },
	  {
        key: 'importe',
        label: '$ Importe',
      fn: function (value, object, key) {
           return value;
         },
        headerClass: 'col-md-2',
      },
	 {
        key: 'estado',
        label: 'dif. $',
      fn: function (value, object, key) {
           var importe=parseFloat(object.importe);
				var sum=0;
				for(var i=0; i<object.sociosAsociados.length;i++){
					console.log(object.sociosAsociados[i])
					 sum+=parseFloat(object.sociosAsociados[i].importe);
				}
				
				var valor= importe-sum;
				var color=valor===0?"green":"red";
				return new Spacebars.SafeString("<b style='color:"+color+"'> $"+valor+"</b>");
         },
        headerClass: 'col-md-1',
      },
	  {
        key: 'estado',
        label: '$ Estado',
      fn: function (value, object, key) {
           return value;
         },
        headerClass: 'col-md-1',
      },
	{
        label: '',
        headerClass: 'col-md-4',
        tmpl:Template.itemsAsociacion
      },
    {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesItemsImportarPagos
      }
 ]
 };
    },
	"items":function(){
		return  Session.get("itemsImportacion");
	},
	
	"claseFila":function(){
		if(this.estado=="ACE")return "";
		return "claseBaja";
	}
});
var crearExp = function(searchText) {
	// this is a dumb implementation
	var parts = searchText.trim().split(/[ \-\:]+/);
	return new RegExp("(" + parts.join('|') + ")", "ig");
}
Template.seleccionaSocio.helpers({
	"importe":function()
	{
		return this.importe
	},
	"settingsSocios": function() {
     Meteor.subscribe('Socios');
    	return {
			position: "bottom",
			limit: 45,
			rules: [{
				token: '',
				collection: Socios,
				field: "",
				matchAll: false,
				selector: function(match) {
					console.log(match)
					var cadBusca=new RegExp(match,"i")
					var valor=Number(match)
					return {"$or":[{"apellido":{"$in":[cadBusca]}},{"nroSocio":valor}]}
				},
				template: Template.socioAuto
			}, ]
		};
  },
})
Template.editarImportarPagos.events({
	"click .agregarSocio":function(){
		 var act=this;
		console.log(this)
		Session.set("idImportacion",this.idImportacion)
    Modal.show('seleccionaSocio',function(){ return act; });
	},
	"click #btnBuscar":function(){
		console.log(this)
		consultarItems(this._id)
	},
	"click #btnQuitarAsociaciones":function()
	{
		Meteor.call("btnQuitarAsociaciones",Session.get("idImportacion"),function(err,res){
			
		})
	},
	"click .quitarFila":function(){
		var idItem=this.idItem;
		swal({   title: "Estas Seguro de quitar la fila de la IMPORTACION?",   text: "Una vez que lo quites no se puede recuperar..",   
					type: "warning",   showCancelButton: true,   confirmButtonColor: "#5cb85c",   confirmButtonText: "Si, QUITAR!",   closeOnConfirm: true }, 
					 function(){
				UIBlock.block('Quitando Fila, aguarde un momento...');
		Meteor.call("quitarFilaImportacion",Session.get("idImportacion"),idItem,function(err,res){
			UIBlock.unblock();
				swal({   title: "Genial!",   text: "Has quitado la fila!",   type: "success"})  
		})
			});
		
	}
})
Template.editarImportarPagos.onRendered(function(){
	consultarItems(this.data._id)
})
Template.importarPagos.helpers({
	 "settingsSocios": function() {
     Meteor.subscribe('Socios');
    	return {
			position: "bottom",
			limit: 45,
			rules: [{
				token: '',
				collection: Socios,
				field: "",
				matchAll: false,
				selector: function(match) {
					console.log(match)
					var cadBusca=new RegExp(match,"i")
					var valor=Number(match)
					return {"$or":[{"apellido":{"$in":[cadBusca]}},{"nroSocio":valor}]}
					//return {"nroSocio":valor}
																	},
				template: Template.socioAuto
			}, ]
		};
  },
    'settings': function(){
        return {
 collection: ImportarPagos.find(),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: true,
 fields: [
	  {
        key: 'fechaCarga',
        label: 'Fecha PAGO',
				headerClass: 'col-md-2',
        fn: function (value, object, key) {
          var d=new Date(value);
           return d.toLocaleDateString();
         }
      },
      {
        key: 'descripcion',
        label: 'Detalle',
      },
	  {
        key: 'formaPago',
        label: 'Forma de Pago',
      },
	       {
        key: 'estado',
        label: 'Estado',
					  headerClass: 'col-md-1',
					 fn: function (value, object, key) {
						 var clase=value=="PENDIENTE"?"label label-default":"label label-success";
             return  new Spacebars.SafeString("<span class='"+clase+"'>"+value+"</span>");
         },
      },
   {
        key: 'items',
        label: 'Items',
					 fn: function (value, object, key) {
             return  new Spacebars.SafeString(value.length+" ITEMS");
         },
      },
 {
        key: 'pagos',
        label: 'Pagos REALIZADOS',
					 fn: function (value, object, key) {
						 if(value==null)return "-"
             return  new Spacebars.SafeString(value.length+" PAGOS");
         },
      },
    {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesImportarPagos
      }
 ]
 };
    }
});
Template.importarPagos.rendered=function(){
  
  
}
Template.importarPagos.events({
	
  'click #btnAgregar': function(){
        Router.go('/nuevoImportarPagos');
    },
 
  'mouseover tr': function(ev) {
    $("#tablaImportarPagos").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Se quitaran los PAGOS ASOCIADOS, sin embargo los debitos de los socios que se ingresaron quedaran en cada socio...",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: true },
				 function(){ 
			Meteor.call("quitarImportacionPagos",id,true,function(err,res){
				swal("Quitado!", "El registro ha sido borrado", "success"); });
			})
			

  },
		'click .quitarPagos': function(ev) {
			var id=this._id;
		  swal({   title: "Estas Seguro de quitar los pagos?",   text: "Si bien luego puedes volver a aplicar la importacion.. los pagos asignados no se pueden recuperar",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#5cb85c",   confirmButtonText: "Si, QUITALOS!",   closeOnConfirm: true }, 
					 function(){
				UIBlock.block('Quitando pagos, aguarde un momento...');
		Meteor.call("quitarImportacionPagos",id,function(err,res){
			UIBlock.unblock();
			Router.go('/importarPagos')
		})
			});

  },
	'click .aplicar': function(ev) {
		var id=this._id;
    	if(this.estado==="PROCESADO"){
			swal("Opsss..", "No podes volver a agregar una importacion ingresada!.. debes eliminarla y volverla a cargar", "error");
		return;
		}
		  swal({   title: "Estas Seguro de agregar la IMPORTACION?",   text: "Una vez que la has agregado se ingresaran los pagos y seteos de debitos correspondientes!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#5cb85c",   confirmButtonText: "Si, INGRESA!",   closeOnConfirm: true }, 
					 function(){
				UIBlock.block('Consultando datos, aguarde un momento...');
		Meteor.call("agregarImportacion",id,function(err,res){
			UIBlock.unblock();
			Router.go('/importarPagos')
		})
			});

  },
  'click .editar': function(ev) {
    Router.go('/editarImportarPagos/'+this._id);
  },
});
//----------------------EDITAR
Template.editarImportarPagos.events({
"click #btnAgregarImportacion":function()
	{
		if(this.estado==="PROCESADO"){
			swal("Opsss..", "No podes volver a agregar una importacion ingresada!.. debes eliminarla y volverla a cargar", "error");
		return;
		}
		  swal({   title: "Estas Seguro de agregar la IMPORTACION?",   text: "Una vez que la has agregado se ingresaran los pagos y seteos de debitos correspondientes!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#5cb85c",   confirmButtonText: "Si, INGRESA!",   closeOnConfirm: true }, 
					 function(){
				UIBlock.block('Consultando datos, aguarde un momento...');
		Meteor.call("agregarImportacion",Session.get("idImportacion"),function(err,res){
			UIBlock.unblock();
			Router.go('/importarPagos')
		})
			});

		 
	},
 "click #btnBuscarCbu":function(){
	
	 var aux=this;
	 this.items.forEach(function(item){
		 var socios=Socios.find({cbu:item.cbu});
		 var cantidad=socios.lenght;
		 ObjectID = require("mongodb").ObjectID;
		  var res=ImportarPagos.update(
      ("598b0c1b0fbf75066d39e7f3")
    , {
      $set: {
        descripcion: "golalaaa"
      }
    });
// 		 var res=ImportarPagos.update({
//       _id: aux._id._str
//     }, {
//       $push: {
//         sociosAsociados: {
//           idSocio: "idActividad",
// 					idItem:item._id,
// 					_id:Meteor.uuid()
//         }
//       }
//     });

	 });
 }
})
Template.seleccionaSocio.events({
	"click #btnAceptarCbu":function(){
console.log(this);
		if($("#buscaSocios").val()===""|| $("#importe").val()==="" )
		{
			swal("Ops!", "Debes completar los datos! " , "error");
			return;
		}
		var aux=this;
		var idImportacion=	Session.get("idImportacion");
		var sel="#aux_"+aux.idItem;
		var valor=Session.get("socioSeleccionCbu").apellido.toUpperCase()+", "+Session.get("socioSeleccionCbu").nombre+" $"+$("#importe").val();
		$(sel).hide()
		this.auxItem=valor;
		$("#cargadorImportacion").show();
		Modal.hide();
		Meteor.call("asignarSocioCbu2",Session.get("socioSeleccionCbu"),idImportacion,$("#importe").val(),this.idItem,function(err,res){
			
					$("#cargadorImportacion").hide();
			
		})
	},
	"autocompleteselect input": function(event, template, doc) {
		var socio=doc.apellido+", "+doc.nombre+" NRO:"+doc.nroSocio;
		
		Session.set("socioSeleccionCbu",doc);
		$("#buscaSocios").val(socio);
	},
})
//----------------------NUEVO
var func=function()
{
	var func = this;
   var file = event.currentTarget.files[0];
var ObjectID = require('mongodb').ObjectID;
   var reader = new FileReader();
   reader.onload = function(fileLoadEvent) {
     
     const lineas=reader.result.split(/\r?\n/);
     swal({   title: "Estas Seguro de cargar?",   text: "Una vez aceptado se cargara el archivo y luego lo podes editar!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#4cae4c",   confirmButtonText: "Si, cargar!",   closeOnConfirm: true }, 
          function(){
       var res=[];
			 var asociados=[];
			 var i=0;
     		 lineas.forEach(function (line) {
            	var cbu=line.substring(33,58);
			var estado=line.substring(173,176);
       var nombres=line.substring(58,80);
       var importe_=line.substring(107,111);
					 var auxAsociado=[];
					var timestamp = Math.floor(new Date().getTime()/1000)+"_"+i;
           var aux={cbu:cbu,importe:importe_,estado:estado,nombreSocio:nombres,id:timestamp,sociosAsociados:auxAsociado};
           res.push(aux);
       i++
        });
			 var timestamp = Math.floor(new Date().getTime()/1000)+"_";
       var importacion={_id:timestamp,descripcion:$("#descripcion").val(),created:new Date(),estado:"PENDIENTE",items:[]};
       UIBlock.block('CARGANDO ARCHIVO...');
				console.log(res);
      Meteor.call("ingresarImportacion",importacion,res,function(err,res){
        UIBlock.unblock();
        swal("Agregado!", "El registro ha sido agregado", "success");
				
				Router.go('/importarPagos');
      });
      
      }
         
         );

     
   };
    
   reader.readAsBinaryString(file);
}
Template.nuevoImportarPagos.events({
	 "change .file-upload-input": function(event, template){
   var func = this;
   var file = event.currentTarget.files[0];
   
   var reader = new FileReader();
   reader.onload = function(fileLoadEvent) {
     UIBlock.block('Subiendo Archivo, aguarde por favor...');
      Meteor.call('fileUpload', file, reader.result,function(err,res){
         UIBlock.unblock();
        if(!err){
          swal({   title: "Estas Seguro de proceder?",   text: "Luego podras editar la importacion..",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#4ba42e",   confirmButtonText: "Si, cargar!",   closeOnConfirm: true },
               function(){
             UIBlock.block('Ingresando IMPORTACION DE DEBITOS, aguarde por favor...');
            Meteor.call('ingresarImportacion2',$("#descripcion").val(),$("input:checked").val(),$("#fechaCarga").val(),function(err,res){
							Router.go('/importarPagos');
							
            UIBlock.unblock();
          });
          });
          
        }
      });
   };
   reader.readAsBinaryString(file);
},
  'click #btnAgregar': function(){
        Router.go('/nuevoImportarPagos');
    },

});
AutoForm.hooks({

	'nuevoImportarPagos_': {
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha ingresado la importacion!", "success");
			Router.go('/importarPagos');

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	}
});
