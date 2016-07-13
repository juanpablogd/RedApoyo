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
    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
onDeviceReady: function() {
    console.log('deviceready ' + device.platform);
    var devicePlatform = device.platform;	console.log(devicePlatform);
    if(devicePlatform == "iOS") StatusBar.overlaysWebView(false);
    
	window.plugins.sim.getSimInfo(
		function(result) {		//console.log(result);
		   if(devicePlatform == "Android"){
		   		//Obtiene el Número de SIM
	   			serial = result.simSerialNumber;
                $("#simno").html("SIM: " + serial);		console.log("SIM / Serial: "+serial);
                //Obtiene el IMEI
                imei = result.deviceId;					console.log("IMEI - sim.deviceId: " + result.deviceId);
           } else if(devicePlatform == "iOS"){
				$("#simno").html("");
           } else {
           		msj_peligro("No se encontró plataforma de desarrollo.");
           }
           //Obtiene el OPERADOR
           operador = result.carrierName;	console.log("OPERADOR: "+operador);
       },
		function(error) {
			msj_peligro("Error equipo SIM: " + error);
   		}
	);
}
};

app.initialize();