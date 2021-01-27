var crearExp = function(searchText) {
	// this is a dumb implementation
	var parts = searchText.trim().split(/[ \-\:]+/);
	var re= new RegExp("(" + parts.join('|') + ")", "ig");
	return {"$where":re.test(searchText)};
}
var marcarMensajesLeidos=function(usuario)
{
Meteor.call("marcarMensajesLeidos",usuario,Meteor.userId(),function(err,res){
 
})
}
Template.layoutApp.events({
    "click .salirSistema":function(){
      swal({   title: "Estas Seguro de salir?",   text: "Una vez que hecho debes vovler a ingresar con tus datos!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, salir!",   closeOnConfirm: true },
      function(){ Meteor.logout();Router.go('/');  });

    },
    "click #imprimirCarnets":function(){
     Modal.show("impresionCarnets")
    },
    "click #imprimirCarnetsDobles":function(){
     Modal.show("impresionCarnetsDobles")
    },

  	"autocompleteselect #buscadorSocio": function(event, template, doc) {
		$("#buscadorSocio").val("");
      Router.go("/fichaSocio/"+doc._id);
	},
		"click #btnBuscarSocio": function() {
			UIBlock.block('Buscando Socio...');
			var tipoSocio=$("#tipoSocioGenerico").val()=="P"?"PERSONAL":"EMPRESA";
	Meteor.call("consultarSocio",($("#nroSocioGenerico").val()*1),false,tipoSocio,function(err,res){
		UIBlock.unblock();
		if(res) Router.go("/fichaSocio/"+res._id);
			else swal("Ops..","No se encontro el nro de socio!")
	})
		
			
	},
})
Template.inicio.helpers({
	'empresa': function(){
     return Settings.findOne({clave:"nombreEmpresa"}).valor;
     },
	'usuario': function(){
     return Meteor.user()
     },
	  'esAdmin': function(){
     if(!Meteor.user())return false;
     if(Meteor.user().profile==="admin")return true;
       return false;
     },
})
var consultarMensajesNuevos=function()
{

Meteor.call("consultarMensajesNuevos",Meteor.userId(),function(err,res){
 $(".usuariosChat").attr("style","");
 var audio=new Audio("/sonidos/tono-mensaje-4-.mp3");
 for(var i=0;i<res.length;i++){
 	
 	if(res[i].cantidadMensajesNoLeidos>0){
 		$("#usuario_"+res[i]._id).attr("style","color:red");
 		audio.play();
 		$("#cantidadMensajes_"+res[i]._id).show();
 		$("#cantidadMensajes_"+res[i]._id).html(res[i].cantidadMensajesNoLeidos);
 		
 	}else{
 	$("#usuario_"+res[i]._id).attr("style","");
 	 $("#cantidadMensajes_"+res[i]._id).hide();
 	 
 	 }
 }
})
}
Template.layoutApp.rendered=function(){
	
Meteor.setInterval(consultarMensajesNuevos, 5000);
Meteor.call("usuariosChat",Meteor.userId(),function(err,res){
 Session.set("usuariosChat",res);
})
}
Template.usuarioChat.events({
"click #abrirChat":function()
{
marcarMensajesLeidos(this._id);
var act=this;
$(document).on('hide.bs.modal','#chatModal', function () {
console.log(Session.get("idChat"));
Meteor.clearInterval(Session.get("idChat"))
})
	   Modal.show('mensajesInternos',function(){
			return act;
			
		});
}
})
Template.usuarioChat.helpers({
"nombreUsuario":function()
{
return this.username.substring(0,3);

},
"id":function()
{
return this._id

},



})
Template.layoutApp.helpers({
"usuarios":function()
{
return Session.get("usuariosChat");
}
,

     'esAdmin': function(){
     if(!Meteor.user())return false;
     if(Meteor.user().profile==="admin")return true;
       return false;
     },
     "estaLogueado":function(){
         if(!Meteor.user())return false;
         return true;
     },
	  
  "settings": function() {

		return {
			position: "bottom",
			limit: 15,
			rules: [{
				token: '',
				collection: Socios,
				field: "nroSocio",
				matchAll: false,
				selector: function(match) {
					var search = new RegExp(match, 'i');
					var exp="/^"+match+"*/";
					var buscaNro=null;
					//if(!isNaN(match)) buscaNro=};
					return {$or:[{dni:{$regex:search}},{nroSocio:{$eq:match}},{apellido:{$regex:search}}]};
				},
				template: Template.buscadorSocios
			}, ]
		};
	},
  'nombreUsuario':function(){
    if(!Meteor.user())return "";
    return Meteor.user().username;
  }
});