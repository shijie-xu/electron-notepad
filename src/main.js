import { app, BrowserWindow } from 'electron';
import { Menu, MenuItem, diag, ipcMain } from 'electron';
import { appMenuTemplate } from './appmenu.js';

let safeExit = false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  // Create menu
  const menu = Menu.buildFromTemplate(appMenuTemplate);
  menu.items[0].submenu.append(new MenuItem({
    label : "New",
    click(){
      mainWindow.webContents.send('action', 'new');
    },
    accelerator: 'CmdOrCtrl+N'
  }));
  menu.items[0].submenu.append(new MenuItem({
    label : "Open",
    click(){
      mainWindow.webContents.send('action', 'open');
    },
    accelerator: 'CmdOrCtrl+O'
  }));
  menu.items[0].submenu.append(new MenuItem({
    label: "Save",
    click(){
      mainWindow.webContents.send('action', 'save');
    },
    accelerator: 'CmdOrCtrl+S'
  }));
  menu.items[0].submenu.append(new MenuItem({
    role: 'quit'
  }));
  Menu.setApplicationMenu(menu);

  mainWindow.on('close', (e)=>{
    if(!safeExit){
      e.preventDefault();
      mainWindow.webContents.send('action', 'exiting');
    }
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('reqaction', (event,arg)=>{
  switch(arg){
    case 'exit':
      safeExit = true;
      app.quit();
      break;
  }
});