import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Moon, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  UserCheck, 
  Calendar, 
  Award, 
  BookOpen,
  Info,
  Unlock,
  Eye,
  Clock,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Volume2,
  Pin
} from 'lucide-react';
import { RamadanQuestion, RamadanCompetitionSettings, RamadanUserAnswer, CitizenUser, RamadanSponsorAd } from '../types';

interface RamadanCompetitionTabProps {
  settings: RamadanCompetitionSettings;
  questions: RamadanQuestion[];
  answers: RamadanUserAnswer[];
  setAnswers: React.Dispatch<React.SetStateAction<RamadanUserAnswer[]>>;
  loggedCitizen: CitizenUser | null;
  onOpenAuthModal: () => void;
}

// ---------------------------------------------------------------------------
// Helper: Ramadan Day Question Title Formatting (1..10 Arabic words, 11+ Numbers)
// ---------------------------------------------------------------------------
const getRamadanDayQuestionTitle = (dayNum: number): string => {
  const wordDays: Record<number, string> = {
    1: 'الأول',
    2: 'الثاني',
    3: 'الثالث',
    4: 'الرابع',
    5: 'الخامس',
    6: 'السادس',
    7: 'السابع',
    8: 'الثامن',
    9: 'التاسع',
    10: 'العاشر'
  };

  if (dayNum >= 1 && dayNum <= 10) {
    return `سؤال اليوم ${wordDays[dayNum]} من رمضان`;
  }
  return `سؤال اليوم ${dayNum} من رمضان`;
};

// ---------------------------------------------------------------------------
// Festive Hanging Ramadan Lanterns Component (فوانيس رمضانية متحركة)
// ---------------------------------------------------------------------------
const RamadanLanterns = () => {
  return (
    <div className="absolute top-0 inset-x-0 pointer-events-none z-20 flex justify-between px-4 sm:px-12 overflow-hidden h-36">
      {/* Right Hanging Lantern */}
      <motion.div
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="origin-top flex flex-col items-center -mt-2"
      >
        {/* Hanging Rope */}
        <div className="w-0.5 h-10 sm:h-14 bg-gradient-to-b from-amber-200 to-amber-500/80"></div>
        {/* Top Cap */}
        <div className="w-6 h-3 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 rounded-t-full shadow-sm"></div>
        {/* Lantern Body */}
        <div className="relative w-10 h-14 bg-gradient-to-b from-amber-500 via-amber-300 to-amber-600 rounded-lg border border-amber-200/90 shadow-[0_0_22px_rgba(251,191,36,0.7)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-1 bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-400 rounded opacity-90 animate-pulse"></div>
          <Moon className="h-5 w-5 text-amber-950 relative z-10 opacity-80" />
        </div>
        {/* Bottom Ring & Tassel */}
        <div className="w-5 h-2 bg-amber-600 rounded-b-md shadow"></div>
        <div className="w-1 h-4 bg-amber-400"></div>
      </motion.div>

      {/* Center Floating Crescent Lantern (hidden on small screens) */}
      <motion.div
        animate={{ rotate: [3, -3, 3], y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="origin-top hidden md:flex flex-col items-center -mt-4"
      >
        <div className="w-0.5 h-16 bg-gradient-to-b from-amber-200 to-amber-500/80"></div>
        <div className="w-5 h-2.5 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 rounded-t-full"></div>
        <div className="relative w-8 h-12 bg-gradient-to-b from-amber-500 via-amber-300 to-amber-600 rounded-md border border-amber-200/80 shadow-[0_0_18px_rgba(251,191,36,0.6)] flex items-center justify-center">
          <div className="absolute inset-1 bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-400 rounded opacity-90 animate-pulse"></div>
          <Sparkles className="h-4 w-4 text-amber-950 relative z-10 opacity-80" />
        </div>
        <div className="w-4 h-1.5 bg-amber-600 rounded-b-md"></div>
        <div className="w-0.5 h-3 bg-amber-400"></div>
      </motion.div>

      {/* Left Hanging Lantern */}
      <motion.div
        animate={{ rotate: [4, -4, 4] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="origin-top flex flex-col items-center -mt-1"
      >
        <div className="w-0.5 h-12 sm:h-16 bg-gradient-to-b from-amber-200 to-amber-500/80"></div>
        <div className="w-6 h-3 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 rounded-t-full"></div>
        <div className="relative w-10 h-14 bg-gradient-to-b from-amber-500 via-amber-300 to-amber-600 rounded-lg border border-amber-200/90 shadow-[0_0_22px_rgba(251,191,36,0.7)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-1 bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-400 rounded opacity-90 animate-pulse"></div>
          <Moon className="h-5 w-5 text-amber-950 relative z-10 opacity-80" />
        </div>
        <div className="w-5 h-2 bg-amber-600 rounded-b-md shadow"></div>
        <div className="w-1 h-4 bg-amber-400"></div>
      </motion.div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Animated Continuous Vertical News Ticker Sponsor Ads Card
// (الشريط الإخباري للرعاة - حركة مستمرة من الأسفل للأعلى بدون أزرار يدويّة)
// ---------------------------------------------------------------------------
const RamadanSponsorVerticalCard = ({ 
  sponsors, 
  autoSlideInterval = 12,
  cardStyle = 'site_emerald',
  headerTitle,
  badgeText
}: { 
  sponsors?: RamadanSponsorAd[]; 
  autoSlideInterval?: number;
  cardStyle?: 'site_emerald' | 'soft_cream' | 'modern_slate' | 'heritage_amber' | 'minimal_white';
  headerTitle?: string;
  badgeText?: string;
}) => {
  const activeSponsors = (sponsors || []).filter(s => s.isActive !== false);
  const pinnedSponsor = activeSponsors.find(s => s.isPinned === true);
  const tickerSponsors = activeSponsors.filter(s => s.id !== pinnedSponsor?.id);

  const [isPaused, setIsPaused] = useState(false);

  if (activeSponsors.length === 0) return null;

  // Duplicate list to achieve continuous 100% smooth infinite marquee loop
  const loopItems = tickerSponsors.length > 0 
    ? (tickerSponsors.length < 3 ? [...tickerSponsors, ...tickerSponsors, ...tickerSponsors, ...tickerSponsors] : [...tickerSponsors, ...tickerSponsors])
    : [];

  const animDuration = Math.max(10, tickerSponsors.length * (autoSlideInterval || 10));

  // Determine styling based on cardStyle template
  const isCream = cardStyle === 'soft_cream';
  const isMinimal = cardStyle === 'minimal_white';
  const isSlate = cardStyle === 'modern_slate';
  const isHeritage = cardStyle === 'heritage_amber';
  const isLight = isCream || isMinimal;

  // Outer container theme
  const containerTheme = isCream
    ? 'bg-gradient-to-b from-amber-50/95 via-stone-50 to-emerald-50/90 text-slate-900 border-amber-300 shadow-xl'
    : isMinimal
    ? 'bg-white text-emerald-950 border-emerald-200/90 shadow-xl'
    : isSlate
    ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/80 text-white border-amber-500/30 shadow-2xl'
    : isHeritage
    ? 'bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 text-amber-50 border-amber-500/50 shadow-2xl'
    : 'bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white border-amber-400/40 shadow-2xl'; // site_emerald

  // Item box theme
  const itemTheme = isCream
    ? 'bg-white/95 border-amber-200 text-slate-800 hover:border-emerald-600/50 shadow-md'
    : isMinimal
    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:border-emerald-400 shadow-sm'
    : isSlate
    ? 'bg-slate-900/90 border-amber-500/30 text-slate-100 hover:border-amber-400/70 shadow-lg'
    : isHeritage
    ? 'bg-stone-900/90 border-amber-500/40 text-amber-100 hover:border-amber-300 shadow-lg'
    : 'bg-emerald-900/80 border-emerald-500/40 text-emerald-50 hover:border-amber-400/70 shadow-lg'; // site_emerald

  // Pinned box theme
  const pinnedTheme = isLight
    ? 'bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border-amber-400 shadow-md text-slate-900'
    : 'bg-gradient-to-r from-amber-500/25 via-emerald-900/90 to-amber-500/25 border-amber-400/80 shadow-lg text-white';

  return (
    <div 
      className={`h-full min-h-[460px] rounded-3xl overflow-hidden ${containerTheme} p-4 sm:p-5 flex flex-col justify-between relative text-right transition-all duration-300 group/container`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Subtle Ramadan Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:18px_18px] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 space-y-3 flex-1 flex flex-col">
        {/* Header Title (Clean without manual chevron buttons) */}
        <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-amber-200' : 'border-amber-500/30'}`}>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span className={`text-xs font-black font-sans tracking-wide ${isLight ? 'text-emerald-900' : 'text-amber-300'}`}>
              {headerTitle || '📢 الشريط الإخباري لرعاة المسابقة'}
            </span>
          </div>

          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
            isLight ? 'bg-amber-100 text-emerald-950 border border-amber-300' : 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
          }`}>
            <span className="animate-pulse">🟢</span>
            <span>مباشر</span>
          </span>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 1. PINNED SPONSOR SECTION (إعلان مثبّت رئيسي)                   */}
        {/* ---------------------------------------------------------------- */}
        {pinnedSponsor && (
          <div className={`p-3.5 rounded-2xl border ${pinnedTheme} relative space-y-2 shrink-0 shadow-md`}>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-sm">
                <Pin className="h-3 w-3 fill-slate-950" />
                <span>إعلان مثبّت 📌</span>
              </span>
              <span 
                className="px-2 py-0.5 rounded-full text-[10px] font-black text-slate-950 shadow-sm"
                style={{ backgroundColor: pinnedSponsor.badgeBgColor || '#fbbf24' }}
              >
                {pinnedSponsor.sponsorType || 'الراعي الرئيسي'}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className={`text-sm font-black leading-snug ${isLight ? 'text-amber-950' : 'text-amber-200'}`}>
                {pinnedSponsor.title}
              </h4>
              {pinnedSponsor.description && (
                <p className={`text-xs leading-relaxed line-clamp-2 font-sans ${isLight ? 'text-slate-700' : 'text-emerald-100/90'}`}>
                  {pinnedSponsor.description}
                </p>
              )}
            </div>

            {pinnedSponsor.imageUrl && (
              <div className="w-full h-24 rounded-xl overflow-hidden border border-amber-400/40 relative bg-slate-950">
                <img 
                  src={pinnedSponsor.imageUrl} 
                  alt={pinnedSponsor.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
              </div>
            )}

            {pinnedSponsor.linkUrl && (
              <div className="pt-1">
                <a
                  href={pinnedSponsor.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl shadow transition-all cursor-pointer"
                >
                  <span>{pinnedSponsor.buttonText || "التواصل والمعلومات الإضافية"}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* 2. CONTINUOUS VERTICAL TICKER MARQUEE (من الأسفل إلى الأعلى)    */}
        {/* ---------------------------------------------------------------- */}
        {tickerSponsors.length > 0 && (
          <div className="flex-1 relative overflow-hidden min-h-[250px] max-h-[380px] rounded-2xl">
            {/* Top & Bottom Ambient Gradient Masks */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-950/40 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-950/40 to-transparent z-20 pointer-events-none"></div>

            <motion.div
              animate={isPaused ? undefined : { y: ['0%', '-50%'] }}
              transition={{
                repeat: Infinity,
                repeatType: 'loop',
                duration: animDuration,
                ease: 'linear'
              }}
              className="space-y-3 pb-3 pt-1"
            >
              {loopItems.map((sponsor, idx) => (
                <div
                  key={`${sponsor.id || idx}_loop_${idx}`}
                  className={`p-3.5 rounded-2xl border ${itemTheme} transition-all text-right space-y-2 relative group hover:scale-[1.01]`}
                >
                  {/* Sponsor Type Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-black text-slate-950 shadow-sm"
                      style={{ backgroundColor: sponsor.badgeBgColor || '#fbbf24' }}
                    >
                      {sponsor.sponsorType || 'راعي المسابقة الرمضانية'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h4 className={`text-xs sm:text-sm font-black leading-snug transition-colors ${
                      isLight ? 'text-slate-900 group-hover:text-emerald-800' : 'text-amber-100 group-hover:text-amber-300'
                    }`}>
                      {sponsor.title}
                    </h4>
                    {sponsor.description && (
                      <p className={`text-xs leading-relaxed line-clamp-2 font-sans ${
                        isLight ? 'text-slate-600' : 'text-emerald-100/90'
                      }`}>
                        {sponsor.description}
                      </p>
                    )}
                  </div>

                  {/* Sponsor Image */}
                  {sponsor.imageUrl && (
                    <div className="w-full h-20 rounded-xl overflow-hidden border border-amber-400/30 relative group-hover:border-amber-400/60 transition-all bg-slate-950">
                      <img 
                        src={sponsor.imageUrl} 
                        alt={sponsor.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                    </div>
                  )}

                  {/* Optional Link Button */}
                  {sponsor.linkUrl && (
                    <div className="pt-1">
                      <a
                        href={sponsor.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl shadow transition-all cursor-pointer"
                      >
                        <span>{sponsor.buttonText || "التواصل والمعلومات الإضافية"}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className={`flex items-center justify-between pt-3 border-t relative z-10 mt-auto ${isLight ? 'border-amber-200' : 'border-amber-500/20'}`}>
        <span className={`text-[10px] font-sans font-bold flex items-center gap-1.5 ${isLight ? 'text-emerald-950' : 'text-amber-200/90'}`}>
          {isPaused ? '⏸️ متوقف (وجه المؤشر للمتابعة)' : (badgeText || '▲ شريط إخباري متحرك مستمر')}
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Ramadan Competition Component
// ---------------------------------------------------------------------------
export default function RamadanCompetitionTab({
  settings,
  questions,
  answers,
  setAnswers,
  loggedCitizen,
  onOpenAuthModal
}: RamadanCompetitionTabProps) {
  // Automatic Day Progression Calculation
  const calculateCurrentRamadanDay = () => {
    if (settings.autoAdvanceDays === false || !settings.startDate) {
      return { 
        day: settings.activeDay || 1, 
        isStarted: true, 
        diffDays: 0, 
        formattedDate: settings.startDate || '' 
      };
    }

    const start = new Date(settings.startDate);
    if (isNaN(start.getTime())) {
      return { 
        day: settings.activeDay || 1, 
        isStarted: true, 
        diffDays: 0, 
        formattedDate: settings.startDate || '' 
      };
    }

    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());

    const diffTime = todayDate.getTime() - startDateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24)) + 1;

    if (diffDays < 1) {
      return { 
        day: 1, 
        isStarted: false, 
        diffDays, 
        formattedDate: settings.startDate 
      };
    } else if (diffDays > 30) {
      return { 
        day: 30, 
        isStarted: true, 
        diffDays, 
        formattedDate: settings.startDate 
      };
    } else {
      return { 
        day: diffDays, 
        isStarted: true, 
        diffDays, 
        formattedDate: settings.startDate 
      };
    }
  };

  const dayInfo = calculateCurrentRamadanDay();
  const activeDayNum = Math.min(Math.max(dayInfo.day, 1), 30);

  // Selected day for viewing question (defaults to activeDay)
  const [selectedDay, setSelectedDay] = useState<number>(activeDayNum);

  // Sync selected day whenever activeDayNum updates automatically
  useEffect(() => {
    setSelectedDay(activeDayNum);
  }, [activeDayNum, settings.startDate]);

  // Currently selected option index in the form before submitting
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [lastSubmittedResult, setLastSubmittedResult] = useState<{ isCorrect: boolean; selectedText: string; correctText: string } | null>(null);

  // Theme helper
  const theme = settings.themeStyle || 'site_emerald';
  const cardTemplate = settings.cardTemplate || 'model_emerald_islamic';

  // Helper to check if a specific day is unlocked for answering
  const isDayUnlockedForAnswer = (dayNum: number): boolean => {
    if (dayNum === activeDayNum) return true;
    if (settings.allowSecondChanceForPastDays) return true;
    if (settings.showQuestionsHistory) return true;
    if (settings.unlockedDays && settings.unlockedDays.includes(dayNum)) return true;
    return false;
  };

  // Get question for selected day
  const currentQuestion: RamadanQuestion = questions.find(q => q.dayNumber === selectedDay) || {
    id: `ram_q_${selectedDay}`,
    dayNumber: selectedDay,
    title: `سؤال اليوم ${selectedDay} من شهر رمضان المبارك 🌙`,
    questionText: `لم يتم إضافة سؤال اليوم ${selectedDay} بعد من قبل إدارة المنصة.`,
    options: ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    category: "مسابقة رمضان",
       explanation: "سيتم إتاحة السؤال قريباً.",
    isActive: true
  };

  // Visible options count
  const visibleCount = Math.min(Math.max(currentQuestion.visibleOptionsCount || 4, 2), 5);
  const displayOptions = currentQuestion.options.slice(0, visibleCount);

  // Find if current logged citizen has already answered this question
  const existingAnswer = loggedCitizen
    ? answers.find(a => a.userId === loggedCitizen.id && a.dayNumber === selectedDay)
    : null;

  // Calculate user stats
  const userAnswers = loggedCitizen
    ? answers.filter(a => a.userId === loggedCitizen.id)
    : [];
  const totalUserAnswers = userAnswers.length;
  const correctUserAnswers = userAnswers.filter(a => a.isCorrect).length;

  const optionLetters = ['أ', 'ب', 'ج', 'د', 'هـ'];

  // Helper to parse "HH:MM ص/م" to total minutes
  const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    let cleanStr = timeStr;
    arabicDigits.forEach((digit, idx) => {
      cleanStr = cleanStr.replaceAll(digit, String(idx));
    });

    const isPM = cleanStr.includes('م') || cleanStr.toLowerCase().includes('pm');
    const isAM = cleanStr.includes('ص') || cleanStr.toLowerCase().includes('am');

    const match = cleanStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return 0;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  // Helper for real synchronized Hijri date + offset calculation
  const getRealHijriDate = (offsetDays: number = 0, defaultHijriYear: string = '1448 هـ') => {
    const now = new Date();
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const dayName = days[now.getDay()] || 'اليوم';

    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const gregorianStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} م`;

    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + (offsetDays || 0));

    let hijriStr = '';
    try {
      const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      hijriStr = formatter.format(targetDate);
    } catch (e) {
      try {
        const fallbackFormatter = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        hijriStr = fallbackFormatter.format(targetDate);
      } catch (e2) {
        hijriStr = `اليوم الهجري (${defaultHijriYear})`;
      }
    }

    return {
      dayName,
      gregorianStr,
      hijriStr,
      offsetDays: offsetDays || 0
    };
  };

  const pSchedule = settings.prayerSchedule || {
    fajr: "04:35 ص",
    dhuhr: "12:35 م",
    asr: "03:50 م",
    maghrib: "06:45 م",
    isha: "08:15 م"
  };

  const getUpcomingPrayer = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const times = [
      { name: 'صلاة الفجر', timeStr: pSchedule.fajr, minutes: parseTimeToMinutes(pSchedule.fajr) },
      { name: 'صلاة الظهر', timeStr: pSchedule.dhuhr, minutes: parseTimeToMinutes(pSchedule.dhuhr) },
      { name: 'صلاة العصر', timeStr: pSchedule.asr, minutes: parseTimeToMinutes(pSchedule.asr) },
      { name: 'صلاة المغرب', timeStr: pSchedule.maghrib, minutes: parseTimeToMinutes(pSchedule.maghrib) },
      { name: 'صلاة العشاء', timeStr: pSchedule.isha, minutes: parseTimeToMinutes(pSchedule.isha) },
    ];

    const upcoming = times.find(p => p.minutes > currentMinutes);
    if (upcoming) return upcoming;
    return { name: 'صلاة الفجر (غداً)', timeStr: pSchedule.fajr, minutes: parseTimeToMinutes(pSchedule.fajr) };
  };

  const upcomingPrayer = getUpcomingPrayer();
  const realHijriInfo = getRealHijriDate(settings.hijriDayOffset, settings.hijriYear);
  const cityStr = settings.prayerTimesCity || 'بلدة قارة - القلمون';

  const handleSubmitAnswer = () => {
    if (!loggedCitizen) {
      onOpenAuthModal();
      return;
    }

    if (selectedOption === null) return;

    setIsSubmitting(true);

    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    const selectedText = displayOptions[selectedOption] || '';
    const correctText = displayOptions[currentQuestion.correctOptionIndex] || '';

    const newAnswer: RamadanUserAnswer = {
      id: `ans_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: loggedCitizen.id,
      userName: loggedCitizen.fullName,
      userUsername: loggedCitizen.email,
      questionId: currentQuestion.id,
      dayNumber: selectedDay,
      selectedOptionIndex: selectedOption,
      selectedOption: selectedText,
      isCorrect,
      pointsEarned: isCorrect ? 10 : 0,
      submittedAt: new Date().toISOString()
    };

    setTimeout(() => {
      setAnswers(prev => {
        const filtered = prev.filter(a => !(a.userId === loggedCitizen.id && a.dayNumber === selectedDay));
        return [newAnswer, ...filtered];
      });

      setLastSubmittedResult({ isCorrect, selectedText, correctText });
      setShowSuccessModal(true);
      setIsSubmitting(false);
      setSelectedOption(null);
    }, 400);
  };

  const isUnlocked = isDayUnlockedForAnswer(selectedDay);

  // Visual Theme Dynamic Styles
  const isNight = theme === 'ramadan_night';
  const isAmber = theme === 'amber_gold';
  const isCream = theme === 'emerald_cream';

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden ${
      isNight ? 'bg-slate-900 text-slate-100 border-t-4 border-amber-500' :
      isAmber ? 'bg-amber-50/40 text-stone-900 border-t-4 border-amber-600' :
      isCream ? 'bg-amber-50/60 text-slate-900 border-t-4 border-amber-600' :
      'bg-slate-50 text-slate-900 border-t-4 border-emerald-600'
    }`} dir="rtl">

      {/* Background Decor Ambient Glowing Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-32"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10 pt-4">
        
        {/* Top Header Section: Main Banner + Left Vertical Sponsor Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Banner Header (Right Side in RTL) */}
          <div className={`${
            settings.sponsorAdsEnabled !== false && (settings.sponsorsList || []).length > 0 
              ? 'lg:col-span-8' 
              : 'lg:col-span-12'
          } rounded-3xl p-6 sm:p-8 shadow-xl text-right relative overflow-hidden flex flex-col justify-between ${
            isNight ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950 text-white border border-amber-500/30' :
            isAmber ? 'bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-amber-50 border border-amber-500/40' :
            isCream ? 'bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-950 text-white border border-amber-400/30' :
            'bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white border border-emerald-700'
          }`}>
            <div className="absolute top-3 left-4 opacity-15 pointer-events-none">
              <Moon className="h-40 w-40 text-amber-300" />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                  <Moon className="h-4 w-4 animate-pulse text-amber-400" />
                  <span>{settings.badgeText || "رمضان مبارك 1448 هـ - بلدة قارة"}</span>
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                </div>

                <h1 
                  className={`${settings.titleFontSize || 'text-2xl sm:text-3xl lg:text-4xl'} font-extrabold leading-tight transition-all`}
                  style={{ color: settings.titleTextColor || '#fef3c7' }}
                >
                  {settings.title || "المسابقة الرمضانية الكبرى لبلدة قارة"}
                </h1>

                {settings.welcomeTitle && (
                  <p className="text-sm sm:text-base font-bold text-emerald-200">
                    {settings.welcomeTitle}
                  </p>
                )}

                <p 
                  className="text-xs sm:text-sm leading-relaxed font-medium transition-all"
                  style={{ color: settings.subtitleTextColor || '#a7f3d0' }}
                >
                  {settings.welcomeMessage || settings.subtitle || "سؤال يومي ثقافي وديني وإيماني، شارك إجابتك واختبر معلوماتك مع أهالي قارة والمغتربين."}
                </p>

                {/* Banner Launch Date & Custom Banner Content Container */}
                <div className="flex flex-col gap-2 mt-2 font-sans">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs rounded-xl">
                    <Calendar className="h-4 w-4 text-amber-400 shrink-0" />
                    {dayInfo.isStarted ? (
                      <span>الانتقال آلياً مفعّل حسب تقويم لجان قارة 🟢 (اليوم الحالي: <strong>{activeDayNum} رمضان</strong>)</span>
                    ) : (
                      <span>تاريخ الانطلاق المحدد: <strong>{settings.launchDateCustomLabel || settings.startDate || "الإثنين 8 فبراير 2027 م (الموافق 1 رمضان 1448 هـ)"}</strong></span>
                    )}
                  </div>

                  {/* Custom Header Banner Subtitle if provided */}
                  {settings.headerBannerSubtitle && (
                    <p className="text-xs sm:text-sm text-amber-100/90 bg-black/25 p-3 rounded-2xl border border-amber-400/30 leading-relaxed font-sans shadow-inner">
                      {settings.headerBannerSubtitle}
                    </p>
                  )}

                  {/* Custom Header Banner Image if provided */}
                  {settings.headerBannerImageUrl && (
                    <div className="mt-1 rounded-2xl overflow-hidden border border-amber-400/30 shadow-lg max-h-56">
                      <img 
                        src={settings.headerBannerImageUrl} 
                        alt="بنر المسابقة الرمضانية" 
                        className="w-full h-auto object-cover max-h-56" 
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* DYNAMIC PRAYER TIMES & AUTOMATIC TODAY DATE CARD */}
              <div className={`w-full md:w-[320px] shrink-0 rounded-2xl p-4 text-right backdrop-blur-md shadow-lg border relative overflow-hidden ${
                isNight ? 'bg-slate-900/90 border-amber-500/30 text-slate-100' :
                'bg-emerald-950/90 border-emerald-600/70 text-white'
              }`}>
                {/* Top row: Day Name & Synchronized Hijri Date + Gregorian */}
                <div className="flex flex-col gap-1 border-b border-white/10 pb-2 mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-amber-300 font-extrabold">
                      <Calendar className="h-4 w-4 text-amber-400 animate-pulse shrink-0" />
                      <span>{realHijriInfo.dayName}، {realHijriInfo.hijriStr}</span>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold shrink-0">
                      {cityStr}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-emerald-200/90 font-sans">
                    <span>التاريخ الميلادي: <strong>{realHijriInfo.gregorianStr}</strong></span>
                    {realHijriInfo.offsetDays !== 0 && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-bold">
                        معدّل رؤية الهلال ({realHijriInfo.offsetDays > 0 ? `+${realHijriInfo.offsetDays}` : realHijriInfo.offsetDays} يوم)
                      </span>
                    )}
                  </div>
                </div>

                {/* Highlighted Upcoming Prayer */}
                <div className="bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 rounded-xl p-2.5 mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-300 shrink-0" />
                    <div>
                      <span className="text-[10px] text-amber-200 block font-medium">الصلاة القادمة:</span>
                      <strong className="text-xs font-black text-amber-100">{upcomingPrayer.name}</strong>
                    </div>
                  </div>
                  <span className="text-xs font-black font-mono bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg shadow-sm">
                    {upcomingPrayer.timeStr}
                  </span>
                </div>

                {/* Grid of All 5 Prayers */}
                <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
                  <div className={`p-1.5 rounded-lg border ${upcomingPrayer.name.includes('الفجر') ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow' : 'bg-black/30 border-white/10 text-emerald-100'}`}>
                    <span className="block text-[9px] font-sans opacity-80">الفجر</span>
                    <span>{pSchedule.fajr}</span>
                  </div>
                  <div className={`p-1.5 rounded-lg border ${upcomingPrayer.name.includes('الظهر') ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow' : 'bg-black/30 border-white/10 text-emerald-100'}`}>
                    <span className="block text-[9px] font-sans opacity-80">الظهر</span>
                    <span>{pSchedule.dhuhr}</span>
                  </div>
                  <div className={`p-1.5 rounded-lg border ${upcomingPrayer.name.includes('العصر') ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow' : 'bg-black/30 border-white/10 text-emerald-100'}`}>
                    <span className="block text-[9px] font-sans opacity-80">العصر</span>
                    <span>{pSchedule.asr}</span>
                  </div>
                  <div className={`p-1.5 rounded-lg border ${upcomingPrayer.name.includes('المغرب') ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow' : 'bg-black/30 border-white/10 text-emerald-100'}`}>
                    <span className="block text-[9px] font-sans opacity-80">المغرب</span>
                    <span>{pSchedule.maghrib}</span>
                  </div>
                  <div className={`p-1.5 rounded-lg border ${upcomingPrayer.name.includes('العشاء') ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow' : 'bg-black/30 border-white/10 text-emerald-100'}`}>
                    <span className="block text-[9px] font-sans opacity-80">العشاء</span>
                    <span>{pSchedule.isha}</span>
                  </div>
                </div>

                {/* Login Status bar */}
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  {loggedCitizen ? (
                    <div className="flex items-center justify-between w-full text-xs font-bold text-amber-300">
                      <span className="flex items-center gap-1">
                        <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{loggedCitizen.fullName}</span>
                      </span>
                      <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-md text-emerald-300 font-mono">
                        {correctUserAnswers} إجابة صحيحة ✨
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={onOpenAuthModal}
                      className="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] rounded-lg shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>تسجيل الدخول للإجابة وتوثيق النتائج 🔑</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Banner Notice */}
            {settings.bannerNotice && (
              <div className="mt-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{settings.bannerNotice}</span>
              </div>
            )}
          </div>

          {/* Vertical Sponsor Card on the LEFT (in RTL) */}
          {settings.sponsorAdsEnabled !== false && (settings.sponsorsList || []).length > 0 && (
            <div className="lg:col-span-4 h-full">
              <RamadanSponsorVerticalCard 
                sponsors={settings.sponsorsList} 
                autoSlideInterval={settings.sponsorAdsAutoSlideInterval || 12} 
                cardStyle={settings.sponsorAdsCardStyle || 'site_emerald'}
                headerTitle={settings.sponsorAdsHeaderTitle}
                badgeText={settings.sponsorAdsBadgeText}
              />
            </div>
          )}

        </div>

        {/* Day Navigation Selector Bar */}
        {settings.showQuestionsHistory ? (
          <div className={`rounded-2xl p-4 shadow-md text-right space-y-3 ${
            isNight ? 'bg-slate-800/90 border border-slate-700/80 text-slate-100' :
            'bg-white border border-emerald-200 text-slate-800'
          }`}>
            <div className="flex justify-between items-center flex-row-reverse text-xs font-bold text-emerald-800">
              <span className="flex items-center gap-1.5 text-amber-600">
                <Calendar className="h-4 w-4 text-amber-500" />
                <span>سجل أسئلة شهر رمضان (انقر لاختيار اليوم):</span>
              </span>
              <span className="text-slate-500 text-[11px]">
                اليوم النشط حالياً: <strong className="text-emerald-700 font-bold">{activeDayNum} رمضان</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-transparent">
              {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                const isCurrentActive = day === activeDayNum;
                const isSelected = day === selectedDay;
                const unlocked = isDayUnlockedForAnswer(day);
                
                const dayAnswer = loggedCitizen
                  ? answers.find(a => a.userId === loggedCitizen.id && a.dayNumber === day)
                  : null;

                return (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      setSelectedOption(null);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs transition-all shrink-0 cursor-pointer flex flex-col items-center justify-center min-w-[62px] border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md scale-105'
                        : isCurrentActive
                        ? 'bg-emerald-800 text-white border-emerald-700 font-bold'
                        : unlocked
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-[13px] font-black font-mono leading-none">{day}</span>
                    <span className="text-[10px] font-bold opacity-90 mt-0.5">رمضان</span>
                    
                    {dayAnswer ? (
                      <span className={`w-2 h-2 rounded-full mt-1 ${dayAnswer.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    ) : isCurrentActive ? (
                      <span className="w-2 h-2 rounded-full mt-1 bg-amber-400 animate-ping"></span>
                    ) : unlocked ? (
                      <span className="w-1.5 h-1.5 rounded-full mt-1 bg-emerald-400"></span>
                    ) : (
                      <Lock className="h-2.5 w-2.5 text-slate-400 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className={`rounded-2xl p-4 shadow-md text-right flex flex-col sm:flex-row justify-between items-center gap-3 ${
            isNight ? 'bg-slate-800/90 border border-slate-700/80 text-slate-100' :
            'bg-emerald-900 text-white border border-emerald-700'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex flex-col items-center justify-center text-xs shadow-md">
                <span className="text-sm font-mono leading-none">{activeDayNum}</span>
                <span className="text-[9px] font-extrabold">رمضان</span>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-amber-300">
                  سؤال اليوم النشط: {activeDayNum} رمضان المبارك 🌙
                </h3>
                <p className="text-[11px] text-emerald-100/80">
                  السؤال والإجابة متاحان لهذا اليوم تلقائياً حتى يتجاوز التاريخ اليوم الفعلي.
                </p>
              </div>
            </div>

            <div className="text-[11px] font-bold bg-emerald-950/80 border border-emerald-700 px-3.5 py-1.5 rounded-full text-amber-200 flex items-center gap-1.5 shrink-0">
              <Calendar className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>يتغير السؤال تلقائياً مع تبديل التاريخ الفعلي</span>
            </div>
          </div>
        )}

        {/* Question Card Block */}
        <div className={`rounded-3xl p-6 sm:p-8 shadow-xl text-right relative overflow-hidden transition-all duration-300 border ${
          cardTemplate === 'model_gold_arch'
            ? 'bg-gradient-to-b from-stone-900 via-amber-950 to-stone-900 text-amber-50 border-amber-500/50'
            : cardTemplate === 'model_royal_cream'
            ? 'bg-amber-50/90 text-stone-900 border-amber-300 shadow-amber-200/50'
            : cardTemplate === 'model_modern_night'
            ? 'bg-slate-900 text-slate-100 border-slate-700'
            : 'bg-white text-slate-900 border-emerald-200'
        }`}>
          
          {/* Question Header */}
          <div className="flex items-center justify-between border-b border-gray-200/20 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-500 shrink-0" />
              <span 
                className="text-base sm:text-lg font-black text-amber-800 dark:text-amber-300"
                style={{ color: settings.cardHeaderBadgeColor || undefined }}
              >
                {getRamadanDayQuestionTitle(selectedDay)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Moon className="h-3.5 w-3.5 text-amber-500" />
                <span>رمضان المبارك</span>
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-4 mb-8">
            <h2 
              className="text-lg sm:text-2xl font-black leading-snug"
              style={{ color: settings.cardQuestionTextColor || undefined }}
            >
              {currentQuestion.questionText}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-3 mb-8">
            {displayOptions.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const letter = optionLetters[idx] || `${idx + 1}`;

              let optionStyle = 'border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-gray-800 dark:text-gray-200';
              
              if (existingAnswer) {
                const isUserChoice = existingAnswer.selectedOptionIndex === idx;
                const isCorrectChoice = idx === currentQuestion.correctOptionIndex;

                if (isUserChoice && existingAnswer.isCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-extrabold';
                } else if (isUserChoice && !existingAnswer.isCorrect) {
                  optionStyle = 'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-300 font-extrabold';
                } else if (isCorrectChoice) {
                  optionStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold';
                } else {
                  optionStyle = 'border-gray-200/50 opacity-60 text-gray-400';
                }
              } else if (isSelected) {
                optionStyle = 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-extrabold ring-2 ring-amber-400/40';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={!!existingAnswer || !isUnlocked}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyle} ${
                    (!existingAnswer && isUnlocked) ? 'transform hover:-translate-y-0.5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected 
                        ? 'bg-amber-500 text-slate-950 font-black' 
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
                    }`}>
                      {letter}
                    </span>
                    <span className="text-sm font-bold leading-relaxed">{opt}</span>
                  </div>

                  {existingAnswer && (
                    <div>
                      {existingAnswer.selectedOptionIndex === idx && existingAnswer.isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      )}
                      {existingAnswer.selectedOptionIndex === idx && !existingAnswer.isCorrect && (
                        <XCircle className="h-5 w-5 text-rose-500" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Submit Action or Answer Explanation */}
          {existingAnswer ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-right space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>لقد قمت بالإجابة على هذا السؤال سابقاً</span>
              </div>
              {currentQuestion.explanation && (
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  <strong>توضيح وإضاءة إيمانية:</strong> {currentQuestion.explanation}
                </p>
              )}
            </div>
          ) : !isUnlocked ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-right flex items-center gap-2 text-amber-800 dark:text-amber-200 text-xs font-bold">
              <Lock className="h-4 w-4 text-amber-500 shrink-0" />
              <span>السؤال مغلق حالياً، سيتاح في موعده المخصص ضمن أيام الشهر الفضيل.</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-sans">
                {loggedCitizen 
                  ? "اختر الإجابة واضغط زر التأكيد لتسجيل إجابتك." 
                  : "يتطلب تقديم الإجابة تسجيل الدخول برقمك أو حسابك."}
              </p>

              <button
                type="button"
                disabled={selectedOption === null || isSubmitting}
                onClick={handleSubmitAnswer}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  selectedOption !== null && !isSubmitting
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 transform hover:-translate-y-0.5'
                    : 'bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSubmitting ? "جاري الاعتماد..." : "تأكيد وإرسال الإجابة 🚀"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Result Modal Feedback */}
      <AnimatePresence>
        {showSuccessModal && lastSubmittedResult && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-amber-500/20 text-amber-500">
                {lastSubmittedResult.isCorrect ? (
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                ) : (
                  <XCircle className="h-10 w-10 text-rose-500" />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {lastSubmittedResult.isCorrect ? "إجابة صحيحة ومباركة! 🎉" : "إجابة غير دقيقة 💔"}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                  {lastSubmittedResult.isCorrect 
                    ? "أحسنت! تم إضافة 10 نقاط إلى رصيد حسابك بنجاح. تابع مشاركاتك اليومية لتصدر اللائحة." 
                    : `الإجابة الصحيحة كانت: (${lastSubmittedResult.correctText}). حظاً أوفر في أسئلة الأيام القادمة.`}
                </p>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-colors"
              >
                متابعة وتصفح المسابقة 🌙
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
