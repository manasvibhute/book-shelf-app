const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json()); // ✅ This is the key line

// ✅ ROUTES
app.use('/api/books', bookRoutes);

// server.js or index.js in backend
app.use('/api/auth', require('./routes/auth'));

// ✅ DATABASE + SERVER
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
