import { MarketplaceListing, MarketplaceConfig } from '../types';

export const DEFAULT_MARKETPLACE_CONFIG: MarketplaceConfig = {
  enabled: true,
  storeTitle: 'متجر قارة الإلكتروني',
  storeSubtitle: 'المنصة المخصصة لأهالي وأعضاء مدينة قارة لإدراج وتصفح إعلانات البيع والشراء مباشرة',
  categories: ['عقارات', 'سيارات ومحركات', 'إلكترونيات وأجهزة', 'طاقة شمسية ومولدات', 'أثاث ومستلزمات منزلية', 'مواشي ومنتجات زراعية', 'خدمات وتبادلات'],
  addFormTitle: 'بطاقة إضافة إعلان سلعة جديد',
  addFormInstructions: '💡 يرجى كتابة اسم السلعة بوضوح، تحديد الفئة المناسبة، إضافة الوصف وصور واضحة للسلعة، وتحديد رقم الهاتف للتواصل. يمكن لمالك الإعلان تعديله أو حذفه أو تعيينه كـ (تم البيع) في أي وقت.',
  autoDeleteHoursAfterSold: 48,
};

export const INITIAL_MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: 'mkt-1',
    title: 'سيارة هيونداي أفانتي موديل 2008 خالية العلام بالكامل',
    category: 'سيارات ومحركات',
    price: '48,000,000 ل.س',
    description: 'سيارة هيونداي أفانتي نظيفة جداً، محرك واندو سليم 100%، غيار أوتوماتيك، فرام ABS، مكيف شغال ثلج، جاهزة للمعاينة والتسليم المباشر في قارة.',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
    ],
    sellerName: 'أبو أحمد الخطيب',
    sellerEmail: 'abouahmad@qara.city',
    sellerPhone: '0988123456',
    sellerLocation: 'قارة - الحارة الفوقا',
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    status: 'active',
    views: 42,
    comments: [
      {
        id: 'c-1',
        authorName: 'م. سامر القاري',
        authorEmail: 'samer@qara.city',
        content: 'ما شاء الله مبارك للمشتري، هل السعر قابل للتفاوض البسيط عند المعاينة؟',
        createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString()
      },
      {
        id: 'c-2',
        authorName: 'أبو أحمد الخطيب',
        authorEmail: 'abouahmad@qara.city',
        content: 'أهلاً بك أخي سامر، نعم هناك مراعاة بسيطة للجادين بعد الفحص والمعاينة.',
        createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
      }
    ]
  },
  {
    id: 'mkt-2',
    title: 'منزل مستقل دور أرضي مساحة 160م² مع حديقة في قارة',
    category: 'عقارات',
    price: '135,000,000 ل.س',
    description: 'منزل مستقل للبيع بالقرب من طريق الدير، يتألف من 3 غرف نوم وصالون واسع ومطبخ مجهز وحمامين مع حديقة مشجرة، كسوة سوبر ديلوكس، طابو 24 سهم جاهز لنقل الملكية.',
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
    ],
    sellerName: 'الحاج محمود الشعبان',
    sellerEmail: 'mahmoud@qara.city',
    sellerPhone: '0933778899',
    sellerLocation: 'قارة - طريق الدير الرئيسي',
    createdAt: new Date(Date.now() - 3600 * 1000 * 26).toISOString(),
    status: 'active',
    views: 89,
    comments: [
      {
        id: 'c-3',
        authorName: 'خالد الزين',
        authorEmail: 'khaled@qara.city',
        content: 'هل التدفئة مركزية ومتاحة بالبيت؟',
        createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
      }
    ]
  },
  {
    id: 'mkt-3',
    title: 'منظومة طاقة شمسية كاملة 3.5 كيلو واط مع إنفرتر وبطارية ليتيوم',
    category: 'طاقة شمسية ومولدات',
    price: '9,200,000 ل.س',
    description: 'منظومة طاقة شمسية بحالة الممتازة، تتضمن 2 ألواح 550 واط مونو كريستال + إنفرتر 3.5KVA هايبرد مستعمل 3 أشهر فقط + بطارية ليتيوم 100Ah تشغل منزل كامل بكفاءة عالية.',
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800'
    ],
    sellerName: 'عمر الرفاعي',
    sellerEmail: 'omar@qara.city',
    sellerPhone: '0955443322',
    sellerLocation: 'قارة - وسط البلد',
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    status: 'active',
    views: 65,
    comments: []
  }
];
