import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, BookOpen, Award, Users, Map, 
  Sparkles, Hammer, MapPin, Milestone, Heart, Calendar, ArrowLeft
} from 'lucide-react';
import { CustomPage, HomeContent } from '../types';

interface CustomPageTabProps {
  page: CustomPage;
  homeContent: HomeContent;
}

export default function CustomPageTab({ page, homeContent }: CustomPageTabProps) {
  const { title, description, templateId, content } = page;
  const { introText, sections = [] } = content;

  // Render header based on styling preference
  const headerStyle = homeContent.pageHeaderStyle || 'ornamented';
  const alignment = homeContent.pageHeaderAlignment || 'right';

  const renderHeader = () => {
    return (
      <div 
        className={`mb-8 p-6 sm:p-8 rounded-3xl text-right bg-gradient-to-l from-emerald-900 via-emerald-800 to-emerald-950 text-white relative overflow-hidden shadow-lg border border-emerald-700`}
        dir="rtl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_40%)] pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/10">
            <Sparkles className="h-3 w-3 animate-spin" />
            <span>صفحة قلمونية تراثية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-amber-200">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>
      </div>
    );
  };

  const renderIntro = () => {
    if (!introText) return null;
    return (
      <div className="p-5 sm:p-6 bg-amber-50/30 rounded-2xl border border-amber-900/5 mb-8 text-right relative">
        <div className="absolute right-0 top-0 h-full w-1 bg-amber-500 rounded-r-2xl" />
        <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed font-sans whitespace-pre-line">
          {introText}
        </p>
      </div>
    );
  };

  const renderTemplateContent = () => {
    switch (templateId) {
      case 'landmarks':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
            {sections.map((sec, idx) => (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all flex flex-col hover:border-emerald-700/20 text-right"
              >
                {sec.image && (
                  <div className="h-48 w-full overflow-hidden relative">
                    <img 
                      src={sec.image} 
                      alt={sec.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {sec.badge && (
                      <span className="absolute top-3 right-3 bg-emerald-900 text-amber-200 px-2.5 py-1 text-[10px] font-bold rounded-lg shadow-sm border border-emerald-700/30">
                        {sec.badge}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    {!sec.image && sec.badge && (
                      <span className="inline-block bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[9px] font-bold rounded">
                        {sec.badge}
                      </span>
                    )}
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-snug">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-sans whitespace-pre-line">
                      {sec.content}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-amber-600" />
                      موقع أثري في قارة
                    </span>
                    <span className="font-mono">معلم #{idx + 1}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'crafts':
        return (
          <div className="space-y-6 text-right" dir="rtl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-4">
                {sections.map((sec, idx) => (
                  <motion.div
                    key={sec.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row-reverse gap-4 items-center"
                  >
                    {sec.image && (
                      <div className="w-full sm:w-40 h-32 rounded-2xl overflow-hidden shrink-0">
                        <img 
                          src={sec.image} 
                          alt={sec.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div className="flex-grow space-y-2">
                      <div className="flex items-center gap-2 flex-row-reverse justify-end">
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                          {sec.badge || 'مهنة تراثية'}
                        </span>
                        <span className="text-[10px] text-gray-400">رمز قلموني عريق</span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-gray-900">
                        {sec.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed font-sans whitespace-pre-line">
                        {sec.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Sidebar Qalamoun Info Card */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-[#fcf8f2] p-6 rounded-3xl border border-amber-900/10 space-y-4 shadow-sm">
                  <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl w-fit">
                    <Hammer className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-amber-950">صناعة وهوية وطنية</h4>
                  <p className="text-xs text-amber-900/80 leading-relaxed font-sans">
                    لا تزال المهن والحرف اليدوية بقارة تشكل عماداً للهوية الوطنية والتراث اللامادي السوري. حماية هؤلاء الحرفيين وتوريث خبراتهم للأبناء هو واجب وطني ومجتمعي يحافظ على روح المجتمع وعراقته.
                  </p>
                  <div className="pt-2 border-t border-amber-900/10 flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Award className="h-4 w-4" />
                    <span>ندعم الصناعة المحلية القلمونية</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="max-w-3xl mx-auto space-y-8 text-right relative" dir="rtl">
            {/* Timeline central dotted line */}
            <div className="absolute right-4 top-4 bottom-4 w-0.5 border-r-2 border-dashed border-amber-900/20" />

            {sections.map((sec, idx) => (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative pr-10"
              >
                {/* Dotted Marker */}
                <div className="absolute right-2 top-2 h-4.5 w-4.5 rounded-full bg-amber-500 border-4 border-[#fdfbf7] flex items-center justify-center z-10" />

                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-400/20 transition-all space-y-3">
                  <div className="flex justify-between items-center flex-row-reverse">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-900 rounded-lg">
                      {sec.badge || 'حقبة تاريخية'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">سجل قارة الخالد</span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                    {sec.title}
                  </h3>

                  {sec.image && (
                    <div className="h-44 w-full rounded-2xl overflow-hidden my-2">
                      <img 
                        src={sec.image} 
                        alt={sec.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <p className="text-xs text-gray-600 leading-relaxed font-sans whitespace-pre-line">
                    {sec.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'tourism':
        return (
          <div className="space-y-6 text-right" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((sec, idx) => (
                <motion.div
                  key={sec.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all flex flex-col"
                >
                  {sec.image && (
                    <div className="h-56 w-full overflow-hidden relative">
                      <img 
                        src={sec.image} 
                        alt={sec.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {sec.badge && (
                        <span className="absolute top-3 right-3 bg-amber-500 text-amber-950 px-3 py-1 text-[10px] font-extrabold rounded-full shadow-md">
                          ⛳ {sec.badge}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-5 flex-grow space-y-2.5">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2 flex-row-reverse">
                      <Compass className="h-4 w-4 text-emerald-800" />
                      <span>{sec.title}</span>
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-sans whitespace-pre-line">
                      {sec.content}
                    </p>
                    <div className="pt-2 flex items-center gap-2 justify-end text-[10px] text-gray-400">
                      <span>⛰️ جبال القلمون، ريف دمشق</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-900/5 space-y-3">
              <h4 className="font-bold text-sm text-emerald-950">💡 إرشادات للسياح والزوار الجبليين:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900/90 list-disc list-inside">
                <li>يرجى التنسيق المسبق مع الدليل المحلي قبل ارتياد المغارات والممرات الوعرة.</li>
                <li>تأكد من ارتداء أحذية التسلق الجبلية ومعدات السلامة الأساسية.</li>
                <li>حافظ على نظافة الطبيعة، ولا تترك أي مخلفات خلفك لحماية البيئة السورية.</li>
                <li>احرص على جلب مياه الشرب الكافية نظراً لوعرة الممرات وطول المسافة.</li>
              </ul>
            </div>
          </div>
        );

      case 'assembly':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-right" dir="rtl">
            <div className="lg:col-span-8 space-y-4">
              {sections.map((sec, idx) => (
                <motion.div
                  key={sec.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-5 bg-white rounded-3xl border border-amber-900/5 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-center flex-row-reverse">
                    <div className="flex items-center gap-1.5 flex-row-reverse">
                      <Users className="h-4 w-4 text-amber-600" />
                      <h3 className="font-bold text-sm sm:text-base text-gray-900">
                        {sec.title}
                      </h3>
                    </div>
                    {sec.badge && (
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-950 border border-amber-100 px-2 py-0.5 rounded">
                        {sec.badge}
                      </span>
                    )}
                  </div>

                  {sec.image && (
                    <div className="h-48 w-full rounded-2xl overflow-hidden">
                      <img 
                        src={sec.image} 
                        alt={sec.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <p className="text-xs text-gray-600 leading-relaxed font-sans whitespace-pre-line">
                    {sec.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Qara Assembly Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 space-y-4 shadow-sm text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-gray-900">مجلس الحكماء وقيم الأهالي</h4>
                  <p className="text-xs text-gray-500 font-sans">
                    سجل تواصل مستمر لتكافل العائلات وسداد حوائج المحتاجين.
                  </p>
                </div>
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-right space-y-2">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">💬 قيم ميثاق قارة:</span>
                  <div className="text-xs text-amber-950 font-sans leading-relaxed space-y-1">
                    <p>١. التآخي والعيش المشترك التام.</p>
                    <p>٢. إعانة المحتاج وفك العسرة عن المعسرين.</p>
                    <p>٣. الحفاظ على الممتلكات العامة والبيئة التاريخية.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4 text-right">
            {sections.map((sec) => (
              <div key={sec.id} className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-base text-gray-900">{sec.title}</h3>
                <p className="text-xs text-gray-600 font-sans">{sec.content}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      {renderHeader()}
      {renderIntro()}
      {renderTemplateContent()}
    </div>
  );
}
