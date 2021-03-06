/* Dependencies */
const express = require('express');
const fs = require('fs');
const path = require('path'); 
const app = express(); 

/* Create local host port */
const PORT = process.env.PORT || 3001;

/* Middleware */
app.use(express.urlencoded ( { extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

/* HTML routes */
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"))
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
}); 

/* API routes */
app.get('/api/notes', (req, res) => {
    return res.sendFile(path.join(__dirname, '/db/', 'db.json'));
});

/* Checks if note has valid content */
function checkNote (noteToCheck) {
    if (!noteToCheck.title || typeof noteToCheck.title !== 'string') {
        return false; 
    }
    if (!noteToCheck.text || typeof noteToCheck.text !== "string") {
        return false;
    }
    else {
        return true;
    }
};

/* API route to post the note */
app.post('/api/notes', (req, res) => {
    let note = req.body;
    let allNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (allNotes.length).toString();
    if (checkNote(note) == false) {
        res.status(400).send('The note is invalid. Try again.');
    }
    else {
        note.id = noteId;
        allNotes.push(note);
        fs.writeFileSync("./db/db.json", JSON.stringify(allNotes));
        res.json(allNotes);
    }
});

/* API route to delete a given note */
app.delete('/api/notes/:id', (req, res) => {
    let allNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let toDeleteId = req.params.id;
    let newId = 0;
    allNotes = allNotes.filter(note => {
        return note.id != toDeleteId;
    });
    for (note of allNotes) {
        note.id = newId.toString();
        newId++;
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(allNotes));
    res.json(allNotes);
});

/* Port is launched for server */
app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
});

