// // backend/data/fullData.js

// const categories = [
//   {
//     id: 'tea-tables',
//     title: 'طاولات شاي متحركة',
//     description: 'تصميمات متنوعة، عملية، مناسبة للمنزل والمكاتب.',
//     imageUrl: '/img/categories/tea-tables.jpg'
//   },
//   {
//     id: 'consoles',
//     title: 'كونسولات فاخرة',
//     description: 'موديلات عصرية وكلاسيكية لتزيين المداخل.',
//     imageUrl: '/img/categories/consoles.jpg'
//   },
//   {
//     id: 'mirrors',
//     title: 'مرايا حديثة',
//     description: 'أشكال هندسية وأطر ستانلس لامعة.',
//     imageUrl: '/img/categories/mirrors.jpg'
//   },
//   {
//     id: 'dining',
//     title: 'طاولات سفرة',
//     description: 'مقاسات متعددة، قواعد ستانلس قوية.',
//     imageUrl: '/img/categories/dining.jpg'
//   },
//   {
//     id: 'side-tables',
//     title: 'طاولات جانبية (Corner & Side)',
//     description: 'قطع ديكور عملية للجوانب والزاويا.',
//     imageUrl: '/img/categories/side-tables.jpg'
//   },

  
//   {
//     id: 'nest-tables',
//     title: 'طاولات متداخلة ( Nesting Tables )',
//     description: 'قطع ديكور عملية للضيافة.',
//     imageUrl: '/img/categories/nest-tables.jpg'
//   }
// ];

// const products = [
//   // 1. Tea Tables (طاولات شاي)
//   { id: 'tea-1', name: 'طاولة شاي - دائرة', price: "3800 ج.م + 700 ج.م للزجاج", imageUrl: '/img/products/tea-tables/1.jpg', description: "طاولة شاي فاخرة بتصميم ذهبي", category: 'tea-tables' },
//   { id: 'tea-2', name: 'طاولة شاي ثابتة - دوائر', price: " 3800 ج.م + 700 ج.م للزجاج", imageUrl: '/img/products/tea-tables/2.jpg', description: "طاولة شاي كلاسيكية من ستانلس", category: 'tea-tables' },
//   { id: 'tea-3', name: 'طاولة شاي - دائرتين', price: " 3800 ج.م + 700 ج.م للزجاج", imageUrl: '/img/products/tea-tables/3.jpg', description: "طاولة شاي بتصميم عصري حديث", category: 'tea-tables' },
//   { id: 'tea-4', name: 'طاولة شاي - هرم', price: " 3800 ج.م + 700 ج.م للزجاج", imageUrl: '/img/products/tea-tables/4.jpg', description: "طاولة شاي فاخرة بتصميم خاص", category: 'tea-tables' },

//   // 2. Mirrors (مرايا - تم تعديل الامتدادات إلى jpg)
//   { id: 'mirror-1', name: 'برواز - دائرتين بيضاوي', price: " 2600 ج.م + 600 ج.م للزجاج", imageUrl: '/img/products/mirrors/1.jpg', description: "مرآة كبيرة دائرية بتصميم هندسي فاخر", category: 'mirrors' },
//   { id: 'mirror-2', name: 'برواز - إسلامي طبقات', price: " 2100 ج.م + 400 ج.م للزجاج", imageUrl: '/img/products/mirrors/2.jpg', description: "مرآة دائرية بإطار ستانلس لامع", category: 'mirrors' },
//   { id: 'mirror-3', name: 'برواز - مربع داخلي', price: " 1500 ج.م + 500 ج.م للزجاج", imageUrl: '/img/products/mirrors/3.jpg', description: "مرآة تصميم حديث", category: 'mirrors' },
//   { id: 'mirror-4', name: 'برواز - خلية', price: " 1500 ج.م + 500 ج.م للزجاج", imageUrl: '/img/products/mirrors/4.jpg', description: "مرآة خلية النحل المميزة", category: 'mirrors' },
 

//   // 3. Consoles (كونسولات)
//   { id: 'console-1', name: 'كونسول موجه حديث', price: "3800 ج.م + 750 ج.م للزجاج", imageUrl: '/img/products/consoles/1.jpg', description: "كونسول مدخل مودرن", category: 'consoles' },
//   { id: 'console-2', name: 'كونسول طبقات مواسير', price: "3800 ج.م + 700 ج.م للزجاج", imageUrl: '/img/products/consoles/2.jpg', description: "تصميم مواسير متعدد الطبقات", category: 'consoles' },
//   { id: 'console-3', name: 'كونسول زوايا أربع مواسير', price: "5000 ج.م + 800 ج.م للزجاج", imageUrl: '/img/products/consoles/3.jpg', description: "كونسول زوايا قوي ومتين", category: 'consoles' },
  
  

//   // 4. Dining (طاولات سفرة)
//   { id: 'dining-1', name: 'طاولة سفرة - 6 كراسي فاخرة', price: "6500 ج.م", imageUrl: '/img/products/dining/1.jpg', description: "طاولة سفرة كاملة مع 6 كراسي فاخرة", category: 'dining' },
//   { id: 'dining-2', name: 'طاولة سفرة مودرن', price: "غير محدد", imageUrl: '/img/products/dining/2.jpg', description: "طاولة بتصميم انسيابي", category: 'dining' },
//   { id: 'dining-3', name: 'سفرة مدورة مخصورة', price: "4500 الطاولة + 1700 الترس", imageUrl: '/img/products/dining/3.jpg', description: "طاولة سفرة ستالس مودرن قطر 120 سم", category: 'dining' },
  

//   // 5. Side Tables (طاولات نص - ملأت لك الفراغات)
//   { id: 'side-1', name: 'طاولة جانبية مكعب', price: "1200 ج.م", imageUrl: '/img/products/side-tables/1.jpg', description: "طاولة ركنة بتصميم مكعب", category: 'side-tables' },
//   { id: 'side-2', name: 'طاولة جانبية حرف C', price: "950 ج.م", imageUrl: '/img/products/side-tables/2.jpg', description: "تدخل تحت الكنب لتوفير المساحة", category: 'side-tables' },
//   { id: 'side-3', name: 'طاولة زاوية دائرية', price: "1100 ج.م", imageUrl: '/img/products/side-tables/3.jpg', description: "سطح زجاجي وقاعدة ذهبية", category: 'side-tables' },
  

 
//   // 6. Nest Tables (طاولات متداخلة - ملأت لك الفراغات)
//   { id: 'nest-tables-1', name: 'طقم متداخل مربع', price: "1800 ج.م", imageUrl: '/img/products/nest-tables/1.jpg', description: "3 طاولات مربعة", category: 'nest-tables' },
//   { id: 'nest-tables-2', name: 'طقم متداخل دائري', price: "1900 ج.م", imageUrl: '/img/products/nest-tables/2.jpg', description: "3 طاولات دائرية", category: 'nest-tables' },
//   { id: 'nest-tables-3', name: 'طقم متداخل ذهبي', price: "2000 ج.م", imageUrl: '/img/products/nest-tables/3.jpg', description: "طلاء ذهبي", category: 'nest-tables' },
  
// ];

// module.exports = { categories, products };




// backend/data/fullData.js

const categories = [
  {
    id: 'tea-tables',
    title: 'طاولات شاي متحركة',
    description: 'تصميمات متنوعة، عملية، مناسبة للمنزل والمكاتب.',
    imageUrl: '/img/categories/tea-tables.jpg'
  },
  {
    id: 'consoles',
    title: 'كونسولات فاخرة',
    description: 'موديلات عصرية وكلاسيكية لتزيين المداخل.',
    imageUrl: '/img/categories/consoles.jpg'
  },
  {
    id: 'mirrors',
    title: 'مرايا حديثة',
    description: 'أشكال هندسية وأطر ستانلس لامعة.',
    imageUrl: '/img/categories/mirrors.jpg'
  },
  {
    id: 'dining',
    title: 'طاولات سفرة',
    description: 'مقاسات متعددة، قواعد ستانلس قوية.',
    imageUrl: '/img/categories/dining.jpg'
  },
  {
    id: 'side-tables',
    title: 'طاولات جانبية (Corner & Side)',
    description: 'قطع ديكور عملية للجوانب والزاويا.',
    imageUrl: '/img/categories/side-tables.jpg'
  },

  
  {
    id: 'nest-tables',
    title: 'طاولات متداخلة ( Nesting Tables )',
    description: 'قطع ديكور عملية للضيافة.',
    imageUrl: '/img/categories/nest-tables.jpg'
  }
];

const products = [
  // 1. Tea Tables (طاولات شاي)
  { id: 'tea-1', name: 'طاولة شاي - دائرة', price: "72 € + 13 € للزجاج", imageUrl: '/img/products/tea-tables/1.jpg', description: "طاولة شاي فاخرة بتصميم ذهبي", category: 'tea-tables' },
  { id: 'tea-2', name: 'طاولة شاي ثابتة - دوائر', price: " 72 € + 13 € للزجاج", imageUrl: '/img/products/tea-tables/2.jpg', description: "طاولة شاي كلاسيكية من ستانلس", category: 'tea-tables' },
  { id: 'tea-3', name: 'طاولة شاي - دائرتين', price: " 72 € + 13 € للزجاج", imageUrl: '/img/products/tea-tables/3.jpg', description: "طاولة شاي بتصميم عصري حديث", category: 'tea-tables' },
  { id: 'tea-4', name: 'طاولة شاي - هرم', price: " 72 € + 13 € للزجاج", imageUrl: '/img/products/tea-tables/4.jpg', description: "طاولة شاي فاخرة بتصميم خاص", category: 'tea-tables' },

  // 2. Mirrors (مرايا)
  { id: 'mirror-1', name: 'برواز - دائرتين بيضاوي', price: " 49 € + 11 € للزجاج", imageUrl: '/img/products/mirrors/1.jpg', description: "مرآة كبيرة دائرية بتصميم هندسي فاخر", category: 'mirrors' },
  { id: 'mirror-2', name: 'برواز - إسلامي طبقات', price: " 40 € + 8 € للزجاج", imageUrl: '/img/products/mirrors/2.jpg', description: "مرآة دائرية بإطار ستانلس لامع", category: 'mirrors' },
  { id: 'mirror-3', name: 'برواز - مربع داخلي', price: " 28 € + 9 € للزجاج", imageUrl: '/img/products/mirrors/3.jpg', description: "مرآة تصميم حديث", category: 'mirrors' },
  { id: 'mirror-4', name: 'برواز - خلية', price: " 28 € + 9 € للزجاج", imageUrl: '/img/products/mirrors/4.jpg', description: "مرآة خلية النحل المميزة", category: 'mirrors' },
 

  // 3. Consoles (كونسولات)
  { id: 'console-1', name: 'كونسول موجه حديث', price: "72 € + 14 € للزجاج", imageUrl: '/img/products/consoles/1.jpg', description: "كونسول مدخل مودرن", category: 'consoles' },
  { id: 'console-2', name: 'كونسول طبقات مواسير', price: "72 € + 13 € للزجاج", imageUrl: '/img/products/consoles/2.jpg', description: "تصميم مواسير متعدد الطبقات", category: 'consoles' },
  { id: 'console-3', name: 'كونسول زوايا أربع مواسير', price: "95 € + 15 € للزجاج", imageUrl: '/img/products/consoles/3.jpg', description: "كونسول زوايا قوي ومتين", category: 'consoles' },
  
  

  // 4. Dining (طاولات سفرة)
  { id: 'dining-1', name: 'طاولة سفرة - 6 كراسي فاخرة', price: "123 €", imageUrl: '/img/products/dining/1.jpg', description: "طاولة سفرة كاملة مع 6 كراسي فاخرة", category: 'dining' },
  { id: 'dining-2', name: 'طاولة سفرة مودرن', price: "غير محدد", imageUrl: '/img/products/dining/2.jpg', description: "طاولة بتصميم انسيابي", category: 'dining' },
  { id: 'dining-3', name: 'سفرة مدورة مخصورة', price: "85 € الطاولة + 32 € الترس", imageUrl: '/img/products/dining/3.jpg', description: "طاولة سفرة ستالس مودرن قطر 120 سم", category: 'dining' },
  

  // 5. Side Tables (طاولات نص)
  { id: 'side-1', name: 'طاولة جانبية مكعب', price: "23 €", imageUrl: '/img/products/side-tables/1.jpg', description: "طاولة ركنة بتصميم مكعب", category: 'side-tables' },
  { id: 'side-2', name: 'طاولة جانبية حرف C', price: "18 €", imageUrl: '/img/products/side-tables/2.jpg', description: "تدخل تحت الكنب لتوفير المساحة", category: 'side-tables' },
  { id: 'side-3', name: 'طاولة زاوية دائرية', price: "21 €", imageUrl: '/img/products/side-tables/3.jpg', description: "سطح زجاجي وقاعدة ذهبية", category: 'side-tables' },
  

 
  // 6. Nest Tables (طاولات متداخلة)
  { id: 'nest-tables-1', name: 'طقم متداخل مربع', price: "34 €", imageUrl: '/img/products/nest-tables/1.jpg', description: "3 طاولات مربعة", category: 'nest-tables' },
  { id: 'nest-tables-2', name: 'طقم متداخل دائري', price: "36 €", imageUrl: '/img/products/nest-tables/2.jpg', description: "3 طاولات دائرية", category: 'nest-tables' },
  { id: 'nest-tables-3', name: 'طقم متداخل ذهبي', price: "38 €", imageUrl: '/img/products/nest-tables/3.jpg', description: "طلاء ذهبي", category: 'nest-tables' },
  
];

module.exports = { categories, products };