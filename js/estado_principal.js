var db = window.openDatabase("bdpolimovil", "1.0", "Proyecto Cliente", 33554432);
var arr_tabla = new Array();
var arr_ListaTabla = new Array();

function errorCB(err) {
	// Esto se puede ir a un Log de Error dir�a el purista de la oficina, pero como este es un ejemplo pongo el MessageBox.Show :P
	if (err.code !== undefined && err.message !== undefined){
    	alert("Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message);
   	}else{
		if (localStorage.terminos != "1"){ 
			window.location = "terminos.html";
		}else {
			window.location = "login.html";
		}
   	}
}

/* VERIFICA SI YA EXISTE REGISTRO DE ALGÚN USUARIO Y SI YA ESTÁ ACTIVADO O NO*/
function EstadoRegistro(tx) {
	tx.executeSql('SELECT activo,id FROM registro', [],Resp_EstadoRegistro, errorCB);
}
function Resp_EstadoRegistro(tx, results) {
	//NÚMERO DE REGISTROS
    var len = results.rows.length;	//console.log("Registros encontrados: " + len);
    if(len>0){ 
    	var activo = results.rows.item(0).activo; //console.log(clave);
    	//SI LA CLAVE ES NULA QUIERE DECIR QUE NO SE ENCUENTRA ACTIVO, DE LO CONTRARIO CONTINUA EN LA APLICACIÓN
    	if(activo == "N"){		
    		window.location = "activacion.html";
    	}
	}else{	//SI NO HAY NADIE REGISTRADO - DIRECCIONA A REGISTRO	
		if (localStorage.terminos != "1"){ 
			window.location = "terminos.html";
		}else {
			window.location = "login.html";
		}
	}
}

/*	REVISA EL ESTADO DEL REGISTRO AL INICIALIZAR EL APLICATIVO */
db.transaction(EstadoRegistro);