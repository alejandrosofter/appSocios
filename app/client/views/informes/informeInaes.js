Template.informeInaes.onRendered(function(){
  var d=new Date();
  $("#anoSeleccion").val(d.getFullYear())
  var mesEnLetras=mesLetras(d.getMonth()+1);
  $('#mes option[value='+mesEnLetras+']').prop('selected', 'selected').change();
  

});
function buscar(){
	var acts=Actividades.find().fetch();
	for(var i=0;i<acts.length;i++){
		consultarActividad(acts[i]);
	}
}
function consultarActividad(act)
{
	Meteor.call("actividadInforme",act,function(err,res){
		// Blaze.renderWithData()
		console.log(res)
	})
}
Template.informeInaes.helpers({
	 "meses":function(){
    return getMeses();
  },
  "actividades":function(){
    return Actividades.find().fetch();
  },
});
Template.actividadInaes.helpers({
	 "actividad":function(){
    return this.doc.nombreActividad
  },
   "idActividad":function(){
    return this.doc._id
  },
});

Template.informeInaes.events({
	 "click #btnBuscar":function(){
    buscar();
  },
}
 

);
 