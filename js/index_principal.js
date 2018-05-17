/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() { console.log('deviceready');
	    var devicePlatform = device.platform;	console.log(devicePlatform);
	    if(devicePlatform == "iOS"){
	    	StatusBar.overlaysWebView(false);
	    }
        navigator.geolocation.getCurrentPosition(success, failw, options);
        document.addEventListener("backbutton", app.salir, false);
    },
    salir: function() {
        bootbox.hideAll();
        bootbox.dialog({
          message: " ¿Está seguro que desea salir?",
          title: "<span class=\"glyphicon glyphicon-warning-sign rojo \"></span> 123 Cundinamarca",
          buttons: {
            success: {
              label: "Si",
              className: "btn-success",
              callback: function() {
                navigator.app.exitApp();
              }
            },
            main: {
              label: "No",
              className: "btn-primary",
              callback: function() {
                
              }
            }
          }
        });
   }
};
app.initialize();