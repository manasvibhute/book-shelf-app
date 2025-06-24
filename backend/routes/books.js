const express = require('express');
const router = express.Router();
const { addBook, getBooks, updateBook, deleteBook } = require('../controllers/bookController');
const { protect } = require('../middleware/auth'); // ✅ Correct destructured import

// Get books only for authenticated user
router.get('/', protect, getBooks);

// Add new book (user must be logged in)
router.post('/', protect, addBook);

// Update a book (optional: also protect this route)
router.put('/:id', protect, updateBook);

// Delete a book
router.delete('/:id', protect, deleteBook);

module.exports = router;
