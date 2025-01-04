const express = require('express');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// GET all members
app.get('/', (req, res) => {
  console.log('Fetching all members');
  db.query('SELECT * FROM members', (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(result);
    }
  });
});

// GET a single member by ID
app.get('/:id', (req, res) => {
  const memberId = req.params.id;
  console.log(`Fetching member with ID: ${memberId}`);
  db.query('SELECT * FROM members WHERE id = ?', [memberId], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.length === 0) {
      res.status(404).json({ error: 'Member not found' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

// POST (Create) a new member
app.post('/', (req, res) => {
  const { name, email } = req.body;
  console.log('Creating a new member');
  db.query('INSERT INTO members (name, email) VALUES (?, ?)', [name, email], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ id: result.insertId, name, email });
    }
  });
});

// PUT (Update) an existing member by ID
app.put('/:id', (req, res) => {
  const memberId = req.params.id;
  const { name, email } = req.body;
  console.log(`Updating member with ID: ${memberId}`);
  db.query('UPDATE members SET name = ?, email = ? WHERE id = ?', [name, email, memberId], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Member not found' });
    } else {
      res.status(200).json({ id: memberId, name, email });
    }
  });
});

// DELETE a member by ID
app.delete('/:id', (req, res) => {
  const memberId = req.params.id;
  console.log(`Deleting member with ID: ${memberId}`);
  db.query('DELETE FROM members WHERE id = ?', [memberId], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Member not found' });
    } else {
      res.status(204).send();
    }
  });
});

app.listen(PORT, () => {
  console.log(`Members server running on http://localhost:${PORT}`);
});