//DEFINICIÓN DE VARIABLES
var imei,serial,marca,operador,fecha_captura,clave,id_pa_asignacion_equipo;
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
    if (window.cordova && window.cordova.plugins) {
        console.log('window.cordova.plugins is available');
    } else {
        console.log('window.cordova.plugins NOT available');
    }
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
        window.plugins.sim.getSimInfo(Sim_ok, Sim_error);
        window.plugins.uniqueDeviceID.get(id_ok, id_error);
    }else {
        msj_peligro("No se encontró plataforma de desarrollo.");
    }
    function Sim_ok(result) {
        operador = result.carrierName;
        $("#simno").html("SIM: " + serial);
    }
    function Sim_error(error) {
        msj_peligro("Error equipo SIM - iOS: " + error);
    }
    function id_ok(uuid) {
        serial = uuid;
        imei = uuid;
        $("#simno").html("ID: " + serial);
    }
    function id_error(error) {
        msj_peligro("Error equipo ID - iOS: " + error);
    }
}
};

app.initialize();