var myLatitud;
var myLongitud;
var myPrecision;
var speed;
var heading;
var timestamp;
var watchID = null;
//var options = { timeout: 20000, enableHighAccuracy: true };
var options = { maximumAge: 1000*60, timeout: 1000*5, enableHighAccuracy: true }; //timeout: 60000*10, enableHighAccuracy: true };

var success = function(pos) {
	 myLatitud = pos.coords.latitude;
	 myLongitud = pos.coords.longitude;
	 myPrecision = pos.coords.accuracy;
	 speed = pos.coords.speed; 		if(speed == null) speed = "";
	 heading = pos.coords.heading;	if(heading == null) heading = "";		 	//text = "<div>Latitude: " + myLatitud + "<br/>" + "Longitude: " + myLongitud + "<br/>" + "Accuracy: " + myPrecision + " m<br/>" + "</div>";
	 timestamp = new Date(pos.timestamp);	timestamp = timestamp.format("yyyy-mm-dd HH:mm:ss");	//text = "<div>Latitud: " + myLatitud + "<br/>" + "Longitud: " + myLongitud + "<br/>" + "Precisi&oacute;n: " + myPrecision + " m <br/>Fecha: "+ timestamp +" <br/>" + "</div>";
	 $("#tab_geo").removeClass("btn-danger");
	 $("#tab_geo").addClass("btn-success");
	 $("#alerta_ubicacion").hide(); 
	 console.log("Ubicación exitosa: " + myLatitud + " " + myLongitud);	 
};

var failw = function(error) {
	console.log("Error - Latitud Anterior: " + myLatitud);
	if (myLatitud===undefined || myLatitud=="undefined"){myLatitud="";}
	if (myLongitud===undefined || myLongitud=="undefined"){myLongitud="";}
	if (myPrecision===undefined || myPrecision=="undefined"){myPrecision="";}
	 $("#tab_geo").removeClass("btn-success");
	 $("#tab_geo").addClass("btn-danger");
 	$("#alerta_ubicacion").show();
};

setInterval(function(){		//console.log(device.platform);
		console.log("Busca Ubicación"); 
		navigator.geolocation.getCurrentPosition(success, failw, options);
}, 1000*20);
//watchID = navigator.geolocation.watchPosition(success, failw, options);