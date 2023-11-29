const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the in-memory SQLite database.');
    }
});

// Function to create the dungeon table
function createDungeonTable() {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS dungeon (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            row INTEGER,
            col INTEGER,
            type TEXT
        );
    `;

    return new Promise((resolve, reject) => {
        db.run(createTableSql, (err) => {
            if (err) {
                reject(err.message);
            } else {
                resolve('Dungeon table created');
            }
        });
    });
}

function generateDungeon(rows, cols, numberOfRooms, roomSizeRange) {
    let dungeonData = [];

    // Initialize all cells as empty
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            dungeonData.push({ row: r, col: c, type: 'empty' });
        }
    }

    let rooms = [];
    let size = roomSizeRange; // Maximum room size
    let sizeMin = 6; // Minimum room size

    for (let i = 0; i < numberOfRooms; i++) {
        let roomWidth = Math.floor(Math.random() * (size - sizeMin + 1)) + sizeMin;
        let roomHeight = Math.floor(Math.random() * (size - sizeMin + 1)) + sizeMin;
        let x = Math.floor(Math.random() * (cols - roomWidth));
        let y = Math.floor(Math.random() * (rows - roomHeight));
        let newRoom = { x, y, w: roomWidth, h: roomHeight };

        let collide = rooms.some(room => {
            return (newRoom.x < room.x + room.w && newRoom.x + newRoom.w > room.x &&
                    newRoom.y < room.y + room.h && newRoom.y + newRoom.h > room.y);
        });

        if (!collide) {
            rooms.push(newRoom);
            // Mark room cells
            for (let rx = x; rx < x + roomWidth; rx++) {
                for (let ry = y; ry < y + roomHeight; ry++) {
                    let index = ry * cols + rx;
                    dungeonData[index].type = 'room';
                }
            }
        }
    }

    // Connect rooms with corridors
    for (let i = 1; i < rooms.length; i++) {
        let roomA = rooms[i - 1];
        let roomB = rooms[i];
        let x1 = roomA.x + Math.floor(roomA.w / 2);
        let y1 = roomA.y + Math.floor(roomA.h / 2);
        let x2 = roomB.x + Math.floor(roomB.w / 2);
        let y2 = roomB.y + Math.floor(roomB.h / 2);

        if (Math.random() > 0.5) {
            hCorridor(dungeonData, cols, x1, x2, y1);
            vCorridor(dungeonData, cols, y1, y2, x2);
        } else {
            vCorridor(dungeonData, cols, y1, y2, x1);
            hCorridor(dungeonData, cols, x1, x2, y2);
        }
    }

    return dungeonData;
}

function hCorridor(dungeonData, cols, x1, x2, y) {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        let index = y * cols + x;
        if (dungeonData[index].type === 'empty') {
            dungeonData[index].type = 'corridor';
        }
    }
}

function vCorridor(dungeonData, cols, y1, y2, x) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        let index = y * cols + x;
        if (dungeonData[index].type === 'empty') {
            dungeonData[index].type = 'corridor';
        }
    }
}


// Function to save dungeon data to the database
function saveDungeonData(dungeonData) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('DELETE FROM dungeon');

            let insertStmt = db.prepare('INSERT INTO dungeon (row, col, type) VALUES (?, ?, ?)');
            for (let cell of dungeonData) {
                insertStmt.run(cell.row, cell.col, cell.type);
            }
            insertStmt.finalize();

            resolve('Dungeon data saved to database');
        });
    });
}

module.exports = {
    createDungeonTable,
    generateDungeon,
    saveDungeonData
};