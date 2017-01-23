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
