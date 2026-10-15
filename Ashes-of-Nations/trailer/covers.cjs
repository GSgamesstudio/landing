const {app,BrowserWindow}=require('electron');
const path=require('node:path');
app.whenReady().then(async()=>{
  const win=new BrowserWindow({width:1920,height:1080,show:false,webPreferences:{offscreen:true,nodeIntegration:true,contextIsolation:false,webSecurity:false}});
  await win.loadFile(path.join(__dirname,'covers.html'));
  const result=await win.webContents.executeJavaScript('window.renderCovers()');
  console.log(JSON.stringify(result,null,2));win.destroy();app.quit();
}).catch(error=>{console.error(error);app.exit(1);});
