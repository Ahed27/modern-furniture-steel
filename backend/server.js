const path = require('path');
const express = require('express');
const colors = require('colors');
const cors = require('cors');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// استدعاء الموديلات
const Product = require('./models/Product');
const Category = require('./models/Category');

// استدعاء ملفات المسارات (رفع الصور + المستخدمين + الطلبات)
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const {  admin, userOnly } = require('./middleware/roleMiddleware');
const { protect } = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// --- الاتصال بقاعدة البيانات ---
const MONGO_URI = 'mongodb://127.0.0.1:27017/modern-steel';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

connectDB();

// --- ربط المسارات (Routes) ---

// 1. مسارات المصادقة ورفع الصور والطلبات
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// 2. جعل مجلد uploads عاماً
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


// --- مسارات المنتجات (API Routes) ---

// جلب كل الأقسام (متاح للجميع)
app.get('/api/categories', asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
}));

// جلب قسم واحد (متاح للجميع)
app.get('/api/categories/:id', asyncHandler(async (req, res) => {
  const category = await Category.findOne({ id: req.params.id });
  
  if (category) {
    const products = await Product.find({ category: req.params.id });
    res.json({
      ...category._doc,
      products: products
    });
  } else {
    res.status(404);
    throw new Error('القسم غير موجود');
  }
}));

// ✅ جلب كل المنتجات أو البحث عنها (متاح للجميع)
app.get('/api/products', asyncHandler(async (req, res) => {
  // التقاط كلمة البحث من الرابط، وإنشاء شرط البحث
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i', // للبحث بغض النظر عن حالة الأحرف (مفيد للغة الإنجليزية إن وجدت)
        },
      }
    : {};

  // جلب المنتجات بناءً على شرط البحث (إن وجد) أو جلب الكل
  const products = await Product.find({ ...keyword });
  res.json(products);
}));

// 🔒 إضافة منتج جديد (محمي: يجب أن تكون أدمن)
app.post('/api/products', protect, admin, asyncHandler(async (req, res) => {
  const { id, name, price, description, imageUrl, category, details } = req.body;

  const product = new Product({
    id,
    name,
    price,
    description: description || "منتج جديد",
    imageUrl,
    category,
    details
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
}));

// 🔒 حذف منتج (محمي: يجب أن تكون أدمن)
app.delete('/api/products/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findOne({ id: req.params.id }); 
  
  if (product) {
    await Product.deleteOne({ id: req.params.id });
    res.json({ message: 'Product removed' });
  } else {
    const productMongo = await Product.findById(req.params.id);
    if (productMongo) {
        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
  }
}));

// ==========================================
// ✅ مسارات التقييمات (الجديدة)
// ==========================================

// 🔒 إضافة تقييم جديد لمنتج (محمي: يجب أن يكون مسجل دخول)
app.post('/api/products/:id/reviews', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  // البحث عن المنتج (سواء بالـ id المخصص أو _id الخاص بمونجو)
  let product = await Product.findOne({ id: req.params.id });
  if (!product) product = await Product.findById(req.params.id);

  if (product) {
    // التأكد أن المستخدم لم يقم بتقييم هذا المنتج مسبقاً (منع التكرار)
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('لقد قمت بتقييم هذا المنتج مسبقاً، شكراً لك!');
    }

    // إنشاء كائن التقييم
    const review = {
      name: req.user.name, // نأخذ اسم المستخدم المسجل
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // إضافة التقييم للمنتج
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    
    // حساب متوسط النجوم للمنتج
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'تمت إضافة التقييم بنجاح' });
  } else {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }
}));

// 🔒 حذف تقييم محدد (محمي: للأدمن فقط)
app.delete('/api/products/:productId/reviews/:reviewId', protect, admin, asyncHandler(async (req, res) => {
  
  let product = await Product.findOne({ id: req.params.productId });
  if (!product) product = await Product.findById(req.params.productId);

  if (product) {
    // فلترة التقييمات لإزالة التقييم المطلوب حذفه
    const updatedReviews = product.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId.toString()
    );

    product.reviews = updatedReviews;
    product.numReviews = product.reviews.length;

    // إعادة حساب متوسط النجوم بعد الحذف
    if (product.reviews.length > 0) {
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    } else {
      product.rating = 0; // إذا تم حذف كل التقييمات يعود لصفر
    }

    await product.save();
    res.json({ message: 'تم حذف التقييم بنجاح' });
  } else {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }
}));

const PORT = 5000;

app.listen(PORT, console.log(`🚀 Server running on port ${PORT}`.yellow.bold));