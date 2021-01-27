AutoForm.hooks({
'nuevoCbuSocios_': {

		onSuccess: function(operation, result, template) {
     Modal.hide();
swal("Bien!", "Se ha ingresado el registro!" , "success");
Session.set("cbuSeleccion",this.insertDoc);
Router.go("/cbuSociosAsignados/"+result) 
		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
	'nuevaAsignacionSocio_': {

		onSuccess: function(operation, result, template) {
     Modal.hide();
      actualizaCbuAsignadoSeleccion();
      
         console.log(this)
         Meteor.call("modificaSocioCbu",this.insertDoc.idSocio,this.docId,this.insertDoc.estaInactiva,function(err,res){
             
         });
swal("Bien!", "Se ha ingresado el registro!" , "success");
		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
	'modificaAsignacionSocio_': {

		onSuccess: function(operation, result, template) {
     Modal.hide();
      actualizaCbuAsignadoSeleccion();
swal("Bien!", "Se ha modificado el registro!" , "success");
		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
	'modificarCbuSocios_': {
 onSubmit: function (doc) {
      
				
        //return doc;
              
    },
	 after: {
    // Replace `formType` with the form `type` attribute to which this hook applies
   update: function(error, result) {console.log("cambiooo!")}
  },
		onSuccess: function(operation, result, template) {
     Modal.hide();
swal("Bien!", "Se ha ingresado el registro!" , "success");
		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},


	
});
Template.impresionCbuSocio.events({
	"click #btnPrint":function(){
		console.log("print");
		window.print()
	},
});




Template.impresionCbuSocio.rendered=function(){
   // console.log(this)
  Meteor.call("getSocio",this.data.idSocio,function(err,res){
       Session.set("socioImpresionCbu",res);
  })
}

Template.impresionCbuSocio.helpers({
	"razonSocial":function(){
	    
		return Session.get("cbuSeleccion").titular.toUpperCase();
	},
	"cuil":function(){
	    
		return Session.get("cbuSeleccion").cuil.toUpperCase();
	},
	"tipoCuenta":function(){
	    
		return Session.get("cbuSeleccion").tipoCuenta.toUpperCase();
	},
	"nroCuenta":function(){
	    
		return Session.get("cbuSeleccion").nroCuenta.toUpperCase();
	},
	"cbu":function(){
	    
		return Session.get("cbuSeleccion").cbu.toUpperCase();
	},
	"banco":function(){
	    
		return Session.get("cbuSeleccion").banco.toUpperCase();
	},
	"mes":function(){
	    console.log(this)
    	 var d=new Date(this.fechaInicio);
		var mes=(d.getMonth()+1===13)?1:(d.getMonth()+1)
		return mesLetras(mes);
	},
	"ano":function(){
		console.log(this);
		 		 var d=new Date(this.fechaInicio);
		return d.getFullYear();
	},
	"dia":function(){
		console.log(this);
				 var d=new Date(this.fechaInicio);
		return d.getDate();
	},
	"importe":function(){
	    var importe=getImporteSocioDatos(Session.get("socioImpresionCbu").fechaNacimiento,Session.get("socioImpresionCbu").esActivo)*1;
	    return importe.formatMoney(2,".")
	},
	"tipoSocio":function(){
	    var socio=Session.get("socioImpresionCbu");
		return getTipoSocio(socio.fechaNacimiento,socio.esActivo);
	},
	"nroSocio":function(){
	    var socio=Session.get("socioImpresionCbu");
		return socio.nroSocio;
	},
	"fechaDebito":function(){
				 var d=new Date(this.fechaInicio);
		
		return mesLetras(d.getMonth()+1)+" "+d.getFullYear();
	},
	"debita":function(){
	if(Session.get("cbuAsignadoSeleccionado").cbu)return Session.get("cbuAsignadoSeleccionado").cbu;
		return "NO";
	},

});
  Template.cbuSocios.onCreated(function () {
      var currentPage = new ReactiveVar(Session.get('current-page') || 0);
    this.currentPage = currentPage;
    this.autorun(function () {
    Session.set('current-page', currentPage.get());
  });
  
  })
Template.cbuSocios.rendered = function() {
    this.filter = new ReactiveTable.Filter('filtroBanco', ['banco']);
     this.filterCbu = new ReactiveTable.Filter('filtroCbu', ['cbu']);
     
     
};

Template.nuevoAsignacionCbuSocio.onRendered(function() {
    var id = Math.round((new Date()).getTime() / 1000);
    $("#idItem").val(id)
});

Template.cadaSocioCbu.events({
     "mouseover .cadaSocioNombreCbu": function (event, template) {
         var data=this;
         var consultado=$("#nombreSocio_"+data.idSocio).attr("consultado")=="";
         if(consultado)
      Meteor.call("getSocio",this.idSocio,function(err,res){
          
          var clase=getClaseTipoSocio(res.fechaNacimiento,res.esActivo,res.estado);
          $("#nombreSocio_"+data.idSocio).attr("consultado","si");
          $("#nombreSocio_"+data.idSocio).addClass(clase)
      })
      
   },
})
    
    
Template.cbuSocios.events({
    "change .estadoBancos": function (event, template) {
      var input = $(event.target).val();
     if(input=="")template.filter.set("");
     else template.filter.set({'$eq': input});
      
   },
   "click .seleccionar": function (event, template) {
    var seleccion=this.seleccionado?false:true;
      CbuSocios.update({_id:this._id},{$set:{seleccionado:seleccion}});
   },
   "click #btnBorrar": function (event, template) {
 swal({   title: "Ojo..",   text: "Estas Seguro de quitar todos los seleccionados?",   type: "success",   showCancelButton: true,   confirmButtonColor: "#4cae4c",   confirmButtonText: "Si, QUITARLO!",   closeOnConfirm: true },
               function(){
                     var bco=$(".estadoBancos").val();
                    var filtro=bco?{banco:bco,seleccionado:true}:{seleccionado:true};
                    UIBlock.block("Quitando cuentas seleccionadas...");
                    Meteor.call("quitarCuentasCbu",filtro,function(err,res){
                      UIBlock.unblock();
                        swal("Genial!","Se han quitado "+res+" cuentas!","success")
                    })
                    
    
         })
   },
   "click #btnInvertir": function (event, template) {
    var bco=$(".estadoBancos").val();
    var filtro=bco?{banco:bco}:{};
    console.log(filtro);
    var arr=CbuSocios.find(filtro).fetch();
    for(var i=0;i<arr.length;i++){
      var seleccion=arr[i].seleccionado?false:true;
     
      CbuSocios.update({_id:arr[i]._id},{$set:{seleccionado:seleccion}});
    }
    
   },
    "keyup #filtroCbu": function (event, template) {
      var input = $(event.target).val();
     if(input=="")template.filterCbu.set("");
     else template.filterCbu.set(new RegExp(input , 'i'));
      
   },
   
    "click #btnAgregar":function(){
         var act=this;
        Modal.show('nuevoCbuSocios',function(){ return act; });
    },
    'mouseover tr': function(ev) {
    $("#tablaCbuSocios").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  }
})

Template.cbuSocios.helpers({

    "sociosCbu":function()
    {
      return this.socios  
    },
    'settings': function(){
        return {
 collection: CbuSocios.find(),
 rowsPerPage: 10,
 currentPage: Template.instance().currentPage,
  filters: ['filtroBanco',"filtroCbu"], 
  showFilter:false,
 class: "table table-condensed",
 rowClass(  data ) {
    if(data.seleccionado){
      return "suspendido"
    }
  },
 fields: [
       {
        key: 'banco',
        label: 'Banco',
      
        headerClass: 'col-md-2',
      },
      {
        key: 'cbu',
        label: 'CBU  int',
        headerClass: 'col-md-1',
       // sortByValue:true,
        fn: function (value) { return parseInt(value); }
      },
      {
        key: 'cbu',
        label: 'CBU cuenta',
        headerClass: 'col-md-2',
       // sortByValue:true,
        fn: function (value) { return value; }
      },
 
      {
        key: 'titular',
        label: 'Titular',
      
        
      },
      {
          
        label: 'Socios',
            tmpl:Template.sociosCbuTempl,
//       fn: function (value, object, key) {
//           var sal="";
//           if(object.socios)
//          for(var i=0;i<object.socios.length;i++){
//               var estaBaja=object.socios[i].estaInactiva?" (<b>EN PROCESO BAJA</b>)":"";
//               sal+="<span class='socioAsociado' id='"+object.socios[i].idSocio+"'>"+object.socios[i].nombreSocio+estaBaja+"</spam><br>";
//          }
         
        
// 		return  new Spacebars.SafeString(sal)
//          },
        headerClass: 'col-md-3',
      },
  
    {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesCbuSocios
      }
 ]
 };
    },
  
});

var actualizaCbuAsignadoSeleccion=function()
{
    var obj=CbuSocios.findOne({_id:Session.get("cbuAsignadoSeleccionado")._id});

    var arr=obj.socios?obj.socios:[];
    Session.set("sociosCbus",arr);
    Session.set("cbuSeleccion",obj)
}

Template.cbuSociosAsignados.onRendered(function(){



    actualizaCbuAsignadoSeleccion()
});

Template.cbuSociosAsignados.helpers({
    "nroCbu":function()
    {
      return this.cbu
    },
    'settings': function(){
       
        return {
 collection: Session.get("sociosCbus"),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: false,
 fields: [
      {
        key: 'fechaInicio',
        label: 'Fecha Inicio',
        headerClass: 'col-md-2',
        fn: function (value, object, key) {
          var auxFe=value.getFecha();
		return  new Spacebars.SafeString("<span class=''> "+auxFe+"</span>")
         }
      },
       {
        key: 'nombreSocio',
        label: 'Socio',
       fn: function (value, object, key) {
           var estaBaja=object.estaInactiva?" (<b>EN PROCESO BAJA</b>)":"";
		return  new Spacebars.SafeString("<span class=''> "+value+estaBaja+"</span>")
         }
        
      },
     
 
      {
        key: 'estaInactiva',
        label: 'Estado CBU',
        headerClass: 'col-md-2',
       fn: function (value, object, key) {
           console.log(object)
           
           var auxFe=object.fechaFinaliza?object.fechaFinaliza.getFecha():"S/f";
           
          if(value)return new Spacebars.SafeString("<span class='label label-danger'> INACTIVA desde "+auxFe+"</span>")
		return  new Spacebars.SafeString("<span class='label label-success'> ACTIVA</span>")
         }
        
      },
  
    {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesAsignacionSocios
      }
 ]
 };
    },
  
});
Template.cbuSociosAsignados.events({
     "click #btnAgregar":function(){
         var act=this;
        Modal.show('nuevoAsignacionCbuSocio',function(){ return act; });
    },
    'mouseover tr': function(ev) {
    $("#tablaCbuSociosAsignados").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  }
})
Template.nuevoAsignacionCbuSocio.rendered = function() {
  Meteor.typeahead.inject();
};

Template.cadaSocioBuscador.helpers({
    "clase":function()
    {
        return getClaseTipoSocio(this.fechaNacimiento,this.esActivo,this.estado);
    }
})
Template.nuevoAsignacionCbuSocio.helpers({
    "buscadorSocios" : function(query, sync, callback) {
      Meteor.call('buscadorSocios', query, {}, function(err, res) {
        callback(res.map(function(v){ return v; }));
      });
    },
    "socioSeleccion": function(event, suggestion, datasetName) {
   $("#idSocio").val(suggestion._id);
   
   $("#buscaSocio").attr("placeholder",suggestion.apellido+" "+suggestion.nombre);
   $("#nombreSocio").val(suggestion.apellido+" "+suggestion.nombre)
  },
  
  
})
Template.nuevoAsignacionCbuSocio.events({
    
	"click #estaInactiva":function(){
	var ok=$('#estaInactiva' ).is(":checked")
		if(ok)$("#fechaFin").show();else $("#fechaFin").hide();
	},

})
var buscarIndice=function(busca)
{ 
    var arr=Session.get("cbuAsignadoSeleccionado").socios;
	for (var i = 0; i < arr.length; i++)
		if(arr[i]._id==busca)return i;
	return -1;
}
Template.modificarAsignacionCbuSocio.rendered = function() {
  Meteor.typeahead.inject();
};
Template.modificarAsignacionCbuSocio.events({
      "click #estaInactiva":function(){
	    var ok=$('#estaInactiva' ).is(":checked")
		if(ok){
		 $("#fechaFin").show();
		}
		    else $("#fechaFin").hide();
	},
	
})
Template.modificarAsignacionCbuSocio.helpers({
     "socioSeleccion": function(event, suggestion, datasetName) {
   $("#idSocio").val(suggestion._id);
   
   $("#buscaSocio").attr("placeholder",suggestion.apellido+" "+suggestion.nombre);
   $("#nombreSocio").val(suggestion.apellido+" "+suggestion.nombre)
  },
  
	"docu":function(){
	     return Session.get("cbuAsignadoSeleccionado")
	},
	   "buscadorSocios" : function(query, sync, callback) {
      Meteor.call('buscadorSocios', query, {}, function(err, res) {
        callback(res.map(function(v){ return v; }));
      });
    },
    "socioSeleccion": function(event, suggestion, datasetName) {
       $("#idSocio").val(suggestion._id); 
       $("#buscaSocio").attr("placeholder",suggestion.apellido+" "+suggestion.nombre);
       $("#nombreSocio").val(suggestion.apellido+" "+suggestion.nombre)
  },
  
	"muestraFechaFin":function(){
		if(this.estaInactiva)return "";
		return "display:none"
	},
  "eti_idSocio":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'socios.'+ind+'.idSocio';
	},
	"eti_nombreSocio":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'socios.'+ind+'.nombreSocio';
	},
	"eti_comentario":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'socios.'+ind+'.comentario';
	},
	"eti_fechaInicio":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'socios.'+ind+'.fechaInicio';
	},
	
	"eti_estaInactiva":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
		console.log("indi:"+ind)
	return 'socios.'+ind+'.estaInactiva';
	},
	"eti_fechaFinaliza":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
		console.log("indi:"+ind)
	return 'socios.'+ind+'.fechaFinaliza';
	},
	
})
Template.accionesAsignacionSocios.events({
	  "click .delete":function(){
			var data=this;
				 swal({   title: "Estas Seguro de quitar el registro?",   text: "",   type: "success",   showCancelButton: true,   confirmButtonColor: "#4cae4c",   confirmButtonText: "Si, QUITARLO!",   closeOnConfirm: true },
               function(){
                     Meteor.call("quitarSocioCbuAsociado",Session.get("cbuAsignadoSeleccionado")._id,data._id,data.idSocio,function(err,res){
                     actualizaCbuAsignadoSeleccion();
					 swal("Bien!","El registro se ha quitado!","success")
                   })
                   
				 })
   
		},
		"click .update":function(){
		    var act=this;
        Modal.show('modificarAsignacionCbuSocio',function(){ return act; });
		},
		"click .imprimir":function(){
		    var act=this;
        console.log(act)
        Modal.show('impresionCbuSocio',function(){ return act; });
		}
	
})
Template.accionesCbuSocios.events({
	  "click .delete":function(){
			var id=this._id;
				 swal({   title: "Estas Seguro de quitar el registro?",   text: "",   type: "success",   showCancelButton: true,   confirmButtonColor: "#4cae4c",   confirmButtonText: "Si, QUITARLO!",   closeOnConfirm: true },
               function(){
					 CbuSocios.remove({_id:id});
					 swal("Bien!","El registro se ha quitado!","success")
				 })
   
		},
		"click .update":function(){
		    var act=this;
        Modal.show('modificarCbuSocios',function(){ return act; });
		},
		"click .verSocios":function(){
		    var act=this;
		    Session.set("cbuSeleccion",this);
        Router.go('/cbuSociosAsignados/'+this._id);
		}
	
})