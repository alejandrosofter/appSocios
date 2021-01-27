
AutoForm.hooks({
	'nuevaTarjetaSocio_': {
		onSuccess: function(operation, result, template) {
			swal("GENIAL!", "Se ha ingresado la tarjeta al socio!", "success");
			Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},



});


Template.nuevaTarjetaSocio.helpers({
	"opciones":function(){
		
        return _.map(Promociones.find().fetch(), function (c, i) {
          return {label: c.nombrePromocion, value: c._id};
				});
		
	}
});
var moldeTarjeta=null;
var imgInex=null;
Template.tarjetasSocio.rendered=function(){
	Meteor.call("getImagen","dorsoTarjeta",function(err,res){
	
    if(res) moldeTarjeta=res;
    else swal("Opss.","No se encuentra la imagen de fondo para la tarjeta.. Ingrese desde DATOS DE SISTEMA y vuelva a intentar","error")
})
	Meteor.call("getImagen","fotoSocioInexistente",function(err,res){
    if(res) imgInex=res;
    else swal("Opss.","No se encuentra la imagen de INEXISTENTE.. ","error")
})
}
Template.tarjetasSocio.helpers({
'esAdmin': function(){
     if(!Meteor.user())return false;
     if(Meteor.user().profile==="admin")return true;
       return false;
     },
	'settings': function() {
		return {
			collection: this.tarjetas,
			rowsPerPage: 10,
			class: "table table-condensed",
			showFilter: false,
			fields: [
				{
					key: 'fecha',
					label: 'Fecha',
					headerClass: 'col-md-2',
					fn: function(value, object, key) {
						var d = new Date(value);
						return d.getFecha();
					}
				}, 

				{
					key: 'detalle',
					label: 'Detalle',
					//headerClass: 'col-md-2',
					
				},

				{
					label: '',
					headerClass: 'col-md-2',
					tmpl: Template.accionesTarjetasSocios
				}
			]
		};
	},
	"items": function() {
		return this.tarjetas;
	},

	'mouseover tr': function(ev) {

	},

});
var buscarCampoDeuda=function(deuda,campo)
{
	var imp=0;
	$(Session.get("socio").deudas).each(function(i,item){
		if(deuda==item._id){imp=item[campo];return;}
	});
	return imp;
}

Template.imprimirCarnet.helpers({
  "fechaNac":function(){
    var d=new Date(this.fechaNacimiento);
		return d.getFecha();
  },
  "esInactivo":function(){
    return this.estado!="ACTIVO";
  },
	"numeroDeSocio":function(){
    var nro=this.nroSocio+" ";
		console.log(nro);
		return nro.lpad("0",5);
  }
});
Template.imprimirCarnet.events({
    'click .btnAcepta': function () {
				window.print();
		
 
    }
});

Template.imprimirCarnet.onRendered(function(){

	imprimePdf(this._id)
});
var imprimePdf=function(idTarjeta)
{
	var fuentesPdf={};
  		
			var imagenMolde=moldeTarjeta;
        var act=Session.get("socio");
      act.idTarjeta=idTarjeta;
		
			var socio=Session.get("socio");
			console.log(socio);
			var grupo=Grupos.findOne({_id:socio.idGrupo});
			console.log(grupo);
			var imagenGrupo=null;
			if(grupo!=null)imagenGrupo=grupo.imagen;
	var imag=Imagenes.findOne({idSocio:socio._id._str});
			if(imag==null ) imag=Imagenes.findOne({idSocio:socio._id});
			if(!imag){
				console.log(imgInex)
				imag={};
					imag.data=imgInex;
			
			}
//  import "pdfkit";
	
	var nombres=socio.apellido.toUpperCase()+", "+nombre;
			var dni=socio.dni;
			var nroSocio=socio.nroSocio+"";
	var tamFuente1=11;
			var tamFuente2=14;
		
			var color=Settings.findOne({clave:"colorDefecto"}).valor;
		      var nombre=socio.nombre.charAt(0).toUpperCase() + socio.nombre.slice(1);
			var tamNombres=(socio.apellido+", "+nombre).length;
			
			
			if(tamNombres>25){
				var arr=nombre.split(" ")
				nombre=arr[0]
			}
			var arrApellido=socio.apellido.split(" ");
			var arrNombre=socio.nombre.split(" ");
			apellido=arrApellido[0].toUpperCase();
			nombre=arrNombre[0].toUpperCase();
			
			var espacioApe=((apellido.length)*15)+10;
			
				var docDefinition = {
					compress: false,
		content: [
			 
			{image:imagenMolde,width: 235, height: 150,absolutePosition: {x: 70, y: 15}},
			{text:apellido+", "+nombre,absolutePosition: {x: 95, y: 34},bold:true, fontSize: tamFuente2,color:"white"},
			//{text: nombre,absolutePosition: {x: (87+espacioApe), y: 38},bold:false, fontSize: tamFuente2,color:"white"},
			{ text: 'DNI ', fontSize: tamFuente1,color:"white", absolutePosition: {x: 180, y: 70}},
			{text:dni,absolutePosition: {x: 225, y: 70},bold:true, fontSize: tamFuente1,color:"white"},
		
			{ text: 'SOCIO ', fontSize: tamFuente1,color:"white", absolutePosition: {x: 180, y: 110}},
				{text:nroSocio.lpad("0",4),absolutePosition: {x: 235, y: 110},bold:true, fontSize: tamFuente1,color:"white"},
				
			{ text: 'Esta tarjeta es para uso personal ', fontSize: 8,color:"grey", absolutePosition: {x: 130, y: 138}},
			
			{image:imag.data,width: 75, height: 75,absolutePosition: {x: 95, y: 60}},
			
			{	canvas: [
				{
					type: 'rect',
					x: 95,
					y: 60,
					w: 75,
					h: 75,
					r: 10,
					//dash: {length: 5},
					 lineWidth: 8,
					lineColor: color,
				},
				
			
],},
			],
	
  // a string or { width: number, height: number }
  pageSize: { width: 549, height: 801 },

  // by default we use portrait, you can change it to landscape if you wish
 // pageOrientation: 'landscape',

  // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
  pageMargins: [ 0, 0, 0, 0 ],

};
			if(imagenGrupo!=null)docDefinition.content.push({image:imagenGrupo,absolutePosition: {x:470, y: 155}});
				try {

	UIBlock.block('Buscando fuentes y generando carnet...');
    Meteor.call("getFuentes",function(err,fuentesPdf){
  			UIBlock.unblock();
  			 pdfMake = pdfMake || {};
  			pdfMake.vfs = fuentesPdf;
    	   pdfMake.createPdf(docDefinition).download(socio.nroSocio+".pdf");
  			
//   			pdfMake.createPdf(docDefinition).getDataUrl(function (outDoc) {
//   				window.open("data:application/pdf," + escape(outDoc));
// });
  		});
}
catch(err) {
    swal("Ops...", "Seguramente el socio no tiene foto! .. por favor ingrese una"+err, "error");
}

  
}
var getValoresTarjeta=function()
{
	var socio=Session.get("socio");
			var grupo=Grupos.findOne({_id:socio.idGrupo});

			var imagenGrupo=null;
			if(grupo!=null)imagenGrupo=grupo.imagen;
	var imag=Imagenes.findOne({idSocio:socio._id._str});
			if(imag==null ) imag=Imagenes.findOne({idSocio:socio._id});
			if(!imag){
				imag={};
					imag.data=imgInex;
			
			}
//  import "pdfkit";
	
	var nombres=socio.apellido.toUpperCase()+", "+nombre;
			var dni=socio.dni;
			var nroSocio=socio.nroSocio+"";
	var tamFuente1=10;
			var tamFuente2=8;
		
			var color=Settings.findOne({clave:"colorDefecto"}).valor;
		      var nombre=socio.nombre.charAt(0).toUpperCase() + socio.nombre.slice(1);
			var tamNombres=(socio.apellido+", "+nombre).length;
			
			
			if(tamNombres>25){
				var arr=nombre.split(" ")
				nombre=arr[0]
			}
			var arrApellido=socio.apellido.split(" ");
			var arrNombre=socio.nombre.split(" ");
			apellido=arrApellido[0].toUpperCase();
			nombre=arrNombre[0].toUpperCase();
			
			var espacioApe=((apellido.length)*15)+10;
			return {espacioApellido:espacioApe,apellido:apellido,nombre:nombre,imagen:imag,dni:socio.dni,nroSocio:socio.nroSocio}
}
function roundedCorners(ctx) {
	var rect = new fabric.Rect({
    left:0,
    top:0,
    rx:7 / this.scaleX,
    ry:7 / this.scaleY,
    width:this.width,
    height:this.height,
    fill:'#000000'
  });
  rect._render(ctx, false);
}

var imprimeCanvas=function(id)
{
	//fabric = require('fabric/dist/fabric').fabric;
	var canvas = new fab.Canvas('contenedor');
var valores=getValoresTarjeta();
var grupo=[];


var nombre = new fabric.Text(valores.apellido+"  "+valores.nombre, { fontSize: 22,left: 114, top: 247,
  fontFamily: 'Roboto' }).set({fill: 'white'});
//var valNombre = new fabric.Text(valores.nombre, { fontSize: 30,left: 110, top: 280  });
var dni = new fabric.Text("DNI", { fontSize: 14,left: 240, top: 300  }).set({fill: 'white'});
var valDni = new fabric.Text(valores.dni, { fontSize: 18,left: 280, top: 298,fontFamily: 'Roboto'  }).set({fill: 'white'});

var nroSocio = new fabric.Text("NRO SOCIO", { fontSize: 14,left: 240, top: 330  }).set({fill: 'white'});
var valNroSocio = new fabric.Text(valores.nroSocio.toString(), { fontSize: 18,left: 330, top: 328,fontFamily: 'Roboto'  }).set({fill: 'white'});

var valida = new fabric.Text("Esta tarjeta es solo para uso personal", { fontSize: 10,left: 160, top: 400  }).set({fill: '#ccc'});




fabric.Image.fromURL(moldeTarjeta, function(oImg) {
	oImg.scale(0.73);
	oImg.set({ left: 80, top: 223 });
  grupo.push(oImg);
  fabric.Image.fromURL(valores.imagen.data, function(imgFoto) {
	imgFoto.scale(0.6);
	
	imgFoto.set({ left: 114, top: 278 ,clipTo: roundedCorners.bind(imgFoto)});

  grupo.push(imgFoto);
  grupo.push(nombre);
// grupo.push(valNombre);
grupo.push(dni);
grupo.push(valDni);

grupo.push(nroSocio);
grupo.push(valNroSocio);

grupo.push(valida);
var group = new fabric.Group(grupo);
group.set({ left: 90,top:237});
canvas.add(group);
});
});



}
Template.tarjetasSocio.events({
  	'click .imprimirCarnet': function(){
  		//imprimePdf(this._id);
  		Modal.show("imprimirCarnet");
    },
	'click #btnAgregarTarjeta': function(ev) {
		var act = this;

		Modal.show('nuevaTarjetaSocio', function() {
			return act;
		});
	},
	'click .delete': function(ev) {
		var val = this;
		console.log(this);
		swal({
				title: "Estas Seguro de quitar la tarjeta?",
				text: "Una vez que lo has quitado sera permanente!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Si, borralo!",
				closeOnConfirm: false
			},
			function() {
				var id = Session.get('socio')._id;
				Meteor.call("quitarTarjeta", id, val._id, function(err, res) {
					if (!err) swal("Quitado!", "El registro ha sido borrado", "success");
					else swal("Ops...", "Ha ocurrido un error para quitar! .. por favor chekear nuevamente", "error");
				});
				//Socios.update({_id:id},{$pull:{deudas:{_id:val.doc._id}}},{getAutoValues: false});
			});

	},
	'click .update': function(ev) {
		var val = this;
		Modal.show('modificaDeudaSocio', function() {
			return val._id;

		});
	},

});