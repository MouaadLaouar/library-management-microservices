const express = require('express');
const db = require('./db');
const cors = require('cors')

const app = express();
const PORT = 3001;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())

// GET all books
app.get('/', (req, res) => {
  console.log('Fetching all books');
  db.query('SELECT * FROM books', (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(result);
    }
  });
});

// GET a single book by ID
app.get('/:id', (req, res) => {
  const bookId = req.params.id;
  console.log(`Fetching book with ID: ${bookId}`);
  db.query('SELECT * FROM books WHERE id = ?', [bookId], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.length === 0) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

// POST (Create) a new book
app.post('/', (req, res) => {
  const { title, author, copies } = req.body;
  console.log('Creating a new book');
  db.query('INSERT INTO books (title, author, copies) VALUES (?, ?, ?)', [title, author, copies], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ id: result.insertId, title, author, copies });
    }
  });
});

// PUT (Update) an existing book by ID
app.put('/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, author, copies } = req.body;
  console.log(`Updating book with ID: ${bookId}`);
  db.query('UPDATE books SET title = ?, author = ?, copies = ? WHERE id = ?', [title, author, copies, bookId], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.status(200).json({ id: bookId, title, author, copies });
    }
  });
});

// DELETE a book by ID
app.delete('/:id', (req, res) => {
  const bookId = req.params.id;
  console.log(`Deleting book with ID: ${bookId}`);
  db.query('DELETE FROM books WHERE id = ?', [bookId], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.status(204).send();
    }
  });
});

app.post('/bulk', async (req, res) => {
  const books = [
    { title: 'Book 1', author: 'Author 1', copies: 1 },
    { title: 'Book 2', author: 'Author 2', copies: 2 },
    { title: 'Book 3', author: 'Author 3', copies: 3 },
    { title: 'Book 4', author: 'Author 4', copies: 4 },
    { title: 'Book 5', author: 'Author 5', copies: 5 },
  ];

  try {
    for (const book of books) {
      const { title, author, copies } = book;

      // Check if the book already exists
      db.query('SELECT * FROM books WHERE title = ? AND author = ?', [title, author], (err, result) => {
        if (result.length === 0) {
          // Book does not exist, insert it
          db.query('INSERT INTO books (title, author, copies) VALUES (?, ?, ?)', [title, author, copies]);
          console.log(`Added book: ${title} by ${author}`);
        } else {
          console.log(`Book already exists: ${title} by ${author}`);
        }
      });
    }

    res.status(201).json({ message: 'Bulk book addition completed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Books server running on http://localhost:${PORT}`);
});