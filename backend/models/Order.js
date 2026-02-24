const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        price: { type: String, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    // ✅ تمت الإضافة: طريقة الدفع
    paymentMethod: {
      type: String,
      required: true,
      default: 'الدفع عند الاستلام', 
    },
    // ✅ تمت الإضافة: حالة الطلب ليتفاعل الأدمن مع الزبون
    status: {
      type: String,
      required: true,
      default: 'قيد المراجعة',
    },
    // ✅ تمت الإضافة: وقت التسليم أو ملاحظات الأدمن للزبون
    deliveryTime: {
      type: String,
      default: 'سيتم تحديده قريباً بعد مراجعة الطلب',
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;