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
    function NetatmoSetThermpoint(config) {

        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);
        var node = this;
        this.on('input', function(msg) {
            var netatmo = require('netatmo');

            var dateFormat = require('dateformat');

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
              console.log(dateFormat(new Date(), "dd mmm HH:MM:ss") + " - [error] [node-red-contrib-netatmo-thermostat] setThermpoint > No device_id set");
              throw new Error('You did not set the device_id');
            }
            // module_id should be there

            if (msg.payload.module_id == null) {
              console.log(dateFormat(new Date(), "dd mmm HH:MM:ss") + " - [error] [node-red-contrib-netatmo-thermostat] setThermpoint > No module_id set");
              throw new Error('You did not set the module_id');
            }


            if ( msg.payload.setpoint_mode == null ) msg.payload.setpoint_mode = config.thermpointmode;
            if ( msg.payload.setpoint_temp == null ) msg.payload.setpoint_mode = config.thermpointtemp;

            // mode should one of the list
            //We put it in lowercase
            msg.payload.setpoint_mode = msg.payload.setpoint_mode.toLowerCase();
            if (
                 msg.payload.setpoint_mode != 'away'
              && msg.payload.setpoint_mode != 'hg'
              && msg.payload.setpoint_mode != 'manual'
              && msg.payload.setpoint_mode != 'max'
              && msg.payload.setpoint_mode != 'off'
              && msg.payload.setpoint_mode != 'program'
            ) {
              console.log(dateFormat(new Date(), "dd mmm HH:MM:ss") + " - [error] [node-red-contrib-netatmo-thermostat] setThermpoint > Mode not correctly set (uknown)");
              throw new Error('The sent setpoint_mode is not correct (should be \'program\', \'away\', \'manual\', \'off\' or \'max\')');
            }

            // If manual, a temperature must be set
            if ( msg.payload.setpoint_mode == 'manual' &&  msg.payload.setpoint_temp == null ) {
              throw new Error('If the selected mode is \'manual\', please set a temperature with the setpoint_temp parameter');
            }


            //Check the endtime is manual or max setpoint_endtime
            if ( msg.payload.setpoint_endtime == null ) msg.payload.setpoint_endtime = config.defaultendtime;



            console.log(dateFormat(new Date(), "dd mmm HH:MM:ss") + " - [info] [node-red-contrib-netatmo-thermostat] setThermpoint > " + msg.payload.setpoint_mode + " - " + msg.payload.setpoint_temp + " - " + msg.payload.setpoint_endtime);

            api.setThermpoint(msg.payload, function(err, status) {
              console.log(dateFormat(new Date(), "dd mmm HH:MM:ss") + " - [info] [node-red-contrib-netatmo-thermostat] setThermpoint > " + status);
              node.send(msg);
            });


            api.on("error", function(error) {
                console.error(dateFormat(new Date(), "dd mmm HH:MM:ss") + ' - [error] [node-red-contrib-netatmo-thermostat] setThermpoint >' + error);
            });

            api.on("warning", function(warning) {
                console.error(dateFormat(new Date(), "dd mmm HH:MM:ss") + ' - [warning] [node-red-contrib-netatmo-thermostat] setThermpoint >' + warning);
            });
        });
    }
    RED.nodes.registerType("set thermpoint",NetatmoSetThermpoint);

};
