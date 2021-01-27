 import Tabular from 'meteor/aldeed:tabular';
import moment from 'moment';


 so__=new Tabular.Table({
  name: "Socios",
   language: {
     processing: "<img src='/images/loading.gif'>"
  }, 
   processing: true,
   // pagingType: 'simple',
    buttons: ['copy', 'excel', 'csv', 'colvis'],
   stateSave: true,
  collection: Socios,
   createdRow( row, data, dataIndex ) {
    if(data.estado=="BAJA"){
      var fila=$(row);
      fila.attr("class","deshabilitado");
    }
     if(data.estado=="SUSPENDIDO"){
      var fila2=$(row);
      fila2.attr("class","suspendido");
    }
  },
   extraFields: ['idGrupo', 'actividades',"fechaNacimiento","esActivo","formaDePagoPrincipal"],
   
   autoWidth: false, // puse esto por que cuando eliminaba un socio y volvia a socios queda la tabla por la mitad
//classname:"compact",
  columns: [
     {data: "nroSocio", search: { isNumber: true, exact: false, },title: "Nro"},
    {width: "500px" , title: "Socio (click SOBRE 'EL' para ir a la ficha...)",data: function ( row, type, val, meta ) {
      var nombre=row.nombre.substr(0, 1).toUpperCase() + row.nombre.substr(1);
         var color=(row.estado=="BAJA")?"#ccc":"#337ab7";
      var clase=row.estado=="BAJA"?"deshabilitado":"";
      if(row.estado=="SUSPENDIDO")clase="suspendido";
      if(row.estado=="SUSPENDIDO")color="orange";
         return new Spacebars.SafeString("<span id='"+row._id+"' class='nombreSocio "+clase+"' style='cursor:pointer;'> <b>"+row.apellido.toUpperCase()+"</b>, "+nombre+"</a>");
         
    }},
    {data: "apellido",  visible: false, title: "Apellido"},
    {data: "nombre",  visible: false, title: "Nombre"},

     {data: "estado", title: "Estado",searchable:false},
     {title: "Tipo Socio",render: function(val, type, doc){
       var clase=getClaseTipoSocio(doc.fechaNacimiento,doc.esActivo,doc.estado);
        if(doc.estado=="SUSPENDIDO"){
       clase="suspendido"
    }
       var res= new Spacebars.SafeString("<span class='"+clase+"'>"+getTipoSocio(doc.fechaNacimiento,doc.esActivo)+"</span>");
      return res;
    }},
    {title: "Forma PAGO",render: function(val, type, doc){
       
      return (doc.formaDePagoPrincipal);
    }},
    {data: "planEmpresa",searchable:true, title: "Empresa",render: function(val, type, doc){
      var plan=null;
      var grupo=null;
      var aux="";
      if(doc.idGrupo!=null)grupo=Grupos.findOne({_id:doc.idGrupo});
      if(doc.planEmpresa!=null)plan=PlanesEmpresa.findOne({_id:doc.planEmpresa});
      aux+=grupo?grupo.nombre+" ":"";
      aux+=plan?'<span class="label label-danger">'+plan.nombrePlanEmpresa+'</b></span>':"";
      
      return new Spacebars.SafeString(aux);
    }
    },
    {data: "actividades", title: "Actividades",render: function(val, type, doc){
      var sal="";
      for(var i=0;i<doc.actividades.length;i++){
        var actividad=Actividades.findOne({_id:doc.actividades[i].idActividad});
        if(actividad){
          var color=doc.actividades[i].estaBaja?"red":"black";
           sal+="<span style='color:"+color+"'>"+actividad.nombreActividad+"</span> ";
        }
       
      }
      if(sal==="")return "-";
      return sal;
    }},
     {data: "dni", title: "DNI"},
      {data: "tipoSocio", title: "Tipo "},
     
    
      
  ]
});
