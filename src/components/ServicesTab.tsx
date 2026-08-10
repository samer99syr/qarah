import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_SERVICES } from '../data/qaraData';
import { Service, ServiceRequest, HomeContent } from '../types';
import PageHeader from './PageHeader';
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  FileCheck, 
  HelpCircle, 
  PlusCircle, 
  User, 
  Phone, 
  Send, 
  X,
  Sparkles,
  ClipboardList,
  AlertCircle,
  Building,
  HeartPulse,
  Sprout,
  GraduationCap,
  Trash2
} from 'lucide-react';

interface ServicesTabProps {
  services: Service[];
  myRequests: ServiceRequest[];
  setMyRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
  homeContent: HomeContent;
}

// Syrian Flag Helper Component
const SyrianFlag = ({ flagUrl, className = "h-12 w-18" }: { flagUrl?: string; className?: string }) => {
  if (flagUrl) {
    return (
      <img 
        src={flagUrl} 
        alt="علم الجمهورية العربية السورية" 
        className={`${className} object-cover rounded-md shadow border border-amber-900/10`} 
      />
    );
  }

  return (
    <div className={`${className} rounded-md shadow overflow-hidden border border-amber-900/10 shrink-0 relative bg-white flex flex-col`}>
      <div className="h-1/3 w-full bg-[#007A3D]" />
      <div className="h-1/3 w-full bg-white flex items-center justify-center gap-1.5 px-1">
        <span className="text-[10px] sm:text-xs text-[#C8102E] font-black leading-none">★</span>
        <span className="text-[10px] sm:text-xs text-[#C8102E] font-black leading-none">★</span>
        <span className="text-[10px] sm:text-xs text-[#C8102E] font-black leading-none">★</span>
      </div>
      <div className="h-1/3 w-full bg-black" />
    </div>
  );
};

export default function ServicesTab({ services, myRequests, setMyRequests, homeContent }: ServicesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Form State
  const [applicantName, setApplicantName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const getDisabledTitles = () => {
    const mode = homeContent?.servicesDisabledMode || 'coming_soon';
    let titleAr = homeContent?.servicesDisabledTitleAr || '';
    let titleEn = homeContent?.servicesDisabledTitleEn || '';

    if (mode === 'coming_soon') {
      titleAr = titleAr || 'قريباً';
      titleEn = titleEn || 'Coming Soon';
    } else if (mode === 'maintenance' || mode === 'under_maintenance') {
      titleAr = titleAr || 'الصفحة تحت الصيانة';
      titleEn = titleEn || 'Under Maintenance';
    } else if (mode === 'awaiting_approval') {
      titleAr = titleAr || 'بإنتظار الاعتماد';
      titleEn = titleEn || 'Awaiting Approval';
    } else {
      titleAr = titleAr || 'الصفحة غير متوفرة حالياً';
      titleEn = titleEn || 'Page Temporarily Unavailable';
    }

    return { titleAr, titleEn };
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'بلدية': return <Building className="h-4 w-4" />;
      case 'صحية': return <HeartPulse className="h-4 w-4" />;
      case 'تعليمية': return <GraduationCap className="h-4 w-4" />;
      case 'اجتماعية': return <Sprout className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredServices = services.filter(srv => {
    const matchesSearch = srv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          srv.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || srv.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !phoneNumber) {
      alert("الرجاء ملء حقول الاسم ورقم الهاتف الأساسية.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newRequest: ServiceRequest = {
        id: "req_" + Date.now(),
        serviceId: selectedService?.id || "unknown",
        serviceName: selectedService?.name || "خدمة عامة",
        applicantName,
        phoneNumber,
        notes: notes + (attachedFileName ? ` (المستند المرفق: ${attachedFileName})` : ''),
        status: 'pending',
        dateSubmitted: new Date().toLocaleDateString('ar-SY', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };

      const updatedRequests = [newRequest, ...myRequests];
      setMyRequests(updatedRequests);
      localStorage.setItem('qara_service_requests', JSON.stringify(updatedRequests));

      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset Form fields
      setApplicantName('');
      setPhoneNumber('');
      setNotes('');
      setAttachedFileName('');

      // Auto dismiss success screen after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedService(null);
      }, 3000);
    }, 1500);
  };

  const handleDeleteRequest = (id: string) => {
    const updated = myRequests.filter(req => req.id !== id);
    setMyRequests(updated);
    localStorage.setItem('qara_service_requests', JSON.stringify(updated));
  };

  // --- Render Disabled / Maintenance / Coming Soon Screen if servicesPageEnabled is false ---
  if (homeContent && homeContent.servicesPageEnabled === false) {
    const { titleAr, titleEn } = getDisabledTitles();
    const message = homeContent.servicesDisabledMessage || 'جاري تطوير وتحديث البوابة الإلكترونية لتقديم أحدث الخدمات الرقمية المعتمَدة لمواطني قارة.';
    const logo = homeContent.servicesDisabledLogo || homeContent.identityLogo || homeContent.councilLogo;
    const flagUrl = homeContent.servicesDisabledFlagUrl;

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center font-sans" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-amber-400/20 relative overflow-hidden space-y-8"
        >
          {/* Background decorative watermark patterns */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header Row with Flag and Logo */}
          <div className="flex items-center justify-between flex-row-reverse border-b border-white/10 pb-6">
            {/* Logo top-left */}
            <div className="flex items-center gap-3">
              {logo ? (
                <img src={logo} alt="شعار البوابة" className="h-14 w-auto object-contain rounded-xl bg-white/10 p-1.5 border border-white/20 shadow" />
              ) : (
                <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-400/30">
                  <Building className="h-8 w-8" />
                </div>
              )}
              <div className="text-right hidden sm:block">
                <span className="block text-xs text-amber-300 font-bold">الجمهورية العربية السورية</span>
                <span className="block text-sm font-extrabold text-white">مجلس مدينة قارة</span>
              </div>
            </div>

            {/* Syrian Flag top-right */}
            <div className="flex items-center gap-3 flex-row-reverse">
              <SyrianFlag flagUrl={flagUrl} className="h-12 w-20 shadow-lg border border-amber-400/30 rounded-lg" />
              <div className="text-left hidden sm:block">
                <span className="block text-[11px] text-emerald-200 font-mono">Syrian Arab Republic</span>
                <span className="block text-xs font-bold text-amber-300">Qara City Council</span>
              </div>
            </div>
          </div>

          {/* Main Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-300 text-xs sm:text-sm font-bold shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>إشعار رسمي من البوابة الرقمية</span>
          </div>

          {/* Primary Titles */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black text-amber-300 tracking-tight leading-tight drop-shadow-md">
              {titleAr}
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-200/90 font-mono tracking-widest uppercase">
              {titleEn}
            </h2>
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto rounded-full opacity-80" />

          {/* Description Message */}
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-medium bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
            {message}
          </p>

          {/* Government Info Footer */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/80">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-400" />
              تاريخ التحديث: {new Date().toLocaleDateString('ar-SY', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="font-mono text-[11px] text-amber-300/80">
              Official E-Services Portal • Qara Administrative Office
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right font-sans" dir="rtl">
      
      {/* Page Header */}
      <PageHeader 
        badge="بوابة المعاملات الرقمية" 
        title="دليل الخدمات والتقديم الإلكتروني" 
        description="نهدف إلى تيسير الإجراءات الإدارية لأهالي مدينة قارة داخل سوريا وخارجها. تصفح الوثائق المطلوبة لكل رخصة أو بيان رسمي، وقدم طلبك المبدئي مباشرة عبر البوابة الإلكترونية لمتابعة المعاملة مع مجلس المدينة." 
        homeContent={homeContent} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: List of Services with filter and search */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Search and Category Filter Bar */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-900/5 space-y-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن اسم الخدمة أو نوع الترخيص... (مثال: رخص بناء، قيد مدني)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-11 pl-4 py-3 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border border-gray-200 focus:border-emerald-700 rounded-xl outline-none transition-all text-sm text-right"
              />
              <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Category tags */}
            <div className="flex flex-wrap gap-2 justify-start pt-1">
              {['الكل', 'بلدية', 'صحية', 'تعليمية', 'اجتماعية'].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-800 text-white shadow-sm' 
                        : 'bg-amber-50/50 hover:bg-emerald-50 text-gray-700 border border-amber-900/5'
                    }`}
                  >
                    {cat !== 'الكل' && getCategoryIcon(cat)}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredServices.length > 0 ? (
                filteredServices.map((srv) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={srv.id}
                    className="p-6 bg-white rounded-2xl border border-amber-900/5 shadow-sm hover:shadow-md hover:border-emerald-700/20 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4 text-right">
                      <div className="flex justify-between items-start flex-row-reverse">
                        <span className="text-xs px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full font-bold flex items-center gap-1">
                          {getCategoryIcon(srv.category)}
                          {srv.category}
                        </span>
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
                          <FileText className="h-5 w-5" />
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-900 text-base sm:text-lg min-h-[50px] flex items-center justify-end">
                        {srv.name}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-3">
                        {srv.description}
                      </p>
                    </div>

                    <div className="pt-5 mt-5 border-t border-gray-50 flex items-center justify-between flex-row-reverse">
                      <div className="flex items-center gap-1 text-xs text-gray-400 font-sans">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        <span>{srv.processingTime}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedService(srv);
                          setSubmitSuccess(false);
                        }}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-colors cursor-pointer"
                      >
                        عرض الوثائق والتقديم
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-gray-400 space-y-2">
                  <AlertCircle className="h-12 w-12 mx-auto text-amber-400" />
                  <p className="font-bold">لا توجد خدمات مطابقة لبحثك في قارة حالياً.</p>
                  <p className="text-xs">جرب البحث بكلمات أبسط أو تغيير الفلتر.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Right Column: User's Applications Tracker (Durable Experience) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800">
            <h3 className="font-bold text-md mb-2 flex items-center gap-2 justify-end">
              <span>حالة طلباتك المقدمة</span>
              <ClipboardList className="h-5 w-5 text-amber-300" />
            </h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed mb-4">
              هذه القائمة تحفظ طلباتك المبدئية محلياً لتتبع حالتها مع موظفي مجلس المدينة.
            </p>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {myRequests.length > 0 ? (
                myRequests.map((req) => (
                  <div key={req.id} className="p-4 bg-emerald-950/55 rounded-xl border border-emerald-800/80 space-y-3 relative">
                    <button 
                      onClick={() => handleDeleteRequest(req.id)}
                      className="absolute left-2.5 top-2.5 p-1 hover:text-red-400 text-emerald-300 transition-colors"
                      title="حذف السجل"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div className="space-y-1">
                      <span className="text-[10px] text-amber-300 font-sans">{req.dateSubmitted}</span>
                      <h4 className="font-bold text-xs text-white max-w-[85%]">{req.serviceName}</h4>
                    </div>

                    <div className="text-xs text-emerald-200 font-sans space-y-1">
                      <p><span className="text-emerald-400/80">المقدم:</span> {req.applicantName}</p>
                      <p><span className="text-emerald-400/80">الهاتف:</span> {req.phoneNumber}</p>
                    </div>

                    <div className="flex items-center justify-between flex-row-reverse pt-2 border-t border-emerald-800/60 text-[10px]">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                        مستلم - قيد المراجعة
                      </span>
                      <span className="text-emerald-400/70">رقم الطلب: {req.id.replace('req_', '#')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-emerald-200/40 border border-emerald-800/50 rounded-xl border-dashed">
                  <p className="text-xs">لم تقم بتقديم أي طلبات مبدئية حتى الآن.</p>
                </div>
              )}
            </div>
          </div>

          {/* Helpful Tips Card */}
          <div className="bg-white p-6 rounded-2xl border border-amber-900/5 shadow-sm text-right space-y-4">
            <h4 className="font-bold text-gray-900 text-sm flex items-center justify-end gap-1.5">
              <span>إرشادات تقديم المعاملات</span>
              <HelpCircle className="h-4 w-4 text-emerald-700" />
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 leading-relaxed list-disc list-inside">
              <li>يرجى إرفاق صور واضحة من الهوية الشخصية وسندات الملكية.</li>
              <li>للأخوة المغتربين خارج سوريا، يمكنكم تفويض وكيل قانوني لاستكمال الدفع والتسليم بالبلدية.</li>
              <li>جميع الرسوم رمزية تسدد بموجب وصولات رسمية لصالح صندوق مجلس مدينة قارة المعتمد.</li>
            </ul>
          </div>

        </div>

      </div>

      {/* SERVICE DETAILS AND APPLICATION FORM MODAL (Surgical Interactive Layer) */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10 flex flex-col max-h-[90vh]"
            >
              
              {/* Header */}
              <div className="p-6 bg-emerald-900 text-white flex justify-between items-center flex-row-reverse text-right">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-300 font-mono tracking-widest bg-emerald-950 px-2.5 py-0.5 rounded-full">معاملة {selectedService.category}</span>
                  <h3 className="text-lg sm:text-xl font-bold">{selectedService.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 rounded-full hover:bg-emerald-950/80 text-emerald-200 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-right">
                
                {submitSuccess ? (
                  /* Success Feedback Panel */
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle className="h-10 w-10 animate-bounce" />
                    </div>
                    <h4 className="text-xl font-bold text-emerald-950">تم تقديم الطلب المبدئي بنجاح!</h4>
                    <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                      تم حفظ الطلب وتصديره تحت رقم تتبع مؤقت. يرجى تدوين الرقم ومراجعة مجلس المدينة أو شعبة الخدمة المختصة بقارة لاستكمال الإجراءات الرسمية ومطابقة الهوية.
                    </p>
                    <div className="p-3 bg-amber-50 rounded-xl inline-block text-amber-800 font-mono text-xs font-bold">
                      تم الحفظ في سجل 'طلباتك المقدمة'
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* Part 1: Documents and steps */}
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-emerald-950 text-sm border-r-4 border-amber-500 pr-2">الوثائق والأوراق المطلوبة</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedService.requiredDocuments.map((doc, idx) => (
                          <div key={idx} className="p-3 bg-amber-50/50 rounded-xl text-xs text-gray-700 flex items-start gap-2 flex-row-reverse text-right">
                            <FileCheck className="h-4 w-4 text-emerald-800 shrink-0 mt-0.5" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-extrabold text-emerald-950 text-sm border-r-4 border-amber-500 pr-2">خطوات المعاملة بالتفصيل</h4>
                      <ol className="space-y-2.5 text-xs text-gray-600 font-sans">
                        {selectedService.steps.map((step, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start flex-row-reverse text-right">
                            <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center justify-center shrink-0 font-mono text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Part 2: Dynamic Submission Form */}
                    <div className="pt-6 border-t border-gray-100 space-y-4">
                      <div className="flex items-center gap-1.5 justify-end">
                        <h4 className="font-extrabold text-emerald-950 text-sm">استمارة تقديم طلب مبدئي</h4>
                        <Sparkles className="h-4 w-4 text-amber-500" />
                      </div>
                      
                      <form onSubmit={handleApplySubmit} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 flex items-center justify-end gap-1">
                              الاسم الثلاثي لمقدم الطلب <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                required
                                placeholder="مثال: محمد أحمد كرباج"
                                value={applicantName}
                                onChange={(e) => setApplicantName(e.target.value)}
                                className="w-full pr-10 pl-3 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                              />
                              <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 flex items-center justify-end gap-1">
                              رقم الهاتف للتواصل <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="tel"
                                required
                                placeholder="مثال: 0993123456"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full pr-10 pl-3 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-mono"
                              />
                              <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-700">ملاحظات أو شرح الطلب</label>
                          <textarea
                            rows={2}
                            placeholder="اكتب هنا أي استفسارات أو تفاصيل إضافية حول عقارك أو حالتك الاجتماعية..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                          />
                        </div>

                        {/* Interactive Simulated File Attachment */}
                        <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-between flex-row-reverse text-right">
                          <div className="space-y-0.5">
                            <span className="text-xs font-semibold text-gray-800">إرفاق الهوية أو الوثائق الداعمة (اختياري)</span>
                            <p className="text-[10px] text-gray-400">يدعم صيغ JPG، PDF في محاكاة التقديم</p>
                          </div>
                          
                          {attachedFileName ? (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                              <span className="truncate max-w-[120px]">{attachedFileName}</span>
                              <X className="h-3.5 w-3.5 text-red-500 cursor-pointer" onClick={() => setAttachedFileName('')} />
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const mockFiles = ["identity_card_front.jpg", "property_deed.pdf", "family_booklet.jpg"];
                                const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
                                setAttachedFileName(randomFile);
                              }}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                            >
                              إرفاق ملف تجريبي
                            </button>
                          )}
                        </div>

                        <div className="pt-3 flex gap-2">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {isSubmitting ? (
                              <>
                                <span className="animate-spin h-4 w-4 border-2 border-emerald-950 border-t-transparent rounded-full inline-block"></span>
                                <span>جاري مراجعة وإرسال الطلب...</span>
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 shrink-0" />
                                <span>تقديم الطلب المبدئي إلكترونياً</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedService(null)}
                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
                          >
                            إلغاء
                          </button>
                        </div>

                      </form>
                    </div>
                  </>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
