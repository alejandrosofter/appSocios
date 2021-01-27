var getImporteSocio=function(idSocio)
{
  var dataParticipantes=Settings.findOne({clave:"importeParticipantes"});
    var dataAdherentes=Settings.findOne({clave:"importeAdherentes"});
    var dataActivos=Settings.findOne({clave:"importeActivos"});
  
  var socio=Socios.findOne({_id:idSocio});
  var nacimiento=new Date(socio.fechaNacimiento);
  var ahora=new Date();
  var anos=ahora.getFullYear()-nacimiento.getFullYear();
	
  if(socio.esActivo)return dataActivos.valor;
  if(anos<=18) return dataParticipantes.valor;
  return dataAdherentes.valor;
}
function DeudaSocios(detalle, fecha,esCuotaSocial, excluido) {
 
  
  

 
 
	
}
// var de=new DeudaSocios("CUOTA SOCIAL", new Date(),true, []);
		//var excluir = doc.actividadesExcluir ? doc.actividadesExcluir : [];
//     de.cargarDeudaSocios();
getImporteSocio=function(idSocio)
{
  var dataParticipantes=Settings.findOne({clave:"importeParticipantes"});
    var dataAdherentes=Settings.findOne({clave:"importeAdherentes"});
    var dataActivos=Settings.findOne({clave:"importeActivos"});
  
  var socio=Socios.findOne({_id:idSocio});
  var nacimiento=new Date(socio.fechaNacimiento);
  var ahora=new Date();
  var anos=ahora.getFullYear()-nacimiento.getFullYear();
	
  if(socio.esActivo)return dataActivos.valor;
  if(anos<=18) return dataParticipantes.valor;
  return dataAdherentes.valor;
}
