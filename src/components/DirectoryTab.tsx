import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Pin, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  X, 
  Check, 
  CheckCircle, 
  Building2, 
  Sparkles,
  ExternalLink,
  Store,
  Compass
} from 'lucide-react';
import { BusinessActivity, HomeContent } from '../types';
import PageHeader from './PageHeader';

interface DirectoryTabProps {
  activities: BusinessActivity[];
  setActivities: React.Dispatch<React.SetStateAction<BusinessActivity[]>>;
  homeContent: HomeContent;
}

export default function DirectoryTab({
  activities,
  setActivities,
  homeContent,
}: DirectoryTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Form states for user submissions
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [bizName, setBizName] = useState("");
  const [bizCategory, setBizCategory] = useState("تجاري");
  const [customBizCategory, setCustomBizCategory] = useState("");
  const [bizActivity, setBizActivity] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [bizWhatsapp, setBizWhatsapp] = useState("");
  const [bizEmail, setBizEmail] = useState("");
  const [bizAddress, setBizAddress] = useState("");
  const [bizUrl, setBizUrl] = useState("");
  const [customFile, setCustomFile] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter and sort activities
  const approvedActivities = activities.filter(act => !act.status || act.status === 'approved');

  // Dynamic category list from homeContent or defaults
  const defaultCategories = ["تجاري", "خدمي", "صحي", "تراثي", "تعليمي", "زراعي", "صناعي", "مهن وحرف"];
  const savedCategories = (homeContent?.directoryCategories && homeContent.directoryCategories.length > 0)
    ? homeContent.directoryCategories
    : defaultCategories;

  // Available categories derived from saved categories + any existing activity categories
  const availableCategories = Array.from(
    new Set([
      ...savedCategories,
      ...approvedActivities.map(a => a.category).filter(Boolean) as string[]
    ])
  );

  // Multi-criteria filter: search query + category
  const filteredActivities = approvedActivities.filter(act => {
    const actName = act.name || "";
    const actActivity = act.activity || act.description || "";
    const actAddress = act.address || "";
    const actCategory = act.category || "";
    
    const matchesSearch = 
      actName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actActivity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actCategory.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === "all") return matchesSearch;
    if (selectedCategory === "pinned") return matchesSearch && act.isPinned;
    if (selectedCategory === "commercial") {
      const isCommercialCategory = actCategory === "تجاري";
      const matchesText = actActivity.includes("بيع") || actActivity.includes("تجاري") || actActivity.includes("محل") || actActivity.includes("منتجات") || actName.includes("محل") || actName.includes("معرض");
      return matchesSearch && (isCommercialCategory || matchesText);
    }
    if (selectedCategory === "services") {
      const isServicesCategory = actCategory === "خدمي" || actCategory === "صحي" || actCategory === "تراثي" || actCategory === "أخرى";
      const matchesText = actActivity.includes("خدمة") || actActivity.includes("صيانة") || actActivity.includes("تسهيل") || actActivity.includes("صيدلية") || actActivity.includes("مكتبة") || actActivity.includes("مطعم") || actActivity.includes("مخبز") || actActivity.includes("عصر") || actActivity.includes("نجارة") || actActivity.includes("إنتاج") || actActivity.includes("تعبئة") || actName.includes("مركز") || actName.includes("صيدلية") || actName.includes("مخبز");
      return matchesSearch && (isServicesCategory || matchesText);
    }

    // Match exact category
    return matchesSearch && (actCategory === selectedCategory);
  });

  // Sort: Pinned items go first! Then newest first
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Pagination rules: 9 items per page
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(sortedActivities.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedActivities = sortedActivities.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const maxKB = homeContent.maxUploadSizeKB || 5000;
      if (file.size > maxKB * 1024) {
        setUploadError(`حجم الصورة كبير جداً! الحد الأقصى المسموح به هو ${maxKB} كيلوبايت`);
        return;
      }
      setUploadError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomFile(reader.result as string);
        setBizUrl("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxKB = homeContent.maxUploadSizeKB || 5000;
      if (file.size > maxKB * 1024) {
        setUploadError(`حجم الصورة كبير جداً! الحد الأقصى المسموح به هو ${maxKB} كيلوبايت`);
        return;
      }
      setUploadError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomFile(reader.result as string);
        setBizUrl("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName.trim() || !bizActivity.trim() || !bizPhone.trim() || !bizWhatsapp.trim()) return;

    let finalCategory = bizCategory;
    if (bizCategory === '__new__' && customBizCategory.trim()) {
      finalCategory = customBizCategory.trim();
    }

    const finalImage = customFile || bizUrl.trim() || "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=800&q=80";

    const newActivity: BusinessActivity = {
      id: "biz-user-" + Date.now(),
      name: bizName,
      category: finalCategory,
      activity: bizActivity,
      phone: bizPhone,
      whatsapp: bizWhatsapp,
      email: bizEmail.trim() || undefined,
      address: bizAddress.trim() || undefined,
      image: finalImage,
      isPinned: false, // User submitted activities cannot be pinned by default, only admin can pin!
      status: "pending", // Pending admin review
      cardColor: "bg-white",
      cardStyle: "modern",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setActivities(prev => [newActivity, ...prev]);
    setSubmitSuccess(true);

    setTimeout(() => {
      setBizName("");
      setBizCategory(availableCategories[0] || "تجاري");
      setCustomBizCategory("");
      setBizActivity("");
      setBizPhone("");
      setBizWhatsapp("");
      setBizEmail("");
      setBizAddress("");
      setBizUrl("");
      setCustomFile("");
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
    }, 2500);
  };

  // Get style classes for custom card styles
  const getCardStyleClasses = (activity: BusinessActivity) => {
    const baseColor = activity.cardColor || "bg-white";
    const textTheme = activity.textColor || "text-slate-900";

    switch (activity.cardStyle) {
      case 'heritage':
        return {
          card: `${baseColor} ${textTheme} border-2 border-amber-900/20 rounded-3xl overflow-hidden shadow-md relative group transition-all duration-300 hover:shadow-xl hover:border-amber-900/40 p-1`,
          inner: "border border-amber-900/10 rounded-2xl h-full flex flex-col justify-between overflow-hidden",
          badge: "bg-amber-800 text-amber-50 border border-amber-900/20",
          accentColor: "#78350f"
        };
      case 'classic':
        return {
          card: `${baseColor} ${textTheme} border-double border-4 border-gray-400 rounded-2xl overflow-hidden shadow-lg relative transition-all duration-300 hover:shadow-2xl p-0.5`,
          inner: "bg-transparent h-full flex flex-col justify-between overflow-hidden",
          badge: "bg-stone-800 text-stone-100",
          accentColor: "#292524"
        };
      case 'simple':
        return {
          card: `${baseColor} ${textTheme} border border-gray-200 rounded-xl overflow-hidden shadow-sm relative transition-all duration-300 hover:shadow-md hover:border-gray-300`,
          inner: "h-full flex flex-col justify-between p-0",
          badge: "bg-gray-800 text-white",
          accentColor: "#1f2937"
        };
      case 'modern':
      default:
        return {
          card: `${baseColor} ${textTheme} rounded-3xl border border-gray-100 shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1`,
          inner: "h-full flex flex-col justify-between",
          badge: "bg-sky-900 text-sky-50",
          accentColor: "#0c4a6e"
        };
    }
  };

  // Preset quick illustrations if user has no image
  const PRESET_ILLUSTRATIONS = [
    { title: "دكان بقالة عامة", url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" },
    { title: "سوق ومتاجر تراثية", url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80" },
    { title: "ورشة عمل وصناعة", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans" dir="rtl">
      {/* Page Header */}
      <PageHeader 
        badge="دليل الأنشطة والمهن"
        title={homeContent?.directoryPageName || "الدليل التجاري والخدمي لبلدة قارة"} 
        description="دليلكم الشامل للمتاجر، الورش الحرفية، الخدمات الطبية والمؤسسات التجارية في مدينة قارة وضواحيها بالقلمون"
        homeContent={homeContent}
      />

      {/* Top Banner and Quick actions */}
      <div className="mb-8 p-6 bg-gradient-to-l from-sky-900 to-sky-800 text-white rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-xl translate-y-12 -translate-x-12"></div>
        
        <div className="relative text-right max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-sky-100">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>الدعم التنموي والاقتصادي المحلي</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">ابحث عن الفعاليات المحلية أو أضف مشروعك الخاص!</h2>
          <p className="text-sky-100/90 text-xs sm:text-sm leading-relaxed">
            يهدف الدليل التجاري والخدمي إلى ربط أهالي البلدة والمغتربين والزائرين بكافة الحرف والخدمات والمحلات داخل بلدة قارة، تعزيزاً للتكافل والتنمية المشتركة.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="relative z-10 shrink-0 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="h-4 sm:h-5 w-4 sm:w-5" />
          <span>تسجيل فعالية تجارية/خدمية جديدة</span>
        </button>
      </div>

      {/* Search & Categories Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-sky-100 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch">
          {/* Search box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to first page on search
              }}
              placeholder="ابحث عن اسم المحل، نوع النشاط، الشارع أو الفعالية..."
              className="w-full pr-11 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-sky-600 focus:bg-white text-xs sm:text-sm text-right transition-all font-sans"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {/* Dynamic Categories Dropdown Selector */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-9 py-3 bg-sky-50/80 hover:bg-sky-50 border border-sky-200 rounded-2xl outline-none focus:border-sky-700 focus:ring-2 focus:ring-sky-500/20 font-extrabold text-xs sm:text-sm text-right cursor-pointer shadow-2xs transition-all text-sky-950 appearance-none"
              >
                <option value="all">📁 جميع تصنيفات الأنشطة</option>
                <option value="pinned">⭐ الفعاليات المتميزة والمثبتة</option>
                <option value="commercial">🛒 تجاري (محلات ومتاجر)</option>
                <option value="services">🛠️ خدمي (خدمات وصيانة)</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>
                    🏷️ تصنيف: {cat}
                  </option>
                ))}
              </select>
              <Store className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-800 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Categories Pills Quick Browse Bar (Informational view of counts per category) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-gray-100">
          <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap pl-1 shrink-0">
            تصفح سريع:
          </span>
          <span className="px-3 py-1 text-xs font-bold rounded-xl bg-gray-100 text-gray-700 shrink-0 whitespace-nowrap">
            إجمالي الأنشطة ({approvedActivities.length})
          </span>
          <span className="px-3 py-1 text-xs font-bold rounded-xl bg-amber-50 text-amber-900 border border-amber-200/60 shrink-0 whitespace-nowrap">
            ⭐ المتميزة ({approvedActivities.filter(a => a.isPinned).length})
          </span>
          {availableCategories.map(cat => {
            const count = approvedActivities.filter(a => a.category === cat).length;
            return (
              <span
                key={cat}
                className="px-3 py-1 text-xs font-bold rounded-xl bg-sky-50/80 text-sky-900 border border-sky-100 shrink-0 whitespace-nowrap"
              >
                {cat} ({count})
              </span>
            );
          })}
        </div>

        {/* Total Activities Count & Filter State Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-600 font-bold px-1 pt-1 border-t border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-xl font-extrabold flex items-center gap-2 shadow-2xs">
              <Store className="h-4 w-4 text-emerald-700" />
              <span>عدد الأنشطة المضافة:</span>
              <strong className="text-emerald-950 font-black text-sm">{approvedActivities.length}</strong>
            </span>
            {(searchTerm || selectedCategory !== "all") && (
              <span className="text-gray-500 font-medium bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                (الأنشطة المعروضة حسب الفلترة والبحث الحالي: <strong className="text-sky-900 font-extrabold">{sortedActivities.length}</strong>)
              </span>
            )}
          </div>

          {(searchTerm || selectedCategory !== "all") && (
            <button 
              onClick={() => { setSearchTerm(""); setSelectedCategory("all"); setCurrentPage(1); }}
              className="text-amber-800 hover:underline cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <span>إعادة تعيين الفلتر والبحث</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Cards */}
      {paginatedActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedActivities.map((act) => {
            const styling = getCardStyleClasses(act);
            return (
              <div 
                key={act.id} 
                className={styling.card}
              >
                <div className={act.cardStyle === 'heritage' || act.cardStyle === 'classic' ? styling.inner : ""}>
                  {/* Card Header / Image container */}
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <img 
                      src={act.image} 
                      alt={act.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Pin Badge & Status */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {act.isPinned && (
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-stone-950 font-black text-[10px] rounded-full shadow-md animate-pulse">
                          <Pin className="h-3 w-3" />
                          <span>مثبّت ومميّز</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 left-3 text-right">
                      <span className="inline-block px-2.5 py-0.5 bg-sky-900/90 text-white font-extrabold text-[10px] rounded-lg mb-1.5 shadow border border-sky-800">
                        {act.category || (((act.activity || "").includes("خدمة") || (act.activity || "").includes("صيانة") || (act.activity || "").includes("تصميم")) ? "خدمي" : "تجاري")}
                      </span>
                      <h3 className="text-white text-sm sm:text-base font-black leading-tight drop-shadow-md">
                        {act.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-right">
                    <p className="text-xs text-gray-600 leading-relaxed font-sans">
                      {act.activity || ""}
                    </p>

                    {/* Contact Details and Info */}
                    <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-700">
                      {act.address && (
                        <div className="flex items-start gap-1.5 justify-start">
                          <MapPin className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                          <span className="font-sans leading-tight">{act.address}</span>
                        </div>
                      )}
                      
                      {act.email && (
                        <div className="flex items-center gap-1.5 justify-start">
                          <Mail className="h-4 w-4 text-sky-700 shrink-0" />
                          <a href={`mailto:${act.email}`} className="hover:underline text-gray-600 font-mono">{act.email}</a>
                        </div>
                      )}
                    </div>

                    {/* Call to Actions Buttons */}
                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <a 
                        href={`tel:${act.phone}`}
                        className="py-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>اتصال مباشر</span>
                      </a>
                      <a 
                        href={`https://wa.me/${act.whatsapp.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>واتساب</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 bg-gray-50 border border-gray-100 rounded-3xl text-center space-y-3">
          <Store className="h-12 w-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-600 text-sm">عذراً، لم نجد أي فعاليات مطابقة للبحث أو التصنيف المحدد</h3>
          <p className="text-gray-400 text-xs">جرب كتابة عبارة أخرى أو تصفح الأقسام الأخرى المتاحة.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-4">
          <button
            onClick={() => {
              setCurrentPage(p => Math.max(1, p - 1));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <span className="text-xs sm:text-sm font-bold text-gray-700">
            الصفحة {currentPage} من أصل {totalPages}
          </span>

          <button
            onClick={() => {
              setCurrentPage(p => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* SUBMIT MODAL */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 text-right font-sans"
              dir="rtl"
            >
              <div className="p-5 bg-sky-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-amber-400" />
                  <h3 className="font-bold text-sm sm:text-base">🏢 تسجيل وإضافة فعالية تجارية أو خدمية جديدة</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-sky-950 text-sky-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-12 text-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-lg font-black text-emerald-950">تم إرسال الفعالية بنجاح للتدقيق!</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                    شكراً لك لمساهمتك في إثراء دليل قارة المحلي. ستظهر بطاقتك التجارية/الخدمية للجمهور فور مراجعتها واعتمادها من قبل إدارة الموقع ومجلس المدينة.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitActivity} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                  
                  <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-2xl flex items-start gap-2">
                    <Compass className="h-4 w-4 shrink-0 mt-0.5 text-amber-700" />
                    <p className="leading-relaxed">
                      <strong>ملاحظة للمستخدم الكريم:</strong> إضافة الفعاليات متاح مجاناً لجميع أصحاب الحرف والمتاجر في بلدة قارة. ستتم مراجعة الطلب من قبل إدارة الموقع لضمان صحة الأرقام والبيانات قبل النشر.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">اسم الفعالية أو المتجر أو الحرفي *</label>
                      <input
                        type="text"
                        required
                        value={bizName}
                        onChange={(e) => setBizName(e.target.value)}
                        placeholder="مثال: ورشة الفتح لنجارة الخشب"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">تصنيف النشاط والمهنة *</label>
                      <select
                        value={bizCategory}
                        onChange={(e) => {
                          setBizCategory(e.target.value);
                          if (e.target.value !== '__new__') {
                            setCustomBizCategory("");
                          }
                        }}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right font-bold text-sky-950 cursor-pointer"
                      >
                        {availableCategories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        <option value="__new__">➕ إضافة تصنيف جديد...</option>
                      </select>

                      {bizCategory === '__new__' && (
                        <input
                          type="text"
                          required
                          value={customBizCategory}
                          onChange={(e) => setCustomBizCategory(e.target.value)}
                          placeholder="اكتب اسم التصنيف الجديد هنا..."
                          className="w-full mt-1 p-2 bg-amber-50 border border-amber-300 focus:bg-white rounded-xl outline-none text-xs text-right font-bold"
                        />
                      )}
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-gray-700 block">نشاط الفعالية بالتفصيل والمنتجات الموفرة *</label>
                      <input
                        type="text"
                        required
                        value={bizActivity}
                        onChange={(e) => setBizActivity(e.target.value)}
                        placeholder="مثال: تصنيع وبيع الأبواب والشبابيك الخشبية، صيانة غرف النوم"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">رقم هاتف الاتصال المباشر *</label>
                      <input
                        type="text"
                        required
                        value={bizPhone}
                        onChange={(e) => setBizPhone(e.target.value)}
                        placeholder="مثال: +963-933-111222"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right font-mono"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">رقم الواتساب للتواصل الذكي *</label>
                      <input
                        type="text"
                        required
                        value={bizWhatsapp}
                        onChange={(e) => setBizWhatsapp(e.target.value)}
                        placeholder="مثال: 963933111222"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right font-mono"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">البريد الإلكتروني للفعالية (اختياري)</label>
                      <input
                        type="email"
                        value={bizEmail}
                        onChange={(e) => setBizEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right font-mono"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">العنوان أو موقع المتجر التفصيلي بقارة (اختياري)</label>
                      <input
                        type="text"
                        value={bizAddress}
                        onChange={(e) => setBizAddress(e.target.value)}
                        placeholder="مثال: ساحة البلدة العامة، بجانب صيدلية الهدى"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                      />
                    </div>
                  </div>

                  {/* Image input & Drag Drop */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-700 block">صورة توضيحية للمحل أو الشعار (كمبيوتر أو ويب)</label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Web Link Option */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold block">رابط مباشر للصورة من الويب:</span>
                        <input
                          type="text"
                          value={bizUrl}
                          onChange={(e) => {
                            setBizUrl(e.target.value);
                            setCustomFile("");
                          }}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                        />
                      </div>

                      {/* Presets/illustrations helper for quick select */}
                      <div className="space-y-1 text-right">
                        <span className="text-[10px] text-gray-500 font-bold block">أو اختر إحدى الصور السريعة المقترحة:</span>
                        <div className="flex gap-1.5 justify-start">
                          {PRESET_ILLUSTRATIONS.map((ill, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setBizUrl(ill.url);
                                setCustomFile("");
                              }}
                              className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                                bizUrl === ill.url 
                                  ? 'bg-amber-100 text-amber-950 border-amber-400' 
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600'
                              }`}
                            >
                              {ill.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Drag and Drop Container */}
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`mt-2 border-2 border-dashed rounded-3xl p-6 text-center transition-colors cursor-pointer ${
                        isDragActive 
                          ? "border-amber-500 bg-amber-50/50" 
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100/50"
                      }`}
                    >
                      <input 
                        type="file" 
                        id="bizImageFile"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="bizImageFile" className="cursor-pointer block space-y-2">
                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto text-sky-700">
                          <Upload className="h-5 w-5" />
                        </div>
                        <div className="text-xs text-gray-600 font-bold">
                          <span>اسحب صورة وافلتها هنا أو </span>
                          <span className="text-sky-700 hover:underline">تصفح ملفات الكمبيوتر</span>
                        </div>
                        <p className="text-[9px] text-gray-400">تدعم ملفات JPG، PNG، WEBP حتى 5 ميغابايت</p>
                      </label>
                    </div>

                    {uploadError && (
                      <p className="text-[11px] font-bold text-rose-700 text-center">{uploadError}</p>
                    )}

                    {/* Upload Preview */}
                    {(customFile || bizUrl) && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
                        <div className="flex items-center gap-3">
                          <img 
                            src={customFile || bizUrl} 
                            alt="Preview" 
                            className="h-14 w-20 object-cover rounded-xl border shadow-sm" 
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[11px] text-gray-600 font-bold">معاينة الصورة المرفقة</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomFile("");
                            setBizUrl("");
                          }}
                          className="p-1 text-gray-400 hover:text-rose-600 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex gap-2 flex-row-reverse border-t border-gray-100">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-colors cursor-pointer"
                    >
                      إرسال الفعالية للمراجعة والنشر
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
                    >
                      إلغاء الطلب
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
