import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  PhoneCall, 
  ShieldAlert, 
  HeartPulse, 
  Sprout, 
  Info, 
  Clock, 
  ChevronLeft, 
  Award,
  BookOpen,
  ArrowRightLeft,
  Building,
  CheckCircle2,
  HelpCircle,
  Image as ImageIcon,
  Camera,
  Check,
  Plus,
  Sparkles,
  Upload,
  X,
  Building2,
  Briefcase,
  Calendar,
  Newspaper,
  Compass,
  FileText,
  Video,
  Film,
  ExternalLink,
  FileSearch,
  Maximize2,
  Cherry,
  UserCheck,
  User,
  Users
} from 'lucide-react';
import { HomeContent, SideBanner, GalleryItem, News, CustomPage, HeritagePoint } from '../types';

// Import our custom-generated banner
import heroBanner from '../assets/images/qara_mosque_hero_1783884601871.jpg';

interface HomeTabProps {
  setActiveTab: (tab: string) => void;
  homeContent: HomeContent;
  galleryItems: GalleryItem[];
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  visitorCount: number;
  setSelectedImageId: (id: string | null) => void;
  newsList?: News[];
  visibleTabs?: { [key: string]: boolean };
  customPages?: CustomPage[];
  onOpenLiveStream?: () => void;
  onOpenCitizenAuth?: () => void;
}

const contactIconMap: Record<string, React.ComponentType<any>> = {
  Building: Building,
  HeartPulse: HeartPulse,
  ShieldAlert: ShieldAlert,
  Sprout: Sprout
};

export default function HomeTab({ 
  setActiveTab, 
  homeContent, 
  galleryItems, 
  setGalleryItems, 
  visitorCount, 
  setSelectedImageId, 
  newsList = [],
  visibleTabs = { home: true, directory: true, news: true, projects: true, services: true, gallery: true },
  customPages = [],
  onOpenLiveStream,
  onOpenCitizenAuth
}: HomeTabProps) {
  const [selectedHeritage, setSelectedHeritage] = useState(0);
  const [selectedLandmarkModal, setSelectedLandmarkModal] = useState<HeritagePoint | null>(null);
  const [simulatedCall, setSimulatedCall] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  const isTabVisible = (tabId: string) => {
    const target = tabId === 'citizens' ? 'projects' : tabId;
    if (target === 'services') {
      return visibleTabs.services !== false && homeContent.servicesPageEnabled !== false;
    }
    if (target === 'live_stream') {
      return homeContent.liveStreamEnabled !== false;
    }
    if (['home', 'qara_city', 'landmarks', 'directory', 'news', 'projects', 'services', 'gallery', 'survey', 'admin', 'ramadan', 'marketplace'].includes(target)) {
      return visibleTabs[target] !== false;
    }
    const page = customPages.find(p => p.id === target);
    if (page) {
      return page.status === 'active';
    }
    return true;
  };

  const handleImageClick = (currentItem: { title: string; description: string; image?: string }) => {
    if (!currentItem.image) return;
    
    // Find matching item in approved gallery items
    const matchingItem = galleryItems.find(item => 
      (item.imageUrl && item.imageUrl === currentItem.image) || 
      (item.title === currentItem.title)
    );

    if (matchingItem) {
      setSelectedImageId(matchingItem.id);
      setActiveTab('gallery');
    } else {
      // Create a new approved gallery item dynamically so it can be zoomed and shown in the gallery tab
      const newId = `g-heritage-${Date.now()}`;
      const newGalleryItem: GalleryItem = {
        id: newId,
        title: currentItem.title,
        submitter: "بوابة قارة الأثرية",
        imageUrl: currentItem.image,
        date: new Date().toISOString().split('T')[0],
        status: 'approved'
      };
      
      setGalleryItems(prev => [newGalleryItem, ...prev]);
      setSelectedImageId(newId);
      setActiveTab('gallery');
    }
  };

  const isSidebar = homeContent.homeMarqueePosition === 'sidebar_right' || homeContent.homeMarqueePosition === 'sidebar_left';
  const isSidebarLeft = homeContent.homeMarqueePosition === 'sidebar_left';

  // Dynamic section spacing helper based on admin settings
  const getSpacingClass = () => {
    if (isSidebar) return "py-8 px-5 bg-white rounded-3xl border border-amber-900/5 shadow-sm space-y-6 text-right";
    const spacing = homeContent.sectionSpacing || 'medium';
    if (spacing === 'small') {
      return "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-right";
    } else if (spacing === 'medium') {
      return "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-right";
    } else {
      return "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-right";
    }
  };
  const sectionClass = getSpacingClass();

  const getDynamicPadding = (defaultClasses: string) => {
    if (isSidebar) return "py-6";
    const spacing = homeContent.sectionSpacing || 'medium';
    if (spacing === 'small') {
      return defaultClasses.replace('py-16 sm:py-24', 'py-6 sm:py-8').replace('py-16', 'py-6').replace('py-12', 'py-5');
    } else if (spacing === 'medium') {
      return defaultClasses.replace('py-16 sm:py-24', 'py-10 sm:py-14').replace('py-16', 'py-10').replace('py-12', 'py-8');
    }
    return defaultClasses;
  };

  const renderVisitorCounter = () => {
    if (homeContent.visitorCountEnabled === false) return null;

    return (
      <div 
        id="visitor-counter-block"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex justify-center animate-fadeIn"
      >
        <div 
          className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all shadow-sm font-sans shrink-0"
          style={{
            backgroundColor: homeContent.visitorCounterBg || '#064e3b',
            borderColor: (homeContent.visitorCounterColor || '#fbbf24') + '25',
            color: homeContent.visitorCounterColor || '#fbbf24'
          }}
          dir="rtl"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <Users className="h-4 w-4 opacity-90" />
          <span className="text-xs sm:text-sm font-bold text-white mr-1">
            {homeContent.visitorCounterTitle || 'إجمالي زوار بوابة قارة الإلكترونية'}
          </span>
          <span className="text-sm font-bold font-mono tracking-wider ml-1" dir="ltr">
            {visitorCount.toLocaleString('en-US')}
          </span>
          <span className="text-[11px] text-white/80 font-medium">زائر</span>
        </div>
      </div>
    );
  };

  // Photo Gallery citizen submission states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [customFile, setCustomFile] = useState<string>("");
  const [presetIndex, setPresetIndex] = useState<number | null>(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const PRESET_IMAGES = [
    { name: "كرز القلمون الأحمر في قارة", url: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80" },
    { name: "سهول القلمون والغروب الهادئ", url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" },
    { name: "شجرة زيتون قلمونية معمرة", url: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80" },
  ];

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
        setPresetIndex(null); // Deselect preset since they uploaded a file
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
      status: 'pending' // pending approval from admin!
    };

    setGalleryItems((prev) => [newItem, ...prev]);
    setSubmitSuccess(true);
    
    // Clear form and close modal
    setTimeout(() => {
      setPhotoTitle("");
      setSubmitterName("");
      setPhotoUrl("");
      setCustomFile("");
      setPresetIndex(0);
      setSubmitSuccess(false);
      setIsModalOpen(false);
    }, 2500);
  };

  useEffect(() => {
    if (!isModalOpen) {
      setUploadError(null);
    }
  }, [isModalOpen]);

  useEffect(() => {
    // Set a formatted live time in Damascus/Qara zone
    const updateTime = () => {
      const now = new Date();
      const syrianTime = new Intl.DateTimeFormat('ar-SY', {
        timeStyle: 'medium',
        dateStyle: 'long',
        timeZone: 'Asia/Damascus',
      }).format(now);
      setCurrentTime(syrianTime);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getContactColor = (iconName: string) => {
    switch (iconName) {
      case 'Building': return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case 'HeartPulse': return "text-red-700 bg-red-50 border-red-200";
      case 'ShieldAlert': return "text-orange-700 bg-orange-50 border-orange-200";
      case 'Sprout': return "text-amber-700 bg-amber-50 border-amber-200";
      default: return "text-emerald-700 bg-emerald-50 border-emerald-200";
    }
  };

  const handleCallSimulation = (name: string, number: string) => {
    setSimulatedCall(`جاري الاتصال بـ ${name} (${number})... الهاتف يحاكي الاتصال في البيئة التجريبية.`);
    setTimeout(() => {
      setSimulatedCall(null);
    }, 5000);
  };

  const renderHorizontalMarquee = () => {
    if (!isTabVisible('gallery')) return null;
    const approvedPhotos = galleryItems.filter(item => item.status === 'approved');
    let marqueeList = [...approvedPhotos];
    if (marqueeList.length > 0) {
      while (marqueeList.length < 16) {
        marqueeList = [...marqueeList, ...approvedPhotos];
      }
    }

    return (
      <section className="py-8 text-right w-full animate-fadeIn" id="home-photo-marquee">
        <div className="bg-amber-50/50 rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02]"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-4 border-b border-amber-900/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>شريط لقطات أهالي قارة المباشر (متحرك)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950">معرض صور بلدة قارة التشاركي</h2>
              <p className="text-gray-500 text-xs mt-1 font-sans">
                الصور تتحرك تلقائياً من اليسار إلى اليمين. انقر فوق أي صورة لتصفحها وتكبيرها فوراً في معرض الصور الرئيسي.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="self-start md:self-center inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer text-xs"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>مشاركة صورة جديدة</span>
            </button>
          </div>

          {/* Scrolling Marquee Area */}
          {approvedPhotos.length > 0 ? (
            <div className="relative w-full overflow-hidden py-2" dir="ltr">
              {/* Fade gradients on edges */}
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#fdfbf7] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#fdfbf7] to-transparent z-10 pointer-events-none"></div>

              <div className="flex animate-marquee-h gap-4 hover:[animation-play-state:paused] cursor-pointer">
                {marqueeList.map((photo, index) => (
                  <div
                    key={`${photo.id}-${index}`}
                    onClick={() => {
                      setSelectedImageId(photo.id);
                      setActiveTab('gallery');
                    }}
                    className="w-44 h-32 rounded-2xl overflow-hidden border border-amber-900/15 shadow-sm hover:scale-105 hover:border-emerald-700 hover:shadow-md transition-all duration-300 flex-shrink-0 relative group"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover select-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 text-right text-white">
                      <p className="text-[10px] font-bold truncate leading-tight">{photo.title}</p>
                      <p className="text-[8px] opacity-80 mt-0.5 truncate font-sans">عدسة: {photo.submitter}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-amber-900/10">
              <ImageIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-xs font-medium">لا توجد صور معروضة حالياً.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-emerald-800 text-xs font-bold hover:underline mt-1 block mx-auto"
              >
                شارك صورتك الأولى الآن!
              </button>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderVerticalMarquee = () => {
    if (!isTabVisible('gallery')) return null;
    const approvedPhotos = galleryItems.filter(item => item.status === 'approved');
    let marqueeList = [...approvedPhotos];
    if (marqueeList.length > 0) {
      while (marqueeList.length < 16) {
        marqueeList = [...marqueeList, ...approvedPhotos];
      }
    }

    return (
      <div className="bg-amber-50/50 rounded-3xl border border-amber-900/10 p-5 shadow-sm space-y-4 text-right h-[600px] flex flex-col relative overflow-hidden animate-fadeIn" id="home-photo-marquee">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02] pointer-events-none"></div>

        <div className="pb-3 border-b border-amber-900/10 relative z-10 shrink-0">
          <div className="flex items-center gap-1.5 justify-end text-emerald-800 text-xs font-semibold mb-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>لقطات حية (عامودي)</span>
          </div>
          <h3 className="font-extrabold text-sm text-emerald-950">معرض صور بلدة قارة</h3>
          <p className="text-[10px] text-gray-500 mt-0.5 font-sans">
            الصور تتحرك من الأعلى إلى الأسفل. انقر للتكبير والتصفح في معرض الصور.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 w-full py-2 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold rounded-xl text-[10px] shadow-sm hover:shadow transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
          >
            <Camera className="h-3 w-3" />
            <span>أضف صورتك هنا</span>
          </button>
        </div>

        {/* Scrolling area */}
        {approvedPhotos.length > 0 ? (
          <div className="relative flex-grow overflow-hidden rounded-2xl bg-black/5" dir="ltr">
            {/* Fade gradients on top and bottom */}
            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#fdfbf7] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#fdfbf7] to-transparent z-10 pointer-events-none"></div>

            <div className="h-full flex justify-center py-2 overflow-hidden">
              <div className="flex flex-col animate-marquee-v gap-4 hover:[animation-play-state:paused] cursor-pointer">
                {marqueeList.map((photo, index) => (
                  <div
                    key={`${photo.id}-${index}`}
                    onClick={() => {
                      setSelectedImageId(photo.id);
                      setActiveTab('gallery');
                    }}
                    className="w-44 h-32 rounded-xl overflow-hidden border border-amber-900/15 shadow-sm hover:scale-105 hover:border-emerald-700 hover:shadow-md transition-all duration-300 flex-shrink-0 relative group"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover select-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 text-right text-white">
                      <p className="text-[10px] font-bold truncate leading-tight">{photo.title}</p>
                      <p className="text-[8px] opacity-80 mt-0.5 truncate font-sans">عدسة: {photo.submitter}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 flex-grow flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-amber-900/10">
            <ImageIcon className="h-8 w-8 text-gray-300 mb-1" />
            <p className="text-gray-400 text-[10px]">لا توجد صور معروضة.</p>
          </div>
        )}
      </div>
    );
  };

  const rawLinksToRender = homeContent.heroLinks && homeContent.heroLinks.length > 0 
    ? homeContent.heroLinks 
    : [
        { id: 'btn-1', label: "الخدمات الإلكترونية", targetTab: "services", variant: "primary" },
        { id: 'btn-2', label: "استكشف المشاريع التنموية", targetTab: "projects", variant: "secondary" }
      ];

  const linksToRender = rawLinksToRender.filter(link => isTabVisible(link.targetTab));

  const getLinkClass = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'px-6 sm:px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-emerald-950 font-extrabold rounded-2xl shadow-xl hover:shadow-amber-500/25 border border-amber-300/60 transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm text-center cursor-pointer whitespace-nowrap shrink-0';
      case 'secondary':
        return 'px-6 sm:px-8 py-3.5 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white font-extrabold rounded-2xl border border-emerald-500/50 shadow-xl hover:shadow-emerald-900/30 transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm text-center cursor-pointer whitespace-nowrap shrink-0';
      case 'accent':
        return 'px-6 sm:px-8 py-3.5 bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold rounded-2xl shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm text-center cursor-pointer whitespace-nowrap shrink-0';
      case 'royal_dark':
        return 'px-6 sm:px-8 py-3.5 bg-gradient-to-r from-rose-900 via-rose-800 to-red-950 hover:from-rose-800 hover:to-red-900 text-amber-200 font-extrabold rounded-2xl border border-rose-600/50 shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm text-center cursor-pointer whitespace-nowrap shrink-0';
      case 'navy_blue':
        return 'px-6 sm:px-8 py-3.5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 hover:from-blue-800 hover:to-indigo-900 text-white font-extrabold rounded-2xl border border-blue-500/50 shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm text-center cursor-pointer whitespace-nowrap shrink-0';
      case 'purple_violet':
        return 'px-6 sm:px-8 py-3.5 bg-gradient-to-r from-purple-900 via-violet-900 to-indigo-950 hover:from-purple-800 hover:to-violet-800 text-amber-300 font-extrabold rounded-2xl border border-purple-500/50 shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm text-center cursor-pointer whitespace-nowrap shrink-0';
      case 'glass_emerald':
        return 'px-6 sm:px-8 py-3.5 bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-100 font-extrabold rounded-2xl border border-emerald-400/50 backdrop-blur-md shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm text-center cursor-pointer whitespace-nowrap shrink-0';
      case 'dark_charcoal':
        return 'px-6 sm:px-8 py-3.5 bg-stone-900 hover:bg-black text-amber-400 font-extrabold rounded-2xl border border-amber-500/50 shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm text-center cursor-pointer whitespace-nowrap shrink-0';
      case 'gradient_amber_emerald':
        return 'px-6 sm:px-8 py-3.5 bg-gradient-to-r from-amber-500 via-emerald-700 to-emerald-950 hover:from-amber-600 hover:to-emerald-900 text-white font-extrabold rounded-2xl border border-amber-300/50 shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm text-center cursor-pointer whitespace-nowrap shrink-0';
      case 'gradient_rose_amber':
        return 'px-6 sm:px-8 py-3.5 bg-gradient-to-r from-rose-600 via-amber-500 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold rounded-2xl border border-rose-300/50 shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm text-center cursor-pointer whitespace-nowrap shrink-0';
      case 'outline_gold':
        return 'px-6 sm:px-8 py-3.5 bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 font-extrabold rounded-2xl border-2 border-amber-400 backdrop-blur-sm shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm text-center cursor-pointer whitespace-nowrap shrink-0';
      case 'outline_white':
        return 'px-6 sm:px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold rounded-2xl border-2 border-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm text-center cursor-pointer whitespace-nowrap shrink-0';
      default:
        return 'px-6 sm:px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-emerald-950 font-extrabold rounded-2xl shadow-xl hover:shadow-amber-500/25 border border-amber-300/60 transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm text-center cursor-pointer whitespace-nowrap shrink-0';
    }
  };

  const sideBannersEnabled = homeContent.sideBannersEnabled !== false;
  const activeRightBanners = sideBannersEnabled ? (homeContent.sideBanners || []).filter(b => b.enabled && b.position === 'right') : [];
  const activeLeftBanners = sideBannersEnabled ? (homeContent.sideBanners || []).filter(b => b.enabled && b.position === 'left') : [];

  const renderSideBannerCard = (banner: SideBanner) => (
    <div
      key={banner.id}
      className="p-5 rounded-2xl shadow-md border border-amber-900/10 space-y-3 text-right transition-all duration-300 hover:shadow-lg relative overflow-hidden"
      style={{
        backgroundColor: banner.bgColor || '#064e3b',
        color: banner.textColor || '#ffffff'
      }}
    >
      <div className="absolute left-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

      {banner.imageUrl && (
        <div className="w-full h-28 rounded-xl overflow-hidden border border-white/10 shadow-sm">
          <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="space-y-1 relative z-10">
        <h4 className="font-extrabold text-sm sm:text-base leading-snug">{banner.title}</h4>
        <p className="text-xs opacity-90 font-sans leading-relaxed whitespace-pre-line">{banner.content}</p>
      </div>

      {banner.buttonLabel && banner.buttonLinkTab && isTabVisible(banner.buttonLinkTab) && (
        <button
          type="button"
          onClick={() => {
            if (banner.buttonLinkTab === 'live_stream') {
              if (onOpenLiveStream) onOpenLiveStream();
            } else {
              setActiveTab(banner.buttonLinkTab!);
            }
          }}
          className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
        >
          <span>{banner.buttonLabel}</span>
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const renderHeroIcon = (iconName?: string, targetTab?: string) => {
    const name = iconName || targetTab;
    switch (name) {
      case 'Building2':
      case 'services':
        return <Building2 className="h-4 w-4 shrink-0" />;
      case 'Briefcase':
      case 'projects':
      case 'citizens':
        return <Briefcase className="h-4 w-4 shrink-0" />;
      case 'Newspaper':
      case 'news':
        return <Newspaper className="h-4 w-4 shrink-0" />;
      case 'ImageIcon':
      case 'gallery':
        return <ImageIcon className="h-4 w-4 shrink-0" />;
      case 'BookOpen':
      case 'directory':
        return <BookOpen className="h-4 w-4 shrink-0" />;
      case 'HelpCircle':
      case 'survey':
        return <HelpCircle className="h-4 w-4 shrink-0" />;
      case 'Building':
      case 'qara_city':
        return <Building className="h-4 w-4 shrink-0" />;
      case 'Sparkles':
      case 'landmarks':
        return <Sparkles className="h-4 w-4 shrink-0" />;
      case 'FileText':
        return <FileText className="h-4 w-4 shrink-0" />;
      case 'Compass':
        return <Compass className="h-4 w-4 shrink-0" />;
      case 'Cherry':
      case 'cherry':
        return <Cherry className="h-4 w-4 shrink-0 text-rose-500" />;
      case 'UserCheck':
      case 'User':
      case 'citizen_auth':
      case 'citizen_portal':
        return <UserCheck className="h-4 w-4 shrink-0 text-amber-400" />;
      case 'Video':
      case 'Radio':
      case 'Tv':
      case 'live_stream':
        return <Video className="h-4 w-4 shrink-0 text-rose-300 animate-pulse" />;
      default:
        return <ChevronLeft className="h-4 w-4 shrink-0" />;
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-[#fdfbf7] overflow-x-clip">
      
      {/* Hero Section - Sleeker Compact Height */}
      <section className="relative min-h-[460px] md:h-[480px] py-10 w-full overflow-hidden flex items-center justify-center text-white">
        {/* Background Image with Fallback */}
        <div className="absolute inset-0">
          <img 
            src={homeContent.heroImage || heroBanner} 
            alt="مدينة قارة الأثرية في جبال القلمون" 
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback if local image has load problems
              (e.target as HTMLImageElement).src = "https://picsum.photos/seed/qara_mountains/1920/1080?brightness=80";
            }}
          />
          {/* Subtle vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b2b1d] via-[#102013]/60 to-[#0e1610]/40" />
        </div>

        {/* Local Council Logo Overlay */}
        {homeContent.councilLogo && (
          <div 
            style={{
              backgroundColor: homeContent.councilLogoBgColor === 'transparent' ? 'transparent' : (homeContent.councilLogoBgColor || 'transparent'),
              width: `${homeContent.councilLogoWidth || 80}px`,
            }}
            className={`absolute z-20 p-2 rounded-xl backdrop-blur-xs flex items-center justify-center transition-all ${
              homeContent.councilLogoBgColor && homeContent.councilLogoBgColor !== 'transparent' ? 'shadow-lg border border-white/10' : ''
            } ${
              homeContent.councilLogoPosition === 'top_left'
                ? 'top-4 left-4'
                : homeContent.councilLogoPosition === 'top_center'
                ? 'top-4 left-1/2 -translate-x-1/2'
                : 'top-4 right-4'
            }`}
          >
            <img 
              src={homeContent.councilLogo} 
              alt="شعار المجلس المحلي" 
              className="w-full h-auto object-contain max-h-[70px]" 
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Visual Identity Logo Overlay */}
        {homeContent.identityLogo && (
          <div 
            style={{
              backgroundColor: homeContent.identityLogoBgColor === 'transparent' ? 'transparent' : (homeContent.identityLogoBgColor || 'transparent'),
              width: `${homeContent.identityLogoWidth || 80}px`,
            }}
            className={`absolute z-20 p-2 rounded-xl backdrop-blur-xs flex items-center justify-center transition-all ${
              homeContent.identityLogoBgColor && homeContent.identityLogoBgColor !== 'transparent' ? 'shadow-lg border border-white/10' : ''
            } ${
              homeContent.identityLogoPosition === 'top_left'
                ? 'top-4 left-4'
                : homeContent.identityLogoPosition === 'top_center'
                ? 'top-4 left-1/2 -translate-x-1/2'
                : 'top-4 right-4'
            }`}
          >
            <img 
              src={homeContent.identityLogo} 
              alt="شعار الهوية البصرية للموقع" 
              className="w-full h-auto object-contain max-h-[70px]" 
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-4 text-center z-10 flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-900/80 backdrop-blur-sm border border-emerald-500/30 text-amber-300 text-xs mb-5 font-medium"
          >
            <MapPin className="h-3.5 w-3.5 text-amber-400" />
            <span>{homeContent.heroBadge}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight mb-3 font-sans text-white leading-tight drop-shadow-md text-center"
          >
            {homeContent.heroTitle}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-emerald-100 max-w-2xl mb-6 leading-relaxed font-light font-sans text-center"
          >
            {homeContent.heroDescription}
          </motion.p>

          {/* Dynamic Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap gap-3 sm:gap-4 justify-center items-center w-full max-w-4xl px-2"
          >
            {linksToRender.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  if (link.targetTab === 'live_stream') {
                    if (onOpenLiveStream) onOpenLiveStream();
                  } else if (link.targetTab === 'citizen_auth' || link.targetTab === 'citizen_portal' || link.targetTab === 'citizen_login') {
                    if (onOpenCitizenAuth) onOpenCitizenAuth();
                  } else {
                    setActiveTab(link.targetTab === 'citizens' ? 'projects' : link.targetTab);
                  }
                }}
                className={`${getLinkClass(link.variant)} flex-1 min-w-[200px] sm:min-w-[220px] max-w-full flex items-center justify-center gap-2.5 whitespace-nowrap`}
              >
                {renderHeroIcon((link as any).iconName, link.targetTab)}
                <span className="whitespace-nowrap">{link.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Live Damascus Time widget */}
          {currentTime && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.6 }}
              className="mt-10 px-5 py-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2.5 text-xs font-mono text-emerald-200"
            >
              <Clock className="h-4 w-4 text-amber-400 animate-spin-slow" />
              <span>التوقيت المحلي لمدينة قارة الآن:</span>
              <span className="text-amber-300 font-bold">{currentTime}</span>
            </motion.div>
          )}

        </div>
      </section>

      {/* Simulated Call Alert */}
      {simulatedCall && (
        <div className="fixed bottom-5 left-5 right-5 md:left-auto md:right-5 md:max-w-md z-50 bg-emerald-900 border border-amber-400 text-amber-200 p-4 rounded-2xl shadow-2xl flex items-start gap-3 animate-slideIn">
          <div className="p-2 bg-amber-500 text-emerald-950 rounded-xl">
            <PhoneCall className="h-5 w-5 animate-pulse" />
          </div>
          <div className="text-right">
            <h4 className="font-bold text-sm text-white">محاكاة خط الهاتف</h4>
            <p className="text-xs mt-1 text-emerald-100 leading-relaxed">{simulatedCall}</p>
          </div>
        </div>
      )}

      {/* Key Stats Section */}
      <section className="relative -mt-16 z-20 max-w-6xl mx-auto px-4">
        <div 
          className="rounded-3xl shadow-xl border border-amber-900/5 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center transition-all duration-300"
          style={{
            backgroundColor: homeContent.statsBgColor || '#ffffff',
            paddingTop: `${homeContent.statsHeight !== undefined ? homeContent.statsHeight : 12}px`,
            paddingBottom: `${homeContent.statsHeight !== undefined ? homeContent.statsHeight : 12}px`,
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          {homeContent.stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-2 rounded-xl bg-black/[0.01] border border-amber-900/5 hover:border-emerald-700/10 transition-all duration-300">
              <span 
                className="font-extrabold mb-0.5 leading-none"
                style={{ 
                  color: homeContent.statsValueColor || '#064e3b',
                  fontSize: `${(homeContent.statsFontSize || 12) * 1.7}px`
                }}
              >
                {stat.value}
              </span>
              <span 
                className="font-semibold font-sans leading-tight"
                style={{ 
                  color: homeContent.statsLabelColor || '#6b7280',
                  fontSize: `${homeContent.statsFontSize || 12}px`
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Visitor Counter: Below Hero Position */}
      {homeContent.visitorCounterPosition === 'below_hero' && renderVisitorCounter()}

      {/* News Ticker (الشريط الإخباري) */}
      {homeContent.tickerEnabled !== false && (
        <div className="max-w-7xl mx-auto px-4 my-6 z-30 relative">
          <div 
            className="w-full border shadow-sm overflow-hidden flex items-center rounded-2xl transition-all duration-300"
            dir="rtl"
            style={{
              backgroundColor: homeContent.tickerBgColor || '#022c22',
              borderColor: 'rgba(251, 191, 36, 0.15)',
              fontSize: `${homeContent.tickerFontSize || 13}px`,
              color: homeContent.tickerTextColor || '#fcd34d'
            }}
          >
            {/* Static Title Box */}
            <div 
              className={`flex shrink-0 z-20 px-4 py-2 font-extrabold items-center gap-1.5 shadow-lg select-none ${
                (homeContent.tickerTitlePosition || 'left') === 'right' ? 'order-first' : 'order-last'
              }`}
              style={{
                backgroundColor: homeContent.tickerTitleBgColor || '#f59e0b',
                color: homeContent.tickerTitleTextColor || '#022c22'
              }}
            >
              <span 
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: homeContent.tickerTitleTextColor || '#022c22' }}
              ></span>
              <span className="whitespace-nowrap font-sans text-xs sm:text-sm">
                {homeContent.tickerTitle || 'آخر الأخبار'}
              </span>
            </div>

            {/* Scrolling News Container */}
            <div className="flex-grow overflow-hidden flex items-center order-1" dir="ltr">
              <div 
                className={`flex items-center gap-12 whitespace-nowrap select-none hover:[animation-play-state:paused] ${
                  (homeContent.tickerDirection || 'rtl') === 'rtl' ? 'animate-ticker-rtl' : 'animate-ticker-ltr'
                }`}
              >
                {(() => {
                  const items = (homeContent.tickerSourceFromNewsTab && newsList && newsList.length > 0)
                    ? newsList.map(n => ({ id: n.id, title: n.title, clickable: true }))
                    : (homeContent.tickerCustomItems || []).map((t, idx) => ({ id: `custom-${idx}`, title: t, clickable: false }));

                  const finalItems = items.length > 0 ? items : [
                    { id: 'fallback-1', title: 'بلدية قارة ترحب بكم في البوابة الخدمية الجديدة لمواطنينا الأعزاء.', clickable: false }
                  ];

                  // Duplicate items twice for infinite loop
                  const doubled = [...finalItems, ...finalItems];

                  return doubled.map((item, idx) => (
                    <div 
                      key={`${item.id}-${idx}`} 
                      className="flex items-center gap-2 cursor-pointer text-right"
                      dir="rtl"
                      onClick={() => {
                        if (item.clickable && !item.id.startsWith('custom-')) {
                          localStorage.setItem('selected_news_id', item.id);
                          setActiveTab('news');
                        }
                      }}
                    >
                      <span className="text-amber-400 font-bold">✦</span>
                      <span className={`${item.clickable && !item.id.startsWith('custom-') ? 'hover:underline hover:text-white transition-all font-bold' : 'font-medium'}`}>
                        {item.title}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic LTR/TTB Styles for the Marquee */}
      <style>{`
        @keyframes marqueeLtr {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes marqueeTtb {
          0% { transform: translate3d(0, -50%, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes tickerRtl {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes tickerLtr {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-ticker-rtl {
          display: flex;
          width: max-content;
          animation: tickerRtl 35s linear infinite;
        }
        .animate-ticker-ltr {
          display: flex;
          width: max-content;
          animation: tickerLtr 35s linear infinite;
        }
        .animate-ticker-rtl:hover, .animate-ticker-ltr:hover {
          animation-play-state: paused;
        }
        .animate-marquee-h {
          display: flex;
          width: max-content;
          animation: marqueeLtr 25s linear infinite;
        }
        .animate-marquee-v {
          display: flex;
          flex-direction: column;
          height: max-content;
          animation: marqueeTtb 25s linear infinite;
        }
      `}</style>

      {/* Main Layout Area with Side Banners in Outer Margins */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">

        {/* Right Side Banners (Positioned in Outer Right Margin on XL/2XL Screens) */}
        {activeRightBanners.length > 0 && (
          <aside className="hidden xl:block absolute top-8 -right-60 2xl:-right-68 w-56 2xl:w-64 space-y-4 z-20">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200/60 text-right">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-extrabold text-emerald-950">إعلانات جانبية (يمين)</span>
            </div>
            {activeRightBanners.map(renderSideBannerCard)}
          </aside>
        )}

        {/* Left Side Banners (Positioned in Outer Left Margin on XL/2XL Screens) */}
        {activeLeftBanners.length > 0 && (
          <aside className="hidden xl:block absolute top-8 -left-60 2xl:-left-68 w-56 2xl:w-64 space-y-4 z-20">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200/60 text-right">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-800"></span>
              <span className="text-xs font-extrabold text-emerald-950">إعلانات جانبية (يسار)</span>
            </div>
            {activeLeftBanners.map(renderSideBannerCard)}
          </aside>
        )}

        {/* Mobile & Small Screen Side Banners Grid (xl:hidden) */}
        {(activeRightBanners.length > 0 || activeLeftBanners.length > 0) && (
          <div className="xl:hidden mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...activeRightBanners, ...activeLeftBanners].map(renderSideBannerCard)}
          </div>
        )}

        {/* Center Main Content Area - Unaltered Original Centered Width & Hierarchy */}
        <div className="w-full">
          <div className={`flex flex-col ${isSidebar ? (isSidebarLeft ? 'lg:flex-row' : 'lg:flex-row-reverse') : ''} gap-8`}>
            
            {/* Main Column */}
            <div className={`flex-grow space-y-12 ${isSidebar ? 'w-full lg:max-w-[calc(100%-22rem)]' : 'w-full'}`}>

              {(() => {
                const renderIntroColumn = () => (
                  <div className="space-y-6 text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-sm font-semibold border border-emerald-100">
                      <Info className="h-4 w-4 text-emerald-600" />
                      <span>نبذة تعريفية</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 leading-tight">
                      {homeContent.introTitle}
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                      {homeContent.introText}
                    </p>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                      {homeContent.originText}
                    </p>

                    <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-900/5 flex items-start gap-4 flex-row-reverse text-right">
                      <div className="p-3 bg-emerald-800 text-amber-100 rounded-xl shadow-md shrink-0">
                        <Award className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950 text-md">{homeContent.awardTitle}</h4>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {homeContent.awardText}
                        </p>
                      </div>
                    </div>
                  </div>
                );

                const renderAgricultureCard = () => (
                  <div 
                    className="rounded-3xl p-8 relative overflow-hidden shadow-xl border text-right space-y-6 transition-all duration-300"
                    style={{ 
                      backgroundColor: homeContent.agricultureBgColor || '#064e3b',
                      borderColor: homeContent.agricultureSubBorderColor || '#065f46',
                      fontFamily: homeContent.agricultureFontFamily ? `${homeContent.agricultureFontFamily}, var(--font-sans), sans-serif` : undefined,
                      fontSize: homeContent.agricultureFontSize ? `${homeContent.agricultureFontSize}px` : undefined,
                      fontStyle: homeContent.agricultureFontStyle || 'normal'
                    }}
                  >
                    <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-16 -mb-16"></div>
                    
                    <div className="flex items-center gap-2 justify-end">
                      <span 
                        className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-black/20"
                        style={{ color: homeContent.agricultureTitleColor || '#fbbf24' }}
                      >
                        الزراعة والتراث الطبيعي
                      </span>
                      <Sprout className="h-5 w-5" style={{ color: homeContent.agricultureTitleColor || '#fbbf24' }} />
                    </div>

                    <h3 
                      className="text-2xl text-white" 
                      style={{ 
                        color: homeContent.agricultureTitleColor || '#fbbf24',
                        fontWeight: homeContent.agricultureFontWeight === 'normal' ? '400' : homeContent.agricultureFontWeight === 'medium' ? '500' : homeContent.agricultureFontWeight === 'extrabold' ? '800' : '700'
                      }}
                    >
                      {homeContent.agricultureTitle}
                    </h3>
                    
                    <p 
                      className="text-sm leading-relaxed" 
                      style={{ color: homeContent.agricultureTextColor || '#ecfdf5' }}
                    >
                      {homeContent.agricultureText}
                    </p>

                    {/* Crops list */}
                    <div className="space-y-4 pt-2">
                      {homeContent.agricultureCrops && homeContent.agricultureCrops.map((crop, index) => (
                        <div 
                          key={index} 
                          className="flex gap-3 items-start flex-row-reverse text-right p-3.5 rounded-xl border transition-all hover:scale-[1.01]"
                          style={{ 
                            backgroundColor: homeContent.agricultureSubBgColor || 'rgba(2, 44, 34, 0.4)',
                            borderColor: homeContent.agricultureSubBorderColor || 'rgba(6, 78, 59, 0.4)'
                          }}
                        >
                          {crop.symbol ? (
                            <span className="text-lg shrink-0 mt-0.5 select-none" title="علامة المحصول">{crop.symbol}</span>
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div>
                          )}
                          <div className="w-full">
                            <h5 
                              className="font-bold text-sm" 
                              style={{ color: homeContent.agricultureCropTitleColor || '#fcd34d' }}
                            >
                              {crop.name}
                            </h5>
                            <p 
                              className="text-xs mt-0.5 leading-relaxed" 
                              style={{ color: homeContent.agricultureCropDescColor || 'rgba(209, 250, 229, 0.8)' }}
                            >
                              {crop.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );

                const renderHeritageSection = () => (
                  <section key="heritage" className={isSidebar ? sectionClass : getDynamicPadding("bg-amber-50/60 border-y border-amber-900/5 py-16 sm:py-24")}>
                    <div className={isSidebar ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
                      
                      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider">
                          <BookOpen className="h-4 w-4" />
                          <span>المعالم والآثار التاريخية</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">{homeContent.heritageTitle}</h2>
                        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                          {homeContent.heritageDescription}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        
                        {/* Left Column: Selector Menu (Displaying top 4 landmarks) */}
                        <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
                          {(homeContent.heritagePoints || []).slice(0, 4).map((item, idx) => {
                            const isSelected = selectedHeritage === idx;
                            const activeBg = homeContent.heritageActiveBgColor || '#065f46';
                            const activeText = homeContent.heritageActiveTextColor || '#ffffff';
                            const inactiveBg = homeContent.heritageInactiveBgColor || '#ffffff';
                            const inactiveText = homeContent.heritageInactiveTextColor || '#374151';

                            return (
                              <button
                                key={item.id || idx}
                                onClick={() => setSelectedHeritage(idx)}
                                className="w-full text-right p-4 rounded-2xl transition-all duration-300 border flex items-center justify-between gap-4 cursor-pointer shadow-sm hover:scale-[1.01]"
                                style={{
                                  backgroundColor: isSelected ? activeBg : inactiveBg,
                                  color: isSelected ? activeText : inactiveText,
                                  borderColor: isSelected ? activeBg : 'rgba(229, 231, 235, 1)',
                                }}
                              >
                                <ChevronLeft 
                                  className="h-5 w-5 shrink-0 transition-all"
                                  style={{ color: isSelected ? activeText : 'rgba(156, 163, 175, 1)' }}
                                />
                                <div className="flex flex-col text-right">
                                  <span className="font-bold text-sm sm:text-base">{item.title}</span>
                                  {item.period && (
                                    <span className="text-[10px] opacity-80 mt-0.5">{item.period}</span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Right Column: Detailed View */}
                        <div className="lg:col-span-8">
                          {(homeContent.heritagePoints || []).slice(0, 4)[selectedHeritage] && (() => {
                            const currentItem = (homeContent.heritagePoints || []).slice(0, 4)[selectedHeritage];
                            const contentBg = homeContent.heritageContentBgColor || '#ffffff';
                            const contentText = homeContent.heritageContentTextColor || '#4b5563';
                            const contentTitle = homeContent.heritageContentTitleColor || '#022c22';

                            return (
                              <div 
                                className="h-full rounded-3xl p-6 sm:p-10 shadow-md border border-amber-900/5 text-right flex flex-col justify-between relative overflow-hidden transition-all duration-300"
                                style={{
                                  backgroundColor: contentBg,
                                  borderColor: 'rgba(217, 119, 6, 0.08)'
                                }}
                              >
                                {/* Visual Accent */}
                                <div className="absolute left-0 bottom-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                  {/* Left: Optional Landmark Image */}
                                  {currentItem.image && (
                                    <div 
                                      onClick={() => handleImageClick(currentItem)}
                                      className="md:col-span-5 w-full h-48 md:h-64 rounded-2xl overflow-hidden relative shadow-md border border-gray-100 group cursor-pointer"
                                      title="اضغط لعرض وتكبير هذه الصورة في ألبوم صور بلدة قارة"
                                    >
                                      <img
                                        src={currentItem.image}
                                        alt={currentItem.title}
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                      />
                                      {/* Modern hover overlay */}
                                      <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white gap-2 pointer-events-none backdrop-blur-[2px]">
                                        <ImageIcon className="h-7 w-7 text-amber-400 animate-pulse" />
                                        <span className="text-xs font-bold bg-emerald-900/80 px-2.5 py-1 rounded-full border border-emerald-700/50">عرض وتكبير في ألبوم الصور</span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Right: Content details */}
                                  <div className={currentItem.image ? "md:col-span-7 space-y-4" : "md:col-span-12 space-y-4"}>
                                    <div className="flex items-center gap-2 justify-end flex-wrap">
                                      {currentItem.period && (
                                        <span className="text-xs px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full font-bold">{currentItem.period}</span>
                                      )}
                                      {currentItem.location && (
                                        <span className="text-xs px-2.5 py-0.5 bg-sky-100 text-sky-900 rounded-full font-bold">📍 {currentItem.location}</span>
                                      )}
                                      <span className="text-xs px-3 py-1 bg-amber-100/80 text-amber-900 rounded-full font-bold">معلم أثري رئيسي</span>
                                      <span className="text-xs font-mono opacity-80" style={{ color: contentText }}>الرمز الأثري #{selectedHeritage + 1}</span>
                                    </div>

                                    <h3 className="text-2xl sm:text-3xl font-extrabold" style={{ color: contentTitle }}>
                                      {currentItem.title}
                                    </h3>

                                    <p className="text-base sm:text-lg leading-relaxed font-sans line-clamp-3" style={{ color: contentText }}>
                                      {currentItem.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between flex-row-reverse gap-4 flex-wrap">
                                  <div className="flex items-center gap-2 text-xs" style={{ color: contentText }}>
                                    <span>متاح لزيارة السياح والمهتمين بالأبحاث التاريخية</span>
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                  </div>
                                  
                                  <button 
                                    type="button"
                                    onClick={() => setSelectedLandmarkModal(currentItem)}
                                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                                  >
                                    <FileText className="h-4 w-4 text-amber-400" />
                                    <span>عرض الأخبار والشرح الكامل للمعلم</span>
                                    <ArrowRightLeft className="h-3 w-3 inline rotate-180" />
                                  </button>
                                </div>

                              </div>
                            );
                          })()}
                        </div>

                      </div>

                    </div>
                  </section>
                );

                const renderEmergencySection = () => (
                  <section key="emergency" id="emergency-section" className={isSidebar ? "py-8" : getDynamicPadding("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24")}>
                    <div className={`bg-white rounded-3xl border border-amber-900/10 relative overflow-hidden ${isSidebar ? 'p-6 shadow-sm' : 'p-8 sm:p-12 shadow-md'}`}>
                      {/* Subtle gold grid effect */}
                      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.02]"></div>
                      
                      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        {/* Info Col */}
                        <div className="lg:col-span-4 space-y-4 text-right">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-semibold border border-red-100">
                            <ShieldAlert className="h-4 w-4 animate-pulse" />
                            <span>دليل الطوارئ والاتصال</span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">{homeContent.emergencyTitle}</h2>
                          <p className="text-gray-500 text-sm leading-relaxed font-sans">
                            {homeContent.emergencyDescription}
                          </p>
                          
                          <div className="pt-4 flex flex-col gap-2 border-t border-gray-100">
                            <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                              <span>يرجى استخدام الأرقام للمطالب الطارئة والخدمية</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            </div>
                            <div className="text-xs text-gray-400 flex items-center justify-end gap-1">
                              <span>رمز الاتصال الهاتفي لرياف دمشق هو (011)</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            </div>
                          </div>
                        </div>

                        {/* Contacts Grid Col */}
                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {homeContent.emergencyContacts.map((contact, idx) => {
                            const IconComponent = contactIconMap[contact.iconName] || HelpCircle;
                            return (
                              <div 
                                key={idx} 
                                className="p-5 rounded-2xl bg-[#fdfbf7] border border-amber-900/5 hover:border-emerald-700/20 transition-all duration-300 text-right flex flex-col justify-between"
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between flex-row-reverse">
                                    <div className={`p-2.5 rounded-xl border ${getContactColor(contact.iconName)}`}>
                                      <IconComponent className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full" dir="ltr">
                                      {contact.number}
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">{contact.name}</h4>
                                  <p className="text-xs text-gray-500 leading-relaxed font-sans">{contact.role}</p>
                                </div>

                                <button 
                                  onClick={() => handleCallSimulation(contact.name, contact.number)}
                                  className="mt-5 w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <PhoneCall className="h-3.5 w-3.5" />
                                  اتصال سريع بالدائرة
                                </button>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    </div>
                  </section>
                );

                const activeSectionOrder = (homeContent.homeSectionOrder && homeContent.homeSectionOrder.length > 0)
                  ? homeContent.homeSectionOrder
                  : ['intro_agriculture', 'heritage', 'emergency', 'photo_marquee'];

                return activeSectionOrder.map((sectionKey) => {
                  if (sectionKey === 'intro_agriculture') {
                    return (
                      <section key="intro_agriculture" className={sectionClass}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                          <div className="lg:col-span-7">
                            {renderIntroColumn()}
                          </div>
                          <div className="lg:col-span-5">
                            {renderAgricultureCard()}
                          </div>
                        </div>
                      </section>
                    );
                  }
                  if (sectionKey === 'intro') {
                    return (
                      <section key="intro" className={sectionClass}>
                        {renderIntroColumn()}
                      </section>
                    );
                  }
                  if (sectionKey === 'agriculture') {
                    return (
                      <section key="agriculture" className={sectionClass}>
                        {renderAgricultureCard()}
                      </section>
                    );
                  }
                  if (sectionKey === 'heritage') {
                    return renderHeritageSection();
                  }
                  if (sectionKey === 'emergency') {
                    return renderEmergencySection();
                  }
                  if (sectionKey === 'photo_marquee') {
                    return !isSidebar ? <React.Fragment key="photo_marquee">{renderHorizontalMarquee()}</React.Fragment> : null;
                  }
                  return null;
                });
              })()}

            </div>

            {/* Sidebar Column (Vertical Marquee) */}
            {isSidebar && (
              <aside className="w-full lg:w-80 shrink-0 self-start">
                {renderVerticalMarquee()}
              </aside>
            )}

          </div>
        </div>

      </div>

      {/* Dynamic Visitor Counter: Below Gallery Position (Default) */}
      {(!homeContent.visitorCounterPosition || homeContent.visitorCounterPosition === 'below_gallery') && renderVisitorCounter()}

      {/* Upload Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-amber-900/10 text-right"
          >
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white p-6 relative">
              <h3 className="text-xl font-bold">شارك لقطتك لمدينة قارة</h3>
              <p className="text-emerald-100/80 text-xs mt-1 font-sans">
                املأ البيانات وأرفق صورتك لتشاركها مع أهالي قارة في ألبوم البلدة التفاعلي
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 left-6 text-emerald-100 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-emerald-955/20 flex items-center justify-center cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {submitSuccess ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">تم استلام صورتك بنجاح!</h4>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed font-sans">
                    نشكرك على مشاركتك القيمة. ستخضع صورتك لمراجعة من قبل الإدارة، وسيتم نشرها في المعرض العام مباشرة بعد الموافقة عليها.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitPhoto} className="space-y-5">
                  
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">اسم المشارك (الاسم الكريم)</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: محمد القاري"
                      value={submitterName}
                      onChange={(e) => setSubmitterName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-right"
                    />
                  </div>

                  {/* Photo Title field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">عنوان أو وصف اللقطة</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: بساتين الكرز في قارة"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-right"
                    />
                  </div>

                  {/* Image Options Selection */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-gray-700">اختر طريقة إرفاق الصورة</label>
                    
                    {/* Presets Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPresetIndex(idx);
                            setCustomFile("");
                            setPhotoUrl("");
                          }}
                          className={`relative h-20 rounded-xl overflow-hidden border-2 text-right transition-all cursor-pointer ${
                            presetIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-transparent opacity-80'
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                            <span className="text-[10px] text-white font-bold leading-tight line-clamp-2">{preset.name}</span>
                          </div>
                          {presetIndex === idx && (
                            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-emerald-950 text-[10px] font-bold flex items-center justify-center">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Separator line */}
                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-gray-100"></div>
                      <span className="flex-shrink mx-4 text-xs text-gray-400 font-sans">أو ارفع صورتك الخاصة</span>
                      <div className="flex-grow border-t border-gray-100"></div>
                    </div>

                    {/* File Upload Field */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-center w-full">
                        <label
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-gray-50 transition-all duration-200 relative ${
                            isDragActive 
                              ? 'border-amber-500 bg-amber-50/30 ring-4 ring-amber-500/10' 
                              : customFile 
                                ? 'border-emerald-500 bg-emerald-50/10' 
                                : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-5 px-4 text-center">
                            <Upload className={`h-7 w-7 mb-1.5 transition-all ${
                              isDragActive 
                                ? 'text-amber-600 scale-110' 
                                : customFile 
                                  ? 'text-emerald-600 animate-bounce' 
                                  : 'text-gray-400 group-hover:text-gray-500'
                            }`} />
                            <p className="text-xs text-gray-500 font-sans">
                              {isDragActive 
                                ? 'أفلت الصورة هنا الآن!' 
                                : customFile 
                                  ? 'تم تحميل صورتك بنجاح! جاهزة للمراجعة والاعتماد' 
                                  : 'اسحب وأفلت صورتك هنا، أو انقر للتصفح من جهازك'}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1 font-sans">
                              صيغ الصور المدعومة: PNG, JPG, JPEG
                            </p>
                          </div>
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>

                      {uploadError && (
                        <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 font-sans text-right" dir="rtl">
                          {uploadError}
                        </div>
                      )}
                      
                      {customFile && (
                        <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 flex-row-reverse">
                          <span className="font-sans">تم تجهيز الصورة بنجاح للمزامنة المحلية</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomFile("");
                              setPresetIndex(0);
                            }}
                            className="text-red-500 hover:underline font-bold cursor-pointer"
                          >
                            حذف
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Image URL fallback input */}
                    <div className="pt-1">
                      <label className="block text-[11px] text-gray-500 mb-1 font-sans">أو أدخل رابط الصورة المباشر من الإنترنت (URL)</label>
                      <input
                        type="url"
                        placeholder="https://example.com/my-image.jpg"
                        value={photoUrl}
                        onChange={(e) => {
                          setPhotoUrl(e.target.value);
                          setPresetIndex(null);
                          setCustomFile("");
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-600 outline-none text-xs text-left"
                        dir="ltr"
                      />
                    </div>

                  </div>

                  {/* Submission Button */}
                  <div className="pt-4 flex gap-3 flex-row-reverse">
                    <button
                      type="submit"
                      className="flex-grow py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-sm font-sans"
                    >
                      إرسال للمراجعة والقبول
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all duration-200 cursor-pointer text-sm font-sans"
                    >
                      إلغاء
                    </button>
                  </div>

                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Dynamic Visitor Counter: Above Footer Position */}
      {homeContent.visitorCounterPosition === 'above_footer' && renderVisitorCounter()}

      {/* Landmark Full Explanation & Related News Modal */}
      {selectedLandmarkModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          dir="rtl"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLandmarkModal(null);
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-900/10 text-right"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white p-5 sm:p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-400 text-emerald-950 rounded-2xl shrink-0 shadow-sm">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold">{selectedLandmarkModal.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-amber-200">
                    {selectedLandmarkModal.period && <span>🏛️ {selectedLandmarkModal.period}</span>}
                    {selectedLandmarkModal.location && <span>📍 {selectedLandmarkModal.location}</span>}
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setSelectedLandmarkModal(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all cursor-pointer shrink-0"
                title="إغلاق النافذة"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
              
              {/* Optional Landmark Image */}
              {selectedLandmarkModal.image && (
                <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden relative shadow-md border border-gray-100 group">
                  <img
                    src={selectedLandmarkModal.image}
                    alt={selectedLandmarkModal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div 
                    onClick={() => {
                      const item = selectedLandmarkModal;
                      setSelectedLandmarkModal(null);
                      handleImageClick(item);
                    }}
                    className="absolute bottom-3 right-3 bg-emerald-950/80 hover:bg-emerald-900 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-400/30 backdrop-blur-xs flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>عرض الصورة بحجم مكبّر في معرض الصور</span>
                  </div>
                </div>
              )}

              {/* Excerpt/Summary Section */}
              <div className="bg-amber-50/70 border border-amber-200/60 p-4 sm:p-5 rounded-2xl space-y-1.5">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  النبذة التعريفية بالموقع:
                </span>
                <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                  {selectedLandmarkModal.description}
                </p>
              </div>

              {/* Customizable Historical Documentation / References Section */}
              <div className="space-y-3 bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                <h4 className="text-base font-extrabold text-emerald-950 flex items-center gap-2 border-b border-gray-200 pb-2">
                  <BookOpen className="h-5 w-5 text-emerald-700" />
                  {selectedLandmarkModal.docsSectionTitle || 'التوثيق والشرح التاريخي والمراجع المعتمدة'}
                </h4>
                <div className="text-sm sm:text-base text-gray-700 leading-loose font-sans whitespace-pre-line">
                  {selectedLandmarkModal.docsSectionContent || selectedLandmarkModal.fullExplanation || selectedLandmarkModal.description}
                </div>
              </div>

              {/* Additional Landmark Images Gallery (Under References) */}
              {selectedLandmarkModal.showAdditionalImages !== false && 
               (selectedLandmarkModal.additionalImages || []).length > 0 && (
                <div className="space-y-3 bg-amber-50/50 p-5 rounded-2xl border border-amber-200/60">
                  <h4 className="text-sm sm:text-base font-extrabold text-emerald-950 flex items-center justify-between border-b border-amber-200/50 pb-2">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-amber-700" />
                      <span>معرض الصور الإضافية والاستكشافية للمعلم</span>
                    </span>
                    <span className="text-xs text-amber-900 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {(selectedLandmarkModal.additionalImages || []).length} صور
                    </span>
                  </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                    {(selectedLandmarkModal.additionalImages || []).map((extraImg, imgIdx) => {
                      const isMainImage = extraImg === selectedLandmarkModal.image;
                      return (
                        <div 
                          key={imgIdx} 
                          onClick={() => {
                            const tempItem = {
                              id: `extra_${imgIdx}`,
                              title: `${selectedLandmarkModal.title} - صورة ${imgIdx + 1}`,
                              category: 'آثار',
                              imageUrl: extraImg,
                              submitter: 'قسم الآثار والتوثيق',
                              description: selectedLandmarkModal.title,
                              date: new Date().toLocaleDateString('ar-SA'),
                              likes: 0,
                              status: 'approved' as const
                            };
                            setSelectedLandmarkModal(null);
                            handleImageClick(tempItem);
                          }}
                          className="h-28 rounded-xl overflow-hidden border border-gray-200 shadow-2xs group relative cursor-pointer bg-white"
                          title="اضغط للتكبير والعرض بالحجم الكامل في المعرض"
                        >
                          <img 
                            src={extraImg} 
                            alt={`صورة ${imgIdx + 1} - ${selectedLandmarkModal.title}`} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          {isMainImage && (
                            <span className="absolute top-1.5 right-1.5 bg-amber-500 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                              الرئيسية ⭐
                            </span>
                          )}
                          <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-[1px]">
                            <Maximize2 className="h-5 w-5 text-amber-400" />
                            <span className="text-[10px] font-bold">تكبير الصورة</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Banner */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center gap-4">
              <span className="text-xs text-gray-600 font-bold font-sans">
                {selectedLandmarkModal.modalFooterText || homeContent?.landmarkModalFooterText || 'منصة بوابة قارة - قسم التوثيق التاريخي والآثار'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedLandmarkModal(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-xs transition-all cursor-pointer shrink-0"
              >
                إغلاق النافذة
              </button>
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
}

