// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path';
import url from 'url';
import { remote,app, Menu,dialog, Tray } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';
const updater = require('asar-updater')



// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

var pjson = require(__dirname +'/../package.json');
var updateManifest;
let appIcon = null
var mainWindow;
var appShouldClose = false

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
   {label: 'Quit',accelerator: 'CmdOrCtrl+Q',click: () => {appShouldClose=true;app.quit();},
  }],
 };


  const menus = [mainMenuTemplate,editMenuTemplate];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  
  if (update) {
	menus.push({label: 'Update', submenu: [{label: 'Update HM Explorer'  , click: () => {
      console.log("Update pressed")
      if ((updateManifest.from) && (updateManifest.to)) {
	      const FileSystem = require('original-fs')
	      var dest = updateManifest.to
		  if (!dest.endsWith(path.sep  + 'app.asar')) {
			  dest = dest + path.sep +'app.asar'
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
  }]}
  )
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


const buildMainWindow = () => {
  mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    minWidth:1000,
    minHeight:600
  });
  
   // Build Main Window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    title: "Homematic Explorer",
    slashes: true,
  }));
}


app.on('ready', () => {
  setApplicationMenu();
  console.log('Path Delimiter %s',path.sep)
  buildMainWindow()  



  // set Tray Menu
  const iconPath = path.join(__dirname,'img',(process.platform === 'win32') ? 'win':'mac','iconTemplate.png')
  appIcon = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
  {
    label: 'Homematic Explorer',
    click: function () {
	    if (mainWindow) {
	  mainWindow.show()
		    
	    } else {
		  buildMainWindow()  
	    }
    }
  },
  {
    label: 'Homematic WebGUI',
    click: function () {
	   let web = mainWindow.webContents;
       web.send('open_ccu_url','http://$ccuhost$/')
    }
  },
  {
    label: 'Beenden',
    click: function () {
	  appShouldClose = true
      app.quit()
    }
  }])
  
  appIcon.setToolTip('Homematic Explorer')
  appIcon.setContextMenu(contextMenu)  

 
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
		dialog.showMessageBox(mainWindow,{
          type: 'info',
          title: 'You are up todate',
          buttons: ['Yihaa !'],
          message: 'You are running the latest and greatest version of Homematic Explorer.'
        })
	}
    console.log('completed', manifest, tasks)
  })
  
  updater.on('error', (err) => {
    console.error(err)
  })
  
  updater.setFeedURL('', updateURL)
});


app.on('before-quit', () => {
  appShouldClose=true;
  
});



app.on('will-quit', () => {
  console.log('will-quit')
});

app.on('window-all-closed', () => {
	if (appShouldClose) {
		app.quit();
	}
	mainWindow = null
})


const ipc = require('electron').ipcMain

ipc.on('http_error', function (event, arg) {
  dialog.showMessageBox(mainWindow,{
          type: 'error',
          title: 'Uhhhh',
          buttons: ['That sucks !'],
          message: 'Error while connecting to ccu.'
  })
})
