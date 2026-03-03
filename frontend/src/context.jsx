import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// إنشاء سياق المتجر (Context) لمشاركة البيانات بين جميع المكونات دون الحاجة لتمريرها يدوياً
const ShopContext = createContext(undefined);

export const ShopProvider = ({ children }) => {
  // --- إدارة حالة السلة (Cart State) ---
  // يتم استرجاع بيانات السلة من الـ localStorage عند تحميل التطبيق لأول مرة
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // --- إدارة حالة المستخدم (User State) ---
  // يتم استرجاع بيانات المستخدم (الإسم، التوكن، الصلاحيات) من التخزين المحلي
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  );
  
  // حالات عامة للتطبيق
  const [isCartOpen, setIsCartOpen] = useState(false); // التحكم في إظهار/إخفاء جانب السلة
  const [products, setProducts] = useState([]);       // تخزين قائمة المنتجات
  const [categories, setCategories] = useState([]);   // تخزين قائمة الأقسام
  const [loading, setLoading] = useState(true);       // حالة التحميل أثناء جلب البيانات

  // تحديث التخزين المحلي (localStorage) تلقائياً كلما تغيرت محتويات السلة
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // --- دالة جلب البيانات الأساسية (Fetch Data) ---
  // تقوم بجلب المنتجات والأقسام معاً في نفس الوقت لتحسين الأداء
  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories')
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // تشغيل دالة جلب البيانات بمجرد تشغيل التطبيق
  useEffect(() => {
    fetchData();
  }, []);

  // --- وظائف الإدارة (Admin Functions) ---
  // حذف منتج: يتطلب صلاحيات مسؤول (Admin) وتمرير التوكن في الـ Header
  const deleteProduct = async (id) => {
    if (!userInfo || !userInfo.isAdmin) {
      alert("عذراً، يجب أن تكون مديراً لحذف المنتجات");
      return;
    }
    try {
      if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        fetchData(); // تحديث القائمة بعد الحذف
      }
    } catch (error) {
      alert(error?.response?.data?.message || "حدث خطأ أثناء الحذف");
    }
  };

  // --- وظائف التقييمات (Reviews) ---
  const addReview = async (productId, review) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo?.token}` } };
      await axios.post(`/api/products/${productId}/reviews`, review, config);
      fetchData(); // تحديث المنتج لإظهار التقييم الجديد
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'فشل إضافة التقييم');
    }
  };

  const deleteReview = async (productId, reviewId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      await axios.delete(`/api/products/${productId}/reviews/${reviewId}`, config);
      fetchData(); 
    } catch (error) {
      alert(error?.response?.data?.message || 'فشل حذف التقييم');
    }
  };

  // --- وظائف السلة (Cart Logic) ---
  const addToCart = (product) => {
    setCart(prev => {
      // التحقق إذا كان المنتج موجود مسبقاً لزيادة الكمية بدلاً من تكراره
      const existing = prev.find(item => (item._id || item.id) === (product._id || product.id));
      if (existing) {
        return prev.map(item => 
          (item._id || item.id) === (product._id || product.id) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // فتح السلة تلقائياً عند إضافة منتج
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => (item._id || item.id) !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // --- وظائف التوثيق (Authentication) ---
  const login = async (email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/login', { email, password }, config);
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data)); // حفظ بيانات الجلسة
      return data;
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'فشل تسجيل الدخول');
    }
  };

  const register = async (name, email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/register', { name, email, password }, config);
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'فشل إنشاء الحساب');
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cart');
    setUserInfo(null);
    setCart([]);
    window.location.href = '/'; // إعادة توجيه المستخدم للصفحة الرئيسية عند الخروج
  };

  return (
    // توفير كافة البيانات والوظائف لجميع مكونات التطبيق
    <ShopContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart,
      isAuthenticated: !!userInfo, // قيمة بولية (Boolean) لمعرفة هل المستخدم مسجل دخول أم لا
      userInfo,
      login, register, logout,
      isCartOpen, setIsCartOpen,
      products, categories, loading,
      deleteProduct,
      addReview, deleteReview
    }}>
      {children}
    </ShopContext.Provider>
  );
};

// Hook مخصص لسهولة استدعاء سياق المتجر في أي مكون
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};