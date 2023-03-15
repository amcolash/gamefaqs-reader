const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  cookie: () => ipcRenderer.invoke('cookie'),
  games: (search) => ipcRenderer.invoke('games', search),
  guides: (id) => ipcRenderer.invoke('guides', id),
});
