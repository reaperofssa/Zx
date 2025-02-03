const express = require('express');
const path = require('path');

const app = express();
const PORT = 6471;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/models/character.fbx', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', './models/character.fbx'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});