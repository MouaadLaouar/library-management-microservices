const express = require('express');
const db = require('./db');
const cors = require('cors')

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())

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

// POST 5 members if they don't exist
app.post('/bulk', async (req, res) => {
  const members = [
    { name: 'Member 1', email: 'member1@example.com' },
    { name: 'Member 2', email: 'member2@example.com' },
    { name: 'Member 3', email: 'member3@example.com' },
    { name: 'Member 4', email: 'member4@example.com' },
    { name: 'Member 5', email: 'member5@example.com' },
  ];

  try {
    for (const member of members) {
      const { name, email } = member;

      console.log([ name, email ])

      // Check if the member already exists using their unique email
      db.query('SELECT * FROM members WHERE email = ?', [email], (err, result) => {
        if (result.length === 0) {
          // Member does not exist, insert them
          db.query('INSERT INTO members (name, email) VALUES (?, ?)', [name, email]);
          console.log(`Added member: ${name} with email ${email}`);
        } else {
          console.log(`Member already exists: ${name} with email ${email}`);
        }
      });
    }

    res.status(201).json({ message: 'Bulk member addition completed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Members server running on http://localhost:${PORT}`);
});