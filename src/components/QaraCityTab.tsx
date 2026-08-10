import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  BookOpen, 
  Newspaper, 
  Sparkles, 
  ArrowLeft, 
  ChevronLeft, 
  Info, 
  ShieldCheck, 
  Compass, 
  FileText,
  Calendar,
  Layers
} from 'lucide-react';
import { HomeContent, News, HeritagePoint, CustomPage } from '../types';

interface QaraCityTabProps {
  setActiveTab: (tab: string) => void;
  homeContent: HomeContent;
  newsList: News[];
  visibleTabs?: { [key: string]: boolean };
  customPages?: CustomPage[];
}

export default function QaraCityTab({
  setActiveTab,
  homeContent,
  newsList = [],
  visibleTabs = {},
  customPages = []
}: QaraCityTabProps) {
  const [selectedLandmarkModal, setSelectedLandmarkModal] = useState<HeritagePoint | null>(null);

  const isContentHidden = visibleTabs.hide_qara_city_content === true;

  // Custom sub-pages under qara_city
  const qaraSubPages = customPages.filter(p => !p.isMain && p.parentId === 'qara_city' && p.status === 'active');

  if (isContentHidden) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-right" dir="rtl">
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 text-center sm:text-right">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-950 rounded-full text-xs font-bold border border-amber-300">
                <Info className="h-4 w-4 text-amber-700" />
                <span>صفحة مدينة قارة</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-sans">
                تصفح أقسام ومرافق مدينة قارة
              </h1>
              <p className="text-sm sm:text-base text-gray-700 max-w-2xl leading-relaxed">
                محتوى الصفحة الرئيسية لمدينة قارة مخفي حالياً بأمر الإدارة، ولكن جميع الصفحات والأقسام المندرجة تحتها متاحة وفعالة للتصفح المباشر.
              </p>
            </div>

            <div className="p-4 bg-emerald-900 text-amber-300 rounded-3xl shadow-md shrink-0">
              <Building2 className="h-12 w-12" />
            </div>
          </div>

          <div className="pt-6 border-t border-amber-200/60">
            <h3 className="text-sm font-extrabold text-emerald-950 mb-4 flex items-center gap-2 justify-center sm:justify-start">
              <Compass className="h-4 w-4 text-amber-600" />
              <span>الصفحات المندرجة المتاحة للتصفح:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. News */}
              <button
                type="button"
                onClick={() => setActiveTab('news')}
                className="p-5 bg-white rounded-2xl border border-emerald-900/10 hover:border-emerald-700 hover:shadow-md transition-all text-right space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl group-hover:bg-emerald-800 group-hover:text-white transition-all">
                    <Newspaper className="h-5 w-5" />
                  </div>
                  <ChevronLeft className="h-4 w-4 text-gray-400 group-hover:translate-x-[-4px] transition-transform" />
                </div>
                <h4 className="font-bold text-base text-gray-900">أخبار قارة</h4>
                <p className="text-xs text-gray-500">تابع أحدث الأخبار والمستجدات والتقارير اليومية لبلدة قارة.</p>
              </button>

              {/* 2. Landmarks */}
              <button
                type="button"
                onClick={() => setActiveTab('landmarks')}
                className="p-5 bg-white rounded-2xl border border-emerald-900/10 hover:border-amber-600 hover:shadow-md transition-all text-right space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <ChevronLeft className="h-4 w-4 text-gray-400 group-hover:translate-x-[-4px] transition-transform" />
                </div>
                <h4 className="font-bold text-base text-gray-900">المعالم الأثرية</h4>
                <p className="text-xs text-gray-500">استكشف التوثيق التاريخي الكامل والمقدسات والأوابد الأثرية.</p>
              </button>

              {/* 3. Custom Sub-Pages */}
              {qaraSubPages.map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setActiveTab(sub.id)}
                  className="p-5 bg-white rounded-2xl border border-emerald-900/10 hover:border-emerald-700 hover:shadow-md transition-all text-right space-y-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-sky-50 text-sky-800 rounded-xl group-hover:bg-sky-800 group-hover:text-white transition-all">
                      <FileText className="h-5 w-5" />
                    </div>
                    <ChevronLeft className="h-4 w-4 text-gray-400 group-hover:translate-x-[-4px] transition-transform" />
                  </div>
                  <h4 className="font-bold text-base text-gray-900">{sub.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{sub.description || 'صفحة مخصصة تابعة لمدينة قارة.'}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Active Content for "مدينة قارة"
  const heritagePoints = homeContent.heritagePoints || [];

  return (
    <div className="space-y-12 pb-16 text-right" dir="rtl">
      
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white py-16 sm:py-20 px-4 overflow-hidden shadow-lg border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-6 text-center sm:text-right">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold backdrop-blur-xs">
            <Building2 className="h-4 w-4 text-amber-400" />
            <span>بوابة التوثيق والتعريف الشامل بمدينة قارة</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight text-white leading-tight">
            مدينة قارة - عروس القلمون التاريخية
          </h1>

          <p className="text-base sm:text-lg text-emerald-100 max-w-3xl leading-relaxed font-sans opacity-90">
            تعتبر بلدة قارة من أقدم وأعرق الحواضر السكنية في منطقة القلمون بالريف الدمشقي، وتتميز بتاريخها الممتد لآلاف السنين، وموقعها الاستراتيجي الهام على الطريق الممتد بين دمشق وحمص.
          </p>

          {/* Subpages Quick Navigation Grid */}
          <div className="pt-4 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('news')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Newspaper className="h-4 w-4" />
              <span>تصفح أخبار قارة</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('landmarks')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all border border-white/20 flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <BookOpen className="h-4 w-4 text-amber-300" />
              <span>دليل المعالم الأثرية</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>

            {qaraSubPages.map(sub => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setActiveTab(sub.id)}
                className="px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 font-bold rounded-xl text-xs transition-all border border-emerald-700/50 flex items-center gap-2 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-emerald-300" />
                <span>{sub.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* City Profile & Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3 text-right">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl w-max">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-lg text-emerald-950">الموقع والمناخ</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              تقع قارة شمال مدينة دمشق بنحو 95 كم، وترتفع عن سطح البحر نحو 1300 متر، مما يمنحها مناخاً معتدلاً صيفاً ولطيفاً، وجبلياً ناصع البياض بالثلوج شتاءً.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3 text-right">
            <div className="p-3 bg-amber-50 text-amber-800 rounded-2xl w-max">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-lg text-emerald-950">العراقة التاريخية</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              تعاقبت عليها الحضارات الآرامية والبيزنطية والإسلامية، وتزخر بالأوابد الأثرية مثل الكنائس التاريخية والجوامع العريقة والقبور المحفورة بالصخر.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3 text-right">
            <div className="p-3 bg-sky-50 text-sky-800 rounded-2xl w-max">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-lg text-emerald-950">الحياة والخدمات</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              تجمع قارة بين الأصالة والتطور العمراني والتعليمي والزراعي، حيث تشتهر بالأشجار المثمرة والأجواء الاجتماعية المتماسكة والمؤسسات الرقمية الناشطة.
            </p>
          </div>
        </div>

        {/* Section: Featured Archaeological Landmarks Preview */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-amber-600" />
                <span>أبرز المعالم الأثرية والتاريخية بمدينة قارة</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                عرض نماذج توثيقية لأهم المقدسات والآثار الخالدة بالبلدة.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('landmarks')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>عرض جميع المعالم والشروح الكاملة ({heritagePoints.length})</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {heritagePoints.slice(0, 4).map((item, idx) => (
              <div 
                key={item.id || idx}
                className="bg-white rounded-3xl border border-gray-100 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between text-right group"
              >
                <div>
                  {item.image ? (
                    <div className="h-44 w-full overflow-hidden bg-gray-100 relative">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      {item.period && (
                        <span className="absolute top-3 right-3 bg-emerald-950/80 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/30 backdrop-blur-xs">
                          {item.period}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="h-28 w-full bg-emerald-900/10 flex items-center justify-center text-emerald-800">
                      <Building2 className="h-8 w-8 opacity-40" />
                    </div>
                  )}

                  <div className="p-5 space-y-2">
                    <h3 className="font-extrabold text-base text-gray-900 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('landmarks')}
                    className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs rounded-xl border border-amber-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>التوثيق والشرح الكامل</span>
                    <ChevronLeft className="h-3.5 w-3.5 text-amber-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Latest Qara News Preview */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
                <Newspaper className="h-6 w-6 text-emerald-700" />
                <span>أحدث مستجدات وأخبار مدينة قارة</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                متابعة الأنشطة الأهلية والخدمية والاجتماعية في البلدة.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('news')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>الانتقال لجميع الأخبار</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsList.slice(0, 3).map((news) => (
              <div 
                key={news.id}
                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs hover:shadow-md transition-all space-y-3 text-right flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {news.category || 'خبر محلي'}
                    </span>
                    <span>📅 {news.date}</span>
                  </div>
                  <h3 className="font-bold text-base text-gray-900 line-clamp-1">{news.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{news.content}</p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('news')}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>اقرأ التفاصيل</span>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
