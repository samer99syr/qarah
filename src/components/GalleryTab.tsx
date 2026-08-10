import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ZoomIn, 
  X, 
  Calendar, 
  User, 
  Image as ImageIcon, 
  Download, 
  Plus, 
  Upload, 
  Info, 
  Check, 
  CheckCircle, 
  Camera,
  Folder,
  Tag
} from 'lucide-react';
import { GalleryItem, HomeContent } from '../types';
import PageHeader from './PageHeader';

interface GalleryTabProps {
  galleryItems: GalleryItem[];
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  homeContent: HomeContent;
  selectedImageId: string | null;
  setSelectedImageId: (id: string | null) => void;
}

export default function GalleryTab({
  galleryItems,
  setGalleryItems,
  homeContent,
  selectedImageId,
  setSelectedImageId
}: GalleryTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomedPhoto, setZoomedPhoto] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const galleryRef = useRef<HTMLDivElement>(null);

  // Available categories
  const categories = homeContent.galleryCategories && homeContent.galleryCategories.length > 0
    ? homeContent.galleryCategories
    : ["صور المناطق الطبيعية", "صور الأطفال", "صور المناسبات الاجتماعية", "صور متنوعة"];

  // Sharing form states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [photoCategory, setPhotoCategory] = useState<string>(categories[0] || "صور متنوعة");
  const [photoUrl, setPhotoUrl] = useState("");
  const [customFile, setCustomFile] = useState("");
  const [presetIndex, setPresetIndex] = useState<number | null>(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Preset images of Qara for quick selection
  const PRESET_IMAGES = [
    { name: "كرز القلمون الأحمر في قارة", url: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80" },
    { name: "سهول القلمون والغروب الهادئ", url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" },
    { name: "شجرة زيتون قلمونية معمرة", url: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80" },
  ];

  // Drag and drop helper functions
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
        const formattedSize = maxKB >= 1024 * 1024 
          ? `${(maxKB / (1024 * 1024)).toFixed(1)} جيجابايت` 
          : maxKB >= 1024 
            ? `${(maxKB / 1024).toFixed(0)} ميجابايت` 
            : `${maxKB} كيلوبايت`;
        setUploadError(`حجم الصورة كبير جداً! الحد الأقصى المسموح به حالياً هو ${formattedSize}`);
        return;
      }
      setUploadError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomFile(reader.result as string);
        setPresetIndex(null); // Deselect preset
        setPhotoUrl("");      // Clear photo url
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxKB = homeContent.maxUploadSizeKB || 5000;
      if (file.size > maxKB * 1024) {
        const formattedSize = maxKB >= 1024 * 1024 
          ? `${(maxKB / (1024 * 1024)).toFixed(1)} جيجابايت` 
          : maxKB >= 1024 
            ? `${(maxKB / 1024).toFixed(0)} ميجابايت` 
            : `${maxKB} كيلوبايت`;
        setUploadError(`حجم الصورة كبير جداً! الحد الأقصى المسموح به حالياً هو ${formattedSize}`);
        return;
      }
      setUploadError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomFile(reader.result as string);
        setPresetIndex(null); // Deselect preset
        setPhotoUrl("");      // Clear photo url
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !submitterName.trim()) return;

    let finalUrl = "";
    if (presetIndex !== null) {
      finalUrl = PRESET_IMAGES[presetIndex].url;
    } else if (customFile) {
      finalUrl = customFile;
    } else if (photoUrl.trim()) {
      finalUrl = photoUrl.trim();
    } else {
      finalUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"; // fallback
    }

    const newItem: GalleryItem = {
      id: "g-user-" + Date.now(),
      title: photoTitle,
      submitter: submitterName,
      imageUrl: finalUrl,
      date: new Date().toISOString().split('T')[0],
      status: 'pending', // pending approval from admin!
      category: photoCategory || categories[0] || "صور متنوعة"
    };

    setGalleryItems((prev) => [newItem, ...prev]);
    setSubmitSuccess(true);
    
    // Clear form and close modal after timeout
    setTimeout(() => {
      setPhotoTitle("");
      setSubmitterName("");
      setPhotoCategory(categories[0] || "صور متنوعة");
      setPhotoUrl("");
      setCustomFile("");
      setPresetIndex(0);
      setSubmitSuccess(false);
      setIsShareModalOpen(false);
      setUploadError(null);
    }, 2500);
  };

  // Filter approved items and sort by date descending (newest first)
  const approvedItems = [...galleryItems]
    .filter(item => item.status === 'approved')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter by category selected by user
  const filteredItems = approvedItems.filter(item => {
    if (selectedCategory === "الكل") return true;
    return (item.category || "صور متنوعة") === selectedCategory;
  });

  // Max 48 photos are active in the gallery
  const activePhotos = filteredItems.slice(0, 48);
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(activePhotos.length / ITEMS_PER_PAGE) || 1;

  // Handle deep link redirect with auto-scroll and auto-zoom
  useEffect(() => {
    if (selectedImageId) {
      const itemIndex = activePhotos.findIndex(item => item.id === selectedImageId);
      if (itemIndex !== -1) {
        // Find which page the item is on (1-indexed)
        const targetPage = Math.floor(itemIndex / ITEMS_PER_PAGE) + 1;
        setCurrentPage(targetPage);

        // Find the item
        const item = activePhotos[itemIndex];
        setZoomedPhoto(item);

        // Smooth scroll to the gallery container after a short delay
        setTimeout(() => {
          galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
      // Clear the deep link state so subsequent loads are normal
      setSelectedImageId(null);
    }
  }, [selectedImageId, activePhotos, setSelectedImageId]);

  // Paginated active photos
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPhotos = activePhotos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div ref={galleryRef} className="py-12 bg-gradient-to-b from-[#fdfbf7] to-[#f9f6f0] min-h-screen text-right font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Header with dynamic Title and Description, plus Action Button beside the title */}
        <PageHeader
          badge="معرض الصور واللقطات الحية"
          title={homeContent.galleryTitle || "ألبوم صور وذكريات بلدة قارة"}
          description={homeContent.galleryDescription || "مساحة تواصل بصرية تجمع لقطات ومساهمات أهالي بلدة قارة الأبية لتخليد جمال طبيعتها، بساتين الكرز، أحيائها التراثية الشامخة، وجبال القلمون الممتدة."}
          homeContent={homeContent}
          action={
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all duration-300 cursor-pointer border border-amber-600 mr-2"
            >
              <Plus className="h-4 w-4" />
              <span>مشاركة صورة جديدة</span>
            </motion.button>
          }
        />

        {/* Elegant Category Filter Bar for Viewers */}
        <div className="mb-8 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-amber-900/10 shadow-sm flex flex-col md:flex-row-reverse items-stretch md:items-center justify-between gap-3 text-right" dir="rtl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 flex-shrink-0">
            <Folder className="h-4 w-4 text-amber-500" />
            <span>تصنيفات ألبوم الصور:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("الكل");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "الكل"
                  ? "bg-emerald-800 text-white shadow-md scale-[1.02]"
                  : "bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 border border-gray-200/80"
              }`}
            >
              <span>كل الصور</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                selectedCategory === "الكل" ? "bg-emerald-700 text-amber-300" : "bg-gray-200 text-gray-600"
              }`}>
                {approvedItems.length}
              </span>
            </button>

            {categories.map((cat) => {
              const count = approvedItems.filter(i => (i.category || "صور متنوعة") === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-emerald-800 text-white shadow-md scale-[1.02]"
                      : "bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 border border-gray-200/80"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected ? "bg-emerald-700 text-amber-300" : "bg-gray-200 text-gray-600"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        {activePhotos.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-amber-900/5 shadow-sm max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-800 border border-emerald-100">
              <ImageIcon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950">لا توجد صور في المعرض حالياً</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              كن أول من يشارك صورة جميلة لبلدتنا من خلال الضغط على زر "مشاركة صورة جديدة" أعلاه!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 4 columns layout on desktop (lg:grid-cols-4) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedPhotos.map((item, index) => (
                <motion.div
                  key={item.id}
                  id={`gallery-item-${item.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => setZoomedPhoto(item)}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 flex flex-col h-full relative"
                >
                  {/* Image Container with Hover Zoom */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Category Tag Badge */}
                    {item.category && (
                      <div className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-emerald-950/80 backdrop-blur-sm text-amber-300 text-[10px] font-bold rounded-lg shadow-sm border border-amber-400/20 flex items-center gap-1">
                        <Tag className="h-2.5 w-2.5 text-amber-400" />
                        <span>{item.category}</span>
                      </div>
                    )}

                    {/* Dynamic Watermark Overlay */}
                    {homeContent.galleryWatermarkEnabled !== false && (
                      <div 
                        style={{
                          backgroundColor: homeContent.galleryWatermarkBgColor || 'rgba(0, 0, 0, 0.65)',
                          color: homeContent.galleryWatermarkTextColor || '#ffffff',
                          fontSize: `${homeContent.galleryWatermarkFontSize || 10}px`
                        }}
                        className={`absolute z-10 px-2.5 py-1 rounded-xl border border-white/10 select-none pointer-events-none flex flex-col gap-0.5 whitespace-nowrap shadow-md transition-all ${
                          homeContent.galleryWatermarkPosition === 'bottom_left'
                            ? 'bottom-2.5 left-2.5 text-left items-start'
                            : homeContent.galleryWatermarkPosition === 'bottom_center'
                            ? 'bottom-2.5 left-1/2 -translate-x-1/2 text-center items-center'
                            : 'bottom-2.5 right-2.5 text-right items-end'
                        }`}
                      >
                        <div className="flex items-center gap-1 flex-row-reverse font-bold tracking-tight">
                          <span style={{ color: homeContent.galleryWatermarkTextColorSecondary || '#fbbf24' }}>©</span>
                          <span className="truncate max-w-[120px]">{item.submitter}</span>
                        </div>
                        <div 
                          style={{ 
                            color: homeContent.galleryWatermarkTextColor || '#ffffff', 
                            opacity: 0.8,
                            fontSize: `${(homeContent.galleryWatermarkFontSize || 10) * 0.8}px`
                          }} 
                          className="font-medium"
                        >
                          موقع مدينة قارة
                        </div>
                      </div>
                    )}

                    {/* Dark gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <div className="bg-white/90 backdrop-blur-sm text-emerald-950 font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                        <ZoomIn className="h-3.5 w-3.5" />
                        <span>تكبير الصورة</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Info Section */}
                  <div className="p-4 flex-grow flex flex-col justify-between text-right space-y-3">
                    <h3 className="font-bold text-sm text-emerald-950 group-hover:text-emerald-800 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    
                    <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-500 flex-row-reverse">
                      {/* Submitter */}
                      <span className="flex items-center gap-1 font-medium text-emerald-800 bg-emerald-50/50 px-2 py-0.5 rounded-md">
                        <User className="h-3 w-3" />
                        <span>بواسطة: {item.submitter}</span>
                      </span>

                      {/* Upload Date */}
                      <span className="flex items-center gap-1 font-mono text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{item.date}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 flex-row-reverse">
                {/* Previous Button */}
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 hover:text-emerald-800 transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-400 text-gray-600"
                  aria-label="الصفحة السابقة"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1.5 flex-row-reverse">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isSelected = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 rounded-xl text-xs font-bold font-sans transition-all ${
                          isSelected 
                            ? 'bg-emerald-800 text-white shadow-sm' 
                            : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 hover:text-emerald-800 transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-400 text-gray-600"
                  aria-label="الصفحة التالية"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox / High-resolution original size zoom modal */}
      <AnimatePresence>
        {zoomedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4"
            onClick={() => setZoomedPhoto(null)}
          >
            {/* Close Button & Header Info */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-white pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedPhoto(null);
                }}
                className="p-2.5 rounded-full bg-black/50 hover:bg-white/10 text-white hover:text-red-400 transition-all pointer-events-auto border border-white/10"
                aria-label="إغلاق المعاينة"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="bg-black/50 border border-white/10 px-4 py-2 rounded-2xl flex flex-row-reverse items-center gap-4 text-right">
                <span className="text-xs font-bold text-amber-400">بواسطة: {zoomedPhoto.submitter}</span>
                <span className="text-[10px] text-gray-400 font-mono">{zoomedPhoto.date}</span>
              </div>
            </div>

            {/* Photo Container: displays photo with its original proportions and maximum resolution */}
            <div 
              className="relative max-w-full max-h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                src={zoomedPhoto.imageUrl}
                alt={zoomedPhoto.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/5"
              />

              {/* Dynamic Watermark Overlay for Zoomed View */}
              {homeContent.galleryWatermarkEnabled !== false && (
                <div 
                  style={{
                    backgroundColor: homeContent.galleryWatermarkBgColor || 'rgba(0, 0, 0, 0.65)',
                    color: homeContent.galleryWatermarkTextColor || '#ffffff',
                    fontSize: `${(homeContent.galleryWatermarkFontSize || 11) * 1.3}px`
                  }}
                  className={`absolute z-20 px-3.5 py-2 rounded-2xl border border-white/10 select-none pointer-events-none flex flex-col gap-0.5 whitespace-nowrap shadow-xl transition-all ${
                    homeContent.galleryWatermarkPosition === 'bottom_left'
                      ? 'bottom-4 left-4 text-left items-start'
                      : homeContent.galleryWatermarkPosition === 'bottom_center'
                      ? 'bottom-4 left-1/2 -translate-x-1/2 text-center items-center'
                      : 'bottom-4 right-4 text-right items-end'
                  }`}
                >
                  <div className="flex items-center gap-1 flex-row-reverse font-bold tracking-tight">
                    <span style={{ color: homeContent.galleryWatermarkTextColorSecondary || '#fbbf24' }}>©</span>
                    <span>{zoomedPhoto.submitter}</span>
                  </div>
                  <div 
                    style={{ 
                      color: homeContent.galleryWatermarkTextColor || '#ffffff', 
                      opacity: 0.8,
                      fontSize: `${((homeContent.galleryWatermarkFontSize || 11) * 1.3) * 0.8}px`
                    }} 
                    className="font-medium"
                  >
                    موقع مدينة قارة
                  </div>
                </div>
              )}
            </div>

            {/* Title & Actions Bar */}
            <div 
              className="mt-6 max-w-2xl text-center px-4 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                {zoomedPhoto.title}
              </h2>
              <div className="flex items-center justify-center gap-3">
                <a
                  href={zoomedPhoto.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-sm border border-emerald-600"
                >
                  <Download className="h-4 w-4" />
                  <span>فتح في علامة تبويب جديدة بالأبعاد الأصلية</span>
                </a>
                <button
                  onClick={() => setZoomedPhoto(null)}
                  className="bg-white/10 text-white font-medium text-xs px-4 py-2 rounded-xl hover:bg-white/20 transition-all border border-white/10"
                >
                  إغلاق نافذة العرض
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share New Photo Modal with Copyright Agreement Check */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-100 bg-emerald-50 flex items-center justify-between flex-row-reverse text-right">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <div className="p-2.5 bg-emerald-800 text-amber-300 rounded-xl">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-emerald-950">مشاركة صورة وذكريات في المعرض</h3>
                    <p className="text-[10px] text-gray-500">شاركنا جمال وذكريات مدينة قارة الحبيبة</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsShareModalOpen(false);
                    setUploadError(null);
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-right flex-grow">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center border-4 border-emerald-50">
                      <CheckCircle className="h-10 w-10 animate-bounce" />
                    </div>
                    <h4 className="text-base font-extrabold text-emerald-950">تم إرسال صورتك بنجاح!</h4>
                    <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                      شكراً لمشاركتك المتميزة. تم تسجيل الصورة في لوحة التحكم وتخزينها محلياً، وستظهر في المعرض العام فور مراجعتها واعتمادها من قبل إدارة الموقع.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmitPhoto} className="space-y-4">
                    
                    {/* Photo Title */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700">عنوان الصورة أو الوصف القصير <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={photoTitle}
                        onChange={(e) => setPhotoTitle(e.target.value)}
                        placeholder="مثال: جامع قارة الكبير الأثري تحت الثلوج"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                      />
                    </div>

                    {/* Submitter Name */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700">اسم مالك الصورة / المصور <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={submitterName}
                        onChange={(e) => setSubmitterName(e.target.value)}
                        placeholder="أدخل اسمك الكريم ليظهر على الصورة ومعرض الصور"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                      />
                    </div>

                    {/* Photo Category Selection */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700">تصنيف الصورة <span className="text-red-500">*</span></label>
                      <select
                        value={photoCategory}
                        onChange={(e) => setPhotoCategory(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-bold text-emerald-950"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Upload choice or direct url */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700">طريقة إرفاق الصورة <span className="text-red-500">*</span></label>
                      
                      {/* Presets / Direct Link / Upload Choice */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setPresetIndex(0);
                            setCustomFile("");
                            setPhotoUrl("");
                          }}
                          className={`p-2 border rounded-xl font-bold transition-all cursor-pointer ${presetIndex !== null ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                        >
                          معرض سريع
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPresetIndex(null);
                            setPhotoUrl("");
                            setCustomFile("");
                          }}
                          className={`p-2 border rounded-xl font-bold transition-all cursor-pointer ${presetIndex === null && !photoUrl ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                        >
                          رفع ملف صورة
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPresetIndex(null);
                            setCustomFile("");
                          }}
                          className={`p-2 border rounded-xl font-bold transition-all cursor-pointer ${photoUrl ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                        >
                          رابط URL مباشر
                        </button>
                      </div>

                      {/* Display based on selection */}
                      {presetIndex !== null ? (
                        <div className="space-y-2 pt-2">
                          <span className="text-[10px] text-gray-400 block font-bold">اختر صورة جاهزة من جبال وبساتين قارة:</span>
                          <div className="grid grid-cols-3 gap-2">
                            {PRESET_IMAGES.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setPresetIndex(idx)}
                                className={`group relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${presetIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-500/20 scale-[1.02]' : 'border-gray-200 hover:border-gray-300'}`}
                              >
                                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[8px] text-white text-center truncate">
                                  {preset.name}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : !photoUrl ? (
                        /* Upload File area */
                        <div className="pt-2">
                          <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('gallery-file-input-tab')?.click()}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                              isDragActive 
                                ? 'border-emerald-600 bg-emerald-50/50' 
                                : customFile 
                                  ? 'border-emerald-500 bg-emerald-50/20' 
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                            }`}
                          >
                            <input
                              id="gallery-file-input-tab"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            {customFile ? (
                              <div className="space-y-2">
                                <img src={customFile} alt="معاينة الرفع" className="h-16 w-auto mx-auto rounded-lg object-cover shadow-sm" />
                                <span className="text-[11px] font-bold text-emerald-800 block">تم تجهيز صورتك للرفع بنجاح!</span>
                                <span className="text-[9px] text-gray-400 block">انقر هنا لتغيير الصورة المحددة</span>
                              </div>
                            ) : (
                              <div className="space-y-1.5 flex flex-col items-center justify-center">
                                <Upload className="h-6 w-6 text-gray-400" />
                                <p className="text-[11px] font-bold text-emerald-950">اسحب وأفلت ملف الصورة هنا، أو انقر للتصفح</p>
                                <p className="text-[9px] text-gray-400">يدعم صيغ JPG, PNG, WebP (الحد الأقصى {((homeContent.maxUploadSizeKB || 5000) / 1024).toFixed(0)} ميجابايت)</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* URL input */
                        <div className="pt-2 space-y-1.5">
                          <label className="block text-[11px] text-gray-500">أدخل رابط الصورة المباشر من الإنترنت (URL):</label>
                          <input
                            type="url"
                            value={photoUrl}
                            onChange={(e) => {
                              setPhotoUrl(e.target.value);
                              setCustomFile("");
                            }}
                            placeholder="https://example.com/image.jpg"
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-left font-mono"
                          />
                        </div>
                      )}
                    </div>

                    {/* Error Alerts */}
                    {uploadError && (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-800 font-bold text-right leading-relaxed flex items-center gap-2 flex-row-reverse">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping flex-shrink-0"></span>
                        <span>{uploadError}</span>
                      </div>
                    )}

                    {/* Submit and Cancel Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 flex-row-reverse">
                      <button
                        type="submit"
                        disabled={!photoTitle.trim() || !submitterName.trim()}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                          photoTitle.trim() && submitterName.trim()
                            ? 'bg-emerald-800 hover:bg-emerald-950 text-white hover:scale-[1.01]' 
                            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        <span>إرسال الصورة للمراجعة والاعتماد</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsShareModalOpen(false);
                          setUploadError(null);
                        }}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs"
                      >
                        إلغاء الأمر
                      </button>
                    </div>

                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
