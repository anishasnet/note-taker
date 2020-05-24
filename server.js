const express = require('express');
const fs = require('fs');
const path = require('path'); 
const app = express(); 

const PORT = process.env.PORT || 3001;



app.use(express.json());
app.use(express.urlencoded ( { extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"))
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
}); 

app.get('/api/notes', (req, res) => {
    return res.sendFile(path.join(__dirname, '/db/', 'db.json'));
});

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
});

