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
        
        /* PRUEBA PRUEBA PRUEBA PRUEBA */
		var smsInput_success = function (result) { 
			//alert("Ok");	//alert(result);
			 var sms_act = result.trim();	//alert(sms_act);
			 var sms_act_arr = sms_act.split(">"); //alert(sms_act_arr[0]);	//alert(sms_act_arr[1]);
			 //Obtiene el mensaje del SMS
			 var sms_msj = sms_act_arr[1]; 				//alert('sms_msj:'+sms_msj);
			 //obtiene clave y id
			 var sms_msj_arr = sms_msj.split("@");		
			 var clave_sms = sms_msj_arr[0];			//alert('clave_sms:'+clave_sms);
			 var id_sms = sms_msj_arr[1];				//alert('id_sms:'+id_sms);
			/* VERIFICA SI YA EXISTE REGISTRO DE ALGÚN USUARIO Y SI YA ESTÁ ACTIVADO O NO*/
			function ConsultaClave(tx) {	//console.log('SELECT nombres,apellidos,cedula,telefono,direccion,email,clave,activo FROM registro');
				//alert('SELECT clave FROM registro');
				tx.executeSql('SELECT clave,id FROM registro', [],Resp_ConsultaClave);
			}
			function Resp_ConsultaClave(tx, results) {
				//NÚMERO DE REGISTROS
			    var len = results.rows.length; //console.log(len); //alert('Resultados: '+len);					
			    if(len>0){ 
			    	var claveSQL = results.rows.item(0).clave; //alert('Resultados1:'+claveSQL);	//alert('Resultados2:'+clave_sms);

			    	if(clave_sms == claveSQL){
			    		
						tx.executeSql('UPDATE registro set activo = "S" ');
						localStorage.id = results.rows.item(0).id;; 
						
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
			    		
			    	}else{
			    		msj_peligro("La clave no coincide!");
			    	}
				}
			}
			db.transaction(ConsultaClave);

		};
        var smsInput_error = function (error) { alert("Error");  alert("Error: "+error);   };
        
        smsplugin.startReception(smsInput_success,smsInput_error);
        //alert('deviceready');
    }
};
app.initialize();