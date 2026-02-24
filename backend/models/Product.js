const mongoose = require('mongoose');

// ✅ تمت الإضافة: هيكل التقييمات
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, default: "منتج جديد" },
  price: { type: String, default: "غير محدد" }, 
  imageUrl: { type: String, required: true },
  description: { type: String, required: false, default: "" }, 
  details: { type: String, required: false },
  category: { 
    type: String, 
    required: true,
    ref: 'Category' 
  },
  // ✅ تمت الإضافة: مصفوفة التقييمات ومتوسط التقييم
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;