const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const { admin, userOnly } = require('../middleware/roleMiddleware');
const { protect } = require('../middleware/authMiddleware');

// ✅ إنشاء طلب جديد (متاح للجميع - مسجل أو ضيف)
router.post('/', asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentImage, // استقبال الصورة
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('لا يوجد منتجات في الطلب');
    return;
  } else {
    const order = new Order({
      orderItems,
      // ✅ إذا كان المستخدم مسجلاً نربط الطلب به، وإلا فلا
      user: req.user ? req.user._id : null,
      shippingAddress,
      paymentImage, // حفظ الصورة
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
}));

// جلب جميع الطلبات (للأدمن فقط)
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
}));

module.exports = router;