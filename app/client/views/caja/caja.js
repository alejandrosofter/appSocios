/*eslint-disable forbiddenExportImport */

var getSeleccionActividades=function()
{
  var sal=[];
  var items=$('#acts_').find(':selected');
  var act=Actividades.findOne({nombreActividad:Meteor.user().profile});
 // if(act)return [act._id]; // CASO DE QUE SEA PERFIL DE ACTIVIDAD
  for(var i=0;i<items.length;i++) sal.push($(items[i]).val());
  
  return sal;
}
var getSumImporte=function(items,campo)
{
	var sum=0;
	 for(var i=0;i<items.length;i++){
		 console.log(items[i])
		 sum+=Number(items[i][campo]);
	 }
	return sum;
}
var getActs=function(acts,importeCuotaSocial){
	 var aux="";
       if(importeCuotaSocial>0)aux+="PAGO CUOTA SOCIAL: $ "+importeCuotaSocial;
       if(acts)
       for(var i=0;i<acts.length;i++){
         var act=Actividades.findOne({_id:acts[i].idActividad}).nombreActividad;
         aux+=" PAGO "+act+" $ "+acts[i].importe;
       }
	return aux;
}
var ripDatos=function(items)
{
	var arr=[];
	 for(var i=0;i<items.length;i++){
		 
		 var nom=items[i].apellido.toUpperCase()+", "+items[i].nombre;
		 var acts=getActs(items[i].actividades,items[i].importeCuotaSocial);
		 var aux={id:items[i].id,quien:nom,detalle:acts,importeDebe:0,importeHaber:items[i].importe};
		 console.log(aux)
		 arr.push(aux);
	 }
	return arr;
}
var buscarItemsCaja=function(esGeneral)
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  var arr=$("#fechaCierre").val();
	if(!esGeneral){
	    var arr=$("#fechaCierre").val().split("-");
	    var fe=arr[2]+"/"+arr[1]+"/"+arr[0];
		Meteor.call("buscarCaja",fe,null,[],"EFECTIVO",true,function(err,res){
		res=ripDatos(res);
    Session.set("itemsCaja",res);
		$("#importeDebe").val(0)
		$("#importeHaber").val(getSumImporte(res,"importeHaber"))
    UIBlock.unblock();
  })
	}else{
		console.log(arr)
		 Meteor.call("buscarCajaGeneral",$("#fechaCierre").val(),function(err,res){
		
    Session.set("itemsCaja",res);
		$("#importeDebe").val(getSumImporte(res,"importeDebe"))
		$("#importeHaber").val(getSumImporte(res,"importeHaber"))
    UIBlock.unblock();
  })
	}
  
}
var buscarCaja=function()
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  console.log()
  Meteor.call("buscarCaja",$("#fechaDesde").val(),$("#fechaHasta").val(),getSeleccionActividades(),$('select[name=formaPago_]').val(),$('#soloMias').is(':checked'),function(err,res){
    Session.set("itemsCaja",res);
		
    UIBlock.unblock();
  })
}
var cambiaEstadoItems=function(caja)
{
	
}
AutoForm.hooks({

	'nuevoCierre_': {
		before:{
      insert: function(doc) {
				doc.items=Session.get("itemsCaja");
				return doc;
			},
		},
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			
			Modal.hide();
			swal("GENIAL!", "Se ha ingresado el registro!", "success");
			Router.go('/cierreCajas');

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	}
});

Template.filaItemCaja.helpers({
  "importeFinal":function(){
    return (this.importe).formatMoney(2);
  },
  "diaCaja":function(){
   return Session.get("diaCaja")
  },
  "fecha":function()
  {
    return this.fecha.getFecha2();  
  },

  "mesCaja":function(){
   return Session.get("mesCaja")
  },
  "anoCaja":function(){
   return Session.get("anoCaja") 
  },
  "acts":function(){
    var sa=""
    console.log(this.actividades)
    for(let key in this.actividades){
      var aux=Actividades.findOne({_id:this.actividades[key].idActividad});
      if(aux)sa+=aux.nombreActividad+", "
    }
    if(sa==="")return "-"
    return sa
      
  },
  "concepto":function()
  {
    var conc="";
    if(this.importeCuotaSocial>0)conc+="PAGO CUOTA SOCIAL ";
    if(this.tieneActividades>0)conc+="PAGO ACTIVIDADES ";
    if(this.detalle)conc+="("+this.detalle+")";
    
    return conc;
  },
  "formaDePago":function()
  {
    
    return this.formaPago
  },
  "socioCaja":function()
  {
    return this.apellido.toUpperCase()+", "+this.nombre+"("+this.nroSocio+")"
  }
  
})
Template.filaTipoPago.events({
  "click .cerrarCaja":function()
  {
    var fecha=new Date($("#anoCaja").val(),$("#mesCaja").val()-1,$("#diaCaja").val());
    var importeAux=0;
    for(var i=0;i<Session.get("itemsCaja").length;i++)
      importeAux+=Session.get("itemsCaja")[i].importe;
      
    var val={items:Session.get("itemsCaja"),usuario:Meteor.user()._id,esCajaGral:false,fechaCierre:fecha,importe:importeAux}
      Modal.show('cerrarCaja',function(){
			return val;
			
		});
  }
})
Template.cierreCajas.events({
	"click #btnAgregar":function(){
		 var val={items:[],usuario:Meteor.user()._id,esCajaGral:false,fechaCierre:new Date(),importe:0}
      Modal.show('cerrarCaja',function(){
			return val;
			
		});
	}
})
Template.cerrarCaja.rendered=function(){
	var esGral=$('#esCajaGral').prop('checked');
	buscarItemsCaja(esGral);
}
Template.accionesCierreCajaItems.events({
	"click .deleteItem":function()
	{
		var id=this._id;
		var arr=Session.get("itemsCaja");
		for(var i=0;i<arr.length;i++)
			if(arr[i]._id===id)arr.splice(i,1);
		Session.set("itemsCaja",arr);
	//***
	}
})
Template.cerrarCaja.events({
	"click #btnAgregarItem":function()
	{
		var detalle=$("#detalle_insert").val();
		var importeDebe=$("#importeDebe_insert").val();
		var importeHaber=$("#importeHaber_insert").val();
		var quien=$("#quien_insert").val();
		if(detalle!=="" && importeDebe!==""&&importeHaber!==""&& quien!==""){
			var id=Meteor.uuid();
			var aux={_id:id,detalle:detalle,importeDebe:importeDebe,importeHaber:importeHaber,quien:quien,esCargadoLocal:true,fecha:new Date()};
			console.log(aux)
			var arr=Session.get("itemsCaja");
	    if(arr.length===0)arr=[];
			arr.push(aux);
			Session.set("itemsCaja",arr);
		
		//REFRESCO IMPORTES GRALES
		$("#importeDebe").val(getSumImporte(arr,"importeDebe"));
		$("#importeHaber").val(getSumImporte(arr,"importeHaber"));
		
		$("#detalle_insert").val("");
		$("#importeDebe_insert").val("");
		$("#importeHaber_insert").val("");
		$("#quien_insert").val("");
		}else swal("Ops..","Hay campos incompletos, completalos y vuelve a intentar","error")
		
	},
  'click #btnAgregar': function(){
    var val=this;
   
    },
	"click #esCajaGral":function()
	{
		var esGral=$('#esCajaGral').prop('checked');
		console.log(esGral)
		buscarItemsCaja(esGral)
	},
 'change #fechaCierre': function(ev) {
	 var esGral=$('#esCajaGral').prop('checked');
    buscarItemsCaja(esGral)
  },
  'mouseover tr': function(ev) {
    $("#tablaItemsCaja").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ PlanesEmpresa.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },


});
Template.cierreCajas.helpers({
	'settings': function(){
        return {
 collection: CierreCaja.find(),
 rowsPerPage: 100,
 class: "table table-condensed",
 showFilter: false,
 fields: [
   {
        key: 'created',
		 sortOrder: 0, sortDirection: 'descending' ,hidden: true,
      },
	   {
        key: 'fechaCierre',
			 label:"Fecha",
         fn: function (value, object, key) {
         if(value)  return value.getFecha2();
					 return "-"
         },
      },
      {
        key: 'detalle',
        label: 'Detalle',
         fn: function (value, object, key) {
          if(!value)return "-";
					 return value
       
         },
      },
	 {
        key: 'usuario',
        label: 'Caja de ?...',
         fn: function (value, object, key) {
              console.log(value)
          if(!value)return "-";
         
					 var us=Meteor.users.findOne({_id:value});
					 
					 if(object.esCajaGral)return "CAJA GRAL";
					 if(us) return us.username;
       return "-"
         },
      },
     {
        key: 'importeDebe',
        label: '$ Egreso',
         headerClass: 'col-md-1',
      fn: function (value, object, key) {
       
        return value.formatMoney(2)
         },
        
      },
   {
        key: 'importeHaber',
        label: '$ Ingreso',
       headerClass: 'col-md-1',
      fn: function (value, object, key) {
       
        return value.formatMoney(2)
         },
        
      },

   {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesCierreCajas
      }
  
 ]
 };
    }

})
Template.imprimirCierreCaja.events({
	"click #btnPrint":function(){
		window.print()
	},
})
Template.imprimirCierreCaja.helpers({
		"mes":function(){
		var d=new Date();
		return mesLetras(d.getMes());
	},
	"ano":function(){
		console.log(this);
		 var d=new Date();
		return d.getAno();
	},
	"dia":function(){
		console.log(this);
		 var d=new Date();
		return d.getDia();
	},
	"esCajaGral":function()
	{
		if(this.esCajaGral)return "SI";
		return "NO"
	},
	"fechaCierre":function()
	{
		return this.fechaCierre.getFecha()
	},
	"detalle":function()
	{
		if(this.detalle==="") return "-";
		return this.detalle;
	},
	"importeDebe":function()
	{
	  return this.importeDebe.formatMoney(2)
	},
	"importeHaber":function()
	{
	  return this.importeHaber.formatMoney(2)
	},
	"importeSaldo":function()
	{
	  return (this.importeHaber-this.importeDebe).formatMoney(2)
	},
	"usuario":function()
	{
		if(this.esCajaGral) return "CAJA GENERAL";
		
		var usuario=Meteor.users.findOne({_id:this.usuario});
		if(usuario)return usuario.username;
		return "-"
	}
})
Template.accionesCierreCajas.events({
	"click .imprimir":function()
	{
		var val=this;
		Modal.show('imprimirCierreCaja',function(){
			return val;
			
		});
	
	},
	"click .quitar":function()
	{
		var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ CierreCaja.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

	
	}
})
Template.cerrarCaja.helpers({
	
  "cantidadItems":function(){
      if(Session.get("itemsCaja"))
    return Session.get("itemsCaja").length
  },
   "usuario":function(){
    return this.usuario
  },
  "importeHaber":function(){
    return this.importe
  },
   "importeDebe":function(){
    return 0
  },
  "fechaCierre":function(){
    return this.fechaCierre
  },
   "esCajaGral":function(){
    return this.esCajaGral
  },
   'settings': function(){
        return {
 collection: Session.get("itemsCaja"),
 rowsPerPage: 100,
 class: "table table-condensed",
 showFilter: false,
 fields: [
   {
        key: 'quien',
        label: 'Quien?...',
       headerClass: 'col-md-3',
         fn: function (value, object, key) {
       
        return value
         },
      },
      {
        key: 'detalle',
        label: 'Detalle',
         fn: function (value, object, key) {
           return value
         },
      },
     {
        key: 'importeDebe',
        label: '$ Egreso',
         headerClass: 'col-md-1',
      fn: function (value, object, key) {
       
        return Number(value).formatMoney(2)
         },
        
      },
   {
        key: 'importeHaber',
        label: '$ Ingreso',
       headerClass: 'col-md-1',
      fn: function (value, object, key) {
       
        return Number(value).formatMoney(2)
         },
        
      },

   {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesCierreCajaItems
      }
  
 ]
 };
    }
})
Template.filaTipoPago.helpers({
  "detalleForma":function()
  {
    return this.tipo
  },
  "tieneDatos":function()
  {
    return this.tipo!="undefined"
  },
   "importeForma":function()
  {
    return this.importe.formatMoney(2)
  }
})
Template.caja.rendered=function(){
  
   $("#fechaDesde").datepicker({format: 'dd/mm/yyyy',clearBtn:true,autoclose:true,todayHighlight:true});
   $("#fechaHasta").datepicker({format: 'dd/mm/yyyy',clearBtn:true,autoclose:true,todayHighlight:true});
   
   var hoy=new Date();
$("#fechaDesde").val(hoy.getFecha());
  $("#acts_").select2({multiple:true,placeholder:"Excluir Actividades..."});
  $('#acts_').val(null).trigger('change');
   $("#formaPago_").select2();
}
Template.caja.helpers({
  'esAdmin': function(){
     if(!Meteor.user())return false;
     if(Meteor.user().profile==="admin")return true;
       return false;
     },
  "veoAdmin":function()
  {
    if(Meteor.user().profile==="admin") return "";
    return "none"
  },
    "seleccionado":function(res)
  {
    console.log(this)
  },
  "actividades":function(){
    return Actividades.find();
  },
  "items":function()
  {
    return Session.get("itemsCaja")
  },
  "importeTotal":function(){
    var sum=0;
   for(var i=0;i<Session.get('itemsCaja').length;i++)
     sum+=Session.get('itemsCaja')[i].importe;
    return sum.formatMoney(2)
  },
  "porTipoPagos":function(){
    var aux=[];
   for(var i=0;i<Session.get('itemsCaja').length;i++){
     var importe1=Number(Session.get('itemsCaja')[i].importe);
     var importe2=Number(Session.get('itemsCaja')[i].importe2);
     
     var prev1=aux[Session.get('itemsCaja')[i].formaPago]?aux[Session.get('itemsCaja')[i].formaPago]:0;
     aux[Session.get('itemsCaja')[i].formaPago]=prev1+importe1;
     
      var prev2=aux[Session.get('itemsCaja')[i].formaPago2]?aux[Session.get('itemsCaja')[i].formaPago2]:0;
     aux[Session.get('itemsCaja')[i].formaPago2]=prev2+importe2;
     
   }
    var salida=[];
   for (let key in aux) {
    salida.push({tipo:key, importe:aux[key]})
     
}
    console.log(salida)
    return salida
  },
  
})
Template.caja.events({
  "click #imprimir":function(){
    import "/public/importar/printThis.js";
    var dia=$("#fechaDesde").val().split("/");
    $("#printArea").printThis({importCss:true,header:getHeader("RESUMEN DE CAJA "+dia[0]+"/"+dia[1]+"/"+dia[2]," ")})
  },
  "click #btnBusca":function(){
    Session.set("fechaDesde",$("#fechaDesde").val() );
    Session.set("fechaHasta",$("#fechaHasta").val() );
    buscarCaja()
  }
  
})