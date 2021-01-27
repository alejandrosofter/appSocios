var consultarMeses=function(){
  Meteor.call("mensualPagos",Number($("#anoSeleccion").val()),null,true,function(err,res){
      Session.set("resultadoMeses",res);
      	UIBlock.unblock();
    });
}
var consultarTotalesAno=function()
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("totalPagos",Session.get("anoSeleccion"),null,null,true,function(err,res){
      Session.set("totalPagos",res);
      consultarMeses();
    });
}
var consultarDetalleMes=function(mes,tipo)
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("totalPagos",Session.get("anoSeleccion"),mes,null,null,function(err,res){
      Session.set("itemsSeleccionPagos",res);
    console.log(res);
     	UIBlock.unblock();
    });
}
var getTotalEstado=function(tipo,arr){
  for(var i=0;i<arr.length;i++)
    if(arr[i]._id.estado===tipo)return arr[i].total;
  return 0;
}

Template.informePagos.helpers({
  "meses":function(){
    consultarMeses();
    return Session.get("resultadoMeses")
  },
  "anoSeleccion":function(){
    return Session.get("anoSeleccion");
  },
  "mesSeleccion":function(){
    return Session.get("mesSeleccion");
  },
  "itemsSeleccion":function(){
    return Session.get("itemsSeleccionPagos");
  },
  "claseTotalAno":function(){
   
   if(Session.get("totalPagos")!==null)return "label-primary";
    return "label-default";
  },
  
  "totalAno":function(){
    
    if(Session.get("totalPagos")===null)return 0;
    return  Session.get("totalPagos")[0].total;
  },
});
Template.informePagos.onRendered(function(){
  var d=new Date();
   Session.set("anoSeleccion",d.getFullYear());
  consultarTotalesAno();
});
Template.cadaMesPagos.helpers({
  "mes":function(){
    return(this.mes.mesLetras);
  },
  "totalMes":function(){
   
    if(this.mes.data!==null)return this.mes.data[0].total;
    return 0;
  },
  "claseTotalMes":function(){
   
    if(this.mes.data!==null)return "label-primary";
    return "label-default";
  },
  
});
Template.filaDetalleMesSeleccionPagos.helpers({
  "socio":function(){
    return this.apellido.toUpperCase()+" "+this.nombre;
  },
   "fecha":function(){
   var d=new Date(this.fecha);
     return d.getFecha();
  },
   "imagenSocio":function(){
    if(this.imagen===null) return "-"
     return  new Spacebars.SafeString("<img style='width:70px' class='img-circle' src='"+this.imagen[0].data+"' title='"+this.imagen[0].descripcion+"' />");
  },
  
})
Template.informePagos.events({
  "click .mesSeleccion":function(){
  Session.set("mesSeleccion",this.mes.mesLetras);
    console.log(this)
    consultarDetalleMes(this.mes.mes,true); //true es que es default
  },
  "click #imprimir":function(){
    import "/public/importar/printThis.js";
    $("#printArea").printThis({importCss:true,header:getHeader("DETALLE DE PAGOS"," por cualquier motivo")})
  },
  "click .mesPagos":function(){
   Session.set("mesSeleccion",this.mes.mesLetras);
    consultarDetalleMes(this.mes.mes,true);
  },
   "change #anoSeleccion":function(){
     Session.set("anoSeleccion",Number($("#anoSeleccion").val()));
   consultarTotalesAno();
  }
});