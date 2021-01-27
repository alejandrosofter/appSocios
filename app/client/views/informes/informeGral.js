var getImporte=function(arr,tipo)
{
  for(var i=0;i<arr.length;i++)
    if(arr[i].formaPago==tipo)return arr[i].importe*1;
  return 0
}
var getImporteTotalActividad=function(idActividad)
{
  var arr= Session.get("consultarDatosGral");
  if(arr)
  for(var i=0;i<arr.length;i++)
    if(arr[i].idActividad==idActividad)return arr[i].total;
  return 0;
}
var getImporteActividad=function(idActividad)
{
  var arr= Session.get("consultarDatosGral");
  if(arr)
  for(var i=0;i<arr.length;i++)
    if(arr[i].idActividad==idActividad)return arr[i].importe;
  return 0;
}
var getDataActividad=function(idActividad)
{
  var arr= Session.get("consultarGeneralActividad_gral");
  if(arr)
  for(var i=0;i<arr.length;i++)
    if(arr[i].idActividad==idActividad)return arr[i];
  return null;
}
var ripDataGralActividad=function(arr)
{
  var sal=[];
  console.log(arr)
  if(arr)
  for(var i=0;i<arr.length;i++){
    var actAux=Actividades.findOne({_id:arr[i]._id.idActividad});
    var importeEstimado=actAux?(actAux.importe*arr[i].cantidad):0;
    var importeCobrado=getImporteTotalActividad(arr[i]._id.idActividad);
    var importeCobrar=importeEstimado-importeCobrado;
    
    var aux={
      idActividad:arr[i]._id.idActividad,
      nombreActividad:actAux?actAux.nombreActividad:"s/n",
      cantidad:arr[i].cantidad,
      importeEstimado:importeEstimado,
      importeCobrado:importeCobrado,
      importeCobrar:importeCobrar,

    };
    sal.push(aux);
  }
    
  return sal
}
var ripGral=function(arr)
{
  var sal=[];
  for(var i=0;i<arr.length;i++){
    var aux=arr[i];
    var id = (Math.round((new Date()).getTime() / 1000)+i)+"";
    aux._id=id;
    sal.push(aux)
  }
  return sal

}
var ripData=function(arr)
{
  var sal=[];
  if(arr)
  for(var i=0;i<arr.length;i++){
    var data=getDataActividad(arr[i]._id.idActividad);
    var actividad=Actividades.findOne({_id:arr[i]._id.idActividad});
    var aux={
      formaDePago:arr[i]._id.formaDePago,
      actividad:arr[i]._id.idActividad,
      nombreActividad:actividad?actividad.nombreActividad:"-",
      cantidadPagos:arr[i].cantidad,
      idActividad:arr[i]._id.idActividad,
      cantidadSocios:(data?data.cantidad:0),
      importeEstimado:(data?data.importeEstimado:0),
      importaCobrar:(data?data.importeCobrar:0),
      importePosnet:arr[i].importePosnet,
      importeEfectivo:arr[i].importeEfectivo,
      importeOtros:arr[i].importeOtros,
      importeChubut:arr[i].importeChubut

    };

    aux.total=aux.importePosnet+aux.importeEfectivo+aux.importeOtros+aux.importeChubut;
  
    sal.push(aux);
  }
    
  return sal
}
var ripDataGralCuotaSocial=function(arr)
{
  var sal=[];
  console.log(arr)
  for(var i=0;i<arr.length;i++){
    var aux={
      tipoSocio:arr[i]._id.tipoSocio,
      formaPago:arr[i]._id.formaPago,
      cantidad:arr[i].cantidad,
      importe:arr[i].importe,
      importeEfectivo:arr[i].importeEfectivo,
      importeOtros:arr[i].importeOtros,
      importeChubut:arr[i].importeChubut,
      importePosnet:arr[i].importePosnet,
      importeEfectivo:arr[i].importeEfectivo,
      importeOtros:arr[i].importeOtros,
      importeChubut:arr[i].importeChubut

    };
    aux.total=aux.importeEfectivo+aux.importeOtros+aux.importeChubut+aux.importePosnet;
    sal.push(aux);
  }
    
  return sal
}
var ripPlanesEmpresa=function(arr)
{
  var sal=[];
  for(var i=0;i<arr.length;i++){
    var plan=PlanesEmpresa.findOne({_id:arr[i]._id.planEmpresa}).nombrePlanEmpresa;
    var aux={
      planEmpresa:arr[i]._id.planEmpresa,
      nombrePlanEmpresa:plan,
      cantidad:arr[i].cantidad,

    };
    sal.push(aux);
  }
    
  return sal
}
var ripPlanesEmpresaTipo=function(arr)
{
  var sal=[];
  for(var i=0;i<arr.length;i++){
    var aux={
      tipoSocio:arr[i]._id.tipoSocio,
      cantidad:arr[i].cantidad,

    };
    sal.push(aux);
  }
    
  return sal
}

var consultarGeneral=function(contenedor,agrupa,idActividad)
{
  // console.log("ACT:"+idActividad)
  //   UIBlock.block('Consultando datos de actividades, aguarde un momento...'+idActividad);
    var mes=mesNumeros($("#mes").val());
    var ano=$("#anoSeleccion").val()*1;
    Meteor.call("consultarGeneralActividad",mes,ano,agrupa,idActividad,function(err,res){
      res=agrupa?ripDataGralActividad(res):res;
      Session.set("consultarGeneralActividad_"+contenedor,res);
      consultar();
      UIBlock.unblock()
    });
}
var consultar=function()
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  var mes=mesNumeros($("#mes").val());
  var ano=$("#anoSeleccion").val()*1;
  Meteor.call("consultarDatosGral",mes,ano,true,function(err,res){
     res=ripData(res);
      Session.set("consultarDatosGral",res);
      UIBlock.unblock()
      consultaCuotaSocial()
    });
}
var consultaCuotaSocial=function()
{
    UIBlock.block('Consultando datos por cuota social, aguarde un momento...');
  var mes=mesNumeros($("#mes").val());
  var ano=$("#anoSeleccion").val()*1;
  Meteor.call("consultaCuotaSocial",mes,ano,true,function(err,res){
      res=ripDataGralCuotaSocial(res);
      Session.set("consultaCuotaSocial",res);
      UIBlock.unblock();
      consultaPlanesEmpresa();
    });
}
var consultaPlanesEmpresa=function()
{
    UIBlock.block('Consultando datos por planes empresa, aguarde un momento...');
  var mes=mesNumeros($("#mes").val());
  var ano=$("#anoSeleccion").val()*1;
  Meteor.call("consultaPlanesEmpresa",mes,ano,true,function(err,res){
      res=ripPlanesEmpresa(res);
      Session.set("consultaPlanesEmpresa",res);
      consultaPlanesEmpresaTipoSocio();
      UIBlock.unblock()
    });
}
var consultaPlanesEmpresaTipoSocio=function()
{
    UIBlock.block('Consultando cantidad de socios, aguarde un momento...');
  var mes=mesNumeros($("#mes").val());
  var ano=$("#anoSeleccion").val()*1;
  Meteor.call("consultaCantidadSocios",mes,ano,true,function(err,res){
    console.log(res)
      res=ripPlanesEmpresaTipo(res);
      Session.set("consultaPlanesEmpresaTipoSocio",res);
      UIBlock.unblock()
    });
}
Template.cantidadSociosInforme.rendered=function()
{

  consultarGeneral("porActividad",false,this.data.actividad)
}
Template.cantidadSociosInforme.helpers({
  'settings': function(){
        return {
 collection: Session.get("consultarGeneralActividad_porActividad"),
 rowsPerPage: 30,
 class: "table table-condensed",
 showNavigation:"auto",
 showNavigationRowsPerPage:false,
 showFilter: false,


// rowClass(  data ) {
//     if(data.estado=="BAJA"){
//       return "deshabilitado"
//     }
//      if(data.estado=="SUSPENDIDO"){
//       return "suspendido";
//     }
//   },
 fields: [
  {
        key: 'apellido',
        label: 'SOCIO',
       
        fn:function(val,obj){
          return obj.nroSocio
        }
      },
      {
        key: 'apellido',
        label: 'SOCIO',
       
        fn:function(val,obj){
          return obj.apellido+" "+obj.nombre
        }
      },

   {
        key: 'tipoSocio',
        label: 'Tipo Socio',
         headerClass: 'col-md-2',
      },
        {
        key: 'estaBaja',
        label: 'ESTA BAJA?',
        headerClass: 'col-md-2',
        fn:function(val,obj){ return val?"SI":"NO"}
      },
 ]
 };
    }
})
Template.cantidadSociosTmpl.events({
  "click .cantidadSocios":function(e)
  {
        var data=this;
 Modal.show("cantidadSociosInforme",function(){
  return data
 })
  }
})
Template.informeGral.helpers({
  'settingsCuotaSocial': function(){
        return {
 collection: Session.get("consultaCuotaSocial"),
 rowsPerPage: 30,
 class: "table table-condensed",
 showNavigation:"auto",
 showNavigationRowsPerPage:false,
 showFilter: false,


// rowClass(  data ) {
//     if(data.estado=="BAJA"){
//       return "deshabilitado"
//     }
//      if(data.estado=="SUSPENDIDO"){
//       return "suspendido";
//     }
//   },
 fields: [

   {
        key: 'tipoSocio',
        label: 'Tipo Socio',
      },
       
      {
        key: 'cantidad',
        label: 'Pagos',
        headerClass: 'col-md-1',
        fn:function(val){ return val+" un."}
      },
      {
        key: 'importePosnet',
        label: '$ POSNET',
        headerClass: 'col-md-1',
        fn:function(val){ return val.formatMoney(2,".")}
      },
      {
        key: 'importeEfectivo',
        label: '$ EFECT.',
        headerClass: 'col-md-1',
        fn:function(val){ return val.formatMoney(2,".")}
      },
      {
        key: 'importeOtros',
        label: '$ OTROS',
        headerClass: 'col-md-1',
        fn:function(val){ return val.formatMoney(2,".")}
      },
      {
        key: 'importeChubut',
        label: '$ CHUBUT',
        headerClass: 'col-md-1',
        fn:function(val){ return val.formatMoney(2,".")}
      },
       {
        key: 'total',
        headerClass: 'col-md-1',
        label: '$ TOTAL',
        fn:function(val){ return new Spacebars.SafeString("<b>"+val.formatMoney(2,".")+"</b>")}
      },
    
    {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesInformeCuotaSocial
      }
 ]
 };
    },
     'settingsPlanesEmpresa': function(){
        return {
 collection: Session.get("consultaPlanesEmpresa"),
 rowsPerPage: 30,
 class: "table table-condensed",
 showNavigation:"auto",
 showNavigationRowsPerPage:false,
 showFilter: false,


// rowClass(  data ) {
//     if(data.estado=="BAJA"){
//       return "deshabilitado"
//     }
//      if(data.estado=="SUSPENDIDO"){
//       return "suspendido";
//     }
//   },
 fields: [

   {
        key: 'nombrePlanEmpresa',
        label: 'Plan Empresa',

      },
       
      {
        key: 'cantidad',
        label: 'Cant. Socios',
      },
      
    
    {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesSociosPlanEmpresa
      }
 ]
 };
    },
    'settingsPlanesEmpresaTipo': function(){
        return {
 collection: Session.get("consultaPlanesEmpresaTipoSocio"),
 rowsPerPage: 30,
 class: "table table-condensed",
 showNavigation:"auto",
 showNavigationRowsPerPage:false,
 showFilter: false,


// rowClass(  data ) {
//     if(data.estado=="BAJA"){
//       return "deshabilitado"
//     }
//      if(data.estado=="SUSPENDIDO"){
//       return "suspendido";
//     }
//   },
 fields: [

   {
        key: 'tipoSocio',
        label: 'Tipo Socio',

      },
       
      {
        key: 'cantidad',
        label: 'Cant. Socios',
      },
      
    
    // {
    //     label: '',
    //     headerClass: 'col-md-2',
    //     tmpl:Template.accionesInformePlanTipo
    //   }
 ]
 };
    },
  'settingsGeneral': function(){
        return {
 collection: Session.get("consultarGeneralActividad_gral"),
 rowsPerPage: 30,
 class: "table table-condensed",
 showNavigation:"auto",
 showNavigationRowsPerPage:false,
 showFilter: false,


// rowClass(  data ) {
//     if(data.estado=="BAJA"){
//       return "deshabilitado"
//     }
//      if(data.estado=="SUSPENDIDO"){
//       return "suspendido";
//     }
//   },
 fields: [

   {
        key: 'nombreActividad',
        label: 'Actividad',

      },
      {
        key: 'cantidad',
        label: 'Cant. Socios',
        headerClass: 'col-md-1',
        fn:function(val,obj){
          return new Spacebars.SafeString("<a class='cantidadSocios' idActividad='"+obj.idActividad+"'>"+val+"</a>")
        }
      },
      {
        key: 'importeEstimado',
        label: '$ ESTIMADO',
        headerClass: 'col-md-1',
        fn:function(val){ return val.formatMoney(2,".")}
      },
      {
        key: 'importeCobrado',
        headerClass: 'col-md-1',
        label: '$ TOTAL COBRADO',
        fn:function(val){ return val.formatMoney(2,".")}
      },
      {
        key: 'importeCobrar',
        headerClass: 'col-md-1',
        label: '$ PARA COBRAR',
        fn:function(val){ return new Spacebars.SafeString("<b color:'red'>"+val.formatMoney(2,".")+"</b>")}
      },
     
    
 ]
 };
    },
 'settings': function(){
        return {
 collection: Session.get("consultarDatosGral"),
 rowsPerPage: 30,
 class: "table table-condensed",
 showNavigation:"auto",
 showNavigationRowsPerPage:false,
 showFilter: false,


// rowClass(  data ) {
//     if(data.estado=="BAJA"){
//       return "deshabilitado"
//     }
//      if(data.estado=="SUSPENDIDO"){
//       return "suspendido";
//     }
//   },
 fields: [

   {
        key: 'nombreActividad',
        label: 'Actividad',

      },
      {
        key: 'cantidadSocios',
        headerClass: 'col-md-1',
        label: 'Socios',
        tmpl:Template.cantidadSociosTmpl
        //fn:function(val,obj){  return new Spacebars.SafeString("<a href='#' class='cantidadSocios' idActividad='"+obj.idActividad+"'>"+val+" u</a>")}
      },
       {
        key: 'cantidadPagos',
        headerClass: 'col-md-1',
        label: 'Pagos',
        fn:function(val){ return val+" u."}
      },
      {
        key: 'importePosnet',
        headerClass: 'col-md-1',
        label: '$ POSNET',
        fn:function(val){ return val.formatMoney(2,".")}
      },
      {
        key: 'importeEfectivo',
        headerClass: 'col-md-1',
        label: '$ EFECT.',
        fn:function(val){ return val.formatMoney(2,".")}
      },
      {
        key: 'importeOtros',
        headerClass: 'col-md-1',
        label: '$ OTROS',
        fn:function(val){ return val.formatMoney(2,".")}
      },
      {
        key: 'importeChubut',
        headerClass: 'col-md-1',
        label: '$ CHUBUT',
        fn:function(val){ return val.formatMoney(2,".")}
      },
       {
        key: 'total',
        headerClass: 'col-md-1',
        label: '$ TOTAL',
        fn:function(val){ return new Spacebars.SafeString("<b>"+val.formatMoney(2,".")+"</b>")}
      },
      {
        key: 'importaCobrar',
        headerClass: 'col-md-1',
        label: '$ COBRAR',
        fn:function(val){ return new Spacebars.SafeString("<b>"+val.formatMoney(2,".")+"</b>")}
      },
    
     {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesInformeActividades
      }
 ]
 };
    },
  "meses":function(){
    return getMeses();
  },
});
Template.informeGral.onRendered(function(){
  var d=new Date();
  $("#anoSeleccion").val(d.getFullYear())
  var mesEnLetras=mesLetras(d.getMonth()+1);
  $('#mes option[value='+mesEnLetras+']').prop('selected', 'selected').change();
  

});


Template.informeGral.events({

  "click .fechas":function(){
  consultarGeneral("gral",true);

  },
   "click .verSocios":function(){
    var data=this;
 Modal.show("sociosInformeActividades",function(){
  return data
 })

  },
  "click .verSociosPlanTipo":function(){
    var data=this;
 Modal.show("sociosInformePlanEmpresaTipo",function(){
  return data
 })

  },
    "click .verSociosPlanEmpresa":function(){
    var data=this;
 Modal.show("sociosInformePlanEmpresa",function(){
  return data
 })

  },
    "click .verSociosCuotas":function(){
    var data=this;
 Modal.show("sociosInformeCuotaSocial",function(){
  return data
 })

  },
  
});
var consultarActividadesInd=function(idAct)
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  var mes=mesNumeros($("#mes").val());
  var ano=$("#anoSeleccion").val()*1;
  Meteor.call("consultarDatosGral",mes,ano,false,idAct,function(err,res){
     
      Session.set("consultarDatosIndividual",res);
      UIBlock.unblock();
    });
}
var consultarCuotasInd=function(tipoSocio)
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  var mes=mesNumeros($("#mes").val());
  var ano=$("#anoSeleccion").val()*1;
  Meteor.call("consultaCuotaSocial",mes,ano,false,tipoSocio,function(err,res){
     
      Session.set("consultaCuotaSocialInd",res);
      UIBlock.unblock();
    });
}
var consultarPlanEmpresaInd=function(idplan)
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  var mes=mesNumeros($("#mes").val());
  var ano=$("#anoSeleccion").val()*1;
  Meteor.call("consultaPlanesEmpresa",mes,ano,false,idplan,function(err,res){
     
      Session.set("consultarPlanEmpresaInd",res);
      UIBlock.unblock();
    });
}
var consultarPlanEmpresaTipoInd=function(tipoSocio)
{
  UIBlock.block('Consultando datos planes tipo socio, aguarde un momento...');
  var mes=mesNumeros($("#mes").val());
  var ano=$("#anoSeleccion").val()*1;
  Meteor.call("consultaPlanesEmpresaTipoSocio",mes,ano,false,tipoSocio,function(err,res){
     
      Session.set("consultarPlanEmpresaTipoInd",res);
      UIBlock.unblock();
    });
}

Template.sociosInformeActividades.onRendered(function(){
 
    consultarActividadesInd(this.data.actividad);
})
Template.sociosInformePlanEmpresa.onRendered(function(){
 
    consultarPlanEmpresaInd(this.data.planEmpresa);
})
Template.sociosInformeCuotaSocial.onRendered(function(){
    consultarCuotasInd(this.data.tipoSocio);
})

Template.sociosInformePlanEmpresaTipo.onRendered(function(){
    consultarPlanEmpresaTipoInd(this.data.tipoSocio);
})


Template.sociosInformeActividades.helpers({
  "actividad":function()
  {
    return this.nombreActividad;
  },

  'settings': function(){
        return {
 collection: ripGral(Session.get("consultarDatosIndividual")),
 rowsPerPage: 30,
 class: "table table-condensed",
 showNavigation:"auto",
 showNavigationRowsPerPage:false,
 showFilter: false,

 fields: [
 {
        label: 'Fecha',
        headerClass: 'col-md-1',
        fn:function(val,obj){ return obj.fecha.getFecha()}
      },
{
        label: 'Nro Socio',
        headerClass: 'col-md-1',
        fn:function(val,obj){ return obj.nroSocio}
      },
      {
        label: 'Socio',
        fn:function(val,obj){ console.log(obj); return obj.apellido.toUpperCase()+" "+obj.nombre.capitalizar()}
      },
      
     
      {
        label: 'Forma Pago',
        headerClass: 'col-md-2',
        fn:function(val,obj){ return obj.formaDePago}
      },
       {
        label: '$ importe',
        headerClass: 'col-md-1',
        fn:function(val,obj){ return obj.itemsActividades.importe.formatMoney(2,".")}
      },
      
 ]
 };
    }
})
Template.sociosInformePlanEmpresaTipo.helpers({

'settings': function(){
        return {
 collection: ripGral(Session.get("consultarPlanEmpresaTipoInd")),
 rowsPerPage: 30,
 class: "table table-condensed",
 showNavigation:"auto",
 showNavigationRowsPerPage:false,
 showFilter: false,


// rowClass(  data ) {
//     if(data.estado=="BAJA"){
//       return "deshabilitado"
//     }
//      if(data.estado=="SUSPENDIDO"){
//       return "suspendido";
//     }
//   },
 fields: [

{
        label: 'Nro Socio',
        headerClass: 'col-md-2',
        fn:function(val,obj){ return obj.nroSocio}
      },
      {
        label: 'Socio',
        fn:function(val,obj){ console.log(obj); return obj.apellido.toUpperCase()+" "+obj.nombre.capitalizar()}
      },
      
     
      {
        label: 'Tipo Socioo',
        headerClass: 'col-md-2',
        fn:function(val,obj){ return obj.tipoSocio}
      },
      
    
 ]
 };
    },
})

Template.sociosInformePlanEmpresa.helpers({
"planEmpresa":function()
{
return PlanesEmpresa.findOne({_id:this.planEmpresa}).nombrePlanEmpresa;
},

'settings': function(){
        return {
 collection: ripGral(Session.get("consultarPlanEmpresaInd")),
 rowsPerPage: 30,
 class: "table table-condensed",
 showNavigation:"auto",
 showNavigationRowsPerPage:false,
 showFilter: false,


// rowClass(  data ) {
//     if(data.estado=="BAJA"){
//       return "deshabilitado"
//     }
//      if(data.estado=="SUSPENDIDO"){
//       return "suspendido";
//     }
//   },
 fields: [

{
        label: 'Nro Socio',
        headerClass: 'col-md-2',
        fn:function(val,obj){ return obj.nroSocio}
      },
      {
        label: 'Socio',
        fn:function(val,obj){ console.log(obj); return obj.apellido.toUpperCase()+" "+obj.nombre.capitalizar()}
      },
      
     
      {
        label: 'Tipo Socio',
        headerClass: 'col-md-2',
        fn:function(val,obj){ return obj.tipoSocio}
      },
      
    
 ]
 };
    },
})
Template.sociosInformeCuotaSocial.helpers({
  "tipoSocio":function()
  {
    return this.tipoSocio;
  },

  'settings': function(){
        return {
 collection: ripGral(Session.get("consultaCuotaSocialInd")),
 rowsPerPage: 30,
 class: "table table-condensed",
 showNavigation:"auto",
 showNavigationRowsPerPage:false,
 showFilter: false,

 fields: [
 {
        label: 'Fecha',
        headerClass: 'col-md-1',
        fn:function(val,obj){console.log(this); return obj.fecha.getFecha()}
      },
{
        label: 'Nro Socio',
        headerClass: 'col-md-1',
        fn:function(val,obj){ return obj.nroSocio}
      },
      {
        label: 'Socio',
        fn:function(val,obj){ console.log(obj); return obj.apellido.toUpperCase()+" "+obj.nombre.capitalizar()}
      },
      
     
      {
        label: 'Forma Pago',
        headerClass: 'col-md-2',
        fn:function(val,obj){ return obj.formaDePago}
      },
       {
        label: '$ importe',
        headerClass: 'col-md-1',
        fn:function(val,obj){ return obj.importeCuotaSocial.formatMoney(2,".")}
      },
      
 ]
 };
    }
})