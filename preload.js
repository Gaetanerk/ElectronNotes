const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  saveNote: (note) => ipcRenderer.send('save-note', note),
  getNotes: () => ipcRenderer.send('get-notes'),
  deleteNote: (note) => ipcRenderer.send('delete-note', note),
  notesForList: (callback) => ipcRenderer.on('notes', (event, notes) => callback(notes))
});