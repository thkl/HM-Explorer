// Here is the starting point for your application code.

// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';


import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import env from './env';

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath())
const dialog = require('electron').dialog
const ipc = remote.ipcMain



const Store = require('./store.js')
const CCU = require('./ccu/ccu.js')
const CCUTreeRenderer = require('./ccu/ccu_treerenderer.js')
const SidebarRenderer = require('./ui/sidebar.js')
const WorkspacePane = require('./ui/workspace_pane.js')

const manifest = appDir.read('package.json', 'json')

var ccu = new CCU();
var lastScript = 'WriteLine("Hello World");'

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
  
function getCCURSSI() {
	var ccuIP = document.querySelector('#ccu_ip').value
	if (ccuIP) {
		store.set('ccuIP', ccuIP);
		ccu.setHost(ccuIP)
		ccu.loadRssiValues(function(error){
			if (!error) {
				new CCUTreeRenderer(ccuIP,ccu).renderRssiInfo('#ccu_rssi')
			}
		})
	} else {
		dialog.showErrorBox('this will not work','Please enter the ip adress of your ccu');
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


ipc.on('send_clipboard',(event,arg) => {
	const {clipboard} = require('electron')
	clipboard.writeText(arg)
})

ipc.on('run_script', (event, arg) => {
  
  ccu.sendScriptAndParseAll(arg,function(result,variables){
	  new CCUTreeRenderer(ccuIP,ccu).renderScriptOutput(result,variables)
  })
  
})



ipc.on('sidebar-click', (event, arg) => {
	
	// Check Scripttext 
	
	
	var scriptElement = document.querySelector('#script_text');
	if (scriptElement) {
		lastScript = scriptElement.value
	}
	
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
		new CCUTreeRenderer(ccuIP,ccu).renderScriptHintButtons()
	  break;

	  case 'navItem-rssi':
	  	new WorkspacePane('rssi').render('#main_group')
	  	getCCURSSI()
	  break;
	  
	  case 'navItem-variable':
	   new WorkspacePane('variables').render('#main_group')
	   getCCUVariables()
	  break;
  }

})


let ccuIP = store.get('ccuIP');
if (ccuIP) {
	 document.querySelector('#ccu_ip').value = ccuIP
	 ccu.setHost(ccuIP)
}

new SidebarRenderer().render('#sidebar')
