import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Home, Grid, Info, User, ShoppingCart, Trash2, LogOut, Shield, Package, Search } from 'lucide-react';
import { useShop } from '../context';
import axios from 'axios';

const Navbar = () => {
  // --- حالات التحكم في الواجهة (UI States) ---
  const [isOpen, setIsOpen] = useState(false); // القائمة المتنقلة (Mobile Menu)
  const location = useLocation();
  const navigate = useNavigate();
  
  // استيراد البيانات والوظائف من Context المتجر
  const { cart, removeFromCart, isCartOpen, setIsCartOpen, isAuthenticated, userInfo, logout } = useShop();

  // --- حالات إدارة الطلبات (Orders States) ---
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // --- حالات البحث اللحظي (Search States) ---
  const [searchQuery, setSearchQuery] = useState(''); // نص البحث
  const [searchResults, setSearchResults] = useState([]); // نتائج البحث
  const [showResults, setShowResults] = useState(false); // إظهار/إخفاء قائمة النتائج

  const toggleMenu = () => setIsOpen(!isOpen);

  // روابط التنقل الأساسية
  const navLinks = [
    { name: 'Home', targetId: '', icon: <Home size={18} /> },
    { name:'Products', targetId: 'products', icon: <Grid size={18} /> },
    { name: 'About us', targetId: 'about', icon: <Info size={18} /> },
    { name: 'Contact', targetId: 'contact', icon: <Phone size={18} /> },
  ];

  // دالة ذكية للتنقل: إذا كان المستخدم في صفحة أخرى، تعيده للرئيسية أولاً ثم تمرر للعنصر
  const handleNavClick = (targetId) => {
    if (!targetId) {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsOpen(false);
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  // جلب طلبات المستخدم المسجل من السيرفر
  const fetchMyOrders = async () => {
    if (!userInfo) return;
    setLoadingOrders(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/orders/myorders', config);
      setMyOrders(data);
    } catch (error) {
      console.error("Error fetching my orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleOpenMyOrders = () => {
    setIsMyOrdersOpen(true);
    fetchMyOrders();
  };

  // --- تقنية الـ Debouncing في البحث ---
  // تمنع إرسال طلب للسيرفر مع كل حرف، بل تنتظر 300 مللي ثانية بعد توقف المستخدم عن الكتابة
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        return;
      }
      try {
        const { data } = await axios.get(`/api/products?keyword=${searchQuery}`);
        setSearchResults(data);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn); // تنظيف المؤقت عند تغيير النص
  }, [searchQuery]);

  const handleSearchResultClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
    setShowResults(false);
    setSearchQuery('');
    setIsOpen(false);
  };

  // إخفاء الـ Navbar تماماً في صفحات تسجيل الدخول والتسجيل
  if (location.pathname === '/login' || location.pathname === '/register') return null;

  return (
    <>
      <nav dir="ltr" className="fixed w-full z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* الشعار (Logo) */}
            <Link to="/" onClick={() => window.scrollTo(0,0)} className="flex-shrink-0 flex items-center gap-3">
               <img src="/img/logo.jpg" alt="Logo" className="h-12 w-auto rounded-md border border-gold-600/30" />
               <span className="font-bold text-xl hidden sm:block text-gold-gradient tracking-wider">
                 MODERN FURNITURE
               </span>
            </Link>

            {/* روابط التنقل للشاشات الكبيرة */}
            <div className="hidden lg:flex items-center gap-3 lg:gap-6">
              <div className="flex items-baseline space-x-2 lg:space-x-4 space-x-reverse">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.targetId)}
                    className="text-gray-300 hover:text-gold-400 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer bg-transparent border-none outline-none whitespace-nowrap"
                  >
                    {link.icon}
                    {link.name}
                  </button>
                ))}
                
                {/* رابط الإدارة يظهر فقط للمسؤولين */}
                {userInfo?.isAdmin && (
                   <Link to="/admin" className="text-red-400 hover:text-red-300 px-2 py-2 rounded-md text-sm font-medium flex items-center gap-2 whitespace-nowrap">
                     <Shield size={18} /> الإدارة
                   </Link>
                )}
              </div>

              {/* حقل البحث اللحظي */}
              <div className="relative w-32 lg:w-48 ml-2" dir="rtl">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="ابحث..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                  onFocus={() => setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-full pr-9 pl-3 py-1.5 focus:outline-none focus:border-gold-500 transition-colors placeholder-gray-500"
                />
                
                {/* قائمة نتائج البحث المنبثقة */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-56 lg:w-full max-h-80 overflow-y-auto custom-scrollbar bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-50">
                    {searchResults.map((product) => (
                      <div 
                        key={product._id || product.id}
                        onClick={() => handleSearchResultClick(product.category)}
                        className="flex items-center gap-3 p-3 hover:bg-neutral-800 cursor-pointer border-b border-neutral-800 last:border-0 transition-colors"
                      >
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded" />
                        <div className="flex-grow text-right">
                          <p className="text-sm font-bold text-white line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gold-500 mt-1">{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* أيقونات الأكشن (طلباتي، السلة، الحساب) */}
              {isAuthenticated && (
                <button 
                  onClick={handleOpenMyOrders}
                  className="relative p-2 text-gray-300 hover:text-gold-500 transition-colors"
                  title="طلباتي السابقة"
                >
                  <Package size={22} />
                </button>
              )}

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-300 hover:text-gold-500 transition-colors"
                title="السلة"
              >
                <ShoppingCart size={22} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gold-500 hidden lg:block font-bold truncate max-w-[80px]">
                        {userInfo?.name}
                    </span>
                    <button 
                        onClick={logout}
                        className="bg-neutral-800 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                        title="تسجيل خروج"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
              ) : (
                <Link 
                    to="/login"
                    className="bg-neutral-800 hover:bg-gold-600 hover:text-black text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 border border-neutral-700"
                >
                    <User size={16} />
                    تسجيل دخول
                </Link>
              )}
            </div>

            {/* قائمة الموبايل (أيقونة الهمبرغر) */}
            <div className="lg:hidden flex items-center gap-4">
              {isAuthenticated && (
                <button onClick={handleOpenMyOrders} className="relative p-2 text-gray-300 hover:text-gold-500">
                  <Package size={22} />
                </button>
              )}

              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-300 hover:text-gold-500">
                <ShoppingCart size={22} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gold-500 hover:text-white hover:bg-neutral-800 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* واجهة الموبايل عند الفتح */}
        {isOpen && (
          <div className="lg:hidden bg-neutral-900 border-b border-gold-900/30">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              
              <div className="px-3 mb-4 mt-2" dir="rtl">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="ابحث عن منتج..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                    onFocus={() => setShowResults(true)}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-full pr-10 pl-4 py-2 focus:outline-none focus:border-gold-500"
                  />
                  {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full mt-2 w-full max-h-60 overflow-y-auto bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl z-50">
                      {searchResults.map((product) => (
                        <div 
                          key={product._id || product.id}
                          onClick={() => handleSearchResultClick(product.category)}
                          className="flex items-center gap-3 p-3 hover:bg-neutral-700 cursor-pointer border-b border-neutral-700 last:border-0"
                        >
                          <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded" />
                          <div className="text-right w-full">
                            <p className="text-sm font-bold text-white">{product.name}</p>
                            <p className="text-xs text-gold-500 mt-1">{product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.targetId)}
                  className="w-full text-right text-gray-300 hover:text-gold-400 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 cursor-pointer bg-transparent border-none outline-none"
                >
                   {link.icon}
                   {link.name}
                </button>
              ))}
              
              {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="text-red-500 hover:text-red-400 w-full text-right px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 border-t border-neutral-800 mt-2"
                  >
                     <LogOut size={18} />
                     تسجيل خروج ({userInfo?.name})
                  </button>
              ) : (
                <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-gold-500 hover:text-gold-400 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 border-t border-neutral-800 mt-2"
                >
                    <User size={18} />
                    تسجيل دخول
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* --- القائمة الجانبية للسلة (Cart Sidebar) --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-full max-w-md bg-neutral-900 border-r border-neutral-800 shadow-2xl transform transition-transform duration-300 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4">
              <h2 className="text-2xl font-bold text-gold-500 flex items-center gap-2">
                <ShoppingCart /> سلة المشتريات
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            {/* عرض المنتجات داخل السلة */}
            <div className="flex-grow overflow-y-auto space-y-4 custom-scrollbar pr-2">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <p>السلة فارغة حالياً</p>
                  <button onClick={() => setIsCartOpen(false)} className="mt-4 text-gold-500 hover:underline">تصفح المنتجات</button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={`${item._id || item.id}-${index}`} className="flex gap-4 bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-grow">
                      <h3 className="font-bold text-white text-sm">{item.name}</h3>
                      <p className="text-gold-500 text-sm mt-1">{item.price}</p>
                      <span className="text-xs text-gray-500 block mt-1">الكمية: {item.quantity}</span>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item._id || item.id)}
                      className="text-red-500 hover:text-red-400 self-start p-2"
                      title="حذف من السلة"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="mt-6 border-t border-neutral-800 pt-4">
                <Link 
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold py-3 rounded-lg transition-colors block text-center"
                >
                  إتمام الطلب
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- القائمة الجانبية للطلبات السابقة (My Orders Sidebar) --- */}
      {isMyOrdersOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMyOrdersOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-full max-w-md bg-neutral-900 border-r border-neutral-800 shadow-2xl transform transition-transform duration-300 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4">
              <h2 className="text-2xl font-bold text-gold-500 flex items-center gap-2">
                <Package /> طلباتي السابقة
              </h2>
              <button onClick={() => setIsMyOrdersOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-4 custom-scrollbar pr-2">
              {loadingOrders ? (
                <div className="text-center text-gray-500 mt-10 animate-pulse">جاري تحميل الطلبات...</div>
              ) : myOrders.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <Package size={48} className="mx-auto opacity-30 mb-4" />
                  <p>لا يوجد لديك طلبات سابقة</p>
                </div>
              ) : (
                myOrders.map((order) => (
                  <div key={order._id} className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                    <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2">
                      <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
                      <span className={`text-xs px-2 py-1 rounded font-bold ${
                        order.status === 'تم التسليم' ? 'bg-green-900/50 text-green-400' :
                        order.status === 'قيد المراجعة' ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-blue-900/50 text-blue-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded object-cover border border-neutral-800" />
                          <div>
                            <p className="text-white text-sm">{item.name}</p>
                            <p className="text-gray-500 text-xs mt-1">الكمية: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* ملاحظات الإدارة أو وقت التسليم */}
                    <div className="bg-neutral-900 p-3 rounded-lg border border-gold-600/20">
                      <p className="text-xs text-gold-400 font-bold mb-1">وقت التسليم / ملاحظة الإدارة:</p>
                      <p className="text-sm text-gray-200">{order.deliveryTime}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;