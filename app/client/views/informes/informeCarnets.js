var consultarMeses=function(){
  Meteor.call("mensualCarnets",Number($("#anoSeleccion").val()),null,true,function(err,res){
      Session.set("resultadoMeses",res);
      	UIBlock.unblock();
    });
}
var consultarTotalesAno=function()
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("totalCarnets",Session.get("anoSeleccion"),null,null,true,function(err,res){
      Session.set("totalCarnets",res);
      consultarMeses();
    });
}
var consultarDetalleMes=function(mes,tipo)
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("totalCarnets",Session.get("anoSeleccion"),mes,null,null,function(err,res){
      Session.set("itemsSeleccionCarnets",res);
    console.log(res);
     	UIBlock.unblock();
    });
}
var getTotalEstado=function(tipo,arr){
  for(var i=0;i<arr.length;i++)
    if(arr[i]._id.estado===tipo)return arr[i].total;
  return 0;
}

Template.informeCarnets.helpers({
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
    return Session.get("itemsSeleccionCarnets");
  },
  "claseTotalAno":function(){
   
   if(Session.get("totalCarnets")!==null)return "label-primary";
    return "label-default";
  },
  
  "totalAno":function(){
    
    if(Session.get("totalCarnets")===null)return 0;
    return  Session.get("totalCarnets")[0].total;
  },
});
Template.informeCarnets.onRendered(function(){
  var d=new Date();
   Session.set("anoSeleccion",d.getFullYear());
  consultarTotalesAno();
});
Template.cadaMesCarnets.helpers({
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
Template.filaDetalleMesSeleccionCarnets.helpers({
  "socio":function(){
    return this.apellido.toUpperCase()+" "+this.nombre;
  },
   "fecha":function(){
   var d=new Date(this.fecha);
     return d.toLocaleDateString();
  },
   "imagenSocio":function(){
    if(this.imagen===null) return "-"
     return  new Spacebars.SafeString("<img style='width:70px' class='img-circle' src='"+this.imagen[0].data+"' title='"+this.imagen[0].descripcion+"' />");
  },
  
})
Template.informeCarnets.events({
  "click .mesSeleccion":function(){
  Session.set("mesSeleccion",this.mes.mesLetras);
    console.log(this)
    consultarDetalleMes(this.mes.mes,true); //true es que es default
  },
  "click #imprimir":function(){
    import "/public/importar/printThis.js";
    $("#printArea").printThis({importCss:true,header:getHeader("DETALLE DE CAERNETS"," automaticos")})
  },
  "click .mesCarnets":function(){
   Session.set("mesSeleccion",this.mes.mesLetras);
    consultarDetalleMes(this.mes.mes,true);
  },
   "change #anoSeleccion":function(){
     Session.set("anoSeleccion",Number($("#anoSeleccion").val()));
   consultarTotalesAno();
  }
});