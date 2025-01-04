const express = require('express');
const db = require('./db');

const app = express();
const PORT = 3002;

// Middleware to parse JSON bodies
app.use(express.json());

// GET all borrowed books
app.get('/', (req, res) => {
  console.log('Fetching all borrowed books');
  db.query('SELECT * FROM borrowedbooks', (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(result);
    }
  });
});

// GET a single borrowed book by ID
app.get('/:id', (req, res) => {
  const borrowedBookId = req.params.id;
  console.log(`Fetching borrowed book with ID: ${borrowedBookId}`);
  db.query('SELECT * FROM borrowedbooks WHERE id = ?', [borrowedBookId], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.length === 0) {
      res.status(404).json({ error: 'Borrowed book not found' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

// POST (Create) a new borrowed book record
app.post('/', (req, res) => {
  const { member_id, book_id } = req.body;
  console.log('Creating a new borrowed book record');
  db.query('INSERT INTO borrowedbooks (member_id, book_id) VALUES (?, ?)', [member_id, book_id], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ id: result.insertId, member_id, book_id, borrowed_at: new Date() });
    }
  });
});

// PUT (Update) an existing borrowed book record by ID
app.put('/:id', (req, res) => {
  const borrowedBookId = req.params.id;
  const { member_id, book_id, returned_at } = req.body;
  console.log(`Updating borrowed book record with ID: ${borrowedBookId}`);
  db.query('UPDATE borrowedbooks SET member_id = ?, book_id = ?, returned_at = ? WHERE id = ?', [member_id, book_id, returned_at, borrowedBookId], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Borrowed book not found' });
    } else {
      res.status(200).json({ id: borrowedBookId, member_id, book_id, returned_at });
    }
  });
});

// DELETE a borrowed book record by ID
app.delete('/:id', (req, res) => {
  const borrowedBookId = req.params.id;
  console.log(`Deleting borrowed book record with ID: ${borrowedBookId}`);
  db.query('DELETE FROM borrowedbooks WHERE id = ?', [borrowedBookId], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Borrowed book not found' });
    } else {
      res.status(204).send();
    }
  });
});

app.listen(PORT, () => {
  console.log(`Borrowed Books server running on http://localhost:${PORT}`);
});