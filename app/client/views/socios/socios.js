
Template.socios.helpers({
  'esAdmin': function(){
     if(!Meteor.user())return false;
     if(Meteor.user().profile==="admin")return true;
       return false;
     },
     "muestraFiltros":function()
     {
      var cantidadActividades=Actividades.find().fetch().length;
      var cantidadEmpresas=PlanesEmpresa.find().fetch().length;
      var grupos=Grupos.find().fetch().length;

      var suma=(cantidadEmpresas+cantidadActividades+grupos);
      console.log(suma)
       console.log(cantidadActividades)
      return suma>0
     },
 selector() {
     if(Session.get("filtroGrupos"))
     var filtroGrupo=Session.get("filtroGrupos").length===0?null:{$in: Session.get("filtroGrupos") };
     if(Session.get("filtroPlanes"))
        var filtroPlanes=Session.get("filtroPlanes").length===0?null:{$elemMatch:{idPlanEmpresa:{$in:Session.get("filtroPlanes")}}};
     
    if(Session.get("filtroActividades"))
    var filtroActividades=Session.get("filtroActividades").length===0?null:{$elemMatch:{idActividad:{$in:Session.get("filtroActividades")}}};
   var selector={};
   if(filtroGrupo!=null)selector.idGrupo=filtroGrupo;
   if(filtroActividades!=null)selector.actividades=filtroActividades;
   if(filtroPlanes!=null)selector.planesEmpresa=filtroPlanes;
   
    return selector; // this could be pulled from a Session var or something that is reactive
  }
});
consultarSociosGrupo=function(id,data)
{
	var act=data?data:this;
	UIBlock.block('Consultando datos, aguarde un momento...('+id+")");
  Meteor.call("getSociosGrupos",id,function(err,res){
    UIBlock.unblock();
    Session.set("sociosGrupos",res);
		Modal.show('sociosGrupo',function(){ return act; });
  })
}
consultarSociosPlanEmpresa=function(id,data)
{
	var act=data?data:this;
	UIBlock.block('Consultando datos, aguarde un momento...('+id+")");
  Meteor.call("getSociosPlanEmpresa",id,function(err,res){
    UIBlock.unblock();
    Session.set("sociosPlanesEmpresa",res);
		Modal.show('sociosPlanesEmpresa',function(){ return act; });
  })
}
consultarSociosActividad=function(id,data)
{
	var act=data?data:this;
	UIBlock.block('Consultando datos, aguarde un momento...('+id+")");
  Meteor.call("getSociosActividad",id,function(err,res){
    UIBlock.unblock();
    Session.set("sociosActividad",res);
		Modal.show('sociosActividad',function(){ return act; });
  })
}
Template.filtrosSocios.events({
   'click .verSociosActividad': function(ev) {
     console.log(this)
     var act=this;
     Session.set("idActividadSeleccion",this._id);
     consultarSociosActividad(this._id,this);
//    Modal.show('sociosActividad',function(){ return act; });
  },
	'click .verSociosGrupo': function(ev) {
		Session.set("idGrupoSeleccion",this._id);
		consultarSociosGrupo(this._id,this)
	},
		'click .verSociosPlanesEmpresa': function(ev) {
		Session.set("idPlanEmpresaSeleccion",this._id);
		consultarSociosPlanEmpresa(this._id,this)
	},
  'click .filaActividades': function(ev){
       var aux=Session.get("filtroActividades");
    var r=$("#"+this._id);
     if(aux.indexOf(ev.currentTarget.id)==-1){
       aux.push(ev.currentTarget.id);
     }else aux.splice(aux.indexOf(ev.currentTarget.id),1);
    r.toggleClass("seleccionFila");
    Session.set("filtroActividades",aux);
    },
    
	'click .filaPlanesEmpresa': function(ev){
       var aux=Session.get("filtroPlanes");
    var r=$("#"+this._id);
     if(aux.indexOf(ev.currentTarget.id)==-1){
       aux.push(ev.currentTarget.id);
     }else aux.splice(aux.indexOf(ev.currentTarget.id),1);
    r.toggleClass("seleccionFila");
    Session.set("filtroPlanes",aux);
    },
  'click .filaGrupos': function(ev){
       var aux=Session.get("filtroGrupos");
    var r=$("#"+this._id);
    //console.log(r.toogleClass("seleccionFila"));
    console.log(this);
     console.log(r.toggleClass("seleccionFila"));
      //(ev.currentTarget).toogleClass("seleccionFila");
     if(aux.indexOf(ev.currentTarget.id)==-1){
       aux.push(ev.currentTarget.id);
     }else aux.splice(aux.indexOf(ev.currentTarget.id),1);
    
    Session.set("filtroGrupos",aux);
    console.log(Session.get("filtroGrupos"));
    },
});
Template.filtrosSocios.helpers({
   
 "actividades":function(){
    return Actividades.find({}); // this could be pulled from a Session var or something that is reactive
  },
  "grupos":function(){
    return Grupos.find({}); // this could be pulled from a Session var or something that is reactive
  },
	 "planesEmpresa":function(){
    return PlanesEmpresa.find({}); // this could be pulled from a Session var or something that is reactive
  }
});
Template.socios.events({
  'click #btnAgregarSocio': function(){
        Router.go('/nuevoSocio');
    },
 "click .actividadSocio":function(o){
 Meteor.call("getEstadoActividadSocio",$(o.currentTarget).attr("idsocio"),$(o.currentTarget).attr("idactividad"),function(err,res){
swal("ESTADO ACTIVIDAD "+res)
 })
 },
  'mouseover tr': function(ev) {
   $("#tablaSocios").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .nombreSocio': function(ev) {
  
    var _id=ev.currentTarget.id+"";
    	Meteor.call("consultarSocio",_id,true,function(err,res){
		$("#nroSocioGenerico").val(res.nroSocio);
	})
    Router.go('/fichaSocio/'+_id);
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ Socios.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
  'click .ficha': function(ev) {
    Router.go('/fichaSocio/'+this._id);
  },
});
Template.socios.rendered = function() {
  Meteor.subscribe('Grupos');
  Meteor.subscribe('Actividades');
  Meteor.subscribe('Promociones');
  Meteor.subscribe('PlanesEmpresa');
 Session.set("filtroActividades",[]);
  Session.set("filtroGrupos",[]);
  Session.set("filtroPlanes",[]);
  if(Meteor.user().profile!="admin"){
    var act=Actividades.findOne({nombreActividad:Meteor.user().profile});
    Session.set("filtroActividades",[act._id])
    
  }
    
};