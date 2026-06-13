const { app, BrowserWindow } = require('electron')
const { spawn } = require('child_process')
const path = require('path')


function startBackend() {
  const backendFolder = app.isPackaged
    ? path.join(process.resourcesPath, 'backend')  
    : path.join(__dirname, '..', 'backend')        

  spawn('node', ['server.js'], {   
    cwd: backendFolder,
    env: { ...process.env, PORT: '5000' }
  })
}


function createWindow() {
  const win = new BrowserWindow({ 
    width: 1200, 
    height: 800 
  })

 
  win.loadFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'))
}


app.whenReady().then(() => {
  startBackend()
  
  
  setTimeout(createWindow, 3000)
})


app.on('window-all-closed', () => app.quit())