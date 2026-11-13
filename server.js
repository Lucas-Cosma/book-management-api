
// Assignment 4: Backend Book Management API
// Express + SQLite

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// Allowed values for the "status" field (used for validation)
const ALLOWED_STATUSES = ['to-read', 'reading', 'completed'];


// DATABASE SETUP


// Connect to (or create) the SQLite database file
const db = new sqlite3.Database(
  path.join(__dirname, 'database.db'),
  (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database (database.db).');
    }
  }
);

// Create the "books" table if it does not already exist.
// CHECK constraint enforces only allowed status values at the DB level.
db.run(
  `CREATE TABLE IF NOT EXISTS books (
     id     INTEGER PRIMARY KEY AUTOINCREMENT,
     title  TEXT    NOT NULL,
     author TEXT    NOT NULL,
     year   INTEGER,
     status TEXT    NOT NULL CHECK(status IN ('to-read','reading','completed'))
   )`,
  (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Books table is ready.');
    }
  }
);


// TASK 3: READ OPERATIONS

// 3.1 / 3.3 — GET /books  (with optional ?status=... filter)
app.get('/books', (req, res) => {
  const { status } = req.query;

  if (status) {
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`
      });
    }
    db.all(
      'SELECT * FROM books WHERE status = ?',
      [status],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
      }
    );
  } else {
    db.all('SELECT * FROM books', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(rows);
    });
  }
});

// 3.2 — GET /books/:id  (single book by ID)
app.get('/books/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) {
      return res.status(404).json({ error: `Book with id ${id} not found` });
    }
    res.status(200).json(row);
  });
});


// TASK 4: CREATE / UPDATE / DELETE

// 4.1 — POST /books  (create a new book)
app.post('/books', (req, res) => {
  const { title, author, year, status } = req.body;

  if (!title || !author || !status) {
    return res.status(400).json({
      error: 'title, author and status are required'
    });
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`
    });
  }

  const sql = `INSERT INTO books (title, author, year, status)
               VALUES (?, ?, ?, ?)`;
  const params = [title, author, year ?? null, status];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      id: this.lastID,
      message: 'Book created successfully'
    });
  });
});

// 4.2 — PUT /books/:id  (update title / year / status only)
app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, year, status } = req.body;

  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`
    });
  }

  db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) {
      return res.status(404).json({ error: `Book with id ${id} not found` });
    }

    const updatedTitle  = title  !== undefined ? title  : row.title;
    const updatedYear   = year   !== undefined ? year   : row.year;
    const updatedStatus = status !== undefined ? status : row.status;

    const sql = `UPDATE books
                 SET title = ?, year = ?, status = ?
                 WHERE id = ?`;
    db.run(sql, [updatedTitle, updatedYear, updatedStatus, id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({
        message: `Book with id ${id} updated successfully`,
        changes: this.changes
      });
    });
  });
});

// 4.3 — DELETE /books/:id
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM books WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ error: `Book with id ${id} not found` });
    }
    res.status(200).json({
      message: `Book with id ${id} deleted successfully`
    });
  });
});


// START THE SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});