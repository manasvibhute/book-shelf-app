const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); //allows requests from the frontend (browser)
require('dotenv').config(); //loads your MongoDB password securely(.env)

const quoteRoutes = require('./routes/quoteRoutes');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 5000; //Sets the port (default to 5000 if not set)


// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json()); // ✅ This is the key line

// ✅ ROUTES
app.use('/api/books', bookRoutes);
app.use('/api/quotes', quoteRoutes);

// server.js or index.js in backend
app.use('/api/auth', require('./routes/auth'));

// ✅ DATABASE + SERVER
mongoose.connect(process.env.MONGO_URI) //Tries to connect to MongoDB database using the connection string in .env file.
  .then(() => { //If connection is successful, it prints "MongoDB connected" and starts the server with app.listen(...).
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
