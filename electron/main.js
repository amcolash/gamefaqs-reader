import { app, BrowserWindow } from 'electron';
import windowStateKeeper from 'electron-window-state';

app.whenReady().then(() => {
  const PROD = app.isPackaged;

  // Init window state manager
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  let prodOptions = { fullscreen: true };
  let devOptions = { x: mainWindowState.x, y: mainWindowState.y, width: mainWindowState.width, height: mainWindowState.height };

  // Open window in fullscreen in production mode, open maximized in dev
  const win = new BrowserWindow(PROD ? prodOptions : devOptions);

  // Keep track of the window state
  if (!PROD) mainWindowState.manage(win);

  // Bypass CORS, from: https://stackoverflow.com/a/56376799/2303432
  const filter = {
    urls: ['https://gamefaqs.gamespot.com/*'],
  };

  win.webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders['Origin'] = null;
    details.headers['Origin'] = null;
    callback({ requestHeaders: details.requestHeaders });
  });

  // Load index page
  if (PROD) {
    win.loadFile('build/dist/index.html');
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
