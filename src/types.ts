export interface Service {
  id: string;
  name: string;
  iconName: string;
  category: 'بلدية' | 'صحية' | 'تعليمية' | 'اجتماعية';
  description: string;
  requiredDocuments: string[];
  steps: string[];
  processingTime: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  views: number;
  likes: number;
  image?: string;
  comments: Comment[];
  status?: 'pending' | 'approved' | 'rejected';
  authorName?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  authorBadge?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'قيد التخطيط' | 'قيد التنفيذ' | 'مكتمل';
  percentage: number;
  budget: string;
  volunteersCount: number;
  category: 'بنى تحتية' | 'زراعي' | 'طاقة متجددة' | 'ثقافي وخدمي';
  dateStarted: string;
  dateTarget: string;
  image?: string;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  applicantName: string;
  phoneNumber: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  dateSubmitted: string;
}

export interface Suggestion {
  id: string;
  author: string;
  title: string;
  content: string;
  category: 'تحسين خدمات' | 'فكرة مشروع' | 'شكوى' | 'أخرى';
  likes: number;
  date: string;
  status?: 'pending' | 'approved' | 'rejected';
  municipalityVote?: 'approve' | 'disagree' | 'study' | 'none';
}

export interface HeritagePoint {
  id?: string;
  title: string;
  description: string; // Excerpt / Short Summary
  fullExplanation?: string; // Full detailed explanation
  docsSectionTitle?: string; // Custom Title for documentation & references section
  docsSectionContent?: string; // Custom Content for documentation & references section
  image?: string;
  period?: string; // Era / Historical Period (e.g., البيزنطي، العباسي)
  location?: string; // Location in Qara
  
  // Media, Extra Photos, Video & Research Controls
  showMediaSection?: boolean; // Enable/Disable bottom media & research section
  additionalSectionTitle?: string; // Custom title for bottom section
  additionalImages?: string[]; // Additional photo gallery for the landmark
  showAdditionalImages?: boolean; // Toggle permission to show/hide the additional images gallery
  videoUrl?: string; // Video URL (YouTube, MP4, or video link)
  researchNotes?: string; // Custom research, studies, media coverage, and reference notes
  modalFooterText?: string; // Custom bottom banner text for this landmark modal

  createdAt?: string;
}

export interface Crop {
  name: string;
  desc: string;
  symbol?: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface EmergencyContact {
  name: string;
  number: string;
  role: string;
  iconName: string;
}

export interface HeroLink {
  id: string;
  label: string;
  targetTab: string;
  variant: 'primary' | 'secondary' | 'accent' | 'royal_dark' | 'navy_blue' | 'purple_violet' | 'glass_emerald' | 'dark_charcoal' | 'gradient_amber_emerald' | 'gradient_rose_amber' | 'outline_gold' | 'outline_white' | string;
  iconName?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  submitter: string;
  imageUrl: string;
  date: string;
  status: 'pending' | 'approved' | 'archived';
  category?: string;
}

export interface SideBanner {
  id: string;
  title: string;
  content: string;
  position: 'right' | 'left';
  enabled: boolean;
  bgColor?: string;
  textColor?: string;
  buttonLabel?: string;
  buttonLinkTab?: string;
  imageUrl?: string;
  iconName?: string;
}

export interface MarketplaceComment {
  id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}

export interface CustomFormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
  required: boolean;
}

export interface MarketplaceListing {
  id: string;
  title: string;             // اسم السلعة
  category: string;          // تبويب السلعة (عقارات، سيارات، إلخ)
  price?: string;            // السعر
  currency?: 'SYP' | 'USD';   // العملة (ليرة سورية أو دولار)
  description: string;       // وصف السلعة
  images: string[];          // صور السلعة (بحد أقصى 3)
  sellerName: string;        // اسم المعلن
  sellerEmail: string;       // بريد المعلن
  sellerPhone?: string;      // رقم تواصل
  sellerLocation?: string;   // العنوان أو المنطقة
  createdAt: string;         // وقت الإعلان
  status: 'active' | 'sold'; // حالة السلعة
  soldAt?: string;           // توقيت تحديد البيع لحساب الـ 48 ساعة
  comments: MarketplaceComment[];
  views?: number;
  customFieldValues?: Record<string, string>; // قيم الخانات الإضافية المخصصة
}

export interface MarketplaceConfig {
  enabled: boolean;                      // تفعيل أو عدم تفعيل المتجر
  storeTitle: string;                   // عنوان المتجر
  storeSubtitle: string;                // الوصف الفرعي
  categories: string[];                 // تبويبات المتجر (عقارات، سيارات...)
  addFormTitle?: string;                // عنوان بطاقة إضافة السلعة
  addFormInstructions?: string;         // تعليمات وتوجيهات إضافة السلعة
  addFormColor?: 'emerald' | 'amber' | 'stone' | 'sky' | 'violet' | 'rose' | 'indigo'; // لون البطاقة
  fieldLabels?: {
    title?: string;
    category?: string;
    price?: string;
    description?: string;
    phone?: string;
    location?: string;
    images?: string;
  };
  requiredFields?: {
    price?: boolean;
    phone?: boolean;
    description?: boolean;
    images?: boolean;
    location?: boolean;
  };
  customFields?: CustomFormField[];     // الخانات الجديدة المخصصة في البطاقة
  enableUSD?: boolean;                  // صلاحية إضافة الدولار الأمريكي بجانب الليرة السورية
  autoDeleteHoursAfterSold?: number;    // ساعات الحذف التلقائي (افتراضي 48 ساعة)
  openMode?: 'new_tab' | 'modal';       // طريقة فتح الإعلان: تبويب/صفحة جديدة أو بطاقة معروضة أمام الصفحة
}

export interface HomeContent {
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  introTitle: string;
  introText: string;
  originText: string;
  awardTitle: string;
  awardText: string;
  agricultureTitle: string;
  agricultureText: string;
  agricultureCrops: Crop[];
  stats: Stat[];
  heritageTitle: string;
  heritageDescription: string;
  heritagePoints: HeritagePoint[];
  emergencyTitle: string;
  emergencyDescription: string;
  emergencyContacts: EmergencyContact[];
  heroImage?: string;
  heroLinks?: HeroLink[];
  previousHeroLinks?: HeroLink[];
  newsCategories?: string[];

  // Citizen Portal Customization options
  citizenPortalTitle?: string;
  citizenPortalNoAccountText?: string;
  citizenPortalRegisterNote?: string;
  citizenPortalRegisterLinkText?: string;
  
  // Agricultural section customization options
  agricultureBgColor?: string;
  agricultureTextColor?: string;
  agricultureSubBgColor?: string;
  agricultureSubBorderColor?: string;
  agricultureTitleColor?: string;
  agricultureCropTitleColor?: string;
  agricultureCropDescColor?: string;
  agricultureFontFamily?: string;
  agricultureFontSize?: string;
  agricultureFontWeight?: string;
  agricultureFontStyle?: string;

  // Visitor Counter options
  visitorCountEnabled?: boolean;
  visitorCount?: number;
  visitorCounterPosition?: 'below_gallery' | 'below_hero' | 'footer' | 'above_footer' | 'navbar_top_left';
  visitorCounterTitle?: string;
  visitorCounterColor?: string;
  visitorCounterBg?: string;

  // Photo Gallery customized settings
  maxUploadSizeKB?: number;
  homeMarqueePosition?: 'bottom_horizontal' | 'sidebar_right' | 'sidebar_left';
  galleryTitle?: string;
  galleryDescription?: string;
  galleryCategories?: string[];
  directoryCategories?: string[];

  // Electronic Services page availability and maintenance controls
  servicesPageEnabled?: boolean;
  servicesDisabledMode?: 'coming_soon' | 'under_maintenance' | 'maintenance' | 'awaiting_approval' | 'custom';
  servicesDisabledTitleAr?: string;
  servicesDisabledTitleEn?: string;
  servicesDisabledMessage?: string;
  servicesDisabledLogo?: string;
  servicesDisabledFlagUrl?: string;

  // Landmarks customization
  landmarkModalFooterText?: string;

  // Council and Identity Logos configuration
  councilLogo?: string;
  councilLogoPosition?: 'top_right' | 'top_left' | 'top_center';
  councilLogoBgColor?: string;
  councilLogoWidth?: number;
  identityLogo?: string;
  identityLogoPosition?: 'top_right' | 'top_left' | 'top_center';
  identityLogoBgColor?: string;
  identityLogoWidth?: number;

  // Watermark custom options
  galleryWatermarkEnabled?: boolean;
  galleryWatermarkBgColor?: string;
  galleryWatermarkTextColor?: string;
  galleryWatermarkTextColorSecondary?: string;
  galleryWatermarkFontSize?: number;
  galleryWatermarkPosition?: 'bottom_right' | 'bottom_left' | 'bottom_center';


  // Section ordering for Home Page
  homeSectionOrder?: string[];

  // Tab Title and Page Header custom styling options
  headerPortalTitle?: string;
  headerPortalSubtitle?: string;
  headerTitleColor?: string;
  headerSubtitleColor?: string;
  headerBgColor?: string;
  headerBorderColor?: string;
  headerPresetStyle?: 'emerald_gold' | 'glassmorphic' | 'royal_luxe' | 'midnight_obsidian' | 'clean_white' | 'warm_sunset';
  headerHeightMode?: 'compact' | 'normal' | 'spacious';
  headerDistinctionFx?: 'glass_blur' | 'gold_glow' | 'accent_top' | 'shadow_elevated';
  headerLogoIcon?: string;
  headerLogo?: string;
  headerLogoHeight?: number;
  headerLogoPosition?: 'right' | 'left';

  tabStyle?: 'pill' | 'classic' | 'glass' | 'bordered';
  tabColorActive?: string;
  tabColorInactive?: string;
  tabBgActive?: string;
  tabFontSize?: string;
  tabHoverEffect?: 'lift_up' | 'lift_glow' | 'scale_bounce' | 'underline_slide' | '3d_flip' | 'none';

  // Live Stream customization options (Sub-section of Gallery Manager)
  liveStreamEnabled?: boolean;
  liveStreamMode?: 'url' | 'camera'; // Streaming mode: External URL or Camera
  liveStreamUrl?: string;
  liveStreamBadge?: string; // Bottom label e.g., "بث مباشر من قارة"
  liveStreamCopyrightTitle?: string; // Ownership title e.g., "حقوق وإرشادات البث المباشر"
  liveStreamCopyrightContent?: string; // Ownership content text
  liveStreamStatusText?: string; // e.g. "مباشر الآن"
  liveStreamActiveCamera?: boolean; // Is camera broadcasting actively live right now
  liveStreamBroadcasterName?: string; // Name of person broadcasting live
  pageHeaderStyle?: 'simple' | 'bottom_line' | 'side_border' | 'box_card' | 'ornamented';
  pageHeaderColor?: string;
  pageHeaderBg?: string;
  pageHeaderFontSize?: string;
  pageHeaderFontFamily?: string;
  pageHeaderAlignment?: 'right' | 'center' | 'left';
  sectionSpacing?: 'small' | 'medium' | 'large' | 'normal' | 'compact' | 'ultra_compact';

  // Side Banners (Right & Left)
  sideBannersEnabled?: boolean;
  sideBanners?: SideBanner[];

  // Bottom Banner / Footer customization options
  footerAboutTitle?: string;
  footerAboutText?: string;
  footerAddress?: string;
  footerPhone?: string;
  footerEmail?: string;
  footerZipCode?: string;
  footerWorkingHours?: string;
  footerMadeWithLoveText?: string;
  footerCopyrightText?: string;
  footerBgColor?: string;
  footerTextColor?: string;
  footerAccentColor?: string;
  footerAlignment?: 'right' | 'center' | 'left';
  footerWatermarkLogo?: string;
  footerWatermarkOpacity?: number;
  footerWatermarkRepeat?: 'repeat' | 'no-repeat';
  footerWatermarkRotate?: number;
  footerWatermarkWidth?: number;
  footerWatermarkPosition?: 'center' | 'right' | 'left';
  footerWatermarkX?: number; // horizontal offset in px
  footerWatermarkY?: number; // vertical offset in px
  footerColumnsLayout?: 'default' | 'left_shifted' | 'wide_spaced' | 'custom';
  footerLinksContactShift?: number; // manual offset shift to the left in px

  // Stats Banner custom styling options
  statsBgColor?: string;
  statsHeight?: number; // vertical padding or height factor
  statsFontSize?: number; // text font size in px
  statsValueColor?: string;
  statsLabelColor?: string;

  // News Ticker customization options
  tickerEnabled?: boolean;
  tickerBgColor?: string;
  tickerTextColor?: string;
  tickerFontSize?: number;
  tickerDirection?: 'rtl' | 'ltr';
  tickerSourceFromNewsTab?: boolean;
  tickerCustomItems?: string[];
  tickerTitle?: string;
  tickerTitleBgColor?: string;
  tickerTitleTextColor?: string;
  tickerTitlePosition?: 'right' | 'left';

  // Heritage section styling options
  heritageActiveBgColor?: string;
  heritageActiveTextColor?: string;
  heritageInactiveBgColor?: string;
  heritageInactiveTextColor?: string;
  heritageContentBgColor?: string;
  heritageContentTextColor?: string;
  heritageContentTitleColor?: string;

  // Community board customization options
  communityScrollSpeed?: number; // duration in seconds
  communityScrollHeight?: number; // height of the box in px
  communityBgColor?: string;
  communityTitleColor?: string;
  communityItemBgColor?: string;
  communityItemTextColor?: string;
  communityItemTitleColor?: string;
  communityBorderColor?: string;
  communityDateColor?: string;
  communityHeartColor?: string;
  communityItemFontSize?: 'xs' | 'sm' | 'base';
  communityItemPadding?: '3' | '4' | '5' | '6';
  directoryPageName?: string;
  marketplaceConfig?: MarketplaceConfig;
}

export interface MemberPermissions {
  editHome: boolean;               // تعديل الصفحة الرئيسية
  manageGallery: boolean;          // إدارة معرض الصور والذكريات
  digitalServices: boolean;        // الخدمات الرقمية
  newsAndCommunity: boolean;       // محرر الأخبار والفعاليات ومنبر الأهالي
  projects: boolean;               // المشاريع التنموية
  requestsAndSuggestions: boolean; // طلبات ومقترحات المواطنين
  statsAndCharts: boolean;         // الرسم البياني والإحصائيات
  manageDirectory?: boolean;       // إدارة الدليل التجاري والخدمي
  manageMarketplace?: boolean;     // إدارة متجر قارة الإلكتروني وإعلانات البيع والشراء
  editLandmarks?: boolean;         // إدارة المعالم الأثرية
  liveStreamBroadcast?: boolean;   // البث المباشر المباشر من كمرا الجوال (صلاحية خاصة من المدير العام)
  ramadanCompetition?: boolean;    // مسابقة شهر رمضان المبارك
}

export interface RamadanQuestion {
  id: string;
  dayNumber: number;               // اليوم من شهر رمضان (1 إلى 30)
  title?: string;                  // عنوان السؤال
  questionText: string;            // نص السؤال المطروح
  options: string[];               // خيارات الإجابات المتاحة (تصل إلى 5 خيارات)
  visibleOptionsCount?: number;    // عدد الخيارات المطلوب إظهارها في صفحة العرض (2، 3، 4، أو 5)
  correctOptionIndex: number;      // دليل الخيار الصحيح (0-based index)
  category?: string;               // تصنيف السؤال
  explanation?: string;            // توضيح أو معلومة إضافية عن الإجابة الصحيحة
  points?: number;                 // النقاط المكتسبة
  isActive?: boolean;              // مفعل أو غير مفعل
  createdAt?: string;
}

export interface RamadanUserAnswer {
  id: string;
  userId: string;                  // معرف المستخدم أو العضو المسجل
  userName: string;                // اسم المستخدم أو العضو
  userUsername?: string;           // اسم مستخدم الحساب
  questionId: string;              // معرف السؤال
  dayNumber: number;               // اليوم الرمضاني
  selectedOptionIndex: number;     // دليل الخيار المختار
  selectedOption?: string;         // النص المختار
  isCorrect: boolean;              // هل الإجابة صحيحة أم خاطئة
  pointsEarned?: number;           // النقاط
  submittedAt: string;             // توقيت إرسال الإجابة
}

export interface RamadanPrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface RamadanSponsorAd {
  id: string;
  title: string;              // اسم الراعي / الجهة الراعية
  sponsorType?: string;        // نوع الرعاية (مثلاً: الراعي الذهبي، الراعي الرسمي، مساهم مجتمعي)
  description?: string;        // تفاصيل الإعلان أو العرض
  imageUrl?: string;           // صورة الإعلان / اللوجو
  linkUrl?: string;            // رابط موقع الراعي أو رابط التواصل
  buttonText?: string;         // نص زر التوجه للراعي
  durationSeconds?: number;    // مدة العرض الخاصة بهذا الإعلان (بالثواني)
  isActive?: boolean;          // حالة التفعيل
  badgeBgColor?: string;       // لون خلفية الشارة
  isPinned?: boolean;          // تثبيت هذا الإعلان في أعلى الشريط الإخباري (إعلان واحد فقط)
}

export interface RamadanCompetitionSettings {
  enabled?: boolean;               // إظهار أو إخفاء الصفحة
  isCompetitionEnabled?: boolean;  // حالة تفعيل المسابقة
  title: string;                   // عنوان مسابقة رمضان
  subtitle: string;                // الشرح الفرعي للمسابقة
  badgeText?: string;              // نص شريط الترويسة العلوي (مثل: رمضان مبارك 1447 هـ - بلدة قارة)
  welcomeTitle?: string;           // عنوان الترحيب بالمسابقة
  welcomeMessage?: string;         // رسالة الترحيب والشرح المفصل
  membersNoticeText?: string;      // نص التنبيه المخصص للأعضاء غير المسجلين
  activeDay: number;               // اليوم النشط حالياً للمسابقة (1 - 30)
  totalDays?: number;              // إجمالي أيام شهر رمضان
  allowMultipleAttempts?: boolean; // السماح بالمحاولة مجدداً أم إجابة واحدة فقط
  showQuestionsHistory?: boolean;  // إظهار أو إخفاء سجل كافة أسئلة الشهر للأعضاء (افتراضياً: false = إظهار سؤال اليوم النشط فقط)
  allowSecondChanceForPastDays?: boolean; // تفعيل الفرصة الثانية لجميع الأيام الفائتة
  unlockedDays?: number[];         // قائمة الأيام التي أعادت الإدارة فتحها يدوياً للفرصة الثانية
  themeStyle?: 'site_emerald' | 'emerald_cream' | 'ramadan_night' | 'amber_gold'; // اختيار لون ونمط تصميم الصفحة ليكون متوافقاً مع هوية الموقع
  bannerNotice?: string;           // تنبيه أعلى الصفحة

  // التبديل التلقائي اليومي وتاريخ أول يوم رمضان
  startDate?: string;              // تاريخ أول يوم في رمضان حسب اللجان الشرعية في قارة (صيغة YYYY-MM-DD)
  autoAdvanceDays?: boolean;       // التبديل والتنقل التلقائي للأسئلة حسَب التاريخ الفعلي لرمضان

  // المساحة الإعلانية لورعاة المسابقة
  sponsorAdsEnabled?: boolean;     // تفعيل المساحة الإعلانية للرعاة
  sponsorAdsHeaderTitle?: string;  // عنوان الترويسة لبطاقة الشريط الإخباري لرعاة المسابقة
  sponsorAdsBadgeText?: string;    // الشارة المخصصة (مثلاً: أخبار وقوانين المسابقة / شريط إخباري متحرك)
  sponsorAdsAutoSlideInterval?: number; // مدة التبديل والتنقل التلقائي بين الإعلانات بالثواني (افتراضياً 5 ثواني)
  sponsorAdsCardStyle?: 'site_emerald' | 'soft_cream' | 'modern_slate' | 'heritage_amber' | 'minimal_white'; // نموذج وتصميم الشريط الإعلاني للرعاة
  sponsorsList?: RamadanSponsorAd[]; // قائمة إعلانات ورعاة المسابقة

  // نماذج تصميم بطاقة السؤال والزخارف الإسلامية
  cardTemplate?: 'model_site_identity' | 'model_emerald_islamic' | 'model_gold_arch' | 'model_royal_cream' | 'model_modern_night';
  
  // التحكم بألوان وأحجام الخطوط الخاصة برأس الصفحة وبطاقة السؤال
  titleFontSize?: 'text-xl' | 'text-2xl' | 'text-3xl' | 'text-4xl' | 'text-5xl';
  titleTextColor?: string;         // لون خط العنوان الرئيسي (مثلاً: #fef3c7 أو #ffffff أو #fbbf24)
  subtitleTextColor?: string;      // لون خط الشرح والوصف الفرعي
  cardQuestionTextColor?: string;  // لون خط نص السؤال داخل البطاقة
  cardOptionsTextColor?: string;   // لون خط الخيارات المتاحة
  cardHeaderBadgeColor?: string;   // لون خط شارة الترويسة المزخرفة

  // خلفية بطاقة السؤال والزخارف الإسلامية المخصصة
  cardBgPattern?: 'none' | 'islamic_stars' | 'arabesque' | 'qara_mosaic' | 'custom_image';
  cardBgImageUrl?: string;         // رابط الصورة المخصصة لخلفية بطاقة السؤال
  cardBgImageOpacity?: number;     // نسبة شفافية الخلفية (من 0.05 إلى 1.0 - افتراضياً 0.2)

  // قسم اليوم الهجري ومواقيت صلاة بلدة قارة
  prayerTimesCity?: string;        // اسم المدينة/البلدة (افتراضياً: بلدة قارة - القلمون)
  hijriYear?: string;              // السنة الهجرية (افتراضياً: 1448 هـ)
  hijriDayOffset?: number;         // تعديل/إزاحة اليوم الهجري (+أو- يوم) حسب رؤية الهلال والأشهر الهجرية
  prayerSchedule?: RamadanPrayerTimes; // مواقيت الصلوات الخمس لبلدة قارة

  // البنر الرئيسي وتاريخ الانطلاق والنص والصورة المخصصة
  headerBannerSubtitle?: string;   // نص مخصص مضاف في البنر الرئيسي تحت تاريخ الانطلاق
  headerBannerImageUrl?: string;   // صورة مخصصة في البنر الرئيسي تحت تاريخ الانطلاق
  launchDateCustomLabel?: string;  // نص مخصص لتاريخ الانطلاق (مثل: الإثنين 8 فبراير 2027م / 1 رمضان 1448هـ)
}

export interface Member {
  id: string;
  name: string;
  username: string; // Must strictly contain English letters, numbers, and allowed symbols
  password?: string; // stored as cleartext for simplicity in client-only setup
  permissions: MemberPermissions;
  email?: string;
}

export interface CitizenUser {
  id: string;
  fullName: string;
  email: string; // Used strictly as username
  password: string;
  phone: string;
  address?: string;
  nationalId?: string;
  familyMembersCount?: number;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  resetToken?: string;
  resetTokenExpiry?: number;
  isBoardMember?: boolean; // هل الحساب خاص بعضو في مجلس الإدارة
  isSiteManager?: boolean; // هل الحساب خاص بالمدير العام للموقع
  badgeTitle?: string;     // شارة رسمية (مثل: "الإدارة 🛡️" أو "مدير الموقع")
}

export interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  level: 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong';
  label: string;
  color: string;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
  message?: string;
}

export function validateUsername(username: string): { isValid: boolean; message?: string } {
  const trimmed = username.trim();
  if (!trimmed) {
    return { isValid: false, message: 'اسم المستخدم مطلوب' };
  }
  if (trimmed.length < 3) {
    return { isValid: false, message: 'اسم المستخدم يجب أن يتكون من 3 أحرف أو رموز على الأقل' };
  }
  // Allow English characters (a-z, A-Z), numbers (0-9), and symbols (_ . - @)
  const englishRegex = /^[a-zA-Z0-9._\-@]+$/;
  if (!englishRegex.test(trimmed)) {
    return { isValid: false, message: 'اسم المستخدم يجب أن يكون حصراً بالأحرف الإنجليزية والأرقام والرموز (مثل _ . - @) بدون أحرف عربية أو مسافات' };
  }
  return { isValid: true };
}

export function validatePassword(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 10;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  let metCount = 0;
  if (hasMinLength) metCount++;
  if (hasUppercase) metCount++;
  if (hasLowercase) metCount++;
  if (hasDigit) metCount++;
  if (hasSpecialChar) metCount++;

  let score = metCount * 15; // Max 75 for meeting all 5 basic criteria
  if (password.length >= 12) score += 10;
  if (password.length >= 15) score += 15;
  if (score > 100) score = 100;

  const isValid = hasMinLength && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;

  let level: 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong' = 'very_weak';
  let label = 'ضعيفة جداً';
  let color = '#ef4444'; // Red

  if (score >= 90 && isValid) {
    level = 'very_strong';
    label = 'قوية جداً (معايير فائقة)';
    color = '#0284c7'; // Cyan/Blue
  } else if (isValid && score >= 75) {
    level = 'strong';
    label = 'قوية ممتاز';
    color = '#10b981'; // Emerald/Green
  } else if (metCount >= 4) {
    level = 'medium';
    label = 'متوسطة الأمان';
    color = '#f59e0b'; // Amber/Yellow
  } else if (metCount >= 2) {
    level = 'weak';
    label = 'ضعيفة';
    color = '#f97316'; // Orange
  } else {
    level = 'very_weak';
    label = 'ضعيفة جداً';
    color = '#ef4444'; // Red
  }

  let message = '';
  if (!hasMinLength) message = 'كلمة المرور يجب أن تتألف من 10 خانات على الأقل';
  else if (!hasUppercase) message = 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)';
  else if (!hasLowercase) message = 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)';
  else if (!hasDigit) message = 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل (0-9)';
  else if (!hasSpecialChar) message = 'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (مثل @, #, $, !)';

  return {
    isValid,
    score,
    level,
    label,
    color,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasDigit,
    hasSpecialChar,
    message: isValid ? undefined : message
  };
}

export interface CustomPageSection {
  id: string;
  title: string;
  content: string;
  image?: string;
  badge?: string;
}

export interface CustomPage {
  id: string;
  title: string;
  description: string;
  isMain: boolean;
  parentId?: string; // If sub-page, ID of the parent tab/page
  templateId: 'landmarks' | 'crafts' | 'history' | 'tourism' | 'assembly';
  status: 'active' | 'hidden';
  content: {
    introText?: string;
    sections: CustomPageSection[];
  };
}

export interface BusinessActivity {
  id: string;
  name: string;
  activity: string; // نشاطها التجاري والخدمي
  category?: string; // تصنيف النشاط (تجاري، خدمي، إلخ)
  description?: string; // شرح مبسط للنشاط
  phone: string;
  whatsapp: string;
  email?: string;
  address?: string;
  image?: string; // Base64 image upload or web URL
  isPinned: boolean;
  status: 'pending' | 'approved' | 'rejected';
  cardColor?: string; // Color preset or custom background hex
  cardStyle?: 'modern' | 'heritage' | 'classic' | 'simple';
  textColor?: string; // custom text color hex/preset
  createdAt: string;
  date?: string; // تاريخ الإضافة
}

export interface SurveyField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox';
  section: 'personal' | 'contact' | 'survey';
  options?: string[]; // for select dropdown
  required: boolean;
}

export interface SurveyTemplate {
  id: string;
  title: string;
  description?: string;
  image?: string; // URL or Base64 uploaded image
  status: 'active' | 'hidden';
  displayType: 'main' | 'sub'; // 'main' for Main Tab, 'sub' for Sub-tab under Services
  fields: SurveyField[];
  createdAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: { [fieldId: string]: any };
  submittedAt: string;
}





