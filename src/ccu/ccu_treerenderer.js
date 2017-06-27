import { ListGroup,ListGroupItem,Label,Image,Table } from 'brightwheel'
const ipc = require('electron').ipcRenderer

class CCUTreeRenderer {
	

   constructor(ccuip,ccu) {
	   this.ccu = ccu;
	   this.ccuIP = ccuip;
	   
	   this.images =  {
				'HM-LC-Dim1TPBU-FM': 'PushButton-2ch-wm_thumb.png',
				'HM-LC-Sw1PBU-FM':   'PushButton-2ch-wm_thumb.png',
				'HM-LC-Bl1PBU-FM':   'PushButton-2ch-wm_thumb.png',
				'HM-LC-Sw1-PB-FM':   'PushButton-2ch-wm_thumb.png',
				'HM-PB-2-WM':        'PushButton-2ch-wm_thumb.png',
				'HM-LC-Sw2-PB-FM':   'PushButton-4ch-wm_thumb.png',
				'HM-PB-4-WM':        'PushButton-4ch-wm_thumb.png',
				'HM-LC-Dim1L-Pl':    'OM55_DimmerSwitch_thumb.png',
				'HM-LC-Dim1T-Pl':    'OM55_DimmerSwitch_thumb.png',
				'HM-LC-Sw1-Pl':      'OM55_DimmerSwitch_thumb.png',
				'HM-LC-Dim1L-Pl-2':  'OM55_DimmerSwitch_thumb.png',
				'HM-LC-Sw1-Pl-OM54': 'OM55_DimmerSwitch_thumb.png',
				'HM-Sys-sRP-Pl':     'OM55_DimmerSwitch_thumb.png',
				'HM-LC-Dim1T-Pl-2':  'OM55_DimmerSwitch_thumb.png',
				'HM-LC-Sw1-Pl-2':    'OM55_DimmerSwitch_thumb.png',
                'HM-LC-Sw4-Ba-PCB':  '88_hm-lc-sw4-ba-pcb_thumb.png',
				'HM-Sen-RD-O':       '87_hm-sen-rd-o_thumb.png',
				'HM-RC-Sec4-2':      '86_hm-rc-sec4-2_thumb.png',
				'HM-PB-6-WM55':      '86_hm-pb-6-wm55_thumb.png',
				'HM-RC-Key4-2':      '85_hm-rc-key4-2_thumb.png',
				'HM-RC-4-2':         '84_hm-rc-4-2_thumb.png',
                'HM-CC-RT-DN':       '83_hm-cc-rt-dn_thumb.png',
				'HM-Sen-Wa-Od':      '82_hm-sen-wa-od_thumb.png',
				'HM-Sen-WA-OD':      '82_hm-sen-wa-od_thumb.png',
				'HM-Dis-TD-T':       '81_hm-dis-td-t_thumb.png',
				'HM-Sen-MDIR-O':     '80_hm-sen-mdir-o_thumb.png',
				'HM-OU-LED16':       '78_hm-ou-led16_thumb.png',
				'HM-LC-Sw1-Ba-PCB':  '77_hm-lc-sw1-ba-pcb_thumb.png',
				'HM-LC-Sw4-WM':      '76_hm-lc-sw4-wm_thumb.png',
				'HM-PB-2-WM55':      '75_hm-pb-2-wm55_thumb.png',
				'atent':             '73_hm-atent_thumb.png',
				'HM-RC-BRC-H':       '72_hm-rc-brc-h_thumb.png',
				'HMW-IO-12-Sw14-DR': '71_hmw-io-12-sw14-dr_thumb.png',
				'HM-PB-4Dis-WM':     '70_hm-pb-4dis-wm_thumb.png',
				'HM-LC-Sw2-DR':      '69_hm-lc-sw2-dr_thumb.png',
				'HM-LC-Sw4-DR':      '68_hm-lc-sw4-dr_thumb.png',
				'HM-SCI-3-FM':       '67_hm-sci-3-fm_thumb.png',
				'HM-LC-Dim1T-CV':    '66_hm-lc-dim1t-cv_thumb.png',
				'HM-LC-Dim1T-FM':    '65_hm-lc-dim1t-fm_thumb.png',
				'HM-LC-Dim2T-SM':    '64_hm-lc-dim2T-sm_thumb.png',
				'HM-LC-Bl1-pb-FM':   '61_hm-lc-bl1-pb-fm_thumb.png',
				'HM-LC-Bi1-pb-FM':   '61_hm-lc-bi1-pb-fm_thumb.png',
				'HM-OU-CF-Pl':       '60_hm-ou-cf-pl_thumb.png',
				'HM-OU-CFM-Pl':      '60_hm-ou-cf-pl_thumb.png',
				'HMW-IO-12-FM':      '59_hmw-io-12-fm_thumb.png',
				'HMW-Sen-SC-12-FM':  '58_hmw-sen-sc-12-fm_thumb.png',
				'HM-CC-SCD':         '57_hm-cc-scd_thumb.png',
				'HMW-Sen-SC-12-DR':  '56_hmw-sen-sc-12-dr_thumb.png',
				'HM-Sec-SFA-SM':     '55_hm-sec-sfa-sm_thumb.png',
				'HM-LC-ddc1':        '54a_lc-ddc1_thumb.png',
				'HM-LC-ddc1-PCB':    '54_hm-lc-ddc1-pcb_thumb.png',
				'HM-Sen-MDIR-SM':    '53_hm-sen-mdir-sm_thumb.png',
				'HM-Sec-SD-Team':    '52_hm-sec-sd-team_thumb.png',
				'HM-Sec-SD':         '51_hm-sec-sd_thumb.png',
				'HM-Sec-MDIR':       '50_hm-sec-mdir_thumb.png',
				'HM-Sec-WDS':        '49_hm-sec-wds_thumb.png',
				'HM-Sen-EP':         '48_hm-sen-ep_thumb.png',
				'HM-Sec-TiS':        '47_hm-sec-tis_thumb.png',
				'HM-LC-Sw4-PCB':     '46_hm-lc-sw4-pcb_thumb.png',
				'HM-LC-Dim2L-SM':    '45_hm-lc-dim2l-sm_thumb.png',
				'HM-EM-CCM':         '44_hm-em-ccm_thumb.png',
				'HM-CC-VD':          '43_hm-cc-vd_thumb.png',
				'HM-CC-TC':          '42_hm-cc-tc_thumb.png',
				'HM-Swi-3-FM':       '39_hm-swi-3-fm_thumb.png',
				'HM-PBI-4-FM':       '38_hm-pbi-4-fm_thumb.png',
				'HMW-Sys-PS7-DR':    '36_hmw-sys-ps7-dr_thumb.png',
				'HMW-Sys-TM-DR':     '35_hmw-sys-tm-dr_thumb.png',
				'HMW-Sys-TM':        '34_hmw-sys-tm_thumb.png',
				'HMW-Sec-TR-FM':     '33_hmw-sec-tr-fm_thumb.png',
				'HMW-WSTH-SM':       '32_hmw-wsth-sm_thumb.png',
				'HMW-WSE-SM':        '31_hmw-wse-sm_thumb.png',
				'HMW-IO-12-Sw7-DR':  '30_hmw-io-12-sw7-dr_thumb.png',
				'HMW-IO-4-FM':       '29_hmw-io-4-fm_thumb.png',
				'HMW-LC-Dim1L-DR':   '28_hmw-lc-dim1l-dr_thumb.png',
				'HMW-LC-Bl1-DR':     '27_hmw-lc-bl1-dr_thumb.png',
				'HMW-LC-Sw2-DR':     '26_hmw-lc-sw2-dr_thumb.png',
				'HM-EM-CMM':         '25_hm-em-cmm_thumb.png',
				'HM-CCU-1':          '24_hm-cen-3-1_thumb.png',
				'HM-RCV-50':         '24_hm-cen-3-1_thumb.png',
				'HMW-RCV-50':        '24_hm-cen-3-1_thumb.png',
				'HM-RC-Key3':        '23_hm-rc-key3-b_thumb.png',
				'HM-RC-Key3-B':      '23_hm-rc-key3-b_thumb.png',
				'HM-RC-Sec3':        '22_hm-rc-sec3-b_thumb.png',
				'HM-RC-Sec3-B':      '22_hm-rc-sec3-b_thumb.png',
				'HM-RC-P1':          '21_hm-rc-p1_thumb.png',
				'HM-RC-19':          '20_hm-rc-19_thumb.png',
				'HM-RC-19-B':        '20_hm-rc-19_thumb.png',
				'HM-RC-19-SW':       '20_hm-rc-19_thumb.png',
				'HM-RC-12':          '19_hm-rc-12_thumb.png',
				'HM-RC-12-B':        '19_hm-rc-12_thumb.png',
				'HM-RC-4':           '18_hm-rc-4_thumb.png',
				'HM-RC-4-B':         '18_hm-rc-4_thumb.png',
				'HM-Sec-RHS':        '17_hm-sec-rhs_thumb.png',
				'HM-Sec-SC':         '16_hm-sec-sc_thumb.png',
				'HM-Sec-Win':        '15_hm-sec-win_thumb.png',
				'HM-Sec-Key':        '14_hm-sec-key_thumb.png',
				'HM-Sec-Key-S':      '14_hm-sec-key_thumb.png',
				'HM-WS550STH-I':     '13_hm-ws550sth-i_thumb.png',
				'HM-WDS40-TH-I':     '13_hm-ws550sth-i_thumb.png',
				'HM-WS550-US':       '9_hm-ws550-us_thumb.png',
				'WS550':             '9_hm-ws550-us_thumb.png',
				'HM-WDC7000':        '9_hm-ws550-us_thumb.png',
				'HM-LC-Sw1-SM':      '8_hm-lc-sw1-sm_thumb.png',
				'HM-LC-Bl1-FM':      '7_hm-lc-bl1-fm_thumb.png',
				'HM-LC-Bl1-SM':      '6_hm-lc-bl1-sm_thumb.png',
				'HM-LC-Sw2-FM':      '5_hm-lc-sw2-fm_thumb.png',
				'HM-LC-Sw1-FM':      '4_hm-lc-sw1-fm_thumb.png',
				'HM-LC-Sw4-SM':      '3_hm-lc-sw4-sm_thumb.png',
				'HM-LC-Dim1L-CV':    '2_hm-lc-dim1l-cv_thumb.png',
				'HM-LC-Dim1PWM-CV':  '2_hm-lc-dim1l-cv_thumb.png',
				'HM-WS550ST-IO':     'IP65_G201_thumb.png',
				'HM-WDS30-T-O':      'IP65_G201_thumb.png',
				'HM-WDS100-C6-O':    'WeatherCombiSensor_thumb.png',
				'HM-WDS10-TH-O':     'TH_CS_thumb.png',
				'HM-WS550STH-O':     'TH_CS_thumb.png',
				'HM-WDS30-OT2-SM':   'IP65_G201_thumb.png',
				'HM-ES-TX-WM':		 '102_hm-es-tx-wm_thumb.png',
				'HM-ES-PMSw1-Pl':	 '93_hm-es-pmsw1-pl_thumb.png',
				'HM-Sec-SCo':		 '98_hm-sec-sco_thumb.png'
				}
	
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
	}
   }

   dataPointInfo(dp) {
	   var propElements = []; 
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
	} else {
	   let myNode = this.clearElement(rootElement)
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