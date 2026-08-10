import { RamadanQuestion, RamadanCompetitionSettings, RamadanUserAnswer } from '../types';

export const INITIAL_RAMADAN_SETTINGS: RamadanCompetitionSettings = {
  enabled: true,
  isCompetitionEnabled: true,
  title: "المسابقة الرمضانية الكبرى لبلدة قارة",
  subtitle: "شاركونا المعرفة والنفحات الإيمانية والثقافية طيلة أيام شهر رمضان المبارك مع جوائز قيمة للأعضاء المسجلين",
  badgeText: "رمضان مبارك 1448 هـ - بلدة قارة",
  welcomeTitle: "أهلاً بكم في المسابقة الرمضانية اليومية 🌙",
  welcomeMessage: "يسر إدارة بوابة قارة أن تقدم لكم مسابقة رمضانية ثنائية المحتوى (ديني وثقافي) طيلة أيام الشهر الفضيل مع تسجيل النقاط والنتائج الفورية للمشاركين.",
  membersNoticeText: "المسابقة مخصصة للأعضاء المسجلين في البوابة. سجل دخولك أو أنشئ حساب مواطن مجاناً لتفعيل زر الإجابة وتوثيق مشاركتك.",
  activeDay: 1,
  totalDays: 30,
  allowMultipleAttempts: false,
  showQuestionsHistory: false, // Default: show active day question only
  allowSecondChanceForPastDays: false,
  unlockedDays: [],
  themeStyle: 'site_emerald', // Default: matches site emerald visual identity
  bannerNotice: "🌙 أهلاً بكم في المسابقة الرمضانية اليومية! يحق لكل عضو مسجل إجابة واحدة يومياً وتسجل نقاط الإجابات الصحيحة تلقائياً.",
  
  // Design Models & Formatting
  cardTemplate: 'model_emerald_islamic',
  titleFontSize: 'text-3xl',
  titleTextColor: '#fef3c7',
  subtitleTextColor: '#a7f3d0',
  cardQuestionTextColor: '', // Default relies on active template color if empty
  cardOptionsTextColor: '',
  cardHeaderBadgeColor: '',

  // Background Pattern / Islamic Motifs / Image
  cardBgPattern: 'islamic_stars',
  cardBgImageUrl: '',
  cardBgImageOpacity: 0.15,

  // Qara Prayer Times & Hijri Calendar & Ramadan Calendar Start Date
  startDate: "2027-02-08",
  launchDateCustomLabel: "الإثنين 8 فبراير 2027 م (الموافق 1 رمضان 1448 هـ)",
  headerBannerSubtitle: "",
  headerBannerImageUrl: "",
  autoAdvanceDays: true,

  // Sponsor Advertising Section
  sponsorAdsEnabled: true,
  sponsorAdsAutoSlideInterval: 5,
  sponsorsList: [
    {
      id: "sp_1",
      title: "مؤسسة الأمل التجارية - قارة",
      sponsorType: "الراعي الماسي للمسابقة",
      description: "راعي الجائزة الكبرى الأولى للمسابقة الرمضانية - أجهزة منزلية وإلكترونيات فاخرة بأسعار منافسة للأهالي.",
      imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
      linkUrl: "https://wa.me/963900000001",
      buttonText: "تواصل مع الراعي الماسي عبر واتساب",
      durationSeconds: 6,
      isActive: true,
      badgeBgColor: "#fbbf24"
    },
    {
      id: "sp_2",
      title: "أسواق ومخابز القلمون الخيرية",
      sponsorType: "الراعي الذهبي",
      description: "راعي الجوائز اليومية والأسبوعية للفيائزين - سلات غذائية وقسائم شراء رمضانية مباركة.",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
      linkUrl: "",
      buttonText: "معرفة المزيد عن عروض الراعي",
      durationSeconds: 5,
      isActive: true,
      badgeBgColor: "#f59e0b"
    }
  ],

  prayerTimesCity: "بلدة قارة - القلمون",
  hijriYear: "1448 هـ",
  hijriDayOffset: 0,
  prayerSchedule: {
    fajr: "04:35 ص",
    dhuhr: "12:35 م",
    asr: "03:50 م",
    maghrib: "06:45 م",
    isha: "08:15 م"
  }
};

export const INITIAL_RAMADAN_QUESTIONS: RamadanQuestion[] = [
  {
    id: "ram_q1",
    dayNumber: 1,
    title: "سؤال اليوم الأول من شهر رمضان المبارك 🌙",
    questionText: "في أي سنة هجرية فُرِضَ صيام شهر رمضان المبارك على المسلمين؟",
    options: [
      "في السنة الأولى للهجرة",
      "في السنة الثانية للهجرة",
      "في السنة الثالثة للهجرة",
      "في السنة الخامس للهجرة",
      "في السنة الثامنة للهجرة"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 1,
    explanation: "فُرِضَ صيام شهر رمضان المبارك في شعبان من السنة الثانية للهجرة النبوية الشريفة.",
    isActive: true,
    createdAt: "2026-03-01T00:00:00.000Z"
  },
  {
    id: "ram_q2",
    dayNumber: 2,
    title: "سؤال اليوم الثاني من شهر رمضان المبارك 🌙",
    questionText: "ما اسم الصرح الروحي والتاريخي العريق الذي تأسس عام 550م ويقع في جبال قارة الغربية؟",
    options: [
      "دير مار يعقوب المقطع",
      "دير صيدنايا",
      "دير مار جرجس",
      "كنيسة مار سركيس"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "يعود تأسيس دير مار يعقوب المقطع في جبال قارة الغربية إلى حوالي عام 550 م بالقرن السادس الميلادي.",
    isActive: true,
    createdAt: "2026-03-02T00:00:00.000Z"
  },
  {
    id: "ram_q3",
    dayNumber: 3,
    title: "سؤال اليوم الثالث من شهر رمضان المبارك 🌙",
    questionText: "ما هي السورة القرآنية الكريمة التي تُلقب بـ 'عروس القرآن'؟",
    options: [
      "سورة يس",
      "سورة الرحمن",
      "سورة الملك",
      "سورة الواقعة",
      "سورة الكهف"
    ],
    visibleOptionsCount: 5,
    correctOptionIndex: 1,
    explanation: "قال رسول الله ﷺ: 'لكل شيء عروس، وعروس القرآن الرحمن'.",
    isActive: true,
    createdAt: "2026-03-03T00:00:00.000Z"
  },
  {
    id: "ram_q4",
    dayNumber: 4,
    title: "سؤال اليوم الرابع من شهر رمضان المبارك 🌙",
    questionText: "ما هو ارتفاع مدينة قارة عن سطح البحر تقريباً، والذي يمنحها مناخها الجبلي المتميز؟",
    options: [
      "500 متر",
      "900 متر",
      "1,300 متر",
      "2,000 متر"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 2,
    explanation: "تقع مدينة قارة على ارتفاع حوالي 1300 متر عن سطح البحر في سلسلة جبال القلمون.",
    isActive: true,
    createdAt: "2026-03-04T00:00:00.000Z"
  },
  {
    id: "ram_q5",
    dayNumber: 5,
    title: "سؤال اليوم الخامس من شهر رمضان المبارك 🌙",
    questionText: "ما هي أطول سورة في القرآن الكريم؟",
    options: [
      "سورة آل عمران",
      "سورة النساء",
      "سورة البقرة",
      "سورة المائدة"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 2,
    explanation: "سورة البقرة هي أطول سور القرآن الكريم وتضم 286 آية كريمة.",
    isActive: true,
    createdAt: "2026-03-05T00:00:00.000Z"
  },
  {
    id: "ram_q6",
    dayNumber: 6,
    title: "سؤال اليوم السادس من شهر رمضان المبارك 🌙",
    questionText: "في عهد أي خليفة عباسي بُني الجامع الكبير الأثري في مدينة قارة فوق أنقاض المعلم القديم؟",
    options: [
      "الخليفة أبو جعفر المنصور",
      "الخليفة هارون الرشيد",
      "الخليفة المأمون",
      "الخليفة المعتصم بالله"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 2,
    explanation: "بُني الجامع الكبير الأثري في قارة في عهد الخليفة العباسي المأمون ويمتاز بمئذنته المربعة الفاخرة.",
    isActive: true,
    createdAt: "2026-03-06T00:00:00.000Z"
  },
  {
    id: "ram_q7",
    dayNumber: 7,
    title: "سؤال اليوم السابع من شهر رمضان المبارك 🌙",
    questionText: "ما هي الغزوة التاريخية الكبرى التي وقعت في 17 رمضان من السنة الثانية للهجرة؟",
    options: [
      "غزوة أحد",
      "غزوة بدر الكبرى",
      "غزوة الخندق",
      "غزوة حنين",
      "غزوة تبوك"
    ],
    visibleOptionsCount: 5,
    correctOptionIndex: 1,
    explanation: "وقعت غزوة بدر الكبرى (يوم الفرقان) في السابع عشر من شهر رمضان المبارك للسنة الثانية للهجرة.",
    isActive: true,
    createdAt: "2026-03-07T00:00:00.000Z"
  },
  {
    id: "ram_q8",
    dayNumber: 8,
    title: "سؤال اليوم الثامن من شهر رمضان المبارك 🌙",
    questionText: "تشتهر بساتين قارة بزراعة جبلية فاخرة تُصدر لكافة المناطق، ما هي أشهر هذه الفواكه القلمونية؟",
    options: [
      "الكرز القلموني الفاخر",
      "الموز البلدي",
      "المانجو الشامي",
      "الأناناس"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "يمتاز الكرز القلموني في قارة بجودته العالية وحلاوة طعمه ونقاوة مياهه الجبلية.",
    isActive: true,
    createdAt: "2026-03-08T00:00:00.000Z"
  },
  {
    id: "ram_q9",
    dayNumber: 9,
    title: "سؤال اليوم التاسع من شهر رمضان المبارك 🌙",
    questionText: "من هو الصحابي الجليل الملقب بـ 'ترجمان القرآن'؟",
    options: [
      "عبد الله بن مسعود رضي الله عنه",
      "عبد الله بن عباس رضي الله عنهما",
      "أبي بن كعب رضي الله عنه",
      "زيد بن ثابت رضي الله عنه"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 1,
    explanation: "عبد الله بن عباس رضي الله عنهما هو حبر الأمة وترجمان القرآن لدعوة النبي ﷺ له بالفقه في الدين.",
    isActive: true,
    createdAt: "2026-03-09T00:00:00.000Z"
  },
  {
    id: "ram_q10",
    dayNumber: 10,
    title: "سؤال اليوم العاشر من شهر رمضان المبارك 🌙",
    questionText: "في أي سنة هجرية وقع فتح مكة المكرمة في شهر رمضان المبارك؟",
    options: [
      "السنة الخامسة للهجرة",
      "السنة الثامنة للهجرة",
      "السنة التاسعة للهجرة",
      "السنة العاشرة للهجرة"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 1,
    explanation: "كان فتح مكة الأعظم في 20 رمضان من السنة الثامنة للهجرة النبوية.",
    isActive: true,
    createdAt: "2026-03-10T00:00:00.000Z"
  },
  {
    id: "ram_q11",
    dayNumber: 11,
    title: "سؤال اليوم الحادي عشر من شهر رمضان المبارك 🌙",
    questionText: "ما اسم القناة المائية الجوفية الأثرية المحفورة في الصخر والتي روت بساتين قارة منذ آلاف السنين؟",
    options: [
      "الأقنية الرومانية القديمة",
      "قناة السويس",
      "قناة زبيدة",
      "نهر بردى"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "الأقنية الرومانية في قارة شبكة مائية هندسية مبهرة حُفرت في الصخر لنقل مياه الينابيع العذبة.",
    isActive: true,
    createdAt: "2026-03-11T00:00:00.000Z"
  },
  {
    id: "ram_q12",
    dayNumber: 12,
    title: "سؤال اليوم الثاني عشر من شهر رمضان المبارك 🌙",
    questionText: "ما السورة القرآنية التي تحتوي على بسملتين؟",
    options: [
      "سورة النمل",
      "سورة التوبة",
      "سورة النحل",
      "سورة الكهف"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "تضم سورة النمل بسملة في بدايتها وبسملة في الآية 30: ﴿إِنَّهُ مِنْ سُلَيْمَانَ وَإِنَّهُ بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ﴾.",
    isActive: true,
    createdAt: "2026-03-12T00:00:00.000Z"
  },
  {
    id: "ram_q13",
    dayNumber: 13,
    title: "سؤال اليوم الثالث عشر من شهر رمضان المبارك 🌙",
    questionText: "ما هي الليلة المباركة في شهر رمضان التي هي خير من ألف شهر؟",
    options: [
      "ليلة الإسراء والمعراج",
      "ليلة النصف من شعبان",
      "ليلة القدر",
      "ليلة الجمعة المباركة"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 2,
    explanation: "قال الله تعالى: ﴿لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ﴾.",
    isActive: true,
    createdAt: "2026-03-13T00:00:00.000Z"
  },
  {
    id: "ram_q14",
    dayNumber: 14,
    title: "سؤال اليوم الرابع عشر من شهر رمضان المبارك 🌙",
    questionText: "تبعد مدينة قارة عن العاصمة السورية دمشق مسافة تقدر بحوالي:",
    options: [
      "35 كم",
      "60 كم",
      "95 كم",
      "180 كم"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 2,
    explanation: "تقع قارة على الطريق الدولي بين دمشق وحمص وتبعد عن دمشق حوالي 95 كم.",
    isActive: true,
    createdAt: "2026-03-14T00:00:00.000Z"
  },
  {
    id: "ram_q15",
    dayNumber: 15,
    title: "سؤال اليوم الخامس عشر من شهر رمضان المبارك 🌙",
    questionText: "من هو أول سفير في الإسلام؟",
    options: [
      "مصعب بن عمير رضي الله عنه",
      "عثمان بن عفان رضي الله عنه",
      "جعفر بن أبي طالب رضي الله عنه",
      "سعد بن معاذ رضي الله عنه"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "أرسل النبي ﷺ الصحابي الجليل مصعب بن عمير إلى المدينة المنورة ليعلم أهلها الإسلام فكان أول سفير بالكلية.",
    isActive: true,
    createdAt: "2026-03-15T00:00:00.000Z"
  },
  {
    id: "ram_q16",
    dayNumber: 16,
    title: "سؤال اليوم السادس عشر من شهر رمضان المبارك 🌙",
    questionText: "ما اسم النبات الجبلي ذو النكهة الاستثنائية الجودة الذي يُجنى يدوياً من تلال قارة؟",
    options: [
      "السماق القاري الجبلي",
      "الزعتر البري",
      "الميرمية القلمونية",
      "النعناع البلدي"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "تشتهر قارة بالسماق الجبلي ذو النكهة القوية والجودة الفائقة المجموع يدوياً من التلال.",
    isActive: true,
    createdAt: "2026-03-16T00:00:00.000Z"
  },
  {
    id: "ram_q17",
    dayNumber: 17,
    title: "سؤال اليوم السابع عشر من شهر رمضان المبارك 🌙",
    questionText: "ما هي الصلاة الخاصة لشهر رمضان المبارك التي تُصلى بعد صلاة العشاء؟",
    options: [
      "صلاة الضحى",
      "صلاة التراويح",
      "صلاة الكسوف",
      "صلاة الاستسقاء"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 1,
    explanation: "صلاة التراويح سنة مؤكدة تُصلى في جماعة أو فرادى ليالي شهر رمضان المبارك.",
    isActive: true,
    createdAt: "2026-03-17T00:00:00.000Z"
  },
  {
    id: "ram_q18",
    dayNumber: 18,
    title: "سؤال اليوم الثامن عشر من شهر رمضان المبارك 🌙",
    questionText: "معنى اسم 'قارة' في اللغات السامية القديمة يعبر عن:",
    options: [
      "النهر الجاري",
      "القرية أو الحصن والربوة",
      "السوق الفسيح",
      "المزرعة الخضراء"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 1,
    explanation: "تعني كلمة قارة في اللغات السامية القديمة القرية الحصينة أو التلة والربوة.",
    isActive: true,
    createdAt: "2026-03-18T00:00:00.000Z"
  },
  {
    id: "ram_q19",
    dayNumber: 19,
    title: "سؤال اليوم التاسع عشر من شهر رمضان المبارك 🌙",
    questionText: "كم عدد أجزاء القرآن الكريم؟",
    options: [
      "20 جزءاً",
      "30 جزءاً",
      "40 جزءاً",
      "60 جزءاً"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 1,
    explanation: "يتكون المصحف الشريف من 30 جزءاً وينقسم كل جزء إلى حزبين.",
    isActive: true,
    createdAt: "2026-03-19T00:00:00.000Z"
  },
  {
    id: "ram_q20",
    dayNumber: 20,
    title: "سؤال اليوم العشرين من شهر رمضان المبارك 🌙",
    questionText: "ما هي المظاهرة أو السنة النبوية التي يستحب القيام بها في العشر الأواخر من رمضان بالمسجد؟",
    options: [
      "الاعتكاف",
      "الإحرام",
      "العمرة",
      "الطواف"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "الاعتكاف لزوم المسجد لطاعة الله وتقصي ليلة القدر في العشر الأواخر من رمضان.",
    isActive: true,
    createdAt: "2026-03-20T00:00:00.000Z"
  },
  {
    id: "ram_q21",
    dayNumber: 21,
    title: "سؤال اليوم الحادي والعشرين من شهر رمضان المبارك 🌙",
    questionText: "ما اسم المعلم الأثري الحجري القديم الواقع في قلب قارة ويتميز بقبوه القلموني التقليدي؟",
    options: [
      "كنيسة القديس سرجيوس (مار سركيس)",
      "برج قارة الأثري",
      "خان قارة العثماني",
      "قلعة القلمون"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "تعتبر كنيسة مار سركيس في قلب قارة من أقدم العمارات الحجرية القلمونية الفريدة.",
    isActive: true,
    createdAt: "2026-03-21T00:00:00.000Z"
  },
  {
    id: "ram_q22",
    dayNumber: 22,
    title: "سؤال اليوم الثاني والعشرين من شهر رمضان المبارك 🌙",
    questionText: "ما السورة التي تُسمى بـ 'قلب القرآن'؟",
    options: [
      "سورة يس",
      "سورة الكهف",
      "سورة الفاتحة",
      "سورة الإخلاص"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "تلقب سورة يس بقلب القرآن العظيم لما تحتويه من بيان أصول الإيمان بعمق شديد.",
    isActive: true,
    createdAt: "2026-03-22T00:00:00.000Z"
  },
  {
    id: "ram_q23",
    dayNumber: 23,
    title: "سؤال اليوم الثالث والعشرين من شهر رمضان المبارك 🌙",
    questionText: "ما هي زكاة الفطر الواجب إخراجها قبل صلاة عيد الفطر السعيد؟",
    options: [
      "صاع من طعام عن كل فرد من المسلمين",
      "خمس المال",
      "نصف العشر من المحصول",
      "ليس لها مقدار محدد"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "فرض رسول الله ﷺ زكاة الفطر صاعاً من تمر أو شعير أو طعام طهرة للصائم وطعمة للمساكين.",
    isActive: true,
    createdAt: "2026-03-23T00:00:00.000Z"
  },
  {
    id: "ram_q24",
    dayNumber: 24,
    title: "سؤال اليوم الرابع والعشرين من شهر رمضان المبارك 🌙",
    questionText: "من الجغرافيين والرحالة التاريخيين العرب الذين ذكروا مدينة قارة ووصفوا موقعها؟",
    options: [
      "ياقوت الحموي في معجم البلدان",
      "ابن بطوطة",
      "الشريف الإدريسي",
      "جميع ما ذكر صحيح"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 3,
    explanation: "ذكر العديد من الرحالة والمؤرخين قارة منهم ياقوت الحموي والظاهري والإدريسي وابن بطوطة.",
    isActive: true,
    createdAt: "2026-03-24T00:00:00.000Z"
  },
  {
    id: "ram_q25",
    dayNumber: 25,
    title: "سؤال اليوم الخامس والعشرين من شهر رمضان المبارك 🌙",
    questionText: "ما السورة القرآنية الكريمة التي تبدأ بدعاء 'ويلٌ' وتتحدث عن المطففين؟",
    options: [
      "سورة الهمزة",
      "سورة المطففين",
      "سورة القارعة",
      "سورة العاديات"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 1,
    explanation: "قال تعالى: ﴿وَيْلٌ لِّلْمُطَفِّفِينَ * الَّذِينَ إِذَا اكْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ﴾.",
    isActive: true,
    createdAt: "2026-03-25T00:00:00.000Z"
  },
  {
    id: "ram_q26",
    dayNumber: 26,
    title: "سؤال اليوم السادس والعشرين من شهر رمضان المبارك 🌙",
    questionText: "ما هي الأشجار المخلدة في بساتين قارة والمدرجات الجبلية التي تعطي زيتاً ونفعاً وفيراً؟",
    options: [
      "أشجار الزيتون والتين واللوز",
      "أشجار النخيل",
      "أشجار المانجو",
      "أشجار الجوز الاستوائي"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "تنتشر بساتين الزيتون المعمر وحقول التين واللوز في سهول قارة ومدرجاتها الجبلية.",
    isActive: true,
    createdAt: "2026-03-26T00:00:00.000Z"
  },
  {
    id: "ram_q27",
    dayNumber: 27,
    title: "سؤال اليوم السابع والعشرين من شهر رمضان المبارك 🌙",
    questionText: "ما هي الدعاء المستحب للعبد أن يكثر منه إذا صادف ليلة القدر كما علم النبي ﷺ عائشة رضي الله عنها؟",
    options: [
      "اللهم إنك عفو تحب العفو فاعفُ عني",
      "اللهم آتنا في الدنيا حسنة وفي الآخرة حسنة",
      "ربنا لا تزغ قلوبنا بعد إذ هديتنا",
      "اللهم اهدني فيمن هديت"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "قالت أم المؤمنين عائشة: قلت يا رسول الله، أرأيت إن علمت أي ليلة ليلة القدر ما أقول فيها؟ قال: قولي: 'اللهم إنك عفو تحب العفو فاعف عني'.",
    isActive: true,
    createdAt: "2026-03-27T00:00:00.000Z"
  },
  {
    id: "ram_q28",
    dayNumber: 28,
    title: "سؤال اليوم الثامن والعشرين من شهر رمضان المبارك 🌙",
    questionText: "ما السورة التي تُسمى بـ 'أم الكتاب' أو 'السبع المثاني'؟",
    options: [
      "سورة الفاتحة",
      "سورة الإخلاص",
      "سورة البقرة",
      "سورة الكوثر"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "سورة الفاتحة هي الشافية وأم الكتاب والسبع المثاني التي لا تصح الصلاة إلا بها.",
    isActive: true,
    createdAt: "2026-03-28T00:00:00.000Z"
  },
  {
    id: "ram_q29",
    dayNumber: 29,
    title: "سؤال اليوم التاسع والعشرين من شهر رمضان المبارك 🌙",
    questionText: "ما هو اسم المعركة المسلمة الشهيرة بقيادة سيف الدين قطز والمظفر التي وقعت في رمضان هـ658 ودحرت المغول؟",
    options: [
      "معركة عين جالوت",
      "معركة حطين",
      "معركة اليرموك",
      "معركة القادسية"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 0,
    explanation: "وقعت معركة عين جالوت الخالدة في رمضان 658 هـ وانتصر فيها المسلمون انتصاراً حاسماً على التتار.",
    isActive: true,
    createdAt: "2026-03-29T00:00:00.000Z"
  },
  {
    id: "ram_q30",
    dayNumber: 30,
    title: "سؤال اليوم الثلاثين من شهر رمضان المبارك 🌙",
    questionText: "ما هو العيد المبارك الذي يحتفل به المسلمون فور انتهاء شهر رمضان المبارك؟",
    options: [
      "عيد الأضحى المبارك",
      "عيد الفطر السعيد",
      "عيد رأس السنة الهجرية",
      "المولد النبوي الشريف"
    ],
    visibleOptionsCount: 4,
    correctOptionIndex: 1,
    explanation: "عيد الفطر السعيد هو جائزة المسلمين وفرحتهم بإتمام صيام شهر رمضان المبارك.",
    isActive: true,
    createdAt: "2026-03-30T00:00:00.000Z"
  }
];

export const INITIAL_RAMADAN_ANSWERS: RamadanUserAnswer[] = [
  {
    id: "ans_sample_1",
    userId: "ctz_sample_1",
    userName: "محمد أحمد القاري",
    userUsername: "mohammed_qara",
    questionId: "ram_q1",
    dayNumber: 1,
    selectedOptionIndex: 1,
    isCorrect: true,
    submittedAt: "2026-03-01T18:30:00.000Z"
  },
  {
    id: "ans_sample_2",
    userId: "ctz_sample_2",
    userName: "فاطمة الزهراء",
    userUsername: "fatima_z",
    questionId: "ram_q1",
    dayNumber: 1,
    selectedOptionIndex: 0,
    isCorrect: false,
    submittedAt: "2026-03-01T19:12:00.000Z"
  },
  {
    id: "ans_sample_3",
    userId: "ctz_sample_3",
    userName: "خالد المحمد",
    userUsername: "khaled_m",
    questionId: "ram_q2",
    dayNumber: 2,
    selectedOptionIndex: 0,
    isCorrect: true,
    submittedAt: "2026-03-02T14:20:00.000Z"
  }
];
