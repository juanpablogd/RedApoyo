var db = window.openDatabase("bdpolimovil", "1.0", "Proyecto Cliente", 33554432);
var socket = io.connect('http://saga.cundinamarca.gov.co:3321/mobileregistro');

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

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        socket.on('news', function (data) {
		    console.log("Se conecto al socket");
		});
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('deviceready');
        StatusBar.overlaysWebView(false);
    }
};
app.initialize();