import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_NEWS } from '../data/qaraData';
import { News, Comment, HomeContent, CitizenUser } from '../types';
import PageHeader from './PageHeader';
import { 
  Calendar, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  Search, 
  Plus, 
  X, 
  Send, 
  User, 
  Award, 
  Tag, 
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  Trash2,
  ShieldCheck
} from 'lucide-react';

interface NewsTabProps {
  newsList: News[];
  setNewsList: React.Dispatch<React.SetStateAction<News[]>>;
  homeContent: HomeContent;
  communityAnnouncements: News[];
  setCommunityAnnouncements: React.Dispatch<React.SetStateAction<News[]>>;
  loggedCitizen?: CitizenUser | null;
}

export default function NewsTab({ 
  newsList, 
  setNewsList, 
  homeContent,
  communityAnnouncements,
  setCommunityAnnouncements,
  loggedCitizen
}: NewsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset page to 1 when search or category selection changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // New Comment Fields
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');

  // Suggest news form fields
  const [showSuggestForm, setShowSuggestForm] = useState(false);
  const [suggestTitle, setSuggestTitle] = useState('');
  const [suggestCategory, setSuggestCategory] = useState<string>('أخبار عامة');
  const [suggestContent, setSuggestContent] = useState('');
  const [suggestAuthor, setSuggestAuthor] = useState('');
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  // Auto-open news detail if selected from homepage news ticker
  useEffect(() => {
    const selectedId = localStorage.getItem('selected_news_id');
    if (selectedId) {
      const found = newsList.find(n => n.id === selectedId);
      if (found) {
        setSelectedNews(found);
      }
      localStorage.removeItem('selected_news_id');
    }
  }, [newsList]);

  const saveNewsList = (updated: News[]) => {
    setNewsList(updated);
  };

  const handleLike = (newsId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering details modal if clicked on card
    const updated = newsList.map(item => {
      if (item.id === newsId) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    });
    saveNewsList(updated);

    // Update selected news detail view too if open
    if (selectedNews && selectedNews.id === newsId) {
      setSelectedNews(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  const handleLikeCommunity = (annId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = communityAnnouncements.map(item => {
      if (item.id === annId) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    });
    setCommunityAnnouncements(updated);
  };

  const handleDeleteComment = (newsId: string, commentId: string) => {
    if (!window.confirm('هل أنت تأكد من رغبتك في حذف هذا التعليق؟ (صلاحيات الإدارة 🛡️)')) return;

    const updated = newsList.map(item => {
      if (item.id === newsId) {
        return {
          ...item,
          comments: item.comments.filter(c => c.id !== commentId)
        };
      }
      return item;
    });

    saveNewsList(updated);

    if (selectedNews && selectedNews.id === newsId) {
      setSelectedNews(prev => prev ? {
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId)
      } : null);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent || !selectedNews) return;

    const effectiveAuthor = commentAuthor.trim() || (loggedCitizen?.isSiteManager ? 'مدير الموقع' : loggedCitizen?.fullName) || 'مواطن من أهالي قارة';
    const isBoard = loggedCitizen?.isBoardMember || loggedCitizen?.isSiteManager;
    const authorBadge = isBoard ? (loggedCitizen?.badgeTitle || 'الإدارة 🛡️') : undefined;

    const newComment: Comment = {
      id: "c_" + Date.now(),
      author: effectiveAuthor,
      content: commentContent,
      authorBadge,
      date: new Date().toLocaleDateString('ar-SY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    const updated = newsList.map(item => {
      if (item.id === selectedNews.id) {
        return {
          ...item,
          comments: [...item.comments, newComment]
        };
      }
      return item;
    });

    saveNewsList(updated);
    
    // Update the local modal view state
    setSelectedNews(prev => prev ? {
      ...prev,
      comments: [...prev.comments, newComment]
    } : null);

    setCommentAuthor('');
    setCommentContent('');
  };

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestTitle || !suggestContent || !suggestAuthor) {
      alert("يرجى ملء جميع الحقول المطلوبة للمشاركة.");
      return;
    }

    const newAnn: News = {
      id: "ann_" + Date.now(),
      title: suggestTitle,
      content: suggestContent,
      date: new Date().toLocaleDateString('ar-SY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      category: suggestCategory,
      views: 1,
      likes: 1,
      comments: [],
      status: 'pending',
      authorName: suggestAuthor
    };

    const updated = [newAnn, ...communityAnnouncements];
    setCommunityAnnouncements(updated);

    setSuggestSuccess(true);
    setSuggestTitle('');
    setSuggestContent('');
    setSuggestAuthor('');

    setTimeout(() => {
      setSuggestSuccess(false);
      setShowSuggestForm(false);
    }, 2500);
  };

  const filteredNews = newsList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  const activeNewsCategories = (homeContent?.newsCategories && homeContent.newsCategories.length > 0)
    ? ['الكل', ...homeContent.newsCategories]
    : ['الكل', 'أخبار عامة', 'بلدي', 'اجتماعي', 'رياضي', 'ثقافي'];

  const getNewsBadgeColor = (category: string) => {
    switch (category) {
      case 'أخبار عامة': return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'بلدي': return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'اجتماعي': return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'رياضي': return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'ثقافي': return 'bg-rose-100 text-rose-900 border-rose-200';
      default: return 'bg-teal-100 text-teal-900 border-teal-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right font-sans" dir="rtl">
      
      {/* Header Banner */}
      <PageHeader 
        badge="المركز الإعلامي لمدينة قارة" 
        title="أخبار وفعاليات المجتمع المحلي" 
        description="تابع آخر التطورات الخدمية، الأنشطة الأهلية، أخبار المحاصيل الزراعية ومناسبات التفوق الرياضي والتعليمي في مدينة قارة. شارك بتعليقك أو انشر خبراً اجتماعياً مباشراً على جدار المجتمع." 
        homeContent={homeContent} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: News feed, search, filters */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-900/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="ابحث في الأخبار والأحداث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
              />
              <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5 justify-start">
              {activeNewsCategories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-800 text-white shadow-sm' 
                        : 'bg-gray-50 hover:bg-emerald-50 text-gray-600 border border-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main News List */}
          <div className="space-y-6">
            {paginatedNews.length > 0 ? (
              paginatedNews.map((news) => (
                <motion.article
                  layoutId={`card-${news.id}`}
                  key={news.id}
                  id={news.id}
                  onClick={() => {
                    // Increment visual views locally
                    const updated = newsList.map(item => {
                      if (item.id === news.id) {
                        return { ...item, views: item.views + 1 };
                      }
                      return item;
                    });
                    setNewsList(updated);
                    setSelectedNews({ ...news, views: news.views + 1 });
                  }}
                  className="bg-white rounded-3xl overflow-hidden border border-amber-900/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row-reverse text-right cursor-pointer"
                >
                  {/* Image panel */}
                  <div className="w-full md:w-2/5 h-48 md:h-auto min-h-[180px] relative overflow-hidden bg-gray-100">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://picsum.photos/seed/qara_news/400/300";
                      }}
                    />
                    <span className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${getNewsBadgeColor(news.category)}`}>
                      {news.category}
                    </span>
                  </div>

                  {/* Text content */}
                  <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 text-xs text-gray-400 font-sans justify-start">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-amber-600" />
                          {news.date}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-emerald-800">بواسطة المكتب الإعلامي</span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 hover:text-emerald-800 transition-colors leading-snug">
                        {news.title}
                      </h3>

                      <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-3">
                        {news.content}
                      </p>
                    </div>

                    {/* Indicators footer */}
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between flex-row-reverse">
                      <div className="flex items-center gap-3 text-xs text-gray-400 font-sans">
                        <span className="flex items-center gap-1" title="المشاهدات">
                          <Eye className="h-4 w-4" />
                          {news.views}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-800" title="التعليقات">
                          <MessageSquare className="h-4 w-4" />
                          {news.comments.length}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleLike(news.id, e)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-100 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ThumbsUp className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        <span>أعجبني ({news.likes})</span>
                      </button>
                    </div>
                  </div>

                </motion.article>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-amber-900/5 shadow-sm text-gray-400">
                <p className="text-sm font-semibold">لم يتم العثور على أي أخبار تطابق بحثك أو التصنيف المحدد.</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white p-4 rounded-2xl border border-amber-900/5 shadow-sm flex items-center justify-center gap-2.5 font-sans" dir="rtl">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  currentPage === 1
                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                    : 'bg-white hover:bg-emerald-50 text-emerald-950 border-gray-200 hover:border-emerald-200 shadow-sm'
                }`}
                title="الصفحة السابقة"
              >
                <ChevronRight className="h-4 w-4" />
                <span>السابق</span>
              </button>

              <div className="flex items-center gap-1.5">
                {(() => {
                  return Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border flex items-center justify-center cursor-pointer ${
                          isActive
                            ? 'bg-emerald-800 text-white border-emerald-800 shadow-md'
                            : 'bg-white hover:bg-emerald-50 text-gray-700 border-gray-200 hover:border-emerald-200 shadow-sm'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  });
                })()}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  currentPage === totalPages
                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                    : 'bg-white hover:bg-emerald-50 text-emerald-950 border-gray-200 hover:border-emerald-200 shadow-sm'
                }`}
                title="الصفحة التالية"
              >
                <span>التالي</span>
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Community Announcements Bulletin & Publish Trigger */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CTA: Publish citizen Announcement */}
          <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-md border border-emerald-800 space-y-4">
            <div className="p-3 bg-emerald-950 text-amber-300 rounded-2xl w-fit">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-lg">منبر مناسبات وأخبار الأهالي</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              لديكم مناسبة اجتماعية، تهنئة بالنجاح، تبرعات خيرية، أو إعلان يخص أهالي قارة؟ شارك الخبر فوراً مع أبناء بلدتك لينشر على لوحة الإعلانات العامة.
            </p>
            <button
              onClick={() => setShowSuggestForm(true)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              انشر خبراً أو مناسبة اجتماعية
            </button>
          </div>

          {/* Bulletin Board list */}
          <div 
            className="p-6 rounded-3xl shadow-sm space-y-4"
            style={{ 
              backgroundColor: homeContent.communityBgColor || '#ffffff',
              border: `1px solid ${homeContent.communityBorderColor || 'rgba(120, 53, 4, 0.05)'}`
            }}
          >
            <h4 
              className="font-bold text-sm pb-3 border-b border-gray-100 flex items-center justify-between flex-row-reverse"
              style={{ color: homeContent.communityTitleColor || '#022c22' }}
            >
              <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold">مشاركة مجتمعية</span>
              <span>لوحة مناسبات الأهالي المباشرة</span>
            </h4>

            {/* Scrolling Ticker Box Container */}
            <div 
              className="relative overflow-hidden rounded-2xl pr-1"
              style={{ 
                height: `${homeContent.communityScrollHeight || 450}px`
              }}
            >
              {(() => {
                const approvedList = communityAnnouncements.filter(ann => ann.status !== 'pending');
                
                if (approvedList.length === 0) {
                  return (
                    <div className="py-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl h-full flex flex-col justify-center items-center">
                      <MessageSquare className="h-8 w-8 text-amber-300 opacity-60 mb-2" />
                      <p className="text-xs font-semibold">لم ينشر أي إعلانات مجتمعية معتمدة اليوم.</p>
                      <p className="text-[10px] text-gray-400 mt-1">المشاركات الجديدة بانتظار مراجعة الأدمن.</p>
                    </div>
                  );
                }

                // If we have items, we scroll them. Duplicate items if count is small so there is no gap in infinite scroll
                const tickerItems = approvedList.length < 4 
                  ? [...approvedList, ...approvedList, ...approvedList, ...approvedList]
                  : [...approvedList, ...approvedList];

                const paddingClass = {
                  '3': 'p-3',
                  '4': 'p-4',
                  '5': 'p-5',
                  '6': 'p-6'
                }[homeContent.communityItemPadding || '4'] || 'p-4';

                const fontSizeClass = {
                  'xs': 'text-xs',
                  'sm': 'text-sm',
                  'base': 'text-base'
                }[homeContent.communityItemFontSize || 'xs'] || 'text-xs';

                return (
                  <div 
                    className="animate-scrollUp flex flex-col gap-4 absolute w-full"
                    style={{ 
                      '--scroll-duration': `${homeContent.communityScrollSpeed || 15}s` 
                    } as React.CSSProperties}
                  >
                    {tickerItems.map((ann, idx) => (
                      <div 
                        key={`${ann.id}-${idx}`} 
                        className={`border rounded-2xl space-y-3 relative text-right transition-all hover:scale-[1.01] ${paddingClass} ${fontSizeClass}`}
                        style={{
                          backgroundColor: homeContent.communityItemBgColor || '#fffbeb',
                          borderColor: homeContent.communityBorderColor || '#fde68a',
                          color: homeContent.communityItemTextColor || '#4b5563'
                        }}
                      >
                        <span className="absolute top-4 left-4 text-[9px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-mono">خبر معتمد</span>
                        
                        <div className="space-y-1">
                          <h5 
                            className="font-bold max-w-[80%] leading-relaxed"
                            style={{ color: homeContent.communityItemTitleColor || '#111827' }}
                          >
                            {ann.title}
                          </h5>
                          <span 
                            className="text-[10px] font-mono flex items-center justify-end gap-1"
                            style={{ color: homeContent.communityDateColor || '#9ca3af' }}
                          >
                            {ann.date}
                            <Calendar className="h-3 w-3 inline text-amber-600" />
                          </span>
                        </div>

                        <p className="leading-relaxed font-sans whitespace-pre-line">
                          {ann.content}
                        </p>

                        <div className="flex items-center justify-between flex-row-reverse pt-2 border-t border-amber-900/5 text-[10px]">
                          <button 
                            onClick={(e) => handleLikeCommunity(ann.id, e)}
                            className="px-2.5 py-1 bg-white/75 hover:bg-white border border-amber-200 rounded-lg text-emerald-900 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Heart 
                              className="h-3 w-3 transition-colors" 
                              style={{ 
                                color: homeContent.communityHeartColor || '#ef4444', 
                                fill: homeContent.communityHeartColor || '#ef4444' 
                              }} 
                            />
                            <span>({ann.likes}) أعجبني</span>
                          </button>
                          <span className="font-semibold text-emerald-800">بواسطة: {ann.authorName || ann.authorName === "" ? ann.authorName : "مشارك من الأهالي"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            
            {/* User Friendly Ticker Speed Tip */}
            <p className="text-[10px] text-center text-gray-400 font-sans">
              * مرر الفأرة فوق الشريط المتحرك لإيقافه مؤقتاً وقراءة الأخبار بأريحية.
            </p>
          </div>

        </div>

      </div>

      {/* MODAL: SUGGEST/PUBLISH NEWS FORM (Surgical Interactive Block) */}
      <AnimatePresence>
        {showSuggestForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10"
            >
              
              <div className="p-6 bg-emerald-900 text-white flex justify-between items-center flex-row-reverse">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                  <h3 className="text-base sm:text-lg font-bold">إضافة خبر أو مناسبة أهلية</h3>
                </div>
                <button
                  onClick={() => setShowSuggestForm(false)}
                  className="p-1.5 rounded-full hover:bg-emerald-950/80 text-emerald-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {suggestSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                      <Send className="h-6 w-6 animate-pulse" />
                    </div>
                    <h4 className="font-bold text-lg text-emerald-950">تم نشر خبرك بنجاح!</h4>
                    <p className="text-xs text-gray-500">تم حفظ الإعلان وإدراجه على لوحة المناسبات المباشرة لأهالي قارة.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSuggestSubmit} className="space-y-4 text-right">
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">عنوان الخبر / المناسبة <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: تهنئة بتفوق الطالب سامر غانم بالشهادة الثانوية"
                        value={suggestTitle}
                        onChange={(e) => setSuggestTitle(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">تصنيف الإعلان</label>
                        <select
                          value={suggestCategory}
                          onChange={(e: any) => setSuggestCategory(e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        >
                          {activeNewsCategories.filter(c => c !== 'الكل').map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">اسم الناشر / المٌرسل <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: عائلة كرباج"
                          value={suggestAuthor}
                          onChange={(e) => setSuggestAuthor(e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">نص الخبر والتفاصيل الكاملة <span className="text-red-500">*</span></label>
                      <textarea
                        rows={4}
                        required
                        placeholder="اكتب هنا تفاصيل الخبر بالكامل، ومكان وتاريخ المناسبة والتهنئة..."
                        value={suggestContent}
                        onChange={(e) => setSuggestContent(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                      />
                    </div>

                    <div className="pt-3 flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        <span>نشر على لوحة الإعلانات</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSuggestForm(false)}
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

      {/* DETAILED NEWS VIEW WITH COMMENTS ENGAGEMENT ENGINE */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              layoutId={`card-${selectedNews.id}`}
              className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10 max-h-[90vh] flex flex-col"
            >
              
              {/* Image Banner */}
              <div className="h-56 sm:h-64 relative overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/qara_news/800/400";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                <button
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-4 left-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 right-4 text-right space-y-1">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shadow ${getNewsBadgeColor(selectedNews.category)}`}>
                    تصنيف {selectedNews.category}
                  </span>
                  <h3 className="text-white text-lg sm:text-xl font-bold font-sans drop-shadow">{selectedNews.title}</h3>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-right">
                
                {/* News details metadata */}
                <div className="flex items-center justify-between text-xs text-gray-400 font-sans border-b border-gray-100 pb-3 flex-row-reverse">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-amber-600" />
                    <span>تاريخ النشر: {selectedNews.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {selectedNews.views} مشاهدة
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                      {selectedNews.likes} إعجاب
                    </span>
                  </div>
                </div>

                {/* Main Content Text */}
                <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans border-b border-gray-100 pb-6">
                  {selectedNews.content}
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-950 text-sm flex items-center justify-end gap-1.5">
                    <span>التعليقات والمناقشات ({selectedNews.comments.length})</span>
                    <MessageSquare className="h-4 w-4 text-emerald-800" />
                  </h4>

                  {/* List */}
                  <div className="space-y-3">
                    {selectedNews.comments.length > 0 ? (
                      selectedNews.comments.map((comment) => {
                        const isBoardComment = !!(comment.authorBadge || comment.author.includes('الإدارة') || comment.author.includes('مدير الموقع'));
                        const canDelete = loggedCitizen?.isBoardMember || loggedCitizen?.isSiteManager;

                        return (
                          <div key={comment.id} className={`p-3 rounded-2xl space-y-1.5 text-right border ${isBoardComment ? 'bg-amber-50/60 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="flex items-center justify-between flex-row-reverse text-[10px]">
                              <div className="flex items-center gap-1.5 flex-row-reverse">
                                <span className="font-bold text-gray-900 flex items-center gap-1">
                                  <User className="h-3.5 w-3.5 text-gray-500" />
                                  {comment.author}
                                </span>
                                {isBoardComment && (
                                  <span className="bg-amber-200 text-amber-950 border border-amber-300 font-extrabold px-2 py-0.5 rounded-full text-[9px] shadow-xs flex items-center gap-0.5">
                                    <ShieldCheck className="h-3 w-3 text-amber-800 inline" />
                                    {comment.authorBadge || 'الإدارة 🛡️'}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-mono">{comment.date}</span>
                                {canDelete && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteComment(selectedNews.id, comment.id)}
                                    className="text-red-600 hover:text-red-800 font-bold text-[10px] bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-lg border border-red-200 transition-colors flex items-center gap-0.5 cursor-pointer"
                                    title="حذف هذا التعليق (صلاحيات الإدارة 🛡️)"
                                  >
                                    <Trash2 className="h-3 w-3 text-red-600" />
                                    <span>حذف التعليق</span>
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed font-sans">{comment.content}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-gray-400 py-3 text-center">لا توجد تعليقات بعد. اكتب تعليقاً وكن أول المشاركين!</p>
                    )}
                  </div>

                  {/* Comment Form */}
                  <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-900/5 space-y-3">
                    <span className="text-xs font-semibold text-emerald-900 block">أضف تعليقك على هذا الخبر</span>
                    <form onSubmit={handleAddComment} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="اسمك الكامل"
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                          className="w-full p-2.5 bg-white border border-gray-200 focus:border-emerald-700 rounded-xl outline-none text-xs text-right"
                        />
                        <p className="text-[10px] text-gray-400 flex items-center justify-end text-right">يرجى كتابة تعليقات ملائمة ومسؤولة تخص أهالي قارة</p>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="اكتب تعليقك هنا..."
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          className="w-full pr-3 pl-11 py-2.5 bg-white border border-gray-200 focus:border-emerald-700 rounded-xl outline-none text-xs text-right"
                        />
                        <button
                          type="submit"
                          className="absolute left-2 top-1.5 p-1.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </form>
                  </div>

                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
