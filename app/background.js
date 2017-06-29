(function () {'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var url = _interopDefault(require('url'));
var electron = require('electron');
var jetpack = _interopDefault(require('fs-jetpack'));

const devMenuTemplate = {
  label: 'Development',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: () => {
      electron.BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
    },
  },
  {
    label: 'Toggle DevTools',
    accelerator: 'Alt+CmdOrCtrl+I',
    click: () => {
      electron.BrowserWindow.getFocusedWindow().toggleDevTools();
    },
  }]
};

const editMenuTemplate = {
  label: 'Edit',
  submenu: [
    { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
    { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
    { type: 'separator' },
    { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
    { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
    { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
    { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
  ],
};

// This helper remembers the size and position of your windows (and restores
// them in that place after app relaunch).
// Can be used for more than one window, just construct many
// instances of it and give each different name.

var createWindow = (name, options) => {
  const userDataDir = jetpack.cwd(electron.app.getPath('userData'));
  const stateStoreFile = `window-state-${name}.json`;
  const defaultSize = {
    width: options.width,
    height: options.height,
  };
  let state = {};
  let win;

  const restore = () => {
    let restoredState = {};
    try {
      restoredState = userDataDir.read(stateStoreFile, 'json');
    } catch (err) {
      // For some reason json can't be read (might be corrupted).
      // No worries, we have defaults.
    }
    return Object.assign({}, defaultSize, restoredState);
  };

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState, bounds) => {
    return windowState.x >= bounds.x && 
    	windowState.y >= bounds.y &&
    	windowState.x + windowState.width <= bounds.x + bounds.widt && 
      windowState.y + windowState.height <= bounds.y + bounds.height;
  };

  const resetToDefaults = () => {
    const bounds = electron.screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };

  const ensureVisibleOnSomeDisplay = (windowState) => {
    const visible = electron.screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    userDataDir.write(stateStoreFile, state, { atomic: true });
  };

  state = ensureVisibleOnSomeDisplay(restore());

  win = new electron.BrowserWindow(Object.assign({}, options, state));

  win.on('close', saveState);

  return win;
};

// Simple wrapper exposing environment variables to rest of the code.

// The variables have been written to `env.json` by the build process.
const env = jetpack.cwd(__dirname).read('env.json', 'json');

// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

const updater = require('asar-updater');
// Special module holding environment variables which you declared
// in config/env_xxx.json file.
var pjson = require(__dirname +'/../package.json');
var updateManifest;


const setApplicationMenu = (update) => {

const mainMenuTemplate = {
  label: 'HM-Explorer',
  submenu: [{
    label: 'About',
    accelerator: '',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
	      
        const options = {
          type: 'info',
          title: 'About HM-Explorer',
          buttons: ['#Covfefe !'],
          message: '(c) 2017 by thkl. https://github.com/thkl'
        };
        
        dialog.showMessageBox(focusedWindow, options, function () {});
     }
    } 
   },
   {label : 'Version ' + pjson.version},
   {label: 'Check for Updates',click: () => {updater.checkForUpdates();}},
   {label: 'Quit',accelerator: 'CmdOrCtrl+Q',click: () => {electron.app.quit();},
  }],
 };


  const menus = [mainMenuTemplate,editMenuTemplate];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  
  if (update) {
	menus.push({label: 'Update', submenu: [{label: 'Update HM Explorer', click: () => {
      console.log("Update pressed");
      if ((updateManifest.from) && (updateManifest.to)) {
	      const FileSystem = require('original-fs');
	      var dest = updateManifest.to;
		  if (!dest.endsWith('/app.asar')) {
			  dest = dest + '/app.asar';
		  }
		  
		  try {
            FileSystem.unlink(dest, function (err) {
                if (err) {
                    console.error(err);
                }
            });
		  } catch (error) {
             console.error(error);
          }
		  
		  try {
            FileSystem.rename(updateManifest.from, dest, function (err) {
                if (err) {
                    console.error(err);
                }
            });

        } catch (error) {
             console.error(error);
        }
        updater.quitAndInstall(1000);
      }
    }
  }]});
  }
  electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(menus));
};


// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
  const userDataPath = electron.app.getPath('userData');
  electron.app.setPath('userData', `${userDataPath} (${env.name})`);
}

electron.app.on('ready', () => {
  setApplicationMenu();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    title: "Homematic Explorer",
    slashes: true,
  }));

  if (env.name === 'development') {
    mainWindow.openDevTools();
  }
 
  const updateURL = 'https://github.com/thkl/HM-Explorer/raw/master/dist/update.json?d='+ new Date(); 

  updater.init();
  
  updater.on('available', (task) => {
    console.log('available', task);
  });
  
  updater.on('not-available', (task) => {
    console.log('not-available', task);
  });
  
  updater.on('progress', (task, p) => {
    console.log(task.name, p);
  });
  
  updater.on('downloaded', (task) => {
    console.log('downloaded', task);
  });
  
  updater.on('completed', (manifest, tasks) => {
	
	
	if ((manifest[0]) && (manifest[0].from != undefined)) {
	    updateManifest = manifest[0];
	    setApplicationMenu(true);
	} else {
		console.log("missing manifest %s",JSON.stringify(manifest[0]));
	}
    console.log('completed', manifest, tasks);
  });
  
  updater.on('error', (err) => {
    console.error(err);
  });
  
  updater.setFeedURL('', updateURL);
});

electron.app.on('window-all-closed', () => {
  electron.app.quit();
});

}());
//# sourceMappingURL=background.js.map