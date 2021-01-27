var consultarMeses=function(){
  Meteor.call("mensualDebitosAutomaticos",Number($("#anoSeleccion").val()),null,true,function(err,res){
      Session.set("resultadoMeses",res);
      	UIBlock.unblock();
    });
}
var consultarTotalesAno=function()
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("totalDebitosAutomaticos",Session.get("anoSeleccion"),null,null,true,function(err,res){
      Session.set("totalDebitos",res);
      consultarMeses();
    });
}
var consultarDetalleMes=function(mes,tipo)
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("totalDebitosAutomaticos",Session.get("anoSeleccion"),mes,null,null,function(err,res){
      Session.set("itemsSeleccionDebitos",res);
    console.log(res);
     	UIBlock.unblock();
    });
}
var getTotalEstado=function(tipo,arr){
  for(var i=0;i<arr.length;i++)
    if(arr[i]._id.estado===tipo)return arr[i].total;
  return 0;
}

Template.informeDebitos.helpers({
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
    return Session.get("itemsSeleccionDebitos");
  },
  "claseTotalAno":function(){
   
   if(Session.get("totalDebitos")!==null)return "label-primary";
    return "label-default";
  },
  
  "totalAno":function(){
    
    if(Session.get("totalDebitos")===null)return 0;
    return  Session.get("totalDebitos")[0].total;
  },
});
Template.informeDebitos.onRendered(function(){
  var d=new Date();
   Session.set("anoSeleccion",d.getFullYear());
  consultarTotalesAno();
});
Template.cadaMesDebito.helpers({
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
Template.filaDetalleMesSeleccionDebito.helpers({
  "socio":function(){
    return this.apellido.toUpperCase()+" "+this.nombre;
  },
   "fecha":function(){
   var d=new Date(this.fecha);
     return d.toLocaleDateString();
  },
   "tipo":function(){
    return this.estado;
  },
  
})
Template.informeDebitos.events({
  "click .mesSeleccion":function(){
  Session.set("mesSeleccion",this.mes.mesLetras);
    console.log(this)
    consultarDetalleMes(this.mes.mes,true); //true es que es default
  },
  "click #imprimir":function(){
    import "/public/importar/printThis.js";
    $("#printArea").printThis({importCss:true,header:getHeader("DETALLE DE DEBITOS"," automaticos")})
  },
  "click .mesDebitos":function(){
   Session.set("mesSeleccion",this.mes.mesLetras);
    consultarDetalleMes(this.mes.mes,true);
  },
   "change #anoSeleccion":function(){
     Session.set("anoSeleccion",Number($("#anoSeleccion").val()));
   consultarTotalesAno();
  }
});