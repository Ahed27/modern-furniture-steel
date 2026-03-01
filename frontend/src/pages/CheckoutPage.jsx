import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context';
import { MapPin, Phone, CheckCircle, AlertCircle, CreditCard, MessageCircle } from 'lucide-react';
import axios from 'axios';

const CheckoutPage = () => {
  // استيراد بيانات السلة والمستخدم من الـ Context
  const { cart, userInfo, clearCart } = useShop();
  const navigate = useNavigate();

  // --- حالات النموذج (Form States) ---
  const [address, setAddress] = useState(''); // العنوان التفصيلي
  const [city, setCity] = useState('');       // المدينة
  const [phoneNumber, setPhoneNumber] = useState(''); // رقم الهاتف
  const [paymentMethod, setPaymentMethod] = useState('الدفع عند الاستلام'); // وسيلة الدفع الافتراضية
  const [loading, setLoading] = useState(false); // حالة تحميل الطلب
  const [error, setError] = useState(''); // تخزين رسائل الخطأ
  const [orderSuccess, setOrderSuccess] = useState(false); // حالة نجاح الطلب بالكامل

  // حماية الصفحة: إذا كانت السلة فارغة ولم يتم طلب شيء للتو، يتم التحويل للرئيسية
  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      navigate('/');
    }
  }, [cart, navigate, orderSuccess]);

  // حساب السعر الإجمالي عبر تحويل النصوص (مثل "1,500 ج.م") إلى أرقام صالحة للعمليات الحسابية
  const totalPrice = cart.reduce((acc, item) => {
    const priceNumber = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
    return acc + priceNumber * item.quantity;
  }, 0);

  // دالة إرسال الطلب للسيرفر
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    
    // التحقق من تعبئة البيانات الأساسية يدوياً قبل الإرسال
    if (!address || !city || !phoneNumber) {
      setError('يرجى تعبئة جميع بيانات العنوان ورقم الهاتف');
      return;
    }

    setLoading(true);

    try {
      // تجهيز مصفوفة المنتجات بالشكل الذي يتوقعه السيرفر (Schema)
      const orderItems = cart.map(item => ({
        product: item._id || item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: item.quantity
      }));

      // إعدادات التوثيق (Token) لإرسالها في رأس الطلب (Header)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      // إرسال الطلب إلى المسار الخاص بالطلبات
      await axios.post(
        '/api/orders',
        {
          orderItems,
          shippingAddress: { address, city, phoneNumber },
          paymentMethod, 
        },
        config
      );

      // في حال النجاح: تغيير الحالة، تفريغ السلة، وعرض واجهة النجاح
      setOrderSuccess(true);
      clearCart(); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setLoading(false);
    }
  };

  // --- واجهة نجاح الطلب (Order Success UI) ---
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-neutral-900 border border-gold-600/30 p-8 rounded-2xl shadow-[0_0_40px_rgba(234,179,8,0.1)] text-center animate-in fade-in zoom-in duration-500">
          <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">تم استلام طلبك بنجاح! 🎉</h2>
          
          <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 mb-6 text-right">
            <p className="text-gray-300 text-lg mb-2 flex items-center justify-center gap-2">
                تابع السلة أو طلباتك لتعرف باقي التفاصيل
            </p>
            <p className="text-gold-500 text-md text-center">
                وسيتم التواصل معك عبر واتساب بخصوص تأكيد الدفع وموعد التسليم.
            </p>
          </div>

          {/* زر التواصل المباشر عبر واتساب لتأكيد الطلب خارج الموقع */}
          <a 
            href="https://wa.me/+4915730700698?text=مرحباً، لقد قمت بإتمام طلب جديد عبر الموقع وأريد متابعة التفاصيل وتأكيد الدفع."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 mb-4 transition-colors text-lg"
          >
            <MessageCircle size={24} /> تواصل عبر واتساب الآن
          </a>

          <button 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors underline"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  // --- واجهة إدخال بيانات الشحن وملخص السلة ---
  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* القسم الأيمن: نموذج بيانات الشحن والدفع */}
        <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
          <h2 className="text-2xl font-bold text-gold-500 mb-6 flex items-center gap-2">
            <MapPin /> بيانات الشحن والدفع
          </h2>

          {error && (
            <div className="bg-red-900/50 text-red-200 p-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-5">
            <div>
              <label className="block text-gray-400 mb-1">المدينة / المحافظة</label>
              <input 
                required
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white focus:border-gold-500 outline-none"
                placeholder=" stuttgart ..."
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-1">العنوان بالتفصيل</label>
              <input 
                required
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white focus:border-gold-500 outline-none"
                placeholder="streeet, building, floor, etc..."
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">رقم الهاتف</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-500" />
                </div>
                <input 
                    required
                    type="text" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 bg-neutral-950 border border-neutral-700 rounded p-3 text-white focus:border-gold-500 outline-none text-right"
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                />
              </div>
            </div>

            {/* اختيار وسيلة الدفع */}
            <div className="pt-2 border-t border-neutral-800 mt-4">
              <label className="block text-gold-400 mb-2 font-bold flex items-center gap-2">
                <CreditCard size={18} /> طريقة الدفع المناسبة
              </label>
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white focus:border-gold-500 outline-none cursor-pointer"
              >
                <option value="الدفع عند الاستلام">الدفع عند الاستلام</option>
                <option value=" Paypal تحويل">تحويل Paypal</option>
                <option value="تحويل بنكي">تحويل بنكي</option>
              </select>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold py-4 rounded-lg mt-6 transition-transform hover:-translate-y-1 flex justify-center items-center gap-2"
            >
                {loading ? 'جاري الإرسال...' : <><CheckCircle size={20} /> إتمام الطلب</>}
            </button>
          </form>
        </div>

        {/* القسم الأيسر: ملخص المنتجات والأسعار */}
        <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 h-fit">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-neutral-800 pb-4">
            ملخص الطلب ({cart.length} منتجات)
          </h2>
          
          {/* عرض المنتجات الموجودة في السلة حالياً */}
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar mb-6">
            {cart.map((item, index) => (
              <div key={index} className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded overflow-hidden bg-neutral-800">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                    <h3 className="text-white font-medium text-sm">{item.name}</h3>
                    <p className="text-gray-400 text-xs">الكمية: {item.quantity}</p>
                </div>
                <div className="text-gold-500 font-bold text-sm">
                    {item.price}
                </div>
              </div>
            ))}
          </div>

          {/* تفاصيل الأسعار النهائية */}
          <div className="border-t border-neutral-800 pt-4 space-y-2">
            <div className="flex justify-between text-gray-400">
                <span>المجموع التقديري:</span>
                <span>{totalPrice.toLocaleString()} ج.م (تقريباً)</span>
            </div>
            <div className="flex justify-between text-gray-400">
                <span>الشحن:</span>
                <span>يحدد عند الاتصال</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-white mt-4 border-t border-dashed border-neutral-700 pt-4">
                <span>الإجمالي:</span>
                <span>حسب الاتفاق</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;