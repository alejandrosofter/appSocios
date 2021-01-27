import datetime
import time
import sys

from config import db
def linkSocio(idSocio_,importe_,_id_,detalle_,idFila_,idImp):
  aux={"idSocio":idSocio_,"importe":importe_,"_id":_id_,"detalle":detalle_,"idFila":idFila_}
  db.importarPagos.update({ "_id": idImp,"items.id":idFila_ }, { "$push": { "items.$.sociosAsociados": aux } });
  #detAux="{idSocio:'"+idSocio+"',importe:'"+importe+"',_id:'"+_id+"',detalle:'"+detalle+"',idFila:'"+idFila+"'}"
  #print(' db.importarPagos.update({ _id: "'+idImp+'","items.id":"'+idFila+'" }, { "$push": { "items.$.sociosAsociados": "'+detAux+'" } });')
#var aux={idSocio:idSocio,importe:importe,_id:timestamp,detalle:detalle,idFila:idItemImportacion};
print "idSocio "+str(sys.argv[1])
print "importe "+str(sys.argv[2])
print "timestamp "+str(sys.argv[3])
print "detalle "+str(sys.argv[4])
print "idFila "+str(sys.argv[5])
print "idImportacion "+str(sys.argv[6])
linkSocio(str(sys.argv[1]),str(sys.argv[2]),str(sys.argv[3]),str(sys.argv[4]),str(sys.argv[5]),str(sys.argv[6]))