# node-red-contrib-netatmo-thermostat
A Netatmo thermostat node for Node-Red

This project is more than inspired by the one from @[ssadams11](https://github.com/ssadams11): [ssadams11/node-red-contrib-netatmo](https://github.com/ssadams11/node-red-contrib-netatmo). Thank a lot for the initial help ! :)



# Nodes information

## Get thermostats data

Once you provided the appropriate credentials, this node will send you back in the payload your thermostats data, as described in the Netatmo documentation: https://dev.netatmo.com/dev/resources/technical/reference/thermostat/getthermostatsdata

### Result sample
```
{
	"devices": [{
		"_id": "70:ee:xx:xx:xx:xx",
		"firmware": 68,
		"last_bilan": {
			"y": 2016,"m": 12
		},
		"last_setup": 1444471631,
		"last_status_store": 1485114592,
		"modules": [{
			"_id": "04:ee:yy:yy:yy:yy",
			"module_name": "Thermostat",
			"type": "NATherm1",
			"firmware": 40,
			"last_message": 1485114593,
			"rf_status": 72,
			"battery_vp": 3996,
			"therm_orientation": 3,
			"therm_relay_cmd": 0,
			"battery_percent": 66,
			"event_history": {
				"boiler_not_responding_events": [ { "K": 1475752896 }, { "K": 1475752896 }, { "K": 1475752896 }, { "K": 1475752896 }, { "K": 1476870486 }],
				"boiler_responding_events": [{ "K": 1456920842 }, { "K": 1457217077 }, { "K": 1475661682 }, { "K": 1476009738 }]
			},
			"last_therm_seen": 1485114593,
			"setpoint": { "setpoint_mode": "program" },
			"therm_program_list": [{
				"zones": [ { "type": 0, "name": "Comfort", "temp": 20, "id": 0 }, { "type": 1, "name": "Night",	"temp": 16, "id": 1 }],
				"timetable": [ { "id": 1, "m_offset": 0 }, { "id": 6, "m_offset": 435 }],
				"program_id": "5618e4434bda1d8c5d8b4602",
				"name": "Default",
				"selected": true
			}],
			"measured": { "time": 1485114593, "temperature": 18.3, "setpoint_temp": 18 	}
		}],
		"place": {
			"altitude": 463,
			"city": "Paris",
			"country": "FR",
			"improveLocProposed": true,
			"location": [2.83584, 48.65109],
			"timezone": "Europe/Paris",
			"trust_location": true
		},
		"plug_connected_boiler": true,
		"station_name": "My Home",
		"type": "NAPlug",
		"udp_conn": true,
		"wifi_status": 60,
		"last_plug_seen": 1485114592
	}]
}
```


## Set thermpoint

 **Summary**: this node let you control your thermostat and set it up.


All the documentation can be found on Netatmo API reference page: https://dev.netatmo.com/dev/resources/technical/reference/thermostat/setthermpoint


The following parameters can be sent using the ```payload``` or sometimes in the node configuration pane (read the parameter section to know).

If a parameter is set in the node configuration pane *and* in the ```payload``` the considered value will be the ```payload```.

### ```device_id``` parameter
> Required
> ```payload``` only

This parameter is required and needs to be set using ```payload.device_id```.

This is the MAC address of your relay.

Be careful, this is the *thermostat* relay, not the *weather station* one. If you mix them, it won't work.

You can find it by opening the Netatmo web page dedicated to your thermostat ("Energy" : https://my.netatmo.com/app/energy ) and clicking the GEAR (top right): in the parameter list, you'll see the MAC address, starting with "70:ee:".


### ```module_id``` parameter
> Required
> ```payload``` only

This parameter is required and needs to be set using ```payload.module_id```.

If, like myself, you have only one relay and one thermostat, you will find the ```module_id``` thanks to the **Get thermostats data** node and a debug node with JSON selector ```msg.payload.devices[0].modules[0]```.


### ```setpoint_mode``` parameter
> Required
> ```payload``` or node configuration pane

Define the mode for your thermostat: ```setpoint_mode```

1. ```program```: indicates to the termostat to follow the already-defined-program
2. ```away```: put your thermostat in AWAY mode (for me, around 12°C)
3. ```hg```: lower than *away*, HG means "hors-gel" in french (ie Frost-guard). It is around 8°C
4. ```off```: switch off the thermostat
5. ```max```: set the maximum possible temperature (for a sauna)
6. ```manual```: enter into manual mode. In that case, the ```payload.setpoint_temp``` parameter will hold the desired temperature.


### ```setpoint_temp``` parameter
> Required when ```setpoint_mode``` is ```manual```
> ```payload``` or node configuration pane

This is the temperature you want to set up. This parameter is required if you ask for a ```manual``` mode. If not sent (```payload``` or node configuration pane) an error is raised.

### ```setpoint_endtime``` parameter

> Considered only when ```setpoint_mode``` is ```manual``` or ```max```
> ```payload``` or node configuration pane

This parameter is optional but makes sense only when used with mode ```manual``` or ```max```.

It will set the time your setup will be considered.

If not set, the applied value will the one you defined at your Netatmo account level.


### Sample ```payload```

#### Sample 1: set the program mode
```
var options = {
    'device_id' : '70:ee:nn:nn:nn:nn',
    'module_id' : '04:00:nn:nn:nn:nn',
    'setpoint_mode' : 'program',
};
msg.payload = options;
return msg;
```

#### Sample 2: set the manual mode, 25°C during 1 hour
```
var options = {
	'device_id' : '70:ee:nn:nn:nn:nn',
	'module_id' : '04:00:nn:nn:nn:nn',
	'setpoint_mode' : 'manual',
	'setpoint_temp' : 25,
	'setpoint_endtime' : 60,
};
msg.payload = options;
return msg;
```


#### Sample 3: set the away mode
```
var options = {
	'device_id' : '70:ee:nn:nn:nn:nn',
	'module_id' : '04:00:nn:nn:nn:nn',
	'setpoint_mode' : 'away',
	'setpoint_temp' : 25,
	'setpoint_endtime' : 60,
};
msg.payload = options;
return msg;
```


**Note**: ```setpoint_temp``` and ```setpoint_endtime``` will be ignored in that case.
