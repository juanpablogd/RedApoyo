var db = window.openDatabase("bdpolimovil", "1.0", "Proyecto Cliente", 33554432);
var arr_tabla = new Array();
var arr_ListaTabla = new Array();
var clave,serial;

function msj_exitoso(msj){
	$.growl(msj, { 
			type: "success", 
			timer : 100,
			delay: 3000,
				animate: {
					enter: 'animated bounceIn',
					exit: 'animated bounceOut'
				},
				placement: {
					from: "top",
					align: "center"
				}
	});
}

function msj_peligro(msj){
	$.growl(msj, { 
			type: "danger", 
			timer : 100,
			delay: 3000,
				animate: {
					enter: 'animated bounceIn',
					exit: 'animated bounceOut'
				},
				placement: {
					from: "top",
					align: "center"
				}
	});
}

function errorCB(err) {
	// Esto se puede ir a un Log de Error dir�a el purista de la oficina, pero como este es un ejemplo pongo el MessageBox.Show :P
	if (err.code !== undefined && err.message !== undefined){
    	alert("Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message);
   	}else{
   		window.location = "login.html"; 
   	}
}

// This function is used to get error message for all ajax calls
function getErrorMessage(jqXHR, exception) {
    var msg = '';
    if (jqXHR.status === 0) {
        msg = 'Señal Baja o Nula.\n Verifique la Red.';
    } else if (jqXHR.status == 404) {
        msg = 'Servicio No encontrado. [404]';
    } else if (jqXHR.status == 500) {
        msg = 'Error interno del servidor [500].';
    } else if (exception === 'parsererror') {
        msg = 'La solicitud falló.';				//parsererror
    } else if (exception === 'timeout') {
        msg = 'Tiempo agotado de espera.';			//timeout
    } else if (exception === 'abort') {
        msg = 'Solicitud Abortada.';				//abort
    } else {
        msg = 'Error: \n' + jqXHR.responseText;
    }
    msj_peligro(msg);
}

/* VERIFICA SI YA EXISTE REGISTRO DE ALGÚN USUARIO Y SI YA ESTÁ ACTIVADO O NO*/
function activacion(tx) {	//console.log('SELECT nombres,apellidos,cedula,telefono,direccion,email,clave,activo FROM registro');
	tx.executeSql('SELECT nombres,apellidos,cedula,telefono,direccion,email,serial,clave,activo,id FROM registro', [],Resp_activacion, errorCB);
}
function Resp_activacion(tx, results) {
	//NÚMERO DE REGISTROS
    var len = results.rows.length; console.log(len);					
    if(len>0){ 
    	clave = results.rows.item(0).clave; console.log(clave);
    	serial = results.rows.item(0).serial; console.log(serial);
    	
    	var activo = results.rows.item(0).activo;
    	//SI LA CLAVE ES NULA QUIERE DECIR QUE NO SE ENCUENTRA ACTIVO
    	if(activo == "N"){		
			$("#nombres").val(results.rows.item(0).nombres); //console.log(nombres);
			$("#apellidos").val(results.rows.item(0).apellidos);
			$("#cedula").val(results.rows.item(0).cedula);
			$("#telefono").val(results.rows.item(0).telefono);
			$("#email").val(results.rows.item(0).email);
			$("#direccion").val(results.rows.item(0).direccion);
	
			//socket.emit('getsms', {clave:clave,telefono:results.rows.item(0).telefono,id:results.rows.item(0).id});	SOLICITA UN MSJ SMS PARA LA ACTIVACIÓN
			msj_exitoso("Espere Llamada de Confirmación Por Favor!");
			//console.log("pedir mensaje");
			//Petición para envío de sms
			var parametros = new Object();
						parametros['tabla'] = 'activar';
						parametros['serial'] = serial;
						parametros['clave'] = clave;		console.log(parametros);
					$.ajax({
						data:  parametros,
						url:'http://'+localStorage.url_servidor+'/SIG/servicios/m123/m123_activacion_automatica.php',
						type:  'post',
						async: false,		//timeout: 30000,
						success: function(responsef){	console.log(responsef);		//alert(responsef);
							var reps = responsef.trim().split("@");;
							if(reps!=""){
								if(reps[0] == 1){
									db.transaction(function(tx) {
										tx.executeSql('UPDATE registro set activo = "S" ');
										localStorage.id = reps[1]; 
										
										bootbox.dialog({
										  message: "Felicidades! activación exitosa.",
										  title: "123 CUNDINAMARCA",
										  buttons: {
										    success: {
										      label: "Ok",
										      className: "btn-success btn-block",
										      callback: function() {
												window.location = "principal.html";
										      }
										    }
										  }
										});
							       });
								}else if(reps == 2){
									msj_peligro("Activación No autorizada, Cree un Registro en el Botón 'Nuevo Usuario'");
								}
							}
						},
						error: function (jqXHR, exception) {
				            console.log(jqXHR);
				            getErrorMessage(jqXHR, exception);
				        }
					});  

    	}else{	//SI YA EXISTE EL REGISTRO Y LA ACTIVACIÓN INGRESA AUTOMATICAMANTE A LA APLICACION 
			window.location = "principal.html";
    	}
	}else{	//SI NO HAY NADIE REGISTRADO - DIRECCIONA A TERMINOS	
		window.location = "terminos.html";
	}
}

function RegError(){
	msj_peligro("Error al eliminar el Registro");
}
function RegOk(){
	window.location = "login.html";
}
//Elimina todo registro del sistema
function NuevoRegistro(tx) {
	tx.executeSql('DELETE FROM registro');
}

$("#btn_registro").click(function(){
	db.transaction(NuevoRegistro, RegError, RegOk);		
});

$("#btn_activar").click(function(){
	var clave_usr = $("#Clave").val();
	if(clave_usr == ""){
		msj_peligro("Digite la clave de Activación");
		$("#Clave").focus();
		return false;
	}
	if(clave_usr == clave){

		var parametros = new Object();
			parametros['tabla'] = 'activar';
			parametros['serial'] = serial;
			parametros['clave'] = clave;		console.log(parametros);
		$.ajax({
			data:  parametros,
			url:'http://'+localStorage.url_servidor+'/SIG/servicios/m123/m123_activar.php',
			type:  'post',
			async: false,		//timeout: 30000,
			success: function(responsef){	console.log(responsef);		//alert(responsef);
				if(responsef != ""){
					db.transaction(function(tx) {
						var respf = responsef.trim().split("@");	console.log(respf);
						if(respf[0] == "Ok"){
							tx.executeSql('UPDATE registro set activo = "S" ');
							localStorage.id = respf[1]; 
							
							bootbox.dialog({
							  message: "Felicidades! activación exitosa!",
							  title: "123 CUNDINAMARCA",
							  buttons: {
							    success: {
							      label: "Ok",
							      className: "btn-success btn-block",
							      callback: function() {
									window.location = "principal.html";
							      }
							    }
							  }
							});
						}
			       });
				}else{
					msj_peligro("No se pudo realizar el registro, Verifique la Información");
				}

			},
			error: function (error) {
				msj_peligro("Error al conectarse al servidor, revise su conexión a Internet");
		    }
		}); 

	}else{
		msj_peligro("Clave Invalida, contacte al administrador del sistema");
	}
});


/* Cada 5 seg REVISA EL ESTADO DEL REGISTRO AL INICIALIZAR EL APLICATIVO */
setInterval(function(){db.transaction(activacion);}, 5000);