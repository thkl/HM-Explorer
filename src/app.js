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


ipc.on('run_script', (event, arg) => {
  
  ccu.sendScriptAndParseAll(arg,function(result,variables){
	  new CCUTreeRenderer(ccuIP,ccu).renderScriptOutput(result,variables)
  })
  
})




ipc.on('sidebar-click', (event, arg) => {
	
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
	  break;
	  
  }

})


let ccuIP = store.get('ccuIP');
if (ccuIP) {
	 document.querySelector('#ccu_ip').value = ccuIP
	 ccu.setHost(ccuIP)
}

new SidebarRenderer().render('#sidebar')
