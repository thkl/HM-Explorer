// Here is the starting point for your application code.
// Remeber this is running in the rendering process
// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';


import { remote,shell } from 'electron';
import jetpack from 'fs-jetpack';
import env from './env';

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath())
const dialog = require('electron').dialog
const ipc = remote.ipcMain

const ipcr = require('electron').ipcRenderer


const Store = require('./store.js')
const CCU = require('./ccu/ccu.js')
const CCUTreeRenderer = require('./ccu/ccu_treerenderer.js')
const SidebarRenderer = require('./ui/sidebar.js')
const WorkspacePane = require('./ui/workspace_pane.js')

const manifest = appDir.read('package.json', 'json')

var ccu = new CCU();
var lastScript = 'WriteLine("Hello World");'
var currentEventInterface = null

const osMap = {
  win32: 'Windows',
  darwin: 'macOS',
  linux: 'Linux',
};

const store = new Store({
	configName: 'user-preferences',
	defaults: {
    ccuIP: ""
  }
});


function getCCUDeviceData(){
	var ccuIP = document.querySelector('#ccu_ip').value
	if (ccuIP) {
		store.set('ccuIP', ccuIP);
		ccu.setHost(ccuIP)
		ccu.loadDevices(function(){
			new CCUTreeRenderer(ccuIP,ccu).renderDevices('#ccu_device_tree')
		})
	} else {
		dialog.showErrorBox('this will not work','Please enter the ip adress of your ccu');
	}
}

function getCCUVariables(){
	var ccuIP = document.querySelector('#ccu_ip').value
	if (ccuIP) {
		store.set('ccuIP', ccuIP);
		ccu.setHost(ccuIP)
		ccu.loadVariables(function(){
			new CCUTreeRenderer(ccuIP,ccu).renderVariables('#ccu_variables')
		})
	} else {
		dialog.showErrorBox('this will not work','Please enter the ip adress of your ccu');
	}
}



function getCCUInterfaceData(){
	var ccuIP = document.querySelector('#ccu_ip').value
	if (ccuIP) {
		store.set('ccuIP', ccuIP);
		ccu.setHost(ccuIP)
		ccu.loadInterfaces(function(){
			new CCUTreeRenderer(ccuIP,ccu).renderInterfaces('#ccu_interface_tree')
		})
	} else {
		dialog.showErrorBox('this will not work','Please enter the ip adress of your ccu');
	}
}
  
function getCCURSSI(sort,order) {
	var ccuIP = document.querySelector('#ccu_ip').value
	if (ccuIP) {
		store.set('ccuIP', ccuIP);
		ccu.setHost(ccuIP)
		ccu.loadInterfaces(function(){
		ccu.loadRssiValues(function(error){
			if (!error) {
				new CCUTreeRenderer(ccuIP,ccu).renderRssiInfo('#ccu_rssi',sort,order)
			}
		})
		})
	} else {
		dialog.showErrorBox('this will not work','Please enter the ip adress of your ccu');
	}
}  
    
function killEventServer() {
	if (currentEventInterface) {
		ccu.detacheFromInterface(currentEventInterface,function(result,error){
		  console.log("detache %s %s",result,error)
		})
	}
	
}

ipc.on('show_device', (event, arg) => {
  var device = ccu.deviceWithID(arg);
  if (device) {
  	ccu.loadChannels(device,function(){
	  new CCUTreeRenderer(ccuIP,ccu).renderChannels(device,'#device_channel_tree')	
	  new CCUTreeRenderer(ccuIP,ccu).renderDatapoints(undefined,'#device_channel_dp_tree')	
  	})
  }  
})

ipc.on('show_channel', (event, arg) => {
  var channel = ccu.channelWithID(arg);
  if (channel) {
  	ccu.loadDataPoints(channel,function(){
	  new CCUTreeRenderer(ccuIP,ccu).renderDatapoints(channel,'#device_channel_dp_tree')	

  	})
  }  
})

ipc.on('show_datapoint', (event, arg) => {
  var dp = ccu.datapointWithID(arg);
  if (dp) {
	  new CCUTreeRenderer(ccuIP,ccu).dataPointInfo(dp)	
  }  
})


ipc.on('show_interface', (event, arg) => {
  var intf = ccu.interfaceWithID(arg);
  if (intf) {
	  new CCUTreeRenderer(ccuIP,ccu).interfaceInfo(intf)	
  }  
})

ipc.on('test_script', (event, arg) => {
  ccu.testScript(arg,function(result,variables){
	  if (result=='') {
		  result = 'Schaut ok aus ....';
	  }
	  new CCUTreeRenderer(ccuIP,ccu).renderScriptOutput(result,[])
  })
})

ipcr.on('open_ccu_url', (event, arg) => {
	console.log("Open URL")
  let ccuIP = document.querySelector('#ccu_ip').value
  if (ccuIP) {
	  let url = arg.replace('$ccuhost$', ccuIP)
		shell.openExternal(url)
  }
})


ipc.on('send_clipboard',(event,arg) => {
	const {clipboard} = require('electron')
	clipboard.writeText(arg)
})

ipc.on('describe_function',(event,arg)=> {
	
	// Build the 3rd footer column
	var script =  arg.script
	new CCUTreeRenderer(ccuIP,ccu).renderScriptMethodTestResult(script,undefined)
	if (arg.execute) {
		ccu.sendScriptAndParseAll(script,20,function(result,variables){
			let strresult = (variables && (variables.testObject))?variables.testObject:result
			new CCUTreeRenderer(ccuIP,ccu).renderScriptMethodTestResult(script,strresult)
  		})
  	}
})

ipc.on('run_script', (event, arg) => {
  
  ccu.sendScriptAndParseAll(arg,20,function(result,variables){
	  new CCUTreeRenderer(ccuIP,ccu).renderScriptOutput(result,variables)
  })
  
})

ipc.on('xml_event', (event, arg) => {
  let txf = document.querySelector("#ccu_event_list")
  if (txf) {  
 	 var tx =  txf.value
 	 tx = tx + '[' + new Date() + '] ' + arg[1] + "." + arg[2] + " -> " + arg[3] + '\n'
 	 txf.value = tx
 	 txf.scrollTop = txf.scrollHeight;
  }
})

ipc.on('set_event_interface',(event,arg) => {
	ccu.eventInterface = arg
})

ipc.on('start_eventListener',(event,arg) => {
	let intf = ccu.interfaceWithName(ccu.eventInterface)
	if (intf) {
		ccu.attacheToInterface(intf,function(error){
		   currentEventInterface = intf
		})
	}
})

ipc.on('end_eventListener',(event,arg) => {
   killEventServer()
})

ipc.on('sidebar-click', (event, arg) => {
	
	// Check Scripttext 
	
	
	var scriptElement = document.querySelector('#script_text');
	if (scriptElement) {
		lastScript = scriptElement.value
	}
	
	
	// Kill eventserver
	
	killEventServer()
	
  switch (arg) {
	 
	  case 'navItem-interface':
	  	new WorkspacePane('interface').render('#main_group')
	  	getCCUInterfaceData()
	  break;


	  case 'navItem-devices':
	  	new WorkspacePane('device').render('#main_group')
	  	getCCUDeviceData()
	  break;

	  case 'navItem-scripts':
	  	new WorkspacePane('script').render('#main_group')
	  	scriptElement = document.querySelector('#script_text');
	  	// restore Script
	  	if (scriptElement) {
		   scriptElement.value  = lastScript
		}
		let renderer = new CCUTreeRenderer(ccuIP,ccu);
		renderer.renderCommandScreen('Allgmeine Script Funktionen','',['script'])
		renderer.renderScriptMethodTestResult(undefined,undefined)
	  break;

	  case 'navItem-rssi':
	  	new WorkspacePane('rssi').render('#main_group')
	  	getCCURSSI()
	  break;
	  
	  case 'navItem-variable':
	   new WorkspacePane('variables').render('#main_group')
	   getCCUVariables()
	  break;
	  
	  case 'navItem-events':
	  
		ccu.loadInterfaces(function(){
			console.log(ccu.interfaces)
			 new WorkspacePane('events').renderEventsContentPane('#main_group',ccu.interfaces)
			 let renderer = new CCUTreeRenderer(ccuIP,ccu);
			 renderer.renderCommandScreen('','',[])
			 renderer.renderScriptMethodTestResult(undefined,undefined)
		})
		
	  break
	  
	  case 'navItem-dutycycle': 
	 	new WorkspacePane('dutycycle').render('#main_group')
	 	var ccuIP = document.querySelector('#ccu_ip').value
	  	if (ccuIP) {
			store.set('ccuIP', ccuIP);
			ccu.setHost(ccuIP)
			ccu.loadInterfaces(function(){
			ccu.loadDutyCycle(function(dcinfo){
				new CCUTreeRenderer(ccuIP,ccu).renderDCInfo('#ccu_dutycycle',dcinfo)
			})
			})
		} else {
			dialog.showErrorBox('this will not work','Please enter the ip adress of your ccu');
		}
		break;
  }

})


let ccuIP = store.get('ccuIP');
if (ccuIP) {
	 document.querySelector('#ccu_ip').value = ccuIP
	 ccu.setHost(ccuIP)
}

new SidebarRenderer().render('#sidebar')

