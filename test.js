
const sqlite3 = require('sqlite3').verbose();
function setupTestRoutes(app) {

// Connect to an in-memory SQLite database
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the in-memory SQlite database.');
  }
});

// Create the test_table
db.run('CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)', (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Created test_table in the in-memory database.');
    }
  });
  
//Test Insert Data into table
app.post('/insert', (req, res) => {
    const { name } = req.body;
    db.run(`INSERT INTO test_table(name) VALUES(?)`, [name], function(err) {
      if (err) {
        res.status(400).send(`Error: ${err.message}`);
        return;
      }
      res.send(`A row has been inserted with rowid ${this.lastID}`);
    });
  });

//Test Delete Data from table
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM test_table WHERE id = ?`, id, function(err) {
      if (err) {
        res.status(400).send(`Error: ${err.message}`);
        return;
      }
      if (this.changes > 0) {
        res.send('Test Successful');
      } else {
        res.send('No row found with the given ID');
      }
    });
  });

}
module.exports = setupTestRoutes;
