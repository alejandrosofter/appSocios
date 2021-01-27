applicationControllerExporta = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Grupos'),
			Meteor.subscribe('Actividades'),
      Meteor.subscribe('Promociones'),
			 Meteor.subscribe('PlanesEmpresa'),
			 Meteor.subscribe('Settings'),
			Meteor.subscribe('ImportarPagos'),
			Meteor.subscribe('Usuarios'),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
	
	applicationController = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Grupos'),
			Meteor.subscribe('Actividades'),
      Meteor.subscribe('Promociones'),
			 Meteor.subscribe('PlanesEmpresa'),
			 Meteor.subscribe('Settings'),
			Meteor.subscribe('ImportarPagos'),
			Meteor.subscribe('ArchivoBancos'),
			Meteor.subscribe('Usuarios'),
			Meteor.subscribe('CbuSocios'),
			Meteor.subscribe('Profesores'),
			//Meteor.subscribe('MensajesInternos',Meteor.userId()),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});

	applicationControllerApi = RouteController.extend({
  layoutTemplate: 'layoutVacio',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Grupos'),
			Meteor.subscribe('Actividades'),
      Meteor.subscribe('Promociones'),
			 Meteor.subscribe('PlanesEmpresa'),
			 Meteor.subscribe('Settings'),
			Meteor.subscribe('ImportarPagos'),
			Meteor.subscribe('ArchivoBancos'),
			Meteor.subscribe('Usuarios'),
			Meteor.subscribe('CbuSocios'),
			Meteor.subscribe('Profesores'),
			//Meteor.subscribe('MensajesInternos',Meteor.userId()),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
	
	applicationControllerMensajes = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Grupos'),
			Meteor.subscribe('Actividades'),
      Meteor.subscribe('Promociones'),
			 Meteor.subscribe('PlanesEmpresa'),
			 Meteor.subscribe('Settings'),
			Meteor.subscribe('Usuarios'),
			Meteor.subscribe('Mensajes'),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});

applicationControllerGeneracionDeudas = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Grupos'),
			Meteor.subscribe('Actividades'),
      Meteor.subscribe('Promociones'),
			 Meteor.subscribe('Settings'),
				Meteor.subscribe('GeneracionDeudas'),
			Meteor.subscribe('ImportarPagos'),
      //Meteor.subscribe('Socios'),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
applicationControllerInformes = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Grupos'),
			Meteor.subscribe('Actividades'),
      Meteor.subscribe('Promociones'),
			 Meteor.subscribe('Settings'),
      //Meteor.subscribe('Socios'),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
// Router.configure({
// 	  layoutTemplate: 'layoutApp',
// 	  notFoundTemplate: 'notFound',
// 	  loadingTemplate: 'loaderGral',
// 	});
// Router.onBeforeAction(function(pause) {
//   if(!Meteor.user()){
//      this.layout('layoutLogin');
//     this.render('login');
//    // this.next();
//   }else{
//     this.next();
//   }
// });
Router.route('planesEmpresa', {
		path: '/planesEmpresa',
    template:"planesEmpresa",
		controller: applicationController,
})
Router.route('profesores', {
		path: '/profesores',
    template:"profesores",
		controller: applicationController,
})
Router.route('informeMorosos', {
		path: '/informeMorosos',
    template:"informeMorosos",
		controller: applicationController,
})
Router.route('informeInaes', {
		path: '/informeInaes',
    template:"informeInaes",
		controller: applicationControllerInformes,
})
Router.route('cbuSocios', {
		path: '/cbuSocios',
    template:"cbuSocios",
		controller: applicationController,
})
Router.route('nuevoProfesor', {
		path: '/nuevoProfesor',
    template:"nuevoProfesor",
		controller: applicationController,
})
Router.route('/modificarProfesor/:_id', {
    template: 'modificarProfesor',
    controller: applicationController,
    data: function(){
         var sal=Profesores.findOne({_id: this.params._id});
         return sal;
    }
});

Router.route('/cbuSociosAsignados/:_id', {
    template: 'cbuSociosAsignados',
    controller: applicationController,
    data: function(){
         var sal=CbuSocios.findOne({_id: this.params._id});
         Session.set("cbuAsignadoSeleccionado",sal);
         return sal;
    }
});
Router.route('/rtaBancos/:_id', {
    template: 'rtaBancos',
    controller: applicationController,
    data: function(){
         var sal=ArchivoBancos.findOne({_id: this.params._id});
         Session.set("idRtaSeleccion",this.params._id);
         return sal;
    }
});
Router.route('generarArchivoBanco', {
		path: '/generarArchivoBanco',
    template:"generarArchivoBanco",
		controller: applicationController,
})
Router.route('nuevoArchivoBancos', {
		path: '/nuevoArchivoBancos',
    template:"nuevoArchivoBancos",
		controller: applicationController,
})
Router.route('archivoBancos', {
		path: '/archivoBancos',
    template:"archivoBancos",
		controller: applicationController,
})
Router.route('descargarExcelSocios', {
    where: 'server',
    path: '/descargarExcelSocios/',
    action: function() {
    var datos = "This is the awesome text.";
      var filename = 'excel' + '.xlsx';
      var path = process.cwd() + "/../web.browser/app/shellPython/"+filename;
     var headers = {
        'Content-Type': 'application/vnd.ms-excel',
        'Content-Disposition': "attachment; filename="+filename
      };
      this.response.writeHead(200, headers);
      
      var serv=this;
     fs = Npm.require('fs');
		var data = fs.readFileSync(path);
      

     

      
      return this.response.end(data);
    }
  }) 
Router.route('informeGral', {
		path: '/informeGral',
    template:"informeGral",
		controller: applicationController,
})

Router.route('mensajes', {
		path: '/mensajes',
    template:"mensajes",
		controller: applicationControllerMensajes,
})
Router.route('/modificarMensaje/:_id', {
    template: 'modificarMensaje',
    controller: applicationControllerMensajes,
    data: function(){
         var sal=Mensajes.findOne({_id: this.params._id});
         console.log(sal)
         return sal;
    }
});

// if (Meteor.isServer) {
// 	//Router.onBeforeAction(Iron.Router.bodyParser.json({limit: "30mb"}));

//   var Busboy =  Npm.require("busboy"),
//       fs = Npm.require("fs"),
//       os = Npm.require("os"),
//       path = Npm.require("path");
//  inspect = Npm.require('util').inspect;
//  fs.truncate("archivoImagen");
//  var img=fs.createWriteStream("archivoImagen");
//   Router.onBeforeAction(function (req, res, next) {
//     var filenames = []; // Store filenames and then pass them to request.

//      if (req.method === 'POST') {
//     var busboy = new Busboy({ headers: req.headers });
//     busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
//       console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      
//       file.on('end', function() {
//         console.log('File [' + fieldname + '] Finished');
//       });
//     });
//     busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
//       console.log("a")
  
//     });
//     busboy.on('finish', function() {
//       console.log('Done parsing form!');
//       img.end();
//       res.writeHead(303, { Connection: 'close', Location: '/' });
//       res.end();
//     });
//     req.pipe(busboy);
//   } else  {
//     //res.writeHead(200, { Connection: 'close' });
//       this.next();
//   }
 
//  });
// }
Router.route('getSocio_API', {
    where: 'server',
    path: '/getSocio/:_id/:tipoSocio',
    waitOn: function() {
		return [
			Meteor.subscribe('Socios'),
			//Meteor.subscribe('MensajesInternos',Meteor.userId()),
		];
	  },
    action: function() {
    	var nroSocio=Number(this.params._id);
    	var tipoSocio=(this.params.tipoSocio);

     var socio=Socios.findOne({nroSocio:nroSocio,tipoSocio:tipoSocio});

      var headers = { 'Content-Type': ' application/json'  };
      this.response.writeHead(200, headers);
      var datos ="No hay socio";
   	if(socio){
   		datos= "NOMBRES: "+socio.apellido+", "+socio.nombre+" ESTADO:"+socio.estado+" FECHA NAC:"+socio.fechaNacimiento.getFecha();
   	}
     	 
    
      
      console.log(datos);
      return this.response.end(datos);

     
   
    }
  })


function busca(startPath,filter){
var path = require('path'), fs=require('fs');
    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
        	return filename;
        };
    };
    return false;
};
Router.route('/setFotoSocio/:_id/:tipoSocio', {
    where: 'server', 
   
   action:function(){
   	const fs = require('fs');

   	var id=this.params._id;
   	var tipoSocio=this.params.tipoSocio;
   	var path=Settings.findOne({ clave: "pathImagenesExterno" }).valor;
   	var imagen=path+id;
   	var nomImagen=id+"_"+tipoSocio;
   	var imag=busca(path,nomImagen);
   	console.log("path:"+path)
   	console.log("imag:"+imag)
   		console.log("nomImagen:"+nomImagen)

   var socio=Socios.findOne({nroSocio:Number(id),tipoSocio:tipoSocio});
 	
 	var salida="ok ";

 	if(socio && imag){
 		var arr=imag.split(".");
   		var tipoArchivo=arr[1];
   		var data="data:image/"+tipoArchivo+";base64,"+(fs.readFileSync(imag,{ encoding: 'base64' }));
 	
			Meteor.call("cambiarImagenSocio",data,socio._id,function(err,res){
		
	});
		   	

 	}else salida="no encuentro socio o imagen";
  
   	

   	return this.response.end(salida);
   }
  })
Router.route('/getFotoSocio/:_id/', {
    where: 'server', 
   
   action:function(){
   	const fs = require('fs');

   	var id=this.params._id;
 	var salida="ok ";
 	console.log(id)
 	var imagenSocio = Imagenes.findOne({ idSocio: id, descripcion: "carnet" });
 		if(imagenSocio) return this.response.end("data:image/jpeg;base64,"+imagenSocio.data);
   }
  })
Router.route('/agregarDocumentacion/:_id/:fechaVto/:tipoDocumentacion/:tipoSocio', {
    where: 'server', 
   
   action:function(){
   	const fs = require('fs');

   	var tipoSocio=this.params.tipoSocio;
   	var tipoDocumentacion=this.params.tipoDocumentacion;
   	var fecha=this.params.fechaVto.split("-");
   	var fechaVto=new Date(fecha[2],(fecha[1]-1),fecha[0]);
   	
   	var id=this.params._id;
   	var path=Settings.findOne({ clave: "pathImagenesExterno" }).valor;
   	var imagen=path+id;
   	var nomImagen=id+"_"+tipoSocio;
   	var imag=busca(path,nomImagen);

   	var arr=imag.split(".");
   	var tipoArchivo=arr[1];
   	var data="data:image/"+tipoArchivo+";base64,"+(fs.readFileSync(imag,{ encoding: 'base64' }));
 	var socio=Socios.findOne({nroSocio:Number(id)});
 	
 	var salida="ok ";
 	var resp=this.response;

 	if(socio && imag){
	 		var arr=imag.split(".");
	   		var tipoArchivo=arr[1];
 			//var dataImag="data:image/"+tipoArchivo+";base64,"+(fs.readFileSync(imag,{ encoding: 'base64' }));
 			 fs.unlinkSync(imag);
			Meteor.call("agregarDocumentacion",data,socio._id,fechaVto,tipoDocumentacion,function(err,res){
		resp.end(res);
	});
		   	
 	}else salida="no encuentro socio o imagen";
  
   	return this.response.end(salida);
   }
  })
Router.route('/ripeaTipoSocios/', {
    where: 'server', 
   
   action:function(){
   	const fs = require('fs');

   	var arr=Socios.find().fetch()
   	var tipoSocio="PERSONAL";
   	var salida="";
   	salida+="CANT: "+arr.length;
 	for (var i = 0; i < arr.length; i++){
 		if((arr[i].formaDePagoPrincipal=="EMPRESA"))tipoSocio="EMPRESA";else tipoSocio="PERSONAL";
 		Socios.update(arr[i]._id,{$set:{tipoSocio:"PERSONAL"}});
 		salida+=arr[i]._id+":"+tipoSocio;
 	}

 	
 	
   	return this.response.end(salida);
   }
  })


Router.route('nuevoMensaje', {
		path: '/nuevoMensaje',
    template:"nuevoMensaje",
		controller: applicationControllerMensajes,
})
Router.route('cierreCajas', {
		path: '/cierreCajas',
    template:"cierreCajas",
	
		controller: applicationController,
		waitOn: function() {
		    if(Meteor.user().profile==="admin") return [ Meteor.subscribe('CierreCaja')];
		    return [ Meteor.subscribe('CierreCajaSector',Meteor.user()._id)];
    },
})
Router.route('movimientosGenerales', {
		path: '/movimientosGenerales',
    template:"movimientosGenerales",
	
		controller: applicationController,
		waitOn: function() {
      return [ Meteor.subscribe('MovimientosGenerales')];
    },
})
Router.route('nuevoPlanEmpresa', {
		path: '/nuevoPlanEmpresa',
    template:"nuevoPlanEmpresa",
		controller: applicationController,
})
Router.route('exportarSocios', {
		path: '/exportarSocios',
    template:"exportarSocios",
		controller: applicationControllerExporta,
})
Router.route('/verSociosArchivoBancos/:_id', {
    template: 'verSociosArchivoBancos',
    controller: applicationController,
    data: function(){
         var sal=ArchivoBancos.findOne({_id: this.params._id});
         return sal;
    }
});
Router.route('/modificarPlanEmpresa/:_id', {
    template: 'modificarPlanEmpresa',
    controller: applicationController,
    data: function(){
         var sal=PlanesEmpresa.findOne({_id: this.params._id});
         return sal;
    }
});
Router.route('/modificarArchivoBancos/:_id', {
    template: 'modificarArchivoBancos',
    controller: applicationController,
    data: function(){
         var sal=ArchivoBancos.findOne({_id: this.params._id});
         return sal;
    }
});
Router.route('socios', {
		path: '/socios',
    template:"socios",
		controller: applicationController,
	
})
Router.route('/modificarDatosSistema/:_id', {
    template: 'modificarDatosSistema',
    controller: applicationController,
    data: function(){
         var sal=Settings.findOne({_id: this.params._id});
         return sal;
    }
});
Router.route('importarPagos', {
		path: '/importarPagos',
    template:"importarPagos",
		controller: applicationController,
})
Router.route('/editarImportarPagos/:_id', {
	controller: applicationController,
    template: 'editarImportarPagos',
    data: function(){
			Meteor.subscribe('Socios');
//  			ObjectID = require("mongodb").ObjectID;
         var sal=ImportarPagos.findOne({_id:(this.params._id)});
        console.log(this.params);
         return sal;
    }
});
Router.route('informeAltas', {
		path: '/informeAltas',
    template:"informeAltas",
		controller: applicationController,
})
Router.route('caja', {
		path: '/caja',
    template:"caja",
		controller: applicationController,
})
Router.route('informePagos', {
		path: '/informePagos',
    template:"informePagos",
		controller: applicationController,
})
Router.route('informeBajas', {
		path: '/informeBajas',
    template:"informeBajas",
		controller: applicationController,
})
Router.route('informeCarnets', {
		path: '/informeCarnets',
    template:"informeCarnets",
		controller: applicationControllerInformes,
})
Router.route('informeDebitos', {
		path: '/informeDebitos',
    template:"informeDebitos",
		controller: applicationController,
})
Router.route('informeTarjetas', {
		path: '/informeTarjetas',
    template:"informeTarjetas",
		controller: applicationController,
})
Router.route('nuevoImportarPagos', {
		path: '/nuevoImportarPagos',
    template:"nuevoImportarPagos",
		controller: applicationController,
})
Router.route('/fichaSocio/:_id', {
    path: '/fichaSocio/:_id',
    template:"fichaSocio",
		controller: applicationController,
  		waitOn: function() {
      return [ Meteor.subscribe('FichaSocio',this.params._id),Meteor.subscribe('Deudas',this.params._id),Meteor.subscribe('Pagos',this.params._id),Meteor.subscribe('Imagenes',this.params._id)];
    },
    data: function(){
    // Meteor.subscribe('FichaSocio',this.params._id);
      var res=Socios.findOne();
      //console.log(res);
       Session.set("socio",res);
         return res;
    }
});
Router.route('/login', {
 path: '/login',
  layoutTemplate: 'layoutVacio',
    template:"login",
		controller: applicationController,
});
Router.route('/usuarios', {
 path: '/usuarios',
    template:"usuarios",
		controller: applicationController,
});
Router.route('/nuevoUsuario', {
 path: '/nuevoUsuario',
    template:"nuevoUsuario",
		controller: applicationController,
});
Router.route('/modificarUsuario/:_id', {
	controller: applicationController,
    template: 'modificarUsuario',
    data: function(){
         var sal=Meteor.users.findOne({_id:(this.params._id)});
        console.log(this.params);
         return sal;
    }
});
Router.route('/inicio', {
 path: '/inicio',
 // layoutTemplate: 'layoutVacio',
    template:"inicio",
		controller: applicationController,
});
Router.route('/', {
 path: '/',
 // layoutTemplate: 'layoutVacio',
    template:"inicio",
		controller: applicationController,
});
// Router.route('/socios', function () {
//  this.render('socios');
// });
Router.route('/excepcionDeudas',  {
  path: '/excepcionDeudas',
    template:"excepcionDeudas",
		controller: applicationController,
});

Router.route('/nuevaExcepcionDeudas', {
 path: '/nuevaExcepcionDeudas',
    template:"nuevaExcepcionDeudas",
		controller: applicationController,
});
Router.route('/modificarExcepcionDeudas/:_id', {
    template: 'modificarExcepcionDeudas',
    controller: applicationController,
    data: function(){
         var sal=ExcepcionesDeudas.findOne({_id: this.params._id});
        console.log(sal);
         return sal;
    }
});
Router.route('/importarSocios',  {
 path: '/importarSocios',
    template:"importarSocios",
		controller: applicationController,
});
Router.route('/generacionDeudas',  {
path: '/generacionDeudas',
    template:"generacionDeudas",
		controller: applicationControllerGeneracionDeudas,
});
Router.route('/resumenes',  {
path: '/resumenes',
    template:"resumenes",
		controller: applicationController,
});
Router.route('/nuevaGeneracionDeudas',  {
   path: '/nuevaGeneracionDeudas',
    template:"nuevaGeneracionDeudas",
		controller: applicationController,
});

Router.route('/impresionCarnets', {
   path: '/impresionCarnets',
    template:"impresionCarnets",
		controller: applicationController,
});
Router.route('/nuevoSocio', {
    path: '/nuevoSocio',
    template:"nuevoSocio",
		controller: applicationController,
});
Router.route('/modificarSocio/:_id', {
    template: 'modificarSocio',
    data: function(){
         var sal=Socios.findOne({_id: ObjectId(this.params._id)});
        
         return sal;
    }
});
Router.route('/promociones',{
 path: '/promociones',
    template:"promociones",
		controller: applicationController,
});
Router.route('/nuevaPromocion', {
 path: '/nuevaPromocion',
    template:"nuevaPromocion",
		controller: applicationController,
});
Router.route('/modificarPromocion/:_id', {
    template: 'modificarPromocion',
  path: '/modificarPromocion',
		controller: applicationController,
    data: function(){
         var sal=Promociones.findOne({_id: this.params._id});
        
         return sal;
    }
});

Router.route('/actividades', {
    template: 'actividades',
  path: '/actividades',
		controller: applicationController,
});
Router.route('/grupos', {
 template: 'grupos',
  path: '/grupos',
		controller: applicationController,
});
Router.route('/nuevoGrupo', {
 template: 'nuevoGrupo',
  path: '/nuevoGrupo',
		controller: applicationController,
});
Router.route('/modificarGrupo/:_id', {
    template: 'modificarGrupo',
	controller: applicationController,
    data: function(){
         var sal=Grupos.findOne({_id:(this.params._id)});
        
         return sal;
    }
});
Router.route('/datosSistema', {
 template: 'datosSistema',
  path: '/datosSistema',
		controller: applicationController,
});
Router.route('/nuevaActividad', {
 template: 'nuevaActividad',
  path: '/nuevaActividad',
		controller: applicationController,
});
Router.route('/modificarActividad/:_id', {
    template: 'modificarActividad',
	controller: applicationController,
    data: function(){
         var sal=Actividades.findOne({_id:(this.params._id)});
        
         return sal;
    }
});

