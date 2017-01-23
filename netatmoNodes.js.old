/**
 * Copyright 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
mustache = require('mustache');
module.exports = function(RED) {
    "use strict";

    /***************************************************************/
    function NetatmoGetThermostatsData(config) {

        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);
        var node = this;
        this.on('input', function(msg) {
            var netatmo = require('netatmo');

            var auth = {
                "client_id": this.creds.client_id,
                "client_secret": this.creds.client_secret,
                "username": this.creds.username,
                "password": this.creds.password
            };
            var api = new netatmo(auth);
            api.getThermostatsData(function(err, devices) {
                msg.payload = {devices:devices};
                node.send(msg);
            });
        });

    }
    RED.nodes.registerType("get thermostats data",NetatmoGetThermostatsData);

    /***************************************************************/
    function NetatmoSetThermpoint(config) {

        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);
        var node = this;
        this.on('input', function(msg) {
            var netatmo = require('netatmo');

            var auth = {
                "client_id": this.creds.client_id,
                "client_secret": this.creds.client_secret,
                "username": this.creds.username,
                "password": this.creds.password
            };

            var api = new netatmo(auth);

            /* Checks sent options */

            // device_id should be there
            if (msg.payload.device_id == null) {
              throw new Error('You did not set the device_id');
            }

            // module_id should be there
            if (msg.payload.module_id == null) {
              throw new Error('You did not set the module_id');
            }

            // mode should one of the list
            if (
              msg.payload.setpoint_mode != 'program'
              && msg.payload.setpoint_mode != 'away'
              && msg.payload.setpoint_mode != 'manual'
              && msg.payload.setpoint_mode != 'off'
              && msg.payload.setpoint_mode != 'max'
            ) {
              throw new Error('The sent setpoint_mode is not correct (should be \'program\', \'away\', \'manual\', \'off\' or \'max\')');
            }

            // If manual, a temperature must be set
            if ( msg.payload.setpoint_mode == 'manual' &&  msg.payload.setpoint_temp == null ) {
              throw new Error('If the selected mode is \'manual\', please set a temperature with the setpoint_temp parameter');
            }


            api.setThermpoint(msg.payload, function(err, status) {
              console.log("Netatmo API call status : " + status);
              node.send(msg);
            });


            api.on("error", function(error) {
                console.error('Netatmo threw an error: ' + error);
            });

            api.on("warning", function(warning) {
                console.error('Netatmo threw a warning: ' + warning);
            });



        });

    }
    RED.nodes.registerType("set thermpoint",NetatmoSetThermpoint);

    /***************************************************************/
    function NetatmoConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.client_id = n.client_id;
        this.client_secret = n.client_secret;
        this.username = n.username;
        this.password = n.password;
        this.device_id = n.device_id;
    }
    RED.nodes.registerType("NetatmoConfigNode",NetatmoConfigNode);


};
