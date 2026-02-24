const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { admin, userOnly } = require('../middleware/roleMiddleware');
const { protect } = require('../middleware/authMiddleware');

// استدعاء المفتاح السري من ملف الإعدادات
const { JWT_SECRET } = require('../config/jwt'); 

// دالة لتوليد التوكن
const generateToken = (id) => {
  // استخدام المفتاح السري المستورد بدلاً من النص الثابت
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// 1. تسجيل الدخول (Login)
// @route POST /api/users/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }
}));

// 2. إنشاء حساب جديد (Register)
// @route POST /api/users/register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('المستخدم موجود بالفعل');
  }

  // تشفير كلمة المرور
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin: false, // المستخدم الجديد دائماً ليس أدمن
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('بيانات المستخدم غير صحيحة');
  }
}));

module.exports = router;