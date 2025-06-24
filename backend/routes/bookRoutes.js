const express = require('express');
const router = express.Router();
const { getBooks, addBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect } = require('../middleware/auth'); // ✅ Import it
const { cloudinary } = require('../utils/cloudinary');
const { upload } = require('../utils/cloudinary'); // ✅ Use Cloudinary middleware

// ✅ Attach `protect` middleware so `req.user` is available
router.get('/', protect, getBooks);
router.post('/', protect, addBook);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);
router.post('/upload', protect, upload.single('cover'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'book-covers',
    });

    res.json({ url: result.secure_url }); // ✅ return the hosted image URL
  } catch (err) {
    console.error('❌ Cloudinary upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
