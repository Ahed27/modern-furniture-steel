const jwt = require('jsonwebtoken'); // تم تصحيح حرف C ليصبح صغيراً
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwtConfig = require('../config/jwt');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // تم إزالة المسافة الزائدة لتصبح jwtConfig.JWT_SECRET
      const decoded = jwt.verify(token, jwtConfig.JWT_SECRET); 
      
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };