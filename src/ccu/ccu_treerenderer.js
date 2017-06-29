import { ListGroup,ListGroupItem,Label,Image,Table,Button,FormGroup } from 'brightwheel'
const ipc = require('electron').ipcRenderer

class CCUTreeRenderer {
	

   constructor(ccuip,ccu) {
	   this.ccu = ccu;
	   this.ccuIP = ccuip;
	   this.images = require('../ui/icons.js').icons
   }
   
   
    renderInterfaces(rootElement) {
	   var that = this
	   var listItems = [];
	   if ((this.ccu) && (this.ccu.interfaces)) {
	   		this.ccu.interfaces.map(function(ointerface){
	   		
	   			let deviceItem = new ListGroupItem({
	   				active: false,
	   				attributes: {
	   					id: 'inf-' + ointerface.id
  					},
  					classNames: ['my-class'],
  					header: false
				}, [new Label({attributes: {id: 'ilb-' + ointerface.id},text: ointerface.name}, [])]
				)
				
				listItems.push(deviceItem)
		    })
			
			let myList = new ListGroup({
				attributes: {
				id: 'group-interface'
	   		},
	   		classNames: ['device-class'],
	   		}, listItems)


	   var myNode = document.querySelector(rootElement);
	   
	   while (myNode.firstChild) {
	   	myNode.removeChild(myNode.firstChild);
	   }
	   
	   myNode.appendChild(myList.element);
	   
	   myList.element.addEventListener('click', function(event){
		   
		   if ((event.target.id.indexOf('inf-')>-1) || (event.target.id.indexOf('ilb-')>-1)) {
			   let id = event.target.id.substr(4)
			   let tabLine = 'inf-'+id			   
			   let array = Array.from(myList.element.childNodes);
			   		array.map(function(node){
			   		if (node.id == tabLine) {
						node.classList.add('active')					
					} else {
   				    	node.classList.remove('active')
					}		  
				})
			   
			   ipc.send('show_interface', id)
		   }
	   })
	   this.renderFooterScriptButtons([]);
	}
   }

   interfaceInfo(intf) {
	   var propElements = []; 
	   propElements.push({property:"ID",value:intf.id})
	   propElements.push({property:"Name",value:intf.name})
	   propElements.push({property:"Typ",value:intf.type})
	   propElements.push({property:"Typname",value:intf.typename})
	   propElements.push({property:"Info",value:intf.info})
	   propElements.push({property:"URL",value:intf.url})
	   
	   let propTable = new Table({attributes: {id: 'table-' + intf.id},classNames: ['my-class'],striped: true},propElements );
	   document.querySelector("#properties_label").innerHTML = "Details Interface " + intf.name

	   let myTable = this.clearElement("#element_properties")
	   myTable.appendChild(propTable.element)
	   this.renderFooterScriptButtons([]);
   }


   renderDevices(rootElement) {
	   var that = this
	   var listItems = [];
	   if ((this.ccu) && (this.ccu.devices)) {
	   		this.ccu.devices.map(function(device){
	   			var icon = that.getIcon(device.type)
	   		
	   			let deviceItem = new ListGroupItem({
	   				active: false,
	   				attributes: {
	   					id: 'device-' + device.id
  					},
  					classNames: ['my-class'],
  					header: false
				}, [new Image({attributes: {id: 'dev_im-' + device.id},isMediaObject: true,pull: 'left', shape: 'rounded',
					src: icon,width:'32',height:'32'}, []),
					new Label({attributes: {id: 'dev_lb-' + device.id},text: device.name}, [])]
				)
				
				listItems.push(deviceItem)
		    })
			
			let myList = new ListGroup({
				attributes: {
				id: 'group-device'
	   		},
	   		classNames: ['device-class'],
	   		}, listItems)


	   var myNode = document.querySelector(rootElement);
	   
	   while (myNode.firstChild) {
	   	myNode.removeChild(myNode.firstChild);
	   }
	   
	   myNode.appendChild(myList.element);
	   
	   myList.element.addEventListener('click', function(event){
		   
		   if ((event.target.id.indexOf('device-')>-1) || (event.target.id.indexOf('dev_lb-')>-1) || (event.target.id.indexOf('dev_im-')>-1) ) {
			   let id = event.target.id.substr(7)
			   let tabLine = 'device-'+id			   
			   let array = Array.from(myList.element.childNodes);
			   		array.map(function(node){
			   		if (node.id == tabLine) {
						node.classList.add('active')					
					} else {
   				    	node.classList.remove('active')
					}		  
				})
			   
			   ipc.send('show_device', id)
		   }
	   })
	   this.renderFooterScriptButtons([]);
	}
   }

   renderChannels(device,rootElement) {
	   var newTree = ''
	   var that = this
	   
	   var listItems = [];
	   	   
	   if ((device) && (device.channels)) {
	   		device.channels.map(function(channel){

	   			let channelItem = new ListGroupItem({
	   				active: false,
	   				attributes: {
	   					id: 'channel-' + channel.id
  					},
  					classNames: ['my-class'],
  					header: false
				}, [new Label({attributes: {id: 'chan_lb-' + channel.id},text: channel.name}, [])]
				)
				
				listItems.push(channelItem)
		    })
			
			let myList = new ListGroup({
				attributes: {
				id: 'group-channel'
	   		},
	   		classNames: ['channel-class'],
	   		}, listItems)

	   // Render Description Box
	   
	   var propElements = [];
	   
	   propElements.push({property:"ID",value:device.id})
	   propElements.push({property:"Name",value:device.name})
	   propElements.push({property:"Typ",value:device.type})
	   propElements.push({property:"Adresse",value:device.address})
	   propElements.push({property:"Erstellt",value:device.creatingCompleted})
	   propElements.push({property:"aktiv",value:device.enabled})
	   propElements.push({property:"Intern",value:device.internal})
	   propElements.push({property:"Geraet konfiguriert",value:device.readyConfig})
	   propElements.push({property:"Kanaele konfiguriert",value:device.readyConfigChannels})
	   propElements.push({property:"Gesperrt",value:device.locked})
	   propElements.push({property:"Sichtbar",value:device.visible})
	   propElements.push({property:"In Benutzung",value:device.used})

	   let propTable = new Table({attributes: {id: 'table-' + device.id},classNames: ['my-class'],striped: true},propElements );
	   document.querySelector("#properties_label").innerHTML = "Details Ger&auml;t " + device.name

	   let myTable = this.clearElement("#element_properties")
	   myTable.appendChild(propTable.element)
	   
	   let myNode = this.clearElement(rootElement)
	   myNode.appendChild(myList.element);
	   
	   myList.element.addEventListener('click', function(event){
		   if ((event.target.id.indexOf('channel-')>-1) || (event.target.id.indexOf('chan_lb-')>-1)) {
			   
			   let id = event.target.id.substr(8)
			   let tabLine = 'channel-'+id	

			   let array = Array.from(myList.element.childNodes);
			   		array.map(function(node){
			   		if (node.id == tabLine) {
						node.classList.add('active')					
					} else {
   				    	node.classList.remove('active')
					}		  
				})

			   ipc.send('show_channel', id)
		   }

	   })
	   this.renderFooterScriptButtons([]);
	}
   }

   dataPointInfo(dp) {
	   var propElements = []; 
	   
	   var actions = [
		   'object obj = dom.GetObject(\''+dp.name+'\');',
		   'var state = dom.GetObject(\''+dp.name+'\').State();',
		   'dom.GetObject(\''+dp.name+'\').State(xxx);'
	   ]
	   
	   propElements.push({property:"ID",value:dp.id})
	   propElements.push({property:"Name",value:dp.name})
	   propElements.push({property:"Typ",value:dp.type})
	   propElements.push({property:"Operationen",value:dp.operations})
	   propElements.push({property:"Wertetyp",value:dp.valueType})
	   propElements.push({property:"Einheit",value:dp.valueUnit})
	   propElements.push({property:"Protokoliert",value:dp.archive})
	   
	   let propTable = new Table({attributes: {id: 'table-' + dp.id},classNames: ['my-class'],striped: true},propElements );
	   document.querySelector("#properties_label").innerHTML = "Details Datenpunkt " + dp.name

	   let myTable = this.clearElement("#element_properties")
	   myTable.appendChild(propTable.element)
	   this.renderFooterScriptButtons(actions);
   }


   renderDatapoints(channel,rootElement) {
	   var that = this
	   
	   var listItems = [];
	   	   
	   if ((channel) && (channel.datapoints)) {
	   		channel.datapoints.map(function(datapoint){

	   			let datapointItem = new ListGroupItem({
	   				active: false,
	   				attributes: {
	   					id: 'datapoint-' + datapoint.id
  					},
  					classNames: ['my-class'],
  					header: false
				}, [new Label({attributes: {id: 'datapo_lb-' + datapoint.id},text: datapoint.name}, [])]
				)
				
				listItems.push(datapointItem)
		    })
			
			let myList = new ListGroup({
				attributes: {
				id: 'group-datapoint'
	   		},
	   		classNames: ['datapoint-class'],
	   		}, listItems)

	   // Render Description Box
	   
	   var propElements = [];
	   
	   propElements.push({property:"ID",value:channel.id})
	   propElements.push({property:"Name",value:channel.name})
	   propElements.push({property:"Typ",value:channel.type})
	   propElements.push({property:"Adresse",value:channel.address})

	   let propTable = new Table({attributes: {id: 'table-' + channel.id},classNames: ['my-class'],striped: true},propElements );
	   
	   document.querySelector("#properties_label").innerHTML = "Details Kanal " + channel.name

	   let myTable = this.clearElement("#element_properties")
	   myTable.appendChild(propTable.element)
	   
	   let myNode = this.clearElement(rootElement)
	   myNode.appendChild(myList.element);
	   
	   myList.element.addEventListener('click', function(event){
		   if ((event.target.id.indexOf('datapoint-')>-1) || (event.target.id.indexOf('datapo_lb-')>-1)) {
			   
			   let id = event.target.id.substr(10)
			   let tabLine = 'datapoint-'+id	

			   let array = Array.from(myList.element.childNodes);
			   		array.map(function(node){
			   		if (node.id == tabLine) {
						node.classList.add('active')					
					} else {
   				    	node.classList.remove('active')
					}		  
				})
			   ipc.send('show_datapoint', id)
		   }

	   })
	   this.renderFooterScriptButtons([]);
	} else {
	   let myNode = this.clearElement(rootElement)
	   this.renderFooterScriptButtons([]);
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
     let icon = this.images[type]
     if (icon==undefined) {
	     icon = 'unknown_device_thumb.png'
     }
     return 'http://' +  this.ccuIP +'/config/img/devices/50/'+ icon
   }
   
   renderScriptOutput(result,variables) {

	   document.querySelector("#script-response").value = result
	   var varElements = [];
	   
	   varElements.push({'Variable':'','Wert':''})
	   
	   Object.keys(variables).map(function(key) {
		   let vv = variables[key]
		   
		   if ((key != 'exec') && (key != 'sessionId') && (key != 'httpUserAgent'))
		   {
		   		varElements.push({'Variable':key,'Wert':(vv)?vv[0]:'null'})
		   }	   
	   })
	   
	   let varTable = new Table({attributes: {id: 'table-var'},classNames: ['my-class'],striped: true},varElements);
	   var table = document.querySelector("#table-var")
	   var tabRoot = table.parentNode
	   tabRoot.removeChild(table)
	   tabRoot.appendChild(varTable.element)

   }
   
   renderRssiInfo(rootElement) {
	   var rssiElements = []; 
	   var that = this
	   this.ccu.devices.map(function(device){
		   if (device.rssi) {
		   	device.rssi.map(function(rssiInfo) {
			   
			   var pDevice = that.ccu.deviceWithAdress(rssiInfo.p)
			   
			   rssiElements.push({'Geraet':device.name + ' (' + device.address + ')',
				   'Partner': (pDevice) ? pDevice.name + ' (' + pDevice.address + ')' : rssiInfo.p,
				   'In':(rssiInfo.db_in!=65536) ? rssiInfo.db_in : 'k.Info' ,
				   'Out':(rssiInfo.db_out!=65536) ? rssiInfo.db_out : 'k.Info'})
		   	})
		   }
	   })
	   let propTable = new Table({attributes: {id: 'rssi-table'},classNames: ['my-class'],striped: true},rssiElements);
	   let myTable = this.clearElement(rootElement)
	   myTable.appendChild(propTable.element)
	   this.renderFooterScriptButtons([]);
   }

  renderFooterScriptButtons(actions) {
	var scriptId = 0
	let myAction = this.clearElement('#element_action')
	actions.map(function (cmd){
	let button = new Button({attributes: {id: 'script-'+scriptId},classNames: ['active'], icon: 'star',
			size: 'large',  
			text: cmd ,  type: 'default'}, [])

    let frm = new FormGroup({attributes: {id: 'group'+scriptId,style:'width:100%;height:100%'},classNames: ['pull-left']}, [button])
	myAction.appendChild(frm.element)

	frm.element.addEventListener('click', function(event){
		    ipc.send('send_clipboard',cmd)
	})		

	scriptId = scriptId + 1
	})
  }
  
  renderScriptHintButtons() {
	  var actions = [
		   'Write("Hello World);',
		   'WriteLine(state);'
	   ]
	   this.renderFooterScriptButtons(actions);
  }
 
  renderVariables(rootElement) {
	   var varElements = []; 
	   var that = this
	   this.ccu.variables.map(function(variable){

	   		var strValueType = 'unbekannt'
	   		var strValueSubType = 'unbekannt'
	   		
	   		switch (parseInt(variable.valuetype)) {
		   		case 2: 
		   			strValueType = 'binaer'
		   		break;
		   		case 4: 
		   			strValueType = 'Fliesskommazahl'
		   		break;
		   		case 16: 
		   			strValueType = 'Zahl'
		   		break;
		   		case 20: 
		   			strValueType = 'Text'
		   		break;
		   		
	   		}
	   		
	   		switch (parseInt(variable.subtype)) {
		   		case 23:
		   		   strValueSubType = 'Anwesenheit'
		   		   break;
		   		case 6:
		   		   strValueSubType = 'Alarm'
		   		   break;
		   		case 0:
		   		   strValueSubType = 'Zahl'
		   		   break;
		   		case 2:
		   		   strValueSubType = 'Logicwert'
		   		   break;
		   		case 29:
		   		   strValueSubType = 'Werteliste'
		   		   break;
		   		case 11:
		   		   strValueSubType = 'Zeichenkette'
		   		   break;
		   		
	   		}

			   varElements.push({
				   'Id':variable.id,
				   'Name':variable.name ,
				   'Typ': strValueType,
				   'SubTyp': strValueSubType,
				   'Unit':variable.unit,
				   'Werteliste':variable.vallist})
		})
	   
	   let propTable = new Table({attributes: {id: 'variable-table'},classNames: ['my-class'],striped: true},varElements);
	   let myTable = this.clearElement(rootElement)
	   myTable.appendChild(propTable.element)
   }

}
	
module.exports = CCUTreeRenderer;