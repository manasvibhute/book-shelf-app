const Book = require('../models/Book');

const getBooks = async (req, res) => {
  const books = await Book.find({ user: req.user._id }); // get all books from DB
  res.json(books); // send books as JSON response
};

const addBook = async (req, res) => {
  console.log('📥 Book Body:', req.body);
  console.log('👤 Authenticated user:', req.user); // ✅ This should NOT be undefined now

  try {
    const newBook = new Book({
      ...req.body,
      user: req.user._id, // ✅ Automatically from protect middleware
    });

    const savedBook = await newBook.save();
    console.log('✅ Book saved:', savedBook);
    res.status(201).json(savedBook);
  } catch (err) {
    console.error('❌ Error saving book:', err);
    res.status(500).json({ error: 'Book creation failed' });
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  console.log('🛠️ Update request for ID:', req.params.id);
  console.log('➡️ New data:', req.body);


  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      updatedData,
      { new: true } // Ensure the updated document is returned
    );
    console.log('✅ Saved updated book:', updatedBook);
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBook = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json({ message: 'Book deleted' });
};

module.exports = {
  addBook,
  getBooks,
  updateBook,
  deleteBook
};
