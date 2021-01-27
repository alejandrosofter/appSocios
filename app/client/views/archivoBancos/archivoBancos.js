AutoForm.hooks({

	'_nuevoArchivoBanco': {
		before:{ 
      insert: function(doc) {
          console.log(doc)
				return doc;
			},
		},
		onSuccess: function(operation, result, template) {
            UIBlock.unblock(); 
			swal("GENIAL!", "Se ha ingresado el registro!", "success");
			Modal.hide();
			console.log(this)
			Meteor.call("cargarItemsRta",this.docId,this.insertDoc.idItem, Session.get("datosArchivoRta"))
			Router.go('/rtaBancos/'+Session.get("idRtaSeleccion"));

		},
		onError: function(operation, error, template) {
            UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		} 
	},
	'_nuevoArchivoBancos': {
		before:{
      insert: function(doc) {
          doc.cuentas=[];
          doc.rtaBancos=[];
				return doc;
			},
		},
		onSuccess: function(operation, result, template) {
            UIBlock.unblock(); 
			swal("GENIAL!", "Se ha ingresado el registro!", "success");
			Router.go('/archivoBancos');

		},
		onError: function(operation, error, template) {
            UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
	'_updateArchivoBancos': {
	
		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			
			
			swal("GENIAL!", "Se ha actualizado el registro!", "success");
			Router.go('/archivoBancos');

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	}
});
var estaDentro=function(cuentasExistentes,cbu)
{
    for(var i=0;i<cuentasExistentes.length;i++)
        if(cuentasExistentes[i].cbu==cbu)return true;
    return false
}
var getCuentasAgregar=function(cuentasExistentes,consultaCuentas)
{
    for(var i=0;i<consultaCuentas.length;i++)
        if(estaDentro(cuentasExistentes,consultaCuentas[i].cbu)){
             consultaCuentas.splice(i,1)
        }
    return consultaCuentas
}
 import { Promise } from 'meteor/promise';
var enviarDatosBanco=function(id,data){

 return new Promise(function(ok,err){
  console.log(data)
  Meteor.call("guardarArchivoBanco",id,data,function(err,res){
        var mensaje=("GUARDANDO "+data.length);
         ok(mensaje)
    })
})
}
var enviarDatosBanco2=function(id,data){

 return new Promise(function(ok,err){
  console.log(data)
  Meteor.call("guardarArchivoBanco",id,data,function(err,res){
        var mensaje="GUARDANDO ";
         ok(mensaje)
    })
})
}
var guardaData=function(id,arr){

 return new Promise(function(ok,err){
  var res=ArchivoBancos.update({_id:id},{$set:{cuentas:arr}});
  ok(res)
    
})
}
var guardarDatos=async function(dat)
{
    var id=dat._id;
    UIBlock.block("Espere, estamos guardando los datos..");
    var arr=Session.get("cuentasBanco");
    var CANT_POR_HOJA=Settings.findOne({ clave: "cantidadGuardarBancos" }).valor*1;
    var cantidadHojas=Math.floor(arr.length/CANT_POR_HOJA);

    //cantidadHojas=Math.floor(1800/CANT_POR_HOJA)
    console.log("CANTIDAD HOJAS "+cantidadHojas)
    var desde=0;
    var hasta=CANT_POR_HOJA;
    var acumula=0;
    ArchivoBancos.update({_id:id},{$set:{cuentas:[]}});
    
    for(var i=0;i<=cantidadHojas;i++){
      var res=await enviarDatosBanco(id,arr.slice(desde,hasta) ); 
      var porcentaje=Math.floor((acumula*100)/cantidadHojas)
      acumula++;
      desde+=CANT_POR_HOJA;
      hasta+=CANT_POR_HOJA;
     // desde=0;
      UIBlock.message.set("COMPLETADO %"+porcentaje);
    }
    UIBlock.unblock();
    swal("Genial!","Se ha guardado el registro","success");
    
        
        
        
}
var consultarDatosBanco=function(id,banco,fecha,desde,cantidadHojas){
return new Promise(function(ok,err){
  Meteor.call("getSociosActivos",id,banco,fecha,desde,cantidadHojas,function(err,res){
        var mensaje=("CONSULTANDO "+desde+" de "+cantidadHojas);
        
         ok(res)
    })
})
}
var getImporteCuenta=function(socios)
{
    var aux=0;
    for(var i=0;i<socios.length;i++){
                var edad=socios[i].socio.fechaNacimiento?getEdadSocio(socios[i].socio.fechaNacimiento):0;
                var importeSocio=getImporteSocioEdad(edad,socios[i].socio.esActivo);
                var fechaOk= socios[i].fechaInicio < Session.get("seleccionArchivoBancos").fecha;
                if(socios[i].socio.estado!="ALTA")importeSocio=0
                if(!fechaOk) importeSocio=0
                aux+=importeSocio;
            }
            return aux;
}
var getDatosSocios=function(socios)
{
    var aux=[];
    for(var i=0;i<socios.length;i++){
        var edad=getEdadSocio(socios[i].socio.fechaNacimiento);
        var importeSocio=getImporteSocioEdad(edad,socios[i].socio.esActivo);
        var fechaOk= socios[i].fechaInicio < Session.get("seleccionArchivoBancos").fecha;
        if(socios[i].socio.estado!="ALTA")importeSocio=0
        if(!fechaOk) importeSocio=0
         aux.push({idSocio:socios[i].idSocio,fechaInicio:socios[i].fechaInicio, estaInactiva:socios[i].estaInactiva,esActivo:socios[i].socio.esActivo,nroSocio:socios[i].socio.nroSocio,nombreSocio:socios[i].socio.apellido+" "+socios[i].socio.nombre,estadoSocio:socios[i].socio.estado,fechaNacimiento:socios[i].socio.fechaNacimiento,importe:importeSocio});
           
    }
        return aux;
}
var getDetalleCuenta=function(socios)
{
    var sal="";
    for(var i=0;i<socios.length;i++){
                var clase=getClaseTipoSocio(socios[i].socio.fechaNacimiento,socios[i].socio.esActivo,socios[i].socio.estado);
                sal+="<span class='"+clase+"'>"+socios[i].socio.apellido+", "+ socios[i].socio.nombre+"("+ socios[i].socio.nroSocio+") </span> | "
            }
            return (sal);
}
var ripDatos=function(arr)
{
    var sal=[];
    
     for(var i=0;i<arr.length;i++){
         console.log(arr[i])
         if(arr[i].socios){
             var imp=arr[i].socios?getImporteCuenta(arr[i].socios):0;
             

            var aux={"cbu":arr[i].cbu,"fecha":arr[i].fecha,idCbu:arr[i]._id, detalle:"",importe:imp,importeAnterior:0,estado:"PENDIENTE",sociosAsociados:getDatosSocios(arr[i].socios)};
            sal.push(aux)
         }
         
     }
    return sal
}
Template.cadaSocioAsociadoInput.helpers({
    "importeSocio":function(){
        return this.importe
    },
    
    "idSocio":function(){
        return this.idSocio
    }
})
var getNuevoImporteSocio=function(arr)
{
    for(var i=0;i<arr.length;i++){
        console.log(arr[i])
        arr[i].importe=$("#importeSocio_"+arr[i].idSocio).val()*1;
    }
    return arr;
}
var getNuevoImporteTotal=function(arr)
{
    var sum=0;
    for(var i=0;i<arr.length;i++)sum+=arr[i].importe;

    return sum;
}
var quitarCbu=function(cbu)
{
    var arr=Session.get("cuentasBanco");
    for(var i=0;i<arr.length;i++)
      if(arr[i].cbu==cbu)arr.splice(i,1);
    
    Session.set("cuentasBanco",arr);

}
var estaDentroNuevo=function(item,arr)
{
  for(var i=0;i<arr.length;i++)
    if(arr[i].idCbu===item.idCbu) return true;
  
  return false
}
var quitarRepetidos=function(arr,nuevos)
{
  var res=[];
  for(var i=0;i<nuevos.length;i++)
    if(!estaDentroNuevo(nuevos[i],arr)) res.push(nuevos[i]);
  console.log(res)
  return res
}
Template.modificarCuenta.events({
    "click #btnGuardar":function(){
        var arr=Session.get("cuentasBanco");
        var cbu=this.cbu;
       
        for(var i=0;i<arr.length;i++){
              if(arr[i].cbu===cbu){
                    arr[i].sociosAsociados=getNuevoImporteSocio(arr[i].sociosAsociados);
                    arr[i].importe=getNuevoImporteTotal(arr[i].sociosAsociados)
              }
        }
          
         Session.set("cuentasBanco",arr);
        
         Modal.hide(); $('body').removeClass('modal-open');	  $('.modal-backdrop').remove();
    },
})

Template.verSociosArchivoBancos.events({
    "click #btnGuardar":function(){
        guardarDatos(this);
         
    },
    "click .update":function()
    {
         var act=this;
    Modal.show('modificarCuenta',function(){ return act; });
    $("#modalmodificarCuenta").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');  
$('.modal-backdrop').remove();
});
    },
    "click .delete":function()
    {
      var data=this;
     swal({   title: "Estas Seguro de quitar este CBU?",   text: "Se eliminara completamente con sus socios asociados",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#449d44",   confirmButtonText: "Si, agregalos!",   closeOnConfirm: false }, 
         function(){ 
      UIBlock.block('Quitando cuenta ...');
    Meteor.call("quitarCbu",data.idCbu,function(err,res){
      quitarCbu(data.cbu)
        UIBlock.unblock();
       swal({   title: "Bien!",text:"Se ha eliminado el CBU!"})
    })
      
    });
    },
    "click #btnBuscar": function()
    {
        UIBlock.block("Espere, estamos buscando cuentas..");
        var CANT_POR_HOJA=Settings.findOne({ clave: "cantidadGuardarBancos" }).valor*1;
        var data=this;
        Meteor.call("countGetSociosActivos",data._id,data.banco,data.fecha,async function(err,res){
           var cantidadCuentas=res;
           var cantidadHojas=Math.floor(cantidadCuentas/CANT_POR_HOJA);
           var cantidadAgregados=0;

           UIBlock.message.set("Se han encontrado "+cantidadCuentas+" resultados de cuentas");
           var desde=0;
           var arr=Session.get("cuentasBanco");
           var acumula=0;
           for(var i=0;i<=cantidadHojas;i++){
              var res= await consultarDatosBanco(data._id,data.banco,data.fecha,desde,CANT_POR_HOJA);

              res=ripDatos(res);
              res=quitarRepetidos(arr,res);
              cantidadAgregados+=res.length;

              arr=arr.concat(res)
              Session.set("cuentasBanco",arr)
              desde+=CANT_POR_HOJA;
              acumula+=CANT_POR_HOJA;
              var porcentaje=Math.floor((acumula*100)/cantidadCuentas)
              UIBlock.message.set("% "+porcentaje+" COMPLETADO");
            }
            UIBlock.unblock();
            swal("Bien!","Se han importado "+cantidadAgregados+" cuentas de CBU del repositorio de cuentas","success")
        })
        // Meteor.call("getSociosActivos",this._id,this.banco,this.fecha,function(err,res){
        //     UIBlock.unblock();
        //     var arr=ripDatos(res)
        //    // var arr=cuentasActual.concat(agregar);
        //    //ArchivoBancos.update({_id:id},{$set:{cuentas:arr}})
            
        // })
    }
})
var ripImporteBanco=function(impStr)
{
    var decimal=impStr.substring(impStr.length-2,impStr.length);
    var cuerpo=impStr.substring(0,impStr.length-2);
    var nro=cuerpo+"."+decimal;
    return nro*1;
}
Template.agregarRtaBanco.events({
        	 "change .file-upload-input": function(event, template){
   var func = this;
   var file = event.currentTarget.files[0];
   
   var reader = new FileReader();
   reader.onload = function(fileLoadEvent) {
       
     var lines = reader.result.split(/[\r\n]+/g); 
     var arr=[];
     for(var i=0;i<lines[i].length;i++){
        var aux=lines[i];
        var cbu2=aux.substring(44,58).trim();
        var idCbu=aux.substring(58,80).trim();
        var importe=ripImporteBanco(aux.substring(103,113));
        var estado=aux.substring(173,176).trim();
        
        if(cbu2!="") arr.push({"cbu":cbu2,"idCbu":idCbu,"importe":importe,"estado":estado})
        
     }
     console.log(arr);
     Session.set("datosArchivoRta",arr);
        
   };
   reader.readAsBinaryString(file);
},
})

var getSocioCuenta=function(idCbu){
    var arr=Session.get("seleccionRtaBancos");
    for(var i=0;i<arr.length;i++)
        if(arr[i].idCbu==idCbu)return arr[i].sociosAsociados;
    return []
}
var getSociosCuenta=function(arr){
    
    for(var i=0;i<arr.length;i++)arr[i].socios=getSocioCuenta(arr[i].idCbu)
    return arr
}
Template.resultadosArchivo.helpers({
    'settings': function(){
        var arr=this.estadoCbu?this.estadoCbu:[];
        return {
 collection: arr,
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: false,
 fields: [

      {
        key: 'idCbu',
        label: 'CBU',
        fn:function(val,obj){
            var socios=getSocioCuenta(val);
            var sal="";
             for(var i=0;i<socios.length;i++){
                 var clase=getClaseTipoSocio(socios[i].fechaNacimiento,socios[i].esActivo,socios[i].estadoSocio);
                 sal+="<span class='"+clase+"'>"+socios[i].nombreSocio+"("+ socios[i].nroSocio+") $ "+socios[i].importe+"</span> | ";
             }
                
                return new Spacebars.SafeString(sal);
        }
      },
      {
        key: 'importe',
        label: '$ Importe',
        headerClass: 'col-md-2',
         fn:function(value,obj){
            return new Spacebars.SafeString(value);
        }
        
      },
       {
        key: 'idPago',
        label: 'Pago Socio',
        headerClass: 'col-md-2',
         fn:function(value,obj){
             if(value)
                return new Spacebars.SafeString(value);
                return "-"
        }
        
      },
      {
          headerClass: 'col-md-1',
        key: 'estado',
        label: 'Estado',
        fn:function(value,obj,param){
            
            return value
        }
      },
       
 ]
 }
    }
})
Template.rtaBancos.events({
'click .resultados': function(ev) {
    console.log(this)
    var act=this;
    Modal.show("resultadosArchivo",act);
},
'click .aplicar': function(ev) {
     var data=this;
     var socios=getSociosCuenta(this.estadoCbu);
		swal({   title: "Estas Seguro de aplicar la rta?",   text: "Aplicando se imputara cada para a cada perfil del socio!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#449d44",   confirmButtonText: "Si, agregalos!",   closeOnConfirm: false }, 
				 function(){ 
		  UIBlock.block('Agregando pagos ...');
    Meteor.call("agregarRtaBancoPerfiles",data,socios,Session.get("idRtaSeleccion"),function(err,res){
        UIBlock.unblock();
       swal({   title: "Bien!",text:"Se han agregado los pagos a los perfiles!"})
    })
			
		});
},
'click .desaplicar': function(ev) {
    var data=this;
    var socios=getSociosCuenta(this.estadoCbu);
		swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, quitalos!",   closeOnConfirm: false }, 
				 function(){ 
		  UIBlock.block('Quitando devolucion banco ...');
     Meteor.call("quitarRtaBancoPerfiles",data,socios,Session.get("idRtaSeleccion"),function(err,res){
        UIBlock.unblock();
       swal({   title: "Bien!",text:"La rta se ha quitado de los perfiles!"})
    })
			
		});
},
    	 'click .delete': function(ev) {
    	 
    	 var id=this.idItem;
		swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, 
				 function(){ 
		  UIBlock.block('Quitando devolucion banco ...');
    Meteor.call("quitarRtaBanco",Session.get("idRtaSeleccion"),id,function(err,res){
        UIBlock.unblock();
       swal({   title: "Bien!",text:"El idItem se ha eliminado!"})
    })
			
		});
		
	    
  },
})
Template.agregarRtaBanco.onRendered(function()
    {
        var ts = Math.round((new Date()).getTime() / 1000);
        $("#idItem").val(ts)
    },
)
Template.accionesRtaBancos.helpers({
    "estaPendiente":function()
    {
        console.log(this)
        return this.estado=="PENDIENTE";
    },
    "estaCancelado":function()
    {
        return this.estado=="CANCELADO";
    }
})
Template.rtaBancos.helpers({
  
    'settings': function(){
        
        var arr=this.rtaBancos?this.rtaBancos:[];
        return {
 collection: arr,
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: false,
 fields: [

      {
        key: 'fecha',
        label: 'Fecha',
        headerClass: 'col-md-2',
      },
      {
        key: 'detalle',
        label: 'Detalle',
         fn:function(param,obj,value){
           
            return new Spacebars.SafeString(obj.detalle);
        }
        
      },
      {
          headerClass: 'col-md-1',
        key: 'estado',
        label: 'Estado',
        fn:function(value,obj,param){
            
            return value
        }
      },
       
      {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesRtaBancos
      }
 ]
 }
    }
})

Template.verSociosArchivoBancos.onRendered(function(){
    Session.set("cuentasBanco",[])
    var res=ArchivoBancos.findOne({_id:this.data._id});
    if(res.cuentas) Session.set("cuentasBanco",res.cuentas)
})
Template.cadaSocioAsociado.events({
  
})
Template.cadaSocioAsociado.helpers({
    "nombreSocio":function()
    {
       var clase=getClaseTipoSocio(this.fechaNacimiento,this.esActivo,this.estadoSocio)
        var sal="<span class='"+clase+"'>"+this.nombreSocio+"("+ this.nroSocio+") </span> "
        return new Spacebars.SafeString(sal)
    },
     "fechaInicio":function(){
      var fecha= Session.get("seleccionArchivoBancos").fecha;
      
        return this.fechaInicio.getFecha2()
    },
     "claseFecha":function(){
      var res= this.fechaInicio < Session.get("seleccionArchivoBancos").fecha;
      if(res) return "label label-success"
      return "label label-danger"
    },
    "fechaOk":function()
    {
      return this.fechaInicio < Session.get("seleccionArchivoBancos").fecha;
    },
    "importeSocio":function()
    {
        return (this.importe*1).formatMoney(2,".")
    }
        
})
Template.verSociosArchivoBancos.helpers({
    'settings': function(){
        return {
 collection: Session.get("cuentasBanco"),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: true,
 fields: [
{
        key: 'fecha',
        label: 'Fecha Cuenta',
        headerClass: 'col-md-1',
        fn: function (originalDate) {
          if(originalDate){
            var sortValue = originalDate.getTime()/1000; 
          return new Spacebars.SafeString("<span sort=" + sortValue + ">" + originalDate.getFecha() + "</span>");
          }
          return "-"
        }
      },
      {
        key: 'cbu',
        label: 'Cbu',
        headerClass: 'col-md-2',
      },
      {
        key: 'detalle',
        label: 'Socios',
        tmpl:Template.sociosAsociadosTmpl
      },
      {
          headerClass: 'col-md-1',
        key: 'importe',
        label: '$ a Debitar',
        fn:function(param,obj,value){
            
            return obj.importe.formatMoney(2,".");
        }
      },
   
      {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesArchivoBancosSocios
      }
 ]
 };
    }
});
Template.rtaBancos.events({
    "click #btnAgregar":function()
    {
        var act=this;
        Modal.show('agregarRtaBanco',function(){ return act; });
        $("#modalagregarRtaBanco").on("hidden.bs.modal", function () {
            $('body').removeClass('modal-open');	
            $('.modal-backdrop').remove();
        });
    }
})
Template.agregarRtaBanco.helpers({
    "data":function()
    {
        return this
    }
})

Template.archivoBancos.helpers({
    'settings': function(){
        return {
 collection: ArchivoBancos.find(),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: true,
 fields: [
      {
        key: 'fecha',
        label: 'Fecha',
      fn: function (value, object, key) {
          var d=new Date(value);
            return d.toLocaleDateString()
         },
        headerClass: 'col-md-1',
      },
       {
        key: 'primerVto',
        label: '1 Vto',
      fn: function (value, object, key) {
          var d=new Date(value);
            return d.toLocaleDateString()
         },
        headerClass: 'col-md-1',
      },
       {
        key: 'segundoVto',
        label: '2 Vto',
      fn: function (value, object, key) {
          var d=new Date(value);
            return d.toLocaleDateString()
         },
        headerClass: 'col-md-1',
      },
       {
        key: 'tercerVto',
        label: '3 Vto',
      fn: function (value, object, key) {
          var d=new Date(value);
            return d.toLocaleDateString()
         },
        headerClass: 'col-md-1',
      },
      {
        key: 'detalle',
        label: 'Detalle',
      },
   {
        key: 'banco',
        label: 'Banco',
        headerClass: 'col-md-1',
      },
      {
        
        label: 'Cantidad DEBITOS',
        headerClass: 'col-md-1',
        fn:function(value,obj){
          cant=0;
          for(var i=0;i<obj.cuentas.length;i++)if(obj.cuentas[i].importe>0)cant++;
            return cant
        }
      },
      {
       
        label: '$ TOTAL',
        headerClass: 'col-md-2',
        fn:function(value,obj){
          var sum=0;
          for(var i=0;i<obj.cuentas.length;i++)sum+=obj.cuentas[i].importe;
            return sum.formatMoney(2,".")
        }
      },
     
  
    {
        label: '',
        headerClass: 'col-md-3',
        tmpl:Template.accionesArchivoBancos
      }
 ]
 };
    }
});

Template.archivoBancos.events({
  'mouseover tr': function(ev) {
    $("#tablaArchivoBancos").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ ArchivoBancos.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
   'click .cuentas': function(ev) {
     var act=this;
     Session.set("seleccionArchivoBancos",act);
      Router.go('/verSociosArchivoBancos/'+this._id);
  },
   'click .rtaBancos': function(ev) {
     var act=this;
     Session.set("seleccionRtaBancos",this.cuentas);
     Router.go('/rtaBancos/'+this._id);
  },
  'click .archivo': function(ev) {
    var act=this;
    var fecha=ripFechaArchivo(new Date(act.fecha));
    var cuitEmpresa=Settings.findOne({ clave: "cuitEmpresa"}).valor; // **11
     Meteor.call("generarArchivoBanco",act,function(err,sal){
        var fileSaver=require("/imports/fileSaver.js")
         var blob = new Blob([sal], {type: "text/plain;charset=utf-8"});
         var nombreArchivo="DMOV"+cuitEmpresa+fecha;
         fileSaver.saveAs(blob, nombreArchivo+".txt");
     })
     
     
     
  },
  'click .update': function(ev) {
    Router.go('/modificarArchivoBancos/'+this._id);
  },
});