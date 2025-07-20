const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // ✅ FIX: Define the decoded variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };

/*
1. Extract Token from Header
2. If No Token, Block Access
3. Verify Token
4. Fetch the User
5. If User Not Found
6. Pass Control to Next Middleware / Route
7. Catch and Handle Errors
*/
