const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  cookie: () => ipcRenderer.invoke('cookie'),
});
