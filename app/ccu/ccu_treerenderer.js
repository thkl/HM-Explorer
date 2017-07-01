(function () {'use strict';

var brightwheel = require('brightwheel');

const ipc = require('electron').ipcRenderer;
const fs = require('fs');

class CCUTreeRenderer {
	

   constructor(ccuip,ccu) {
	   this.ccu = ccu;
	   this.ccuIP = ccuip;
	   this.images = require('../ui/icons.js').icons;
   }
   
   
    renderInterfaces(rootElement) {
	   var that = this;
	   var listItems = [];
	   if ((this.ccu) && (this.ccu.interfaces)) {
	   		this.ccu.interfaces.map(function(ointerface){
	   		
	   			let deviceItem = new brightwheel.ListGroupItem({
	   				active: false,
	   				attributes: {
	   					id: 'inf-' + ointerface.id
  					},
  					classNames: ['my-class'],
  					header: false
				}, [new brightwheel.Label({attributes: {id: 'ilb-' + ointerface.id},text: ointerface.name}, [])]
				);
				
				listItems.push(deviceItem);
		    });
			
			let myList = new brightwheel.ListGroup({
				attributes: {
				id: 'group-interface'
	   		},
	   		classNames: ['device-class'],
	   		}, listItems);


	   var myNode = document.querySelector(rootElement);
	   
	   while (myNode.firstChild) {
	   	myNode.removeChild(myNode.firstChild);
	   }
	   
	   myNode.appendChild(myList.element);
	   
	   myList.element.addEventListener('click', function(event){
		   
		   if ((event.target.id.indexOf('inf-')>-1) || (event.target.id.indexOf('ilb-')>-1)) {
			   let id = event.target.id.substr(4);
			   let tabLine = 'inf-'+id;			   
			   let array = Array.from(myList.element.childNodes);
			   		array.map(function(node){
			   		if (node.id == tabLine) {
						node.classList.add('active');					
					} else {
   				    	node.classList.remove('active');
					}		  
				});
			   
			   ipc.send('show_interface', id);
		   }
	   });
	   this.renderScriptMethodTestResult(undefined,undefined);
	}
   }

   interfaceInfo(intf) {
	   var propElements = []; 
	   propElements.push({property:"ID",value:intf.id});
	   propElements.push({property:"Name",value:intf.name});
	   propElements.push({property:"Typ",value:intf.type});
	   propElements.push({property:"Typname",value:intf.typename});
	   propElements.push({property:"Info",value:intf.info});
	   propElements.push({property:"URL",value:intf.url});
	   
	   let propTable = new brightwheel.Table({attributes: {id: 'table-' + intf.id},classNames: ['my-class'],striped: true},propElements );
	   document.querySelector("#properties_label").innerHTML = "Details Interface " + intf.name;

	   let myTable = this.clearElement("#element_properties");
	   myTable.appendChild(propTable.element);
	   this.renderCommandScreen('Methoden des Interface Objektes','dom.GetObject('+intf.id+')',['common','interface']);
	   this.renderScriptMethodTestResult(undefined,undefined);
   }


   renderDevices(rootElement) {
	   var that = this;
	   var listItems = [];
	   if ((this.ccu) && (this.ccu.devices)) {
	   		this.ccu.devices.map(function(device){
	   			var icon = that.getIcon(device.type);
	   		
	   			let deviceItem = new brightwheel.ListGroupItem({
	   				active: false,
	   				attributes: {
	   					id: 'device-' + device.id
  					},
  					classNames: ['my-class'],
  					header: false
				}, [new brightwheel.Image({attributes: {id: 'dev_im-' + device.id},isMediaObject: true,pull: 'left', shape: 'rounded',
					src: icon,width:'32',height:'32'}, []),
					new brightwheel.Label({attributes: {id: 'dev_lb-' + device.id},text: device.name}, [])]
				);
				
				listItems.push(deviceItem);
		    });
			
			let myList = new brightwheel.ListGroup({
				attributes: {
				id: 'group-device'
	   		},
	   		classNames: ['device-class'],
	   		}, listItems);


	   var myNode = document.querySelector(rootElement);
	   
	   while (myNode.firstChild) {
	   	myNode.removeChild(myNode.firstChild);
	   }
	   
	   myNode.appendChild(myList.element);
	   
	   myList.element.addEventListener('click', function(event){
		   
		   if ((event.target.id.indexOf('device-')>-1) || (event.target.id.indexOf('dev_lb-')>-1) || (event.target.id.indexOf('dev_im-')>-1) ) {
			   let id = event.target.id.substr(7);
			   let tabLine = 'device-'+id;			   
			   let array = Array.from(myList.element.childNodes);
			   		array.map(function(node){
			   		if (node.id == tabLine) {
						node.classList.add('active');					
					} else {
   				    	node.classList.remove('active');
					}		  
				});
			   
			   ipc.send('show_device', id);
		   }
	   });
	   this.renderScriptMethodTestResult(undefined,undefined);
	}
   }

   renderChannels(device,rootElement) {
	   var newTree = '';
	   var that = this;
	   
	   var listItems = [];
	   	   
	   if ((device) && (device.channels)) {
	   		device.channels.map(function(channel){

	   			let channelItem = new brightwheel.ListGroupItem({
	   				active: false,
	   				attributes: {
	   					id: 'channel-' + channel.id
  					},
  					classNames: ['my-class'],
  					header: false
				}, [new brightwheel.Label({attributes: {id: 'chan_lb-' + channel.id},text: channel.name}, [])]
				);
				
				listItems.push(channelItem);
		    });
			
			let myList = new brightwheel.ListGroup({
				attributes: {
				id: 'group-channel'
	   		},
	   		classNames: ['channel-class'],
	   		}, listItems);

	   // Render Description Box
	   
	   var propElements = [];
	   
	   propElements.push({property:"ID",value:device.id});
	   propElements.push({property:"Name",value:device.name});
	   propElements.push({property:"Typ",value:device.type});
	   propElements.push({property:"Adresse",value:device.address});
	   propElements.push({property:"Erstellt",value:device.creatingCompleted});
	   propElements.push({property:"aktiv",value:device.enabled});
	   propElements.push({property:"Intern",value:device.internal});
	   propElements.push({property:"Geraet konfiguriert",value:device.readyConfig});
	   propElements.push({property:"Kanaele konfiguriert",value:device.readyConfigChannels});
	   propElements.push({property:"Gesperrt",value:device.locked});
	   propElements.push({property:"Sichtbar",value:device.visible});
	   propElements.push({property:"In Benutzung",value:device.used});

	   let propTable = new brightwheel.Table({attributes: {id: 'table-' + device.id},classNames: ['my-class'],striped: true},propElements );
	   document.querySelector("#properties_label").innerHTML = "Details Ger&auml;t " + device.name;

	   let myTable = this.clearElement("#element_properties");
	   myTable.appendChild(propTable.element);
	   
	   let myNode = this.clearElement(rootElement);
	   myNode.appendChild(myList.element);
	   
	   myList.element.addEventListener('click', function(event){
		   if ((event.target.id.indexOf('channel-')>-1) || (event.target.id.indexOf('chan_lb-')>-1)) {
			   
			   let id = event.target.id.substr(8);
			   let tabLine = 'channel-'+id;	

			   let array = Array.from(myList.element.childNodes);
			   		array.map(function(node){
			   		if (node.id == tabLine) {
						node.classList.add('active');					
					} else {
   				    	node.classList.remove('active');
					}		  
				});

			   ipc.send('show_channel', id);
		   }

	   });
	   this.renderCommandScreen('Methoden des Device Objektes','dom.GetObject('+device.id+')',['common','device']);
	   this.renderScriptMethodTestResult(undefined,undefined);
	}
   }

   dataPointInfo(dp) {
	   var propElements = []; 
	   let strOperations = this.ccu.strValueForOperations(dp.operations);
	   let strValueType = this.ccu.strValueForValueType(dp.valueType);
	   
	   propElements.push({property:"ID",value:dp.id});
	   propElements.push({property:"Name",value:dp.name});
	   propElements.push({property:"Typ",value:dp.type});
	   propElements.push({property:"Operationen",value:dp.operations + ' ' + strOperations});
	   propElements.push({property:"Wertetyp",value:dp.valueType + ' ' + strValueType});
	   propElements.push({property:"Einheit",value:dp.valueUnit});
	   propElements.push({property:"Protokoliert",value:dp.archive});
	   
	   let propTable = new brightwheel.Table({attributes: {id: 'table-' + dp.id},classNames: ['my-class'],striped: true},propElements );
	   document.querySelector("#properties_label").innerHTML = "Details Datenpunkt " + dp.name;

	   let myTable = this.clearElement("#element_properties");
	   myTable.appendChild(propTable.element);
	   
	   this.renderCommandScreen('Methoden des Datapoint Objektes','dom.GetObject('+dp.id+')',['common','datapoint']);
	   this.renderScriptMethodTestResult(undefined,undefined);
   }


   renderDatapoints(channel,rootElement) {
	   var that = this;
	   
	   var listItems = [];
	   	   
	   if ((channel) && (channel.datapoints)) {
	   		channel.datapoints.map(function(datapoint){

	   			let datapointItem = new brightwheel.ListGroupItem({
	   				active: false,
	   				attributes: {
	   					id: 'datapoint-' + datapoint.id
  					},
  					classNames: ['my-class'],
  					header: false
				}, [new brightwheel.Label({attributes: {id: 'datapo_lb-' + datapoint.id},text: datapoint.name}, [])]
				);
				
				listItems.push(datapointItem);
		    });
			
			let myList = new brightwheel.ListGroup({
				attributes: {
				id: 'group-datapoint'
	   		},
	   		classNames: ['datapoint-class'],
	   		}, listItems);

	   // Render Description Box
	   
	   var propElements = [];
	   
	   propElements.push({property:"ID",value:channel.id});
	   propElements.push({property:"Name",value:channel.name});
	   propElements.push({property:"Typ",value:channel.type});
	   propElements.push({property:"Adresse",value:channel.address});

	   let propTable = new brightwheel.Table({attributes: {id: 'table-' + channel.id},classNames: ['my-class'],striped: true},propElements );
	   
	   document.querySelector("#properties_label").innerHTML = "Details Kanal " + channel.name;

	   let myTable = this.clearElement("#element_properties");
	   myTable.appendChild(propTable.element);
	   
	   let myNode = this.clearElement(rootElement);
	   myNode.appendChild(myList.element);
	   
	   myList.element.addEventListener('click', function(event){
		   if ((event.target.id.indexOf('datapoint-')>-1) || (event.target.id.indexOf('datapo_lb-')>-1)) {
			   
			   let id = event.target.id.substr(10);
			   let tabLine = 'datapoint-'+id;	

			   let array = Array.from(myList.element.childNodes);
			   		array.map(function(node){
			   		if (node.id == tabLine) {
						node.classList.add('active');					
					} else {
   				    	node.classList.remove('active');
					}		  
				});
			   ipc.send('show_datapoint', id);
		   }

	   });
	   this.renderCommandScreen('Methoden des Channel Objektes','dom.GetObject('+channel.id+')',['common','channel']);
	   this.renderScriptMethodTestResult(undefined,undefined);
	} else {
	   let myNode = this.clearElement(rootElement);
	   
	}
   }

   clearElement(elementName) {
	 var myNode = document.querySelector(elementName);
	   while (myNode.firstChild) {
	   	myNode.removeChild(myNode.firstChild);
	 }
	 return myNode  
   }
   
   getIcon(type) {
     let icon = this.images[type];
     if (icon==undefined) {
	     icon = 'unknown_device_thumb.png';
     }
     return 'http://' +  this.ccuIP +'/config/img/devices/50/'+ icon
   }
   
   renderScriptOutput(result,variables) {

	   document.querySelector("#script-response").value = result;
	   var varElements = [];
	   
	   varElements.push({'Variable':'','Wert':''});
	   
	   Object.keys(variables).map(function(key) {
		   let vv = variables[key];
		   
		   if ((key != 'exec') && (key != 'sessionId') && (key != 'httpUserAgent'))
		   {
		   		varElements.push({'Variable':key,'Wert':(vv)?vv[0]:'null'});
		   }	   
	   });
	   
	   let varTable = new brightwheel.Table({attributes: {id: 'table-var'},classNames: ['my-class'],striped: true},varElements);
	   var table = document.querySelector("#table-var");
	   var tabRoot = table.parentNode;
	   tabRoot.removeChild(table);
	   tabRoot.appendChild(varTable.element);

   }
   
   
    renderDCInfo(rootElement,dcinfo) {
	   var dcElements = []; 
	   var dcElements = []; 
	   
	   dcinfo.map(function(oDcInfo){
		   dcElements.push({'Adresse':oDcInfo.ADDRESS,'Duty Cycle':oDcInfo.DUTY_CYCLE});
	   });
	   let propTable = new brightwheel.Table({attributes: {id: 'table-dc' },classNames: ['my-class'],striped: true},dcElements );
	   this.clearCommandScreen();
	   let myTable = this.clearElement(rootElement);
	   myTable.appendChild(propTable.element);
	}
   
   
   renderRssiInfo(rootElement,sortby='Geraet',order=0) {
	   var rssiElements = []; 
	   var that = this;
	   this.ccu.devices.map(function(device){
		   if (device.rssi) {
			   
			device.rssi.map(function(rssiInfo) {
			   
			   var pDevice = that.ccu.deviceWithAdress(rssiInfo.p);
			   
			   var inClass = 'green';
			   var outClass = 'green';
			   
			   if (rssiInfo.db_in<-100) {inClass = 'yellow';}
			   if (rssiInfo.db_out<-100) {outClass = 'yellow';}
			   if (rssiInfo.db_in<-120) {inClass = 'red';}
			   if (rssiInfo.db_out<-120) {outClass = 'red';}
			   if (rssiInfo.db_in === 65536) {inClass = 'gray';}
			   if (rssiInfo.db_out === 65536) {outClass = 'gray';}
			   
			   rssiElements.push({'Geraet':device.name ,
				   'Adresse':  device.address,
				   'Partner': (pDevice) ? pDevice.name + ' (' + pDevice.address + ')' : rssiInfo.p,
				   'In':{attributes:{className:inClass},text:rssiInfo.db_in},
				   'Out':{attributes:{className:outClass},text:rssiInfo.db_out}});
		   	});
		   }
	   });
	   // Sort 
		rssiElements = rssiElements.sort(
			function (a, b) {
				var checkA = a[sortby];
				var checkB = b[sortby];
				
				if (checkA instanceof Object) {checkA = checkA.text;}
				if (checkB instanceof Object) {checkB = checkB.text;}
				
				if ((checkA.constructor.name === 'String') && (checkB.constructor.name === 'String')) {
				    
					if (checkA.toUpperCase() < checkB.toUpperCase()) {
		   				return (order == 0) ? -1 : 1;
  					}
  					
  					if (checkA.toUpperCase() > checkB.toUpperCase() ) {
		   				return (order == 0) ? 1 : -1;
  		   			}
  		   			return 0;
				
				} else {
					
					if (parseInt(checkA) < parseInt(checkB)) {
		   				return (order==0)? -1: 1;
  					}
  					
  					if (parseInt(checkA) > parseInt(checkB)) {
  						return (order==0)? 1: -1;
  		   			}
  		   			return 0;
			    }

			
  		   		});
		
	   // Replace In Out 65536 with  'k.Info'
	   
	   rssiElements.map(function (element){
	   		if (element['In'].text==65536) {element['In'].text='k.Info';}
	   		if (element['Out'].text==65536) {element['Out'].text='k.Info';}
	   });
	   
	   let propTable = new brightwheel.Table({attributes: {id: 'rssi-table'},classNames: ['my-class'],striped: true},rssiElements);
	   
	   let myTable = this.clearElement(rootElement);
	   myTable.appendChild(propTable.element);
	   
	   let sortEventListener = function(event){
		   // remove Listener to prevent infinity loop 
		    if (event.target.id.indexOf('th_rssi')>-1) {
	        myTable.removeEventListener('click',sortEventListener);
		    switch (event.target.id) {
			    case 'th_rssi-table_0':
			        that.renderRssiInfo(rootElement,'Geraet',(order==0)?1:0);
					break;
			    case 'th_rssi-table_1':
			        that.renderRssiInfo(rootElement,'Adresse',(order==0)?1:0);
					break;
			    case 'th_rssi-table_2':
			        that.renderRssiInfo(rootElement,'Partner',(order==0)?1:0);
					break;
			    case 'th_rssi-table_3':
			        that.renderRssiInfo(rootElement,'In',(order==0)?1:0);
					break;
			    case 'th_rssi-table_4':
			        that.renderRssiInfo(rootElement,'Out',(order==0)?1:0);
					break;
		    }
		    }
	   };
	   
	   myTable.addEventListener('click',sortEventListener );	
	   this.clearCommandScreen();
   }

  clearCommandScreen() {
  	this.clearElement('#element_action');
 	document.querySelector("#action_label").innerHTML = "";
 	this.renderScriptMethodTestResult(undefined,undefined);
  }

  renderCommandScreen(strlabel,prefix,elements) {
	  // first check if we have commands to show
	  let buffer = fs.readFileSync(__dirname + '/action.json');
 	  let actions = JSON.parse(buffer.toString());
 	  var methodItems = [];
 	  document.querySelector("#action_label").innerHTML = strlabel;
 	  
 	  elements.map(function(element){
	 	  let methods = actions[element];
	 	  if (methods) {
	 	  methods.map(function(method){
	 	  	Object.keys(method).map(function (methodname) {
		 	  	// we have to use id for that cause i was not able to use data- attributes with etch
		 	 	methodItems.push(
		 	 		{'Methode':{attributes:{'id':'0_' + methodname},text:methodname},
				    'Beschreibung':{attributes:{'id':'1_'+ methodname},text:method[methodname]}});		 	  
			});
		  });
		  }
 	  });
 	  let myAction = this.clearElement('#element_action');
	  let table = new brightwheel.Table({attributes: {id: 'method-table',style:'overflow-y: scroll'},classNames: ['my-class'],striped: true},methodItems);
	  let te = table.element; 
	  te.addEventListener('click', function(event){
		  let colid = event.target.id;
		  if ((colid.indexOf('0_')>-1) || (colid.indexOf('1_')>-1)) {
			  // User has clicked on a row so build the right method command and send back to the main process to run
			 let cmd = ((prefix.length>0) ? 'var testObject = ' + prefix:'') + colid.substr(2) +  ';';
			 ipc.send('describe_function',cmd);
		  }
		  else {
			  console.log("Click at %s",event.target);
		  }
	  });			
	 			
	  myAction.appendChild(te);
  }

  renderScriptMethodTestResult(script,result) {
	  let myLabel = this.clearElement('#method_label');
	  let myPane = this.clearElement('#method_result');
	  let text = '';
	  
	  if (script) {
		  myLabel.innerHTML = 'Test';
		  text = text + 'Script :\n' + script + '\n';
	  } else {
		  myLabel.innerHTML = '';
		  return 
	  }
	  if (result) {
		 text = text +'------------\nAntwort der CCU : '  + result;
	  }
	  // Build TextBox
	  let myTextarea = new brightwheel.Textarea({attributes: {id: 'area-testoutput',rows:6},
	  	classNames: ['my-class'],
	  	text: text
	  }, []);
	  myPane.appendChild(myTextarea.element);
	  
	  let copyButton = new brightwheel.Button({attributes: {id: 'copyButton',style:'float: left;'},classNames: ['active'],
			size: 'large',  
			text: 'Kopiere ' + script,  type: 'default'}, []);
	  
	  copyButton.element.addEventListener('click', function(event){
         ipc.send('send_clipboard',script);
      });	
	  
	  myPane.appendChild(copyButton.element);
  }
 
  renderVariables(rootElement,sortby='Id',order=0) {
	   var varElements = []; 
	   var that = this;
	   this.ccu.variables.map(function(variable){

	   		var strValueType = 'unbekannt';
	   		var strValueSubType = 'unbekannt';
	   		
	   		switch (parseInt(variable.valuetype)) {
		   		case 2: 
		   			strValueType = 'binaer';
		   		break;
		   		case 4: 
		   			strValueType = 'Fliesskommazahl';
		   		break;
		   		case 16: 
		   			strValueType = 'Zahl';
		   		break;
		   		case 20: 
		   			strValueType = 'Text';
		   		break;
		   		
	   		}
	   		
	   		switch (parseInt(variable.subtype)) {
		   		case 23:
		   		   strValueSubType = 'Anwesenheit';
		   		   break;
		   		case 6:
		   		   strValueSubType = 'Alarm';
		   		   break;
		   		case 0:
		   		   strValueSubType = 'Zahl';
		   		   break;
		   		case 2:
		   		   strValueSubType = 'Logicwert';
		   		   break;
		   		case 29:
		   		   strValueSubType = 'Werteliste';
		   		   break;
		   		case 11:
		   		   strValueSubType = 'Zeichenkette';
		   		   break;
		   		
	   		}

			varElements.push({
				   'Id':{attributes:{'id':'0_' + variable.name}, text:parseInt(variable.id)},
				   'Name':{attributes:{'id':'1_' + variable.name}, text:variable.name},
				   'Typ': {attributes:{'id':'2_' + variable.name}, text:strValueType},
				   'SubTyp': {attributes:{'id':'3_' + variable.name}, text:strValueSubType},
				   'Unit':{attributes:{'id':'4_' + variable.name},text:variable.unit},
				   'Werteliste':{attributes:{'id':'5_' + variable.name}, text:variable.vallist}});
			});
	   
	   
	   // Sort 
		varElements = varElements.sort(
			function (a, b) {
				var checkA = a[sortby];
				var checkB = b[sortby];
				
				if (checkA instanceof Object) {checkA = checkA.text;}
				if (checkB instanceof Object) {checkB = checkB.text;}
				
				if ((checkA.constructor.name === 'String') && (checkB.constructor.name === 'String')) {
				    
					if (checkA.toUpperCase() < checkB.toUpperCase()) {
		   				return (order == 0) ? -1 : 1;
  					}
  					
  					if (checkA.toUpperCase() > checkB.toUpperCase() ) {
		   				return (order == 0) ? 1 : -1;
  		   			}
  		   			return 0;
				
				} else {
					
					if (parseInt(checkA) < parseInt(checkB)) {
		   				return (order==0)? -1: 1;
  					}
  					
  					if (parseInt(checkA) > parseInt(checkB)) {
  						return (order==0)? 1: -1;
  		   			}
  		   			return 0;
			    }

			
  		   		});
	   
	   
	   let propTable = new brightwheel.Table({attributes: {id: 'variable-table'},classNames: ['my-class'],striped: true},varElements);
	   let myTable = this.clearElement(rootElement);
	   myTable.appendChild(propTable.element);
	   
	   let sortEventListener = function(event){
		   // remove Listener to prevent infinity loop 
		    let colid = event.target.id;
		    
		    if (colid.indexOf('th_variable-table')>-1) {
	        myTable.removeEventListener('click',sortEventListener);
		    switch (event.target.id) {
			    case 'th_variable-table_0':
			        that.renderVariables(rootElement,'Id',(order==0)?1:0);
					break;
			    case 'th_variable-table_1':
			        that.renderVariables(rootElement,'Name',(order==0)?1:0);
					break;
			    case 'th_variable-table_2':
			        that.renderVariables(rootElement,'Typ',(order==0)?1:0);
					break;
			    case 'th_variable-table_3':
			        that.renderVariables(rootElement,'SubTyp',(order==0)?1:0);
					break;
			    case 'th_variable-table_4':
			        that.renderVariables(rootElement,'Unit',(order==0)?1:0);
					break;
		    }
		    }
		    		 
			if ((colid.indexOf('0_')>-1) || (colid.indexOf('1_')>-1) ||
		  		(colid.indexOf('2_')>-1) || (colid.indexOf('3_')>-1) || 
		  		(colid.indexOf('4_')>-1) || (colid.indexOf('5_')>-1)) {
		  		let selectedVariable = colid.substr(2);
		  		that.renderCommandScreen('Methoden des Variablen Objektes ' + selectedVariable,'dom.GetObject(ID_SYSTEM_VARIABLES).Get("'+
		  		selectedVariable +'")',['common','variable']);
		  	}
	   };
	   
	   myTable.addEventListener('click',sortEventListener );	
	   this.renderCommandScreen('Methoden des Variablen Objektes','dom.GetObject(ID_SYSTEM_VARIABLES).Get("Variablename")',['common','variable']);
       this.renderScriptMethodTestResult(undefined,undefined);
   }

}
	
module.exports = CCUTreeRenderer;

}());
//# sourceMappingURL=ccu_treerenderer.js.map