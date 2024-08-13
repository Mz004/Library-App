const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const passport = require('../middleware/authentication');
const roleMiddleware = require('../middleware/roleMiddleware');

// Get all books with pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const books = await bookController.getBooks(page, limit);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search books by title, author, or category
router.get('/search', async (req, res) => {
  const { title, author, category, page = 1, limit = 10 } = req.query;
  try {
    const books = await bookController.searchBooks({ title, author, category }, parseInt(page), parseInt(limit));
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a book by ISBN-13
router.get('/:isbn13', async (req, res) => {
  const { isbn13 } = req.params;
  try {
    const book = await bookController.getBookByIsbn(isbn13);
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Add a new book (admin only)
router.post('/', passport.authenticate('jwt', { session: false }), roleMiddleware(['admin']), async (req, res) => {
  try {
    const newBook = await bookController.addBook(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a book by ISBN-13 (admin only)
router.put('/:isbn13', passport.authenticate('jwt', { session: false }), roleMiddleware(['admin']), async (req, res) => {
  const { isbn13 } = req.params;
  try {
    const updatedBook = await bookController.updateBook(isbn13, req.body);
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete a book by ISBN-13 (admin only)
router.delete('/:isbn13', passport.authenticate('jwt', { session: false }), roleMiddleware(['admin']), async (req, res) => {
  const { isbn13 } = req.params;
  try {
    const success = await bookController.deleteBook(isbn13);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
