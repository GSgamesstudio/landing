const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');

app.whenReady().then(async () => {
  const shorts=process.argv.includes('--shorts');
  const width=shorts?1080:1920,height=shorts?1920:1080;
  const win = new BrowserWindow({ width, height, show: false,
    webPreferences: { offscreen: true, nodeIntegration: true, contextIsolation: false, webSecurity: false } });
  await win.loadFile(path.join(__dirname, shorts?'shorts.html':'montage.html'));
  const times = [2, 9, 17, 27, 38, 42];
  await win.webContents.executeJavaScript(`(async()=>{
    const video=document.createElement('video');
    video.src=${JSON.stringify(shorts?'Ashes-of-Nations-Shorts.mp4':'Ashes-of-Nations-trailer.mp4')};
    await new Promise((resolve,reject)=>{video.onloadedmetadata=resolve;video.onerror=reject;});
    window.reviewVideo=video;
  })()`);
  console.log('duration', await win.webContents.executeJavaScript('window.reviewVideo.duration'));
  for (const time of times) {
    const result = await win.webContents.executeJavaScript(`(async()=>{
      const video=window.reviewVideo;
      await new Promise(resolve=>{video.onseeked=resolve;video.currentTime=${time};});
      await video.play();
      await new Promise(resolve=>setTimeout(resolve,180));
      video.pause();
      const canvas=document.getElementById('frame');
      canvas.getContext('2d').drawImage(video,0,0,${width},${height});
      return {current:video.currentTime,image:canvas.toDataURL('image/png').split(',')[1],videoWidth:video.videoWidth,videoHeight:video.videoHeight};
    })()`);
    await fs.writeFile(path.join(__dirname, `review-${shorts?'shorts-':''}${time}.png`), Buffer.from(result.image,'base64'));
    console.log('reviewed', time, 'actual', result.current, 'frame', result.videoWidth, result.videoHeight);
  }
  win.destroy(); app.quit();
}).catch((error) => { console.error(error); app.exit(1); });
