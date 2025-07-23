const jwt = require('jsonwebtoken');
const User = require('../models/User'); // if you're fetching user

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("🛂 Received auth header:", authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  console.log("🔐 Extracted token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    req.user = await User.findById(decoded.id).select('-password'); // optional
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res.status(401).json({ message: 'Invalid token' });
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
