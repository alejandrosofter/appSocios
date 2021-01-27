var consultarMeses=function(){
  Meteor.call("mensualCambioEstados",Number($("#anoSeleccion").val()),null,true,function(err,res){
      Session.set("resultadoMeses",res);
      	UIBlock.unblock();
    });
}
var consultarTotalesAno=function()
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("totalCambiosEstado",Session.get("anoSeleccion"),null,null,true,function(err,res){
      Session.set("totalAltas",res);
      consultarMeses();
    });
}
var consultarTotales=function(tipo,ano,mes)
{
  Meteor.call("getTotales",tipo,mes,ano,true,function(err,res){
      Session.set("total_"+tipo,res);
    });
}
var consultarTotalesMes=function(tipo,ano,mes)
{
  console.log("consultando "+ mes)
  Meteor.call("getTotales",tipo,mes,ano,false,function(err,res){
      Session.set("totalMes_"+tipo,res);
    });
}
var consultarDetalleMes=function(mes,tipo)
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  consultarTotales("ACTIVOS");
  consultarTotales("PARTICIPANTES",Session.get("anoSeleccion"),mes);
  consultarTotales("ADHERENTES",Session.get("anoSeleccion"),mes);
  
  consultarTotalesMes("ACTIVOS",Session.get("anoSeleccion"),mes);
  consultarTotalesMes("PARTICIPANTES",Session.get("anoSeleccion"),mes);
  consultarTotalesMes("ADHERENTES",Session.get("anoSeleccion"),mes);
  
  Meteor.call("totalCambiosEstado",Session.get("anoSeleccion"),mes,tipo,function(err,res){
      Session.set("itemsSeleccion",res);
     	UIBlock.unblock();
    });
}
var getTotalEstado=function(tipo,arr){
  if(arr)
  for(var i=0;i<arr.length;i++)
    if(arr[i]._id.estado===tipo)return arr[i].total;
  return 0;
}
Template.detalleMesSeleccion.helpers({
   
   "totalActivos_TOTAL":function()
  {
    return Session.get("total_ACTIVOS");
  },
   "totalAdherentes_TOTAL":function()
  {
    return Session.get("total_ADHERENTES");
  },
   "totalParticipantes_TOTAL":function()
  {
    return Session.get("total_PARTICIPANTES");
  },
  "totalActivos":function()
  {
    return Session.get("totalMes_ACTIVOS");
  },
  
  "totalParticipantes":function()
  {
    return Session.get("totalMes_PARTICIPANTES");
  },
  "totalAdherentes":function()
  {
    return Session.get("totalMes_ADHERENTES");
  },
})
Template.informeAltas.helpers({
 
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
    Session.set("totalParticipantes",0);
    Session.set("totalAdherentes",0);
    Session.set("totalActivos",0);
    return Session.get("itemsSeleccion");
  },
  "claseTotalAno":function(){
   
   if(Session.get("totalAltas")!==null)return "label-danger";
    return "label-default";
  },
  
  "totalAnoBajas":function(){
    
    if(Session.get("totalAltas")===null)return 0;
    return  getTotalEstado("BAJA",Session.get("totalAltas"));
  },
  "totalAnoAltas":function(){
    
     if(Session.get("totalAltas")===null)return 0;
    return  getTotalEstado("ALTA",Session.get("totalAltas"));
  }
});
Template.informeAltas.onRendered(function(){
  var d=new Date();
   Session.set("anoSeleccion",d.getFullYear());
  consultarTotalesAno();
});
Template.cadaMes.helpers({
  "mes":function(){
    return(this.mes.mesLetras);
  },
  "totalBajas":function(){
   
    if(this.mes.data!==null)return getTotalEstado("BAJA",this.mes.data);
    return 0;
  },
  "totalAltas":function(){
   
    if(this.mes.data!==null)return getTotalEstado("ALTA",this.mes.data);
    return 0;
  },
  
  "claseTotalMes":function(){
   
    if(this.mes.data!==null)return "label-primary";
    return "label-default";
  },
  
});
Template.filaDetalleMesSeleccion.helpers({
  "socio":function(){
    return this.apellido.toUpperCase()+" "+this.nombre;
  },
   "fecha":function(){
   var d=new Date(this.fecha);
     return d.toLocaleDateString();
  },
   "tipo":function(){
    return getTipoSocio(this.fechaNacimiento,this.esActivo);
  },
   "claseFila":function(){
    return this.estado==="BAJA"?"claseBaja":""
  },
   "estado":function(){
    return this.estado;
  },
  "edad":function(){
    return this.edad;
  },
  "nroSocio":function(){
    //console.log(this)
    return this.nroSocio;
  },
  
})
Template.informeAltas.events({
  "click .mesSeleccion":function(){
  Session.set("mesSeleccion",this.mes.mesLetras);
    console.log(this)
    consultarDetalleMes(this.mes.mes,null);
  },
  "click #imprimir":function(){
    import "/public/importar/printThis.js";
    $("#printArea").printThis({importCss:true,header:getHeader("DETALLE DE ALTAS/BAJAS"," de socios")})
  },
  "click .mesBajas":function(){
   Session.set("mesSeleccion",this.mes.mesLetras);
    consultarDetalleMes(this.mes.mes,"BAJA");
  },
  "click .mesAltas":function(){
   Session.set("mesSeleccion",this.mes.mesLetras);
    consultarDetalleMes(this.mes.mes,"ALTA");
  },
   "change #anoSeleccion":function(){
     Session.set("anoSeleccion",Number($("#anoSeleccion").val()));
   consultarTotalesAno();
  }
});