//------------------------------------------------DOCUMENTO LISTO------------------------------------------------
$(document).ready(function(){

	if (localStorage.url_servidor == "" || localStorage.url_servidor === undefined) window.location = "index.html";

	function validarEntero(valor) {
        //intento convertir a entero. 
        //si era un entero no le afecta, si no lo era lo intenta convertir 
        valor = parseInt(valor);
        //Compruebo si es un valor numérico 
        if (isNaN(valor)) {
            //entonces (no es numero) devuelvo el valor cadena vacia 
        } else {
            //En caso contrario (Si era un número) devuelvo el valor 
            return valor;
        }
    }	
	
	//VALIDA CAMPOS NUMERICOS
	$("#cedula,#telefono").blur(function () { 
		console.log(validarEntero($(this).val()));
		var vr = validarEntero($(this).val());
		$(this).val(vr);
	});
	
	function setMunicipio(id,nom){
		console.log(id + ' ' + nom);
		$('#municipio').attr("valor",id);
		$('#municipio').html('Municipio: '+nom);
	}

 	//CARGA MUNICIPIOS
	$.getJSON( "json/municipios.json", function( data ) {
	  var items = [];
	  $.each( data, function( key, val ) {
	  	$('#table_mpio > tbody').append('<tr id="'+val.codigo_mun+'"><td>'+val.nombre_mun+'</td></tr>');
	  });
      $( '#table_mpio' ).searchable({
      		searchField   : '#busca_mpio',
	        oddRow: { 'background-color': '#f5f5f5' },
	        evenRow: { 'background-color': '#fff' },
		    searchType    : 'fuzzy',
            show: function (elem) {
            	//console.log("SHOW buscar");
                elem.slideDown(100);
                var selec = $('#table_mpio > tbody > tr:visible');
                var num_reg = selec.length;
                if(num_reg == 1){
                	var id_reg = selec.attr('id');
                	var nom_reg  = "";
                	selec.find('td').each (function() {
						nom_reg = $(this).html();
					});   
                	setMunicipio(id_reg,nom_reg);
                }
            },
            hide: function (elem) {
            	//console.log("HIDE buscar");
                elem.slideUp(100);
                var selec = $('#table_mpio > tbody > tr:visible');
                var num_reg = selec.length;
                if(num_reg == 1){
                	var id_reg = selec.attr('id');
                	var nom_reg  = "";
                	selec.find('td').each (function() {
						nom_reg = $(this).html();
					});   
                	setMunicipio(id_reg,nom_reg);
                }
            },
		    onSearchActive : function( elem, term ) {
		    	//console.log("onSearchActive buscar");
		        elem.show();
		    },
		    onSearchEmpty: function( elem ) {
		    	//console.log("onSearchEmptyActive buscar");
		        elem.hide();
		    },
    		clearOnLoad: true
	    });
	    
	    $("#table_mpio > tbody > tr").click(function() {
        	var id_reg = $( this ).attr('id');
        	var nom_reg  = "";
        	$( this ).find('td').each (function() {
				nom_reg = $(this).html();
			});   
        	setMunicipio(id_reg,nom_reg);
		});
	});
	
//INICIO BASE DE DATOS------------------------------------------------BASE DE DATOS------------------------------------------------
	var db = window.openDatabase("bdpolimovil", "1.0", "Proyecto Cliente", 33554432);
	function errorCB(err) {
		// Esto se puede ir a un Log de Error dir�a el purista de la oficina, pero como este es un ejemplo pongo el MessageBox.Show :P
		if (err.code !== undefined && err.message !== undefined){
	    	alert("Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message);
	   	}else{
	   		db.transaction(TBLusuario);
	   		//alert("Crear Tabla Usuario");
	   	}
	}
	function successCB() {
	    //alert("TRANSACION Ok!");
	}
	/* CREACIÓN DE LA TABLA USUARIO Y REGISTRO EN EL DISPOSITIVO */
	function TBLusuario(tx) { //Si no existe crea la talba USUARIOS	//tx.executeSql('DELETE TABLE IF EXISTS "usuario"');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS registro ("nombres" TEXT ,"apellidos" TEXT,"cedula" TEXT,"telefono" TEXT,"email" TEXT,"direccion" TEXT,"imei" TEXT,"serial" TEXT,"marca" TEXT,"operador" TEXT,"fecha_hora" TEXT,"clave" TEXT,"id" TEXT,"activo" TEXT)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS ubicacion ("id_t_usuario" TEXT ,"longitud" TEXT,"latitud" TEXT,"exactitud" TEXT,"velocidad" TEXT,"direccion" TEXT,"fecha_captura" TEXT)');
		db.transaction(Registro);
	}
	
	/* LOGUEADO LOCALMENTE EN EL MOVIL*/
	function Registro(tx) {
		var cedula = $("#cedula").val().trim();		console.log('SELECT clave FROM registro where cedula = "'+cedula+'"');
		tx.executeSql('SELECT cedula FROM registro where cedula = "'+cedula+'"', [],MuestraItems, errorCB);
	}
	/* LOGUEADO LOCALMENTE EN EL MOVIL*/
	function MuestraItems(tx, results) {
		//DATOS DEL FORMULARIO DE CAPTURA
		var nombres = $("#nombres").val().trim(); console.log(nombres);
		var apellidos = $("#apellidos").val().trim();
		var cedula = $("#cedula").val().trim();
		var telefono = $("#telefono").val().trim();
		var email = $("#email").val().trim();
		var direccion = $("#direccion").val().trim();
		console.log(serial + " " + imei);
		if(imei === undefined ) imei = "";
		if(serial === undefined ) serial = "";
		if(marca === undefined ) marca = "";
		if(operador === undefined ) operador = "";
		
        if(imei == null || imei == "" || imei === undefined){
	        serial = cedula;
	        imei = cedula;
        }	
		//___FECHA
		var now = new Date();	var fecha_captura = now.getFullYear()+'-'+(1+now.getMonth())+'-'+now.getDate()+'-'+now.getHours()+'_'+now.getMinutes()+'_'+now.getSeconds();

		//NÚMERO DE REGISTROS
	    var len = results.rows.length;					
	    if(len==0){ //console.log('INSERT INTO registro (nombres,apellidos,cedula,telefono,email,direccion,imei,serial,marca,operador,fecha_hora,clave,activo) values ("'+nombres+'","'+apellidos+'","'+cedula+'","'+telefono+'","'+email+'","'+direccion+'","'+imei+'","'+serial+'","'+marca+'","'+operador+'","'+fecha_captura+'","'+clave+'","N","'+id_pa_asignacion_equipo+'");');
	    		tx.executeSql('DELETE FROM registro');
				tx.executeSql('INSERT INTO registro (nombres,apellidos,cedula,telefono,email,direccion,imei,serial,marca,operador,fecha_hora,clave,activo,id) values ("'+nombres+'","'+apellidos+'","'+cedula+'","'+telefono+'","'+email+'","'+direccion+'","'+imei+'","'+serial+'","'+marca+'","'+operador+'","'+fecha_captura+'","'+clave+'","N","'+id_pa_asignacion_equipo+'");'); //
		}else{  //console.log('UPDATE registro set nombres="'+nombres+'",apellidos="'+apellidos+'",cedula="'+cedula+'",telefono="'+telefono+'",email="'+email+'",direccion="'+direccion+'",imei="'+imei+'",serial="'+serial+'",marca="'+marca+'",operador="'+operador+'",clave="'+clave+'",fecha_hora="'+fecha_captura+'",id="'+id_pa_asignacion_equipo+'" where cedula = "'+cedula+'"');	
			  	var cedula = results.rows.item(0).cedula;	
				tx.executeSql('UPDATE registro set nombres="'+nombres+'",apellidos="'+apellidos+'",cedula="'+cedula+'",telefono="'+telefono+'",email="'+email+'",direccion="'+direccion+'",imei="'+imei+'",serial="'+serial+'",marca="'+marca+'",operador="'+operador+'",clave="'+clave+'",fecha_hora="'+fecha_captura+'",id="'+id_pa_asignacion_equipo+'" where cedula = "'+cedula+'"');
	    }
		
		bootbox.dialog({
		  message: "Te has registrado Exitosamente, continua la Activación",
		  title: "123 CUNDINAMARCA",
		  buttons: {
		    success: {
		      label: "Ok",
		      className: "btn-success btn-block",
		      callback: function() {
		        window.location = "activacion.html";
		        
		      }
		    }
		  }
		});

	}
//FIN BASE DE DATOS------------------------------------------------BASE DE DATOS------------------------------------------------

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
	
//------ENVIAR REGISTRO------//
	$("#btn_registro").click(function() {
		$("#busca_mpio").val('');
		var nombres = $("#nombres").val().trim(); //console.log(nombres);
		var apellidos = $("#apellidos").val().trim();
		var cedula = $("#cedula").val().trim();
		var telefono = $("#telefono").val().trim();
		var email = $("#email").val().trim();
		var direccion = $("#direccion").val().trim();
		var municipio = $("#municipio").attr('valor'); console.log("Mpio: "+ municipio); 
		
		//___FECHA
		var now = new Date();	var fecha_captura = now.getFullYear()+'-'+(1+now.getMonth())+'-'+now.getDate()+'-'+now.getHours()+'_'+now.getMinutes()+'_'+now.getSeconds();

		if(nombres == ""){
			msj_peligro("Digite el Nombre");
			$("#nombres").focus();
			return false;	
		}if(apellidos == ""){
			msj_peligro("Digite su Apellido");
			$("#apellidos").focus();
			return false;
		}if(cedula == ""){
			msj_peligro("Digite Cédula");
			$("#cedula").focus();
			return false;
		}if(telefono == ""){
			msj_peligro("Digite Teléfono");
			$("#telefono").focus();
			return false;
		}if(direccion == ""){
			msj_peligro("Digite la Dirección");
			$("#direccion").focus();
			return false;
		}if(municipio == ""){
			msj_peligro("Selecccione el Municipio");
			$("#municipio").focus();
			return false;
		}
		console.log(serial + " " + imei);
        if(imei == null || imei == "" || imei === undefined){
	        serial = cedula;
	        imei = cedula;
        }	
		var parametros = new Object();
			parametros['tabla'] = 'registro';
			parametros['nombres'] = nombres;
			parametros['apellidos'] = apellidos;
			parametros['cedula'] = cedula;
			parametros['telefono'] = telefono;
			parametros['email'] = email;
			parametros['municipio'] = municipio;
			parametros['direccion'] = direccion;
			
			parametros['imei'] = imei;
			parametros['serial'] = serial;
			parametros['marca'] = marca;
			parametros['operador'] = operador;
			
			$.ajax({
				data:  parametros,
                url:'http://'+localStorage.url_servidor+'/SIG/servicios/m123/m123_sincronizar.php',
				type:  'post',
				async: false,		//timeout: 30000,
				success: function(responsef){	console.log("Resp SRV:" + responsef);
					var arresp = responsef.trim().split("@");
					id_pa_asignacion_equipo = arresp[0];	console.log("id_pa_asignacion_equipo:" + id_pa_asignacion_equipo);
					clave = arresp[1];						console.log("Clave:" + clave);
					db.transaction(Registro);
				},
				error: function (error) {
					msj_peligro("Error al conectarse al servidor, revise su conexión a Internet");
			    }
			});	
		
	});	
//------	FIN ENVÍO  DE REGISTRO------//
});