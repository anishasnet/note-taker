const express = require('express');
const fs = require('fs');
const path = require('path'); 
const app = express(); 

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded ( { extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"))
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
}); 

app.get('/api/notes', (req, res) => {
    return res.sendFile(path.join(__dirname, '/db/', 'db.json'));
});

function checkNote (noteToCheck) {
    if (noteToCheck.title == null|| typeof noteToCheck.title !== 'string') {
        return false; 
    }
    if (noteToCheck.text == null|| typeof noteToCheck.text !== "string") {
        return false;
    }
    else {
        return true;
    }
};

app.post('/api/notes', (req, res) => {
    let note = req.body;
    let allNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (allNotes.length).toString();
    if (checkNote(note) == false) {
        res.status(400).send('The note is invalid. Try again.');
    }
    else {
        //note.id = noteId;
        allNotes.push(note);
        fs.writeFileSync("./db/db.json", JSON.stringify(allNotes));
        res.json(allNotes);
    }
});

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
});

