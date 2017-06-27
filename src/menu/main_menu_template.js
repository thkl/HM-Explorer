import { app, BrowserWindow } from 'electron';
const dialog = require('electron').dialog
var pjson = require(__dirname +'/../package.json');

export const mainMenuTemplate = {
  label: 'HM-Explorer',
  submenu: [{
    label: 'About',
    accelerator: '',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
	      
        const options = {
          type: 'info',
          title: 'About HM-Explorer',
          buttons: ['Covfefe !'],
          message: '(c) 2017 by thkl. https://github.com/thkl'
        }
        
        dialog.showMessageBox(focusedWindow, options, function () {})
     }
    } 
   },
   {
	 label : 'Version ' + pjson.version
   },
  {
    label: 'Quit',
    accelerator: 'CmdOrCtrl+Q',
    click: () => {
      app.quit();
    },
  }],
};
