const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  cookie: () => ipcRenderer.invoke('cookie'),
  games: (search) => ipcRenderer.invoke('games', search),
  guides: (id) => ipcRenderer.invoke('guides', id),
  guide: (gameId, guideId) => ipcRenderer.invoke('guide', gameId, guideId),
  htmlGuide: (gameId, guideId, guidePage) => ipcRenderer.invoke('htmlGuide', gameId, guideId, guidePage),
  removeGuide: (gameId, guideId) => ipcRenderer.invoke('removeGuide', gameId, guideId),
  version: () => ipcRenderer.invoke('version'),
  exit: () => ipcRenderer.invoke('quit'),
  update: () => ipcRenderer.invoke('update'),
  steamdeck: () => ipcRenderer.invoke('steamdeck'),

  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  onFocusChange: (callback) => ipcRenderer.on('focus-change', callback),
});
