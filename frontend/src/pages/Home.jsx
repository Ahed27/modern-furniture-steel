import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import { BRAND_INFO } from '../constants';
import { ArrowLeft, Loader } from 'lucide-react';
import { useShop } from '../context';

const Home = () => {
  // استخدام hook التنقل للتوجيه بين الصفحات
  const navigate = useNavigate();
  
  // جلب مصفوفة الأقسام وحالة التحميل من سياق المتجر (Global Context)
  const { categories, loading } = useShop();

  // --- شاشة التحميل (Loading State) ---
  // تظهر للمستخدم أثناء جلب البيانات من قاعدة البيانات لمنع ظهور صفحة فارغة
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-gold-500 flex flex-col items-center gap-4">
          <Loader size={48} className="animate-spin" />
          <p>جاري تحميل المعرض...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* القسم العلوي الترحيبي (Hero Section) */}
      <Hero />

      {/* --- قسم "من نحن / رسالتنا" (About Section) --- */}
      <section id="about" className="py-20 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gold-500 mb-6">رسالتنا</h2>
          {/* عرض شعار الماركة من ملف الثوابت */}
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            "{BRAND_INFO.slogan_ar}"
          </p>
          <div className="h-1 w-24 bg-gold-600 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-400 leading-loose text-lg">
            نسعى من خلال منتجاتنا إلى تقديم تجربة تليق بكل من يبحث عن الفخامة والمتانة في آن واحد.
            نعمل في مصنعنا على تقديم حلول أثاث عصرية تناسب المنازل، الشركات، الفنادق، الكافيهات وصالات العرض.
          </p>
        </div>
      </section>

      {/* --- قسم تصنيفات المنتجات (Categories Grid) --- */}
      <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">تصنيفات المنتجات</h2>
          <p className="text-gray-400">اختر القسم لتصفح الموديلات والأسعار</p>
        </div>

        {/* شبكة التصنيفات الحركية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div 
              key={category._id || category.id} 
              // عند الضغط على أي قسم، يتم التوجيه لصفحة المنتجات الخاصة بهذا القسم
              onClick={() => navigate(`/category/${category.id}`)}
              className="group cursor-pointer bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-gold-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(234,179,8,0.2)]"
            >
              {/* صورة القسم مع تأثير زووم عند الحوم (Hover) */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={category.imageUrl} 
                  alt={category.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* طبقة تظليل متدرجة (Gradient) لتحسين قراءة النصوص فوق الصورة */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                <div className="absolute bottom-4 right-4 text-right">
                   <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-gold-400 transition-colors">{category.title}</h3>
                   <span className="text-sm text-gray-300 inline-flex items-center gap-1 group-hover:translate-x-2 transition-transform duration-300">
                     تصفح المنتجات <ArrowLeft size={16} className="text-gold-500"/>
                   </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-400 text-sm leading-relaxed">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- قسم مميزات المتجر (Why Choose Us) --- */}
      <section className="py-20 bg-neutral-900 relative overflow-hidden">
        {/* خلفية جمالية (Blur background) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gold-500 mb-12">لماذا تختارنا؟</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              "جودة ستانلس 304",
              "تشطيب لامع وفاخر",
              "تصميمات مودرن",
              "تصنيع يدوي دقيق",
              "أسعار تنافسية",
              "تنفيذ طلبات خاصة",
              "بيع جملة وقطاعي",
              "خدمة ما بعد البيع"
            ].map((feature, idx) => (
              <div key={idx} className="bg-neutral-950 p-6 rounded-lg border border-neutral-800 hover:border-gold-600/50 transition-colors">
                <span className="text-gray-200 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;