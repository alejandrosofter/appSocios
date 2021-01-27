var margenes={frente:-100,dorso:-100,top:-100};
var imprimeCanvas=function(img)
{
  // fabric = require('fabric/dist/fabric').fabric;
  // var canvas = new fabric.Canvas('contenedor');

var grupo=[];

fabric.Image.fromURL(img, function(oImg) {
   var img2 = fabric.util.object.clone(oImg);
  oImg.scale(0.72);
  console.log(margenes)
  oImg.set({ left: margenes.frente,top:margenes.top});

  img2.scale(0.72);
  img2.set({ left: margenes.frente,top:margenes.top2});
canvas.add(oImg);
canvas.add(img2);
});



}

var imprimePdf=function(socio,docDefinition,moldeTarjeta,masY,esSegundo)
{
  var fuentesPdf={};
      
      var imagenMolde=moldeTarjeta;
     console.log(socio)
      var grupo=Grupos.findOne({_id:socio.idGrupo});
      var imagenGrupo=null;
      if(grupo!=null)imagenGrupo=grupo.imagen;
    var imag=socio.fotoCarnet;
  
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
      console.log(docDefinition)
      var espacioApe=((apellido.length)*15)+10;

       
      docDefinition.content.push({image:imagenMolde,width: 235, height: 150,absolutePosition: {x: 72, y: 15+masY}})
      docDefinition.content.push({text:socio.nombres,absolutePosition: {x: 95, y: 34+masY},bold:true, fontSize: tamFuente2,color:"white"});
      docDefinition.content.push({ text: 'DNI ', fontSize: tamFuente1,color:"white", absolutePosition: {x: 180, y: 70+masY}})
        docDefinition.content.push({text:dni,absolutePosition: {x: 225, y: 70+masY},bold:true, fontSize: tamFuente1,color:"white"})

          docDefinition.content.push({ text: 'SOCIO ', fontSize: tamFuente1,color:"white", absolutePosition: {x: 180, y: 110+masY}})
            docDefinition.content.push({text:nroSocio.lpad("0",4),absolutePosition: {x: 235, y: 110+masY},bold:true, fontSize: tamFuente1,color:"white"})

if(imag.data)docDefinition.content.push({image:imag.data,width: 75, height: 75,absolutePosition: {x: 95, y: 60+masY}})
docDefinition.content.push({ text: 'Esta tarjeta es para uso personal ', fontSize: 7,color:"grey", absolutePosition: {x: (imagenGrupo?100:140), y: 143+masY}})
      
        
      if(imagenGrupo!=null)docDefinition.content.push({image:imagenGrupo,width:40, absolutePosition: {x:230, y: 130+masY}});
       docDefinition.content.push({ canvas: [
        {
          type: 'rect',
          x: 95,
          y: esSegundo?margenes.top2:60,
          w: 75,
          h: 75,
          r: 10,
          //dash: {length: 5},
           lineWidth: 8,
          lineColor: color,
        },
        
      
],},)

  return docDefinition
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

var canvas;
var _imprime=function(valores,x,y)
{
 
var grupo=[];


var nombre = new fabric.Text(valores.nombres.toUpperCase(), { fontSize: 22,left: 114, top: 247,
  fontFamily: 'Roboto' }).set({fill: 'white'});
//var valNombre = new fabric.Text(valores.nombre, { fontSize: 30,left: 110, top: 280  });
var dni = new fabric.Text("DNI", { fontSize: 14,left: 240, top: 300  }).set({fill: 'white'});
var valDni = new fabric.Text(valores.dni, { fontSize: 18,left: 290, top: 298,fontFamily: 'Roboto'  }).set({fill: 'white'});

var nroSocio = new fabric.Text("NRO SOCIO", { fontSize: 14,left: 240, top: 330  }).set({fill: 'white'});
var valNroSocio = new fabric.Text(valores.nroSocio.toString(), { fontSize: 18,left: 330, top: 328,fontFamily: 'Roboto'  }).set({fill: 'white'});

var valida = new fabric.Text("Esta tarjeta es solo para uso personal", { fontSize: 10,left: 160, top: 400  }).set({fill: '#ccc'});




fabric.Image.fromURL(moldeTarjeta, function(oImg) {
  oImg.scale(0.728);
  oImg.set({ left: 80, top: 223 });
  grupo.push(oImg);
  if(valores.fotoCarnet)
    fabric.Image.fromURL(valores.fotoCarnet.data, function(imgFoto) {
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
    group.set({ left: x,top:y});
    canvas.add(group);
    })
  else{
    grupo.push(nombre);
    // grupo.push(valNombre);
    grupo.push(dni);
    grupo.push(valDni);

    grupo.push(nroSocio);
    grupo.push(valNroSocio);

    grupo.push(valida);
    var group = new fabric.Group(grupo);
    group.set({ left: x,top:y});
    canvas.add(group);
  }
});


}
var imprimeTarjeta=function(socio,socio2)
{
  var docDefinition = {
          compress: false,
    content: [ ],
  
  // a string or { width: number, height: number }
  pageSize: { width: 549, height: 801 },

  // by default we use portrait, you can change it to landscape if you wish
 // pageOrientation: 'landscape',

  // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
  pageMargins: [ 0, 0, 0, 0 ],

};
   // _imprime(socio,x,y)
 docDefinition=imprimePdf(socio,docDefinition,moldeTarjeta,0)
  docDefinition=imprimePdf(socio2,docDefinition,moldeTarjeta,margenes.top,true)
   try {

  UIBlock.block('Buscando fuentes y generando carnet...');
    Meteor.call("getFuentes",function(err,fuentesPdf){
        UIBlock.unblock();
         pdfMake = pdfMake || {};
        pdfMake.vfs = fuentesPdf;
         pdfMake.createPdf(docDefinition).download(socio.nroSocio+".pdf");
        
      });
}
catch(err) {
    swal("Ops...", "Seguramente el socio no tiene foto! .. por favor ingrese una"+err, "error");
}

}
Template.impresionCarnets.rendered=function(){
  Meteor.call("getImagen","frenteTarjeta",function(err,res){
    Meteor.call("getMargenesTarjetas",function(err,setting){

      if(!setting)swal("Opss..","debes asignar un margen a las tarjetas desde variables del sistema!.. luego vuelve a intentar","warning");
      else {
        console.log(setting)
        margenes=setting;
      } 

        canvas = new fabric.Canvas('contenedor');
        imprimeCanvas(res)
  })
})

}

Template.impresionCarnets.events({

  'click #btnAcepta': function(){
     window.print();
    },
  
 
});
var imagenMolde=null;
Template.impresionCarnetsDobles.rendered=function(){
  Meteor.call("getImagen","dorsoTarjeta",function(err,res){

Meteor.call("getMargenesTarjetas",function(err,setting){
        moldeTarjeta=res;
        margenes=setting;
     })   
  })


}
var socio1;
var socio2;
var moldeTarjeta;
var buscarSocios=function()
{
  if($("#nroSocio1").val()!="")
   Meteor.call("getSocioNro",$("#nroSocio1").val(),function(err,res){
    socio1=res;
    $("#nombreSocio1").val(res.apellido+" "+res.nombre)
  })
 if($("#nroSocio2").val()!="")
    Meteor.call("getSocioNro",$("#nroSocio2").val(),function(err,res){
    socio2=res;
    $("#nombreSocio2").val(res.apellido+" "+res.nombre)
  })
}
Template.impresionCarnetsDobles.events({

  'click #btnAcepta': function(){
     socio1.nombres=$("#nombreSocio1").val().toUpperCase();
     socio2.nombres=$("#nombreSocio2").val().toUpperCase();
      imprimeTarjeta(socio1,socio2);
    },
    "click #btnColocar":function(){
      canvas = new fabric.Canvas('contenedor'); 
      socio1.nombres=$("#nombreSocio1").val();
      imprimeTarjeta(socio1,socio2);
    },
  "click #btnBuscar":function(){
      buscarSocios()
    },
 
});