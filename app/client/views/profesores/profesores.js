var consultarSocios=function(idProfesor)
{
   UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("getSociosProfesor",idProfesor,function(err,res){
    UIBlock.unblock();
    Session.set("getSociosProfesor",ripData(res) );
  })
}
var agregarSocioProfesor=function(idSocio,idProfesor,idActividad)
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("agregarSocioProfesor",idSocio,idProfesor,idActividad,function(err,res){
    UIBlock.unblock();

    if(!res)swal("Ops..","No encontramos esta actividad en el SOCIO! .. agregue la actividad al socio primero!");
    consultarSocios(Session.get("idProfesorSeleccion"))
  })
}
var ripData=function(data)
{
  var sal=[];
  for(var i=0;i<data.length;i++){
    var aux=data[i];
    aux._id=i+"_server";
    sal.push(aux);
  }
  console.log(sal)
  return sal;
}
var getPlanesEmpresa=function(items)
{
  var sal="";
  if(items)
  for(var i=0;i<items.length;i++){
    var aux=PlanesEmpresa.findOne({_id:items[i].idPlanEmpresa});
    sal+=aux.nombrePlanEmpresa+"<br>";
  }
  return sal;
}
Template.accionesProfesores.helpers({
  "tieneCierres":function()
  {
    if(this.cierres) return this.cierres.length>0
      return false;
  },
   "cantidadCierres":function()
  {
    if(this.cierres) return this.cierres.length
      return 0;
  },

})
Template.accionesSociosProfesor.events({

  "click .delete":function(){
      var idSocio=this.idSocio;
      var idActividad=this._idActividadSocio;

         swal({   title: "Estas Seguro de sacalo de este profesor?",   text: "",   type: "success",   showCancelButton: true,   confirmButtonColor: "#4cae4c",   confirmButtonText: "Si, QUITARLO!",   closeOnConfirm: true },
               function(){
             UIBlock.block('Consultando datos, aguarde un momento...');
    Meteor.call("quitarSocioProfesor", idSocio,idActividad,function(err,res){
        UIBlock.unblock();
      consultarSocios(Session.get("idProfesorSeleccion"))
    })
         })
   
    },
})
Template.sociosProfesor.events({
  'mouseover tr': function(ev) {
    $("#tablaSociosProfesor").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  "cambiaSocio #buscaSocio":function(ev,data)
  {
   var nombreSocio=Session.get("socioSeleccion").apellido+" "+Session.get("socioSeleccion").nombre;
   $("#buscaSocio").attr("placeholder",nombreSocio);
  },
  "click .agregarSocio":function()
  {
    agregarSocioProfesor(Session.get("socioSeleccion")._id,Session.get("idProfesorSeleccion"),this.idActividad)
  }
})
Template.cierresProfesor.helpers({
"columnas":function()
{
  return [

   {
        key: 'importe',
        label: '$ Total',
        headerClass: 'col-md-1',
      },
      ]
}
})
Template.sociosProfesor.helpers({
  "profesor":function(){
    return Profesores.findOne({_id:this._id}).nombres.toUpperCase();
  },
  "socios":function(){
    return Session.get("getSociosProfesor");
  },
  "cantidadSocios":function()
  {
    if(Session.get("getSociosProfesor"))
    return Session.get("getSociosProfesor").length;
  },
  'settings': function(){
        return {
 collection: Session.get("getSociosProfesor"),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: true,
rowClass(  data ) {
    if(data.estado=="BAJA"){
      return "deshabilitado"
    }
     if(data.estado=="SUSPENDIDO"){
      return "suspendido";
    }
  },
 fields: [

   {
        key: 'nroSocio',
        label: 'Nro Socio',
        headerClass: 'col-md-1',
      },
    {
        key: 'socio',
        label: 'Socio',
        headerClass: 'col-md-3',
       fn: function (value, row, key) {
             var nombre=row.nombre.substr(0, 1).toUpperCase() + row.nombre.substr(1);
         var color=(row.estado=="BAJA")?"#ccc":"#337ab7";
      var clase=row.estado=="BAJA"?"deshabilitado":"";
      if(row.estado=="SUSPENDIDO")clase="suspendido";
      if(row.estado=="SUSPENDIDO")color="orange";
         return new Spacebars.SafeString("<span id='"+row._id+"' class='nombreSocio "+clase+"' style='cursor:pointer;'> <b>"+row.apellido.toUpperCase()+"</b>, "+nombre+"</a>");
         
         },
      },
   {
        key: 'tipo',
        label: 'Tipo Socio',
        headerClass: 'col-md-1',
      fn: function (value, object, key) {
           var clase=getClaseTipoSocio(object.fechaNacimiento,object.esActivo,object.estado);
        if(object.estado=="SUSPENDIDO"){
       clase="suspendido"
    }
       var res= new Spacebars.SafeString("<span class='"+clase+"'>"+object.tipoSocio+"</span>");
      return res;
         },
      },
       {
        key: 'planesEmpresa',
        label: 'Empresa',
      fn: function (value, object, key) {
         var planes=getPlanesEmpresa(value);
       var res= new Spacebars.SafeString("<span class=''>"+planes+"</span>");
      return res;
         },
      },
      {
        key: 'idActividad',
        label: 'Act.',
        headerClass: 'col-md-1',
      fn: function (value, object, key) {
         
         var act=Actividades.findOne({_id:value});
         if(act) return new Spacebars.SafeString("<span class=''>"+act.nombreActividad+"</span>");
      return "s/n";
         },
      },
      {
        key: 'tieneImporteEspecial',
        label: '$ Mes',
        headerClass: 'col-md-1',
      fn: function (value, object, key) {
         
         var act=Actividades.findOne({_id:object.idActividad});
         var importe=object.tieneImporteEspecial?object.importeEspecial:act.importe;
         return new Spacebars.SafeString("<span class=''>$ "+importe.formatMoney(2,".")+"</span>");
      
         },
      },
    
    {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesSociosProfesor
      }
 ]
 };
    },


})
Template.profesores.events({

 'click .verSocios': function(ev) {
     var act=this;
     Session.set("idProfesorSeleccion",this._id);
    Modal.show('sociosProfesor',function(){ return act; });
  },
  'click .cierres': function(ev) {
     var act=this;
     Session.set("idProfesorSeleccion",this._id);
    Modal.show('cierresProfesor',function(){ return act; });
  },
  'click .nuevoCierre': function(ev) {
     var act=this;
     console.log(this)
    Modal.show('nuevoCierre',function(){ return act; });
  },

});
Template.profesores.helpers({
  "tieneCierres":function(){
    if(!this.cierres)return false; 
    return this.cierres.length>0
  },
  "cantidadCierres":function(){
    if(!this.cierres)return 0; 
    return this.cierres.length
  },
    'columnas': function(){
        return [
      {
        key: 'nombres',
        label: 'Nombres',
      },
   {
        key: 'porcentajeAcordado',
        label: '% Acordado',
      fn: function (value, object, key) {
           return "$ "+value.toFixed(2);
         },
        headerClass: 'col-md-2',
      },
      {
        key: 'importeAcordado',
        label: '$ Acordado',
      fn: function (value, object, key) {
           return "$ "+value.toFixed(2);
         },
        headerClass: 'col-md-2',
      },
   {
        key: 'idActividad',
        label: 'Actividad',
      fn: function (value, object, key) {

          var act=Actividades.findOne({_id:object.idActividad});
          if(act)return act.nombreActividad;
          return "S/n"
         },
        headerClass: 'col-md-1',
      },
 ]
}
});
Template.profesores.rendered=function(){
  Meteor.subscribe('Actividades');
  
}


Template.sociosProfesor.onRendered(function(){
  Meteor.typeahead.inject();
 consultarSocios(this.data._id);
  
})

Template.tmplImpresionCierreProfe.rendered=function(){

}
Template.tmplImpresionCierreProfe.helpers({
"items":function(){
  console.log(this)
  return this.datos.items
},
"data":function(){
  return this.datos
},
"fechaDesde":function(){
  return moment(this.datos.fechaDesde).format("DD/MM/YYYY")
},
"fechaHasta":function(){
  return moment(this.datos.fechaHasta).format("DD/MM/YYYY")
},
"importeTotal":function(){
  return this.datos.importe.formatMoney(2,".")
},
"importeGanancia":function(){
  return this.datos.importeGanancia.formatMoney(2,".")
},
"nombreProfesor":function()
{
var profe=Profesores.findOne({_id:Session.get("idProfesorSeleccion")});
if(profe)return profe.nombres.toUpperCase();
return "s/n"
},
"mes":function(){
  var d=new Date();
  return d.getMonth()+1
},

"ano":function(){
  var d=new Date();
  return d.getFullYear()
},
"dia":function(){
  var d=new Date();
  return d.getDate()
},

})
Template.accionesCierresProfes.events({
  "click .imprimir":function()
  {
    var data=this;
    Modal.hide();
    setTimeout(function(){ Modal.show('imprimirCierreProfesor',function(){ return data; }) }, 500);
    
    
  }
})
Template.cierresProfesor.helpers({
   "colsItems":function()
  {
     return [
    {
        key: 'nroSocio',
        label: 'Nro socio',
          fn:function(val,obj){return  val},
          headerClass: 'col-md-1',
      },
     {
        key: 'nroSocio',
        label: 'Socio',
          fn:function(val,obj){return  new Spacebars.SafeString(obj.apellido.toUpperCase()+" "+obj.nombre);}

      },
      {
        key: 'nroRecivo',
        label: 'RECIVO',
          fn:function(val,obj){return  val},
          headerClass: 'col-md-1',

      },
    {
        key: 'importe',
        label: '$ PAGO',
        headerClass: 'col-md-1',
      },
    ]
  },
  'columnas': function(){

        return [
      {
        key: 'fechaInicio',
        label: 'Fecha Inicio',
        headerClass: 'col-md-2',
        fn:function(val,obj){return moment(val).format("DD/MM/YYYY")}
      },
      {
        key: 'fechaFin',
        label: 'Fecha Fin',
        headerClass: 'col-md-2',
        fn:function(val,obj){return moment(val).format("DD/MM/YYYY")}
      },
      {
        key: 'importe',
        label: '$ Acumulado',
        headerClass: 'col-md-2',
        fn:function(val,obj){return "$ "+val.formatMoney(2,".")}
      },
      {
        key: 'porcentaje',
        headerClass: 'col-md-2',
        label: '% GANANCIA',
        fn:function(val,obj){return "% "+val}
      },
      {
        key: 'importeGanancia',

        label: '$ Ganancia',
        fn:function(val,obj){return "$ "+val.formatMoney(2,".")}
      },
 ]
 }
    
})

Template.nuevoCierre.events({
  "buscoDatos #moduloSubItemsGral":function()
  {
    console.log("busco")
  }
})
Template.nuevoCierre.helpers({
  "callbackCambiaValor":function()
  {
       return function(){
        console.log("cambia val")
        var importe=Number($("#importe").val());
        var porcentaje=Number($("#porcentaje").val())/100;
        var total=importe*porcentaje;
        $("#importeGanancia").val(total);
        
  }

  },
"callbackSuma":function()
{
  return function(items){
    var sum=0;
    for(var i=0;i<items.length;i++)sum+=items[i].importe;
    $("#importe").val(sum);
  $( "#importe" ).trigger( "keydown" );

      return sum

  }
},
"callbackInit":function()
{
  return function(){
    console.log("init!")
    console.log(moment().format("DD/MM/YYYY hh:mm"))
    $("#fechaInicio").val(moment().format("YYYY-MM-DDThh:ss"));
    $("#fechaFin").val(moment().format("YYYY-MM-DDThh:ss"));
    console.log(this)
    $("#porcentaje").val(this.parent.porcentajeAcordado);
  }
},
  "colsItems":function()
  {
    return [
    {
        key: 'nroSocio',
        label: 'Nro socio',
          fn:function(val,obj){return  val},
          headerClass: 'col-md-1',
      },
     {
        key: 'nroSocio',
        label: 'Socio',
          fn:function(val,obj){return  new Spacebars.SafeString(obj.apellido.toUpperCase()+" "+obj.nombre);}

      },
      {
        key: 'nroRecivo',
        label: 'RECIVO',
          fn:function(val,obj){return  val},
          headerClass: 'col-md-1',

      },
    {
        key: 'importe',
        label: '$ PAGO',
        headerClass: 'col-md-1',
      },
    ]
  },
  'varsBuscaItems': function(){
    return {};
    }
})