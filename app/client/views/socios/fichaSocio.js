Template.adjuntaImagen.created=function(){
  this.dataUrl=new ReactiveVar();
};
Template.fichaSocio.created=function(){
  //this.dataUrl=new ReactiveVar();
	UIBlock.unblock();
};

Template.fichaSocio.onRendered(function() {
	//UIBlock.unblock();
// 	Meteor.call("dataSocio",this.data,function(err,res){
// 		UIBlock.unblock();
// 		console.log("SOPCCCOP"+res);
// 		Session.set("socio",res);
// 	});
//onsole.log(this.data);
// 	var id=Session.get("socio")._id;
// 	console.log(Session.get("socio"));
// 	console.log(id);
// 	console.log("SUSCRIBIENDO >>>"+id);
Meteor.subscribe('Pagos',this.data);
Meteor.subscribe('Deudas',this.data);
	

})
Template.adjuntaImagen.events({
  "change input[type='file']":function(event,template){
		var resizeImage = require('resize-image');
    var files=event.target.files;
    if(files.length===0){
      return;
    }
    var file=files[0];
    //
    var fileReader=new FileReader();
    fileReader.onload=function(event){
			var img = new Image();
			img.onload= function () {
			var data = resizeImage.resize(img, 100, 100, resizeImage.PNG);
				//data=img;
				console.log("CARGO resicze");
				console.log(data);
				var socio=Session.get("socio");
				Meteor.call("modificarImagenSocioAdjunto",socio._id._str,data);
					Modal.hide();
					$(".modal-backdrop").remove();
				
			};
			
      var dataUrl=event.target.result;
			img.src = dataUrl; 
    };
    fileReader.readAsDataURL(file);
  }
});
 var video=null;
  var canvas=null;
Template.camara.onRendered(function() {

	// Webcam.set({
 //        width: 320,
 //        height: 440,
 //        dest_width: 165,
 //        dest_height: 180,
 //        image_format: 'jpeg',
 //        jpeg_quality: 100
 //    });
 //    Webcam.attach( '#webcam' );
video = document.querySelector("#webcam");
if (navigator.mediaDevices.getUserMedia) {       
    navigator.mediaDevices.getUserMedia({video: true})
  .then(function(stream) {
    video.srcObject = stream;
  })
  .catch(function(error) {
    console.log("Something went wrong!");
  });
}

});

var zoom=1;

Template.camara.events({
  "click #zoomMas":function()
  {

    //$(video).attr("style","width:200%; left:-50%; top:-25%")

    zoom+=0.1;
   // video.style["MozTransform"]='scale('+zoom+')';
  }
,
 "click #zoomMenos":function()
  {

    //$(video).attr("style","width:200%; left:-50%; top:-25%")

    zoom-=0.1;
   // video.style["MozTransform"]='scale('+zoom+')';
  }
,
    'click .snap': function () {
 canvas = document.getElementById('canvasFoto');

			  canvas.width = 165;
        canvas.height = 180;
        canvas.getContext('2d').drawImage(video, 0,0, canvas.width, canvas.height);

    },
	'click #btnCargar': function () {
		UIBlock.block('GUARDANDO FOTO...');
    canvas = document.getElementById('canvasFoto');
    var data=canvas.toDataURL('image/jpeg', 1);
	Meteor.call("cambiarImagenSocio",data,Session.get("socio")._id,function(err,res){
		Modal.hide();
		$(".modal-backdrop").remove();
		UIBlock.unblock();
	});
//	Session.set("imagenCarnet","");
}
});
Template.fotoSocio.helpers({
    imagenCarnet: function () {
			var imagen=Imagenes.findOne({idSocio:this._id._str});
			if(imagen==null) imagen=Imagenes.findOne({idSocio:this._id});
	       if(imagen) return imagen.data;
    }
});
Template.camara.helpers({
    image: function () {
        return Session.get('webcamSnap');
    }
});
Template.estadoSocio.helpers({
  "esActivo":function(){
    console.log(this);
    return this.estado=="ACTIVO";
  },
  "esInactivo":function(){
    return this.estado!="ACTIVO";
  }
});
Template.fichaSocio.events({
  'click #btnAgregarPago': function(){
        var act=this;
		
    Modal.show('nuevoPago',function(){ return act; });
  
    },
	
	'click #btnSacaFoto': function(){
        var act=this;
    Modal.show('camara',function(){ return act; });
  $("#modalCamara").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
    },
	'click #btnAdjuntaFoto': function(){
        var act=this;
    Modal.show('adjuntaImagen',function(){ return act; });
  $("#modalCamara").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
    },
	'click #editarSocio': function(){
        var act=this;
   Modal.show('modificarSocio',function(){ return Session.get("socio"); });
    },
	'click #quitarSocio': function(){
        var act=this;
	 swal({   title: "Estas Seguro de proceder?",   text: "Una vez aceptado se borrara toda la informacion del socio..",   type: "error",   showCancelButton: true,   confirmButtonColor: "#F27474",   confirmButtonText: "Si, QUITAR!",   closeOnConfirm: true },
               function(){
             UIBlock.block('Eliminando Socio, aguarde por favor...');
		 				var socio=Session.get("socio");
            Meteor.call('quitarSocio',socio._id,function(err,res){
					
          
		       Router.go("/socios");
							  UIBlock.unblock();
          });
          });	
	},
 
});
Template.accesoSocio.events({
  'click #btnAccesoSocio': function(){
       	Router.go('/fichaSocio/'+this.socio._id);
    },
 
});
Template.accesoSocio.helpers({
	"colorEstado":function(){
		return this.socio.estado==="BAJA"?"#eab4b4":"#ccc";
	}
});
Template.detalleCuentaSocio.helpers({
	"colorEstado":function(){
		
	}
});
Template.detalleCuentaSocio.helpers({
	'settings': function(){
		var res=null;
		var deudas=Deudas.find({idSocio:socio._id._str}).fetch();
		//console.log(socio);
		var pagos=Pagos.find({idSocio:socio._id._str}).fetch();
		if(deudas!=null&&pagos!=null)
			res=deudas.concat(pagos);
		//console.log(res);
        return {
					
 collection: res,
 rowsPerPage: 10,
	rowClass: function(item) {
  var fecha = item.fechaBaja;
  if(item.detalle && item.estado==="CANCELADO")return "pagado";
},
 class: "table table-condensed",
 showFilter: false,
 fields: [
	 {
        key: 'created',
				hidden:true,
			sortOrder:0,
       sortDirection: 'descending',
      },
	  {
        key: 'created',
			label: 'Imputado...',
			headerClass: 'col-md-3',
			 fn: function (value, object, key) {
          var d=new Date(value);
           return d.toLocaleDateString()+" "+d.toLocaleTimeString();
         }
      },
      {
        key: 'fecha',
        label: 'Fecha',
				hidden:true,
				headerClass: 'col-md-1',
        fn: function (value, object, key) {
          var d=new Date(value);
           return d.toLocaleDateString();
         }
      },
	  
	 {
        key: '_id',
        label: 'Detalle',
				
       fn: function (value, object, key) {
          if(object.detalle)return object.detalle;
				  return "PAGO DE CUOTA";
         }
      },
	
   {
        key: 'importe',
        label: 'Debe',
        headerClass: 'col-md-2',
		  fn: function (value, object, key) {
						if(object.detalle)return value.toFixed(2);
				return 0.00;
         },
      },
	  {
        key: 'importe',
        label: 'Haber',
        headerClass: 'col-md-2',
		  fn: function (value, object, key) {
						if(!object.detalle)return value.toFixed(2);
				return 0.00;
         },
      },
	
 ]
 };
    },
	"items":function(){
		return this.deudas;
	},
	
	'mouseover tr': function(ev) {
  
  },
	
});
Template.fichaSocio.helpers({
	 'esAdmin': function(){
     if(!Meteor.user())return false;
     if(Meteor.user().profile==="admin")return true;
       return false;
     },
     "tieneIdCbu":function()
     {
        if(this.idCbuAsociado)return true;
        return false;
     },
     "nroCbuAsignado":function()
     {
       return CbuSocios.findOne({_id:this.idCbuAsociado}).cbu;  
     },
     "pagaEnCuenta":function()
     {
        if(this.formaDePagoPrincipal=="CUENTA")return true;
        return false;
     },
  "tipoSocio":function(){
     return getTipoSocio(this.fechaNacimiento,this.esActivo)
  },
	 "saldoTotal":function(){
		 var aux=0;
  if( Session.get("resSaldo")!==null)aux=  (Session.get("resSaldo").totalCreditos-Session.get("resSaldo").totalDebitos).toFixed(2);
	var clase=aux<0?"claseBaja":"claseAlta";
   return new Spacebars.SafeString("<span class='"+clase+"'>"+aux+"</span>");
},
	 "claseEstado":function(){
    if(this.estado=="ALTA")return "success";
		 if(this.estado=="BAJA")return "danger";
  },
	
	"importeSaldo":function(){
    var res=this.deudas.concat(this.pagos);
		var imp=0;
		$(res).each(function(i,item){
			if(item.detalle)imp+=item.importe;//es una deuda
			else imp-=item.importe;//es un pago
		});
		return imp.toFixed(2);
  },
	 "cantidadActividades":function(){
   return this.actividades.length;
  },
	 "cantidadTarjetas":function(){
   return this.tarjetas.length;
  },
   "cantidadDocumentos":function(){
    if(!this.documentacion)return 0
   return this.documentacion.length;
  },
   "cantidadCambiosEstado":function(){
   return this.cambiosEstado.length;
  },
   "cantidadDebitos":function(){
   return this.debitoAutomatico.length;
  },
   "cantidadPlanesEmpresa":function(){
   if(this.planesEmpresa) return this.planesEmpresa.length;
   return 0
  },
	"cantidadDeudas":function(){
		console.log("CANTIDAD");
		console.log(Deudas.find({estado:"PENDIENTE"}));
   return Deudas.find({estado:"PENDIENTE"}).fetch().length;
  },
	
	"nroDeSocio":function(){
  var nro= this.nroSocio+"";
		return nro.lpad("0",4);
		
  },
	"socioPrevio":function(){
   return Socios.findOne({nroSocio:this.nroSocio-1});
  },
	"socioSiguiente":function(){
   return Socios.findOne({nroSocio:this.nroSocio+1});
  },
	 "nombreGrupo":function(){
    var grupo=Grupos.findOne({_id:this.idGrupo});
		 return grupo.nombre;
  },
	"colorEstado":function(){
    if(this.estado=="ALTA")return "";
		 if(this.estado=="BAJA")return "red";
		 if(this.estado=="SUSPENDIDO")return "orange";
  },
  "ultimo_detalleEstado":function(){
   var tam=this.cambiosEstado.length;
   var ce=this.cambiosEstado[tam-1];
   
   console.log(ce.detalle);
   return ce.detalle
  },
  "ultimo_fechaEstado":function(){
   var tam=this.cambiosEstado.length;
   var ce=this.cambiosEstado[tam-1];
   return ce.fecha.getFecha()
  },
  "edad":function(){
     var nacimiento=new Date(this.fechaNacimiento);
      var ahora=new Date();
     var anos=ahora.getFullYear()-nacimiento.getFullYear();
     
    return anos;
  },
  "claseTipo":function(){
    var nacimiento=new Date(this.fechaNacimiento);
      var ahora=new Date();
     var anos=ahora.getFullYear()-nacimiento.getFullYear();
     var tipo=anos<18?"PARTICIPANTE":"ADHERENTE";
     if(this.esActivo)tipo="ACTIVO";
    
  var clase=tipo==="PARTICIPANTE"?"text-warning":"text-info";
  if(tipo==="ACTIVO")clase="text-danger";
  
    return clase;
}
});
