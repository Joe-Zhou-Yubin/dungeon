const express = require('express');
const app = express();
const port = 3000;
const { createDungeonTable, generateDungeon, saveDungeonData } = require('./dungeon');

app.use(express.json()); // Middleware for JSON request parsing
let lastDungeonData = null;  // Initialize lastDungeonData

const cors = require('cors');
app.use(cors());

// Initialize dungeon table when the server starts
createDungeonTable()
    .then(msg => console.log(msg))
    .catch(err => console.error(err));

app.post('/generate-dungeon', async (req, res) => {
    try {
        const rows = 50;
        const cols = 50;
        const numberOfRooms = 10; 
        const roomSizeRange = 12;

        let dungeonData = generateDungeon(rows, cols, numberOfRooms, roomSizeRange);
        lastDungeonData = dungeonData; // Update lastDungeonData with the new dungeon
        await saveDungeonData(dungeonData);

        res.send('Dungeon generated and stored in database.');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/display-dungeon', (req, res) => {
    if (!lastDungeonData) {
        res.send('No dungeon data available. Please generate a dungeon first.');
        return;
    }

    let html = '<html><body><table style="border-collapse: collapse;">';

    for (let row = 0; row < 50; row++) {
        html += '<tr>';
        for (let col = 0; col < 50; col++) {
            let cellIndex = row * 50 + col;
            let cellType = lastDungeonData[cellIndex].type;
            let color = cellType === 'room' ? '#a52a2a' : (cellType === 'corridor' ? '#deb887' : '#ffffff');
            html += `<td style="width: 10px; height: 10px; border: 1px solid #000; background-color: ${color};"></td>`;
        }
        html += '</tr>';
    }

    html += '</table></body></html>';
    res.send(html);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
