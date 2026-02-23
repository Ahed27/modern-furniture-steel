const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); 
const protect = asyncHandler(async (req, res, next) => {
  let token;
  // تحقق من وجود توكن في الهيدر وأنه يبدأ
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, jwtConfig.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password'); // إذا كنت تريد جلب بيانات المستخدم بدون كلمة المرور
      req.user = decoded; // يمكنك تخزين البيانات المفيدة فقط في الـ token بدلاً من جلب المستخدم من قاعدة البيانات
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  // إذا لم يكن هناك توكن
  // إذا كان هناك توكن ولكنه غير صالح، سيتم التعامل معه في الكاتش أعلاه وسيتم إرسال 401 أيضاً
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});


module.exports = { protect };