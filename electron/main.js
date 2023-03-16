import { app, BrowserWindow, ipcMain } from 'electron';
import windowStateKeeper from 'electron-window-state';
import { join } from 'path';
import { parse as parseCookie, splitCookiesString } from 'set-cookie-parser';
import { cookieKey, store } from './store';
import { getGames, getGuide, getGuides, removeGuide } from './api';

const PROD = app.isPackaged;
let win;

// For now disable electron security warnings and turn on logging in console
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
process.env.ELECTRON_ENABLE_LOGGING = true;

app.whenReady().then(async () => {
  createWindow();
  initIpc();
});

function createWindow() {
  // Init window state manager
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  let prodOptions = { fullscreen: true };
  let devOptions = { x: mainWindowState.x, y: mainWindowState.y, width: mainWindowState.width, height: mainWindowState.height };

  // Open window in fullscreen in production mode, open maximized in dev
  win = new BrowserWindow({
    ...(PROD ? prodOptions : devOptions),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  // Keep track of the window state
  if (!PROD) mainWindowState.manage(win);

  // Load index page
  if (PROD) {
    win.loadFile('build/dist/index.html');
  } else {
    console.log(process.env.VITE_DEV_SERVER_URL);
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  }
}

function initIpc() {
  ipcMain.handle('cookie', async (event, arg) => {
    try {
      const existing = store.get(cookieKey);

      const week = 1000 * 60 * 60 * 24 * 7;
      if (existing && existing.expires && Date.now() + week < new Date(existing.expires).getTime()) {
        return existing;
      } else {
        const res = await fetch('https://gamefaqs.gamespot.com/');
        const split = splitCookiesString(res.headers.get('set-cookie') || '');

        const cookie = parseCookie(split, { map: true }).gf_dvi;
        store.set(cookieKey, cookie);
      }
    } catch (err) {
      console.error(err);
    }
  });

  ipcMain.handle('games', (event, search) => getGames(search));
  ipcMain.handle('guides', (event, id) => getGuides(id));
  ipcMain.handle('guide', (event, gameId, guideId) => getGuide(gameId, guideId));
  ipcMain.handle('removeGuide', (event, gameId, guideId) => removeGuide(gameId, guideId));
}
