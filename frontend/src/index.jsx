import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/** * تحديد العنصر الجذري (Root Element):
 * يقوم React بالبحث عن عنصر HTML يحمل المعرف 'root' (موجود عادة في ملف index.html) 
 * ليقوم بحقن تطبيق React بالكامل بداخله.
 */
const rootElement = document.getElementById('root');

// التحقق من وجود العنصر في الصفحة قبل محاولة تشغيل التطبيق لتجنب الأخطاء البرمجية
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

/** * إنشاء الجذر (Create Root):
 * باستخدام React 18، يتم استخدام createRoot لبدء تشغيل التطبيق، 
 * مما يدعم ميزات المعالجة المتزامنة (Concurrent Features).
 */
const root = ReactDOM.createRoot(rootElement);

/** * رندرة التطبيق (Rendering):
 * يتم تغليف المكون الرئيسي <App /> داخل <React.StrictMode>
 * وهي أداة تطوير تساعد في اكتشاف المشاكل المحتملة في الكود (مثل التحذيرات حول الدوال القديمة).
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);