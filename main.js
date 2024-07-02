const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const fs = require('node:fs')

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

ipcMain.on('save-note', (event, note) => {
    fs.appendFile("note.txt", note + '\n', 'utf8', (err) => {
        if (err) throw err;
        console.log("Le fichier a été mis à jour");
    });
});

ipcMain.on('get-notes', (event) => {
    const filePath = "note.txt";

    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                event.reply('notes', []);
                throw err;
            }
            const notes = data.split('\n').filter(note => note.trim() !== '');
            event.reply('notes', notes);
        });
    } else {
        event.reply('notes', []);
    }
});

ipcMain.on('delete-note', (event, note) => {
    fs.readFile("note.txt", 'utf8', (err, data) => {
        if (err) throw err;
        const notes = data.split('\n').filter(note => note.trim() !== '');
        if (notes.includes(note)) {
            const newNotes = notes.filter(n => n !== note);
            fs.writeFile("note.txt", newNotes.join('\n'), 'utf8', (err) => {
                if (err) throw err;
                console.log("Le fichier a été mis à jour");
            });
        } else {
            console.error('Note non trouvée:', note);
        }
    });
});