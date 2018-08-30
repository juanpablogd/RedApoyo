//DEFINICIÓN DE VARIABLES
var imei,serial,marca,operador,fecha_captura,clave;
var id,cedula,nombres,apellidos,telefono,email,direccion;

function msj_peligro(msj){
	$.growl(msj, { 
			type: "danger", 
			timer:  10000,
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

var app = {
    // Application Constructor
initialize: function() {
    this.bindEvents();
},
    // Bind Event Listeners // Bind any events that are required on startup. Common events are: // 'load', 'deviceready', 'offline', and 'online'.
bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
},
errorSim: function(error) {	console.log(error);
},
successSim: function(result) { console.log(JSON.stringify(result));	//console.log(JSON.stringify(result.cards));
	var devicePlatform = device.platform;	console.log(devicePlatform);
	if(devicePlatform == "Android"){ // Android only: check permission // check permission

	} else if(devicePlatform == "iOS"){
		$("#simno").html("");
	} else {
			msj_peligro("No se encontró plataforma de desarrollo.");
	}

	//Obtiene el OPERADOR
	operador = result.carrierName;	console.log("OPERADOR: "+operador);
	//Obtiene el Número de SIM
	serial = result.simSerialNumber;
	$("#simno").html("SIM: " + serial);		console.log("SIM / Serial: "+serial);
	//Obtiene el IMEI
	imei = result.deviceId;					console.log("IMEI - sim.deviceId: " + result.deviceId);
	var txtNumero = result.phoneNumber.replace('+57', '');
	//Obtiene el número telefonico
	$("#telefono").val(txtNumero);	//console.log("Telefono: " + result.phoneNumber);
},
successPermisos: function(result) { console.log(JSON.stringify(result));	console.log(result.hasPermission);
	if(result.hasPermission){
		$("#btn_ingresar").show();
		window.plugins.sim.getSimInfo(app.successSim, app.errorSim);
	}else{
		$("#btn_ingresar").hide();
		var permissions = cordova.plugins.permissions;
		permissions.requestPermission(permissions.READ_PHONE_STATE, app.successPermisos, app.errorPermisos);
	}
},
errorPermisos: function(error) {	console.log(error);
	msj_peligro("Debe autorizar el permiso: " + error);
	var permissions = cordova.plugins.permissions;
	permissions.requestPermission(permissions.READ_PHONE_STATE, app.successPermisos, app.errorPermisos);
},
validaPermisos: function(){
	var permissions = cordova.plugins.permissions;
	permissions.requestPermission(permissions.READ_PHONE_STATE, app.successPermisos, app.errorPermisos);
},
onDeviceReady: function() {
    console.log('deviceready ' + device.platform);
    var devicePlatform = device.platform;	//console.log(devicePlatform);
    if(devicePlatform == "iOS") StatusBar.overlaysWebView(false);
    var permissions = cordova.plugins.permissions;
    permissions.requestPermission(permissions.READ_PHONE_STATE, app.successPermisos, app.errorPermisos);
}
};

app.initialize();