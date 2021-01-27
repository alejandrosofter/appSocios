var ripData=function(arr)
{
  var sal=[];
  if(arr)
  for(var i=0;i<arr.length;i++){
    var aux={
      // planEmpresa:arr[i]._id.planEmpresa,
       socio:arr[i]._id.apellido+" "+arr[i]._id.nombre,
       _id:arr[i]._id.id,
       nroSocio:arr[i]._id.nroSocio,
       estado:arr[i]._id.estado,
       cantidad:arr[i].cantidad,
       total:arr[i].total,

    };
    sal.push(aux);
  }
    
  return sal
}
var ripData2=function(arr)
{
  var sal=[];
  if(arr)
  for(var i=0;i<arr.length;i++){
    var aux=arr[i];
    aux._id=i+"a";
    sal.push(aux);
  }
    
  return sal
}
var consultarMorosos=function(coleccion,agrupa,idSocio,ripea)
{
    UIBlock.block('Consultando morosos, aguarde un momento...');

  Meteor.call("consultaMorosos" ,agrupa,idSocio,function(err,res){
      if(ripea)res=ripData(res);else res=ripData2(res)
      console.log(res)
      Session.set(coleccion,res);
      UIBlock.unblock()
    });
}

Template.informeMorosos.events({
"click #btnBuscar":function()
{
	consultarMorosos("consultaMorosos",true,null,true)
},
"click .verSocios":function()
{
	 var data=this;

 Modal.show("informeMorosos_IND",function(){
  return data
 })
}
})
Template.informeMorosos_IND.onRendered(function(){
	 console.log(this)
consultarMorosos("consultaMorosos_IND",false,this.data._id)
});
Template.informeMorosos_IND.helpers({
	"socio":function()
	{
		return this.socio;
	},
  'settings': function(){
        return {
 collection: Session.get("consultaMorosos_IND"),
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
        label: 'Fecha',
        headerClass: 'col-md-1',
        fn:function(val,obj){ return obj.fecha.getFecha()}
      },
       
      {
        label: 'Detalle',
        fn:function(val,obj){ return obj.detalle}
      },
      {
        label: '$ DEBITA',
        headerClass: 'col-md-2',
        key:"importeDebita",
         fn:function(val){ return val.formatMoney(2,".")}
      },
      {
        label: '$ ACREDITA',
         key:"importeAcredita",
        headerClass: 'col-md-2',
         fn:function(val){ return val.formatMoney(2,".")}
      },
      {
        key: 'total',
        label: '$ Importe',
        headerClass: 'col-md-2',
        fn:function(val){ return val.formatMoney(2,".")}
      },
   
 ]
 };
    },
});
Template.informeMorosos.helpers({
  'settings': function(){
        return {
 collection: Session.get("consultaMorosos"),
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
        headerClass: 'col-md-1',
        fn:function(val,obj){ return obj.nroSocio}
      },
       
      {
        label: 'Socio',
        fn:function(val,obj){ return obj.socio}
      },
      {
        label: 'Estado',
        headerClass: 'col-md-1',
        fn:function(val,obj){ return obj.estado}
      },
      {
        key: 'cantidad',
        label: 'CUOTAS',
        headerClass: 'col-md-1',
        fn:function(val){ return val}
      },
      {
        key: 'total',
        label: '$ Importe',
        headerClass: 'col-md-1',
        fn:function(val){ return val.formatMoney(2,".")}
      },
    
    {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesMorosos
      }
 ]
 };
    },
});