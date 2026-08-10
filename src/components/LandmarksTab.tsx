import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Sparkles, 
  BookOpen, 
  Newspaper, 
  ChevronLeft, 
  ArrowRightLeft, 
  X, 
  MapPin, 
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  FileText,
  Video,
  Film,
  ExternalLink,
  FileSearch,
  Maximize2
} from 'lucide-react';
import { HomeContent, HeritagePoint, News, GalleryItem } from '../types';

interface LandmarksTabProps {
  homeContent: HomeContent;
  newsList: News[];
  galleryItems: GalleryItem[];
  setActiveTab: (tab: string) => void;
  setSelectedImageId?: (id: string | null) => void;
}

export default function LandmarksTab({
  homeContent,
  newsList = [],
  galleryItems = [],
  setActiveTab,
  setSelectedImageId
}: LandmarksTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [activeModalLandmark, setActiveModalLandmark] = useState<HeritagePoint | null>(null);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);

  const heritagePoints = homeContent.heritagePoints || [];

  // Extract unique periods for filter buttons
  const periods = Array.from(new Set(heritagePoints.map(p => p.period).filter(Boolean))) as string[];

  const filteredPoints = heritagePoints.filter(item => {
    const matchesSearch = !searchTerm.trim() || 
      item.title.includes(searchTerm) || 
      item.description.includes(searchTerm) ||
      (item.fullExplanation && item.fullExplanation.includes(searchTerm)) ||
      (item.location && item.location.includes(searchTerm));

    const matchesPeriod = selectedPeriod === 'all' || item.period === selectedPeriod;

    return matchesSearch && matchesPeriod;
  });

  return (
    <div className="space-y-12 pb-16 text-right font-sans" dir="rtl">
      
      {/* Header Banner */}
      <section className="relative bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 sm:py-18 px-4 shadow-lg border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-4 text-center sm:text-right">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold backdrop-blur-xs">
            <Building2 className="h-4 w-4 text-amber-400" />
            <span>توثيق الآثار والمقدسات التاريخية - مدينة قارة</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            المعالم الأثرية والمقدسات ببلدة قارة
          </h1>

          <p className="text-base sm:text-lg text-emerald-100 max-w-3xl leading-relaxed font-sans opacity-90">
            تاريخ عريق يمتد عبر العصور، معالم معمارية، جوامع وكنائس أثرية، وأوابد صخرية تحكي السجل الحضاري والروحي الخالد لبلدة قارة في القلمون.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search & Period Filter Bar */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Search Input */}
            <div className="w-full md:w-96 relative">
              <input
                type="text"
                placeholder="ابحث عن معلم أثري بالاسم أو الموقع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-right outline-none focus:bg-white focus:border-emerald-700 transition-all font-medium"
              />
              <Search className="h-4 w-4 text-gray-400 absolute right-3.5 top-3.5" />
            </div>

            {/* Total Badge */}
            <div className="text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
              إجمالي المعالم الموثقة: <strong className="text-emerald-950 font-bold">{filteredPoints.length}</strong> من أصل {heritagePoints.length}
            </div>
          </div>

          {/* Period Pills */}
          {periods.length > 0 && (
            <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-gray-500 shrink-0">تصفية حسب الحقبة:</span>
              
              <button
                type="button"
                onClick={() => setSelectedPeriod('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedPeriod === 'all'
                    ? 'bg-emerald-900 text-amber-300 shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                الكل ({heritagePoints.length})
              </button>

              {periods.map((period, i) => {
                const count = heritagePoints.filter(p => p.period === period).length;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedPeriod === period
                        ? 'bg-emerald-900 text-amber-300 shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {period} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Landmarks Grid */}
        {filteredPoints.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200 text-gray-500 space-y-3">
            <Building2 className="h-12 w-12 mx-auto text-gray-300" />
            <p className="text-sm font-bold">لم يتم العثور على معالم أثرية تطابق البحث الحياتي.</p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedPeriod('all'); }}
              className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
            >
              إعادة ضبط الفلاتر والبحث
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPoints.map((item, idx) => (
              <div 
                key={item.id || idx}
                className="bg-white rounded-3xl border border-gray-100 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between text-right group"
              >
                <div>
                  {/* Image */}
                  <div className="h-52 w-full overflow-hidden bg-gray-100 relative">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="h-full w-full bg-emerald-900/10 flex items-center justify-center text-emerald-800">
                        <Building2 className="h-12 w-12 opacity-30" />
                      </div>
                    )}

                    <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
                      {item.period && (
                        <span className="bg-emerald-950/85 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/30 backdrop-blur-xs">
                          {item.period}
                        </span>
                      )}
                    </div>

                    {item.location && (
                      <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-bold px-3 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-amber-400" />
                        <span>{item.location}</span>
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-extrabold text-lg text-emerald-950 group-hover:text-emerald-800 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => setActiveModalLandmark(item)}
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4 text-amber-400" />
                    <span>قراءة التوثيق والشرح التاريخي الكامل</span>
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* FULL EXPLANATION MODAL */}
      {activeModalLandmark && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          dir="rtl"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModalLandmark(null);
          }}
        >
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-900/10 text-right font-sans">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white p-5 sm:p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-400 text-emerald-950 rounded-2xl shrink-0 shadow-sm">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold">{activeModalLandmark.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-amber-200">
                    {activeModalLandmark.period && <span>🏛️ {activeModalLandmark.period}</span>}
                    {activeModalLandmark.location && <span>📍 {activeModalLandmark.location}</span>}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalLandmark(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all cursor-pointer shrink-0"
                title="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
              
              {activeModalLandmark.image && (
                <div className="w-full h-60 sm:h-72 rounded-2xl overflow-hidden relative shadow-md border border-gray-100">
                  <img
                    src={activeModalLandmark.image}
                    alt={activeModalLandmark.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Excerpt Summary */}
              <div className="bg-amber-50/80 border border-amber-200/80 p-4 sm:p-5 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  النبذة التعريفية بالمعلم:
                </span>
                <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                  {activeModalLandmark.description}
                </p>
              </div>

              {/* Customizable Historical Documentation / References Section */}
              <div className="space-y-3 bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                <h4 className="text-base font-extrabold text-emerald-950 flex items-center gap-2 border-b border-gray-200 pb-2">
                  <BookOpen className="h-5 w-5 text-emerald-700" />
                  {activeModalLandmark.docsSectionTitle || 'التوثيق والشرح التاريخي والمراجع المعتمدة'}
                </h4>
                <div className="text-sm sm:text-base text-gray-700 leading-loose font-sans whitespace-pre-line">
                  {activeModalLandmark.docsSectionContent || activeModalLandmark.fullExplanation || activeModalLandmark.description}
                </div>
              </div>

              {/* Additional Landmark Images Gallery (Under References) */}
              {activeModalLandmark.showAdditionalImages !== false && 
               (activeModalLandmark.additionalImages || []).length > 0 && (
                <div className="space-y-3 bg-amber-50/50 p-5 rounded-2xl border border-amber-200/60">
                  <h4 className="text-sm sm:text-base font-extrabold text-emerald-950 flex items-center justify-between border-b border-amber-200/50 pb-2">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-amber-700" />
                      <span>معرض الصور الإضافية والاستكشافية للمعلم</span>
                    </span>
                    <span className="text-xs text-amber-900 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {(activeModalLandmark.additionalImages || []).length} صور
                    </span>
                  </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                    {(activeModalLandmark.additionalImages || []).map((extraImg, imgIdx) => {
                      const isMainImage = extraImg === activeModalLandmark.image;
                      return (
                        <div 
                          key={imgIdx} 
                          onClick={() => setPreviewImageModal(extraImg)}
                          className="h-28 rounded-xl overflow-hidden border border-gray-200 shadow-2xs group relative cursor-pointer bg-white"
                          title="اضغط للتكبير والعرض بالحجم الكامل"
                        >
                          <img 
                            src={extraImg} 
                            alt={`صورة ${imgIdx + 1} - ${activeModalLandmark.title}`} 
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
                {activeModalLandmark.modalFooterText || homeContent?.landmarkModalFooterText || 'منصة بوابة قارة - قسم التوثيق التاريخي والآثار'}
              </span>
              <button
                type="button"
                onClick={() => setActiveModalLandmark(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-xs transition-all cursor-pointer shrink-0"
              >
                إغلاق النافذة
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LIGHTBOX / ENLARGED IMAGE PREVIEW MODAL */}
      {previewImageModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setPreviewImageModal(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-stone-900 rounded-3xl p-2 overflow-hidden shadow-2xl flex flex-col items-center border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImageModal(null)}
              className="absolute top-4 right-4 z-10 p-2.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all cursor-pointer border border-white/20"
              title="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
            <img 
              src={previewImageModal} 
              alt="Enlarged landmark view" 
              className="max-w-full max-h-[82vh] object-contain rounded-2xl" 
            />
          </div>
        </div>
      )}

    </div>
  );
}
