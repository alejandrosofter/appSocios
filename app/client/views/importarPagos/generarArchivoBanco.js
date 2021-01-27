
var consultarSociosActivos=function()
{
	 UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("getSociosActivos",function(err,res){
    UIBlock.unblock();
    console.log(res)
    Session.set("getSociosActivos",res);
  })
}
Template.generarArchivoBanco.rendered=function(){
 consultarSociosActivos();
  
}
Template.generarArchivoBanco.helpers({
	'settings': function(){
        return {
 collection: Session.get("getSociosActivos"),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: true,
rowClass(  data ) {
//    if(data.estado=="BAJA"){
//      return "deshabilitado"
//    }
//     if(data.estado=="SUSPENDIDO"){
//      return "suspendido";
//    }
  },
 fields: [
 {
        key: '_id',
        label: 'CBU',
			 fn: function (value, row, key) {
             
         return new Spacebars.SafeString(value);
         
         },
      },

	  {
        key: 'socios',
        label: 'Socio/s',
			 fn: function (value, row, key) {
			     var sal="";
			     for(var i=0;i<value.length;i++){
			         var aux=value[i];
			         var tipoSocio=getTipoSocio(aux.fechaNacimiento,aux.esActivo);
			         var importe=Number(Settings.findOne({clave:"importeActivos"}).valor);
			         console.log(importe)
			         if(tipoSocio=="ADHERENTE")importe=Number(Settings.findOne({clave:"imprteAdherentes"}).valor);
			         if(tipoSocio=="PARTICIPANTE")importe=Number(Settings.findOne({clave:"importeParticipantes"}).valor);
			         
			         
			         var nombre=aux.apellido.toUpperCase()+", "+aux.nombre+"<small><small> - "+tipoSocio+"</small></small>   <b>$ "+importe.formatMoney(2)+"</b><br>";
			         sal+="<b>("+aux.nroSocio+") </b>"+nombre;
			     }

         return new Spacebars.SafeString(sal);
         
         },
      },
      {
        key: 'socios',
        label: '$ Importe a Debitar',
			 fn: function (value, row, key) {
			     var auxImporte=0;
			     for(var i=0;i<value.length;i++){
			         var aux=value[i];
			         var tipoSocio=getTipoSocio(aux.fechaNacimiento,aux.esActivo);
			         var importe=Settings.findOne({clave:"importeActivos"}).valor;
			         if(tipoSocio=="ADHERENTE")importe=Settings.findOne({clave:"imprteAdherentes"}).valor;
			         if(tipoSocio=="PARTICIPANTE")importe=Settings.findOne({clave:"importeParticipantes"}).valor;
			         auxImporte+=Number(importe);

			     }

         return new Spacebars.SafeString("<big><b>$ "+auxImporte.formatMoney(2)+"</b></big>");
         
         },
      },
	 
     
    {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesSociosBancos
      }
 ]
 };
    },
 
})