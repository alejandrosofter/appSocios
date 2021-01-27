
Template.impresionDebito.helpers({
	
	"razonSocial":function(){
		return (this.socio.apellido+" "+this.socio.nombre).toUpperCase();
	},
	"mes":function(){
		console.log(this);
	
		 var d=new Date(this.alta.fecha);
		var mes=(d.getMonth()+1===13)?1:(d.getMonth()+1)
		return mesLetras(mes);
	},
	"ano":function(){
		console.log(this);
		 		 var d=new Date(this.alta.fecha);
		return d.getFullYear();
	},
	"dia":function(){
		console.log(this);
				 var d=new Date(this.alta.fecha);
		return d.getDate();
	},
		"importe":function(){
		return getImporteSocio(this.socio._id);
	},
	"tipoSocio":function(){
		return getTipoSocio(this.socio.fechaNacimiento,this.socio.esActivo);
	},
	"fechaDebito":function(){
				 var d=new Date(this.alta.fechaInicio);
		
		return mesLetras(d.getMonth()+1)+" "+d.getFullYear();
	},
	"debita":function(){
	if(this.socio.debitaCbu)return this.socio.cbu;
		return "NO";
	},
	"fechaNac":function(){
		 var d=new Date(this.socio.fechaNacimiento);
		return d.toLocaleDateString();
	}
});


Template.impresionDebitoBaja.helpers({
	
	"razonSocial":function(){
		return (this.socio.apellido+" "+this.socio.nombre).toUpperCase();
	},
	"mes":function(){
		console.log(this);
	
		 var d=new Date(this.alta.fecha);
		var mes=(d.getMonth()+1===13)?1:(d.getMonth()+1)
		return mesLetras(mes);
	},
	"ano":function(){
		console.log(this);
		 		 var d=new Date(this.alta.fecha);
		return d.getFullYear();
	},
	"dia":function(){
		console.log(this);
				 var d=new Date(this.alta.fecha);
		return d.getDate();
	},
		"importe":function(){
		return getImporteSocio(this.socio._id);
	},
	"tipoSocio":function(){
		return getTipoSocio(this.socio.fechaNacimiento,this.socio.esActivo);
	},
	"fechaDebito":function(){
				 var d=new Date(this.alta.fechaInicio);
		
		return mesLetras(d.getMonth()+1)+" "+d.getFullYear();
	},
	"fechaBaja":function(){
		return this.alta.fechaFinaliza.getFecha();
	},
	"debita":function(){
	if(this.socio.debitaCbu)return this.socio.cbu;
		return "NO";
	},
	"fechaNac":function(){
		 var d=new Date(this.socio.fechaNacimiento);
		return d.toLocaleDateString();
	}
});

Template.impresionDebito.events({
	"click #btnPrint":function(){
		console.log("print");
		window.print()
	},
});

Template.nuevoDebitoAutomatico.events({
	"click #estaInactiva":function(){
	var ok=$('#estaInactiva' ).is(":checked")
		console.log(ok)
		if(ok)$("#fechaFin").show();else $("#fechaFin").hide();
	}
})
Template.modificaDebitoAutomatico.events({
	"click #estaInactiva":function(){
	var ok=$('#estaInactiva' ).is(":checked")
		console.log(ok)
		if(ok)$("#fechaFin").show();else $("#fechaFin").hide();
	}
})
Template.debitosAutomaticos.events({
  'click #btnAgregarDebito': function(ev) {
    var act=this;
    Modal.show('nuevoDebitoAutomatico',function(){ return act; });
  },
  'click .imprimir': function(ev) {
    var act=this;
		if(this.estaInactiva) Modal.show('impresionDebitoBaja',function(){ return {socio:Session.get("socio"),alta:act} });
		else  Modal.show('impresionDebito',function(){ return {socio:Session.get("socio"),alta:act} });
  },
  'click .quitar': function(ev) {
    var act=this;
    var id=Session.get('socio')._id;
		var res=this._id+"";
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, 
				 function(){ 
		 Meteor.call("quitarDebitoAutomatico",id,res,function(err,res){
        if(!err)swal("Quitado!", "El registro ha sido borrado", "success");
        else swal("Ops...", "Ha ocurrido un error para quitar! .. por favor chekear nuevamente", "error");
      });
			
		});
  },
  'click .editar': function(ev) {
    var act=this;
    Modal.show('modificaDebitoAutomatico',function(){ return act; });
  },
  'click .default': function(ev) {
     var act=this;
    var id=Session.get('socio')._id;
		var res=this._id+"";
    swal({   title: "Estas Seguro de marcar como predeterminado?",   text: "Una vez realizado se debitara de esa cuenta!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#5cb85c",   confirmButtonText: "Si, predeterminalo!",   closeOnConfirm: false }, 
				 function(){ 
		 Meteor.call("defaultDebito",id,res,function(err,res){
        if(!err)swal("Quitado!", "El registro ha sido modificado", "success");
        else swal("Ops...", "Ha ocurrido un error ! .. por favor chekear nuevamente", "error");
      });
			
		});
  },
	
    
});
var buscarIndice=function(busca)
{
	var arr=Session.get("socio").debitoAutomatico;
	for (var i = 0; i < arr.length; i++)
		if(arr[i]._id==busca)return i;
	return -1;
}

Template.modificaDebitoAutomatico.helpers({
	"docu":function(){
		return Session.get("socio");
	},
	"muestraFechaFin":function(){
		if(this.estaInactiva)return "";
		return "display:none"
	},
  "eti_cbu":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'debitoAutomatico.'+ind+'.cbu';
	},
	 "eti_fechaFinaliza":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'debitoAutomatico.'+ind+'.fechaFinaliza';
	},
	 "eti_estaInactiva":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'debitoAutomatico.'+ind+'.estaInactiva';
	},
  "eti_tipoCuenta":function(){
		var idSeleccion=this._id
		var ind=buscarIndice(idSeleccion);
	return 'debitoAutomatico.'+ind+'.tipoCuenta';
	},
  "eti_titular":function(){
		var idSeleccion=this._id
		var ind=buscarIndice(idSeleccion);
	return 'debitoAutomatico.'+ind+'.titular';
	},
	"eti_banco":function(){
		var idSeleccion=this._id
		var ind=buscarIndice(idSeleccion);
	return 'debitoAutomatico.'+ind+'.banco';
	},
	"eti_fechaInicio":function(){
		var idSeleccion=this._id
		var ind=buscarIndice(idSeleccion);
	return 'debitoAutomatico.'+ind+'.fechaInicio';
	},
  "eti_nroCuenta":function(){
		var idSeleccion=this._id
		var ind=buscarIndice(idSeleccion);
	return 'debitoAutomatico.'+ind+'.nroCuenta';
	},
  "eti_cuil":function(){
		var idSeleccion=this._id
		var ind=buscarIndice(idSeleccion);
	return 'debitoAutomatico.'+ind+'.cuil';
	},
})

Template.debitosAutomaticos.helpers({
	'esAdmin': function(){
     if(!Meteor.user())return false;
     if(Meteor.user().profile==="admin")return true;
       return false;
     },
	'settings': function(){
		
        return {
 collection: this.debitoAutomatico,
          rowClass: function(item) {
						if(item.estaInactiva) return "inactivo"
            if(item.default)return "";
						
            return ""
          },
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: false,
 fields: [
	
	  {
        key: '_id',
				 sortOrder:0,
       sortDirection: 'descending',
       hidden:true
      },
     
	 {
        key: 'banco',
        label: 'Banco',
				
        fn: function (value, object, key) {
          var auxFe=object.fecha.getFecha();
          var fecha="<small><small style='color:white'>"+auxFe+"</small></small>"
		return  new Spacebars.SafeString("<span class=''> "+value+" "+fecha+"</span>")
         }
      },
   
   {
        key: 'cbu',
        label: 'CBU',
     headerClass: 'col-md-2',
         fn: function (value, object, key) {
		return  new Spacebars.SafeString("<small class=''><i> "+value+"</i> </small>")
           
         }
		
      },
    
    {
        label: '',
        headerClass: 'col-md-4',
        tmpl:Template.accionesDebitosAutomatico
      }
 ]
 };
    },

	
  'mouseover tr': function(ev) {
    $("#tablaDebitosAutomaticos").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
	
});