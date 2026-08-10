import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Tag, 
  Plus, 
  Search, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  X, 
  Upload, 
  Image as ImageIcon, 
  ExternalLink, 
  Eye, 
  Sparkles, 
  Check, 
  Lock, 
  AlertCircle,
  Share2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Layers
} from 'lucide-react';
import { MarketplaceListing, MarketplaceConfig, CitizenUser, HomeContent, CustomFormField } from '../types';
import PageHeader from './PageHeader';

interface MarketplaceTabProps {
  listings: MarketplaceListing[];
  setListings: React.Dispatch<React.SetStateAction<MarketplaceListing[]>>;
  marketplaceConfig?: MarketplaceConfig;
  loggedCitizen: CitizenUser | null;
  onOpenCitizenAuth: () => void;
  homeContent: HomeContent;
  isAdmin?: boolean;
}

const ITEMS_PER_PAGE = 12;

export default function MarketplaceTab({
  listings,
  setListings,
  marketplaceConfig,
  loggedCitizen,
  onOpenCitizenAuth,
  homeContent,
  isAdmin = false
}: MarketplaceTabProps) {
  const config: MarketplaceConfig = marketplaceConfig || homeContent.marketplaceConfig || {
    enabled: true,
    storeTitle: 'متجر قارة الإلكتروني',
    storeSubtitle: 'منصة أهالي قارة لإعلانات البيع والشراء والتبادلات بين الأعضاء المسجلين',
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

  const categories = config.categories && config.categories.length > 0 
    ? config.categories 
    : ['عقارات', 'سيارات ومحركات', 'إلكترونيات وأجهزة', 'طاقة شمسية ومولدات', 'أثاث ومستلزمات منزلية', 'مواشي ومنتجات زراعية', 'خدمات وتبادلات'];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'sold'>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState<boolean>(false);
  const [editingListing, setEditingListing] = useState<MarketplaceListing | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>(categories[0] || 'عقارات');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formCurrency, setFormCurrency] = useState<'SYP' | 'USD'>('SYP');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [formCustomValues, setFormCustomValues] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>('');

  // Detail Modal & Standalone Page state
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [isStandaloneView, setIsStandaloneView] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Check URL parameter for adId (e.g. ?adId=mkt-123)
  const [urlAdId, setUrlAdId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('adId') || params.get('listingId');
  });

  useEffect(() => {
    if (urlAdId && listings.length > 0) {
      const found = listings.find(l => l.id === urlAdId);
      if (found) {
        setSelectedListing(found);
        setIsStandaloneView(true);
        setActiveImageIndex(0);
      }
    }
  }, [urlAdId, listings]);

  const handleCloseDetailView = () => {
    setSelectedListing(null);
    setIsStandaloneView(false);
    if (urlAdId) {
      setUrlAdId(null);
      if (window.history.pushState) {
        const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({ path: newurl }, '', newurl);
      }
    }
  };

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard escape listener to close detail modal easily
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedListing) setSelectedListing(null);
        if (isAddEditOpen) setIsAddEditOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedListing, isAddEditOpen]);

  // Automatic 48-Hour Deletion Logic for Sold Items
  useEffect(() => {
    const autoDeleteHours = config.autoDeleteHoursAfterSold || 48;
    const expiryMs = autoDeleteHours * 3600 * 1000;
    const now = Date.now();

    const validListings = listings.filter(item => {
      if (item.status === 'sold' && item.soldAt) {
        const soldTime = new Date(item.soldAt).getTime();
        if (now - soldTime >= expiryMs) {
          return false; // Automatically purge item after 48 hours
        }
      }
      return true;
    });

    if (validListings.length !== listings.length) {
      setListings(validListings);
    }
  }, [listings, config.autoDeleteHoursAfterSold, setListings]);

  // Reset pagination when category, search, or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, statusFilter]);

  // Open Add Listing Modal
  const handleOpenAdd = () => {
    if (!loggedCitizen && !isAdmin) {
      onOpenCitizenAuth();
      return;
    }
    setEditingListing(null);
    setFormTitle('');
    setFormCategory(categories[0] || 'عقارات');
    setFormPrice('');
    setFormCurrency('SYP');
    setFormPhone(loggedCitizen?.phone || '');
    setFormLocation('قارة');
    setFormDescription('');
    setFormImages([]);
    setImageUrlInput('');
    setFormCustomValues({});
    setFormError('');
    setIsAddEditOpen(true);
  };

  // Open Edit Listing Modal
  const handleOpenEdit = (item: MarketplaceListing, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Check permission: owner or admin
    const isOwner = loggedCitizen && loggedCitizen.email === item.sellerEmail;
    if (!isOwner && !isAdmin) {
      showToast('⚠️ لا تملك صلاحية تعديل هذا الإعلان (متاح فقط لصاحب الإعلان أو المدير).');
      return;
    }

    setEditingListing(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormPrice(item.price || '');
    setFormCurrency(item.currency || 'SYP');
    setFormPhone(item.sellerPhone || '');
    setFormLocation(item.sellerLocation || 'قارة');
    setFormDescription(item.description);
    setFormImages(item.images || []);
    setImageUrlInput('');
    setFormCustomValues(item.customFieldValues || {});
    setFormError('');
    setIsAddEditOpen(true);
  };

  // Delete Image from Form
  const handleRemoveImageFromForm = (index: number) => {
    setFormImages(prev => prev.filter((_, i) => i !== index));
  };

  // Upload file image (base64) - Enforce max 3 images limit
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formImages.length >= 3) {
      setFormError('⚠️ لقد وصلت للحد الأقصى المسموح به للصور (3 صور فقط).');
      return;
    }

    const availableSlots = 3 - formImages.length;
    const filesToProcess = (Array.from(files) as File[]).slice(0, availableSlots);
    const maxKB = homeContent?.maxUploadSizeKB || 5000;

    filesToProcess.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > maxKB * 1024) {
        setFormError(`حجم إحدى الصور كبير جداً (الحد الأقصى ${maxKB} كيلوبايت)`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setFormImages(prev => prev.length < 3 ? [...prev, reader.result as string] : prev);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add URL image - Enforce max 3 images limit
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (formImages.length >= 3) {
      setFormError('⚠️ الحد الأقصى للصور هو 3 صور فقط per إعلان.');
      return;
    }
    setFormImages(prev => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  // Submit Add / Edit Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Required field validation according to config
    const req = config.requiredFields || {};
    
    if (!formTitle.trim()) {
      setFormError('يرجى كتابة عنوان / اسم السلعة');
      return;
    }

    if (req.price !== false && !formPrice.trim()) {
      setFormError('يرجى تحديد السعر المطلوب للسلعة');
      return;
    }

    if (req.phone !== false && !formPhone.trim()) {
      setFormError('يرجى كتابة رقم الهاتف / الواتساب للتواصل');
      return;
    }

    if (req.description !== false && !formDescription.trim()) {
      setFormError('يرجى إدخال وصف السلعة');
      return;
    }

    if (req.images && formImages.length === 0) {
      setFormError('يرجى رفع صورة واحدة على الأقل للسلعة');
      return;
    }

    // Check custom fields required
    if (config.customFields && config.customFields.length > 0) {
      for (const cf of config.customFields) {
        if (cf.required && !formCustomValues[cf.id]) {
          setFormError(`يرجى تعبئة الحقل الإجباري: "${cf.label}"`);
          return;
        }
      }
    }

    const sellerName = editingListing ? editingListing.sellerName : (loggedCitizen?.fullName || 'عضو مسجل في قارة');
    const sellerEmail = editingListing ? editingListing.sellerEmail : (loggedCitizen?.email || 'member@qara.city');

    if (editingListing) {
      // Update existing
      const updatedList = listings.map(item => {
        if (item.id === editingListing.id) {
          return {
            ...item,
            title: formTitle.trim(),
            category: formCategory,
            price: formPrice.trim(),
            currency: formCurrency,
            sellerPhone: formPhone.trim(),
            sellerLocation: formLocation.trim(),
            description: formDescription.trim(),
            images: formImages.slice(0, 3),
            customFieldValues: formCustomValues
          };
        }
        return item;
      });
      setListings(updatedList);
      if (selectedListing && selectedListing.id === editingListing.id) {
        setSelectedListing(prev => prev ? {
          ...prev,
          title: formTitle.trim(),
          category: formCategory,
          price: formPrice.trim(),
          currency: formCurrency,
          sellerPhone: formPhone.trim(),
          sellerLocation: formLocation.trim(),
          description: formDescription.trim(),
          images: formImages.slice(0, 3),
          customFieldValues: formCustomValues
        } : null);
      }
      showToast('تم تعديل الإعلان بنجاح! ✏️');
    } else {
      // Create new
      const newListing: MarketplaceListing = {
        id: 'mkt-' + Date.now(),
        title: formTitle.trim(),
        category: formCategory,
        price: formPrice.trim(),
        currency: formCurrency,
        description: formDescription.trim(),
        images: formImages.length > 0 ? formImages.slice(0, 3) : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800'],
        sellerName,
        sellerEmail,
        sellerPhone: formPhone.trim(),
        sellerLocation: formLocation.trim() || 'قارة',
        createdAt: new Date().toISOString(),
        status: 'active',
        comments: [],
        views: 1,
        customFieldValues: formCustomValues
      };
      setListings([newListing, ...listings]);
      showToast('تم نشر إعلان السلعة بنجاح في متجر قارة! 🎉');
    }

    setIsAddEditOpen(false);
  };

  // Mark Listing as Sold out (تم البيع)
  const handleMarkAsSold = (item: MarketplaceListing, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const isOwner = loggedCitizen && loggedCitizen.email === item.sellerEmail;
    if (!isOwner && !isAdmin) {
      showToast('⚠️ لا تملك صلاحية تغيير حالة هذا الإعلان (متاح فقط لصاحب الإعلان أو المدير).');
      return;
    }

    const now = new Date().toISOString();
    const updated = listings.map(l => {
      if (l.id === item.id) {
        return {
          ...l,
          status: 'sold' as const,
          soldAt: now
        };
      }
      return l;
    });

    setListings(updated);
    if (selectedListing && selectedListing.id === item.id) {
      setSelectedListing(prev => prev ? { ...prev, status: 'sold', soldAt: now } : null);
    }
    showToast('تم تحديد السلعة كـ (تم البيع) 🏷️. سيتم الاحتفاظ بالإعلان في الموقع لمدة 48 ساعة ثم حذفه تلقائياً.');
  };

  // Delete Listing
  const handleDeleteListing = (item: MarketplaceListing, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const isOwner = loggedCitizen && loggedCitizen.email === item.sellerEmail;
    if (!isOwner && !isAdmin) {
      showToast('⚠️ لا تملك صلاحية حذف هذا الإعلان.');
      return;
    }

    if (window.confirm(`هل أنت تأكد من رغبتك في حذف الإعلان "${item.title}" نهائياً؟`)) {
      setListings(listings.filter(l => l.id !== item.id));
      if (selectedListing?.id === item.id) {
        setSelectedListing(null);
      }
      showToast('تم حذف الإعلان بنجاح. 🗑️');
    }
  };

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;

    if (!loggedCitizen && !isAdmin) {
      onOpenCitizenAuth();
      return;
    }

    if (!newCommentText.trim()) return;

    const authorName = loggedCitizen ? loggedCitizen.fullName : (isAdmin ? 'مدير الموقع' : 'عضو مسجل');
    const authorEmail = loggedCitizen ? loggedCitizen.email : 'admin@qara.city';

    const newComment = {
      id: 'cmt-' + Date.now(),
      authorName,
      authorEmail,
      content: newCommentText.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedListing = {
      ...selectedListing,
      comments: [...(selectedListing.comments || []), newComment]
    };

    setListings(listings.map(l => l.id === selectedListing.id ? updatedListing : l));
    setSelectedListing(updatedListing);
    setNewCommentText('');
    showToast('تمت إضافة تعليقك بنجاح! 💬');
  };

  // Delete Comment
  const handleDeleteComment = (commentId: string) => {
    if (!selectedListing) return;

    const updatedComments = selectedListing.comments.filter(c => c.id !== commentId);
    const updatedListing = {
      ...selectedListing,
      comments: updatedComments
    };

    setListings(listings.map(l => l.id === selectedListing.id ? updatedListing : l));
    setSelectedListing(updatedListing);
    showToast('تم حذف التعليق.');
  };

  // Filter & SORT listings: Newest date first!
  const filteredListings = listings
    .filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.sellerName && item.sellerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Newest date first

  // Pagination math
  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE) || 1;
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Open Listing Detail (New tab vs Modal based on store config or click action)
  const handleOpenDetail = (item: MarketplaceListing, forceMode?: 'new_tab' | 'modal', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Increment views counter
    const updated = listings.map(l => l.id === item.id ? { ...l, views: (l.views || 0) + 1 } : l);
    setListings(updated);

    const targetMode = forceMode || config.openMode || 'new_tab';

    if (targetMode === 'new_tab') {
      const targetUrl = `${window.location.origin}${window.location.pathname}?adId=${item.id}`;
      window.open(targetUrl, '_blank');
    } else {
      setSelectedListing(item);
      setIsStandaloneView(false);
      setActiveImageIndex(0);
    }
  };

  // Time formatter helper
  const formatTimeAgo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 3600));
      const diffDays = Math.floor(diffMs / (1000 * 3600 * 24));

      if (diffMins < 5) return 'الآن';
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      if (diffDays === 1) return 'أمس';
      if (diffDays < 30) return `منذ ${diffDays} يوم`;
      return d.toLocaleDateString('ar-SY');
    } catch (e) {
      return dateStr;
    }
  };

  // Remaining sold time helper
  const getRemainingSoldHours = (soldAtStr?: string) => {
    if (!soldAtStr) return 48;
    try {
      const soldTime = new Date(soldAtStr).getTime();
      const autoDeleteMs = (config.autoDeleteHoursAfterSold || 48) * 3600 * 1000;
      const remainingMs = autoDeleteMs - (Date.now() - soldTime);
      const hours = Math.ceil(remainingMs / (1000 * 3600));
      return Math.max(0, hours);
    } catch (e) {
      return 48;
    }
  };

  // Theme helper for Add Form Card
  const getAddFormThemeClasses = () => {
    const c = config.addFormColor || 'emerald';
    switch (c) {
      case 'amber': return 'bg-amber-950 text-amber-100 border-amber-600/40';
      case 'stone': return 'bg-stone-900 text-stone-100 border-stone-700';
      case 'sky': return 'bg-sky-950 text-sky-100 border-sky-600/40';
      case 'violet': return 'bg-violet-950 text-violet-100 border-violet-600/40';
      case 'rose': return 'bg-rose-950 text-rose-100 border-rose-600/40';
      case 'indigo': return 'bg-indigo-950 text-indigo-100 border-indigo-600/40';
      case 'emerald':
      default: return 'bg-stone-900 text-white border-emerald-800/50';
    }
  };

  // IF STANDALONE VIEW (e.g. opened in a new tab via ?adId=mkt-123 or direct link):
  // Render strictly the standalone ad view without rendering the store grid!
  if (isStandaloneView && selectedListing) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-sans text-right">
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-amber-300 border border-amber-500/40 px-6 py-3 rounded-2xl shadow-2xl font-bold text-xs md:text-sm flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dedicated Standalone Ad Page Card */}
        <div className="bg-white text-stone-900 rounded-3xl p-6 md:p-10 space-y-8 border border-stone-200 shadow-2xl">
          
          {/* 1. عنوان الإعلان في الأعلى */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-xl">
                  {selectedListing.category}
                </span>
                {selectedListing.status === 'sold' ? (
                  <span className="px-3 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-xl">
                    🏷️ تم البيع ({getRemainingSoldHours(selectedListing.soldAt)}س متبقية)
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl">
                    🟢 معروض للبيع
                  </span>
                )}
                {selectedListing.views && (
                  <span className="px-3 py-1 bg-stone-100 text-stone-600 font-bold text-xs rounded-xl flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-stone-500" />
                    <span>{selectedListing.views} مشاهدة</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('تم نسخ رابط الإعلان المباشر إلى الحافظة 📋');
                  }}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5 text-amber-600" />
                  <span>مشاركة الإعلان</span>
                </button>
              </div>

              <h1 className="font-black text-2xl md:text-3xl text-stone-900 leading-tight">
                {selectedListing.title}
              </h1>
            </div>

            {selectedListing.price && (
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 px-6 py-3.5 rounded-2xl text-xl md:text-2xl font-black text-center shadow-lg border border-amber-300 shrink-0">
                {selectedListing.price} {selectedListing.currency === 'USD' ? '$' : 'ل.س'}
              </div>
            )}
          </div>

          {/* 2. بيانات المعلن تحته */}
          <div className="p-5 bg-stone-900 text-white rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-400 text-stone-950 rounded-2xl font-black">
                <User className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-stone-400 block font-bold">المعلن صاحب السلعة:</span>
                <span className="font-extrabold text-amber-300 text-base md:text-lg">{selectedListing.sellerName}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-stone-300">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-400" />
                <span>وقت النشر: {formatTimeAgo(selectedListing.createdAt)}</span>
              </span>
              {selectedListing.sellerLocation && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-rose-400" />
                  <span>الموقع: {selectedListing.sellerLocation}</span>
                </span>
              )}
            </div>
          </div>

          {/* 3. الوصف تحته */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-stone-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-800" />
              <span>وصف وتفاصيل السلعة:</span>
            </h3>
            <div className="text-sm md:text-base text-stone-700 leading-relaxed bg-stone-50 p-6 md:p-8 rounded-3xl border border-stone-200/90 whitespace-pre-line font-sans shadow-sm">
              {selectedListing.description}
            </div>

            {selectedListing.customFieldValues && Object.keys(selectedListing.customFieldValues).length > 0 && (
              <div className="p-6 bg-amber-50/60 rounded-3xl border border-amber-200 space-y-3">
                <span className="font-extrabold text-base text-amber-900 block">بيانات ومواصفات إضافية:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(selectedListing.customFieldValues).map(([k, v]) => (
                    <div key={k} className="p-3.5 bg-white rounded-2xl border border-amber-200 text-xs font-bold shadow-sm">
                      <span className="text-stone-500 block text-[11px] mb-0.5">{k}</span>
                      <span className="text-stone-900 text-sm">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. الصور */}
          {selectedListing.images && selectedListing.images.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-lg text-stone-900 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-emerald-800" />
                <span>صور السلعة المعروضة:</span>
              </h3>
              <div className="relative h-80 md:h-[500px] bg-stone-950 rounded-3xl overflow-hidden border border-stone-200 shadow-inner">
                <img
                  src={selectedListing.images[activeImageIndex] || selectedListing.images[0]}
                  alt={selectedListing.title}
                  className="w-full h-full object-contain"
                />
                
                {selectedListing.images.length > 1 && (
                  <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : selectedListing.images.length - 1))}
                      className="p-3 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md pointer-events-auto cursor-pointer shadow-lg"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev < selectedListing.images.length - 1 ? prev + 1 : 0))}
                      className="p-3 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md pointer-events-auto cursor-pointer shadow-lg"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnails Strip */}
              {selectedListing.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {selectedListing.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-20 w-28 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'border-amber-500 scale-105 shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. القسم الخاص بالتواصل مع المعلن */}
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-800 text-amber-300 rounded-2xl shadow">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-600 block">التواصل المباشر مع المعلن:</span>
                <p className="font-black text-emerald-950 text-lg md:text-xl dir-ltr">
                  {selectedListing.sellerPhone || 'غير محدد'}
                </p>
              </div>
            </div>

            {selectedListing.sellerPhone && (
              <div className="flex items-center gap-3 w-full md:w-auto">
                <a
                  href={`tel:${selectedListing.sellerPhone}`}
                  className="flex-1 md:flex-initial px-6 py-3.5 bg-emerald-800 text-white rounded-2xl text-xs font-black hover:bg-emerald-900 transition-all text-center shadow-md"
                >
                  📞 إتصال هاتف
                </a>
                <a
                  href={`https://wa.me/${selectedListing.sellerPhone.replace(/\+/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 md:flex-initial px-6 py-3.5 bg-emerald-600 text-white rounded-2xl text-xs font-black hover:bg-emerald-700 transition-all text-center shadow-md"
                >
                  💬 مكاتبة واتساب
                </a>
              </div>
            )}
          </div>

          {/* 6. قسم التعليقات */}
          <div className="space-y-4 pt-6 border-t border-stone-200">
            <h3 className="font-extrabold text-base md:text-lg text-stone-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-800" />
              <span>جميع تعليقات واستفسارات الأعضاء ({selectedListing.comments ? selectedListing.comments.length : 0}):</span>
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto pl-1">
              {(!selectedListing.comments || selectedListing.comments.length === 0) ? (
                <p className="text-xs text-stone-500 py-6 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                  لا توجد تعليقات بعد. كن أول من يستفسر أو يعلّق على هذه السلعة!
                </p>
              ) : (
                selectedListing.comments.map((cmt) => {
                  const isCmtAuthor = (loggedCitizen && loggedCitizen.email === cmt.authorEmail) || isAdmin;
                  return (
                    <div key={cmt.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-sm">
                          <User className="h-4 w-4 text-emerald-700" />
                          <span>{cmt.authorName}</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-stone-500 font-sans">{formatTimeAgo(cmt.createdAt)}</span>
                          {isCmtAuthor && (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(cmt.id)}
                              className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                            >
                              حذف
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-stone-700 leading-relaxed font-sans">{cmt.content}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Comment */}
            {loggedCitizen || isAdmin ? (
              <form onSubmit={handleAddComment} className="flex items-center gap-3 pt-3">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="اكتب استفسارك أو تعليقك حول السلعة..."
                  className="flex-1 p-3.5 bg-stone-50 border border-stone-300 focus:border-emerald-600 rounded-2xl text-xs md:text-sm outline-none font-sans"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold text-xs md:text-sm rounded-2xl shadow transition-all cursor-pointer shrink-0"
                >
                  نشر التعليق
                </button>
              </form>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between gap-3">
                <span>🔒 التعليق والاستفسار متاح حصرأ للأعضاء المسجلين في الموقع</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedListing(null);
                    onOpenCitizenAuth();
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-extrabold rounded-xl text-xs cursor-pointer shrink-0"
                >
                  تسجيل الدخول
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-amber-300 border border-amber-500/40 px-6 py-3 rounded-2xl shadow-2xl font-bold text-xs md:text-sm flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <PageHeader
        title={config.storeTitle || 'متجر قارة الإلكتروني'}
        description={config.storeSubtitle || 'منصة أهالي قارة لإعلانات البيع والشراء والتبادلات بين الأعضاء المسجلين'}
        badge="🛒 سوق قارة الموحد"
        homeContent={homeContent}
      />

      {/* Control Banner & Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Control Bar */}
        <div className="bg-white p-4 md:p-6 rounded-3xl border border-stone-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Member Status Badge */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className={`p-3 rounded-2xl ${loggedCitizen || isAdmin ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {loggedCitizen || isAdmin ? <CheckCircle2 className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-stone-900 text-sm md:text-base">
                  {loggedCitizen ? `مرحباً بك: ${loggedCitizen.fullName}` : (isAdmin ? 'مرحباً بالمدير' : 'إعلانات البيع والشراء')}
                </span>
                {loggedCitizen && (
                  <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">عضو مسجل 🟢</span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {loggedCitizen || isAdmin 
                  ? 'يمكنك الآن إضافة سلعك وتعديل إعلاناتك أو التفاعل مع السلع المعروضة' 
                  : 'لإضافة إعلان جديد يرجى تسجيل الدخول بحسابك في البوابة'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
            {!loggedCitizen && !isAdmin && (
              <button
                type="button"
                onClick={onOpenCitizenAuth}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-2xl transition-all flex items-center gap-2 cursor-pointer border border-stone-300"
              >
                <User className="h-4 w-4 text-emerald-700" />
                <span>تسجيل الدخول / حساب جديد</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-5 py-3 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-amber-300 font-extrabold text-xs md:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
            >
              <Plus className="h-5 w-5 text-amber-300" />
              <span>إضافة سلعة / إعلان جديد</span>
            </button>
          </div>
        </div>

        {/* Search & Filtering Bar */}
        <div className="bg-stone-900 text-white p-4 md:p-5 rounded-3xl border border-stone-800 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن سلعة، سيارة، منزل، طاقة شمسية، معلن..."
                className="w-full pl-4 pr-10 py-2.5 bg-stone-950 border border-stone-800 focus:border-emerald-600 rounded-2xl text-xs text-white placeholder-stone-500 outline-none transition-all"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  onClick={() => setSearchTerm('')} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-2xl border border-stone-800 text-xs w-full md:w-auto shrink-0 justify-center">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${statusFilter === 'all' ? 'bg-amber-400 text-stone-950 shadow' : 'text-stone-400 hover:text-white'}`}
              >
                الكل ({listings.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${statusFilter === 'active' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'}`}
              >
                🟢 معروض للبيع ({listings.filter(l => l.status === 'active').length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('sold')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${statusFilter === 'sold' ? 'bg-rose-600 text-white shadow' : 'text-stone-400 hover:text-white'}`}
              >
                🏷️ تم البيع ({listings.filter(l => l.status === 'sold').length})
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-2xl font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-extrabold'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <Tag className="h-4 w-4" />
              <span>كافة التبويبات</span>
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl font-bold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-stone-950 shadow-md font-extrabold'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid (Sorted by newest date & paginated 6 per page) */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 space-y-4">
            <ShoppingBag className="h-12 w-12 text-stone-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-800">لا توجد إعلانات معروضة في هذا التصنيف حالياً</h3>
              <p className="text-xs text-stone-500">تأكد من عبارة البحث أو كن أول من يضيف إعلاناً في متجر قارة</p>
            </div>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-emerald-800 text-amber-300 text-xs font-extrabold rounded-2xl shadow hover:bg-emerald-900 transition-all inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة إعلان جديد الآن</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedListings.map((item) => {
                const isOwner = (loggedCitizen && loggedCitizen.email === item.sellerEmail) || isAdmin;
                const isSold = item.status === 'sold';
                const remainingHours = isSold ? getRemainingSoldHours(item.soldAt) : 48;
                const latestComment = item.comments && item.comments.length > 0 
                  ? item.comments[item.comments.length - 1] 
                  : null;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4 }}
                    className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 shadow-md flex flex-col justify-between ${
                      isSold ? 'border-rose-300 bg-rose-50/20' : 'border-stone-200/90 hover:shadow-xl hover:border-emerald-300'
                    }`}
                  >
                    {/* Image Banner */}
                    <div 
                      className="relative h-56 bg-stone-950 cursor-pointer overflow-hidden group"
                      onClick={() => handleOpenDetail(item)}
                    >
                      <img
                        src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-3 right-3 flex flex-wrap items-center gap-1.5 z-10">
                        <span className="px-3 py-1 bg-stone-900/90 backdrop-blur-md text-amber-300 text-[11px] font-bold rounded-xl border border-amber-400/30">
                          {item.category}
                        </span>
                        {isSold ? (
                          <span className="px-3 py-1 bg-rose-600 text-white text-[11px] font-extrabold rounded-xl shadow animate-pulse">
                            🏷️ تم البيع ({remainingHours}س متبقية)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold rounded-xl">
                            🟢 معروض للبيع
                          </span>
                        )}
                      </div>

                      {/* Price Tag */}
                      {item.price && (
                        <div className="absolute bottom-3 right-3 bg-amber-400 text-stone-950 font-black text-xs md:text-sm px-3.5 py-1.5 rounded-2xl shadow-lg border border-amber-300">
                          {item.price} {item.currency === 'USD' ? '$' : 'ل.س'}
                        </div>
                      )}

                      {/* THUMBNAILS PREVIEW: Up to 3 images max */}
                      {item.images && item.images.length > 1 && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/20 z-10">
                          {item.images.slice(0, 3).map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt=""
                              className="h-8 w-10 object-cover rounded-lg border border-white/40"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Body Info */}
                    <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-3">
                        
                        {/* Title */}
                        <h3 
                          onClick={() => handleOpenDetail(item)}
                          className="font-extrabold text-base text-stone-900 hover:text-emerald-800 transition-colors cursor-pointer leading-snug line-clamp-2"
                        >
                          {item.title}
                        </h3>

                        {/* Header Sub-section: Seller & Date formatting */}
                        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-stone-700">
                            <div className="flex items-center gap-1.5 font-bold">
                              <User className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                              <span className="text-stone-900 font-extrabold">{item.sellerName}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-stone-500 font-sans">
                              <Clock className="h-3 w-3 text-amber-600" />
                              <span>{formatTimeAgo(item.createdAt)}</span>
                            </div>
                          </div>

                          {item.sellerLocation && (
                            <div className="flex items-center gap-1 text-[11px] text-stone-600">
                              <MapPin className="h-3 w-3 text-rose-600 shrink-0" />
                              <span>{item.sellerLocation}</span>
                            </div>
                          )}
                        </div>

                        {/* Description Excerpt */}
                        <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* SINGLE LATEST COMMENT PREVIEW (في بطاقة العرض يتم إظهار فقط آخر تعليق) */}
                      <div className="pt-3 border-t border-stone-100 space-y-3">
                        
                        {latestComment ? (
                          <div 
                            onClick={() => handleOpenDetail(item)}
                            className="p-3 bg-stone-50 hover:bg-emerald-50/50 rounded-2xl border border-stone-200/70 transition-all cursor-pointer space-y-1"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-extrabold text-emerald-950 flex items-center gap-1">
                                <MessageSquare className="h-3 w-3 text-emerald-700" />
                                <span>آخر تعليق: {latestComment.authorName}</span>
                              </span>
                              <span className="text-[10px] text-stone-400 font-sans">{formatTimeAgo(latestComment.createdAt)}</span>
                            </div>
                            <p className="text-xs text-stone-700 line-clamp-1 italic font-sans">
                              "{latestComment.content}"
                            </p>
                          </div>
                        ) : (
                          <div 
                            onClick={() => handleOpenDetail(item)}
                            className="p-2.5 bg-stone-50 text-stone-500 text-[11px] rounded-2xl text-center cursor-pointer hover:bg-stone-100"
                          >
                            لا توجد تعليقات بعد • انقر لإضافة استفسار
                          </div>
                        )}

                        {/* Comments count & Full view button */}
                        <div className="flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            className="flex items-center gap-1.5 text-stone-600 hover:text-emerald-800 font-bold transition-colors"
                          >
                            <MessageSquare className="h-4 w-4 text-emerald-600" />
                            <span>كافة التعليقات ({item.comments ? item.comments.length : 0})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            className="text-emerald-800 font-extrabold hover:underline flex items-center gap-1 text-xs"
                          >
                            <span>فتح الإعلان</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Owner / Admin Controls Bar */}
                        {isOwner && (
                          <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between gap-2 text-xs">
                            <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                              <span>صلاحيات التحكم</span>
                            </span>
                            <div className="flex items-center gap-1">
                              {!isSold && (
                                <button
                                  type="button"
                                  onClick={(e) => handleMarkAsSold(item, e)}
                                  title="تحديد كـ (تم البيع)"
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-[11px] transition-all"
                                >
                                  🏷️ تم البيع
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => handleOpenEdit(item, e)}
                                title="تعديل الإعلان"
                                className="p-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl transition-all"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteListing(item, e)}
                                title="حذف الإعلان"
                                className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl transition-all"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* PAGINATION CONTROLS (عرض 6 إعلانات لكل صفحة) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6 border-t border-stone-200">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 bg-white border border-stone-300 text-stone-800 rounded-2xl font-bold text-xs disabled:opacity-40 hover:bg-stone-50 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span>الصفحة السابقة</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`h-9 w-9 rounded-2xl font-extrabold text-xs transition-all cursor-pointer ${
                        currentPage === idx + 1
                          ? 'bg-emerald-800 text-amber-300 shadow-md scale-105'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-4 py-2 bg-white border border-stone-300 text-stone-800 rounded-2xl font-bold text-xs disabled:opacity-40 hover:bg-stone-50 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>الصفحة التالية</span>
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: ADD / EDIT LISTING FORM ("بطاقة إضافة وتعديل السلعة" حسب ألوان وتخصيصات المدير) */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${getAddFormThemeClasses()} rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl my-8 text-right`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-700/60 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-black/40 text-amber-400 rounded-2xl border border-white/20">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base md:text-lg text-white">
                    {editingListing ? 'تعديل بيانات سلعة معروضة' : (config.addFormTitle || 'بطاقة إضافة إعلان جديد في المتجر')}
                  </h3>
                  <p className="text-xs opacity-80">
                    {editingListing ? 'قم بتحديث عنوان، وصف، سعر، أو صور السلعة' : 'أدخل تفاصيل السلعة المراد عرضها للبيع لأعضاء الموقع'}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddEditOpen(false)} 
                className="text-stone-300 hover:text-white p-2 rounded-xl bg-black/40 border border-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Instructions */}
            {config.addFormInstructions && !editingListing && (
              <div className="p-3.5 bg-black/30 border border-white/15 rounded-2xl text-xs leading-relaxed">
                {config.addFormInstructions}
              </div>
            )}

            {formError && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-600 text-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Item Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold">
                  {config.fieldLabels?.title || 'اسم السلعة / عنوان الإعلان'}: *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="مثال: سيارة هيونداي أفانتي 2008 / أرض زراعية 10 دونم..."
                  className="w-full p-3 bg-black/40 border border-stone-700 focus:border-amber-400 rounded-2xl outline-none text-xs text-white font-bold"
                />
              </div>

              {/* Category, Price & Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold">
                    {config.fieldLabels?.category || 'قسم / تصنيف السلعة'}: *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-3 bg-stone-950 border border-stone-700 focus:border-amber-400 rounded-2xl outline-none text-xs text-white cursor-pointer font-bold"
                  >
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price & Currency option */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold">
                    {config.fieldLabels?.price || 'السعر المطلوب'}: {config.requiredFields?.price !== false ? '*' : '(اختياري)'}
                  </label>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="مثال: 45,000,000 أو قابل للتفاوض"
                      className="w-full p-3 bg-black/40 border border-stone-700 focus:border-amber-400 rounded-2xl outline-none text-xs text-amber-300 font-extrabold"
                    />

                    {/* Currency Selector if USD enabled in Admin */}
                    {config.enableUSD && (
                      <select
                        value={formCurrency}
                        onChange={(e) => setFormCurrency(e.target.value as any)}
                        className="p-3 bg-amber-400 text-stone-950 border border-amber-300 rounded-2xl text-xs font-black outline-none cursor-pointer shrink-0"
                      >
                        <option value="SYP">ل.س (ليرة)</option>
                        <option value="USD">$ (دولار)</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Seller Phone & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold">
                    {config.fieldLabels?.phone || 'رقم تواصل / واتساب'}: {config.requiredFields?.phone !== false ? '*' : '(اختياري)'}
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="مثال: 0988123456"
                    className="w-full p-3 bg-black/40 border border-stone-700 focus:border-amber-400 rounded-2xl outline-none text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold">
                    {config.fieldLabels?.location || 'الحي / المنطقة في قارة'}: {config.requiredFields?.location ? '*' : '(اختياري)'}
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="مثال: قارة - الحارة الفوقا / طريق الدير"
                    className="w-full p-3 bg-black/40 border border-stone-700 focus:border-amber-400 rounded-2xl outline-none text-xs text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold">
                  {config.fieldLabels?.description || 'تفاصيل ووصف السلعة'}: {config.requiredFields?.description !== false ? '*' : '(اختياري)'}
                </label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="اكتب مواصفات وحالة السلعة، مدة الاستخدام، أسباب البيع، والجاهزية..."
                  className="w-full p-3 bg-black/40 border border-stone-700 focus:border-amber-400 rounded-2xl outline-none text-xs text-white leading-relaxed"
                />
              </div>

              {/* Dynamic Custom Fields */}
              {config.customFields && config.customFields.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-stone-700/60">
                  <span className="text-xs font-extrabold text-amber-300 block">معلومات وحقول إضافية مخصصة:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {config.customFields.map((cf) => (
                      <div key={cf.id} className="space-y-1">
                        <label className="block text-xs font-bold text-stone-200">
                          {cf.label} {cf.required ? '*' : ''}
                        </label>
                        {cf.type === 'select' ? (
                          <select
                            value={formCustomValues[cf.id] || ''}
                            onChange={(e) => setFormCustomValues({ ...formCustomValues, [cf.id]: e.target.value })}
                            className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white"
                          >
                            <option value="">-- اختر --</option>
                            {(cf.options || []).map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={cf.type === 'number' ? 'number' : 'text'}
                            value={formCustomValues[cf.id] || ''}
                            onChange={(e) => setFormCustomValues({ ...formCustomValues, [cf.id]: e.target.value })}
                            className="w-full p-2.5 bg-black/40 border border-stone-700 rounded-xl text-xs text-white"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Images Manager (UP TO 3 IMAGES MAX) */}
              <div className="space-y-2 pt-2 border-t border-stone-700/60">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-200">
                    📸 {config.fieldLabels?.images || 'صور السلعة (بحد أقصى 3 صور)'}:
                  </label>
                  <span className="text-[11px] text-amber-300 font-bold">
                    ({formImages.length} من 3 صور كحد أقصى)
                  </span>
                </div>
                
                {formImages.length < 3 ? (
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    
                    {/* Local File Upload */}
                    <label className="w-full md:w-auto px-4 py-2.5 bg-black/60 hover:bg-black/80 text-amber-300 border border-amber-400/40 rounded-2xl text-xs font-bold cursor-pointer flex items-center justify-center gap-2 transition-all">
                      <Upload className="h-4 w-4" />
                      <span>رفع صورة من جهازك</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* URL Input */}
                    <div className="flex items-center gap-2 w-full flex-1">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="أو ضع رابط صورة..."
                        className="w-full p-2.5 bg-black/40 border border-stone-700 rounded-2xl text-xs text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-2xl text-xs font-bold shrink-0"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-amber-300 bg-black/40 p-2.5 rounded-xl border border-amber-400/30">
                    ✓ وصلت للحد الأقصى (3 صور). قم بحذف إحدى الصور إن أردت استبدالها.
                  </p>
                )}

                {/* Images Preview List */}
                {formImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    {formImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-2xl overflow-hidden border border-stone-700 h-24 bg-stone-950">
                        <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImageFromForm(idx)}
                          className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-700/60">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="px-4 py-2.5 bg-black/40 hover:bg-black/60 text-stone-300 font-bold text-xs rounded-2xl transition-all border border-white/10"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-amber-300"
                >
                  <Check className="h-4 w-4" />
                  <span>{editingListing ? 'حفظ التعديلات' : 'نشر الإعلان في المتجر'}</span>
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 2: IN-PAGE HIGH Z-INDEX MODAL (z-[99999] layer in front of header and whole site) */}
      {selectedListing && !isStandaloneView && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/85 backdrop-blur-md overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white text-stone-900 rounded-3xl max-w-4xl w-full h-[95vh] max-h-[96vh] flex flex-col border border-stone-200 shadow-2xl relative text-right overflow-hidden my-auto"
          >
            {/* STICKY HEADER WITH TITLE AND RED CLOSE BUTTON */}
            <div className="p-4 md:p-6 border-b border-stone-200 bg-white flex items-center justify-between shrink-0 z-10 shadow-sm">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-xl">
                    {selectedListing.category}
                  </span>
                  {selectedListing.status === 'sold' ? (
                    <span className="px-3 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-xl">
                      🏷️ تم البيع ({getRemainingSoldHours(selectedListing.soldAt)}س متبقية)
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl">
                      🟢 معروض للبيع
                    </span>
                  )}
                  {selectedListing.views && (
                    <span className="px-3 py-1 bg-stone-100 text-stone-600 font-bold text-xs rounded-xl flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-stone-500" />
                      <span>{selectedListing.views} مشاهدة</span>
                    </span>
                  )}
                </div>
                <h2 className="font-extrabold text-lg md:text-2xl text-stone-900 mt-1 line-clamp-1">
                  {selectedListing.title}
                </h2>
              </div>

              {/* PROMINENT CLOSE BUTTON */}
              <button
                type="button"
                onClick={handleCloseDetailView}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs md:text-sm rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <X className="h-4 w-4" />
                <span>إغلاق الإعلان ✕</span>
              </button>
            </div>

            {/* SCROLLABLE CONTENT BODY (Expanded Height & Spacious Padding) */}
            <div className="p-5 md:p-8 space-y-6 overflow-y-auto flex-1 font-sans">
              
              {/* Formatted Header Info: Time & Seller */}
              <div className="p-4 md:p-5 bg-stone-900 text-white rounded-3xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm md:text-base">
                    <User className="h-5 w-5 text-amber-400" />
                    <span>المعلن صاحب السلعة: {selectedListing.sellerName}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-stone-300">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-amber-400" />
                      <span>وقت النشر: {formatTimeAgo(selectedListing.createdAt)}</span>
                    </span>
                    {selectedListing.sellerLocation && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-rose-400" />
                        <span>{selectedListing.sellerLocation}</span>
                      </span>
                    )}
                  </div>
                </div>

                {selectedListing.price && (
                  <div className="bg-amber-400 text-stone-950 px-5 py-2.5 rounded-2xl text-lg md:text-xl font-black text-center shadow shrink-0">
                    {selectedListing.price} {selectedListing.currency === 'USD' ? '$' : 'ل.س'}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-700" />
                  <span>وصف وتفاصيل السلعة:</span>
                </h4>
                <p className="text-xs md:text-sm text-stone-700 leading-relaxed bg-stone-50 p-5 md:p-6 rounded-2xl border border-stone-200/90 whitespace-pre-line font-sans shadow-sm">
                  {selectedListing.description}
                </p>
              </div>

              {/* Custom Dynamic Fields */}
              {selectedListing.customFieldValues && Object.keys(selectedListing.customFieldValues).length > 0 && (
                <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3 text-xs">
                  <span className="font-extrabold text-amber-900 text-sm block">بيانات ومواصفات إضافية:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(selectedListing.customFieldValues).map(([k, v]) => (
                      <div key={k} className="p-3 bg-white rounded-xl border border-amber-200 font-bold shadow-sm">
                        <span className="text-stone-500 text-[11px] block">{k}: </span>
                        <span className="text-stone-900 text-sm">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Viewer (Taller height: h-80 md:h-[420px]) */}
              {selectedListing.images && selectedListing.images.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-emerald-700" />
                    <span>صور السلعة المعروضة:</span>
                  </h4>
                  <div className="relative h-80 md:h-[420px] bg-stone-950 rounded-3xl overflow-hidden border border-stone-200 shadow-inner">
                    <img
                      src={selectedListing.images[activeImageIndex] || selectedListing.images[0]}
                      alt={selectedListing.title}
                      className="w-full h-full object-contain"
                    />

                    {selectedListing.images.length > 1 && (
                      <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <button
                          type="button"
                          onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : selectedListing.images.length - 1))}
                          className="p-3 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md pointer-events-auto cursor-pointer shadow-md"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveImageIndex((prev) => (prev < selectedListing.images.length - 1 ? prev + 1 : 0))}
                          className="p-3 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md pointer-events-auto cursor-pointer shadow-md"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnails */}
                  {selectedListing.images.length > 1 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                      {selectedListing.images.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveImageIndex(i)}
                          className={`relative h-20 w-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                            activeImageIndex === i ? 'border-emerald-600 scale-105 shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contact Phone & Actions Bar */}
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 bg-emerald-800 text-amber-300 rounded-2xl shadow">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-600 block">التواصل المباشر مع المعلن:</span>
                    <p className="font-black text-emerald-950 text-base md:text-lg dir-ltr">
                      {selectedListing.sellerPhone || 'غير محدد'}
                    </p>
                  </div>
                </div>

                {selectedListing.sellerPhone && (
                  <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <a
                      href={`tel:${selectedListing.sellerPhone}`}
                      className="flex-1 md:flex-initial px-5 py-3 bg-emerald-800 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-emerald-900 transition-all text-center shadow"
                    >
                      📞 إتصال هاتف
                    </a>
                    <a
                      href={`https://wa.me/${selectedListing.sellerPhone.replace(/\+/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 md:flex-initial px-5 py-3 bg-emerald-600 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-emerald-700 transition-all text-center shadow"
                    >
                      💬 واتساب
                    </a>
                  </div>
                )}
              </div>

              {/* COMMENTS SECTION */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <h4 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-800" />
                  <span>جميع تعليقات واستفسارات الأعضاء ({selectedListing.comments ? selectedListing.comments.length : 0}):</span>
                </h4>

                {/* Comments List */}
                <div className="space-y-3 max-h-72 overflow-y-auto pl-1">
                  {(!selectedListing.comments || selectedListing.comments.length === 0) ? (
                    <p className="text-xs text-stone-500 py-4 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                      لا توجد تعليقات بعد. كن أول من يستفسر أو يعلّق على هذه السلعة!
                    </p>
                  ) : (
                    selectedListing.comments.map((cmt) => {
                      const isCmtAuthor = (loggedCitizen && loggedCitizen.email === cmt.authorEmail) || isAdmin;
                      return (
                        <div key={cmt.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-sm">
                              <User className="h-4 w-4 text-emerald-700" />
                              <span>{cmt.authorName}</span>
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-stone-500 font-sans">{formatTimeAgo(cmt.createdAt)}</span>
                              {isCmtAuthor && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(cmt.id)}
                                  className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                                >
                                  حذف
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs md:text-sm text-stone-700 leading-relaxed font-sans">{cmt.content}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Add Comment Box */}
                {loggedCitizen || isAdmin ? (
                  <form onSubmit={handleAddComment} className="flex items-center gap-3 pt-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="اكتب استفسارك أو تعليقك حول السلعة..."
                      className="flex-1 p-3.5 bg-stone-50 border border-stone-300 focus:border-emerald-600 rounded-2xl text-xs md:text-sm outline-none font-sans"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold text-xs md:text-sm rounded-2xl shadow transition-all cursor-pointer shrink-0"
                    >
                      نشر التعليق
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between gap-3">
                    <span>🔒 التعليق والاستفسار متاح حصرأ للأعضاء المسجلين في الموقع</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedListing(null);
                        onOpenCitizenAuth();
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-extrabold rounded-xl text-xs cursor-pointer shrink-0"
                    >
                      تسجيل الدخول
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* STICKY BOTTOM FOOTER */}
            <div className="p-4 md:p-5 border-t border-stone-200 bg-stone-50 flex justify-end shrink-0 z-10">
              <button
                type="button"
                onClick={handleCloseDetailView}
                className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs md:text-sm rounded-2xl shadow transition-all flex items-center gap-2 cursor-pointer"
              >
                <X className="h-4 w-4 text-rose-400" />
                <span>إغلاق والعودة لجميع معروضات المتجر ✕</span>
              </button>
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
}
