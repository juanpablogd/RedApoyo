//DEFINICIÓN DE VARIABLES
var imei,serial,marca,operador,fecha_captura,clave;
var id,cedula,nombres,apellidos,telefono,email,direccion;

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
    StatusBar.overlaysWebView(false);
    
    if(device.platform == "Android"){
        var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
        deviceInfo.get(function(result) { //alert (result);
                       //Obtiene el Número de SIM
                       var res = result.split("simNo");
                       res = res[1].split('"');	//alert (res[2]);
                       $("#simno").html("SIM: " + res[2]);
                       serial = res[2]; //alert("SIM / Serial: "+serial);
                       //Obtiene el IMEI
                       res = result.split("deviceID");
                       res = res[1].split('"');
                       //$("#simno").html("SIM: " + res[1]);
                       imei = res[2]; //alert("Imei: "+imei);
                       //Obtiene el IMEI
                       res = result.split("netName");
                       res = res[1].split('"');
                       operador = res[2]; //alert("Operador: "+operador);
                       
                       }, function() {
                       console.log("error");
                       });
    } else if(device.platform == "iOS"){
    	$("#simno").html("");
        window.plugins.sim.getSimInfo(successCallback, errorCallback);
    }else {
        msj_peligro("No se encontró plataforma de desarrollo.");
    }
    function successCallback(result) {
        operador = result.carrierName;
    }
    function errorCallback(error) {
        msj_peligro("Error equipo SIM - iOS: " + error);
    }
}
};

app.initialize();