var seg;
var activo;
var intervalo;

$("#boton_panico").click(function(){
	activar();
});

$("#btn_cancelar").click(function() {
	desactivar();
});

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'ConnexionDesconocida';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'SinRed';

    return states[networkState];
}

function activar(){
	if ($('#btn_cancelar').is(':hidden')){
		activo = true;
		$("#btn_cancelar").show();
		seg = 5;	
		$("#boton_txt").html(seg);
		$("#boton_txt").css("font-size","130px");						/* 		$("#boton_txt").css("margin-left","85px");	$("#boton_txt").css("margin-top","18px"); */
		intervalo = setTimeout(restar, 1000);
	    //restar(); // = setInterval(restar,1000);
	}
}

function llamar(num){
	window.PhoneCaller.call(num,
		function(success) { //alert('Dialing succeeded'); 
		},
		function(err) {
		    if (err == "empty") msj_peligro("Número desconocido");
		    else msj_peligro("Error llamada:" + err);        
		});
}
    
function desactivar(){
	activo = false;
	console.log("Cancelar");
	$("#boton_txt").css("font-size","35px");
	$("#boton_txt").css("margin-left","5px");
	$("#boton_txt").css("margin-top","7px"); 	
     
    $("#boton_panico").html('<h1 class="blanco" id="boton_txt"><span class="glyphicon glyphicon-off">Auxilio</span></h1>');
    $("#btn_cancelar").hide();
}

function restar(){ 						console.log(activo);
	if(activo==true){
		seg = seg - 1;
		$("#boton_txt").html(seg);
	    if(seg == 0){
	    	desactivar();
	    	if(myLatitud != "" && myLongitud != ""){
	    		//ENVIO DE ALERTA AL SERVIDOR	//ENVIO DE ALERTA AL SERVIDOR
				var now = new Date();	//Obtiene Fecha Actual
				var fecha_creacion = now.getFullYear()+'-'+(1+now.getMonth())+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
				var id_unico = fecha_creacion+'-'+localStorage.id;
				var conexion = checkConnection(); 					console.log(conexion);
				if(conexion=="SinRed" || conexion=="ConnexionDesconocida"){
		            msj_peligro("Sin conexión de red ó desconocida: " + error);
		            msj_exitoso("Llamando al 123 de la Policía!"); 
		            llamar("123+"); 
				}else{
					var parametros = new Object();
					parametros['fecha_creacion'] = fecha_creacion;
					parametros['descripcion'] = "Botón de Pánico";
					parametros['exactitud'] = myPrecision;
					parametros['lat'] = myLatitud;
					parametros['lon'] = myLongitud;
					parametros['id_pa_asignacion_equipo'] = localStorage.id;
					parametros['id_p_asunto'] = "1";
					parametros['id_p_estado_caso'] = "1";
					parametros['id_unico'] = id_unico;							console.log(parametros);
						$.ajax({
							data:  parametros,
							url:'http://'+localStorage.url_servidor+'/SIG/servicios/m123/m123_guardar_caso.php',
							type:  'post',
							async: false,		//timeout: 30000,
							success: function(responsef){	console.log(responsef);
								if(responsef == "Ok"){
									msj_exitoso("Caso Enviado Exitosamente");
								}else{
									msj_peligro("No se pudo realizar el registro, Verifique la Información");
									llamar("123+");
								}
							},
							error: function (error) {
								msj_peligro("Error al conectarse al servidor, revise su conexión a Internet");
								llamar("123+");
						    }
						});
				}	//ENVIO DE ALERTA AL SERVIDOR	//ENVIO DE ALERTA AL SERVIDOR
			}else{
				msj_peligro("No hay Ubicación!!");
				llamar("123+");				
			}
		}else{
	    	intervalo = setTimeout(restar, 1200);
	    	console.log("Disminuye");
	    }
	}
}

$("#btn_cancelar").hide();