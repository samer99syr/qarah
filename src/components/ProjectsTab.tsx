import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_PROJECTS, INITIAL_SUGGESTIONS } from '../data/qaraData';
import { Project, Suggestion, HomeContent } from '../types';
import PageHeader from './PageHeader';
import { 
  Plus, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ThumbsUp, 
  CheckCircle2, 
  Building2, 
  Heart, 
  ArrowLeftRight,
  User,
  Phone,
  Send,
  X,
  Sparkles,
  Award,
  Lightbulb,
  Check
} from 'lucide-react';

interface ProjectsTabProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  suggestions: Suggestion[];
  setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;
  homeContent: HomeContent;
}

export default function ProjectsTab({
  projects,
  setProjects,
  suggestions,
  setSuggestions,
  homeContent
}: ProjectsTabProps) {
  // Volunteering modal fields
  const [selectedVolProject, setSelectedVolProject] = useState<Project | null>(null);
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [volunteerRole, setVolunteerRole] = useState('جهد بدني / لوجستي');
  const [volunteerSuccess, setVolunteerSuccess] = useState(false);

  // Proposal form fields
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [propTitle, setPropTitle] = useState('');
  const [propCategory, setPropCategory] = useState<'تحسين خدمات' | 'فكرة مشروع' | 'شكوى' | 'أخرى'>('فكرة مشروع');
  const [propContent, setPropContent] = useState('');
  const [propAuthor, setPropAuthor] = useState('');
  const [propSuccess, setPropSuccess] = useState(false);

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
  };

  const saveSuggestions = (updated: Suggestion[]) => {
    setSuggestions(updated);
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerName || !volunteerPhone || !selectedVolProject) return;

    // Increment volunteersCount in project list
    const updated = projects.map(item => {
      if (item.id === selectedVolProject.id) {
        return { ...item, volunteersCount: item.volunteersCount + 1 };
      }
      return item;
    });

    saveProjects(updated);
    setVolunteerSuccess(true);
    setVolunteerName('');
    setVolunteerPhone('');

    setTimeout(() => {
      setVolunteerSuccess(false);
      setSelectedVolProject(null);
    }, 2500);
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle || !propContent || !propAuthor) {
      alert("الرجاء تعبئة جميع الحقول المطلوبة للمقترح.");
      return;
    }

    const newProp: Suggestion = {
      id: "sug_" + Date.now(),
      author: propAuthor,
      title: propTitle,
      content: propContent,
      category: propCategory,
      likes: 1,
      date: new Date().toLocaleDateString('ar-SY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: 'pending',
      municipalityVote: 'none'
    };

    const updated = [newProp, ...suggestions];
    saveSuggestions(updated);

    setPropSuccess(true);
    setPropTitle('');
    setPropContent('');
    setPropAuthor('');

    setTimeout(() => {
      setPropSuccess(false);
      setShowProposalForm(false);
    }, 2500);
  };

  const handleUpvoteSuggestion = (sugId: string) => {
    const updated = suggestions.map(item => {
      if (item.id === sugId) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    });
    saveSuggestions(updated);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'قيد التنفيذ': return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'قيد التخطيط': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right font-sans" dir="rtl">
      
      {/* Page Header */}
      <PageHeader 
        badge="بوابة التنمية والاستثمار" 
        title="المشاريع والمبادرات التنموية بقارة" 
        description="نستعرض معكم المشاريع الخدمية والإنتاجية التي يتم تنفيذها في قارة بهدف تحسين البنية التحتية، توفير المياه النظيفة، دعم الاقتصاد الزراعي، وتأهيل الشباب. تصفحوا قائمة المشاريع، وشاركونا كشركاء تنمية بالتطوع أو تقديم الأفكار والمقترحات." 
        homeContent={homeContent} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Projects tracker cards */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="bg-white rounded-3xl border border-amber-900/5 shadow-sm hover:shadow-md hover:border-emerald-700/20 transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Banner */}
                <div className="h-44 relative bg-gray-50">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://picsum.photos/seed/qara_proj/600/400";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="absolute bottom-3 right-4 text-xs font-semibold text-amber-300">
                    تصنيف {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5 text-right">
                    <h3 className="font-extrabold text-gray-900 text-base sm:text-lg hover:text-emerald-800 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Interactive Dynamic Progress Bar */}
                  <div className="space-y-1.5 font-sans">
                    <div className="flex justify-between text-[11px] font-bold flex-row-reverse">
                      <span className="text-emerald-900">نسبة الإنجاز: {project.percentage}%</span>
                      <span className="text-gray-400">تاريخ المستهدف: {project.dateTarget}</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                      <div 
                        className="h-full bg-emerald-700 rounded-full transition-all duration-1000"
                        style={{ width: `${project.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Funding & Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2 text-right pt-2 border-t border-gray-50 text-[11px] text-gray-500">
                    <div className="p-2 bg-amber-50/40 rounded-xl">
                      <span className="block text-amber-800 font-bold font-sans">الميزانية والتمويل</span>
                      <span className="font-sans font-medium">{project.budget}</span>
                    </div>
                    <div className="p-2 bg-emerald-50/40 rounded-xl">
                      <span className="block text-emerald-800 font-bold font-sans">عدد المتطوعين</span>
                      <span className="font-sans font-medium">{project.volunteersCount} متطوع محلي</span>
                    </div>
                  </div>

                </div>

                {/* Project Footer: Volunteer trigger */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => {
                      setSelectedVolProject(project);
                      setVolunteerSuccess(false);
                    }}
                    className={`w-full py-2.5 text-xs font-bold rounded-xl shadow-sm hover:shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      project.status === 'مكتمل'
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-100'
                        : 'bg-emerald-800 hover:bg-emerald-950 text-white'
                    }`}
                  >
                    {project.status === 'مكتمل' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                        <span>مشروع مكتمل - تم شكر المتطوعين</span>
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4" />
                        <span>سجل كمتطوع في هذا المشروع</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Public Suggestions Box (صندوق المبادرات) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Submit trigger banner */}
          <div className="bg-amber-500 text-emerald-950 rounded-3xl p-6 shadow-md border border-amber-600/40 space-y-4">
            <div className="p-3 bg-emerald-950 text-amber-300 rounded-2xl w-fit">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-lg">صندوق مبادرات المواطنين</h3>
            <p className="text-xs text-emerald-900/90 leading-relaxed">
              لديك فكرة لتجميل ساحات قارة، تنظيف الأقنية الرومانية القديمة، أو تدوير المخلفات الزراعية؟ شاركنا الفكرة وصوّت لمقترحات أبناء بلدتك لتصل لمجلس المدينة.
            </p>
            <button
              onClick={() => setShowProposalForm(true)}
              className="w-full py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              أرسل مبادرة أو مقترح جديد
            </button>
          </div>

          {/* Suggestions wall */}
          <div className="bg-white p-6 rounded-3xl border border-amber-900/5 shadow-sm space-y-4">
            <h4 className="font-bold text-gray-900 text-sm pb-3 border-b border-gray-100 flex items-center justify-between flex-row-reverse">
              <span className="text-xs text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">بوابة المشاركة</span>
              <span>مبادرات الأهالي المقترحة</span>
            </h4>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {suggestions.filter(sug => !sug.status || sug.status === 'approved').length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  لا توجد مبادرات معتمدة منشورة حالياً. كن أول من يرسل مبادرة!
                </div>
              ) : (
                suggestions.filter(sug => !sug.status || sug.status === 'approved').map((sug) => (
                  <div key={sug.id} className="p-4 bg-gray-50 rounded-2xl space-y-3 relative text-right hover:bg-[#fdfbf7] hover:border-amber-400/20 border border-transparent transition-all">
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-900 rounded-full">
                      {sug.category}
                    </span>
                    
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-xs text-gray-900 leading-relaxed">{sug.title}</h5>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono justify-end">
                        <span>بواسطة: {sug.author}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{sug.date}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed font-sans whitespace-pre-line">
                      {sug.content}
                    </p>

                    <div className="flex items-center justify-between flex-row-reverse pt-2 border-t border-gray-100 gap-2">
                      <button
                        onClick={() => handleUpvoteSuggestion(sug.id)}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 text-gray-800 hover:text-emerald-900 border border-gray-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                      >
                        <ThumbsUp className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span>صوّت للفكرة ({sug.likes})</span>
                      </button>
                      
                      {/* Municipality Vote */}
                      {sug.municipalityVote === 'approve' && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md font-bold flex items-center gap-0.5">
                          💚 البلدية: نؤيد المبادرة ونعتمدها
                        </span>
                      )}
                      {sug.municipalityVote === 'disagree' && (
                        <span className="text-[10px] bg-red-100 text-red-950 border border-red-200 px-2 py-0.5 rounded-md font-bold flex items-center gap-0.5">
                          ❌ البلدية: غير ملائمة للتنفيذ حالياً
                        </span>
                      )}
                      {sug.municipalityVote === 'study' && (
                        <span className="text-[10px] bg-amber-100 text-amber-950 border border-amber-200 px-2 py-0.5 rounded-md font-bold flex items-center gap-0.5">
                          ⏱️ البلدية: قيد الدراسة والتخطيط
                        </span>
                      )}
                      {(sug.municipalityVote === 'none' || !sug.municipalityVote) && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-md font-bold flex items-center gap-0.5">
                          ⏳ بانتظار تصويت البلدية
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* MODAL: SUBMIT PUBLIC PROPOSAL (Surgical Interactive Layer) */}
      <AnimatePresence>
        {showProposalForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10"
            >
              
              <div className="p-6 bg-emerald-900 text-white flex justify-between items-center flex-row-reverse">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Sparkles className="h-5 w-5 text-amber-300 font-bold" />
                  <h3 className="text-base sm:text-lg font-bold">تقديم مبادرة أو فكرة جديدة لقارة</h3>
                </div>
                <button
                  onClick={() => setShowProposalForm(false)}
                  className="p-1.5 rounded-full hover:bg-emerald-950/80 text-emerald-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {propSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                      <Check className="h-6 w-6 animate-bounce" />
                    </div>
                    <h4 className="font-bold text-lg text-emerald-950">تم إرسال فكرتك بنجاح!</h4>
                    <p className="text-xs text-gray-500">تم نشر المبادرة على لوحة الأفكار لتصويت بقية أهالي مدينة قارة عليها.</p>
                  </div>
                ) : (
                  <form onSubmit={handleProposalSubmit} className="space-y-4 text-right">
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">عنوان المقترح / المبادرة <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: مبادرة لتشجير التلال المحيطة بمدخل قارة الشمالي باللوز الجبلي"
                        value={propTitle}
                        onChange={(e) => setPropTitle(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">نوع المبادرة</label>
                        <select
                          value={propCategory}
                          onChange={(e: any) => setPropCategory(e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        >
                          <option value="فكرة مشروع">فكرة مشروع تنموي</option>
                          <option value="تحسين خدمات">تحسين خدمات بلدية</option>
                          <option value="شكوى">شكوى أو ملاحظة عامة</option>
                          <option value="أخرى">أخرى</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">الاسم الثلاثي للمقترح <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: م. وسيم غانم"
                          value={propAuthor}
                          onChange={(e) => setPropAuthor(e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">تفاصيل الفكرة وآلية التنفيذ المقترحة <span className="text-red-500">*</span></label>
                      <textarea
                        rows={4}
                        required
                        placeholder="اشرح هنا تفاصيل مقترحك، كيف يمكن للأهالي أو البلدية دعم تنفيذه، وما هي الفوائد المتوقعة للمدينة..."
                        value={propContent}
                        onChange={(e) => setPropContent(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                      />
                    </div>

                    <div className="pt-3 flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        <span>نشر الفكرة للعامة</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProposalForm(false)}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
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
      </AnimatePresence>

      {/* MODAL: ACTIVE VOLUNTEERING SUBMISSION FORM (Surgical Interactive Layer) */}
      <AnimatePresence>
        {selectedVolProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10 text-right"
            >
              
              <div className="p-6 bg-emerald-900 text-white flex justify-between items-center flex-row-reverse">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-300 font-mono tracking-widest bg-emerald-950 px-2 py-0.5 rounded-full block w-fit">نموذج التطوع الأهلي</span>
                  <h3 className="text-base sm:text-lg font-bold">{selectedVolProject.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedVolProject(null)}
                  className="p-1.5 rounded-full hover:bg-emerald-950/80 text-emerald-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {volunteerSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                      <Award className="h-6 w-6 animate-pulse" />
                    </div>
                    <h4 className="font-bold text-lg text-emerald-950">شكراً لك يا ابن قارة المعطاء!</h4>
                    <p className="text-xs text-gray-500">تم تسجيل بياناتك كمتطوع. تواصل مجمع قارة الأهلي سيكون قريباً لجدولة المهام الميدانية.</p>
                  </div>
                ) : (
                  <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                    
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">
                      التطوع هو عصب التنمية في مدينة قارة. شكراً لتخصيص جزء من وقتك وخبرتك للمساهمة في دعم هذا المشروع المجتمعي.
                    </p>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 block">الاسم الكامل للمتطوع <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="مثال: يحيى خالد غانم"
                          value={volunteerName}
                          onChange={(e) => setVolunteerName(e.target.value)}
                          className="w-full pr-10 pl-3 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        />
                        <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">رقم الهاتف للتنسيق <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            placeholder="مثال: 0993111222"
                            value={volunteerPhone}
                            onChange={(e) => setVolunteerPhone(e.target.value)}
                            className="w-full pr-10 pl-3 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-mono"
                          />
                          <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">طبيعة المساهمة المفضلة</label>
                        <select
                          value={volunteerRole}
                          onChange={(e: any) => setVolunteerRole(e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        >
                          <option value="جهد بدني / لوجستي">مجهود بدني / عمل ميداني</option>
                          <option value="خبرة تقنية / هندسية">خبرة فنية أو هندسية</option>
                          <option value="إدارة وتنظيم إداري">تنظيم وإشراف وتنسيق</option>
                          <option value="دعم مجتمعي ونشر">إعلام وتوعية وتوثيق</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        <span>تأكيد التسجيل كمتطوع</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedVolProject(null)}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
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
      </AnimatePresence>

    </div>
  );
}
