import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Image as ImageIcon, 
  Settings, 
  FolderPlus, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  AlertCircle,
  Eye,
  CheckCircle2,
  ListFilter,
  Palette,
  CheckSquare,
  DollarSign,
  Layers,
  HelpCircle
} from 'lucide-react';
import { MarketplaceListing, MarketplaceConfig, HomeContent, CustomFormField } from '../types';

interface MarketplaceAdminManagerProps {
  listings: MarketplaceListing[];
  setListings: React.Dispatch<React.SetStateAction<MarketplaceListing[]>>;
  homeContent: HomeContent;
  setHomeContent: React.Dispatch<React.SetStateAction<HomeContent>>;
}

export default function MarketplaceAdminManager({
  listings,
  setListings,
  homeContent,
  setHomeContent
}: MarketplaceAdminManagerProps) {
  const config = homeContent.marketplaceConfig || {
    enabled: true,
    storeTitle: 'متجر قارة الإلكتروني',
    storeSubtitle: 'المنصة المخصصة لأهالي وأعضاء مدينة قارة لإدراج وتصفح إعلانات البيع والشراء مباشرة',
    categories: ['عقارات', 'سيارات ومحركات', 'إلكترونيات وأجهزة', 'طاقة شمسية ومولدات', 'أثاث ومستلزمات منزلية', 'مواشي ومنتجات زراعية', 'خدمات وتبادلات'],
    addFormTitle: 'بطاقة إضافة إعلان سلعة جديد',
    addFormInstructions: '💡 يرجى كتابة اسم السلعة بوضوح، تحديد الفئة المناسبة، إضافة الوصف وصور واضحة للسلعة (بحد أقصى 3 صور)، وتحديد رقم الهاتف للتواصل.',
    addFormColor: 'emerald',
    fieldLabels: {
      title: 'اسم السلعة / عنوان الإعلان',
      category: 'قسم / تصنيف السلعة',
      price: 'السعر المطلوب',
      description: 'تفاصيل ووصف السلعة',
      phone: 'رقم تواصل / واتساب',
      location: 'الحي / المنطقة في قارة',
      images: 'صور السلعة (بحد أقصى 3 صور)'
    },
    requiredFields: {
      price: true,
      phone: true,
      description: true,
      images: false,
      location: false
    },
    customFields: [],
    enableUSD: false,
    autoDeleteHoursAfterSold: 48,
  };

  // Local config states
  const [storeEnabled, setStoreEnabled] = useState<boolean>(config.enabled !== false);
  const [storeTitle, setStoreTitle] = useState<string>(config.storeTitle || 'متجر قارة الإلكتروني');
  const [storeSubtitle, setStoreSubtitle] = useState<string>(config.storeSubtitle || '');
  const [addFormTitle, setAddFormTitle] = useState<string>(config.addFormTitle || 'بطاقة إضافة إعلان سلعة جديد');
  const [addFormInstructions, setAddFormInstructions] = useState<string>(config.addFormInstructions || '');
  const [addFormColor, setAddFormColor] = useState<'emerald' | 'amber' | 'stone' | 'sky' | 'violet' | 'rose' | 'indigo'>(config.addFormColor || 'emerald');
  
  // Field labels
  const [fieldLabels, setFieldLabels] = useState({
    title: config.fieldLabels?.title || 'اسم السلعة / عنوان الإعلان',
    category: config.fieldLabels?.category || 'قسم / تصنيف السلعة',
    price: config.fieldLabels?.price || 'السعر المطلوب',
    description: config.fieldLabels?.description || 'تفاصيل ووصف السلعة',
    phone: config.fieldLabels?.phone || 'رقم تواصل / واتساب',
    location: config.fieldLabels?.location || 'الحي / المنطقة في قارة',
    images: config.fieldLabels?.images || 'صور السلعة (بحد أقصى 3 صور)'
  });

  // Required fields configuration
  const [requiredFields, setRequiredFields] = useState({
    price: config.requiredFields?.price !== false,
    phone: config.requiredFields?.phone !== false,
    description: config.requiredFields?.description !== false,
    images: !!config.requiredFields?.images,
    location: !!config.requiredFields?.location
  });

  // Dynamic Custom Fields
  const [customFields, setCustomFields] = useState<CustomFormField[]>(config.customFields || []);
  const [newFieldLabel, setNewFieldLabel] = useState<string>('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'select'>('text');
  const [newFieldOptions, setNewFieldOptions] = useState<string>('');
  const [newFieldRequired, setNewFieldRequired] = useState<boolean>(false);

  // Currency config
  const [enableUSD, setEnableUSD] = useState<boolean>(!!config.enableUSD);

  // Ad Opening Mode (New Tab / Dedicated Page vs In-page Modal)
  const [openMode, setOpenMode] = useState<'new_tab' | 'modal'>(config.openMode || 'new_tab');

  const [autoDeleteHours, setAutoDeleteHours] = useState<number>(config.autoDeleteHoursAfterSold || 48);
  const [categories, setCategories] = useState<string[]>(config.categories || []);

  // Category editing state
  const [newCatInput, setNewCatInput] = useState<string>('');
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editingCatValue, setEditingCatValue] = useState<string>('');

  // Listings administration filter & search
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<string>('all');
  const [adminStatusFilter, setAdminStatusFilter] = useState<'all' | 'active' | 'sold'>('all');

  // Listing Editing Modal for Admin
  const [selectedListingForEdit, setSelectedListingForEdit] = useState<MarketplaceListing | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');
  const [editCurrency, setEditCurrency] = useState<'SYP' | 'USD'>('SYP');
  const [editSellerPhone, setEditSellerPhone] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editImages, setEditImages] = useState<string[]>([]);

  // Toast notification
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Add Custom Field
  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const newField: CustomFormField = {
      id: 'field_' + Date.now(),
      label: newFieldLabel.trim(),
      type: newFieldType,
      options: newFieldType === 'select' ? newFieldOptions.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      required: newFieldRequired
    };
    setCustomFields(prev => [...prev, newField]);
    setNewFieldLabel('');
    setNewFieldOptions('');
    setNewFieldRequired(false);
    showToast('تمت إضافة الخانة المخصصة بنجاح ➕');
  };

  // Delete Custom Field
  const handleDeleteCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
    showToast('تم حذف الخانة المخصصة 🗑️');
  };

  // Save Settings
  const handleSaveMarketplaceConfig = () => {
    const updatedConfig: MarketplaceConfig = {
      enabled: storeEnabled,
      storeTitle: storeTitle.trim(),
      storeSubtitle: storeSubtitle.trim(),
      categories: categories,
      addFormTitle: addFormTitle.trim(),
      addFormInstructions: addFormInstructions.trim(),
      addFormColor: addFormColor,
      fieldLabels: fieldLabels,
      requiredFields: requiredFields,
      customFields: customFields,
      enableUSD: enableUSD,
      autoDeleteHoursAfterSold: autoDeleteHours,
      openMode: openMode
    };

    setHomeContent(prev => ({
      ...prev,
      marketplaceConfig: updatedConfig
    }));

    showToast('تم حفظ إعدادات وصلاحيات متجر قارة الإلكتروني وبطاقة الإضافة بنجاح! 💾');
  };

  // Add Category
  const handleAddCategory = () => {
    if (!newCatInput.trim()) return;
    if (categories.includes(newCatInput.trim())) {
      showToast('⚠️ هذا التبويب موجود بالفعل');
      return;
    }
    const updated = [...categories, newCatInput.trim()];
    setCategories(updated);
    setNewCatInput('');
    showToast('تمت إضافة التبويب الجديد 🏷️');
  };

  // Edit Category
  const handleSaveEditCategory = (index: number) => {
    if (!editingCatValue.trim()) return;
    const updated = [...categories];
    updated[index] = editingCatValue.trim();
    setCategories(updated);
    setEditingCatIndex(null);
    setEditingCatValue('');
    showToast('تم تعديل اسم التبويب ✏️');
  };

  // Delete Category
  const handleDeleteCategory = (index: number) => {
    const catName = categories[index];
    if (window.confirm(`هل أنت تأكد من رغبتك في حذف تبويب "${catName}"؟`)) {
      setCategories(categories.filter((_, i) => i !== index));
      showToast('تم حذف التبويب 🗑️');
    }
  };

  // Open Edit Listing Modal (Admin)
  const handleOpenAdminEdit = (item: MarketplaceListing) => {
    setSelectedListingForEdit(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditPrice(item.price || '');
    setEditCurrency(item.currency || 'SYP');
    setEditSellerPhone(item.sellerPhone || '');
    setEditDescription(item.description);
    setEditImages(item.images || []);
  };

  // Delete Image from Listing (Admin)
  const handleDeleteImageFromListing = (imgIndex: number) => {
    setEditImages(prev => prev.filter((_, i) => i !== imgIndex));
    showToast('تم حذف الصورة المحددة من الإعلان 🖼️');
  };

  // Save Admin Listing Edits
  const handleSaveAdminListingEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForEdit) return;

    const updatedListings = listings.map(item => {
      if (item.id === selectedListingForEdit.id) {
        return {
          ...item,
          title: editTitle.trim(),
          category: editCategory,
          price: editPrice.trim(),
          currency: editCurrency,
          sellerPhone: editSellerPhone.trim(),
          description: editDescription.trim(),
          images: editImages
        };
      }
      return item;
    });

    setListings(updatedListings);
    setSelectedListingForEdit(null);
    showToast('تم حفظ تعديلات الإعلان بنجاح بواسطة المدير ✏️');
  };

  // Delete Listing (Admin)
  const handleAdminDeleteListing = (item: MarketplaceListing) => {
    if (window.confirm(`هل أنت تأكد من رغبتك في حذف إعلان "${item.title}" نهائياً من المتجر؟`)) {
      setListings(listings.filter(l => l.id !== item.id));
      showToast('تم حذف الإعلان نهائياً 🗑️');
    }
  };

  // Toggle Sold Status (Admin)
  const handleAdminToggleSold = (item: MarketplaceListing) => {
    const isSold = item.status === 'sold';
    const now = new Date().toISOString();
    const updated = listings.map(l => {
      if (l.id === item.id) {
        return {
          ...l,
          status: isSold ? ('active' as const) : ('sold' as const),
          soldAt: isSold ? undefined : now
        };
      }
      return l;
    });
    setListings(updated);
    showToast(isSold ? 'تمت إعادة الإعلان إلى العرض النشط 🟢' : 'تم تحديد الإعلان كـ (تم البيع) 🏷️');
  };

  // Filter listings for admin overview
  const filteredListings = listings.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(adminSearch.toLowerCase()) ||
      item.sellerName.toLowerCase().includes(adminSearch.toLowerCase());

    const matchesCategory = adminCategoryFilter === 'all' || item.category === adminCategoryFilter;
    const matchesStatus = adminStatusFilter === 'all' || item.status === adminStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8 text-right font-sans">

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-amber-300 border border-amber-500/40 px-6 py-3 rounded-2xl shadow-2xl font-bold text-xs md:text-sm flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-emerald-950 text-white p-6 md:p-8 rounded-3xl border border-emerald-800/40 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-900/80 text-amber-400 rounded-2xl border border-emerald-700/50">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">
              لوحة تحكم وتخصيص متجر قارة الإلكتروني (سوق البيع والشراء)
            </h2>
            <p className="text-xs md:text-sm text-stone-400">
              إدارة كاملة لبطاقة إضافة الإعلان، تحديد الحقول الإلزامية/الاختيارية، تخصيص الألوان والعناوين، تفعيل عملة الدولار، والتحكم بالسلع والصور.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: MASTER STORE TOGGLE & GENERAL CONFIGURATION */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-emerald-800" />
            <h3 className="font-extrabold text-base md:text-lg text-stone-900">
              إعدادات تفعيل ونمط متجر قارة
            </h3>
          </div>

          {/* Master Enable/Disable Toggle */}
          <div className="flex items-center gap-3 bg-stone-100 p-2 rounded-2xl border border-stone-200">
            <span className="text-xs font-bold text-stone-700">تفعيل المتجر في الموقع:</span>
            <button
              type="button"
              onClick={() => setStoreEnabled(!storeEnabled)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                storeEnabled 
                  ? 'bg-emerald-700 text-white shadow-md' 
                  : 'bg-rose-600 text-white shadow-md'
              }`}
            >
              {storeEnabled ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>مفّعل ومتاح بصفحة منسدلة خاصة</span>
                </>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  <span>معطل ومخفي بالكامل</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* General Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">عنوان المتجر الرئيسي:</label>
            <input
              type="text"
              value={storeTitle}
              onChange={(e) => setStoreTitle(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-2xl outline-none text-xs text-stone-900 font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">الوصف الفرعي للمتجر:</label>
            <input
              type="text"
              value={storeSubtitle}
              onChange={(e) => setStoreSubtitle(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-2xl outline-none text-xs text-stone-900"
            />
          </div>
        </div>

        {/* CURRENCY CONTROL: Syrian Pound (SYP) Default + USD Option */}
        <div className="p-5 bg-gradient-to-r from-amber-50 to-emerald-50 rounded-2xl border border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-800" />
              <div>
                <h4 className="font-extrabold text-sm text-stone-900">إدارة العملات المتاحة بالتسعير</h4>
                <p className="text-[11px] text-stone-600">
                  العملة الأساسية هي <strong>الليرة السورية (ل.س)</strong>. يمكنك تفعيل خيار التسعير بالدولار الأمريكي ($) للمعلنين.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEnableUSD(!enableUSD)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border flex items-center gap-2 ${
                enableUSD 
                  ? 'bg-emerald-800 text-amber-300 border-amber-400' 
                  : 'bg-stone-200 text-stone-700 border-stone-300'
              }`}
            >
              <span>{enableUSD ? '💵 مفّعل (ليرة سورية + دولار أمريكي $)' : '🇸🇾 ليرة سورية فقط (ل.س)'}</span>
            </button>
          </div>
        </div>

        {/* AD DISPLAY / OPENING MODE CONTROL (فتح كـ تبويب جديد أو كـ بطاقة في نفس الصفحة) */}
        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-800" />
              <span>طريقة فتح وتصفح الإعلان عند الضغط عليه من قبل الزوار والأعضاء:</span>
            </h4>
            <p className="text-xs text-stone-600">
              اختر سلوك النظام عند الضغط على أي إعلان في المتجر:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setOpenMode('new_tab')}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-start gap-3 ${
                openMode === 'new_tab'
                  ? 'bg-emerald-800 text-white border-emerald-900 ring-2 ring-emerald-500 shadow-md'
                  : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${openMode === 'new_tab' ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-700'}`}>
                🌐
              </div>
              <div className="space-y-1">
                <span className="font-extrabold text-xs block">فتح في تبويب/صفحة جديدة (موصى به)</span>
                <span className={`text-[11px] block leading-relaxed ${openMode === 'new_tab' ? 'text-emerald-100' : 'text-stone-500'}`}>
                  يُفتح الإعلان في تبويب جديد مستقل بصفحة متكاملة تعرض كافة الصور والتفاصيل ورقم التواصل والتعليقات بوضوح وسلاسة.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setOpenMode('modal')}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-start gap-3 ${
                openMode === 'modal'
                  ? 'bg-emerald-800 text-white border-emerald-900 ring-2 ring-emerald-500 shadow-md'
                  : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${openMode === 'modal' ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-700'}`}>
                🪟
              </div>
              <div className="space-y-1">
                <span className="font-extrabold text-xs block">فتح كبطاقة منبثقة (Modal) أمام الصفحة</span>
                <span className={`text-[11px] block leading-relaxed ${openMode === 'modal' ? 'text-emerald-100' : 'text-stone-500'}`}>
                  تظهر بطاقة الإعلان في نافذة منبثقة أمام الصفحة الحالية في أعلى طبقة بالموقع فوق كافة العناصر والترويسة.
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: SUB-ADMIN CONTROL FOR ADD FORM CARD (تخصيص بطاقة إضافة سلعة) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-800" />
            <h3 className="font-extrabold text-base md:text-lg text-stone-900">
              لوحة تحكم بطاقة إضافة سلعة (تغيير الألوان، العناوين، البيانات الإلزامية الخانات الجديدة)
            </h3>
          </div>
        </div>

        {/* 1. Form Card Theme Color Customization */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-stone-800 flex items-center gap-2">
            <Palette className="h-4 w-4 text-emerald-800" />
            <span>تحديد لون الهوية البصرية لبطاقة الإضافة:</span>
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {[
              { id: 'emerald', label: 'زمردي وذهبي', bg: 'bg-emerald-800 text-amber-300' },
              { id: 'amber', label: 'ذهبي قاري', bg: 'bg-amber-600 text-stone-950' },
              { id: 'stone', label: 'فحمي داكن', bg: 'bg-stone-900 text-emerald-400' },
              { id: 'sky', label: 'أزرق سماوي', bg: 'bg-sky-700 text-white' },
              { id: 'violet', label: 'بنفسجي ملوكي', bg: 'bg-violet-800 text-amber-300' },
              { id: 'rose', label: 'عنابي قلموني', bg: 'bg-rose-800 text-white' },
              { id: 'indigo', label: 'نيلي فاخر', bg: 'bg-indigo-900 text-amber-300' },
            ].map(col => (
              <button
                key={col.id}
                type="button"
                onClick={() => setAddFormColor(col.id as any)}
                className={`p-3 rounded-2xl text-xs font-extrabold transition-all border cursor-pointer flex flex-col items-center gap-1.5 ${col.bg} ${
                  addFormColor === col.id ? 'ring-4 ring-emerald-500 scale-105 shadow-lg border-white' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <span>{col.label}</span>
                {addFormColor === col.id && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Form Card Header & Instructions Customization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">عنوان بطاقة إضافة السلعة:</label>
            <input
              type="text"
              value={addFormTitle}
              onChange={(e) => setAddFormTitle(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-2xl outline-none text-xs text-stone-900 font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">توجيهات وتعليمات الإضافة:</label>
            <input
              type="text"
              value={addFormInstructions}
              onChange={(e) => setAddFormInstructions(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-2xl outline-none text-xs text-stone-900"
            />
          </div>
        </div>

        {/* 3. Field Labels Customization (تعديل العناوين الرئيسية في البطاقة) */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h4 className="font-extrabold text-xs md:text-sm text-stone-900 flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-emerald-800" />
            <span>تعديل تسميات وعناوين الحقول الأساسية في البطاقة:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">حقل عنوان السلعة:</label>
              <input
                type="text"
                value={fieldLabels.title}
                onChange={(e) => setFieldLabels({ ...fieldLabels, title: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">حقل تصنيف السلعة:</label>
              <input
                type="text"
                value={fieldLabels.category}
                onChange={(e) => setFieldLabels({ ...fieldLabels, category: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">حقل السعر:</label>
              <input
                type="text"
                value={fieldLabels.price}
                onChange={(e) => setFieldLabels({ ...fieldLabels, price: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">حقل الوصف والتفاصيل:</label>
              <input
                type="text"
                value={fieldLabels.description}
                onChange={(e) => setFieldLabels({ ...fieldLabels, description: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">حقل رقم الهاتف:</label>
              <input
                type="text"
                value={fieldLabels.phone}
                onChange={(e) => setFieldLabels({ ...fieldLabels, phone: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">حقل صور السلعة (أقصى 3 صور):</label>
              <input
                type="text"
                value={fieldLabels.images}
                onChange={(e) => setFieldLabels({ ...fieldLabels, images: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* 4. Required vs Optional Configuration (تحديد البيانات الإلزامية من الاختيارية) */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h4 className="font-extrabold text-xs md:text-sm text-stone-900 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-emerald-800" />
            <span>تحديد الحقول الإلزامية (مطلوبة للرفع) والحقول الاختيارية:</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { key: 'price', label: 'السعر' },
              { key: 'phone', label: 'رقم الهاتف' },
              { key: 'description', label: 'وصف السلعة' },
              { key: 'images', label: 'صورة واحدة عالأقل' },
              { key: 'location', label: 'المنطقة' },
            ].map(f => (
              <label key={f.key} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2 cursor-pointer hover:bg-stone-100 transition-all">
                <input
                  type="checkbox"
                  checked={(requiredFields as any)[f.key]}
                  onChange={(e) => setRequiredFields({ ...requiredFields, [f.key]: e.target.checked })}
                  className="h-4 w-4 rounded text-emerald-700 cursor-pointer"
                />
                <span className="text-xs font-bold text-stone-800">{f.label} { (requiredFields as any)[f.key] ? '(إجباري 🔴)' : '(اختياري 🟢)' }</span>
              </label>
            ))}
          </div>
        </div>

        {/* 5. Dynamic Custom Fields (إمكانية إضافة خانات جديدة في البطاقة) */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h4 className="font-extrabold text-xs md:text-sm text-stone-900 flex items-center gap-2">
            <Plus className="h-4 w-4 text-amber-600" />
            <span>إضافة وتعديل خانات حقول جديدة مخصصة في البطاقة:</span>
          </h4>

          {/* Add dynamic field form */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-700">عنوان الخانة الجديدة:</label>
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="مثال: حالة السلعة / سنة الصنع..."
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700">نوع الإدخال:</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as any)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  <option value="text">نص حر (Text)</option>
                  <option value="number">رقمي (Number)</option>
                  <option value="select">قائمة خيارات (Select)</option>
                </select>
              </div>

              {newFieldType === 'select' && (
                <div>
                  <label className="text-[11px] font-bold text-stone-700">خيارات القائمة (مفصولة بفاصلة):</label>
                  <input
                    type="text"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    placeholder="جديد، مستعمل بحالة ممتازة، للتجديد"
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              )}

              <div className="flex items-end gap-2">
                <label className="flex items-center gap-1 text-xs font-bold text-stone-700 p-2">
                  <input
                    type="checkbox"
                    checked={newFieldRequired}
                    onChange={(e) => setNewFieldRequired(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>إجباري</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddCustomField}
                  className="px-4 py-2 bg-emerald-800 text-amber-300 font-bold text-xs rounded-xl shadow cursor-pointer shrink-0"
                >
                  إضافة الخانة
                </button>
              </div>
            </div>

            {/* List of custom fields */}
            {customFields.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-extrabold text-stone-700">الخانات المخصصة المضافة حالياً:</span>
                <div className="flex flex-wrap gap-2">
                  {customFields.map(f => (
                    <div key={f.id} className="p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold flex items-center gap-2">
                      <span className="text-emerald-800">{f.label}</span>
                      <span className="text-[10px] text-stone-500">({f.type})</span>
                      {f.required && <span className="text-[10px] text-rose-600 font-extrabold">إجباري</span>}
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomField(f.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-stone-200">
          <button
            type="button"
            onClick={handleSaveMarketplaceConfig}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold text-xs md:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>حفظ إعدادات وبطاقة المتجر</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: CATEGORY MANAGEMENT (إضافة / حذف / تعديل التبويبات) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-amber-600" />
            <h3 className="font-extrabold text-base md:text-lg text-stone-900">
              إدارة تبويبات وتصنيفات المتجر (عقارات، سيارات، طاقة شمسية...)
            </h3>
          </div>
          <span className="text-xs font-bold text-stone-500">
            عدد التبويبات الحالي: ({categories.length})
          </span>
        </div>

        {/* Add Category Form */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newCatInput}
            onChange={(e) => setNewCatInput(e.target.value)}
            placeholder="أدخل اسم تبويب جديد (مثل: خضروات وفواكه / ملابس وتجهيزات)..."
            className="flex-1 p-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs outline-none focus:border-amber-500 font-bold"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold text-xs rounded-2xl shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة تبويب جديد</span>
          </button>
        </div>

        {/* Categories Chips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat, idx) => (
            <div key={idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-2">
              {editingCatIndex === idx ? (
                <div className="flex items-center gap-1 w-full">
                  <input
                    type="text"
                    value={editingCatValue}
                    onChange={(e) => setEditingCatValue(e.target.value)}
                    className="flex-1 p-1.5 bg-white border border-stone-300 rounded-xl text-xs outline-none font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveEditCategory(idx)}
                    className="p-1.5 bg-emerald-700 text-white rounded-xl"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCatIndex(null)}
                    className="p-1.5 bg-stone-300 text-stone-700 rounded-xl"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span className="font-extrabold text-xs text-stone-900">{cat}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCatIndex(idx);
                        setEditingCatValue(cat);
                      }}
                      className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-xl transition-all"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(idx)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-xl transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: ALL LISTINGS & MEDIA MANAGEMENT */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-4 gap-3">
          <div className="flex items-center gap-2">
            <ListFilter className="h-5 w-5 text-emerald-800" />
            <h3 className="font-extrabold text-base md:text-lg text-stone-900">
              إدارة الإعلانات والسلع المعروضة ({listings.length})
            </h3>
          </div>

          {/* Admin search & filters */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="البحث في الإعلانات والمعلنين..."
              className="p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs outline-none"
            />
            <select
              value={adminCategoryFilter}
              onChange={(e) => setAdminCategoryFilter(e.target.value)}
              className="p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold outline-none cursor-pointer"
            >
              <option value="all">كافة التبويبات</option>
              {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Listings Table / Cards */}
        {filteredListings.length === 0 ? (
          <p className="text-center py-8 text-xs text-stone-500 bg-stone-50 rounded-2xl">
            لا توجد إعلانات مطابقة لخيارات الفرز حالياً.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((item) => (
              <div 
                key={item.id}
                className={`p-4 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  item.status === 'sold' ? 'bg-rose-50/30 border-rose-200' : 'bg-stone-50 border-stone-200'
                }`}
              >
                {/* Image & Title */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800'}
                    alt=""
                    className="h-16 w-20 object-cover rounded-2xl border border-stone-300 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-lg">
                        {item.category}
                      </span>
                      {item.status === 'sold' ? (
                        <span className="px-2.5 py-0.5 bg-rose-600 text-white text-[10px] font-extrabold rounded-lg">
                          🏷️ تم البيع
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg">
                          🟢 معروض
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-sm text-stone-900">{item.title}</h4>
                    <p className="text-xs text-stone-500">
                      👤 المعلن: <strong className="text-stone-800">{item.sellerName}</strong> ({item.sellerEmail}) • 📞 {item.sellerPhone || 'لا يوجد'}
                    </p>
                  </div>
                </div>

                {/* Price & Admin Controls */}
                <div className="flex items-center gap-2 shrink-0 justify-end">
                  {item.price && (
                    <span className="px-3 py-1 bg-amber-400 text-stone-950 font-black text-xs rounded-xl">
                      {item.price} {item.currency === 'USD' ? '$' : 'ل.س'}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleAdminToggleSold(item)}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    {item.status === 'sold' ? 'إعادة للعرض' : 'تحديد تم البيع'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenAdminEdit(item)}
                    className="p-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>تعديل والصور</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdminDeleteListing(item)}
                    className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: ADMIN EDIT LISTING & PHOTO MANAGEMENT */}
      {selectedListingForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-stone-900 text-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-5 border border-emerald-800/50 shadow-2xl my-8 text-right"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span>تعديل وحذف صور الإعلان (صلاحيات المدير)</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setSelectedListingForEdit(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdminListingEdit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300">اسم السلعة / العنوان:</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300">التبويب / الفئة:</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none cursor-pointer"
                  >
                    {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300">السعر المطلوبة:</label>
                  <input
                    type="text"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-amber-300 font-bold outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300">العملة:</label>
                  <select
                    value={editCurrency}
                    onChange={(e) => setEditCurrency(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-amber-300 font-bold outline-none cursor-pointer"
                  >
                    <option value="SYP">ليرة سورية (ل.س)</option>
                    <option value="USD">دولار أمريكي ($)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300">وصف السلعة:</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none"
                />
              </div>

              {/* Photo Management: Delete specific images */}
              <div className="space-y-2 pt-2 border-t border-stone-800">
                <label className="block text-xs font-extrabold text-amber-300">
                  📸 حذف صور محددة من الإعلان ({editImages.length} صور من 3 كحد أقصى):
                </label>
                {editImages.length === 0 ? (
                  <p className="text-xs text-stone-500">لا توجد صور متبقية في هذا الإعلان.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2.5">
                    {editImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-2xl overflow-hidden border border-stone-700 h-24 bg-stone-950">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleDeleteImageFromListing(idx)}
                          title="حذف هذه الصورة"
                          className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setSelectedListingForEdit(null)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 text-xs font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow"
                >
                  حفظ التعديلات
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
