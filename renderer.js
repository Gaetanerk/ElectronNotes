const note = document.getElementById('note');
note.focus();

document.getElementById('save').addEventListener('click', (event) => {
    event.preventDefault();
    if (note.value.trim()) {
        window.electron.saveNote(note.value);
        note.value = '';
        loadNotes();
    }
    note.focus();
});

function loadNotes() {
    window.electron.getNotes();
}

const notesArray = [];

window.electron.notesForList((notes) => {
    const notesList = document.getElementById('notesListe');
    const noFile = document.getElementById('noFile');
    const moyenneElement = document.getElementById('moyenne');
    notesList.innerHTML = '';
    noFile.innerHTML = '';
    notesArray.length = 0;

    if (notes.length === 0) {
        const noNotesMessage = document.createElement('p');
        noNotesMessage.textContent = 'Pas de note enregistrée';
        noFile.appendChild(noNotesMessage);
        moyenneElement.textContent = '';
    } else {
        notes.forEach(note => {
            const li = document.createElement('li');
            li.textContent = note;
            notesList.appendChild(li);
            notesArray.push(parseInt(note, 10));

            const delBtn = document.createElement('button');
            delBtn.textContent = 'Supprimer';
            li.appendChild(delBtn);

            delBtn.addEventListener('click', () => {
                window.electron.deleteNote(note);
                li.remove();
                const index = notesArray.indexOf(parseInt(note, 10));
                if (index > -1) {
                    notesArray.splice(index, 1);
                }
                if (notesList.children.length === 0) {
                    const noNotesMessage = document.createElement('p');
                    noNotesMessage.textContent = 'Pas de note enregistrée';
                    noFile.appendChild(noNotesMessage);
                }
                updateMoyenne();
            });
        });
        updateMoyenne();
    }
});

function updateMoyenne() {
    const moyenneElement = document.getElementById('moyenne');
    if (notesArray.length > 0) {
        const moyenne = notesArray.reduce((a, b) => a + b, 0) / notesArray.length;
        moyenneElement.textContent = `Moyenne: ${moyenne.toFixed(2)}`;
    } else {
        moyenneElement.textContent = 'Moyenne: 0';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});
