//This file defines the data structure (or schema) for a Book in your MongoDB database.
// backend/models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: String,
  cover: { type: String, default: '' },
  genre: String,
  status: {
    type: String,
    enum: ['Want to Read', 'Reading', 'Finished'],
    default: 'Want to Read'
  },
  notes: String,
  review: {
    type: String,
    default: ''
  },
  rating: {
  type: String,
  default: '',
  },
  favorite: {
    type: Boolean,
    default: false  // <- ⭐ THIS!
  }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema, 'Books');
module.exports = Book;
