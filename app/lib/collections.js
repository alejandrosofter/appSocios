/*eslint-disable no-undef, no-undef, no-undef*/

Settings = new Mongo.Collection('settings');
Grupos = new Mongo.Collection('grupos');
Actividades = new Mongo.Collection('actividades');
Socios = new Mongo.Collection('socios');
Pagos = new Mongo.Collection('pagos');
Deudas = new Mongo.Collection('deudas');
Promociones = new Mongo.Collection('promociones');
GeneracionDeudas = new Mongo.Collection('generacionDeudas');
ExcepcionesDeudas = new Mongo.Collection('excepcionesDeudas');
Imagenes = new Mongo.Collection('imagenes');
ImportarPagos = new Mongo.Collection('importarPagos');
PlanesEmpresa = new Mongo.Collection('planesEmpresa');

ArchivoBancos = new Mongo.Collection('archivosBancos');
 
CbuSocios = new Mongo.Collection('cbuSocios');

CierreCaja = new Mongo.Collection('cierreCaja');
Mensajes = new Mongo.Collection('mensajes');
MensajesInternos = new Mongo.Collection('mensajesInternos');
MovimientosGenerales = new Mongo.Collection('movimientosGenerales');

Profesores = new Mongo.Collection('profesores');


var schemaProfesores= new SimpleSchema({ 
cierres: {
    type: Array,
    label: 'Cierre',
    optional: true
  },
  "cierres.$":{
    type:Object,
  },
   "cierres.$._id":{

    type: String,
    autoValue: function() {
      return Meteor.uuid();  
    }
 
  },


  "cierres.$.fechaInicio":{
    type: Date, 
    autoform: {
      type:"datetime-local",
        style: "width:200px",
        autocomplete:"off",
      },
 
  },
  "cierres.$.fechaFin":{
    type: Date,
   
    autoform: {
      type:"datetime-local",
        style: "width:200px",
        autocomplete:"off",
      },
 
  },
  "cierres.$.importe":{
    type: Number,
    label:"$ Total Imputado",
 decimal:true,
 autoform: {
        style: "width:150px",
        autocomplete:"off",
      },
  },
  "cierres.$.importeGanancia":{
    type: Number,
    label:"$ Total Ganancia",
 decimal:true,
 autoform: {
        style: "width:150px",
        autocomplete:"off",
      },
  },
  "cierres.$.porcentaje":{
    type: Number,
    label:"% Porcentaje",
 decimal:true,
 autoform: {
        style: "width:90px",
        autocomplete:"off",
      },
  },

  "cierres.$.items": {
    type: Array,
    optional: true,
  },
  "cierres.$.items.$": {
    type: Object,
  },
  "cierres.$.items.$._id": {
    type: String,
    optional: true,
     autoValue: function() {
      return Meteor.uuid();  
    }
  },
  "cierres.$.items.$.idPago": {
    type: String,
    optional: true,
  },
  "cierres.$.items.$.importe": {
    type: Number,
    optional: true,
    decimal:true
  },
  "cierres.$.items.$.idSocio": {
    type: String,
    optional: true,
  },
  "cierres.$.items.$.nombre": {
    type: String,
    optional: true,
  },
  "cierres.$.items.$.apellido": {
    type: String,
    optional: true,
  },
  "cierres.$.items.$.nroSocio": {
    type: String,
    optional: true,
  },
  "cierres.$.items.$.nroRecivo": {
    type: String,
    optional: true,
    decimal:true
  },


 nombres:{
     type: String,
    label: 'Nombres',
     optional: false,
     
  },
  porcentajeAcordado:{
     type: Number,
    label: '% acordado',
     decimal: true,
     
  },
  importeAcordado:{
     type: Number,
    label: '$ acordado',
     decimal: true,
     
  },
    idActividad:{
     type: String,
     optional:true,
     autoform: {
       
       type: "select2",
       
       select2Options:{
           placeholder: 'Sin Actividad',
         width:"200px",
         allowClear:true,
       },
       options: function () {
        return _.map(Actividades.find().fetch(), function (c, i) {
          return {label: c.nombreActividad, value: c._id};
        })},
        style: "width:150px",
      },
    label: 'Actividad',
  },
})
var schemaCbuSocios = new SimpleSchema({ 
      fecha: {
    type: Date,
    optional: true,
    autoValue: function() {
      return new Date();
    },
  },
 cbu:{
     type: String,
    label: 'CBU',
     optional: false,
     unique:true,
     min:22,
     max:22,
    //   custom() {
          
    // if (Meteor.isClient && this.isSet) {
    //     // var res=validarCBU(this.value);
    //     // if(!res) return "cbuError"
        
    // }
    //   }
  },
  seleccionado:{
    type: Boolean,
    label: 'Seleccion',
     optional: true,
  },
  banco:{
     type: String,
    label: 'Banco',
     optional: false,
       autoform: {
         type:"select-radio-inline",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "BANCO CHUBUT", value: "CHUBUT"},
         {label: "OTROS BANCOS", value: "OTROS"},
      ]
    }
  },
 titular:{
     type: String, 
    label: 'Titular',
     optional: false, 
  },
 nroCuenta:{
     type: String,
    label: 'Nro Cuenta',
     optional: true,
  },
  cuil:{
     type: String,
    label: 'CUIL',
     optional: true,
  },
  tipoCuenta:{
     type: String,
      optional: true,
    label:"Tipo de CUENTA",
    unique:false,
    autoform: {
      type: "select2",
     
       select2Options:{
           placeholder: 'Tipo de Cuenta?',
         allowClear:true,
         multiple:false
       },
      options: [
        {label: "CAJA DE AHORRO", value: "CAJA AHORRO"},
        {label: "CTA CTE", value: "CTA CTE"},
        {label: "CUENTA UNICA", value: "CUENTA UNICA"},
        {label: "CUENTA SUELDOS", value: "CUENTA SUELDOS"},
        {label: "CUENTA OTRAS", value: "CUENTA OTRAS"},
      ]
    }
  },
   socios:{
     type: Array,
    optional:true,
    label:"Cuentas"
  },
  "socios.$":{
    type:Object,
  },
   "socios.$.idSocio": {
    type: String,
    optional: false,
    label:"Socio"
  },
   "socios.$.nombreSocio": {
    type: String,
    optional: true,
    label:"Socio"
  },
   "socios.$.comentario": {
    type: String,
    optional: true,
  },
  "socios.$.estaInactiva": {
    type: Boolean,
    optional: true,
  },
  "socios.$._id": {
    type: String,
    optional: true,
    
  },
  "socios.$.fechaFinaliza": {
    type: Date,
    optional: true,
  },
  "socios.$.fechaInicio": {
    type: Date,
    optional: false,
    
  },
})

var schemaArchivoBancos = new SimpleSchema({
 fecha:{
     type: Date,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
    label: 'Fecha',
  },
   primerVto:{
     type: Date,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
    label: '1 Vto',
  },
   segundoVto:{
     type: Date,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
    label: '2 Vto',
  },
   tercerVto:{
     type: Date,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
    label: '3 Vto.',
  },
  detalle:{
     type: String,
    optional: false,
    label:"Detalle",
    
  },
  
  banco:{
     type: String,
    optional: false,
    label:"Banco",
     autoform: {
     defaultValue:"PENDIENTE",
         type:"select-radio-inline",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "BANCO CHUBUT", value: "CHUBUT"},
         {label: "OTROS BANCOS", value: "OTROS"},
      ]
    }
    
  },
   rtaBancos:{
     type: Array,
    optional:true,
    label:"Rta Bancos"
  },
  "rtaBancos.$":{
    type:Object,
  },
   "rtaBancos.$.fecha": {
    type: String,
    optional: true,
  },
   "rtaBancos.$.archivo": {
    type: String,
    optional: true,
  },
  "rtaBancos.$.idItem": {
    type: String,
    optional: true,
    
  },
  "rtaBancos.$.estado": {
    type: String,
    optional: true,
     autoform: {
     defaultValue:"PENDIENTE",
         type:"select-radio-inline",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "PENDIENTE", value: "PENDIENTE"},
         {label: "CANCELADO", value: "CANCELADO"},
      ]
    }
  },
  "rtaBancos.$.detalle": {
    type: String,
    optional: true,
  },
  "rtaBancos.$.pagosSocios": {
    type: Array,
    optional: true,
  },
  "rtaBancos.$.pagosSocios.$": {
    type: Object,
    optional: true,
  },
  "rtaBancos.$.pagosSocios.$.idPago": {
     type: String,
    optional: true,
  },
  "rtaBancos.$.pagosSocios.$.idSocio": {
     type: String,
    optional: true,
  },
   "rtaBancos.$.estadoCbu": {
    type: Array,
    optional: true,
  },
  "rtaBancos.$.estadoCbu.$": {
    type: Object,
  },
  "rtaBancos.$.estadoCbu.$.idCbu": {
    type: String,
    optional: true,
  },
  "rtaBancos.$.estadoCbu.$.importe": {
    type: String,
    optional: true,
  },
  
  "rtaBancos.$.estadoCbu.$.estado": {
    type: String,
    optional: true,
  },
   
   "rtaBancos.$.estadoCbu.$.idSocio": {
    type: String,
    optional: true,
  },
  
   cuentas:{
     type: Array,
    optional:true,
    label:"Cuentas"
  },
  "cuentas.$":{
    type:Object,
  },
  
   "cuentas.$.cbu": {
    type: String,
    optional: true,
  },
   "cuentas.$.fecha": {
    type: Date,
    optional: true,
  },
  "cuentas.$.idCbu": {
    type: String,
    optional: true,
  },
  "cuentas.$.importe": {
    type: Number,
    optional: true,
  },
   "cuentas.$.importeAnterior": {
    type: Number,
    optional: true,
  },
  "cuentas.$.estado": {
    type: String,
    optional: true,
  },
   "cuentas.$.estadoPago": {
    type: String,
    optional: true,
  },
  "cuentas.$.detalle": {
    type: String,
    optional: true,
  },
    "cuentas.$.sociosAsociados": {
    type: Array,
    optional: true,
  },
  "cuentas.$.sociosAsociados.$": {
    type: Object,
  },
  "cuentas.$.sociosAsociados.$.idSocio": {
    type: String,
    optional: true,
  },
  "cuentas.$.sociosAsociados.$.nombreSocio": {
    type: String,
    optional: true,
  },
  "cuentas.$.sociosAsociados.$.estadoSocio": {
    type: String,
    optional: true,
  },
   "cuentas.$.sociosAsociados.$.esActivo": {
    type: Boolean,
    optional: true,
  },
   "cuentas.$.sociosAsociados.$.nroSocio": {
    type: String,
    optional: true,
  },
  "cuentas.$.sociosAsociados.$.fechaInicio": {
    type: Date,
    optional: true,
  },
  "cuentas.$.sociosAsociados.$.fechaFinaliza": {
    type: Date,
    optional: true,
  },
  "cuentas.$.sociosAsociados.$.estaInactiva": {
    type: Boolean,
    optional: true,
  },

  "cuentas.$.sociosAsociados.$.fechaNacimiento": {
    type: Date,
    optional: true,
  },
  "cuentas.$.sociosAsociados.$.importe": {
    type: String,
    optional: true,
  },
  
 
  
  
})
  
var schemaMensajesInternos = new SimpleSchema({
   created: {
    type: Number,
    optional: true,
    autoValue: function() {
    return   Date.now();
    }, 
  },
    mensaje:{
     type: String,
    optional: false,
    label:"Mensaje",
    
  },
  idUsuarioEmisor:{
     type: String,
    optional: false,
    label:"Emisor",
    
  },
   idUsuarioReceptor:{
     type: String,
    optional: false,
    label:"Receptor",
    
  },
   estaLeido:{
     type: Boolean,
    optional: true,
    label:"Leido",
    
  },
   estado:{
     type: String,
    optional: true,
    label:"Estado",
    
  },
  
});

var schemaMensajes = new SimpleSchema({
   created: {
    type: Date,
    optional: true,
    autoValue: function() {
    return  new Date(); 
    }, 
  },
   idGrupo:{
     type: String,
     optional:true,
     autoform: {
       
       type: "select2",
       
       select2Options:{
           placeholder: 'Sin Grupo',
         width:"200px",
         allowClear:true,
       },
       options: function () {
        return _.map(Grupos.find().fetch(), function (c, i) {
          return {label: c.nombre, value: c._id};
        })},
        style: "width:150px",
      },
    label: 'Grupo',
  },
   socios:{
     type: [String],
     optional:true,
     autoform: {
       
       type: "select2",
       
       select2Options:{
           placeholder: 'Seleccione Socios para mensaje especifico',
         width:"200px",
         allowClear:true,
         multiple:true
       },
       options: function () {
        return _.map(Socios.find().fetch(), function (c, i) {
          return {label: c.apellido+""+c.nombre, value: c._id};
        })},
        style: "width:150px",
      },
    label: 'Socio/s',
  },
  detalle:{
     type: String,
    optional: true,
    label:"Acotacion Interna",
    autoform: {
      type:"textarea"
      },
  },
  estadoMensaje:{
     type: String,
    optional: true,
    label:"Estado Mensaje",
     autoform: {
      type:"textarea",
      style: "width:100%",
      },
  },
  titulo:{
     type: String,
    optional: false,
    label:"Titulo",
   
  },
mensajeEspecifico:{
     type: Boolean,
    optional: true,
    label:"Mensaje a GRUPO...",
   
  },
  soloActivos:{
     type: Boolean,
    optional: true,
    label:"Solo a Activos",
   
  },
  excluirSociosGrupo:{
     type: Boolean,
    optional: true,
    label:"Excluir Socios asignados en algún GRUPO",
   
  },
   mensaje:{
     type: String,
    optional: false,
    label:"Mensaje",
    autoform: {
       afFieldInput: {
                type: 'tinyMCE',
                data: {            
                    height: 300,
                    statusbar: false,
                    menubar: false,
                    plugins: 'image,link',
  /* enable title field in the Image dialog*/
  image_title: true,
  /* enable automatic uploads of images represented by blob or data URIs*/
  automatic_uploads: true,
    file_picker_callback: function (cb, value, meta) {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    /*
      Note: In modern browsers input[type="file"] is functional without
      even adding it to the DOM, but that might not be the case in some older
      or quirky browsers like IE, so you might want to add it to the DOM
      just in case, and visually hide it. And do not forget do remove it
      once you do not need it anymore.
    */

    input.onchange = function () {
      var file = this.files[0];

      var reader = new FileReader();
      reader.onload = function () {
        /*
          Note: Now we need to register the blob in TinyMCEs image blob
          registry. In the next release this part hopefully won't be
          necessary, as we are looking to handle it internally.
        */
        var id = 'blobid' + (new Date()).getTime();
        var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
        var base64 = reader.result.split(',')[1];
        var blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        /* call the callback and populate the Title field with the file name */
        cb(blobInfo.blobUri(), { title: file.name });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  },
                }
            }
      },
  },
  estado:{
     type: String,
    optional: true,
    label:"Estado",
    
     autoform: {
     defaultValue:"PENDIENTE",
         type:"select-radio-inline",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "PENDIENTE", value: "PENDIENTE"},
         {label: "ENVIADO", value: "ENVIADO"},
         {label: "ENVIANDO", value: "ENVIANDO"},
      ]
    }
  },
  fecha:{
     type: Date,
    optional: false,
    label:"Fecha",
    autoform: {
       style: "width:160px",
      },
  },
  mensajes:{
     type: Array,
    optional:true,
    label:"Mensajes"
  },
  "mensajes.$":{
    type:Object,
  },
  "mensajes.$.nroSocio": {
    type: String,
    optional: false,
    label:"Nro Socio"
    
  },
  "mensajes.$.idSocio": {
    type: String,
    optional: false,
    label:"Id socio"
    
  },
  "mensajes.$.mensaje": {
    type: String,
    optional: false,
    label:"Mensaje"
    
  },
   "mensajes.$.nombreSocio": {
    type: String,
    optional: true,
    label:"Socio"
    
  },
  "mensajes.$.idMensaje": {
    type: String,
    optional: false,
    label:"Id Mensaje"
    
  },
  "mensajes.$.email": {
    type: String,
    optional: false,
    label:"Email"
    
  },
})

var schemaMovimientosGenerales = new SimpleSchema({
   created: {
    type: Date,
    optional: true,
    autoValue: function() {
    return  new Date(); 
    }, 
  },
   tipoMovimiento:{
     type: String,
      label:"Tipo Movimiento",
       autoform: {
         type:"select-radio",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "ANTICIPO HABERES", value: "ANTICIPO HABERES"},
         {label: "COMPROBANTE INGRESO/EGRESO", value: "COMPROBANTE INGRESO/EGRESO"},
         {label: "BECA DEPORTIVA", value: "BECA DEPORTIVA"},
        {label: "PROVEEDOR", value: "PROVEEDOR"},
      ]
    }
    
  },
  importeDebe:{
     type: Number,
    optional: false,
    decimal:true,
    label:"$ Egreso",
     autoform: {
       style: "width:100px",
      },
  },
  importeHaber:{
     type: Number,
    optional: false,
    label:"$ Ingreso",
     decimal:true,
    autoform: {
       style: "width:100px",
      },
  },
  detalle:{
     type: String,
    optional: true,
    label:"Detalle",
    autoform: {
      type:"textarea"
      },
  },
  nroComprobante:{
     type: String,
    optional: true,
    label:"Nro Comprobante",
    autoform: {
       style: "width:160px",
      },
  },
  quien:{
     type: String,
    optional: false,
    label:"A quien?",
    autoform: {
       style: "width:260px",
      },
  },
  estado:{
     type: String,
    optional: true,
    label:"Estado",
     autoform: {
         type:"select-radio-inline",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "PENDIENTE", value: "PENDIENTE"},
         {label: "CERRADO", value: "CERRADO"},
      ]
    }
  },
  fecha:{
     type: Date,
    optional: false,
    label:"Fecha",
    autoform: {
       style: "width:160px",
      },
  },
})
var schemaCierreCaja = new SimpleSchema({
  created: {
    type: Date,
    optional: true,
    autoValue: function() { 
    return  new Date(); 
    }, 
  },
  importeDebe:{
     type: Number,
    optional: false,
     decimal:true,
    label:"$ Egreso",
     autoform: {
       style: "width:100px",
      },
  },
  importeHaber:{
     type: Number,
    optional: false,
     decimal:true,
    label:"$ Ingreso",
    autoform: {
       style: "width:100px",
      },
  },
  fechaCierre:{
     type: Date,
    optional: false,
    label:"Fecha",
    custom() {
      var hayCierres=CierreCaja.find({usuario:Meteor.user()._id,fechaCierre:this.value,esCajaGral:this.field('esCajaGral').value}).fetch().length>0;
        if(hayCierres)return "cajaCerrada";
      },
    autoform: {
       style: "width:160px",
      },
  },
  detalle:{
     type: String,
    optional: true,
    label:"Detalle",
    autoform: {
      type:"textarea"
      },
  },
  usuario:{
     type: String,
    optional: true,
    label:"Usuario"
  },
  esCajaGral:{
     type: Boolean,
   
    optional: true,
    label:"Es caja Gral?"
  },
  items:{
     type: Array,
    optional:true,
    label:"Items"
  },
  "items.$":{
    type:Object,
  },
  "items.$.importeDebe": {
    type: Number,
    optional: false,
    decimal:true,
    label:"$ Egreso"
    
  },
  "items.$.importeHaber": {
    type: Number,
    optional: false,
    decimal:true,
     label:"$ Ingreso"
  },
  "items.$.detalle": {
    type: String,
    optional: true,
     label:"Detalle"
  },
  "items.$.quien": {
    type: String,
    optional: false,
     label:"Quien"
  },
  "items.$.id": {
    type: String,
    optional: true,
     label:"Detalle"
  },
  "items.$.esGeneral": {
    type: Boolean,
    optional: true,
     label:"Es Mov. General?"
  },
})
var schemaPlanesEmpresa = new SimpleSchema({
  created: {
    type: Date,
    optional: true,
    autoValue: function() {
    return  new Date(); 
    }, 
  },
  detalleContrato:{
     type: String,
    optional:true,
    label:"Detalle del Contrato",
    autoform: {
      afFieldInput: {
        type: 'tinyMCE',
                data: {
                          
                    height: 300,
                    statusbar: false,
                    menubar: false
                }
      }
    }
  },
   actividades:{
     type: Array,
    optional:true,
    label:"Actividades"
  },
  "actividades.$":{
    type:Object,
  },
   "actividades.$.idActividad": {
    type: String,
    optional: true,
     label:"Actividad",
       autoform: {
       type: "select2",
       options: function () {
        return _.map(Actividades.find().fetch(), function (c, i) {
          return {label: c.nombreActividad, value: c._id};
        })},
        style: "width:150px",
      },
  },
  "actividades.$.importe": {
    type: String,
    optional: true,
  },
     nombrePlanEmpresa:{
     type: String,
    optional:false,
    label:"Nombre del PLAN"
  },
   fechaVto:{
     type: Date,
    optional:true,
    label:"Vto del Plan",
      autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
  },
});

var schemaImportarPagos = new SimpleSchema({
  created: {
    type: Date,
    optional: true,
    autoValue: function() {
    return  new Date(); 
    }, 
  },
   formaPago:{
     type: String,
      label:"Forma de Pago",
       autoform: {
         type:"select-radio",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "OTROS BANCOS", value: "OTROS BANCOS"},
         {label: "BANCO CHUBUT", value: "BANCO CHUBUT"},
      ]
    }
    
  },
    descripcion:{
     type: String,
    optional:false,
    label:"Detalle"
  },
   fechaCarga:{
     type: Date,
    optional:false,
    label:"Fecha de Pago"
  },
  estado:{
     type: String,
    optional:true,
    label:"Estado"
  },
  pagos:{
     type: Array,
    optional:true,
    label:"Pagos REALIZADOS"
  },
  "pagos.$":{
    type:Object,
  },
   "pagos.$.idPago": {
    type: String,
    optional: true,
  },
  "pagos.$.idSocio": {
    type: String,
    optional: true,
  },
  archivo:{
     type: String,
    optional:true,
    label:"Archivo"
  },
   items:{
    type:Array,
    optional:true
  },
  "items.$":{
    type:Object,
  },
   "items.$.sociosAsociados": {
    type: Array,
    optional: true,
  },
  "items.$.sociosAsociados.$": {
    type: Object,
  },
  "items.$.sociosAsociados.$.idSocio": {
    type: String,
    optional: true,
  },
  "items.$.sociosAsociados.$._id": {
    type: String,
    optional: true,
  },
   "items.$.sociosAsociados.$.idFila": {
    type: String,
    optional: true,
  },
  "items.$.sociosAsociados.$.detalle": {
    type: String,
    optional: true,
  },
  "items.$.sociosAsociados.$.importe": {
    type: String,
    optional: true,
  },
  "items.$.sociosAsociados.$.idPago": {
    type: String,
    optional: true,
  },
   "items.$.id":{
     type: String,
     optional: false,
  },
  "items.$.importe": {
    type: String,
    optional: true,
  },
   "items.$.cbu": {
    type: String,
    optional: true,
  },
  "items.$.estado": {
    type: String,
    optional: true,
  },
  "items.$.idPago": {
    type: String,
    optional: true,
  },
  "items.$.nombreSocio": {
    type: String,
    optional: true,
  },
  
 
});
var schemaImagenes = new SimpleSchema({
  created: {
    type: Date,
    optional: true,
    autoValue: function() {
    return  new Date(); 
    }, 
  },
    descripcion:{
     type: String,
    optional:true,
    label:"detalle"
  },
  idSocio:{
     type: String,
    optional:true,
    label:"SOCIO"
  },
  data:{
     type: String,
    optional:true,
    label:"DATA IMAGEN"
  }
});
var schemaDeudas = new SimpleSchema({
 idSocio:{
     type: String,
    optional:false,
    label:"ID SOCIO"
  },
  created: {
    type: Date,
    optional: true,
    autoValue: function() {
    return  new Date();
    },
  },
   
  esCuotaSocial:{
     type: Boolean,
    optional:true,
    label:"Es de Cuota Social?"
  },
  idActividad:{
     type: String,
    optional:true,
    label:"De actividad...",
    autoform: {
       type: "select2",
       options: function () {
        return _.map(Actividades.find().fetch(), function (c, i) {
          return {label: c.nombreActividad, value: c._id};
        })},
        style: "width:150px",
      },
  },
  fecha:{
     type: Date,
    optional:true,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
    label: 'Fecha',
  },
  fechaVto:{
     type: Date,
    optional:true,
    autoform: {
       style: "width:160px",
      //defaultValue: new Date(),
      },
    label: 'Fecha Vto',
  },
   detalle:{
     type: String,
    autoform: {
       type: "textarea",
      },
  },
  importe:{
     type: Number,
     label: '$ Importe',
    autoform: {
       style: "width:120px",
      },
  },
   importeSaldo:{
     type: Number,
    decimal:true,
      optional:true,
    autoform: {
       style: "width:120px",
      },
    label: '$ Saldo',
  },
  estado:{
     type: String,
    autoform: {
       style: "width:120px",
      defaultValue: "PENDIENTE"
      },
  },
});
var schemaPagos = new SimpleSchema({
   idSocio:{
     type: String,
    optional:false,
    label: 'ID SOCIO',
  },
   created: {
    type: Date,
    optional: true,
    autoValue: function() {
      return new Date();
    },
  },
   
   formaPago:{
     type: String,
      
       autoform: {
      options: [
        {label: "POSNET", value: "POSNET"},
        {label: "EFECTIVO", value: "EFECTIVO"},
        {label: "OTROS BANCOS", value: "OTROS BANCOS"},
         {label: "BANCO CHUBUT", value: "BANCO CHUBUT"},
      ]
    }
    
  },
  fecha:{
     type: Date,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
    label: 'Fecha',
  },
  deudasPago:{
     type: [String],
    autoform: {
       type: "select2",
       multiple:true,
       style: "width:100%",
      },
    label: 'Deudas',
  },
  importe:{
     type: Number,
    decimal:true,
    autoform: {
       style: "width:120px",
      },
    label: 'Importe',
  },

  esBonificado:{
     type: Boolean,
   optional:true,
    label: 'Es Bonificado?',
  },
   idPromocion:{
     type: String,
   optional:true,
    label: 'Bonificado de Promocion...',
  },
});
var schemaExcepcionesDeudas = new SimpleSchema({
    fecha:{
     type: Date,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
    label: 'Fecha',
  },
   detalle:{
     type: String,
     optional:true,
    autoform: {
       type: "textarea",
     
        style: "width:100%",
      },
    label: 'Detalle',
  },
  idActividades:{
     type:[String],
    label:"No incluye (act)",
    optional:true,
     autoform: {
       type: "select2",
       multiple:true,
       options: function () {
        return _.map(Actividades.find().fetch(), function (c, i) {
          return {label: c.nombreActividad, value: c._id};
        })},
        style: "width:100%",
      },
  },
  porcentajeDescuento:{
     type: Number,
     label:"% desc.",
    decimal:true,
    optional:true,
     autoform: {
      
        style: "width:90px",
      },
  },
  importe:{
     type: Number,
    decimal:true,
    optional:true,
     autoform: {
      
        style: "width:90px",
      },
  },
  mes:{
     type: Number,
      optional:false,
    autoform: {
       type: "select2",
       multiple:false,
       options: function () {
        return [ {label: "ENERO", value:1},{label: "FEBRERO", value:2},{label: "MARZO", value:3},{label: "ABRIL", value:4},{label: "MAYO", value:5},{label: "JUNIO", value:6},{label: "JULIO", value:7},{label: "AGOSTO", value:8},{label: "SEPTIEMBRE", value:9},{label: "OCTUBRE", value:10},{label: "NOVIEMBRE", value:11},{label: "DICIEMBRE", value:12}];
       },
        style: "width:160px",
      },
  },
    ano:{
     type: Number,
       optional:false,
       label:"Año",
      autoform: {
      
        style: "width:90px",
      },
  },
});
var schemaResultadoIngresoDeuda = new SimpleSchema({
    fecha:{
     type: Date,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
    label: 'Fecha',
  },
   detalle:{
     type: String,
    autoform: {
       type: "textarea",
     
        style: "width:100%",
      },
    label: 'Detalle',
  },
  idDeuda:{
     type: String,
    optional:true,
  },
  idSocio:{
     type: String,
    optional:true,
  },
  importe:{
     type: Number,
    optional:true,
  },
  socio:{
     type: String,
    optional:true,
  },
});
var schemaGeneracionDeudas = new SimpleSchema({
    fecha:{
     type: Date,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
    label: 'Fecha',
  },
   deudas:{
     type: Array,
    optional:true,
    label:"Pagos REALIZADOS"
  },
  "deudas.$":{
    type:Object,
  },
   "deudas.$.idPago": {
    type: String,
    optional: true,
  },
  "deudas.$.idSocio": {
    type: String,
    optional: true,
  },
   detalle:{
     type: String,
    autoform: {
       type: "textarea",
     
        style: "width:100%",
      },
    label: 'Detalle',
  },
  
  esCuotaSocial:{
    type:Boolean,
    label:"Es de Cuota Social?",
     optional:true,
  },
   cargaActividades:{
    type:Boolean,
    label:"Carga Actividades?",
     optional:true,
  },
  actividadesExcluir:{
    type:[String],
    label:"Actividades a Excluir",
    optional:true,
     autoform: {
       type: "select2",
       multiple:true,
       options: function () {
        return _.map(Actividades.find().fetch(), function (c, i) {
          return {label: c.nombreActividad, value: c._id};
        })},
        style: "width:100%",
      },
  },
  
  
});

var schemaSocios = new SimpleSchema({
   created: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    },
  },
  updated: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
  },
  planEmpresa:{
     type: String,
    optional:true,
    autoform: {
       type: "select2",
       select2Options:{
           placeholder: 'Plan de Cuenta',
         allowClear:true,
         multiple:false
       },
       options: function () {
        return _.map(PlanesEmpresa.find().fetch(), function (c, i) {
          return {label: c.nombrePlanEmpresa, value: c._id};
        })},
        style: "width:250px",
      },
  },
  nroSocio:{
     type: Number,
      optional: false,
       unique:false,
     
  },
   formaDePagoPrincipal:{
     type: String,
      optional: false,
    autoform: {
         type:"select-radio-inline",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "EFECTIVO", value: "EFECTIVO"},
         {label: "CUENTA", value: "CUENTA"},
         {label: "EMPRESA", value: "EMPRESA"},
      ]
    }
  },
  tipoSocio:{
     type: String,
      optional: false,
    autoform: {
         type:"select-radio-inline",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "PERSONAL", value: "PERSONAL"},
         {label: "EMPRESA", value: "EMPRESA"},
      ]
    }
  },
  idCbuAsociado:{
     type: String,
      optional: true,
    label:"CBU Asociado"
  },
  fechaVto:{
     type: Date,
      optional: true,
    label:"Vto plan"
  },
   tutor:{
     type: String,
      optional: true,
    label:"Tutor/es"
  },
    planTieneVto:{
     type: Boolean,
      optional: true,
    label:"Plan tiene Vto?"
  },
  
  planesEmpresa:{
    type:Array,
    optional:true
  },
  "planesEmpresa.$":{
    type:Object,
  },
    "planesEmpresa.$.fecha": {
    type: Date,
    optional: true,
    autoValue: function() {
      return new Date();
    },
  },
   "planesEmpresa.$._id":{
     type: String,
    autoValue: function() {
      return Meteor.uuid();
    }
  },
 "planesEmpresa.$.idPlanEmpresa":{
     type: String,
    label:"Plan Empresa",
     autoform: {
       type: "select2",
       options: function () {
        return _.map(PlanesEmpresa.find().fetch(), function (c, i) {
          return {label: c.nombrePlanEmpresa, value: c._id};
        })},
        style: "width:150px",
      },
  },
  "planesEmpresa.$.estaInactiva":{
     type: Boolean,
    label:"Esta INACTIVA?"
  },
   "planesEmpresa.$.fechaFinaliza":{
     type: Date,
    label: 'Fecha Vto',
     optional: true,
     autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
     
  },
    "planesEmpresa.$.fechaInicio":{
     type: Date,
    label: 'Fecha Inicio',
     optional: true,
     autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
     
  },
    "planesEmpresa.$.estaAplicado":{
     type: Boolean,
    label: 'Aplicado?',
     optional: true,
     autoform: {
       
      },
     
  },
  
   debitoAutomatico:{
    type:Array,
    optional:true
  },
  "debitoAutomatico.$":{
    type:Object,
  },
    "debitoAutomatico.$.fecha": {
    type: Date,
    optional: true,
    autoValue: function() {
      return new Date();
    },
  },
   "debitoAutomatico.$._id":{
     type: String,
    autoValue: function() {
      return Meteor.uuid();
    }
  },
   "debitoAutomatico.$.default":{
     type: Boolean,
    autoValue: function() {
      return true;
    }
  },
   "debitoAutomatico.$.estaInactiva":{
     type: Boolean,
    label:"Esta INACTIVA?"
  },
   "debitoAutomatico.$.fechaFinaliza":{
     type: Date,
    label: 'Fecha Fin Debito',
     optional: true,
     autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
     
  },
  "debitoAutomatico.$.cbu":{
     type: String,
    label: 'CBU',
     optional: false,
  },
  "debitoAutomatico.$.banco":{
     type: String,
    label: 'Banco',
     optional: false,
       autoform: {
         type:"select-radio-inline",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "BANCO CHUBUT", value: "CHUBUT"},
         {label: "OTROS BANCOS", value: "OTROS"},
      ]
    }
  },
   "debitoAutomatico.$.fechaInicio":{
     type: Date,
    label: 'Fecha Inicio Debito',
     optional: false,
     autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
  },
  "debitoAutomatico.$.titular":{
     type: String,
    label: 'Titular',
     optional: false,
  },
  "debitoAutomatico.$.nroCuenta":{
     type: String,
    label: 'Nro Cuenta',
     optional: true,
  },
  "debitoAutomatico.$.cuil":{
     type: String,
    label: 'CUIL',
     optional: true,
  },
  "debitoAutomatico.$.tipoCuenta":{
     type: String,
      optional: true,
    label:"Tipo de CUENTA",
    unique:false,
    autoform: {
      type: "select2",
     
       select2Options:{
           placeholder: 'Tipo de Cuenta?',
         allowClear:true,
         multiple:false
       },
      options: [
        {label: "CAJA DE AHORRO", value: "CAJA AHORRO"},
        {label: "CTA CTE", value: "CTA CTE"},
        {label: "CUENTA UNICA", value: "CUENTA UNICA"},
        {label: "CUENTA SUELDOS", value: "CUENTA SUELDOS"},
        {label: "CUENTA OTRAS", value: "CUENTA OTRAS"},
      ]
    }
  },
   documentacion:{
    type:Array,
    optional:true
  },
  "documentacion.$":{
    type:Object,
  },
   "documentacion.$._id":{
     type: String
  },
   "documentacion.$.imagen":{
     type: String,
     label:"Imagen"
  },
   "documentacion.$.fechaVto": {
    type: Date,
    optional: false,
 
  },
  "documentacion.$.fechaSubida": {
    type: Date,
    optional: false,
 
  },
   "documentacion.$.tipo":{
     type: String,
      label:"Tipo Documentacion",
       autoform: {
         type:"select-radio",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "APTO MEDICO", value: "APTO"},
        {label: "DNI", value: "DNI"},
      ]
    }
    
  },
 
  ///////
   movimientosCuenta:{
    type:Array,
    optional:true
  },
  "movimientosCuenta.$":{
    type:Object,
  },
  "movimientosCuenta.$.nroRecivo":{
     type: Number,
    label: 'NRO RECIBO',
     optional: false,
    
   
     
  },
   "movimientosCuenta.$.formaPago":{
     type: String,
      label:"Forma de Pago (1)",
       autoform: {
         type:"select-radio",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "POSNET", value: "POSNET"},
        {label: "EFECTIVO", value: "EFECTIVO"},
        {label: "OTROS BANCOS", value: "OTROS BANCOS"},
         {label: "BANCO CHUBUT", value: "BANCO CHUBUT"},
      ]
    }
    
  },
   "movimientosCuenta.$.nroRecivo":{
     type: Number,
    label: 'NRO RECIBO',
     optional: false,
    
   
     
  },
  "movimientosCuenta.$.puntoVenta":{
     type: Number,
    label: 'Pto Venta',
     optional: true,
     
  },
  "movimientosCuenta.$.usuario":{
     type: String,
    label: 'Usuario Carga',
     optional: true,
     
  },
  "movimientosCuenta.$.hay2FormaPago":{
     type: Boolean,
    label: 'Hay 2da Forma de PAGO',
     optional: true,
  },
  "movimientosCuenta.$.importeFormaPago":{
     type: Number,
    label: '$ FORMA PAGO (1)',
     optional: true,
     decimal:true,
    autoform: {
         style:"width:80px"
    }
  },
  "movimientosCuenta.$.importeFormaPago2":{
     type: Number,
    label: '$ FORMA PAGO (2)',
    decimal:true,
     optional: true,
  },
  "movimientosCuenta.$.formaPago2":{
     type: String,
      label:"Forma de Pago (2)",
       autoform: {
         type:"select-radio",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "POSNET", value: "POSNET"},
        {label: "EFECTIVO", value: "EFECTIVO"},
        {label: "OTROS BANCOS", value: "OTROS BANCOS"},
         {label: "BANCO CHUBUT", value: "BANCO CHUBUT"},
      ]
    },
     optional: true,
    custom: function (ev) {
//      console.log(ev)
    
      },
    
  },
    "movimientosCuenta.$.fecha": {
    type: Date,
    optional: false,
 
   autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
  },
   "movimientosCuenta.$.esDebitoAutomatico": {
    type: Boolean,
    optional: true,
     label:"Es por Debito BANCO",
      autoValue: function() {
      return false;
    }
  },
   "movimientosCuenta.$._id":{
     type: String,
      optional: true,
    // autoValue: function() {
    //   return Meteor.uuid();
    // }
  },

  "movimientosCuenta.$.detalle":{
     type: String,
    label: 'Detalle (op)',
     optional: true,
  },
  "movimientosCuenta.$.importeDebita":{
     type: Number,
    label: 'TOTAL DEBITA $',
     decimal:true,
     optional: true,
  },
   "movimientosCuenta.$.importeAcredita":{
     type: Number,
    label: 'TOTAL ACREDITA $',
     decimal:true,
     optional: true,
  },
  "movimientosCuenta.$.importeCuotaSocial":{
     type: Number,
    label: 'CUOTA SOCIAL $',
     decimal:true,
     optional: false,
  },
  "movimientosCuenta.$.importeCarnet":{
     type: Number,
    label: 'CARNET $',
     decimal:true,
     optional: false,
  },
  "movimientosCuenta.$.importeOtros":{
     type: Number,
    label: 'OTROS $',
     decimal:true,
     optional: false,
  },
  "movimientosCuenta.$.importeInscripcion":{
     type: Number,
    label: 'Inscripcion $',
     decimal:true,
     optional: false,
  },

  "movimientosCuenta.$.importeCargaSocial":{
     type: Number,
    label: 'CARGA SOCIAL $',
     decimal:true,
     optional: false,
  },
   "movimientosCuenta.$.importeCargaActividad":{
     type: Number,
    label: 'CARGA ACTIVIDAD $',
     decimal:true,
     optional: false,
  },
   "movimientosCuenta.$.itemsActividades": {
    type: Array,
    optional: true,
  },
  "movimientosCuenta.$.itemsActividades.$": {
    type: Object,
  },
  "movimientosCuenta.$.itemsActividades.$.importe": {
    type: Number,
    optional: true,
     decimal:true,
  },
   "movimientosCuenta.$.itemsActividades.$.idActividad": {
    type: String,
    optional: true,
  },
  
  ////////////////
   tarjetas:{
    type:Array,
    optional:true
  },
  "tarjetas.$":{
    type:Object,
  },
    "tarjetas.$.created": {
    type: Date,
    optional: true,
    autoValue: function() {
      return new Date();
    },
  },
   "tarjetas.$._id":{
     type: String,
    autoValue: function() {
      return Meteor.uuid();
    }
  },
  "tarjetas.$.fecha":{
     type: Date,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
    label: 'Fecha',
  },
   "tarjetas.$.detalle":{
     type: String,
    label: 'Detalle',
     optional: true,
  },
  "tarjetas.$.estado":{
     type: String,
    label: 'Estado',
    optional: true,
  },
   ////////////////

   
  cambiosEstado:{
    type:Array,
    optional:true
  },
  "cambiosEstado.$":{
    type:Object,
  },
   "cambiosEstado.$._id":{
     type: String,
    autoValue: function() {
      return Meteor.uuid();
    }
  },
  "cambiosEstado.$.fecha":{
    type: Date,
    optional: false,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
  },
  
  "cambiosEstado.$.fechaVto":{
    type: Date,
    optional: true,
    label:"Fecha Vto",
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
  },
    "cambiosEstado.$.estado":{
     type: String,
      custom: function () {
        
    
      var socio=Socios.findOne({_id:this.docId});
        if(!socio)return;
//         var deudas=Deudas.find({idSocio:socio._id.str}).fetch();
//         if(deudas.filter(function(data){return data.estado=="PENDIENTE";}).length>0)
//           return "tieneDeudaBaja";
    console.log(this)
        if(this.isInsert){
          if(this.value==="BAJA" && socio.estado==="BAJA") return "bajaSocioEstado";
        if(this.value==="ALTA" && socio.estado==="ALTA") return "altaSocioEstado";
          if(this.value==="SUSPENDIDO" && socio.estado==="SUSPENDIDO") return "suspendidoSocioEstado";
        }
    
    
      },
       autoform: {
      options: [
        {label: "ALTA", value: "ALTA"},
        {label: "BAJA", value: "BAJA"},
        {label: "SUSPENDIDO", value: "SUSPENDIDO"},
      ]
    }
    
  },
  "cambiosEstado.$.detalle":{
     type: String,
    optional:true,
    autoform: {
       type: "textarea",
      },
  },
  "cambiosEstado.$.infoExtra":{
     type: String,
    optional:true,
    autoform: {
       type: "textarea",
      },
  },
   "cambiosEstado.$.tienePlanEmpresa":{
    type: Boolean,
    optional: true,
    label:"Tiene Plan de Empresa?"
  },
   "cambiosEstado.$.planEmpresaAplicado":{
    type: Boolean,
    optional: true,
    label:"Aplico el plan?",
      
  },
   "cambiosEstado.$.tieneVto":{
    type: Boolean,
    optional: true,
    label:"Tiene Vto?"
  },
  "cambiosEstado.$.planEmpresa":{
     type: String,
    optional:true,
    autoform: {
       type: "select2",
       options: function () {
        return _.map(PlanesEmpresa.find().fetch(), function (c, i) {
          return {label: c.nombrePlanEmpresa, value: c._id};
        })},
        style: "width:150px",
      },
  },
  
  
  "actividades.$":{
    type:Object,
  },
   "actividades.$._id":{
     type: String,
     optional: true,
     label:"ID ACT",
    autoValue: function() {
      return Meteor.uuid();
    }
   
   },
  "actividades.$.fechaInicio":{
     type: Date,
    optional: false,
    label:"Fecha",
     autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
   
  },
  "actividades.$.estaBaja":{
     type: Boolean,
    
     label:"Esta de Baja?",
     
    
  },
   "actividades.$.idProfesor": {
    type: String,
    optional: true,
     label:"Profesor",
       autoform: {
       type: "select2",

       select2Options:{allowClear:true,},
       
       options: function () {
        return _.map(Profesores.find().fetch(), function (c, i) {
          return {label: c.nombres, value: c._id};
        })},
        style: "width:110px",
      },
  },
  "actividades.$.importeEspecial":{
     type: Number,
    optional: true,
     label:"$ Especial",
     decimal:true,
    autoform: {
       style: "width:120px"
      },
    
  },
   "actividades.$.idPlanEmpresa": {
    type: String,
    optional: true,
     label:"Plan Empresa",
       autoform: {
       type: "select2",

       select2Options:{allowClear:true,},
       
       options: function () {
        var planes=(Session.get("socio").planesEmpresa);
        return _.map(planes, function (c, i) {
          var pe=PlanesEmpresa.findOne({_id:c.idPlanEmpresa});
          var fe=moment(c.fechaInicio).format("DD/MM/YYYY");
          var lab=pe?pe.nombrePlanEmpresa+" inicio:"+fe:"s/n";
          if(!c.estaInactiva) return {label: lab, value: c._id};
        })},
        style: "width:210px",
      },
  },
  "actividades.$.tieneImporteEspecial":{
     type: Boolean,
    optional: true,
     label:"Tiene Importe Especial?",
    
    
  },
  "actividades.$.tieneVto":{
     type: Boolean,
    optional: true,
     label:"Tiene Vencimiento?",
    
  },
  "actividades.$.fechaVto":{
     type: Date,
    optional: true,
     label:"Vencimiento",
     autoform: {
       style: "width:160px",
      },
    
  },
  "actividades.$.fechaBaja":{
     type: Date,
    optional: true,
     label:"Fecha Baja",
     autoform: {
       style: "width:160px",
      },
    
  },
   "actividades.$.idActividad":{
     type: String,
     optional:false,
     autoform: {
       type: "select2",
       options: function () {
        return _.map(Actividades.find().fetch(), function (c, i) {
          return {label: c.nombreActividad, value: c._id};
        })},
        style: "width:100px",
      },
     
    label: 'Actividad',
  },
   "actividades.$.detalle":{
    type: String,
    label: 'Detalle',
    optional:true,
    autoform: {
       type: "textarea",
      }
  },
   nombre: {
    type: String,
    label: 'Nombre/s',
     optional:false
  },
   apellido: {
    type: String,
    label: 'Apellido/s',
  },
   estado: {
    type: String,
    label: 'Estado Socio',
     autoform: {
      defaultValue:"BAJA",
      }
  },
  debitaCbu: {
    type: Boolean,
    label: 'Debita Cbu?',
    optional:true,
  },
  cbu: {
    type: String,
    label: 'Cbu',
     optional:true,
  },
   idGrupo:{
     type: String,
     optional:true,
     autoform: {
       
       type: "select2",
       
       select2Options:{
           placeholder: 'Sin Grupo',
         width:"200px",
         allowClear:true,
       },
       options: function () {
        return _.map(Grupos.find().fetch(), function (c, i) {
          return {label: c.nombre, value: c._id};
        })},
        style: "width:150px",
      },
    label: 'Grupo',
  },
   fechaNacimiento: {
    type: Date,
     autoform: {
       placeholder:"xx/xx/xxxx",
//        type: 'masked-input',
//       mask: '00/00/0000', 
      //type: "bootstrap-datepicker",
//       datePickerOptions: {
//         autoclose: true
//       }
    },
    label: 'Fecha Nacimiento',
  },
   dni: {
    type: String,
    label: 'D.N.I',
       unique:false,
     autoform: {
      
     }
  },
   domicilio: {
    type: String,
    label: 'Domicilio',
  },
   localidad: {
    type: String,
    label: 'Localidad',
      autoform: {
      defaultValue:"Comodoro Rivadavia",
      }
  },
   telefonoMobil: {
    type: String,
    label: 'Tel. Mobil',
     autoform: {
      type: 'masked-input',
      mask: '000 0 000 000',
       placeholder: 'xxx x xxx xxx'
     }
  },
   telefonoFijo: {
    type: String,
     optional:true,
    label: 'Tel. Fijo',
      autoform: {
      type: 'masked-input',
      mask: '000 0000',
      placeholder: 'xxx xxxx'
     }
  },
   email: {
    type: String,
    label: 'Email',
  },
   esActivo: {
    type: Boolean,
    label: 'Es Activo?',
  },

   idImagen: {
    type: String,
    label: 'Imagen',
     optional:true,
  },
   actividad: {
    type: [String],
    label: "Actividad/es",
    optional:true,
    autoform: {
       
       type: "select2",
        multiple:true,
      afFieldInput: {
        style: "width:250px",
      },
       select2Options:{
           placeholder: 'Seleccione la/s actividad/es',
         allowClear:true,
         
       },
       options: function () {
        return _.map(Actividades.find().fetch(), function (c, i) {
          return {label: c.nombreActividad, value: c._id};
        })},
      },
  },
  sexo: {
    type: String,
    label: 'Sexo',
     optional:true,
    autoform: {
      defaultValue:"femenino",
      options: [
        {label: "Masculino", value: "femenino"},
        {label: "Femenino", value: "masculino"},
      ]
    }
  },
   estadoCivil: {
    type: String,
    label: 'Estado Civil',
      optional:true,
    autoform: {
      defaultValue:"Soltero/a",
      options: [
        {label: "Soltero/a", value: "Soltero/a"},
        {label: "Casado/a", value: "Casado/a"},
         {label: "Otros", value: "Otros"},
      ]
    }
  },
});
var schemaActividades = new SimpleSchema({
   nombreActividad: {
    type: String,
    label: 'Nombre del Servicio',
  },
  importe: {
    type: Number,
    label: '$ Importe',
    decimal: true
  },
   periodos:{
    type:Array,
    optional:true
  },
  "periodos.$":{
    type:Object,
  },
    "periodos.$.created": {
    type: Date,
    optional: true,
    autoValue: function() {
      return new Date();
    },
  },
   "periodos.$._id":{
     type: String,
     optional: true,
    autoValue: function() {
      return Meteor.uuid();
    }
  },
  "periodos.$.nombrePeriodo":{
     type: String,
    label: 'Periodo',
     optional: false,
  },
  "periodos.$.fechaInicio":{
    optional: false,
     type: Date,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
    label: 'Fecha Inicio',
  },
  "periodos.$.fechaFin":{
    optional: false,
     type: Date,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
    label: 'Fecha Fin',
  },
   "periodos.$.detalle":{
     type: String,
    label: 'Detalle',
     optional: true,
  },
  
});
var schemaGrupos = new SimpleSchema({
  
  nombre: {
    type: String,
    label: "Nombre",
  },
   imagen: {
    type: String,
    label: "Logo",
     optional: true
  },
  nivel: {
    type: Number,
    label: "Nivel",
    optional: true
  },
  descuentoCuotaSocial_importe: {
    type: Number,
    label: "$ descuento CUOTA SOCIAL",
    optional: true
  },
  descuentoCuotaSocial_porcentaje: {
    type: Number,
    label: "% descuento CUOTA SOCIAL",
    optional: true
  },
  descuentoActividades_porcentaje: {
    type: Number,
    label: "% descuento ACTIVIDADES",
    optional: true
  },
  descuentoActividades_importe: {
    type: Number,
    label: "$ descuento ACTIVIDADES",
    optional: true
  },
  parent: {
    type: String,
    label: "Padre",
    optional: true
  },
  
  created: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    },
  },
  updated: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
  },
 
});

//********************* TALONARIOS ****************************************//
var schemaPromociones = new SimpleSchema({
  idGrupo: {
    type: String,
    label: "Grupo",
    optional:true,
    autoform: {
       
       type: "select2",
        //multiple:true,
       select2Options:{
           placeholder: 'sin grupo',
         allowClear:true,
       },
       options: function () {
        return _.map(Grupos.find().fetch(), function (c, i) {
          return {label: c.nombre, value: c._id};
        })},
        style: "width:150px",
      },
  },
 formaPago:{
     type: String,
      
       autoform: {
      options: [
        {label: "POSNET", value: "POSNET"},
        {label: "EFECTIVO", value: "EFECTIVO"},
        {label: "OTROS BANCOS", value: "OTROS BANCOS"},
        {label: "BANCO CHUBUT", value: "BANCO CHUBUT"},
      ]
    }
    
  },
  fecha:{
     type: Date,
     autoform: {
      type: "bootstrap-datepicker",
       style: "width:160px",
      defaultValue: new Date(),
      datePickerOptions: {
        autoclose: true
      }
    },
  },
  nombrePromocion: {
    type: String,
    label: 'Nombre Promocion',
    autoform: {
      placeholder: 'Nombre de la PROMOCION',
      //style: "width:50px"
    },
    max: 200
  },
  porcentajeDescuento: {
    type: Number,
    decimal:true,
    label:"% Descuento",
    //optional: true,
autoform: {
      defaultValue:0,
      //style: "width:50px"
    },
  },
  importeDescuento: {
    type: Number,
    decimal:true,
    label:"$ Descuento",
    autoform: {
      defaultValue:0,
      //style: "width:50px"
    },
    //optional: true,

  },
  destinoEdad: {
    type: String,
    optional: true,
    label:"Filtro por edad",
  },
  tambienCuotaSocial: {
    type: Boolean,
    optional: true,
    label:"Tambien en cuota Social?",
  },
  actividades: {
    type: [String],
    label:"Actividades",
    autoform: {
       
       type: "select2",
        multiple:true,
       select2Options:{
           placeholder: 'seleccion...',
         allowClear:true,
       },
       options: function () {
        return _.map(Actividades.find().fetch(), function (c, i) {
          return {label: c.nombreActividad, value: c._id};
        })},
        style: "width:150px",
      },
  }, 
});
var schemaLog = new SimpleSchema({
  detalle: {
    type: String,
    label: "Detalle",
  },
  accion: {
    type: String,
    label: 'Accion',
  },
  fecha: {
    type: Date,
     label: 'Fecha',
    
    optional: true,

  },
 
});

var schemaSettings = new SimpleSchema({
  clave: {
    type: String,
    label: "Clave",
  },
  valor: {
    type: String,
    label: 'Valor',
  },
  fecha: {
    type: Date,
     label: 'Fecha',
    optional: true,

  },
  created: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    },
  },
  updated: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
  },
 
});
//********************* validaciones ****************************************//

Profesores.attachSchema(schemaProfesores);
MovimientosGenerales.attachSchema(schemaMovimientosGenerales);
ImportarPagos.attachSchema(schemaImportarPagos);
Actividades.attachSchema(schemaActividades);
Imagenes.attachSchema(schemaImagenes);
Socios.attachSchema(schemaSocios);
Grupos.attachSchema(schemaGrupos);
Pagos.attachSchema(schemaPagos);
Settings.attachSchema(schemaSettings);
Deudas.attachSchema(schemaDeudas);
Promociones.attachSchema(schemaPromociones);
GeneracionDeudas.attachSchema(schemaGeneracionDeudas);
ExcepcionesDeudas.attachSchema(schemaExcepcionesDeudas);
PlanesEmpresa.attachSchema(schemaPlanesEmpresa);
CierreCaja.attachSchema(schemaCierreCaja);

CbuSocios.attachSchema(schemaCbuSocios);

Mensajes.attachSchema(schemaMensajes);
MensajesInternos.attachSchema(schemaMensajesInternos);
ArchivoBancos.attachSchema(schemaArchivoBancos);