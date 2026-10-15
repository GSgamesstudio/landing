const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');

const root = path.resolve(__dirname, '..');
const out = path.join(__dirname, 'stills');
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  await fs.mkdir(out, { recursive: true });
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    backgroundColor: '#0d1115',
    webPreferences: { offscreen: true, webSecurity: false, backgroundThrottling: false },
  });
  win.webContents.on('console-message', (_event, level, message) => {
    if (level >= 2) console.log('PAGE:', message);
  });
  await win.loadFile(path.join(root, 'index.html'));
  await pause(2500);
  async function shot(name) {
    const image = await win.webContents.capturePage();
    await fs.writeFile(path.join(out, `${name}.png`), image.toPNG());
    console.log('saved', name);
  }
  async function click(selector) {
    await win.webContents.executeJavaScript(`document.querySelector(${JSON.stringify(selector)})?.click()`);
    await pause(900);
  }
  await shot('01-menu');
  await click('#playButton');
  await shot('02-setup');
  const info = await win.webContents.executeJavaScript(`({maps:[...document.querySelectorAll('#mapsList > *')].slice(0,12).map(x=>({text:x.innerText.slice(0,100),html:x.outerHTML.slice(0,350)})),scenarios:[...document.querySelectorAll('#scenariosList > *')].slice(0,8).map(x=>x.innerText.slice(0,100))})`);
  console.log(JSON.stringify(info, null, 2));
  await click('#scenariosList > :nth-child(3)');
  await shot('03-scenario-1914');
  const countries = await win.webContents.executeJavaScript(`([...document.querySelectorAll('#countriesList > *')].slice(0,8).map(x=>({text:x.innerText.slice(0,90),html:x.outerHTML.slice(0,250)})))`);
  console.log('countries', JSON.stringify(countries, null, 2));
  await click('#startGameButton');
  await pause(9000);
  await shot('04-game-start');
  const game = await win.webContents.executeJavaScript(`({screen:document.querySelector('.screen.active')?.id,tabs:[...document.querySelectorAll('#strategyTabs button')].map(x=>({tab:x.dataset.tab,text:x.innerText,hidden:x.hidden})),content:document.querySelector('#strategyContent')?.innerText.slice(0,300)})`);
  console.log('game', JSON.stringify(game, null, 2));
  for (const tab of ['focuses', 'production', 'foreign', 'wars', 'army']) {
    await click(`[data-tab="${tab}"]`);
    await shot(`05-${tab}`);
  }
  await click('[data-tab="army"]');
  await pause(1500);
  await shot('06-map-1914');
  await click('#leaveGameButton');
  await click('#playButton');
  await click('#mapsList [data-file="мир.json"]');
  await pause(1800);
  const worldScenarios = await win.webContents.executeJavaScript(`([...document.querySelectorAll('#scenariosList > *')].slice(0,30).map((x,i)=>({i,text:x.innerText.slice(0,60)})))`);
  console.log('world scenarios', JSON.stringify(worldScenarios));
  await click('#startGameButton');
  await pause(15000);
  await click('[data-tab="focuses"]');
  await shot('07-map-2026');
  await click('[data-tab="foreign"]');
  await shot('08-diplomacy-2026');
  win.destroy();
  app.quit();
}

app.whenReady().then(run).catch((error) => { console.error(error); app.exit(1); });
