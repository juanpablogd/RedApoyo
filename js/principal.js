var db = window.openDatabase("bdpolimovil", "1.0", "Proyecto Cliente", 33554432);
var arr_tabla = new Array();
var arr_ListaTabla = new Array();
var i_foto=0;
var optionsvideo = { limit: 1, duration: 30 }; //No se está aplicando

function msj_exitoso(msj){
	$.growl(msj, { 
			type: "success", 
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

function errorCB(err) {
	// Esto se puede ir a un Log de Error dir�a el purista de la oficina, pero como este es un ejemplo pongo el MessageBox.Show :P
	if (err.code !== undefined && err.message !== undefined){
    	alert("Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message);
   	}else{
   		window.location = "registro.html"; 
   	}
}

/* VERIFICA SI YA EXISTE REGISTRO DE ALGÚN USUARIO Y SI YA ESTÁ ACTIVADO O NO*/
function EstadoRegistro(tx) {
	tx.executeSql('SELECT activo,id FROM registro', [],Resp_EstadoRegistro, errorCB);
}
function Resp_EstadoRegistro(tx, results) {
	//NÚMERO DE REGISTROS
    var len = results.rows.length;					
    if(len>0){ 
    	var activo = results.rows.item(0).activo; //console.log(clave);
    	//SI LA CLAVE ES NULA QUIERE DECIR QUE NO SE ENCUENTRA ACTIVO
    	if(activo == "N"){		
    		window.location = "activacion.html";
    	}else{	//SI YA EXISTE EL REGISTRO Y LA ACTIVACIÓN INGRESA AUTOMATICAMANTE A LA APLICACION 
				var id = results.rows.item(0).id;			//var nombre = results.rows.item(0).nombre;	
			 	if(id == "" || id === undefined){window.location = "index.html";}	
    	}
	}else{	//SI NO HAY NADIE REGISTRADO - DIRECCIONA A REGISTRO	
		window.location = "registro.html";
	}
}

if(localStorage.id == "" || localStorage.id == null || localStorage.id == undefined){
	/*	REVISA EL ESTADO DEL REGISTRO AL INICIALIZAR EL APLICATIVO */
	db.transaction(EstadoRegistro);		
}  

$("#btn_caso").click(function(){
	var descripcion = $("#descripcion").val();
	if(descripcion == ""){
		msj_peligro("Digite una descripción");
		$("#descripcion").focus();
		return false;
	}
	if(myLatitud == "" || myLongitud == ""){
		msj_peligro("Antes de enviar el caso, Active GPS por favor");
		return false;
	}
	var adjunto = "N";
	if(localStorage.Videos != null && localStorage.Videos != "" && localStorage.Videos !== undefined && localStorage.Videos != "undefined" && localStorage.Fotos != null && localStorage.Fotos != "" && localStorage.Fotos !== undefined && localStorage.Fotos != "undefined"){
		console.log("Hay videos y Fotos");
		adjunto = "A";
	}else if(localStorage.Videos != null && localStorage.Videos != "" && localStorage.Videos !== undefined && localStorage.Videos != "undefined"){
		console.log("Solo hay videos");
		adjunto = "V";
	}else if(localStorage.Fotos != null && localStorage.Fotos != "" && localStorage.Fotos !== undefined && localStorage.Fotos != "undefined"){
		console.log("Solo hay Fotos");
		adjunto = "F";
	}
	
	//Obtiene Fecha Actual
	var now = new Date();
	var fecha_creacion = now.getFullYear()+'-'+(1+now.getMonth())+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
	var id_unico = fecha_creacion+'-'+localStorage.id;
	
	var parametros = new Object();
		parametros['fecha_creacion'] = fecha_creacion;
		parametros['descripcion'] = descripcion;
		parametros['exactitud'] = myPrecision;
		parametros['lat'] = myLatitud;
		parametros['lon'] = myLongitud;
		parametros['id_pa_asignacion_equipo'] = localStorage.id;
		parametros['id_unico'] = id_unico;
		parametros['id_p_asunto'] = "2";
		parametros['id_p_estado_caso'] = "1";
		parametros['adjunto'] = adjunto;
		parametros['id_unico'] = id_unico;		//alert(parametros['id_pa_asignacion_equipo']);
		
		$.ajax({
			data:  parametros,
			url:'http://'+localStorage.url_servidor+'/SIG/servicios/m123/m123_guardar_caso.php',
			type:  'post',
			async: false,		//timeout: 30000,
			success: function(responsef){	//alert(responsef);
				if(responsef != ""){
					if(responsef == "Salir"){

						localStorage.id = "";
						db.transaction(function(tx) {
								tx.executeSql('DELETE FROM registro');
				        });
						db.transaction(EstadoRegistro);
						
					} else	{
						msj_peligro("Caso Enviado Exitosamente");
					    $("#descripcion").val('');
					}
				}else{
					msj_peligro("No se pudo realizar el registro, Verifique la Información");
				}

			},
			error: function (error) {
				msj_peligro("Error al conectarse al servidor, revise su conexión a Internet");
		    }
		}); 
			
		//GUARDA FOTOS		//alert(localStorage.Fotos); 
	
	if(localStorage.Fotos != null && localStorage.Fotos != "" && localStorage.Fotos !== undefined && localStorage.Fotos != "undefined"){
		//CARGA FOTOS
		var data = JSON.parse(localStorage.getItem('Fotos'));
		$.each(data, function(i, item) {	//alert(data[i]);
          var url_imagen = data[i];
			
          var options = new FileUploadOptions();
            options.fileName=url_imagen;
            options.mimeType="image/jpeg";
            
          var params = new Object();
			params.cod_envio = id_unico;

            options.params = params;			


			//ENVIA EL FOTO	
			var ft = new FileTransfer();
			ft.onprogress = function(progressEvent) {
				if (progressEvent.lengthComputable) {
					var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
					$("#resultado").html("<br>Cargando: <strong>"+perc + "% </strong><br>"); 
				} else {
					$("#resultado").html("<br>Cargando: <strong>"+perc + "% </strong><br>"); 
				}
				if(perc >= 99) $("#resultado").html('');
			};
			
	        ft.upload(url_imagen,
	            "http://"+localStorage.url_servidor+"/SIG/servicios/m123/sincronizar_imagen.php",
	            function(result) {  $("#resultado").html("Response = " + result.response.toString());
	            	//alert(result);
	            	//RESPUESTA DEL SERVIDOR
					var respf = result.response.toString(); respf = respf.trim();
	            	var n=respf.split("@");
	            },
	            function(error) {
	                $("#resultado").html('Error cargando archivo, verifique conectividad');
	                //alert("An error has occurred: source = " + error.source + error.code);
	                //alert("An error has occurred: target = " + error.target); 
						//CONTINUA CON LOS NUEVOS ELEMENTOS REGISTRADOS EN EL SISTEMA
						//	if((i+1) == len) { //alert("continue a rtas");	salir();	}
	            },options
			);

		});
		data.length=0;
		localStorage.Fotos = "";	
		$("#lista_fotos").html('');
		//$("#resultado").html('');			
	}
	
	
	//GUARDA VIDEOS
	if(localStorage.Videos != null && localStorage.Videos != "" && localStorage.Videos !== undefined && localStorage.Videos != "undefined"){
		//CARGA VIDEOS
		var data = JSON.parse(localStorage.getItem('Videos'));
		$.each(data, function(i, item) {	//alert(data[i]);
			//tx.executeSql('INSERT INTO '+esquema+'t_video (id,url_video,id_unico) values ("'+num_reg+'","'+data[i]+'","'+id_unico+'")');

			var parametros = new Object();
			var url_video = data[i];				
			var name = url_video.match(/[-_\w]+[.][\w]+$/i)[0];		//var name = tmp_url_video[1];
			
			//alert("Guardar->path: " + url_video);		DEPURACIÓN
			//alert("Guardar->name: " +name);			DEPURACIÓN
			
			var options = new FileUploadOptions(); 
				options.fileName = name;
				

			var params = new Object();
				params.cod_envio = id_unico;			 //alert(results.rows.item(i).esquema + " -- " + results.rows.item(i).id_unico);
				params.url_video = url_video;
			options.params = params;
			
			//ENVIA EL VIDEO	
			var ft = new FileTransfer();
			ft.onprogress = function(progressEvent) {
				if (progressEvent.lengthComputable) {
					var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
					$("#resultado").html("<br>Cargando Video "+i+": <strong>"+perc + "% </strong><br>"); 
				} else {
					$("#resultado").html("<br>Cargando Video "+i+": <strong>"+perc + "% </strong><br>"); 
				}
				if(perc >= 99) $("#resultado").html('');
				$("#resultado").trigger("create");
			};
			
			//sI EXISTE EL ARCHIVO LO ENVÍA
	        ft.upload(url_video,
	            "http://"+localStorage.url_servidor+"/SIG/servicios/m123/sincronizar_video.php",
	            function(result) {
	            	
					var respf = result.response.trim();
					//alert("Resp Servidor: " + respf);		DEPURACIÓN	DEPURACIÓN
					var n=respf.split("@@");

					var url_video_del = n[2];				//alert(url_video);
					var tmp_url_video_del = url_video_del.split("@");
					var path_del = tmp_url_video_del[0];
					$("#resultado").html("");					
							//Delete file 
							window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, 
							    function(fileSys) { 
							
							        fileSys.root.getFile(path_del, {create: false}, 
							            function(file) {
							                file.remove(pictureRemoved, notRemoved);                                                  
							            }, no);
							    }, no); 
	            },
	            function(error) {
	                alert('Error Cargando Archivo ' + name + ': ' + error.code);
	            },options
			);
		});
		data.length=0;
		localStorage.Videos = "";				
	}
	
	
});


$("#add_foto").click(function() {
/* INICIO PRUEBA		var imageData = "img/logo.png";
				//VERIFICA SI EXISTEN ELEMENTOS IMG, SI HAY VERIFICA SI HAY DISPONIBILIDAD PARA CAPTURA DE FOTOGRAFÍA
				var img_disponible = false;
				$("img").each(function() {
					if($(this).attr('src')=="" || $(this).attr('src')==null){
						NomIdimage=$(this).attr('id');
						img_disponible = true;
						return false; 											//Espacio Disponible
					}
				});
				//CREA NUEVO ARRAY PARA LAS FOTOS
			    var arr_tmp_fotos = new Array();				//CREA NUEVO ARRAY PARA LAS FOTOS			console.log(localStorage.getItem('Fotos'));
			    if(localStorage.getItem('Fotos') == null ){localStorage.Fotos = "";}
			    else if(localStorage.Fotos != "")  { var arr_tmp_fotos = JSON.parse(localStorage.getItem('Fotos'));}
			    arr_tmp_fotos.push(imageData); 
				localStorage.setItem('Fotos', JSON.stringify(arr_tmp_fotos));
																					
				//SI NO EXISTE CREA EL ELEMENTO IMG PARA ALMACENAR LA FOTO
				if(img_disponible==false){
					NomIdimage = "ci"+i_foto;				//alert('Calidad: '+foto_calidad);
					$("#lista_fotos").append('<div class="inline thumbnail" id="bloque'+i_foto+'" align="center"><img class="img-responsive" id="'+NomIdimage+'" src="'+imageData+'" /><button onclick="elimina_foto('+i_foto+')" id="btn_elimina'+i_foto+'" class="btn btn-danger"><span class="glyphicon glyphicon-chevron-up"></span> Eliminar <span class="glyphicon glyphicon-remove"></span></button></div>');
					i_foto++;
				}						//activaTab('tab2_foto');						
			    $("#"+NomIdimage).show();		
			
			    imageData = null; //lIMPIA LA VARIABLE DE LA IMAGEN
			    arr_tmp_fotos.length=0;		//alert(localStorage.Fotos);
				return false;		 FIN PRUEBA */
	console.log('Calidad: '+foto_calidad);
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, 
			{ 	quality : foto_calidad
	    		,destinationType : Camera.DestinationType.FILE_URI
	    		,sourceType : Camera.PictureSourceType.CAMERA
	    		,encodingType: Camera.EncodingType.JPEG
	    		//,saveToPhotoAlbum: true
	    		,correctOrientation:true
			}); 
	return false;
});

$("#sel_foto").click(function() {
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, 
				{ 	quality : foto_calidad									
		    		,destinationType : Camera.DestinationType.FILE_URI
		    		,sourceType : Camera.PictureSourceType.PHOTOLIBRARY
		    		,encodingType: Camera.EncodingType.JPEG,
		    		correctOrientation:true
				}); 
	return false;
});
	
	
$("#add_video").click(function() {
	//captureVideo();
	navigator.device.capture.captureVideo(captureSuccess, captureError, optionsvideo);
	return false;
});

//SI HAY FOTOS EN LOCAL ESTORAGE, LAR CARGA AUTOMATICAMENTE

//CARGA VIDEOS
var data = JSON.parse(localStorage.getItem('Videos'));
$.each(data, function(i, item) {	
	//alert(data[i]);
	
	var namefile = data[i].match(/[-_\w]+[.][\w]+$/i)[0];
	
		$("#lista_videos").append(
			'<div id="bloquev'+i+'" align="center" class="thumbnail"> Video:' + namefile+ '<br>' +
				'<video controls width="70%">' +
				  '<source id="v' + i + '"  src="' + data[i] + '" type="video/mp4">' +
				  'Video no soportado para reproducción' +
				'</video><br>' +
				'<button type="button" onclick="elimina_Video('+i+');" id="btn_elimina_v'+i+'" class="btn btn-danger"> '+ 
				' <span class="glyphicon glyphicon-chevron-up"></span> Eliminar Video <span class="glyphicon glyphicon-remove"></span></button>'+
			'</div>');
		$("#lista_videos").show();
	
}); 