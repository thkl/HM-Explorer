// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path';
import url from 'url';
import { app, Menu,dialog} from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';
const updater = require('asar-updater')
// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';
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
        }
        
        dialog.showMessageBox(focusedWindow, options, function () {})
     }
    } 
   },
   {label : 'Version ' + pjson.version},
   {label: 'Check for Updates',click: () => {updater.checkForUpdates()}},
   {label: 'Quit',accelerator: 'CmdOrCtrl+Q',click: () => {app.quit();},
  }],
 };


  const menus = [mainMenuTemplate,editMenuTemplate];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  
  if (update) {
	menus.push({label: 'Update', submenu: [{label: 'Update HM Explorer', click: () => {
      console.log("Update pressed")
      if ((updateManifest.from) && (updateManifest.to)) {
	      const FileSystem = require('original-fs')
	      var dest = updateManifest.to
		  if (!dest.endsWith('/app.asar')) {
			  dest = dest + '/app.asar'
		  }
		  
		  try {
			  console.log('Unlink %s',dest)
            FileSystem.unlink(dest, function (err) {
                if (err) {
                    console.error(err)
                }
            })
		  } catch (error) {
             console.error(error)
          }
		  
		  try {
			  console.log('Move %s to %s',updateManifest.from , dest)
            FileSystem.rename(updateManifest.from, dest, function (err) {
                if (err) {
                    console.error(err)
                }
                console.log('Restart')
                updater.quitAndInstall(1000)
            })

        } catch (error) {
             console.error(error)
        }
        
      }
    }
  }]})
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};


// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath} (${env.name})`);
}

app.on('ready', () => {
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
 
  const updateURL = 'https://github.com/thkl/HM-Explorer/raw/master/dist/update.json?d=' + String(Math.random()); 

  updater.init()
  
  updater.on('available', (task) => {
    console.log('available', task)
  })
  
  updater.on('not-available', (task) => {
    console.log('not-available', task)
  })
  
  updater.on('progress', (task, p) => {
    console.log(task.name, p)
  })
  
  updater.on('downloaded', (task) => {
    console.log('downloaded', task)
  })
  
  updater.on('completed', (manifest, tasks) => {
	
	
	if ((manifest[0]) && (manifest[0].from != undefined)) {
	    updateManifest = manifest[0]
	    setApplicationMenu(true);
	} else {
		console.log("missing manifest %s",JSON.stringify(manifest[0]))
	}
    console.log('completed', manifest, tasks)
  })
  
  updater.on('error', (err) => {
    console.error(err)
  })
  
  updater.setFeedURL('', updateURL)
});

app.on('window-all-closed', () => {
  app.quit();
});
