import { Meteor } from 'meteor/meteor';
 
import "./funciones.js";
import { Funciones } from "./funciones.js";
  const bodyParser = require('body-parser');
// WebApp.connectHandlers.use(bodyParser.urlencoded({extended: false}))
// WebApp.connectHandlers.use('/setFotoPerfil', bodyParser.urlencoded());

var seting=Settings.findOne({clave:"cadenaConexionMail"});
var valorMail=seting?seting.valor:"";
console.log("valor MAIL:"+valorMail)
process.env.MAIL_URL=valorMail;

//DATOS DE LA BASE DE DATOS!!!!//////////////////////////////////////////////////////////////////////////
	nombreBase="appCai";
puertoBase="27017";
	//DATOS DE LA BASE DE DATOS!!!!//////////////////////////////////////////////////////////////////////////
mesLetras=function(mes)
{ 
  if(mes==1)return "ENERO";
  if(mes==2)return "FEBRERO"; 
  if(mes==3)return "MARZO"; 
  if(mes==4)return "ABRIL";
  if(mes==5)return "MAYO";
  if(mes==6)return "JUNIO";
  if(mes==7)return "JULIO";
  if(mes==8)return "AGOSTO";
  if(mes==9)return "SEPTEMBRE";
  if(mes==10)return "OCTUBRE";
  if(mes==11)return "NOVIEMBRE";
  if(mes==12)return "DICIEMBRE";
  return "s/a";
}
var f=new Funciones();

Meteor.methods({
	
	"getEstadoActividadSocio":f.getEstadoActividadSocio,
	"getTitularCbu":f.getTitularCbu,
	"existeSocio":f.existeSocio,
	"bajaCbuSocio":f.bajaCbuSocio,
	"actividadInforme":f.actividadInforme,
	"consultaCantidadSocios":f.consultaCantidadSocios,
	"cambiarImportesSocios":f.cambiarImportesSocios,
	"agregarDocumentacion":f.agregarDocumentacion,
	"quitarPuntosDniSocios":f.quitarPuntosDniSocios,
	"getSocioNro":f.getSocioNro,
	"getMargenesTarjetas":f.getMargenesTarjetas,
	"quitarItemGenerico":f.quitarItemGenerico,
	"buscarItemsCierres":f.buscarItemsCierres,
	"consultarPagosProfesor":f.consultarPagosProfesor,
	"agregarSocioProfesor":f.agregarSocioProfesor,
	"quitarSocioProfesor":f.quitarSocioProfesor,
	"getSociosProfesor":f.getSociosProfesor,
	"consultaMorosos":f.consultaMorosos,
	"consultaPlanesEmpresaTipoSocio":f.consultaPlanesEmpresaTipoSocio,
	"quitarCuentasCbu":f.quitarCuentasCbu,
	"consultaPlanesEmpresa":f.consultaPlanesEmpresa,
	"consultaCuotaSocial":f.consultaCuotaSocial,
	"consultarGeneralActividad":f.consultarGeneralActividad,
	"consultarDatosGral":f.consultarDatosGral,
	"countGetSociosActivos":f.countGetSociosActivos,
	"quitarCbu":f.quitarCbu,
	"generarArchivoBanco":f.generarArchivoBanco,
    "unicoNroRecivo":f.unicoNroRecivo,
    "guardarArchivoBanco":f.guardarArchivoBanco,
    "pasarCuentasDebito":f.pasarCuentasDebito,
    "quitarRtaBancoPerfiles":f.quitarRtaBancoPerfiles,
    "agregarRtaBancoPerfiles":f.agregarRtaBancoPerfiles,
    "cargarItemsRta":f.cargarItemsRta,
    "modificaSocioCbu":f.modificaSocioCbu,
    "buscadorSocios":f.buscadorSocios,
    "quitarSocioCbuAsociado":f.quitarSocioCbuAsociado,
    "quitarRtaBanco":f.quitarRtaBanco,
"buscarCuentas":f.buscarCuentas,
"quitarPuntos":f.quitarPuntos,
"consultaMensajesChat":f.consultaMensajesChat,
"marcarMensajesLeidos":f.marcarMensajesLeidos,
"consultarMensajesNuevos":f.consultarMensajesNuevos,
"agregarMensajeInterno":f.agregarMensajeInterno,
"usuariosChat":f.usuariosChat,
"buscarSocio":f.buscarSocio,
'enviarMensajes':f.enviarMensajes ,
 'exportarSocios':f.exportarSocios ,
    'fileUploadSocios':f.fileUploadSocios ,
    "cargarSocios":f.cargarSocios,
    "getSociosActivos":f.getSociosActivos,
    "sociosActividad":f.sociosActividad,
    "yaCerroCaja":f.yaCerroCaja,
     "consultarCajaGeneral":f.consultarCajaGeneral,
	"getFuentes":f.getFuentes,
	"getFuente":f.getFuente,
	"googleDriveRestaurar":f.googleDriveRestaurar,
	"googleDriveUpload": f.googleDriveUpload,
	"googleDriveBackup":f.googleDriveBackup ,
	"googleGetArchivos":f.googleGetArchivos ,
	"googleDriveAutorizar":f.googleDriveAutorizar ,
	"googleDriveSolicitarToken":f.googleDriveSolicitarToken ,
	"userInsert": f.userInsert,
	"usuarios":f.usuarios ,
	"modificarClave": f.modificarClave,
	"userRemove":f.userRemove ,
	"back": f.back,
	"buscarCaja": f.buscarCaja,
	"buscarCajaGeneral":f.buscarCajaGeneral ,
	"incrementaProxNroRecivo":f.incrementaProxNroRecivo,
	"proxNroRecivo": f.proxNroRecivo,

	"subirActividades":f.subirActividades ,
	"generarVariables":f.generarVariables ,
	"getTotales":f.getTotales,
	"quitarImportacionPagos": f.quitarImportacionPagos,
	"quitarGeneracionDeuda":f.quitarGeneracionDeuda ,
	"agregarImportacion":f.agregarImportacion,
	'ingresarDeudas':f.ingresarDeudas,
	
	"ingresarActividadesPlanSocio":f.ingresarActividadesPlanSocio,
	"asignarSocioCbu":f.asignarSocioCbu,
	"asignarSocioCbu2":f.asignarSocioCbu2,
	"modificarImporteAsociacion":f.modificarImporteAsociacion,
	"btnQuitarAsociaciones": f.btnQuitarAsociaciones,
	"quitarSocioCbu":f.quitarSocioCbu,
	"quitarFilaImportacion":f.quitarFilaImportacion ,
	"itemsImportacion": f.itemsImportacion,

	'ingresarImportacion2':f.ingresarImportacion2 ,
	"saldoSocio":f.saldoSocio ,
	"consultarSocio":f.consultarSocio,
	"agregarActividadSocio": f.agregarActividadSocio,
	"agregarGrupoSocio": f.agregarGrupoSocio,
	"agregarPlanEmpresaSocio":f.agregarPlanEmpresaSocio ,
	"quitarSocioActividad": f.quitarSocioActividad,
	"quitarSocioGrupo":f.quitarSocioGrupo,
	"getSociosActividad":f.getSociosActividad,
	"getSociosGrupos": f.getSociosGrupos,
	"getSociosPlanEmpresa": f.getSociosPlanEmpresa,
	'quitarMovimientoCuenta':f.quitarMovimientoCuenta ,
	"totalCarnets": f.totalCarnets,
	"totalPagos": f.totalPagos,
	"totalDebitosAutomaticos": f.totalDebitosAutomaticos,
	"mensualCarnets": f.mensualCarnets,
	"mensualPagos": f.mensualPagos,
	"mensualDebitosAutomaticos":f.mensualDebitosAutomaticos ,
	"proximoSocioLibre":f.proximoSocioLibre ,
	"mensualCambioEstados":f.mensualCambioEstados ,
	"totalCambiosEstado":f.totalCambiosEstado ,

	"modificarImagenSocioAdjunto":f.modificarImagenSocioAdjunto ,
	"ingresarSocio":f.ingresarSocio,
	"getImagenSocio": f.getImagenSocio,
	"quitarSocio": f.quitarSocio,
	"cambiarImagenSocio":f.cambiarImagenSocio ,

	"ultimoSocioCargado":f.ultimoSocioCargado,
	"ultimoIdSocioCargado":f.ultimoIdSocioCargado,
	"dataSocio":f.dataSocio ,

	'quitarDeuda':f.quitarDeuda ,
	'getSocio':f.getSocio ,
	'quitarPromocion':f.quitarPromocion ,
	'defaultDebito2':f.defaultDebito2 ,
	'defaultDebito': f.defaultDebito,
	'quitarActividad': f.quitarActividad,
	'quitarPlanEmpresa':f.quitarPlanEmpresa ,
	'quitarDebitoAutomatico':f.quitarDebitoAutomatico,
	'fileUpload':f.fileUpload,
	'subirImagen':f.subirImagen ,
	'getImagen':f.getImagen,
	'getArchivo':f.getArchivo ,
	'fileUploadBanco':f.fileUploadBanco ,
	"loginUser": f.loginUser
}); 

Meteor.startup(() => {
 

// Meteor.publish('MensajesInternos', function(params){
//
//    return MensajesInternos.find({$or:[{$and:[{idUsuarioReceptor:params.usuarioSesion},{idUsuarioEmisor:params.usuarioChat}]},{$and:[{idUsuarioEmisor:params.usuarioSesion},{idUsuarioReceptor:params.usuarioChat}]}]} );
//});
 Meteor.publish('GeneracionDeudas', function(){
    return GeneracionDeudas.find();
});
  Meteor.publish('Profesores', function(){
    return Profesores.find();
});
	 Meteor.publish('MovimientosGenerales', function(){
    return MovimientosGenerales.find();
});
	 Meteor.publish('CierreCaja', function(){
    return CierreCaja.find();
});
 Meteor.publish('CierreCajaSector', function(user){
    return CierreCaja.find({usuario:user});
});
Meteor.publish('Usuarios', function(user){
    return Meteor.users.find({});
});
	 Meteor.publish('PlanesEmpresa', function(){
    return PlanesEmpresa.find();
});
Meteor.publish('Actividades', function(){
    return Actividades.find();
});
Meteor.publish('Promociones', function(){
    return Promociones.find();
});
  Meteor.publish('ImportarPagos', function(){
    return ImportarPagos.find();
});
  Meteor.publish('Grupos', function(){
    return Grupos.find();
});
  Meteor.publish('Imagenes', function(idSocio_){
    return Imagenes.find({idSocio:idSocio_});
});
    Meteor.publish('ExcepcionesDeudas', function(){
    return ExcepcionesDeudas.find();
});
   Meteor.publish('Pagos', function(idSocio_){
    return Pagos.find({idSocio:idSocio_});
});
    Meteor.publish('Deudas', function(idSocio_){
    return Deudas.find({idSocio:idSocio_});
});

    Meteor.publish('ActividadesSocio', function(){
    return Grupos.find();
});
    Meteor.publish('Socios', function(){
        console.log("this")
		return Socios.find()
});
   Meteor.publish('FichaSocio', function(id){
    var sal=Socios.find({_id:id});
    //console.log(sal);
    return sal;
});
   Meteor.publish('Settings', function(){
    return Settings.find();
});
   Meteor.publish('Log', function(){
    return Log.find();
});
   Meteor.publish('Mensajes', function(){
    return Mensajes.find();
});
   Meteor.publish('ArchivoBancos', function(){
    return ArchivoBancos.find();
});
 Meteor.publish('CbuSocios', function(){
    return CbuSocios.find();
});

 
 
});
