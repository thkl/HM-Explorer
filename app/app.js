(function () {'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var electron = require('electron');
var jetpack = _interopDefault(require('fs-jetpack'));

// This gives you default context menu (cut, copy, paste)
// in all input fields and textareas across your app.

const Menu = electron.remote.Menu;
const MenuItem = electron.remote.MenuItem;

const isAnyTextSelected = () => {
  return window.getSelection().toString() !== '';
};

const cut = new MenuItem({
  label: 'Cut',
  click: () => {
    document.execCommand('cut');
  },
});

const copy = new MenuItem({
  label: 'Copy',
  click: () => {
    document.execCommand('copy');
  },
});

const paste = new MenuItem({
  label: 'Paste',
  click: () => {
    document.execCommand('paste');
  },
});

const normalMenu = new Menu();
normalMenu.append(copy);

const textEditingMenu = new Menu();
textEditingMenu.append(cut);
textEditingMenu.append(copy);
textEditingMenu.append(paste);

document.addEventListener('contextmenu', (event) => {
  switch (event.target.nodeName) {
    case 'TEXTAREA':
    case 'INPUT':
      event.preventDefault();
      textEditingMenu.popup(electron.remote.getCurrentWindow());
      break;
    default:
      if (isAnyTextSelected()) {
        event.preventDefault();
        normalMenu.popup(electron.remote.getCurrentWindow());
      }
  }
}, false);

// Convenient way for opening links in external browser, not in the app.
// Useful especially if you have a lot of links to deal with.
//
// Usage:
//
// Every link with class ".js-external-link" will be opened in external browser.
// <a class="js-external-link" href="http://google.com">google</a>
//
// The same behaviour for many links can be achieved by adding
// this class to any parent tag of an anchor tag.
// <p class="js-external-link">
//    <a href="http://google.com">google</a>
//    <a href="http://bing.com">bing</a>
// </p>

const supportExternalLinks = (event) => {
  let href;
  let isExternal = false;

  const checkDomElement = (element) => {
    if (element.nodeName === 'A') {
      href = element.getAttribute('href');
    }
    if (element.classList.contains('js-external-link')) {
      isExternal = true;
    }
    if (href && isExternal) {
      electron.shell.openExternal(href);
      event.preventDefault();
    } else if (element.parentElement) {
      checkDomElement(element.parentElement);
    }
  };

  checkDomElement(event.target);
};

document.addEventListener('click', supportExternalLinks, false);

// Simple wrapper exposing environment variables to rest of the code.

// The variables have been written to `env.json` by the build process.
const env = jetpack.cwd(__dirname).read('env.json', 'json');

// Here is the starting point for your application code.

// Small helpers you might want to keep
const app = electron.remote.app;
const appDir = jetpack.cwd(app.getAppPath());
const dialog = require('electron').dialog;
const ipc = electron.remote.ipcMain;



const Store = require('./store.js');
const CCU = require('./ccu/ccu.js');
const CCUTreeRenderer = require('./ccu/ccu_treerenderer.js');
const SidebarRenderer = require('./ui/sidebar.js');
const WorkspacePane = require('./ui/workspace_pane.js');

const manifest = appDir.read('package.json', 'json');

var ccu = new CCU();

const store = new Store({
	configName: 'user-preferences',
	defaults: {
    ccuIP: ""
  }
});


function getCCUDeviceData(){
	var ccuIP = document.querySelector('#ccu_ip').value;
	if (ccuIP) {
		store.set('ccuIP', ccuIP);
		ccu.setHost(ccuIP);
		ccu.loadDevices(function(){
			new CCUTreeRenderer(ccuIP,ccu).renderDevices('#ccu_device_tree');
		});
	} else {
		dialog.showErrorBox('this will not work','Please enter the ip adress of your ccu');
	}
}


function getCCUInterfaceData(){
	var ccuIP = document.querySelector('#ccu_ip').value;
	if (ccuIP) {
		store.set('ccuIP', ccuIP);
		ccu.setHost(ccuIP);
		ccu.loadInterfaces(function(){
			new CCUTreeRenderer(ccuIP,ccu).renderInterfaces('#ccu_interface_tree');
		});
	} else {
		dialog.showErrorBox('this will not work','Please enter the ip adress of your ccu');
	}
}
  

ipc.on('show_device', (event, arg) => {
  var device = ccu.deviceWithID(arg);
  if (device) {
  	ccu.loadChannels(device,function(){
	  new CCUTreeRenderer(ccuIP,ccu).renderChannels(device,'#device_channel_tree');	
	  new CCUTreeRenderer(ccuIP,ccu).renderDatapoints(undefined,'#device_channel_dp_tree');	
  	});
  }  
});

ipc.on('show_channel', (event, arg) => {
  var channel = ccu.channelWithID(arg);
  if (channel) {
  	ccu.loadDataPoints(channel,function(){
	  new CCUTreeRenderer(ccuIP,ccu).renderDatapoints(channel,'#device_channel_dp_tree');	

  	});
  }  
});

ipc.on('show_datapoint', (event, arg) => {
  var dp = ccu.datapointWithID(arg);
  if (dp) {
	  new CCUTreeRenderer(ccuIP,ccu).dataPointInfo(dp);	
  }  
});

ipc.on('show_interface', (event, arg) => {
  var intf = ccu.interfaceWithID(arg);
  if (intf) {
	  new CCUTreeRenderer(ccuIP,ccu).interfaceInfo(intf);	
  }  
});


ipc.on('run_script', (event, arg) => {
  
  ccu.sendScriptAndParseAll(arg,function(result,variables){
	  new CCUTreeRenderer(ccuIP,ccu).renderScriptOutput(result,variables);
  });
  
});




ipc.on('sidebar-click', (event, arg) => {
	
  switch (arg) {
	 
	  case 'navItem-interface':
	  	new WorkspacePane('interface').render('#main_group');
	  	getCCUInterfaceData();
	  break;


	  case 'navItem-devices':
	  	new WorkspacePane('device').render('#main_group');
	  	getCCUDeviceData();
	  break;

	  case 'navItem-scripts':
	  	new WorkspacePane('script').render('#main_group');
	  break;
	  
  }

});


let ccuIP = store.get('ccuIP');
if (ccuIP) {
	 document.querySelector('#ccu_ip').value = ccuIP;
	 ccu.setHost(ccuIP);
}

new SidebarRenderer().render('#sidebar');

}());
//# sourceMappingURL=app.js.map