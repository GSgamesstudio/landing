const {app,BrowserWindow}=require('electron');
const path=require('node:path');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
app.whenReady().then(async()=>{
  const shorts=process.argv.includes('--shorts');
  const win=new BrowserWindow({width:shorts?1080:1920,height:shorts?1920:1080,show:false,backgroundColor:'#080d12',webPreferences:{offscreen:true,nodeIntegration:true,contextIsolation:false,webSecurity:false,backgroundThrottling:false}});
  win.webContents.on('console-message',(_event,level,message)=>{if(level>=2)console.error('PAGE:',message);});
  await win.loadFile(path.join(__dirname,shorts?'shorts.html':'montage.html'));
  const musicArg=process.argv.slice(2).find(arg=>arg!=='--shorts');
  const music=musicArg?path.resolve(musicArg):null;
  const result=await win.webContents.executeJavaScript(`window.renderTrailer(${JSON.stringify({music})})`);
  console.log(JSON.stringify(result,null,2));
  win.destroy(); app.quit();
}).catch(error=>{console.error(error);app.exit(1);});
