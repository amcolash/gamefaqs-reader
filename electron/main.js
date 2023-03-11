import { app, BrowserWindow } from 'electron';

app.whenReady().then(() => {
  const win = new BrowserWindow();

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile('build/dist/index.html');
  }
});
