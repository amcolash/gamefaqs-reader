import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import windowStateKeeper from 'electron-window-state';
import { join } from 'path';
import { parse as parseCookie, splitCookiesString } from 'set-cookie-parser';
import { cookieKey, store } from './store';
import { getGames, getGuide, getGuides, removeGuide } from './api';
import { readdirSync, rmSync, statSync } from 'fs';
import { execSync } from 'child_process';

const PROD = app.isPackaged;
const LOG_DIR = app.getPath('logs');
const PUBLIC_DIR = PROD ? join(__dirname, '../dist/') : join(__dirname, '../../public/');

// Clean logs before making new ones
cleanLogs();

// Electron logs are sent to a log file
const time = Date.now();
log.transports.file.resolvePath = () => join(LOG_DIR, `${time}_node.log`);
Object.assign(console, log.functions);

// For now disable electron security warnings and turn on logging in console/file
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
process.env.ELECTRON_ENABLE_LOGGING = true;
process.env.ELECTRON_LOG_FILE = join(LOG_DIR, `${time}_browser.log`);

// Keep track of window
let win;

// Once app is initialized, create window and set up things
app.whenReady().then(async () => {
  console.log(`GameFAQs Reader, version ${app.getVersion()}`);

  createWindow();

  initIpc();
  initUpdater();
  initShortcuts();

  // Move mouse out of the way on start
  setTimeout(() => {
    try {
      execSync('export DISPLAY=:1; xdotool mousemove 1280 800');
    } catch (err) {
      console.error(err);
    }
  }, 2000);
});

function createWindow() {
  // Init window state manager
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  let prodOptions = { fullscreen: process.env.FULLSCREEN !== 'false' };
  let devOptions = { x: mainWindowState.x, y: mainWindowState.y, width: mainWindowState.width, height: mainWindowState.height };

  // Open window in fullscreen in production mode, open maximized in dev
  win = new BrowserWindow({
    ...(PROD ? prodOptions : devOptions),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
    title: `GameFAQs Reader - ${app.getVersion()}`,
    icon: join(PUBLIC_DIR, '/icon/256x256.png'),
  });

  // Keep track of the window state
  if (!PROD) mainWindowState.manage(win);

  // Load index page
  if (PROD) {
    win.loadFile(join(PUBLIC_DIR, 'index.html'));
  } else {
    console.log(`Server Url: ${process.env.VITE_DEV_SERVER_URL}`);
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
  ipcMain.handle('version', (event) => app.getVersion());
  ipcMain.handle('quit', (event) => app.exit());
  ipcMain.handle('update', (event) => autoUpdater.quitAndInstall());
}

function initUpdater() {
  // Set up auto updater logging
  autoUpdater.logger = log;

  // Check for updates on startup
  autoUpdater.checkForUpdates();

  // Notify renderer if update is downloaded
  autoUpdater.on('update-downloaded', (info) => win.webContents.send('update-downloaded', { version: info.version }));
}

function initShortcuts() {
  // Add F12 shortcut to open dev tools
  globalShortcut.register('F12', () => {
    win.webContents.toggleDevTools();
  });
}

// Remove logs older than a week
function cleanLogs() {
  const week = 1000 * 60 * 60 * 24 * 7;

  const files = readdirSync(LOG_DIR);
  files.forEach((f) => {
    const file = join(LOG_DIR, f);
    const stats = statSync(file);
    if (Date.now() > new Date(stats.ctime).getTime() + week) rmSync(file);
  });
}
