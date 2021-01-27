String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

EDAD_ADHERENTE=20;
getClaseTipoSocio=function(fechaNac,esActivo){
	var tipo=getTipoSocio(fechaNac,esActivo);
	var clase=tipo==="PARTICIPANTE"?"text-warning":"text-info";
		if(tipo==="ACTIVO")clase="text-danger";
	return clase;
}
getEdadSocio=function(fechaNac){
	var nacimiento=new Date(fechaNac);
   var ahora=new Date();
	 var anos=ahora.getFullYear()-nacimiento.getFullYear();
   return anos;
}
getTipoSocio=function(fechaNac,esActivo){
	 var nacimiento=new Date(fechaNac);
   var ahora=new Date();
	 var anos=ahora.getFullYear()-nacimiento.getFullYear();
	if(esActivo)return "ACTIVO";
   return anos<EDAD_ADHERENTE?"PARTICIPANTE":"ADHERENTE";
}
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
  if(anos<EDAD_ADHERENTE) return dataParticipantes.valor;
  return dataAdherentes.valor;
}
module.exports=getTipoSocio;