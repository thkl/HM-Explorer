const ipc = require('electron').ipcRenderer
const { URL } = require('url')


class CCU {
	

    constructor(ccuip) {
	   const CCUCommunication = require(__dirname + '/ccu_communication.js')
	   this.ccuIp = ccuip
	   this.communication = new CCUCommunication(this.ccuIp)
	   this.interfaces = []
	   this.devices = []
	   this.channels = []
	   this.dataPoints = []
	   this.variables = []
	   this.defaultTimeOut = 5 
	   this.loadDeviceTimeOut = 10 
	   this.eventInterface = null
	   this.rssiInterface = null
	}
	
	deviceWithID(deviceId) {
		var result;
		this.devices.map(function (device){
			if (device.id==deviceId) {
				result = device;
			}
		})
		return result
	}

	deviceWithAdress(deviceadress) {
		var result;
		this.devices.map(function (device){
			if (device.address==deviceadress) {
				result = device;
			}
		})
		return result
	}
	
	channelWithID(channelId) {
		var result;
		this.channels.map(function (channel){
			if (channel.id==channelId) {
				result = channel;
			}
		})
		return result
	}
	
	interfaceWithID(interfaceId) {
		var result;
		this.interfaces.map(function (ointerface){
			if (ointerface.id==interfaceId) {
				result = ointerface;
			}
		})
		return result
	}
	
	interfaceWithName(interfaceName) {
		var result;
		this.interfaces.map(function (ointerface){
			if (ointerface.name==interfaceName) {
				result = ointerface;
			}
		})
		return result
	}
	
	datapointWithID(datapointId) {
		var result;
		this.dataPoints.map(function (datapoint){
			if (datapoint.id==datapointId) {
				result = datapoint;
			}
		})
		return result
	}
	
	addInterface(interf) {
		let t_intf = this.interfaceWithID(interf.id)
		if (t_intf) {
			let idx = this.interfaces.indexOf(t_intf)
			this.interfaces.splice(idx,1)
		}
		
		// replace xmlrpc just for parsing
		let myUrl = interf.url
		myUrl = myUrl.replace('xmlrpc_bin://', 'http://')
		myUrl = myUrl.replace('xmlrpc://', 'http://')
		let iurl = new URL(myUrl)
		interf.path = iurl.pathname
		interf.host = (iurl.hostname == '127.0.0.1') ? this.ccuIp : iurl.hostname
		interf.port = iurl.port
		this.interfaces.push(interf)
	}
	
	addChannel(channel) {
		// remove old channel
		let t_channel = this.channelWithID(channel.id)
		if (t_channel) {
			let idx = this.channels.indexOf(t_channel)
			this.channels.splice(idx,1)
		}
		this.channels.push(channel)
	}
	
	
	addDatapoint(datapoint) {
		// remove old dp
		let t_datapoint = this.datapointWithID(datapoint.id)
		if (t_datapoint) {
			let idx = this.dataPoints.indexOf(t_datapoint)
			this.dataPoints.splice(idx,1)
		}
		this.dataPoints.push(datapoint)
	}
	
	variableWithName(varname) {
		var result;
		this.variables.map(function (variable){
			if (variable.name==varname) {
				result = variable;
			}
		})
		return result
	}
	
	setHost(hostname) {
		// Kill all stored data	
	   this.ccuIp = hostname
	   this.communication.ccuIp = hostname
	   this.interfaces = []
	   this.devices = []
	   this.channels = []
	   this.dataPoints = []
	   this.variables = []
	   this.defaultTimeOut = 5 
	   this.loadDeviceTimeOut = 10 
	   this.eventInterface = null
	   this.rssiInterface = null
	}
	
	loadRssiValues(callback) {
		// Make sure we have some Devices	
		var that = this	
		if (this.devices.length==0) {
			this.loadDevices(function(){
				that.loadRssiValuesInt(callback)
			})
		} else {
			this.loadRssiValuesInt(callback)
		}
	}
	
	loadRssiValuesInt(callback) {
		switch (this.rssiInterface.name) {
			case 'BidCos-RF':
			 this.loadRssiValuesBidCos(callback)	
			 break;		
			case 'HmIP-RF':
			 this.loadRssiValuesHMIP(callback)	
			 break;		
		}
	}
	
	loadRssiValuesBidCos(callback) {
		console.log('Load BidCos-RF rssi')
		var that = this
		if (this.rssiInterface) {
		this.communication.sendInterfaceCommand(this.rssiInterface,'rssiInfo',[],function(error,result){
			
			if (!error) {
				
				var adrs = Object.keys(result)
				
				adrs.map(function(devAdr){
					var device = that.deviceWithAdress(devAdr)
					if (device) {
						device.rssi = []
						var gate = result[devAdr]
						Object.keys(gate).map(function(gateAdr){
							var info = gate[gateAdr]
							device.rssi.push({'p':gateAdr,'db_in':info[0],'db_out':info[1]})
						})
					}
				})
				callback(error)
			} else {
				callback(error)
			}
		})
	    }
	}
	
	
	loadRssiValuesHMIP(callback) {
		// loop thru all Devices
		var that = this
		this.devices.map(function(device){
			device.rssi = []
			if (device.interf === 'HmIP-RF') {
				that.communication.sendInterfaceCommand(that.rssiInterface,'getParamset',[device.address + ':0','VALUES'],function(error,result){
					device.rssi.push({'p':'','db_in':result.RSSI_DEVICE || 65536,'db_out':result.RSSI_PEER || 65536})
					ipc.send('refresh_rssi_panel','')
				})
			}
		})
	}
	
	loadDutyCycle(bcintf,callback) {
		
		this.communication.sendInterfaceCommand(bcintf,'listBidcosInterfaces',[],function(error,result){
			
			if (!error) {
				callback(result)
			} else {
				callback(error)
			}
		})
	}
	
	
	loadInterfaces(callback) {
		var that = this
		let script = 'string sifId;boolean df = true;Write(\'{"interfaces":[\');foreach(sifId, root.Interfaces().EnumIDs()){object oIf = dom.GetObject(sifId);if(df) {df = false;} else { Write(\',\');}Write(\'{\')'

		script = script + this.scriptPartForElement('id','sifId',',');
		script = script + this.scriptPartForElement('name','oIf.Name()',',');
		script = script + this.scriptPartForElement('type','oIf.Type()',',');
		script = script + this.scriptPartForElement('typename','oIf.TypeName()',',');
		script = script + this.scriptPartForElement('info','oIf.InterfaceInfo()',',');
		script = script + this.scriptPartForElement('url','oIf.InterfaceUrl()');
		
		script = script +'Write(\'}\');} Write(\']}\');';
		
		this.sendScript(script,this.defaultTimeOut,function(result){
			try {
				let json = JSON.parse(result)
				json.interfaces.map(function(interfc){
					that.addInterface(interfc)
				})
				if (callback) {
					callback()
				}
	      } catch (e) {
		    console.error(e)
		  }
		})		
	}
	
	loadVariables(callback) {
		var that = this
		let script = 'string varid;boolean df = true;Write(\'{"variables":[\');foreach(varid, dom.GetObject(ID_SYSTEM_VARIABLES).EnumIDs()){object ovar = dom.GetObject(varid);if(df) {df = false;} else { Write(\',\');}Write(\'{\')'
		
		script = script + this.scriptPartForElement('id','varid',',');
		script = script + this.scriptPartForElement('name','ovar.Name()',',');
		script = script + this.scriptPartForElement('dpInfo','ovar.DPInfo()',',');
		script = script + this.scriptPartForElement('unerasable','ovar.Unerasable()',',');
		script = script + this.scriptPartForElement('valuetype','ovar.ValueType()',',');
		script = script + this.scriptPartForElement('subtype','ovar.ValueSubType()',',');
		script = script + this.scriptPartForElement('unit','ovar.ValueUnit()',',');
		script = script + this.scriptPartForElement('valname0','ovar.ValueName0()',',');
		script = script + this.scriptPartForElement('valname1','ovar.ValueName1()',',');
		script = script + this.scriptPartForElement('vallist','ovar.ValueList()',',');
		script = script + this.scriptPartForElement('min','ovar.ValueMin()',',');
		script = script + this.scriptPartForElement('max','ovar.ValueMax()',',');
		script = script + this.scriptPartForElement('chnl','ovar.Channel()');
		
		script = script +'Write(\'}\');} Write(\']}\');';
		
		this.sendScript(script,this.loadDeviceTimeOut,function(result){
			try {
				let json = JSON.parse(result)
				that.variables = json.variables
				if (callback) {
					callback()
				}
	      } catch (e) {
		    console.error(e)
		  }
		})	
	}

	
	loadDevices(callback) {
		var that = this
		let script = 'string sDeviceId;string sChannelId;boolean df = true;Write(\'{"devices":[\');foreach(sDeviceId, root.Devices().EnumIDs()){object oDevice = dom.GetObject(sDeviceId);if(oDevice){var oInterface = dom.GetObject(oDevice.Interface());if(df) {df = false;} else { Write(\',\');}Write(\'{\')'
		
		
		script = script + this.scriptPartForElement('id','sDeviceId',',');
		script = script + this.scriptPartForElement('name','oDevice.Name()',',');
		script = script + this.scriptPartForElement('address','oDevice.Address()',',');
		script = script + this.scriptPartForElement('type','oDevice.HssType()',',');
		script = script + this.scriptPartForElement('creatingCompleted','oDevice.CreatingCompleted()',',');
		script = script + this.scriptPartForElement('enabled','oDevice.Enabled()',',');
		script = script + this.scriptPartForElement('internal','oDevice.Internal()',',');
		script = script + this.scriptPartForElement('readyConfig','oDevice.ReadyConfig()',',');
		script = script + this.scriptPartForElement('readyConfigChannels','oDevice.ReadyConfigChns()',',');
		script = script + this.scriptPartForElement('locked','oDevice.Unerasable()',',');
		script = script + this.scriptPartForElement('visible','oDevice.Visible()',',');
		script = script + this.scriptPartForElement('used','oDevice.Used()',',');
		script = script + this.scriptPartForElement('interf','oInterface');

		script = script +'Write(\'}\');}}Write(\']}\');';

		this.sendScript(script,this.loadDeviceTimeOut,function(result){
			try {
				let json = JSON.parse(result)
				that.devices = json.devices
				if (callback) {
					callback()
				}
	      } catch (e) {
		    console.error(e)
		  }
		})		
	}
	
	loadChannels(device,callback) {
		
		let script = 'var oDevice = dom.GetObject(' + device.id +');string sChannelId;var oInterface = dom.GetObject(oDevice.Interface());Write(\'{"channels": [\');boolean bcf = true;foreach(sChannelId, oDevice.Channels().EnumIDs()){object oChannel = dom.GetObject(sChannelId);if(bcf) {bcf = false;} else {Write(\',\');}Write(\'{\');'
		
		script = script + this.scriptPartForElement('id','sChannelId',',');
		script = script + this.scriptPartForElement('name','oChannel.Name()',',');
		script = script + 'if (oInterface) {'
		script = script + this.scriptPartForElement('intf','oInterface.Name()',',');
		script = script + this.scriptPartForElement('address','oInterface.Name() #\'.\'\ # oChannel.Address()',',');
		script = script + '}'
		script = script + this.scriptPartForElement('type','oChannel.HssType()',',');
		script = script + this.scriptPartForElement('access','oChannel.UserAccessRights(iulOtherThanAdmin)',',');
		script = script + this.scriptPartForElement('enabled','oChannel.Enabled()');
		
		script = script + 'Write(\'}\');}Write(\']}\');'
		var that = this
		this.sendScript(script,this.defaultTimeOut,function(result){
			try {
				let json = JSON.parse(result)
				device.channels = json.channels
				json.channels.map(function(channel){
					that.addChannel(channel)
				})
				if (callback) {
					callback()
				}
	      } catch (e) {
		    console.error(e)
		  }
		})		
		
	}

	loadDataPoints(channel,callback) {
		
		let script = 'var oChannel = dom.GetObject(' + channel.id +');string sDpId;var oInterface = dom.GetObject(oChannel.Interface());Write(\'{"datapoints": [\');boolean bcf = true;foreach(sDpId, oChannel.DPs().EnumIDs()){object oDP = dom.GetObject(sDpId);if(bcf) {bcf = false;} else {Write(\',\');}Write(\'{\');'
		
		script = script + this.scriptPartForElement('id','sDpId',',');
		script = script + this.scriptPartForElement('name','oDP.Name()',',');
		script = script + 'if (oInterface) {'
		script = script + this.scriptPartForElement('intf','oInterface.Name()',',');
		script = script + '}'
		script = script + this.scriptPartForElement('type','oDP.TypeName()',',');
		script = script + this.scriptPartForElement('operations','oDP.Operations()',',');
		script = script + this.scriptPartForElement('valueType','oDP.ValueType()',',');
		script = script + this.scriptPartForElement('valueUnit','oDP.ValueUnit().ToString()',',');
		script = script + this.scriptPartForElement('archive','oDP.DPArchive()');
		
		script = script + 'Write(\'}\');}Write(\']}\');'
		var that = this
		this.sendScript(script,this.defaultTimeOut,function(result){
			try {
				let json = JSON.parse(result)
				channel.datapoints = json.datapoints
				json.datapoints.map(function (datapoint){
					that.addDatapoint(datapoint)
				})
				if (callback) {
					callback()
				}
	      } catch (e) {
		    console.error(e)
		  }
		})		
		
	}

    testScript(script,callback) {
	    script = script.split('\'').join('\\\'');
	    let command = 'var tx = \'' + script + '\'; Write( system.SyntaxCheck(tx, \'\', \'\',\'\'));';
	    this.communication.sendRegaCommand(command,this.defaultTimeOut,function(result,variables){
		try {
		   if (callback) {
				callback(result,variables)
		   }
	      } catch (e) {
		    console.error(e)
		  }
		})	
    }

    sendScript(script,timeout,callback) {
	   
	   this.communication.sendRegaCommand(script,timeout,function(result,variables,error){
		if (!error) {
		try {
		   if (callback) {
				callback(result,variables)
		   }
	      } catch (e) {
		    console.error(e)
		  }
		} else {
			console.log("Communication Error")
			ipc.send('http_error',error)
		}
		})		
	}
	
	
	sendScriptAndParseAll(script,timeout,callback) {   
	   this.sendScript(script,timeout,function(result,variables){
		   var parseString = require('xml2js').parseString;
		   parseString(variables, function (err, vresult) {
	 		callback(result,vresult.xml)
		   })
	   })
	}

 

	
	scriptPartForElement(elementName,functionName,leadingComa='') {
		return 'Write(\'"'+elementName+'": "\' # '+functionName+' # \'"'+leadingComa+'\');'
	}
	
	
	strValueForOperations(operation) {
		var result = ''
		if ((operation & 1)==1) {result = result + 'READ '}
		if ((operation & 2)==2) {result = result + 'WRITE '}
		if ((operation & 4)==4) {result = result + 'EVENT '}
		return '(' + result + ')'
	}

	strValueForValueType(valueType) {
		switch (valueType) {
			case '2' :
				return '(ivtBinary)'
				break
			case '4' : 
				return '(ivtFloat)'
				break
			case '16' :
				return '(ivtInteger)'
				break
			case '20' :
				return '(ivtString)'
				break
		}
	}

	strValueForVarSubType(subtype) {
		switch (parseInt(subtype)) {
		   	case 23:
		   		return 'Anwesenheit'
		   		break
		   	case 6:
		   		return 'Alarm'
		   		break
		   	case 0:
		   	    return 'Zahl'
		   	    break
		   	case 2:
		   		return 'Logikwert'
		   		break
		   	case 29:
		   		return 'Werteliste'
		   		break
		   	case 11:
		   		return 'Zeichenkette'
		   		break	
	   	}
		return 'keiner'		
	}

	attacheToInterface(intf,callback) {
		this.communication.initRPCServer(intf,callback)
	}
	
	detacheFromInterface(intf,callback) {
		this.communication.killRPCServer(intf,callback)
	}
}

module.exports = CCU;