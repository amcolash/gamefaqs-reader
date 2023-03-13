import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import windowStateKeeper from 'electron-window-state';
import { join } from 'path';
import { parse as parseCookie, splitCookiesString } from 'set-cookie-parser';

const PROD = app.isPackaged;
let win;

// For now disable electron security warnings and turn on logging in console
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
process.env.ELECTRON_ENABLE_LOGGING = true;

app.whenReady().then(async () => {
  await installExtentions();
  createWindow();
  bypassCORS();
  initIpc();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

async function installExtentions() {
  if (!PROD) {
    try {
      await installExtension(REACT_DEVELOPER_TOOLS);
      console.log('Installed dev tools');
    } catch (err) {
      console.error('An error occurred installing extensions: ', err);
    }
  }
}

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

// Bypass CORS, from: https://pratikpc.medium.com/bypassing-cors-with-electron-ab7eaf331605
function bypassCORS() {
  const filter = {
    urls: ['https://gamefaqs.gamespot.com/*'],
  };

  win.webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    callback({ requestHeaders: { ...details.requestHeaders, Origin: '*' } });
  });

  win.webContents.session.webRequest.onHeadersReceived(filter, (details, callback) => {
    details.responseHeaders['Access-Control-Allow-Origin'] = ['*'];
    details.responseHeaders['Access-Control-Allow-Headers'] = ['*, set-cookie'];
    details.responseHeaders['Access-Control-Expose-Headers'] = ['*, set-cookie'];

    details.responseHeaders['set-cookie'].forEach((c) => `${c}; SameSite=None;`);

    callback({
      responseHeaders: { ...details.responseHeaders },
    });
  });
}

function initIpc() {
  ipcMain.on('fetch', async (event, arg) => {
    try {
      console.log(arg);
      const res = await (await fetch(arg)).headers.get('Set-Cookie');

      event.returnValue = { res };
    } catch (err) {
      event.returnValue = { error: true, message: err };
    }
  });

  ipcMain.handle('cookie', async (event, arg) => {
    try {
      const res = await fetch('https://gamefaqs.gamespot.com/');
      const split = splitCookiesString(res.headers.get('set-cookie'));

      return parseCookie(split, { map: true }).gf_dvi;
    } catch (err) {
      return { err };
    }
  });
}
