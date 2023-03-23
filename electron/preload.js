const { app, contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  cookie: () => ipcRenderer.invoke('cookie'),
  games: (search) => ipcRenderer.invoke('games', search),
  guides: (id) => ipcRenderer.invoke('guides', id),
  guide: (gameId, guideId) => ipcRenderer.invoke('guide', gameId, guideId),
  removeGuide: (gameId, guideId) => ipcRenderer.invoke('removeGuide', gameId, guideId),
  exit: () => ipcRenderer.invoke('quit'),
});
