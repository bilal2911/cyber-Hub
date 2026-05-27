const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from Bearer prefix
      token = req.headers.authorization.split(' ')[1];

      // Verify token signature against JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cyberhub_super_secret_key_2026_secure');

      // Fetch admin info (omitting password credentials) and append to request
      req.admin = await Admin.findById(decoded.id).select('-password');
      
      if (!req.admin) {
        return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
      }

      next();
    } catch (error) {
      console.error(`JWT verification error: ${error.message}`);
      return res.status(401).json({ success: false, message: 'Not authorized, token signature failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
