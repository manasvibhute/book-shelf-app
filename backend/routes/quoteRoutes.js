const express = require('express');
const router = express.Router();
const {
  getQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
  pinQuote,
} = require('../controllers/quoteController');
const { protect } = require('../middleware/auth');

// All routes are protected (user must be logged in)
router.route('/')
  .get(protect, getQuotes)       // GET all quotes for current user
  .post(protect, createQuote);   // POST a new quote

router.route('/:id')
  .put(protect, updateQuote)     // PUT update a quote
  .delete(protect, deleteQuote); // DELETE a quote

router.patch('/:id/pin', protect, pinQuote); // PATCH to pin a quote

module.exports = router;
