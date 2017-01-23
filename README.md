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
		"_id": "70:ee:50:xx:xx:xx",
		"firmware": 68,
		"last_bilan": {
			"y": 2016,"m": 12
		},
		"last_setup": 1444471631,
		"last_status_store": 1485114592,
		"modules": [{
			"_id": "04:yy:yy:yy:yy:yy",
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


## Set thermopoint
 This node (with no output) will use the received information in the payload to act on your thermostat:
 * setting a new mode
 * setting a manual temperature

All the documentation can be found on Netatmo API reference page: https://dev.netatmo.com/dev/resources/technical/reference/thermostat/setthermpoint

### Possible mode values

There are 6 possible modes:

1. ```program```: indicates to the termostat to follow the program
2. ```away```: put your thermostat in AWAY mode (for me 12°C)
3. ```hg```: lower than *away*, HG means "hors-gel" in french = Frost-guard. It is around 8°C
4. ```off```: switch off the thermostat
5. ```max```: set the maximum possible temperature (for a sauna)
6. ```manual```: enter into manual mode. In that case, the ```payload.setpoint_temp``` parameter will hold the desired temperature.


 
