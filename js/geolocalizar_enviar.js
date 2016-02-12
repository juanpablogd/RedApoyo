var db = window.openDatabase("bdpolimovil", "1.0", "Proyecto Cliente", 33554432);

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

/* VERIFICA SI YA EXISTE REGISTRO DE ALGÚN USUARIO Y SI YA ESTÁ ACTIVADO O NO*/
function enviar_geo(tx) {	//console.log('SELECT nombres,apellidos,cedula,telefono,direccion,email,clave,activo FROM registro');
	tx.executeSql('select id_t_usuario, longitud,latitud,exactitud,velocidad,direccion,fecha_captura from ubicacion order by fecha_captura', [],Resp_enviar_geo, errorCB);
}
function Resp_enviar_geo(tx, results) {
	var id_t_usuario,serial;
	//NÚMERO DE REGISTROS
    var len = results.rows.length; //console.log(len);					
    if(len>0){ 
    	id_t_usuario = results.rows.item(0).id_t_usuario; console.log(id_t_usuario);
    	longitud = results.rows.item(0).longitud; console.log(longitud);
    	latitud = results.rows.item(0).latitud; console.log(latitud);
    	exactitud = results.rows.item(0).exactitud; console.log(exactitud);
    	velocidad = results.rows.item(0).velocidad; console.log(velocidad);
    	direccion = results.rows.item(0).direccion; console.log(direccion);
    	fecha_captura = results.rows.item(0).fecha_captura; console.log(fecha_captura);
    	
		var parametros = new Object();
			parametros['id_t_usuario'] = id_t_usuario;
			parametros['longitud'] = longitud;
			parametros['latitud'] = latitud;
			parametros['exactitud'] = exactitud;
			parametros['velocidad'] = velocidad;
			parametros['direccion'] = direccion;		
			parametros['fecha_captura'] = fecha_captura;		console.log(parametros);
		$.ajax({
			data:  parametros,
			url:'http://'+localStorage.url_servidor+'/SIG/servicios/m123/m123_geopos.php',
			type:  'post',
			async: false,		//timeout: 30000,
			success: function(responsef){	console.log(responsef);
				if(responsef != ""){
					db.transaction(function(tx) {
						var respf = responsef.trim();
						//console.log('DELETE FROM ubicacion WHERE fecha_captura = "'+respf+'"');
						tx.executeSql('DELETE FROM ubicacion WHERE fecha_captura = "'+respf+'"');
			       });
				}
			},
			error: function (error) {
				msj_peligro("Error al conectarse al servidor, revise su conexión a Internet");
		    }
		});

	}
}

function RegError(){
	msj_peligro("Error al eliminar el Registro");
}

/*	Envía cada 2 segundos las coordenadas pendientes */
//setInterval(function(){db.transaction(enviar_geo);}, 10000);
