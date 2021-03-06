//------------------------------------------------DOCUMENTO LISTO------------------------------------------------
$(document).ready(function(){
	
//INICIO BASE DE DATOS------------------------------------------------BASE DE DATOS------------------------------------------------
	var db = window.openDatabase("bdpolimovil", "1.0", "Proyecto Cliente", 33554432);
	function errorCB(err) {
		// Esto se puede ir a un Log de Error dir�a el purista de la oficina, pero como este es un ejemplo pongo el MessageBox.Show :P
		if (err.code !== undefined && err.message !== undefined){
	    	alert("Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message);
	   	}else{
	   		console.log("Crear Tabla Usuario");
	   		db.transaction(TBLusuario);
	   	}
	}
	function successCB() {
	    //alert("TRANSACION Ok!");
	}
	/* CREACIÓN DE LA TABLA USUARIO Y REGISTRO EN EL DISPOSITIVO */
	function TBLusuario(tx) {	//Si no existe crea la talba USUARIOS	//tx.executeSql('DELETE TABLE IF EXISTS "usuario"');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS registro ("nombres" TEXT ,"apellidos" TEXT,"cedula" TEXT,"telefono" TEXT,"email" TEXT,"direccion" TEXT,"imei" TEXT,"serial" TEXT,"marca" TEXT,"operador" TEXT,"fecha_hora" TEXT,"clave" TEXT,"id" TEXT,"activo" TEXT)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS ubicacion ("id_t_usuario" TEXT ,"longitud" TEXT,"latitud" TEXT,"exactitud" TEXT,"velocidad" TEXT,"direccion" TEXT,"fecha_captura" TEXT)');
		db.transaction(Registro);
	}
	
	/* LOGUEADO LOCALMENTE EN EL MOVIL*/
	function Registro(tx) {
		//VARIABLES VARIABLES
		console.log('SELECT clave FROM registro where cedula = "'+cedula+'"');
		tx.executeSql('SELECT cedula FROM registro where cedula = "'+cedula+'"', [],MuestraItems, errorCB);
	}
	
	/* LOGUEADO LOCALMENTE EN EL MOVIL*/
	function MuestraItems(tx, results) {
		//DATOS DEL FORMULARIO DE CAPTURA
		//VARIABLES VARIABLES
		if(imei === undefined ) imei = "";
		if(serial === undefined ) serial = "";
		if(marca === undefined ) marca = "";
		if(operador === undefined ) operador = "";
		//___FECHA
		var now = new Date();	var fecha_captura = now.getFullYear()+'-'+(1+now.getMonth())+'-'+now.getDate()+'-'+now.getHours()+'_'+now.getMinutes()+'_'+now.getSeconds();

		//NÚMERO DE REGISTROS
	    var len = results.rows.length;					
	    if(len==0){		//
	    	console.log(  'INSERT INTO registro (nombres,apellidos,cedula,telefono,email,direccion,imei,serial,marca,operador,fecha_hora,clave,id,activo) values ("'+nombres+'","'+apellidos+'","'+cedula+'","'+telefono+'","'+email+'","'+direccion+'","'+imei+'","'+serial+'","'+marca+'","'+operador+'","'+fecha_captura+'","'+clave+'","'+id+'","S");');
	    	tx.executeSql('DELETE FROM registro');
			tx.executeSql('INSERT INTO registro (nombres,apellidos,cedula,telefono,email,direccion,imei,serial,marca,operador,fecha_hora,clave,id,activo) values ("'+nombres+'","'+apellidos+'","'+cedula+'","'+telefono+'","'+email+'","'+direccion+'","'+imei+'","'+serial+'","'+marca+'","'+operador+'","'+fecha_captura+'","'+clave+'","'+id+'","S");');
		}else{											
			console.log('UPDATE registro set id="'+id+'",activo = "S",nombres="'+nombres+'",apellidos="'+apellidos+'",cedula="'+cedula+'",telefono="'+telefono+'",email="'+email+'",imei="'+imei+'",serial="'+serial+'",marca="'+marca+'",operador="'+operador+'",clave="'+clave+'",fecha_hora="'+fecha_captura+'" where cedula = "'+cedula+'"');
			tx.executeSql('UPDATE registro set id="'+id+'",activo = "S",nombres="'+nombres+'",apellidos="'+apellidos+'",cedula="'+cedula+'",telefono="'+telefono+'",email="'+email+'",direccion="'+direccion+'",imei="'+imei+'",serial="'+serial+'",marca="'+marca+'",operador="'+operador+'",clave="'+clave+'",fecha_hora="'+fecha_captura+'" where cedula = "'+cedula+'"');
	    }
		
		bootbox.dialog({
		  message: "Felicidades! Ingreso exitosa!",
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

	}
//FIN BASE DE DATOS------------------------------------------------BASE DE DATOS-----------------------------------------------
	
//------ENVIAR REGISTRO------//
	$("#btn_ingresar").click(function() {

		var cc = $("#cc").val().trim();
		var tel = $("#telefono").val().trim();	console.log(serial + " " + imei + " " + tel + " " + tel.length);
		//___FECHA
		var now = new Date();	var fecha_captura = now.getFullYear()+'-'+(1+now.getMonth())+'-'+now.getDate()+'-'+now.getHours()+'_'+now.getMinutes()+'_'+now.getSeconds();
		if(cc == ""){
			msj_peligro("Digite Cédula");
			$("#cc").focus();
			return false;
		}		
		if(tel == ""){
			msj_peligro("Digite el teléfono");
			$("#telefono").focus();
			return false;
		}else{
			var n = tel.length;
			if(n<10){
				msj_peligro("El teléfono debe mínimo 10 digitos");
				$("#telefono").focus();
				return false;
			}
		}
		
        if(imei == null || imei == "" || imei === undefined){
	        serial = cc;
	        imei = cc;
        }	
		var parametros = new Object();
			parametros['tabla'] = 'login';
			parametros['cedula'] = cc;
			parametros['telefono'] = tel;
			
			parametros['imei'] = imei;
			parametros['serial'] = serial;
			parametros['marca'] = marca;
			parametros['operador'] = operador;	console.log(parametros);
			
		$.ajax({
			data:  parametros,
			url:'http://'+localStorage.url_servidor+'/SIG/servicios/m123/m123_login.php',
			type:  'post',
			async: false,		//timeout: 30000,
			success: function(responsef){		console.log("Resp SRV: " + responsef);	//$id."@".$nombres."@".$apellidos."@".$cedula."@".$telefono."@".$email."@".$direccion."@".$clave;
				var respr = responsef.trim();		//alert(respr);	//var res=respr.split("@");
					var res=respr.split("|");
					id=res[0];nombres=res[1];apellidos=res[2];cedula=res[3];telefono=res[4];email=res[5];direccion=res[6];clave=res[7];
				if(respr == "" || nombres == undefined){
					msj_peligro("No se encuentra activo, por favor Registrese");	
				}else{
					localStorage.id = id;		console.log("localStorage.id: " +id); //console.log("nombres: " +nombres);
					db.transaction(Registro);
				}
			},
			error: function (error) {
				msj_peligro("Error al conectarse al servidor, revise su conexión a Internet");
		    }
		});
		
	});	
//------	FIN ENVÍO  DE REGISTRO------//
});