const mysql = require('mysql2')
const fs = require('fs')
const path = require('path')

const db = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'password',
  multipleStatements: true
});

db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to MySQL server');
    initializeDatabase();
  }
});

const initializeDatabase = () => {
  const sqlFilePath = path.join(__dirname, 'init.sql');
  console.log('SQL file path:', sqlFilePath);

  try {
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    db.query(sql, (err, result) => {
      if (err) {
        console.error('Failed to execute SQL script:', err.message);
        process.exit(1);
      } else {
        console.log('Database initialized successfully');
        // Switch to the new database
        db.changeUser({ database: 'library_books_service' }, (err) => {
          if (err) {
            console.error('Failed to switch database:', err.message);
            process.exit(1);
          } else {
            console.log('Switched to library_books_service database');
          }
        });
      }
    });
  } catch (fileErr) {
    console.error('Failed to read SQL file:', fileErr.message);
    process.exit(1);
  }
};

module.exports = db;