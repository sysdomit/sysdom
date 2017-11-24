const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;

const ipcMain = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
var mainWindow = null;
var canExit = true;
var openFile = false;


ipcMain.on('synchronous-message', function(event, arg) {
 if(arg == "forcing-quit"){  // prints "ping"
   canExit = true;
   app.quit();
 }
});

app.on('open-file', function(event, pathToOpen) {

 openFile = true;

 // respond to the process...
 ipcMain.on('synchronous-message', function(event, arg) {  
   if(arg == "starts-whit-path")
     event.returnValue = pathToOpen;
 });

});

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600, title : "Pingendo", "webPreferences": {
      "webSecurity": false
  }});


  // and load the index.html of the app.
  // win.loadURL(`file://${__dirname}/index.html`);
  // win.loadURL('http://localhost:5000/editor.html');
  // win.loadURL('http://192.168.63.1:5000/editor.html');
  win.loadURL('https://pingendo.com/editor.html');
    // win.loadURL('http://192.168.1.73:5000/index.html');

  // Open the DevTools.
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', (event) => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });


  win.on('close', function(event){
     if(!canExit){
       event.preventDefault();
       win.webContents.send('before-quit','');
     }
  })


  ipcMain.on('synchronous-message', function(event, arg) {
   if(arg == "setCanExitFalse"){  // prints "ping"
     canExit = false;
     event.returnValue = "";
   }
  });

  if(!openFile){
    // respond to the process...
    ipcMain.on('synchronous-message', function(event, arg) {
       if(arg == "starts-whit-path")
         event.returnValue = null;
    });
  }
}

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
  if (win === null) {
    createWindow();
  }
});