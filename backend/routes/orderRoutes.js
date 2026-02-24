const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const { admin, userOnly } = require('../middleware/roleMiddleware');
const { protect } = require('../middleware/authMiddleware');

// إنشاء طلب جديد
router.post('/', protect, asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod, // ✅ استلام طريقة الدفع من الواجهة
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('لا يوجد منتجات في الطلب');
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod: paymentMethod || 'الدفع عند الاستلام', // حفظ طريقة الدفع
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
}));

// ✅ تمت الإضافة: جلب طلبات المستخدم الحالي (ليراها الزبون في حسابة أو السلة)
router.get('/myorders', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}));

// جلب جميع الطلبات (للأدمن)
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
}));

// ✅ تمت الإضافة: تحديث حالة الطلب ووقت التسليم (للأدمن فقط)
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    order.deliveryTime = req.body.deliveryTime || order.deliveryTime;
    
    // التحديث التلقائي لحالة التوصيل إذا اختار الأدمن "تم التسليم"
    if (req.body.status === 'تم التسليم') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    } else {
        order.isDelivered = false;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('الطلب غير موجود');
  }
}));

module.exports = router;