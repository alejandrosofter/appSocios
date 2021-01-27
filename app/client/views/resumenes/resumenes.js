Template.resumenes.rendered = function() {
  var now = new Date();

var day = ("0" + now.getDate()).slice(-2);
var month = ("0" + (now.getMonth() + 1)).slice(-2);

var desde = now.getFullYear()+"-"+(month)+"-01" ;
  var hasta = now.getFullYear()+"-"+(month)+"-01" ;
 $("#desde").val(desde);
   $("#hasta").val(hasta);
};
var esValido=function(){
  console.log($("input:radio[name='tipo']:checked").val());
  if($("#desde").val()==="") return false;
  if($("#hasta").val()==="") return false;
  if(!$("input:radio[name='tipo']:checked").val()) return false;
  return true;
}
Template.resumenes.events({
"click #btnPrint":function(){
  var val=this;
  if(esValido()){
     console.log(val);
    Modal.show('resultadoImpresion',function(){
			 var desde=new Date($("#desde").val());
      var hasta=new Date($("#hasta").val());
			Meteor.call("resumenPagos",function(err,res){
				console.log(res);
			});
    return {
      tipoResumen:$("input:radio[name='tipo']:checked").val(),
      desde:desde.toLocaleDateString(),
      hasta:hasta.toLocaleDateString(),
      actividades: Actividades.find().fetch(),
      sociosActivos:Socios.find({estado:"ALTA"}).fetch().length,
            
           };
});
  }else{
    	swal("Ops!", "Hay datos incorrectos en el formulario!", "error");

  }
		
},
});