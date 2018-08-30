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
errorSim: function(error) { console.log(error);
},
successSim: function(result) { console.log(JSON.stringify(result)); console.log(JSON.stringify(result.cards));
  var devicePlatform = device.platform; console.log(devicePlatform);
  if(devicePlatform == "Android"){ // Android only: check permission // check permission

  } else if(devicePlatform == "iOS"){
    $("#simno").html("");
  } else {
      msj_peligro("No se encontró plataforma de desarrollo.");
  }

  //Obtiene el OPERADOR
  operador = result.carrierName;  console.log("OPERADOR: "+operador);
  //Obtiene el Número de SIM
  serial = result.simSerialNumber;
  $("#simno").html("SIM: " + serial);   console.log("SIM / Serial: "+serial);
  //Obtiene el IMEI
  imei = result.deviceId;         console.log("IMEI - sim.deviceId: " + result.deviceId);

/*
    if(devicePlatform == "Android"){
        var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
        deviceInfo.get(function(result) { //alert (result);
                       //Obtiene el Número de SIM
                       var res = result.split("simNo");
                       res = res[1].split('"'); //alert (res[2]);
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
                          console.log("Error: " + error);
                       });
    } else if(devicePlatform == "iOS"){
      StatusBar.overlaysWebView(false);
      $("#simno").html("");
        window.plugins.sim.getSimInfo(Sim_ok, Sim_error);
    }else {
        msj_peligro("No se encontró plataforma de desarrollo.");
    }
    function Sim_ok(result) {
        operador = result.carrierName;
    }
    function Sim_error(error) {
        msj_peligro("Error equipo SIM - iOS: " + error);
    }
*/

},
successPermisos: function(result) {   //console.log(JSON.stringify(result));  console.log(result.hasPermission);
  if(result.hasPermission){
    $("#btn_registro").show();
    window.plugins.sim.getSimInfo(app.successSim, app.errorSim);
  }else{
    $("#btn_registro").hide();
    var permissions = cordova.plugins.permissions;
    var listReq = [permissions.READ_PHONE_STATE,permissions.CALL_PHONE];
    permissions.requestPermission(listReq, app.successPermisos, app.errorPermisos);
  }
},
errorPermisos: function(error) {  console.log(error);
  msj_peligro("Debe autorizar el permiso: " + error);
  var permissions = cordova.plugins.permissions;
  var listReq = [permissions.READ_PHONE_STATE,permissions.CALL_PHONE];
  permissions.requestPermission(listReq, app.successPermisos, app.errorPermisos);
},
onDeviceReady: function() {
    if (window.cordova && window.cordova.plugins) {
        console.log('window.cordova.plugins is available');
    } else {
        console.log('window.cordova.plugins NOT available');
    }

    var permissions = cordova.plugins.permissions;
    var listReq = [permissions.READ_PHONE_STATE,permissions.CALL_PHONE];

    permissions.requestPermission(listReq, app.successPermisos, app.errorPermisos);

}
};

app.initialize();