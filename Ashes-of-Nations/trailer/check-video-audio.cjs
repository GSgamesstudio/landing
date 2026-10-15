const {app,BrowserWindow}=require('electron');
const path=require('node:path');
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
app.whenReady().then(async()=>{
  const shorts=process.argv.includes('--shorts');
  const win=new BrowserWindow({show:false,webPreferences:{offscreen:true,nodeIntegration:true,contextIsolation:false,webSecurity:false,backgroundThrottling:false}});
  await win.loadFile(path.join(__dirname,shorts?'shorts.html':'montage.html'));
  const result=await win.webContents.executeJavaScript(`(async()=>{
    const video=document.createElement('video');video.src=${JSON.stringify(shorts?'Ashes-of-Nations-Shorts.mp4':'Ashes-of-Nations-trailer.mp4')};
    await new Promise((resolve,reject)=>{video.onloadedmetadata=resolve;video.onerror=reject;});
    const ctx=new AudioContext();const source=ctx.createMediaElementSource(video),analyser=ctx.createAnalyser(),sink=ctx.createMediaStreamDestination();
    analyser.fftSize=4096;source.connect(analyser);analyser.connect(sink);await ctx.resume();
    const values=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(values);
    await video.play();await new Promise(resolve=>setTimeout(resolve,500));
    analyser.getFloatTimeDomainData(values);
    const rmsAtStart=Math.sqrt(values.reduce((sum,x)=>sum+x*x,0)/values.length);
    video.pause();
    await new Promise(resolve=>{video.onseeked=resolve;video.currentTime=38;});
    await video.play();await new Promise(resolve=>setTimeout(resolve,500));
    analyser.getFloatTimeDomainData(values);
    const rmsAt38Seconds=Math.sqrt(values.reduce((sum,x)=>sum+x*x,0)/values.length);
    video.pause();await ctx.close();
    return {duration:video.duration,width:video.videoWidth,height:video.videoHeight,audioTracks:sink.stream.getAudioTracks().length,rmsAtStart,rmsAt38Seconds};
  })()`);
  console.log(JSON.stringify(result,null,2));win.destroy();app.quit();
}).catch(error=>{console.error(error);app.exit(1);});
