import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Service, News, Project, Suggestion, ServiceRequest, HomeContent, SideBanner, HeritagePoint, GalleryItem, HeroLink, Member, MemberPermissions, CustomPage, BusinessActivity, SurveyTemplate, SurveyResponse, CitizenUser, MarketplaceListing, RamadanCompetitionSettings, RamadanQuestion, RamadanUserAnswer, RamadanSponsorAd, validateUsername, validatePassword } from '../types';
import AdminSurveyManager from './AdminSurveyManager';
import CitizenAccountsManager from './CitizenAccountsManager';
import MarketplaceAdminManager from './MarketplaceAdminManager';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { TEMPLATE_PRESETS, createDefaultPageFromTemplate } from '../data/customPagesTemplates';
import { INITIAL_BUSINESS_ACTIVITIES } from '../data/qaraData';
import heroBanner from '../assets/images/qara_mosque_hero_1783884601871.jpg';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw,
  Video, 
  Check, 
  Building2, 
  Store,
  FileText, 
  Sprout, 
  Heart, 
  CheckCircle, 
  X, 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Lock,
  EyeOff,
  ShieldCheck,
  Layers,
  FolderPlus,
  Sparkles,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Search,
  Home,
  Upload,
  Image as ImageIcon,
  Type,
  MousePointer,
  HelpCircle,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  ArrowRightLeft,
  Archive,
  Sliders,
  Folder,
  Tag,
  Award,
  MapPin,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  ExternalLink,
  Clock,
  Moon,
  Trophy,
  CheckCircle2,
  XCircle,
  Palette,
  FileSpreadsheet,
  Download,
  Filter,
  Volume2,
  Upload,
  Pin,
  PinOff,
  Edit
} from 'lucide-react';

interface AdminTabProps {
  services: Service[];
  setServices: (srvs: Service[]) => void;
  newsList: News[];
  setNewsList: (news: News[]) => void;
  projects: Project[];
  setProjects: (projs: Project[]) => void;
  suggestions: Suggestion[];
  setSuggestions: (sugs: Suggestion[]) => void;
  requests: ServiceRequest[];
  setRequests: (reqs: ServiceRequest[]) => void;
  homeContent: HomeContent;
  setHomeContent: (content: HomeContent) => void;
  galleryItems: GalleryItem[];
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  layoutDirection: string;
  setLayoutDirection: (dir: string) => void;
  textAlignment: string;
  setTextAlignment: (align: string) => void;
  onResetDefaults: () => void;
  communityAnnouncements: News[];
  setCommunityAnnouncements: React.Dispatch<React.SetStateAction<News[]>>;
  visibleTabs: { [key: string]: boolean };
  setVisibleTabs: (tabs: { [key: string]: boolean }) => void;
  customPages: CustomPage[];
  setCustomPages: (pages: CustomPage[]) => void;
  activities: BusinessActivity[];
  setActivities: React.Dispatch<React.SetStateAction<BusinessActivity[]>>;
  surveyTemplates: SurveyTemplate[];
  setSurveyTemplates: React.Dispatch<React.SetStateAction<SurveyTemplate[]>>;
  surveyResponses: SurveyResponse[];
  setSurveyResponses: React.Dispatch<React.SetStateAction<SurveyResponse[]>>;
  citizens?: CitizenUser[];
  setCitizens?: React.Dispatch<React.SetStateAction<CitizenUser[]>>;
  marketplaceListings?: MarketplaceListing[];
  setMarketplaceListings?: React.Dispatch<React.SetStateAction<MarketplaceListing[]>>;
  ramadanSettings?: RamadanCompetitionSettings;
  setRamadanSettings?: React.Dispatch<React.SetStateAction<RamadanCompetitionSettings>>;
  ramadanQuestions?: RamadanQuestion[];
  setRamadanQuestions?: React.Dispatch<React.SetStateAction<RamadanQuestion[]>>;
  ramadanAnswers?: RamadanUserAnswer[];
  setRamadanAnswers?: React.Dispatch<React.SetStateAction<RamadanUserAnswer[]>>;
}

type AdminSubTab = 'home' | 'landmarks' | 'directory' | 'marketplace' | 'ramadan' | 'gallery' | 'services' | 'news' | 'projects' | 'citizens' | 'stats' | 'members' | 'pages' | 'citizen_accounts';

export default function AdminTab({
  services,
  setServices,
  newsList,
  setNewsList,
  projects,
  setProjects,
  suggestions,
  setSuggestions,
  requests,
  setRequests,
  homeContent,
  setHomeContent,
  galleryItems,
  setGalleryItems,
  communityAnnouncements,
  setCommunityAnnouncements,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  layoutDirection,
  setLayoutDirection,
  textAlignment,
  setTextAlignment,
  onResetDefaults,
  visibleTabs,
  setVisibleTabs,
  customPages,
  setCustomPages,
  activities,
  setActivities,
  surveyTemplates,
  setSurveyTemplates,
  surveyResponses,
  setSurveyResponses,
  citizens = [],
  setCitizens = () => {},
  marketplaceListings = [],
  setMarketplaceListings = () => {},
  ramadanSettings = {
    isCompetitionEnabled: true,
    title: 'المسابقة الرمضانية لبلدة قارة',
    subtitle: 'سؤال يومي طيلة شهر رمضان المبارك مع جوائز ونقاط تراكمية للأعضاء المسجلين',
    activeDay: 1,
    totalDays: 30
  },
  setRamadanSettings = () => {},
  ramadanQuestions = [],
  setRamadanQuestions = () => {},
  ramadanAnswers = [],
  setRamadanAnswers = () => {}
}: AdminTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('home');
  const [newsSubSection, setNewsSubSection] = useState<'articles' | 'community'>('articles');

  // --- Landmark Management States ---
  const [isAddingLandmark, setIsAddingLandmark] = useState(false);
  const [editingLandmarkId, setEditingLandmarkId] = useState<string | null>(null);
  const [landmarkForm, setLandmarkForm] = useState({
    title: '',
    period: '',
    location: '',
    description: '',
    docsSectionTitle: '',
    docsSectionContent: '',
    fullExplanation: '',
    image: '',
    showMediaSection: true,
    additionalSectionTitle: '',
    additionalImagesText: '',
    additionalImagesList: [] as string[],
    showAdditionalImages: true,
    videoUrl: '',
    researchNotes: '',
    modalFooterText: ''
  });
  const [landmarkSearch, setLandmarkSearch] = useState('');

  // --- Custom Pages States ---
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageDescription, setNewPageDescription] = useState('');
  const [newPageIsMain, setNewPageIsMain] = useState(true);
  const [newPageParentId, setNewPageParentId] = useState('');
  const [newPageTemplateId, setNewPageTemplateId] = useState<'landmarks' | 'crafts' | 'history' | 'tourism' | 'assembly'>('landmarks');
  
  // Editing state for an existing custom page
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingPageTitle, setEditingPageTitle] = useState('');
  const [editingPageDescription, setEditingPageDescription] = useState('');
  const [editingPageIntroText, setEditingPageIntroText] = useState('');
  const [editingPageSections, setEditingPageSections] = useState<{ id: string; title: string; content: string; badge?: string; image?: string }[]>([]);

  // --- Portal & Member Authentication States ---
  const [adminUsername, setAdminUsername] = useState<string>(() => {
    return localStorage.getItem('qara_admin_username') || 'admin';
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('qara_admin_password') || 'admin123';
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('qara_members');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fall back to defaults if parsing fails
      }
    }
    
    // Default initial members to showcase permissions
    return [
      {
        id: 'member_1',
        name: 'أحمد المحمد (المنسق الميداني)',
        username: 'ahmed_qara',
        password: 'Ahmed@2026Pass',
        permissions: {
          editHome: true,
          manageGallery: false,
          digitalServices: false,
          newsAndCommunity: true,
          projects: true,
          requestsAndSuggestions: false,
          statsAndCharts: false,
          manageDirectory: true,
          manageMarketplace: true,
          editLandmarks: false,
          liveStreamBroadcast: false
        }
      },
      {
        id: 'member_2',
        name: 'م. ليلى اليوسف (المشرفة الفنية)',
        username: 'leila_qara',
        password: 'Leila#2026Pass',
        permissions: {
          editHome: false,
          manageGallery: true,
          digitalServices: true,
          newsAndCommunity: false,
          projects: false,
          requestsAndSuggestions: true,
          statsAndCharts: true,
          manageDirectory: false,
          manageMarketplace: false,
          editLandmarks: true,
          liveStreamBroadcast: false
        }
      }
    ];
  });

  // Sync members to localStorage
  React.useEffect(() => {
    localStorage.setItem('qara_members', JSON.stringify(members));
  }, [members]);

  // Sync adminUsername & adminPassword to localStorage
  React.useEffect(() => {
    localStorage.setItem('qara_admin_username', adminUsername);
  }, [adminUsername]);

  React.useEffect(() => {
    localStorage.setItem('qara_admin_password', adminPassword);
  }, [adminPassword]);

  // Sync Board Members and General Admin automatically to Citizen Accounts
  React.useEffect(() => {
    if (!setCitizens) return;

    setCitizens(prevCitizens => {
      let updated = [...prevCitizens];

      // 1. Sync Super Admin Account
      const adminCitizenId = 'ctz_admin_super';
      const effectiveAdminUser = (adminUsername || 'admin').trim();
      const existingAdminIdx = updated.findIndex(c => c.id === adminCitizenId || c.email.toLowerCase() === effectiveAdminUser.toLowerCase());

      const adminCitizenData: CitizenUser = {
        id: adminCitizenId,
        fullName: 'مدير الموقع',
        email: effectiveAdminUser,
        password: adminPassword || 'admin123',
        phone: '0930000000',
        address: 'إدارة بلدة قارة',
        status: 'active',
        createdAt: new Date().toISOString(),
        isBoardMember: true,
        isSiteManager: true,
        badgeTitle: 'مدير الموقع 🛡️'
      };

      if (existingAdminIdx >= 0) {
        updated[existingAdminIdx] = { ...updated[existingAdminIdx], ...adminCitizenData };
      } else {
        updated.unshift(adminCitizenData);
      }

      // 2. Sync Board Members
      members.forEach(m => {
        const citizenId = `ctz_board_${m.id}`;
        const existingIdx = updated.findIndex(c => c.id === citizenId || c.email.toLowerCase() === m.username.trim().toLowerCase());

        const memberCitizenData: CitizenUser = {
          id: existingIdx >= 0 ? updated[existingIdx].id : citizenId,
          fullName: m.name,
          email: m.username.trim(),
          password: m.password || 'Qara2026@Pass!',
          phone: '0933000000',
          address: 'عضو مجلس إدارة بلدة قارة',
          status: 'active',
          createdAt: new Date().toISOString(),
          isBoardMember: true,
          badgeTitle: 'الإدارة 🛡️'
        };

        if (existingIdx >= 0) {
          updated[existingIdx] = { ...updated[existingIdx], ...memberCitizenData };
        } else {
          updated.push(memberCitizenData);
        }
      });

      return updated;
    });
  }, [members, adminUsername, adminPassword, setCitizens]);

  const [currentUser, setCurrentUser] = useState<{ role: 'admin' | 'member'; member?: Member } | null>(() => {
    const saved = localStorage.getItem('qara_logged_in_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Sync currentUser to localStorage
  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('qara_logged_in_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('qara_logged_in_user');
    }
  }, [currentUser]);

  // Login inputs
  const [loginRole, setLoginRole] = useState<'admin' | 'member'>('admin');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Member Management Form States
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // --- Directory Management States ---
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<BusinessActivity | null>(null);
  const [activityFormName, setActivityFormName] = useState('');
  const [activityFormCategory, setActivityFormCategory] = useState('تجاري');
  const [customFormCategory, setCustomFormCategory] = useState('');
  const [activityFormDescription, setActivityFormDescription] = useState('');
  const [activityFormPhone, setActivityFormPhone] = useState('');
  const [activityFormWhatsapp, setActivityFormWhatsapp] = useState('');
  const [activityFormAddress, setActivityFormAddress] = useState('');
  const [activityFormImage, setActivityFormImage] = useState('');
  const [activityFormIsPinned, setActivityFormIsPinned] = useState(false);
  const [activityFormCardColor, setActivityFormCardColor] = useState('#ffffff');
  const [activityFormCardStyle, setActivityFormCardStyle] = useState<'modern' | 'heritage' | 'classic' | 'simple'>('simple');
  const [tempDirectoryName, setTempDirectoryName] = useState(homeContent?.directoryPageName || 'الدليل التجاري والخدمي');

  // Category management states
  const [newCatInput, setNewCatInput] = useState('');
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editingCatValue, setEditingCatValue] = useState('');

  // News category management states
  const [newNewsCatInput, setNewNewsCatInput] = useState('');
  const [editingNewsCatIndex, setEditingNewsCatIndex] = useState<number | null>(null);
  const [editingNewsCatValue, setEditingNewsCatValue] = useState('');

  const currentNewsCategories = (homeContent?.newsCategories && homeContent.newsCategories.length > 0)
    ? homeContent.newsCategories
    : ["أخبار عامة", "بلدي", "اجتماعي", "رياضي", "ثقافي"];

  const handleAddNewsCategory = (catName?: string) => {
    const nameToAdd = (catName || newNewsCatInput).trim();
    if (!nameToAdd) return;
    if (currentNewsCategories.includes(nameToAdd)) {
      triggerNotification('هذا التبويب الإخباري موجود بالفعل في القائمة!');
      return;
    }
    const updated = [...currentNewsCategories, nameToAdd];
    setHomeContent({
      ...homeContent,
      newsCategories: updated
    });
    setNewNewsCatInput('');
    triggerNotification(`تم إضافة تبويب الأخبار "${nameToAdd}" بنجاح!`);
  };

  const handleEditNewsCategory = (index: number) => {
    const oldCatName = currentNewsCategories[index];
    const newCatName = editingNewsCatValue.trim();
    if (!newCatName || newCatName === oldCatName) {
      setEditingNewsCatIndex(null);
      return;
    }
    const updatedCategories = [...currentNewsCategories];
    updatedCategories[index] = newCatName;

    // Update existing news articles that were assigned to oldCatName
    const updatedNews = newsList.map(item => {
      if (item.category === oldCatName) {
        return { ...item, category: newCatName };
      }
      return item;
    });

    setNewsList(updatedNews);
    setHomeContent({
      ...homeContent,
      newsCategories: updatedCategories
    });
    setEditingNewsCatIndex(null);
    setEditingNewsCatValue('');
    triggerNotification(`تم تعديل اسم التبويب من "${oldCatName}" إلى "${newCatName}" بنجاح!`);
  };

  const handleDeleteNewsCategory = (catName: string) => {
    if (currentNewsCategories.length <= 1) {
      triggerNotification('يجب الإبقاء على تبويب إخباري واحد على الأقل!');
      return;
    }
    if (window.confirm(`هل أنت متأكد من حذف تبويب الأخبار "${catName}"؟`)) {
      const updatedCategories = currentNewsCategories.filter(c => c !== catName);
      setHomeContent({
        ...homeContent,
        newsCategories: updatedCategories
      });
      triggerNotification(`تم حذف التبويب الإخباري "${catName}".`);
    }
  };

  // --- Ramadan Competition Admin States & Handlers ---
  const [ramadanActiveSection, setRamadanActiveSection] = useState<'questions' | 'card_design' | 'prayer_times' | 'settings' | 'sponsors' | 'submissions'>('questions');
  const [isAddingRamadanQuestion, setIsAddingRamadanQuestion] = useState(false);
  const [editingRamadanQuestion, setEditingRamadanQuestion] = useState<RamadanQuestion | null>(null);

  // Ramadan Sponsor Ad Management States
  const [editingSponsorIndex, setEditingSponsorIndex] = useState<number | null>(null);
  const [sponsorFormTitle, setSponsorFormTitle] = useState('');
  const [sponsorFormType, setSponsorFormType] = useState('راعي المسابقة الرمضانية');
  const [sponsorFormDesc, setSponsorFormDesc] = useState('');
  const [sponsorFormImageUrl, setSponsorFormImageUrl] = useState('');
  const [sponsorFormLinkUrl, setSponsorFormLinkUrl] = useState('');
  const [sponsorFormButtonText, setSponsorFormButtonText] = useState('التواصل والمعلومات الإضافية');
  const [sponsorFormDuration, setSponsorFormDuration] = useState<number>(5);
  const [sponsorFormBadgeColor, setSponsorFormBadgeColor] = useState('#fbbf24');
  const [sponsorFormActive, setSponsorFormActive] = useState(true);
  const [sponsorFormIsPinned, setSponsorFormIsPinned] = useState(false);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [ramadanFormDay, setRamadanFormDay] = useState<number>(ramadanSettings.activeDay || 1);
  const [ramadanFormQuestionText, setRamadanFormQuestionText] = useState('');
  const [ramadanFormCategory, setRamadanFormCategory] = useState('سيرة ونبوّة');
  const [ramadanFormOptions, setRamadanFormOptions] = useState<string[]>(['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع']);
  const [ramadanFormCorrectIdx, setRamadanFormCorrectIdx] = useState<number>(0);
  const [ramadanFormExplanation, setRamadanFormExplanation] = useState('');
  const [ramadanFormPoints, setRamadanFormPoints] = useState<number>(10);
  const [ramadanFilterDay, setRamadanFilterDay] = useState<number | 'all'>('all');

  // Ramadan Answers Filter & Excel Export States
  const [ramadanAnswersFilter, setRamadanAnswersFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [ramadanAnswersDayFilter, setRamadanAnswersDayFilter] = useState<number | 'all'>('all');
  const [ramadanAnswersSearch, setRamadanAnswersSearch] = useState('');

  const handleExportRamadanAnswersToExcel = () => {
    if (ramadanAnswers.length === 0) {
      triggerNotification('لا توجد إجابات لتصديرها');
      return;
    }

    let listToExport = [...ramadanAnswers];

    if (ramadanAnswersFilter === 'correct') {
      listToExport = listToExport.filter(a => a.isCorrect);
    } else if (ramadanAnswersFilter === 'incorrect') {
      listToExport = listToExport.filter(a => !a.isCorrect);
    }

    if (ramadanAnswersDayFilter !== 'all') {
      listToExport = listToExport.filter(a => a.dayNumber === Number(ramadanAnswersDayFilter));
    }

    if (ramadanAnswersSearch.trim()) {
      const q = ramadanAnswersSearch.toLowerCase();
      listToExport = listToExport.filter(a =>
        (a.userName || '').toLowerCase().includes(q) ||
        (a.userUsername || '').toLowerCase().includes(q)
      );
    }

    if (listToExport.length === 0) {
      triggerNotification('لا توجد نتائج تطابق خيارات التصفية الحالية لتصديرها');
      return;
    }

    const headers = ['اليوم الرمضاني', 'اسم العضو المشارك', 'اسم المستخدم', 'السؤال الرمضاني', 'الخيار المختار', 'نتيجة الإجابة', 'تاريخ ووقت الإجابة'];

    const rows = listToExport.map(a => {
      const qObj = ramadanQuestions.find(rq => rq.dayNumber === a.dayNumber || rq.id === a.questionId);
      const questionText = qObj?.questionText || `سؤال اليوم ${a.dayNumber}`;
      return [
        `اليوم ${a.dayNumber} رمضان`,
        `"${(a.userName || '').replace(/"/g, '""')}"`,
        `"${(a.userUsername || '').replace(/"/g, '""')}"`,
        `"${questionText.replace(/"/g, '""')}"`,
        `"${(a.selectedOption || '').replace(/"/g, '""')}"`,
        a.isCorrect ? 'إجابة صحيحة ✓' : 'إجابة خاطئة ✗',
        `"${(a.submittedAt || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `سجل_إجابات_المسابقة_الرمضانية_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification('تم تصدير سجل الإجابات إلى ملف Excel بنجاح!');
  };

  // Ramadan Settings Form States
  const [tempRamadanTitle, setTempRamadanTitle] = useState(ramadanSettings.title);
  const [tempRamadanSubtitle, setTempRamadanSubtitle] = useState(ramadanSettings.subtitle);
  const [tempRamadanActiveDay, setTempRamadanActiveDay] = useState(ramadanSettings.activeDay);
  const [tempRamadanTotalDays, setTempRamadanTotalDays] = useState(ramadanSettings.totalDays);

  const handleSaveRamadanSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setRamadanSettings(prev => ({
      ...prev,
      title: tempRamadanTitle.trim(),
      subtitle: tempRamadanSubtitle.trim(),
      activeDay: Number(tempRamadanActiveDay),
      totalDays: Number(tempRamadanTotalDays)
    }));
    triggerNotification('تم حفظ وتحديث إعدادات المسابقة الرمضانية بنجاح!');
  };

  const handleSponsorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        triggerNotification('حجم الصورة كبير جداً! يرجى اختيار صورة أقل من 5 ميغابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSponsorFormImageUrl(reader.result);
          triggerNotification('تم رفع واختيار الصورة بنجاح! 🖼️');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRamadanHeaderBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        triggerNotification('حجم الصورة كبير جداً! يرجى اختيار صورة أقل من 5 ميغابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setRamadanSettings(prev => ({
            ...prev,
            headerBannerImageUrl: reader.result as string
          }));
          triggerNotification('تم رفع واختيار صورة البنر الرئيسي بنجاح! 🖼️');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddSponsor = () => {
    setEditingSponsorIndex(null);
    setSponsorFormTitle('');
    setSponsorFormType('الراعي الرسمي');
    setSponsorFormDesc('');
    setSponsorFormImageUrl('');
    setSponsorFormLinkUrl('');
    setSponsorFormButtonText('التواصل والمعلومات الإضافية');
    setSponsorFormDuration(5);
    setSponsorFormBadgeColor('#fbbf24');
    setSponsorFormActive(true);
    setSponsorFormIsPinned(false);
    setIsSponsorModalOpen(true);
  };

  const handleOpenEditSponsor = (index: number, sponsor: RamadanSponsorAd) => {
    setEditingSponsorIndex(index);
    setSponsorFormTitle(sponsor.title || '');
    setSponsorFormType(sponsor.sponsorType || 'راعي المسابقة الرمضانية');
    setSponsorFormDesc(sponsor.description || '');
    setSponsorFormImageUrl(sponsor.imageUrl || '');
    setSponsorFormLinkUrl(sponsor.linkUrl || '');
    setSponsorFormButtonText(sponsor.buttonText || 'التواصل والمعلومات الإضافية');
    setSponsorFormDuration(sponsor.durationSeconds || 5);
    setSponsorFormBadgeColor(sponsor.badgeBgColor || '#fbbf24');
    setSponsorFormActive(sponsor.isActive !== false);
    setSponsorFormIsPinned(sponsor.isPinned === true);
    setIsSponsorModalOpen(true);
  };

  const handleSaveSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorFormTitle.trim()) {
      triggerNotification('الرجاء كتابة اسم الراعي أو عنوان الإعلان!');
      return;
    }

    const sponsorObj: RamadanSponsorAd = {
      id: editingSponsorIndex !== null && ramadanSettings.sponsorsList?.[editingSponsorIndex]?.id
        ? ramadanSettings.sponsorsList[editingSponsorIndex].id
        : `sponsor_${Date.now()}`,
      title: sponsorFormTitle.trim(),
      sponsorType: sponsorFormType.trim(),
      description: sponsorFormDesc.trim(),
      imageUrl: sponsorFormImageUrl.trim(),
      linkUrl: sponsorFormLinkUrl.trim(),
      buttonText: sponsorFormButtonText.trim(),
      durationSeconds: Number(sponsorFormDuration) || 5,
      badgeBgColor: sponsorFormBadgeColor,
      isActive: sponsorFormActive,
      isPinned: sponsorFormIsPinned
    };

    const currentList = ramadanSettings.sponsorsList || [];
    let updatedList: RamadanSponsorAd[] = [];

    if (editingSponsorIndex !== null) {
      updatedList = [...currentList];
      updatedList[editingSponsorIndex] = sponsorObj;
    } else {
      updatedList = [...currentList, sponsorObj];
    }

    // Ensure only ONE sponsor is pinned if sponsorFormIsPinned is true
    if (sponsorFormIsPinned) {
      updatedList = updatedList.map(s => {
        if (s.id === sponsorObj.id) return s;
        return { ...s, isPinned: false };
      });
    }

    setRamadanSettings(prev => ({
      ...prev,
      sponsorsList: updatedList
    }));

    setIsSponsorModalOpen(false);
    triggerNotification(editingSponsorIndex !== null ? 'تم تحديث بيانات الراعي بنجاح!' : 'تم إضافة الراعي الإعلاني الجديد بنجاح!');
  };

  const handleTogglePinSponsor = (index: number) => {
    const currentList = ramadanSettings.sponsorsList || [];
    const target = currentList[index];
    if (!target) return;

    const willBePinned = !target.isPinned;
    const updatedList = currentList.map((s, idx) => {
      if (idx === index) {
        return { ...s, isPinned: willBePinned };
      }
      // If pinning this target, unpin all others
      if (willBePinned) {
        return { ...s, isPinned: false };
      }
      return s;
    });

    setRamadanSettings(prev => ({
      ...prev,
      sponsorsList: updatedList
    }));

    if (willBePinned) {
      triggerNotification(`تم تثبيت إعلان "${target.title}" كإعلان مثبّت رئيسي 📌`);
    } else {
      triggerNotification(`تم إلغاء تثبيت إعلان "${target.title}"`);
    }
  };

  const handleDeleteSponsor = (index: number) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف هذا الراعي الإعلاني؟')) {
      const currentList = ramadanSettings.sponsorsList || [];
      const updatedList = currentList.filter((_, idx) => idx !== index);
      setRamadanSettings(prev => ({
        ...prev,
        sponsorsList: updatedList
      }));
      triggerNotification('تم حذف الإعلان بنجاح!');
    }
  };

  const handleOpenAddRamadanQuestion = () => {
    setEditingRamadanQuestion(null);
    const maxDay = ramadanQuestions.length > 0 ? Math.max(...ramadanQuestions.map(q => q.dayNumber)) : 0;
    setRamadanFormDay(maxDay < 30 ? maxDay + 1 : 1);
    setRamadanFormQuestionText('');
    setRamadanFormCategory('سيرة ونبوّة');
    setRamadanFormOptions(['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع']);
    setRamadanFormCorrectIdx(0);
    setRamadanFormExplanation('');
    setRamadanFormPoints(10);
    setIsAddingRamadanQuestion(true);
  };

  const handleOpenEditRamadanQuestion = (q: RamadanQuestion) => {
    setEditingRamadanQuestion(q);
    setRamadanFormDay(q.dayNumber);
    setRamadanFormQuestionText(q.questionText);
    setRamadanFormCategory(q.category || 'عام');
    setRamadanFormOptions([...q.options]);
    setRamadanFormCorrectIdx(q.correctOptionIndex);
    setRamadanFormExplanation(q.explanation || '');
    setRamadanFormPoints(q.points || 10);
    setIsAddingRamadanQuestion(true);
  };

  const handleSaveRamadanQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOptions = ramadanFormOptions.map(o => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      triggerNotification('الرجاء إدخال خيارين على الأقل للخيارات المتعددة!');
      return;
    }
    if (ramadanFormCorrectIdx >= cleanOptions.length) {
      triggerNotification('الرجاء اختيار إجابة صحيحة من ضمن الخيارات المحددة!');
      return;
    }

    if (editingRamadanQuestion) {
      const updated = ramadanQuestions.map(q => {
        if (q.id === editingRamadanQuestion.id) {
          return {
            ...q,
            dayNumber: Number(ramadanFormDay),
            questionText: ramadanFormQuestionText.trim(),
            options: cleanOptions,
            correctOptionIndex: ramadanFormCorrectIdx,
            category: ramadanFormCategory.trim(),
            explanation: ramadanFormExplanation.trim(),
            points: Number(ramadanFormPoints)
          };
        }
        return q;
      });
      setRamadanQuestions(updated);
      triggerNotification('تم تحديث السؤال الرمضاني بنجاح!');
    } else {
      const newQ: RamadanQuestion = {
        id: 'ramadan_q_' + Date.now(),
        dayNumber: Number(ramadanFormDay),
        questionText: ramadanFormQuestionText.trim(),
        options: cleanOptions,
        correctOptionIndex: ramadanFormCorrectIdx,
        category: ramadanFormCategory.trim(),
        explanation: ramadanFormExplanation.trim(),
        points: Number(ramadanFormPoints)
      };
      setRamadanQuestions([...ramadanQuestions, newQ]);
      triggerNotification('تم إضافة السؤال الرمضاني الجديد بنجاح!');
    }
    setIsAddingRamadanQuestion(false);
    setEditingRamadanQuestion(null);
  };

  const handleDeleteRamadanQuestion = (id: string) => {
    setConfirmConfig({
      title: 'حذف السؤال الرمضاني',
      message: 'هل أنت متأكد من حذف هذا السؤال النهائي من المسابقة؟',
      danger: true,
      onConfirm: () => {
        setRamadanQuestions(ramadanQuestions.filter(q => q.id !== id));
        triggerNotification('تم حذف السؤال.');
      }
    });
  };

  const handleClearRamadanAnswers = () => {
    setConfirmConfig({
      title: 'تصفير إجابات المسابقة الرمضانية',
      message: 'هل أنت متأكد من مسح كافة سجلات إجابات الأعضاء وتصفير النقاط التراكمية؟ لا يمكن التراجع عن هذا الإجراء.',
      danger: true,
      onConfirm: () => {
        setRamadanAnswers([]);
        triggerNotification('تمت تصفير كافة إجابات وسجلات المسابقة الرمضانية بنجاح.');
      }
    });
  };

  const currentCategories = (homeContent?.directoryCategories && homeContent.directoryCategories.length > 0)
    ? homeContent.directoryCategories
    : ["تجاري", "خدمي", "صحي", "تراثي", "تعليمي", "زراعي", "صناعي", "مهن وحرف"];

  const handleAddDirectoryCategory = (catName?: string) => {
    const nameToAdd = (catName || newCatInput).trim();
    if (!nameToAdd) return;
    if (currentCategories.includes(nameToAdd)) {
      triggerNotification('هذا التصنيف موجود بالفعل في القائمة!');
      return;
    }
    const updated = [...currentCategories, nameToAdd];
    setHomeContent({
      ...homeContent,
      directoryCategories: updated
    });
    setNewCatInput('');
    triggerNotification(`تم إضافة تصنيف "${nameToAdd}" بنجاح!`);
  };

  const handleEditDirectoryCategory = (index: number) => {
    const oldCatName = currentCategories[index];
    const newCatName = editingCatValue.trim();
    if (!newCatName || newCatName === oldCatName) {
      setEditingCatIndex(null);
      return;
    }
    const updatedCategories = [...currentCategories];
    updatedCategories[index] = newCatName;

    // Update existing activities that were assigned to oldCatName
    const updatedActivities = activities.map(act => {
      if (act.category === oldCatName) {
        return { ...act, category: newCatName };
      }
      return act;
    });

    setActivities(updatedActivities);
    setHomeContent({
      ...homeContent,
      directoryCategories: updatedCategories
    });
    setEditingCatIndex(null);
    setEditingCatValue('');
    triggerNotification(`تم تعديل اسم التصنيف من "${oldCatName}" إلى "${newCatName}" بنجاح!`);
  };

  const handleDeleteDirectoryCategory = (catName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف تصنيف "${catName}"؟`)) {
      const updatedCategories = currentCategories.filter(c => c !== catName);
      setHomeContent({
        ...homeContent,
        directoryCategories: updatedCategories
      });
      triggerNotification(`تم حذف تصنيف "${catName}" بنجاح!`);
    }
  };

  const handleSaveDirectoryName = () => {
    if (!tempDirectoryName.trim()) {
      triggerNotification('الرجاء إدخال اسم صحيح للصفحة');
      return;
    }
    setHomeContent({
      ...homeContent,
      directoryPageName: tempDirectoryName.trim()
    });
    triggerNotification('تم تحديث مسمى صفحة الدليل بنجاح!');
  };

  const handleOpenAddActivity = () => {
    setEditingActivity(null);
    setActivityFormName('');
    setActivityFormCategory(currentCategories[0] || 'تجاري');
    setCustomFormCategory('');
    setActivityFormDescription('');
    setActivityFormPhone('');
    setActivityFormWhatsapp('');
    setActivityFormAddress('');
    setActivityFormImage('');
    setActivityFormIsPinned(false);
    setActivityFormCardColor('#ffffff');
    setActivityFormCardStyle('simple');
    setIsAddingActivity(true);
  };

  const handleOpenEditActivity = (act: BusinessActivity) => {
    setEditingActivity(act);
    setActivityFormName(act.name);
    setActivityFormCategory(act.category || currentCategories[0] || 'تجاري');
    setCustomFormCategory('');
    setActivityFormDescription(act.description || '');
    setActivityFormPhone(act.phone || '');
    setActivityFormWhatsapp(act.whatsapp || '');
    setActivityFormAddress(act.address || '');
    setActivityFormImage(act.image || '');
    setActivityFormIsPinned(!!act.isPinned);
    setActivityFormCardColor(act.cardColor || '#ffffff');
    setActivityFormCardStyle(act.cardStyle || 'simple');
    setIsAddingActivity(false);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityFormName) return;

    let finalCategory = activityFormCategory;
    if (activityFormCategory === '__new__') {
      if (!customFormCategory.trim()) {
        triggerNotification('الرجاء إدخال اسم التصنيف الجديد!');
        return;
      }
      finalCategory = customFormCategory.trim();
      if (!currentCategories.includes(finalCategory)) {
        setHomeContent({
          ...homeContent,
          directoryCategories: [...currentCategories, finalCategory]
        });
      }
    }

    if (editingActivity) {
      // Editing existing activity
      const updated = activities.map(act => {
        if (act.id === editingActivity.id) {
          return {
            ...act,
            name: activityFormName,
            activity: activityFormDescription || finalCategory, // Use description as activity!
            category: finalCategory,
            description: activityFormDescription,
            phone: activityFormPhone,
            whatsapp: activityFormWhatsapp,
            address: activityFormAddress,
            image: activityFormImage,
            isPinned: activityFormIsPinned,
            cardColor: activityFormCardColor,
            cardStyle: activityFormCardStyle
          };
        }
        return act;
      });
      setActivities(updated);
      setEditingActivity(null);
      triggerNotification('تم تحديث الفعالية التجارية/الخدمية بنجاح!');
    } else {
      // Adding new activity
      const newActivity: BusinessActivity = {
        id: `activity_${Date.now()}`,
        name: activityFormName,
        activity: activityFormDescription || finalCategory, // Use description as activity!
        category: finalCategory,
        description: activityFormDescription,
        phone: activityFormPhone,
        whatsapp: activityFormWhatsapp,
        address: activityFormAddress,
        image: activityFormImage,
        isPinned: activityFormIsPinned,
        cardColor: activityFormCardColor,
        cardStyle: activityFormCardStyle,
        status: 'approved', // Admin addition is auto-approved
        createdAt: new Date().toISOString(), // Map to required 'createdAt' field
        date: new Date().toISOString()
      };
      setActivities([newActivity, ...activities]);
      setIsAddingActivity(false);
      triggerNotification('تم إضافة الفعالية التجارية/الخدمية بنجاح!');
    }
  };

  const handleDeleteActivity = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفعالية نهائياً؟')) {
      const updated = activities.filter(act => act.id !== id);
      setActivities(updated);
      triggerNotification('تم حذف الفعالية التجارية/الخدمية بنجاح.');
    }
  };

  const handleApproveActivity = (id: string) => {
    const updated = activities.map(act => {
      if (act.id === id) {
        return { ...act, status: 'approved' as const };
      }
      return act;
    });
    setActivities(updated);
    triggerNotification('تم الموافقة على عرض الفعالية التجارية/الخدمية في الدليل بنجاح!');
  };

  const handleTogglePinActivity = (id: string) => {
    const updated = activities.map(act => {
      if (act.id === id) {
        const newPinned = !act.isPinned;
        triggerNotification(newPinned ? 'تم تثبيت الفعالية في أعلى الدليل!' : 'تم إلغاء تثبيت الفعالية.');
        return { ...act, isPinned: newPinned };
      }
      return act;
    });
    setActivities(updated);
  };
  
  // Suggestion Editing States
  const [editingSug, setEditingSug] = useState<Suggestion | null>(null);
  const [sugFormTitle, setSugFormTitle] = useState('');
  const [sugFormContent, setSugFormContent] = useState('');
  const [sugFormCategory, setSugFormCategory] = useState<'تحسين خدمات' | 'فكرة مشروع' | 'شكوى' | 'أخرى'>('فكرة مشروع');

  const handleSaveSuggestionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSug || !sugFormTitle || !sugFormContent) return;

    const updated = suggestions.map(s => {
      if (s.id === editingSug.id) {
        return {
          ...s,
          title: sugFormTitle,
          content: sugFormContent,
          category: sugFormCategory
        };
      }
      return s;
    });

    setSuggestions(updated);
    setEditingSug(null);
    triggerNotification('تم تعديل وتصحيح المقترح بنجاح!');
  };

  // --- Custom Pages Handlers ---
  const handleCreateCustomPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle || !newPageDescription) {
      triggerNotification('الرجاء تعبئة العنوان والشرح المبسط!');
      return;
    }

    // Generate a unique dynamic ID
    const uniqueId = 'custom_' + Date.now().toString(36);
    const parentId = newPageIsMain ? undefined : (newPageParentId || undefined);

    const newPage = createDefaultPageFromTemplate(
      uniqueId,
      newPageTitle,
      newPageDescription,
      newPageIsMain,
      parentId,
      newPageTemplateId
    );

    setCustomPages([...customPages, newPage]);
    
    // Reset fields
    setNewPageTitle('');
    setNewPageDescription('');
    setNewPageIsMain(true);
    setNewPageParentId('');
    
    triggerNotification('تم إنشاء الصفحة التراثية الجديدة وإضافتها لقائمة التبويبات بنجاح!');
  };

  const handleDeleteCustomPage = (id: string) => {
    setConfirmConfig({
      title: 'حذف الصفحة المخصصة',
      message: 'هل أنت متأكد تماماً من رغبتك بحذف هذه الصفحة وكامل محتوياتها وأقسامها التراثية نهائياً من الموقع؟ لا يمكن التراجع عن هذا الإجراء.',
      danger: true,
      onConfirm: () => {
        setCustomPages(customPages.filter(p => p.id !== id));
        if (editingPageId === id) {
          setEditingPageId(null);
        }
        triggerNotification('تم حذف الصفحة المخصصة نهائياً من قائمة التبويبات.');
      }
    });
  };

  const handleStartEditCustomPage = (page: CustomPage) => {
    setEditingPageId(page.id);
    setEditingPageTitle(page.title);
    setEditingPageDescription(page.description);
    setEditingPageIntroText(page.content.introText);
    setEditingPageSections(page.content.sections.map(sec => ({ ...sec })));
  };

  const handleUpdateEditingSection = (index: number, field: string, value: string) => {
    const updated = [...editingPageSections];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setEditingPageSections(updated);
  };

  const handleSaveCustomPageEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPageId || !editingPageTitle || !editingPageDescription) {
      triggerNotification('الرجاء إدخال الحقول المطلوبة لتعديل الصفحة!');
      return;
    }

    const updatedPages = customPages.map(page => {
      if (page.id === editingPageId) {
        return {
          ...page,
          title: editingPageTitle,
          description: editingPageDescription,
          content: {
            introText: editingPageIntroText,
            sections: editingPageSections
          }
        };
      }
      return page;
    });

    setCustomPages(updatedPages);
    setEditingPageId(null);
    triggerNotification('تم حفظ وتعديل محتوى الصفحة التراثية المخصصة بنجاح!');
  };

  const [memberFormName, setMemberFormName] = useState('');
  const [memberFormUsername, setMemberFormUsername] = useState('');
  const [memberFormPassword, setMemberFormPassword] = useState('');
  const [memberFormPermissions, setMemberFormPermissions] = useState<MemberPermissions>({
    editHome: false,
    manageGallery: false,
    digitalServices: false,
    newsAndCommunity: false,
    projects: false,
    requestsAndSuggestions: false,
    statsAndCharts: false,
    manageDirectory: false,
    manageMarketplace: false,
    editLandmarks: false,
    liveStreamBroadcast: false
  });

  const getMemberAllowedTabsList = (perms: MemberPermissions): AdminSubTab[] => {
    if (!perms) return [];
    const list: AdminSubTab[] = [];
    if (perms.editHome) list.push('home');
    if (perms.editLandmarks || perms.editHome) list.push('landmarks');
    if (perms.manageDirectory !== false) list.push('directory');
    if (perms.manageMarketplace !== false) list.push('marketplace');
    list.push('ramadan');
    if (perms.manageGallery) list.push('gallery');
    if (perms.digitalServices) list.push('services');
    if (perms.newsAndCommunity) list.push('news');
    if (perms.projects) list.push('projects');
    if (perms.requestsAndSuggestions) list.push('citizens');
    if (perms.statsAndCharts) list.push('stats');
    return list;
  };

  const getAllowedSubTabs = (): { id: AdminSubTab; label: string; count: any; color: string }[] => {
    const heritageCount = homeContent.heritagePoints ? homeContent.heritagePoints.length : 0;
    const allTabs: { id: AdminSubTab; label: string; count: any; color: string }[] = [
      { id: 'home', label: 'تعديل الصفحة الرئيسية', count: '⚙', color: 'emerald' },
      { id: 'landmarks', label: 'المعالم الأثرية', count: heritageCount, color: 'amber' },
      { id: 'directory', label: 'إدارة الدليل التجاري والخدمي', count: activities.filter(p => p.status === 'pending').length > 0 ? `${activities.filter(p => p.status === 'pending').length} معلّق` : activities.length, color: 'sky' },
      { id: 'marketplace', label: '🛒 إدارة متجر قارة الإلكتروني (البيع والشراء)', count: marketplaceListings.length, color: 'emerald' },
      { id: 'ramadan', label: '🌙 إدارة المسابقة الرمضانية', count: ramadanQuestions.length, color: 'emerald' },
      { id: 'gallery', label: 'إدارة معرض الصور والذكريات', count: galleryItems.filter(p => p.status === 'pending').length > 0 ? `${galleryItems.filter(p => p.status === 'pending').length} معلّق` : galleryItems.length, color: 'amber' },
      { id: 'services', label: 'الخدمات الرقمية والمعاملات', count: services.length, color: 'emerald' },
      { id: 'news', label: 'محرر الأخبار والفعاليات ومنبر الأهالي', count: communityAnnouncements.filter(p => p.status === 'pending').length > 0 ? `${newsList.length} + ${communityAnnouncements.filter(p => p.status === 'pending').length} جديد` : newsList.length, color: 'amber' },
      { id: 'projects', label: 'المشاريع التنموية', count: projects.length, color: 'blue' },
      { id: 'citizens', label: 'طلبات ومقترحات المواطنين', count: requests.length + suggestions.length, color: 'rose' },
      { id: 'stats', label: 'الرسوم البيانية والإحصائيات', count: '📊', color: 'indigo' },
      { id: 'pages', label: 'إدارة الصفحات والقوائم', count: customPages.length, color: 'sky' },
      { id: 'members', label: 'إدارة الأعضاء والصلاحيات', count: members.length, color: 'violet' },
      { id: 'citizen_accounts', label: 'إدارة حسابات المواطنين 👤', count: citizens.length, color: 'indigo' }
    ];

    if (!currentUser) return [];
    if (currentUser.role === 'admin') {
      return allTabs; // Admin sees everything
    }

    // Member sees only their permitted tabs
    const perms = currentUser.member?.permissions;
    if (!perms) return [];

    const allowedIds = getMemberAllowedTabsList(perms);
    return allTabs.filter(tab => allowedIds.includes(tab.id));
  };

  const allowedTabs = getAllowedSubTabs();
  React.useEffect(() => {
    if (currentUser && allowedTabs.length > 0) {
      // If the current active tab is not in the allowed tabs list, switch to the first allowed one
      const isAllowed = allowedTabs.some(t => t.id === activeSubTab);
      if (!isAllowed) {
        setActiveSubTab(allowedTabs[0].id);
      }
    }
  }, [currentUser, activeSubTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanPassword = loginPassword.trim();
    const cleanUsername = loginUsername.trim().toLowerCase();
    const effectiveAdminPassword = (adminPassword || 'admin123').trim();

    if (loginRole === 'admin') {
      if (cleanPassword === effectiveAdminPassword) {
        setCurrentUser({ role: 'admin' });
        setActiveSubTab('home');
        setLoginPassword('');
        triggerNotification('تم تسجيل الدخول بصفتك المدير العام بكامل الصلاحيات المطلقة!');
      } else {
        setLoginError('كلمة مرور المدير العام غير صحيحة! كلمة المرور الافتراضية هي: admin123');
      }
    } else {
      if (!cleanUsername) {
        setLoginError('يرجى كتابة اسم مستخدم العضو!');
        return;
      }

      const foundMember = members.find(
        m => m.username.trim().toLowerCase() === cleanUsername && (m.password || '').trim() === cleanPassword
      );

      if (foundMember) {
        setCurrentUser({ role: 'member', member: foundMember });
        
        // Find first permitted tab
        const allowed = getMemberAllowedTabsList(foundMember.permissions);
        const firstTab: AdminSubTab = allowed.length > 0 ? allowed[0] : 'home';

        setActiveSubTab(firstTab);
        setLoginUsername('');
        setLoginPassword('');
        triggerNotification(`أهلاً بك يا ${foundMember.name}! تم تسجيل الدخول بصلاحياتك المحددة.`);
      } else {
        setLoginError('اسم المستخدم أو كلمة المرور للأعضاء غير صحيحة!');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    triggerNotification('تم تسجيل الخروج بنجاح.');
  };

  const handleOpenAddMember = () => {
    setIsAddingMember(true);
    setEditingMember(null);
    setMemberFormName('');
    setMemberFormUsername('');
    setMemberFormPassword('');
    setMemberFormPermissions({
      editHome: false,
      manageGallery: false,
      digitalServices: false,
      newsAndCommunity: false,
      projects: false,
      requestsAndSuggestions: false,
      statsAndCharts: false,
      manageDirectory: true,
      manageMarketplace: true,
      editLandmarks: false,
      liveStreamBroadcast: false
    });
  };

  const handleOpenEditMember = (member: Member) => {
    setEditingMember(member);
    setIsAddingMember(false);
    setMemberFormName(member.name);
    setMemberFormUsername(member.username);
    setMemberFormPassword(member.password || '');
    setMemberFormPermissions({
      editHome: !!member.permissions.editHome,
      manageGallery: !!member.permissions.manageGallery,
      digitalServices: !!member.permissions.digitalServices,
      newsAndCommunity: !!member.permissions.newsAndCommunity,
      projects: !!member.permissions.projects,
      requestsAndSuggestions: !!member.permissions.requestsAndSuggestions,
      statsAndCharts: !!member.permissions.statsAndCharts,
      manageDirectory: member.permissions.manageDirectory !== false,
      manageMarketplace: member.permissions.manageMarketplace !== false,
      editLandmarks: !!member.permissions.editLandmarks,
      liveStreamBroadcast: !!member.permissions.liveStreamBroadcast
    });
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberFormName.trim() || !memberFormUsername.trim() || !memberFormPassword.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة!');
      return;
    }

    // Username validation
    const uVal = validateUsername(memberFormUsername);
    if (!uVal.isValid) {
      alert(uVal.message || 'اسم المستخدم يجب أن يتألف حصراً من أحرف إنجليزية وأرقام ورموز مسموحة بدون مساحات أو أحرف عربية');
      return;
    }

    // Password validation
    const pVal = validatePassword(memberFormPassword);
    if (!pVal.isValid) {
      alert(pVal.message || 'كلمة المرور يجب أن تتألف من 10 خانات على الأقل وتحتوي أحرف كبيرة وصغيرة وأرقام ورمز');
      return;
    }

    // Check username uniqueness
    const lowerUsername = memberFormUsername.trim().toLowerCase();
    const effectiveAdminUser = (adminUsername || 'admin').trim().toLowerCase();
    const isDuplicate = members.some(m => m.username.toLowerCase() === lowerUsername && (!editingMember || m.id !== editingMember.id));
    if (isDuplicate || lowerUsername === 'admin' || lowerUsername === effectiveAdminUser) {
      alert('اسم المستخدم هذا مستخدم بالفعل! يرجى اختيار اسم آخر.');
      return;
    }

    if (editingMember) {
      // Edit existing
      const updatedMembers = members.map(m => {
        if (m.id === editingMember.id) {
          return {
            ...m,
            name: memberFormName.trim(),
            username: memberFormUsername.trim(),
            password: memberFormPassword,
            permissions: { ...memberFormPermissions }
          };
        }
        return m;
      });
      setMembers(updatedMembers);
      
      // If editing self as a logged in member, update current user too
      if (currentUser?.role === 'member' && currentUser.member?.id === editingMember.id) {
        const selfUpdated = updatedMembers.find(m => m.id === editingMember.id);
        if (selfUpdated) {
          setCurrentUser({ role: 'member', member: selfUpdated });
        }
      }

      setEditingMember(null);
      triggerNotification('تم تحديث بيانات عضو مجلس الإدارة وتزامن حسابه كعضو مواطن بنجاح!');
    } else {
      // Add new
      const newMember: Member = {
        id: 'member_' + Date.now(),
        name: memberFormName.trim(),
        username: memberFormUsername.trim(),
        password: memberFormPassword,
        permissions: { ...memberFormPermissions }
      };
      setMembers([...members, newMember]);
      setIsAddingMember(false);
      triggerNotification(`تم تسجيل العضو ${newMember.name} وتوليد حساب مواطن تلقائي له بشارة (الإدارة 🛡️) بنجاح!`);
    }
  };

  const handleDeleteMember = (id: string) => {
    setConfirmConfig({
      title: 'حذف العضو المسجل',
      message: 'هل أنت متأكد من رغبتك في حذف هذا العضو بالكامل وسحب كافة صلاحياته للوصول للبوابة؟',
      danger: true,
      onConfirm: () => {
        setMembers(members.filter(m => m.id !== id));
        triggerNotification('تم حذف العضو وسحب صلاحياته بنجاح.');
      }
    });
  };
  
  // Status feedback states
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Custom confirm dialog state to bypass blocked native confirm in iframe
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    danger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  // Home Page Edit states
  const [draftHome, setDraftHome] = useState<HomeContent>(() => JSON.parse(JSON.stringify(homeContent)));
  const [expandedHomeSection, setExpandedHomeSection] = useState<string>('hero');
  const [gallerySubTab, setGallerySubTab] = useState<'pending' | 'published' | 'archive' | 'categories' | 'settings' | 'livestream'>('pending');

  // Gallery categories management states
  const [newCategoryInput, setNewCategoryInput] = useState<string>('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState<string>('');

  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return;
    const currentCats = draftHome.galleryCategories || ["صور المناطق الطبيعية", "صور الأطفال", "صور المناسبات الاجتماعية", "صور متنوعة"];
    const name = newCategoryInput.trim();
    if (currentCats.includes(name)) {
      triggerNotification("هذا التصنيف موجود بالفعل في المعرض!");
      return;
    }
    const updated = [...currentCats, name];
    setDraftHome(prev => ({ ...prev, galleryCategories: updated }));
    setHomeContent({ ...homeContent, galleryCategories: updated });
    setNewCategoryInput('');
    triggerNotification(`تمت إضافة تصنيف المعرض "${name}" بنجاح!`);
  };

  const handleSaveCategoryEdit = (index: number, oldName: string) => {
    if (!editingCategoryValue.trim() || editingCategoryValue.trim() === oldName) {
      setEditingCategoryIndex(null);
      return;
    }
    const newName = editingCategoryValue.trim();
    const currentCats = [...(draftHome.galleryCategories || ["صور المناطق الطبيعية", "صور الأطفال", "صور المناسبات الاجتماعية", "صور متنوعة"])];
    currentCats[index] = newName;

    setDraftHome(prev => ({ ...prev, galleryCategories: currentCats }));
    setHomeContent({ ...homeContent, galleryCategories: currentCats });

    // Also update any photo that was tagged with oldName
    setGalleryItems(prev => prev.map(item => {
      if ((item.category || "صور متنوعة") === oldName) {
        return { ...item, category: newName };
      }
      return item;
    }));

    setEditingCategoryIndex(null);
    setEditingCategoryValue('');
    triggerNotification(`تم تعديل اسم التصنيف إلى "${newName}" وتحديث الصور التابعة له!`);
  };

  const handleDeleteCategory = (index: number, catName: string) => {
    const currentCats = [...(draftHome.galleryCategories || ["صور المناطق الطبيعية", "صور الأطفال", "صور المناسبات الاجتماعية", "صور متنوعة"])];
    if (currentCats.length <= 1) {
      triggerNotification("يجب الإبقاء على تصنيف واحد على الأقل لمعرض الصور.");
      return;
    }

    setConfirmConfig({
      title: 'حذف تصنيف المعرض',
      message: `هل أنت متأكد من حذف تصنيف "${catName}"؟ سيتم نقل الصور التابعة له إلى التصنيف الافتراضي.`,
      danger: true,
      onConfirm: () => {
        const updated = currentCats.filter((_, i) => i !== index);
        const fallbackCategory = updated[0] || "صور متنوعة";

        setDraftHome(prev => ({ ...prev, galleryCategories: updated }));
        setHomeContent({ ...homeContent, galleryCategories: updated });

        // Reassign affected photos
        setGalleryItems(prev => prev.map(item => {
          if ((item.category || "صور متنوعة") === catName) {
            return { ...item, category: fallbackCategory };
          }
          return item;
        }));

        triggerNotification(`تم حذف التصنيف "${catName}" وتحديث المعرض بنجاح.`);
      }
    });
  };

  // Community Ticker settings and moderation states
  const [commScrollSpeed, setCommScrollSpeed] = useState<number>(homeContent.communityScrollSpeed || 15);
  const [commScrollHeight, setCommScrollHeight] = useState<number>(homeContent.communityScrollHeight || 450);
  const [commBgColor, setCommBgColor] = useState<string>(homeContent.communityBgColor || '#ffffff');
  const [commTitleColor, setCommTitleColor] = useState<string>(homeContent.communityTitleColor || '#022c22');
  const [commItemBgColor, setCommItemBgColor] = useState<string>(homeContent.communityItemBgColor || '#fffbeb');
  const [commItemTextColor, setCommItemTextColor] = useState<string>(homeContent.communityItemTextColor || '#4b5563');
  const [commItemTitleColor, setCommItemTitleColor] = useState<string>(homeContent.communityItemTitleColor || '#111827');
  const [commBorderColor, setCommBorderColor] = useState<string>(homeContent.communityBorderColor || '#fde68a');
  const [commDateColor, setCommDateColor] = useState<string>(homeContent.communityDateColor || '#9ca3af');
  const [commHeartColor, setCommHeartColor] = useState<string>(homeContent.communityHeartColor || '#ef4444');
  const [commItemFontSize, setCommItemFontSize] = useState<'xs' | 'sm' | 'base'>(homeContent.communityItemFontSize || 'xs');
  const [commItemPadding, setCommItemPadding] = useState<'3' | '4' | '5' | '6'>(homeContent.communityItemPadding || '4');

  const [communityFilter, setCommunityFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [editAnnTitle, setEditAnnTitle] = useState('');
  const [editAnnContent, setEditAnnContent] = useState('');
  const [editAnnAuthor, setEditAnnAuthor] = useState('');
  const [editAnnCategory, setEditAnnCategory] = useState<'بلدي' | 'اجتماعي' | 'رياضي' | 'ثقافي'>('اجتماعي');

  // Sync state if homeContent is updated
  React.useEffect(() => {
    if (homeContent) {
      setCommScrollSpeed(homeContent.communityScrollSpeed || 15);
      setCommScrollHeight(homeContent.communityScrollHeight || 450);
      setCommBgColor(homeContent.communityBgColor || '#ffffff');
      setCommTitleColor(homeContent.communityTitleColor || '#022c22');
      setCommItemBgColor(homeContent.communityItemBgColor || '#fffbeb');
      setCommItemTextColor(homeContent.communityItemTextColor || '#4b5563');
      setCommItemTitleColor(homeContent.communityItemTitleColor || '#111827');
      setCommBorderColor(homeContent.communityBorderColor || '#fde68a');
      setCommDateColor(homeContent.communityDateColor || '#9ca3af');
      setCommHeartColor(homeContent.communityHeartColor || '#ef4444');
      setCommItemFontSize(homeContent.communityItemFontSize || 'xs');
      setCommItemPadding(homeContent.communityItemPadding || '4');
      setTempDirectoryName(homeContent.directoryPageName || 'الدليل التجاري والخدمي');
    }
  }, [homeContent]);

  const handleSaveCommunitySettings = (e: React.FormEvent) => {
    e.preventDefault();
    setHomeContent({
      ...homeContent,
      communityScrollSpeed: commScrollSpeed,
      communityScrollHeight: commScrollHeight,
      communityBgColor: commBgColor,
      communityTitleColor: commTitleColor,
      communityItemBgColor: commItemBgColor,
      communityItemTextColor: commItemTextColor,
      communityItemTitleColor: commItemTitleColor,
      communityBorderColor: commBorderColor,
      communityDateColor: commDateColor,
      communityHeartColor: commHeartColor,
      communityItemFontSize: commItemFontSize,
      communityItemPadding: commItemPadding
    });
    setSuccessMessage("تم حفظ خيارات تصميم ومظهر شريط منبر الأهالي بنجاح!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleApproveCommunity = (id: string) => {
    const updated = communityAnnouncements.map(ann => {
      if (ann.id === id) {
        return { ...ann, status: 'approved' as const };
      }
      return ann;
    });
    setCommunityAnnouncements(updated);
    setSuccessMessage("تمت الموافقة على نشر الخبر في منبر الأهالي بنجاح!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteCommunity = (id: string) => {
    setConfirmConfig({
      title: "تأكيد حذف المشاركة الأهلية",
      message: "هل أنت متأكد من رغبتك في حذف هذا الخبر نهائياً من منبر الأهالي؟ لا يمكن التراجع عن هذا الإجراء.",
      danger: true,
      onConfirm: () => {
        const updated = communityAnnouncements.filter(ann => ann.id !== id);
        setCommunityAnnouncements(updated);
        setConfirmConfig(null);
        setSuccessMessage("تم حذف المشاركة الأهلية بنجاح.");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    });
  };

  const handleDeleteComment = (newsId: string, commentId: string) => {
    setConfirmConfig({
      title: "تأكيد حذف التعليق",
      message: "هل أنت متأكد من رغبتك في حذف هذا التعليق نهائياً من هذا الخبر؟ لا يمكن التراجع عن هذا الإجراء.",
      danger: true,
      onConfirm: () => {
        const updated = newsList.map(news => {
          if (news.id === newsId) {
            return {
              ...news,
              comments: news.comments.filter(c => c.id !== commentId)
            };
          }
          return news;
        });
        setNewsList(updated);
        setConfirmConfig(null);
        setSuccessMessage("تم حذف التعليق بنجاح.");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    });
  };

  const handleStartEditCommunity = (ann: News) => {
    setEditingAnnId(ann.id);
    setEditAnnTitle(ann.title);
    setEditAnnContent(ann.content);
    setEditAnnAuthor(ann.authorName || '');
    setEditAnnCategory(ann.category);
  };

  const handleSaveEditCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = communityAnnouncements.map(ann => {
      if (ann.id === editingAnnId) {
        return {
          ...ann,
          title: editAnnTitle,
          content: editAnnContent,
          authorName: editAnnAuthor,
          category: editAnnCategory
        };
      }
      return ann;
    });
    setCommunityAnnouncements(updated);
    setEditingAnnId(null);
    setSuccessMessage("تم تعديل وتصحيح رسالة المشارك بنجاح!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  React.useEffect(() => {
    setDraftHome(JSON.parse(JSON.stringify(homeContent)));
  }, [homeContent]);

  const [isDragging, setIsDragging] = useState(false);
  const [newTickerItem, setNewTickerItem] = useState("");

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار ملف صورة صالح (PNG, JPG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress using canvas to prevent exceeding localStorage quota limit
        const maxWidth = 1200;
        const maxHeight = 675; // 16:9 ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          try {
            const compressed = canvas.toDataURL('image/jpeg', 0.8);
            setDraftHome(prev => ({ ...prev, heroImage: compressed }));
            triggerNotification('تم رفع ومعالجة صورة البنر بنجاح!');
          } catch (e) {
            console.error('Failed to encode image to base64', e);
            alert('فشل تشفير الصورة، يرجى محاولة رفع صورة أصغر حجماً.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFile = (file: File, fieldName: 'councilLogo' | 'identityLogo' | 'footerWatermarkLogo' | 'headerLogo') => {
    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار ملف صورة صالح (PNG, JPG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 300;
        const maxHeight = 300;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          try {
            const compressed = canvas.toDataURL('image/png');
            setDraftHome(prev => ({ ...prev, [fieldName]: compressed }));
            triggerNotification(
              fieldName === 'councilLogo' 
                ? 'تم رفع ومعالجة شعار المجلس المحلي بنجاح!' 
                : fieldName === 'footerWatermarkLogo'
                ? 'تم رفع ومعالجة الشعار المائي للبانر السفلي بنجاح!'
                : fieldName === 'headerLogo'
                ? 'تم رفع ومعالجة شعار الهيدر الرئيسي بنجاح!'
                : 'تم رفع ومعالجة شعار الهوية البصرية للموقع بنجاح!'
            );
          } catch (e) {
            console.error('Failed to encode logo to base64', e);
            alert('فشل تشفير الشعار، يرجى محاولة رفع صورة أصغر حجماً.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const updateDraftField = (key: keyof HomeContent, val: any) => {
    setDraftHome(prev => ({ ...prev, [key]: val }));
  };

  const updateDraftCrop = (index: number, field: 'name' | 'desc' | 'symbol', val: string) => {
    setDraftHome(prev => {
      const crops = [...prev.agricultureCrops];
      crops[index] = { ...crops[index], [field]: val };
      return { ...prev, agricultureCrops: crops };
    });
  };

  const addDraftCrop = () => {
    setDraftHome(prev => {
      const crops = [...(prev.agricultureCrops || [])];
      crops.push({ name: 'محصول جديد', desc: 'تفاصيل ومواصفات المحصول الزراعي وطبيعة إنتاجه في قارة.', symbol: '🌱' });
      return { ...prev, agricultureCrops: crops };
    });
    triggerNotification('تم إضافة خانة محصول زراعي جديد!');
  };

  const removeDraftCrop = (index: number) => {
    setDraftHome(prev => {
      if (prev.agricultureCrops.length <= 1) {
        triggerNotification('عذراً، يجب الإبقاء على محصول زراعي واحد على الأقل في القائمة.');
        return prev;
      }
      const crops = prev.agricultureCrops.filter((_, i) => i !== index);
      return { ...prev, agricultureCrops: crops };
    });
    triggerNotification('تم حذف المحصول بنجاح.');
  };

  const updateDraftStat = (index: number, field: 'label' | 'value', val: string) => {
    setDraftHome(prev => {
      const stats = [...prev.stats];
      stats[index] = { ...stats[index], [field]: val };
      return { ...prev, stats };
    });
  };

  const updateDraftHeritage = (index: number, field: 'title' | 'description' | 'image', val: string) => {
    setDraftHome(prev => {
      const points = [...prev.heritagePoints];
      points[index] = { ...points[index], [field]: val };
      return { ...prev, heritagePoints: points };
    });
  };

  const handleAddHeritagePoint = () => {
    setDraftHome(prev => {
      const points = [...(prev.heritagePoints || [])];
      points.push({ 
        title: 'معلم أثري جديد', 
        description: 'اكتب وصف المعلم وتفاصيله التاريخية وموقعه في قارة هنا ليتعرف عليه زوار البوابة.', 
        image: '' 
      });
      return { ...prev, heritagePoints: points };
    });
  };

  const handleRemoveHeritagePoint = (index: number) => {
    setDraftHome(prev => {
      const points = [...(prev.heritagePoints || [])];
      points.splice(index, 1);
      return { ...prev, heritagePoints: points };
    });
  };

  const updateDraftContact = (index: number, field: 'name' | 'number' | 'role' | 'iconName', val: string) => {
    setDraftHome(prev => {
      const contacts = [...prev.emergencyContacts];
      contacts[index] = { ...contacts[index], [field]: val };
      return { ...prev, emergencyContacts: contacts };
    });
  };

  const handleSaveHomeContent = (e: React.FormEvent) => {
    e.preventDefault();
    setHomeContent(draftHome);
    triggerNotification('تم حفظ وتحديث محتويات الصفحة الرئيسية بنجاح! تظهر التعديلات فوراً في الواجهة.');
  };

  // Modals / Edit States
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);

  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isAddingNews, setIsAddingNews] = useState(false);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Form states for SERVICE
  const [srvName, setSrvName] = useState('');
  const [srvDesc, setSrvDesc] = useState('');
  const [srvCategory, setSrvCategory] = useState<'بلدية' | 'صحية' | 'تعليمية' | 'اجتماعية'>('بلدية');
  const [srvTime, setSrvTime] = useState('');
  const [srvDocs, setSrvDocs] = useState('');
  const [srvSteps, setSrvSteps] = useState('');

  // Form states for NEWS
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState<'بلدي' | 'اجتماعي' | 'رياضي' | 'ثقافي'>('اجتماعي');
  const [newsImage, setNewsImage] = useState('');

  // Form states for PROJECT
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStatus, setProjStatus] = useState<'قيد التخطيط' | 'قيد التنفيذ' | 'مكتمل'>('قيد التنفيذ');
  const [projPercent, setProjPercent] = useState(50);
  const [projBudget, setProjBudget] = useState('');
  const [projVolunteers, setProjVolunteers] = useState(10);
  const [projCategory, setProjCategory] = useState<'بنى تحتية' | 'زراعي' | 'طاقة متجددة' | 'ثقافي وخدمي'>('بنى تحتية');
  const [projImage, setProjImage] = useState('');

  const triggerNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // --- SERVICE ACTIONS ---
  const handleOpenEditService = (srv: Service) => {
    setEditingService(srv);
    setSrvName(srv.name);
    setSrvDesc(srv.description);
    setSrvCategory(srv.category);
    setSrvTime(srv.processingTime);
    setSrvDocs(srv.requiredDocuments.join('\n'));
    setSrvSteps(srv.steps.join('\n'));
  };

  const handleOpenAddService = () => {
    setIsAddingService(true);
    setSrvName('');
    setSrvDesc('');
    setSrvCategory('بلدية');
    setSrvTime('خلال ساعة عمل');
    setSrvDocs('الهوية الشخصية\nدفتر العائلة');
    setSrvSteps('تقديم الطلب في ديوان البلدية\nدفع الرسوم الرمزية\nاستلام المخرجات');
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const docArr = srvDocs.split('\n').map(d => d.trim()).filter(d => d !== '');
    const stepArr = srvSteps.split('\n').map(s => s.trim()).filter(s => s !== '');

    if (editingService) {
      const updated = services.map(s => {
        if (s.id === editingService.id) {
          return {
            ...s,
            name: srvName,
            description: srvDesc,
            category: srvCategory,
            processingTime: srvTime,
            requiredDocuments: docArr,
            steps: stepArr
          };
        }
        return s;
      });
      setServices(updated);
      triggerNotification('تم تحديث الخدمة بنجاح!');
      setEditingService(null);
    } else if (isAddingService) {
      const newSrv: Service = {
        id: 'srv_' + Date.now(),
        name: srvName,
        iconName: 'FileText',
        description: srvDesc,
        category: srvCategory,
        processingTime: srvTime,
        requiredDocuments: docArr,
        steps: stepArr
      };
      setServices([newSrv, ...services]);
      triggerNotification('تمت إضافة الخدمة الجديدة بنجاح!');
      setIsAddingService(false);
    }
  };

  const handleDeleteService = (id: string) => {
    setConfirmConfig({
      title: 'حذف الخدمة الإلكترونية',
      message: 'هل أنت متأكد من حذف هذه الخدمة الإلكترونية نهائياً من البوابة؟ لا يمكن التراجع عن هذا الإجراء.',
      danger: true,
      onConfirm: () => {
        const updated = services.filter(s => s.id !== id);
        setServices(updated);
        triggerNotification('تم حذف الخدمة.');
      }
    });
  };

  // --- NEWS ACTIONS ---
  const handleOpenEditNews = (news: News) => {
    setEditingNews(news);
    setNewsTitle(news.title);
    setNewsContent(news.content);
    setNewsCategory(news.category);
    setNewsImage(news.image || '');
  };

  const handleOpenAddNews = () => {
    setIsAddingNews(true);
    setNewsTitle('');
    setNewsContent('');
    setNewsCategory('اجتماعي');
    setNewsImage('https://picsum.photos/seed/qara_news_new/800/400');
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNews) {
      const updated = newsList.map(item => {
        if (item.id === editingNews.id) {
          return {
            ...item,
            title: newsTitle,
            content: newsContent,
            category: newsCategory,
            image: newsImage || 'https://picsum.photos/seed/qara_news/800/400'
          };
        }
        return item;
      });
      setNewsList(updated);
      triggerNotification('تم تعديث الخبر بنجاح!');
      setEditingNews(null);
    } else if (isAddingNews) {
      const newNews: News = {
        id: 'news_' + Date.now(),
        title: newsTitle,
        content: newsContent,
        category: newsCategory,
        date: new Date().toLocaleDateString('ar-SY', { year: 'numeric', month: 'long', day: 'numeric' }),
        views: 45,
        likes: 3,
        image: newsImage || 'https://picsum.photos/seed/qara_news/800/400',
        comments: []
      };
      setNewsList([newNews, ...newsList]);
      triggerNotification('تم نشر الخبر الجديد بنجاح!');
      setIsAddingNews(false);
    }
  };

  const handleDeleteNews = (id: string) => {
    setConfirmConfig({
      title: 'حذف الخبر',
      message: 'هل أنت متأكد من حذف هذا الخبر نهائياً من البوابة؟ لا يمكن التراجع عن هذا الإجراء.',
      danger: true,
      onConfirm: () => {
        const updated = newsList.filter(n => n.id !== id);
        setNewsList(updated);
        triggerNotification('تم حذف الخبر.');
      }
    });
  };

  // --- PROJECT ACTIONS ---
  const handleOpenEditProject = (proj: Project) => {
    setEditingProject(proj);
    setProjTitle(proj.title);
    setProjDesc(proj.description);
    setProjStatus(proj.status);
    setProjPercent(proj.percentage);
    setProjBudget(proj.budget);
    setProjVolunteers(proj.volunteersCount);
    setProjCategory(proj.category);
    setProjImage(proj.image || '');
  };

  const handleOpenAddProject = () => {
    setIsAddingProject(true);
    setProjTitle('');
    setProjDesc('');
    setProjStatus('قيد التخطيط');
    setProjPercent(0);
    setProjBudget('10,000 $ (تبرعات)');
    setProjVolunteers(5);
    setProjCategory('بنى تحتية');
    setProjImage('https://picsum.photos/seed/qara_project/600/400');
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      const updated = projects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            title: projTitle,
            description: projDesc,
            status: projStatus,
            percentage: Number(projPercent),
            budget: projBudget,
            volunteersCount: Number(projVolunteers),
            category: projCategory,
            image: projImage || 'https://picsum.photos/seed/qara_project/600/400'
          };
        }
        return p;
      });
      setProjects(updated);
      triggerNotification('تم تحديث بيانات المشروع التنموي!');
      setEditingProject(null);
    } else if (isAddingProject) {
      const newProj: Project = {
        id: 'proj_' + Date.now(),
        title: projTitle,
        description: projDesc,
        status: projStatus,
        percentage: Number(projPercent),
        budget: projBudget,
        volunteersCount: Number(projVolunteers),
        category: projCategory,
        dateStarted: new Date().toLocaleDateString('ar-SY', { year: 'numeric', month: 'long', day: 'numeric' }),
        dateTarget: 'قريباً',
        image: projImage || 'https://picsum.photos/seed/qara_project/600/400'
      };
      setProjects([newProj, ...projects]);
      triggerNotification('تم تأسيس المشروع التنموي الجديد!');
      setIsAddingProject(false);
    }
  };

  const handleDeleteProject = (id: string) => {
    setConfirmConfig({
      title: 'حذف المشروع التنموي',
      message: 'هل أنت متأكد من إلغاء وحذف هذا المشروع من الخطة العامة لمدينة قارة؟',
      danger: true,
      onConfirm: () => {
        const updated = projects.filter(p => p.id !== id);
        setProjects(updated);
        triggerNotification('تم إيقاف وحذف المشروع.');
      }
    });
  };

  // --- SUGGESTIONS & REQUESTS ACTIONS ---
  const handleDeleteRequest = (id: string) => {
    setConfirmConfig({
      title: 'أرشفة طلب المعاملة',
      message: 'هل تريد إلغاء وأرشفة طلب المعاملة هذا؟ سيتم إزالته من القائمة النشطة.',
      danger: true,
      onConfirm: () => {
        const updated = requests.filter(r => r.id !== id);
        setRequests(updated);
        triggerNotification('تمت أرشفة الطلب.');
      }
    });
  };

  const handleDeleteSuggestion = (id: string) => {
    setConfirmConfig({
      title: 'حذف مقترح المبادرة',
      message: 'هل تريد إزالة فكرة المبادرة هذه من اللوحة العامة؟',
      danger: true,
      onConfirm: () => {
        const updated = suggestions.filter(s => s.id !== id);
        setSuggestions(updated);
        triggerNotification('تمت إزالة الفكرة.');
      }
    });
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-right font-sans" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-amber-900/10 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-emerald-950 text-white p-8 text-center relative overflow-hidden">
            <div className="absolute left-0 bottom-0 w-32 h-32 bg-amber-500/10 rounded-full blur-xl -ml-10 -mb-10"></div>
            <div className="relative space-y-2">
              <div className="inline-flex p-3 bg-amber-500/15 rounded-2xl text-amber-400 mb-2">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-extrabold text-white">بوابة دخول الأعضاء والمدير</h2>
              <p className="text-xs text-emerald-200/90 font-sans">مدينة قارة - لوحة التحكم الإلكترونية والصلاحيات</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Role Tab Selector */}
            <div className="flex bg-gray-100 rounded-2xl p-1 gap-1 border border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setLoginRole('admin');
                  setLoginError(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  loginRole === 'admin'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-850'
                }`}
              >
                المدير العام
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole('member');
                  setLoginError(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  loginRole === 'member'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-850'
                }`}
              >
                الأعضاء المسجلين
              </button>
            </div>

            {/* Error Banner */}
            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-bold flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                  <span>{loginError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {loginRole === 'member' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">اسم مستخدم العضو *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="مثال: ahmed أو leila"
                      className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                    />
                    <div className="absolute right-3 top-3 text-gray-400">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  {loginRole === 'admin' ? 'كلمة مرور المدير العام *' : 'كلمة المرور الشخصية *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={loginRole === 'admin' ? 'كلمة المرور: admin123' : 'أدخل كلمة المرور الخاص بك'}
                    className="w-full p-3 pr-10 pl-10 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer mt-4"
              >
                تسجيل دخول آمن للبوابة
              </button>
            </form>

            {/* Helper Info & Quick Fill Credentials */}
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-[11px] leading-relaxed text-emerald-900">
                <p className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  حسابات الدخول المعتمدة للتجربة والمدراء:
                </p>
                {loginRole === 'admin' ? (
                  <div className="space-y-1.5 mt-2">
                    <p className="flex justify-between items-center bg-white p-2 rounded-xl border border-emerald-200/60">
                      <span>المدير العام (صلاحيات كاملة):</span>
                      <span className="font-mono font-bold bg-amber-100 px-2 py-0.5 rounded text-amber-900">admin123</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginPassword('admin123');
                        setLoginError(null);
                      }}
                      className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                    >
                      تعبئة تلقائية لكلمة مرور المدير (admin123)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 mt-2">
                    <div className="bg-white p-2 rounded-xl border border-emerald-200/60 text-right space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-gray-800">1. أحمد المحمد (منسق ميداني + الدليل والخدمات):</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono dir-ltr">
                        <span>المستخدم: <strong className="text-emerald-800">ahmed</strong></span>
                        <span>المرور: <strong className="text-amber-800">123</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginUsername('ahmed');
                          setLoginPassword('123');
                          setLoginError(null);
                        }}
                        className="w-full py-1 bg-violet-600 hover:bg-violet-700 text-white font-bold text-[10px] rounded-md transition-colors cursor-pointer mt-1"
                      >
                        تعبئة بيانات العضو (أحمد)
                      </button>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-emerald-200/60 text-right space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-gray-800">2. م. ليلى اليوسف (مشرفة المعرض والمعالم):</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono dir-ltr">
                        <span>المستخدم: <strong className="text-emerald-800">leila</strong></span>
                        <span>المرور: <strong className="text-amber-800">456</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginUsername('leila');
                          setLoginPassword('456');
                          setLoginError(null);
                        }}
                        className="w-full py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] rounded-md transition-colors cursor-pointer mt-1"
                      >
                        تعبئة بيانات العضوة (ليلى)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-[11px] text-gray-400 font-sans leading-relaxed">
            البوابة محمية تشفيراً لتفادي الوصول غير المصرّح به. 
            <br />
            تواصل مع المدير العام في حال فقدت كلمة المرور الشخصية.
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right font-sans" dir="rtl">
      
      {/* Admin Header */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-amber-500/20 shadow-xl relative overflow-hidden mb-8">
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl -ml-20 -mb-20"></div>
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 flex-row-reverse text-right">
          <div className="space-y-3">
            {currentUser.role === 'admin' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-emerald-950 font-bold text-xs uppercase font-mono">
                <Lock className="h-3.5 w-3.5 inline" /> المدير العام (صلاحيات مطلقة كاملة)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-600 text-white font-bold text-xs uppercase font-mono">
                <Users className="h-3.5 w-3.5 inline" /> العضو المسجل: {currentUser.member?.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-extrabold flex items-center justify-end gap-2.5">
              <span>بوابة الإدارة والتحكم لبلدة قارة</span>
              <Settings className="h-8 w-8 text-amber-400 animate-spin-slow" />
            </h1>
            <p className="text-emerald-200/90 text-sm max-w-2xl leading-relaxed">
              {currentUser.role === 'admin' 
                ? 'مرحباً بك يا مدير البوابة العام! من هنا تمتلك السيطرة الكاملة على محتوى قارة، الخدمات، منبر المبادرات، والتحكم المطلق بصلاحيات دخول وتعديل الأعضاء المسجلين.'
                : `مرحباً بك يا ${currentUser.member?.name}! لقد تم تسجيل دخولك بنجاح بصلاحياتك المحددة والمفوضة لك من قبل المدير العام للتحكم بالأقسام المحددة.`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  setConfirmConfig({
                    title: 'إعادة ضبط البيانات',
                    message: 'هل أنت متأكد من رغبتك في تصفير التعديلات وإعادة البيانات التاريخية الافتراضية لقارة؟ سيتم محو كافة المدخلات الجديدة والأعضاء.',
                    danger: true,
                    onConfirm: () => {
                      onResetDefaults();
                      localStorage.removeItem('qara_members');
                      localStorage.removeItem('qara_admin_password');
                      localStorage.removeItem('qara_logged_in_user');
                      setCurrentUser(null);
                      triggerNotification('تمت إعادة ضبط البيانات الافتراضية وتصفير الجلسات!');
                    }
                  });
                }}
                className="px-5 py-3 bg-red-850 hover:bg-red-950 border border-red-700 text-white font-bold text-xs rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shrink-0 bg-red-800"
              >
                <RefreshCw className="h-4 w-4 animate-spin-slow" />
                إعادة ضبط البيانات وتصفير البوابة
              </button>
            )}

            <button
              onClick={handleLogout}
              className="px-5 py-3 bg-white hover:bg-red-50 border border-gray-200 text-gray-700 hover:text-red-800 font-bold text-xs rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <X className="h-4 w-4 text-red-600" />
              تسجيل الخروج الآمن
            </button>
          </div>
        </div>
      </div>

      {/* Instant Notification Banner */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-sm rounded-2xl flex items-center justify-center gap-2"
          >
            <Check className="h-5 w-5 bg-emerald-800 text-white rounded-full p-0.5" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Font Customization Settings Panel */}
      <div className="bg-amber-50/50 border border-amber-900/10 rounded-3xl p-5 mb-8 text-right relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.015]"></div>
        <div className="relative space-y-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 flex-wrap lg:flex-nowrap border-b border-amber-900/10 pb-4">
            <div className="flex items-center gap-3 flex-row-reverse w-full lg:w-auto">
              <div className="p-2.5 bg-emerald-800 text-amber-300 rounded-2xl">
                <Type className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-emerald-950">تخصيص الخطوط والمظهر العام للبوابة</h3>
                <p className="text-xs text-gray-500 font-sans">اختر نوع الخط العربي المفضل وحجمه لتطبيقه فوراً على كافة صفحات وبنرات الموقع</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-end">
              {/* Font Family Selector */}
              <div className="flex items-center gap-2 flex-row-reverse">
                <label className="text-xs font-bold text-emerald-950 font-sans">نوع الخط العربي:</label>
                <select
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    triggerNotification(`تم تطبيق خط "${e.target.value}" بنجاح!`);
                  }}
                  className="bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none cursor-pointer font-sans"
                >
                  <option value="Cairo">خط القاهرة الحديث (Cairo)</option>
                  <option value="Tajawal">خط تاجوال المعاصر (Tajawal)</option>
                  <option value="Almarai">خط المراعي الناعم (Almarai)</option>
                  <option value="Amiri">خط الأميري التراثي الكلاسيكي (Amiri)</option>
                  <option value="Harmattan">خط هارماتان المريح للعين (Harmattan)</option>
                  <option value="Lalezar">خط لاليزار العريض المميز (Lalezar)</option>
                </select>
              </div>

              {/* Font Size Selector */}
              <div className="flex items-center gap-2 flex-row-reverse">
                <label className="text-xs font-bold text-emerald-950 font-sans">حجم الخط الرئيسي:</label>
                <select
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value);
                    triggerNotification(`تم تغيير حجم الخط الرئيسي إلى ${e.target.value}px`);
                  }}
                  className="bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none cursor-pointer font-sans"
                >
                  <option value="14">14px (صغير جداً)</option>
                  <option value="15">15px (صغير)</option>
                  <option value="16">16px (الافتراضي)</option>
                  <option value="17">17px (متوسط مريح)</option>
                  <option value="18">18px (كبير)</option>
                  <option value="19">19px (كبير جداً)</option>
                  <option value="20">20px (ضخم)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Formatting, Orientation, and Alignment Tools */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1 flex-row-reverse">
            <div className="text-right">
              <h4 className="font-extrabold text-xs sm:text-sm text-emerald-900 flex items-center gap-1.5 justify-end">
                <span>أدوات تنسيق ومحاذاة اتجاه الكتابة</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
              </h4>
              <p className="text-[11px] text-gray-500 font-sans">تحديد التنسيق الافتراضي لليمين واليسار واتجاه الفقرات في كافة الصفحات</p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {/* Text Direction Controls */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-emerald-950 font-sans text-right">اتجاه قراءة وتدفق الصفحة (RTL / LTR):</span>
                <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1 border border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setLayoutDirection('rtl');
                      triggerNotification('تم اعتماد الاتجاه الافتراضي من اليمين إلى اليسار (RTL)');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      layoutDirection === 'rtl'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <ArrowRightLeft className="h-3 w-3 inline text-amber-400 rotate-180" />
                    <span>يمين إلى يسار (RTL)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLayoutDirection('ltr');
                      triggerNotification('تم تغيير اتجاه الصفحة إلى اليسار لليمين (LTR)');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      layoutDirection === 'ltr'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <ArrowRightLeft className="h-3 w-3 inline text-amber-400" />
                    <span>يسار إلى يمين (LTR)</span>
                  </button>
                </div>
              </div>

              {/* Text Alignment Formatting Toolbar */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-emerald-950 font-sans text-right">أزرار علامات محاذاة وتنسيق النصوص:</span>
                <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5 border border-gray-200" dir="ltr">
                  <button
                    type="button"
                    title="تنسيق لليسار (Align Left)"
                    onClick={() => {
                      setTextAlignment('left');
                      triggerNotification('تم تنسيق كافة النصوص لليسار.');
                    }}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      textAlignment === 'left'
                        ? 'bg-white text-emerald-950 shadow border border-gray-300/40'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    title="تنسيق للوسط (Align Center)"
                    onClick={() => {
                      setTextAlignment('center');
                      triggerNotification('تم تنسيق وتوسيط كافة نصوص الموقع للوسط.');
                    }}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      textAlignment === 'center'
                        ? 'bg-white text-emerald-950 shadow border border-gray-300/40'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    title="تنسيق لليمين (Align Right)"
                    onClick={() => {
                      setTextAlignment('right');
                      triggerNotification('تم تنسيق كافة النصوص لليمين (التنسيق الافتراضي).');
                    }}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      textAlignment === 'right'
                        ? 'bg-white text-emerald-950 shadow border border-gray-300/40'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <AlignRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    title="ضبط الهوامش (Justify)"
                    onClick={() => {
                      setTextAlignment('justify');
                      triggerNotification('تم ضبط استواء نصوص الفقرات (Justify).');
                    }}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      textAlignment === 'justify'
                        ? 'bg-white text-emerald-950 shadow border border-gray-300/40'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <AlignJustify className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Subtabs Selector Bar */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-8">
        {allowedTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as AdminSubTab)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                isActive
                  ? 'bg-emerald-800 text-white border-emerald-700 shadow'
                  : 'bg-white hover:bg-emerald-50 text-gray-700 border-gray-100'
              }`}
            >
              <span className={`px-2 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${isActive ? 'bg-amber-400 text-emerald-950' : 'bg-gray-100 text-gray-500'}`}>
                {tab.count}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab Contents */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/5 shadow-sm">
        
        {/* TAB 0: HOME PAGE CMS */}
        {activeSubTab === 'home' && (
          <form onSubmit={handleSaveHomeContent} className="space-y-8 text-right">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
              <div className="text-right">
                <h3 className="font-extrabold text-lg text-emerald-950">إدارة ومحتوى الصفحة الرئيسية</h3>
                <p className="text-xs text-gray-400">تعديل أي نص، إحصائية، ميزة، أو جهة اتصال في الصفحة الرئيسية</p>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Check className="h-4 w-4" />
                حفظ كافة التعديلات الرئيسية
              </button>
            </div>

            {/* Accordion / Sections */}
            <div className="space-y-4">
              
              {/* Section 0: Header & Top Navigation Bar Settings */}
              <div className="border border-amber-900/10 rounded-2xl overflow-hidden bg-amber-50/10">
                <button
                  type="button"
                  onClick={() => setExpandedHomeSection(expandedHomeSection === 'header' ? '' : 'header')}
                  className="w-full p-4 bg-emerald-900 text-amber-100 hover:bg-emerald-950 transition-all text-right font-bold flex items-center justify-between flex-row-reverse shadow-sm"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="p-1.5 bg-amber-500 text-emerald-950 rounded-lg text-xs font-mono font-black">★</span>
                    <span>إعدادات وتصاميم الشريط العلوي (الهيدر الرئيسي واللوجو)</span>
                  </div>
                  <span className="text-amber-300">{expandedHomeSection === 'header' ? '▲' : '▼'}</span>
                </button>
                {expandedHomeSection === 'header' && (
                  <div className="p-6 bg-white space-y-6 border-t border-gray-100">
                    
                    {/* Portal Name & Subtitle */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-emerald-950 border-b pb-2 flex items-center justify-end gap-1.5">
                        <span>اسم البوابة والعنوان الفرعي وشعار اللوجو:</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700 block">اسم البوابة الرئيسي (على سطر واحد) *</label>
                          <input
                            type="text"
                            required
                            value={draftHome.headerPortalTitle || 'بوابة قارة الإلكترونية'}
                            onChange={(e) => updateDraftField('headerPortalTitle', e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-bold text-emerald-950"
                            placeholder="بوابة قارة الإلكترونية"
                          />
                          <p className="text-[10px] text-gray-400">مضمون البقاء على سطر واحد دائماً دون الانكسار إلى سطرين.</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700 block">العنوان الفرعي والموقع الجغرافي *</label>
                          <input
                            type="text"
                            required
                            value={draftHome.headerPortalSubtitle || 'جبال القلمون، سوريا'}
                            onChange={(e) => updateDraftField('headerPortalSubtitle', e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-mono"
                            placeholder="جبال القلمون، سوريا"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700 block">أيقونة اللوجو الشرفية *</label>
                          <select
                            value={draftHome.headerLogoIcon || 'Building2'}
                            onChange={(e) => updateDraftField('headerLogoIcon', e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right cursor-pointer font-medium"
                          >
                            <option value="Building2">🏢 مبنى وصرح حكومي (Building2)</option>
                            <option value="Landmark">🏛️ معلم تاريخي وأثري (Landmark)</option>
                            <option value="Shield">🛡️ درع رسمي وحماية (Shield)</option>
                            <option value="Crown">👑 تاج ملكي وشرفي (Crown)</option>
                            <option value="Castle">🏰 قلعة وحصن عريق (Castle)</option>
                            <option value="TreePine">🌲 أشجار بساتين القلمون (TreePine)</option>
                            <option value="Cherry">🍒 ثمار الكرز الشرفية - مدينة قارة (Cherry)</option>
                            <option value="Snowflake">❄️ لوجو الثلج والشتاء - موسم الشتاء (Snowflake)</option>
                          </select>
                        </div>
                      </div>

                      {/* Header Logo Image Upload & Size Settings */}
                      <div className="space-y-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/60 mt-4 text-right">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-emerald-200/50 pb-2">
                          <div>
                            <span className="text-xs font-extrabold text-emerald-950 block">🖼️ إضافة وتعديل لوجو الهيدر الرئيسي (صورة اللوجو وحجمها)</span>
                            <p className="text-[11px] text-gray-500">
                              يمكنك رفع صورة لوجو خاصة تعبر عن الهيدر، والتحكم بحجمها وارتفاعها بالبكسل لتتناسب بدقة مع الهيدر الرئيسي للموقع.
                            </p>
                          </div>
                          {draftHome.headerLogo && (
                            <button
                              type="button"
                              onClick={() => updateDraftField('headerLogo', '')}
                              className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 transition-all cursor-pointer shrink-0"
                            >
                              🗑️ حذف اللوجو والعودة للأيقونة
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Upload File */}
                          <div className="space-y-1.5 bg-white p-3 rounded-xl border border-gray-200">
                            <label className="text-xs font-bold text-gray-700 block">١. رفع صورة اللوجو من جهازك:</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleLogoFile(e.target.files[0], 'headerLogo');
                                }
                              }}
                              className="w-full text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-emerald-50 file:text-emerald-700 cursor-pointer"
                            />
                          </div>

                          {/* Direct URL */}
                          <div className="space-y-1.5 bg-white p-3 rounded-xl border border-gray-200">
                            <label className="text-xs font-bold text-gray-700 block">٢. أو أدخل رابط صورة اللوجو مباشرة:</label>
                            <input
                              type="text"
                              placeholder="https://..."
                              value={draftHome.headerLogo || ''}
                              onChange={(e) => updateDraftField('headerLogo', e.target.value)}
                              className="w-full p-2 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-lg outline-none text-xs font-mono text-left"
                            />
                          </div>

                          {/* Choose from Site Gallery */}
                          <div className="space-y-1.5 bg-white p-3 rounded-xl border border-gray-200">
                            <label className="text-xs font-bold text-gray-700 block">٣. أو اختر من معرض صور الموقع:</label>
                            <select
                              value={draftHome.headerLogo || ''}
                              onChange={(e) => {
                                if (e.target.value) updateDraftField('headerLogo', e.target.value);
                              }}
                              className="w-full p-2 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-lg outline-none text-xs text-right cursor-pointer"
                            >
                              <option value="">-- اضغط للاختيار من معرض الصور --</option>
                              {galleryItems.filter(p => p.status === 'approved').map(item => (
                                <option key={item.id} value={item.imageUrl}>
                                  {item.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Height / Size Controller Slider & Position Selector */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          {/* Height Slider */}
                          <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                              <span>📏 ارتفاع وحجم الشعار:</span>
                              <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 font-mono text-xs">
                                {draftHome.headerLogoHeight || 44} px
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-gray-400 font-bold">صغير (20px)</span>
                              <input
                                type="range"
                                min="20"
                                max="90"
                                step="2"
                                value={draftHome.headerLogoHeight || 44}
                                onChange={(e) => updateDraftField('headerLogoHeight', parseInt(e.target.value, 10))}
                                className="w-full accent-emerald-700 cursor-pointer"
                              />
                              <span className="text-[10px] text-gray-400 font-bold">كبير (90px)</span>
                            </div>
                          </div>

                          {/* Position Picker */}
                          <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                              <span>📍 موضع ومكان اللوجو في الهيدر الرئيسي:</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-0.5">
                              <button
                                type="button"
                                onClick={() => updateDraftField('headerLogoPosition', 'right')}
                                className={`p-2 border rounded-xl text-center text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                  (draftHome.headerLogoPosition || 'right') === 'right'
                                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-extrabold shadow-2xs'
                                    : 'border-gray-200 hover:bg-gray-50 text-gray-600 font-medium'
                                }`}
                              >
                                <span>👉 أقصى اليمين (الافتراضي)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateDraftField('headerLogoPosition', 'left')}
                                className={`p-2 border rounded-xl text-center text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                  draftHome.headerLogoPosition === 'left'
                                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-extrabold shadow-2xs'
                                    : 'border-gray-200 hover:bg-gray-50 text-gray-600 font-medium'
                                }`}
                              >
                                <span>👈 أقصى اليسار</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Live Preview box inside settings */}
                        {draftHome.headerLogo && (
                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                            <span className="text-[11px] text-gray-500 font-bold">معاينة مباشرة لحجم ومظهر اللوجو المختار:</span>
                            <div className="p-2 bg-emerald-900 rounded-xl flex items-center justify-center border border-emerald-800 shadow-inner">
                              <img
                                src={draftHome.headerLogo}
                                alt="معاينة اللوجو"
                                style={{
                                  height: `${draftHome.headerLogoHeight || 44}px`,
                                  maxHeight: '90px',
                                  width: 'auto',
                                  objectFit: 'contain'
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Presets Grid */}
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-emerald-950 border-b pb-2 flex items-center justify-end gap-1.5">
                        <span>نماذج وتصاميم الهيدر الجاهزة (presets):</span>
                      </h4>
                      <p className="text-[11px] text-gray-500">اختر من النماذج المصممة خصيصاً لتغيير مظهر الهيدر والتبويبات بضغطة واحدة:</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            updateDraftField('headerPresetStyle', 'emerald_gold');
                            updateDraftField('headerBgColor', '#fdfbf7');
                            updateDraftField('headerTitleColor', '#022c22');
                            updateDraftField('headerSubtitleColor', '#92400e');
                            updateDraftField('tabColorActive', '#064e3b');
                            updateDraftField('tabBgActive', '#f0fdf4');
                            updateDraftField('tabColorInactive', '#4b5563');
                            triggerNotification('تم تطبيق النموذج الزمردي والذهبي الكلاسيكي!');
                          }}
                          className={`p-3.5 border rounded-2xl text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                            (draftHome.headerPresetStyle || 'emerald_gold') === 'emerald_gold'
                              ? 'border-emerald-800 bg-emerald-50/70 ring-2 ring-emerald-600/30 font-bold'
                              : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/80'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-950">الزمردي والذهبي الكلاسيكي</span>
                            <span className="w-3 h-3 rounded-full bg-emerald-900 border border-amber-400"></span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-normal">خلفية عاجية دافئة مع عنوان زيتي عميق وتحديدات ذهبية عريقة.</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            updateDraftField('headerPresetStyle', 'glassmorphic');
                            updateDraftField('headerBgColor', 'rgba(255, 255, 255, 0.85)');
                            updateDraftField('headerTitleColor', '#064e3b');
                            updateDraftField('headerSubtitleColor', '#d97706');
                            updateDraftField('tabColorActive', '#064e3b');
                            updateDraftField('tabBgActive', '#ecfdf5');
                            updateDraftField('tabColorInactive', '#374151');
                            triggerNotification('تم تطبيق النموذج الزجاجي البلوري المعاصر!');
                          }}
                          className={`p-3.5 border rounded-2xl text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                            draftHome.headerPresetStyle === 'glassmorphic'
                              ? 'border-emerald-800 bg-emerald-50/70 ring-2 ring-emerald-600/30 font-bold'
                              : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/80'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-950">الزجاجي البلوري المعاصر</span>
                            <span className="w-3 h-3 rounded-full bg-white border border-gray-300"></span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-normal">شفافية عالية عائمة مع خلفية ضبابية تعكس ألوان الصفحة أثناء التمرير.</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            updateDraftField('headerPresetStyle', 'royal_luxe');
                            updateDraftField('headerBgColor', '#064e3b');
                            updateDraftField('headerTitleColor', '#fef3c7');
                            updateDraftField('headerSubtitleColor', '#fcd34d');
                            updateDraftField('tabColorActive', '#fbbf24');
                            updateDraftField('tabBgActive', '#022c22');
                            updateDraftField('tabColorInactive', '#d1fae5');
                            triggerNotification('تم تطبيق النموذج الملكي الأخضر الداكن!');
                          }}
                          className={`p-3.5 border rounded-2xl text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                            draftHome.headerPresetStyle === 'royal_luxe'
                              ? 'border-emerald-800 bg-emerald-900 text-amber-200 ring-2 ring-amber-400 font-bold'
                              : 'border-gray-200 bg-emerald-950 text-white hover:bg-emerald-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">الملكي الأخضر الفاخر</span>
                            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                          </div>
                          <p className="text-[10px] opacity-80 font-normal">خلفية زمردية داكنة فاخرة مع كتابات ذهبية متألقة تعكس الفخامة.</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            updateDraftField('headerPresetStyle', 'midnight_obsidian');
                            updateDraftField('headerBgColor', '#0f172a');
                            updateDraftField('headerTitleColor', '#f8fafc');
                            updateDraftField('headerSubtitleColor', '#fbbf24');
                            updateDraftField('tabColorActive', '#38bdf8');
                            updateDraftField('tabBgActive', '#1e293b');
                            updateDraftField('tabColorInactive', '#94a3b8');
                            triggerNotification('تم تطبيق نموذج الليلك الداكن الأنيق!');
                          }}
                          className={`p-3.5 border rounded-2xl text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                            draftHome.headerPresetStyle === 'midnight_obsidian'
                              ? 'border-sky-500 bg-slate-900 text-white ring-2 ring-sky-400 font-bold'
                              : 'border-gray-200 bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">الداكن الأنيق (Midnight)</span>
                            <span className="w-3 h-3 rounded-full bg-sky-400"></span>
                          </div>
                          <p className="text-[10px] text-slate-300 font-normal">خلفية كحلية بلمسات سماوية زرقاء لتصميم حديث وأنيق.</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            updateDraftField('headerPresetStyle', 'clean_white');
                            updateDraftField('headerBgColor', '#ffffff');
                            updateDraftField('headerTitleColor', '#111827');
                            updateDraftField('headerSubtitleColor', '#059669');
                            updateDraftField('tabColorActive', '#047857');
                            updateDraftField('tabBgActive', '#ecfdf5');
                            updateDraftField('tabColorInactive', '#4b5563');
                            triggerNotification('تم تطبيق نموذج الأبيض الناصع المعاصر!');
                          }}
                          className={`p-3.5 border rounded-2xl text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                            draftHome.headerPresetStyle === 'clean_white'
                              ? 'border-emerald-800 bg-white ring-2 ring-emerald-600/30 font-bold'
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">الأبيض المعاصر (Clean)</span>
                            <span className="w-3 h-3 rounded-full bg-gray-100 border border-gray-400"></span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-normal">خلفية بيضاء نقية مع وضوح عالي للخطوط والملاحة السريعة.</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            updateDraftField('headerPresetStyle', 'warm_sunset');
                            updateDraftField('headerBgColor', '#fffbeb');
                            updateDraftField('headerTitleColor', '#14532d');
                            updateDraftField('headerSubtitleColor', '#b45309');
                            updateDraftField('tabColorActive', '#064e3b');
                            updateDraftField('tabBgActive', '#fef3c7');
                            updateDraftField('tabColorInactive', '#78350f');
                            triggerNotification('تم تطبيق نموذج الذهبي الدافئ!');
                          }}
                          className={`p-3.5 border rounded-2xl text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                            draftHome.headerPresetStyle === 'warm_sunset'
                              ? 'border-amber-700 bg-amber-50 ring-2 ring-amber-500/30 font-bold'
                              : 'border-gray-200 bg-amber-50/50 hover:bg-amber-100/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-950">الذهبي الدافئ (Warm Sunset)</span>
                            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                          </div>
                          <p className="text-[10px] text-amber-800 font-normal">ألوان دافئة مستوحاة من بيوت قارة الحجرية وشروق جبال القلمون.</p>
                        </button>
                      </div>
                    </div>

                    {/* Height & FX Customization */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100 text-right">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">ارتفاع وسُمك الشريط العلوي (Header Height) *</label>
                        <select
                          value={draftHome.headerHeightMode || 'normal'}
                          onChange={(e) => updateDraftField('headerHeightMode', e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right cursor-pointer"
                        >
                          <option value="compact">⚡ ارتفاع مدمج ورشيق (64px - h-16)</option>
                          <option value="normal">⚖️ ارتفاع متوازن قياسي (80px - h-20)</option>
                          <option value="spacious">👑 ارتفاع رحب وفاخر (96px - h-24)</option>
                        </select>
                        <p className="text-[10px] text-gray-400">تستطيع اختيار ارتفاع أقل لمنح مساحة رؤية أوسع لمحتوى الصفحة.</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">اللمسات الجمالية وتأثيرات التمييز (Distinction FX) *</label>
                        <select
                          value={draftHome.headerDistinctionFx || 'gold_glow'}
                          onChange={(e) => updateDraftField('headerDistinctionFx', e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right cursor-pointer"
                        >
                          <option value="gold_glow">✨ إضاءة وظل ذهبي ناعم مع حدود سفلية (Gold Glow)</option>
                          <option value="glass_blur">🔮 تأثير الزجاج والبلور الشفاف (Glassmorphic Blur)</option>
                          <option value="accent_top">🌈 شريط علوي ملون متدرج بالألوان الزمردية والذهبية</option>
                          <option value="shadow_elevated">🏔️ ظل مرتفع بارز ومميز عن الصفحة (Elevated Shadow)</option>
                        </select>
                      </div>
                    </div>

                    {/* Detailed Color Pickers */}
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-emerald-950 border-b pb-2 flex items-center justify-end gap-1.5">
                        <span>تخصيص ألوان العنوان والتبويبات والخلفية تفصيلياً:</span>
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-right">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">لون عنوان البوابة</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={draftHome.headerTitleColor || '#022c22'}
                              onChange={(e) => updateDraftField('headerTitleColor', e.target.value)}
                              className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 p-0"
                            />
                            <input
                              type="text"
                              value={draftHome.headerTitleColor || '#022c22'}
                              onChange={(e) => updateDraftField('headerTitleColor', e.target.value)}
                              className="w-full p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">لون العنوان الفرعي</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={draftHome.headerSubtitleColor || '#92400e'}
                              onChange={(e) => updateDraftField('headerSubtitleColor', e.target.value)}
                              className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 p-0"
                            />
                            <input
                              type="text"
                              value={draftHome.headerSubtitleColor || '#92400e'}
                              onChange={(e) => updateDraftField('headerSubtitleColor', e.target.value)}
                              className="w-full p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">لون نص التبويب النشط</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={draftHome.tabColorActive || '#064e3b'}
                              onChange={(e) => updateDraftField('tabColorActive', e.target.value)}
                              className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 p-0"
                            />
                            <input
                              type="text"
                              value={draftHome.tabColorActive || '#064e3b'}
                              onChange={(e) => updateDraftField('tabColorActive', e.target.value)}
                              className="w-full p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">لون خلفية التبويب النشط</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={draftHome.tabBgActive || '#f0fdf4'}
                              onChange={(e) => updateDraftField('tabBgActive', e.target.value)}
                              className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 p-0"
                            />
                            <input
                              type="text"
                              value={draftHome.tabBgActive || '#f0fdf4'}
                              onChange={(e) => updateDraftField('tabBgActive', e.target.value)}
                              className="w-full p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">لون التبويبات غير النشطة</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={draftHome.tabColorInactive || '#4b5563'}
                              onChange={(e) => updateDraftField('tabColorInactive', e.target.value)}
                              className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 p-0"
                            />
                            <input
                              type="text"
                              value={draftHome.tabColorInactive || '#4b5563'}
                              onChange={(e) => updateDraftField('tabColorInactive', e.target.value)}
                              className="w-full p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">نمط شكل التبويبات</label>
                          <select
                            value={draftHome.tabStyle || 'pill'}
                            onChange={(e) => updateDraftField('tabStyle', e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-right cursor-pointer"
                          >
                            <option value="pill">💊 كبسولة ممتلئة (Pill)</option>
                            <option value="classic">➖ خط سفلي كلاسيكي (Classic)</option>
                            <option value="glass">🔮 زجاجي شفيف (Glass)</option>
                            <option value="bordered">🔲 محدد بإطار أنيق (Bordered)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">حجم خط التبويبات (px)</label>
                          <input
                            type="number"
                            min={12}
                            max={22}
                            value={draftHome.tabFontSize || '16'}
                            onChange={(e) => updateDraftField('tabFontSize', e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-center font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">لون خلفية الشريط الرئيسي</label>
                          <input
                            type="text"
                            value={draftHome.headerBgColor || '#fdfbf7'}
                            onChange={(e) => updateDraftField('headerBgColor', e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-center font-mono"
                            placeholder="#fdfbf7 or rgba(...)"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Section 1: Hero Banner */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/20">
                <button
                  type="button"
                  onClick={() => setExpandedHomeSection(expandedHomeSection === 'hero' ? '' : 'hero')}
                  className="w-full p-4 bg-emerald-50 hover:bg-emerald-100/70 transition-all text-right font-bold text-emerald-950 flex items-center justify-between flex-row-reverse"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg text-xs font-mono">١</span>
                    <span>الواجهة الترحيبية والبنر العلوي (Hero Section)</span>
                  </div>
                  <span>{expandedHomeSection === 'hero' ? '▲' : '▼'}</span>
                </button>
                {expandedHomeSection === 'hero' && (
                  <div className="p-6 bg-white space-y-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">الشعار الصغير (Badge Text) *</label>
                        <input
                          type="text"
                          required
                          value={draftHome.heroBadge}
                          onChange={(e) => updateDraftField('heroBadge', e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">العنوان الرئيسي العريض (Hero Title) *</label>
                        <input
                          type="text"
                          required
                          value={draftHome.heroTitle}
                          onChange={(e) => updateDraftField('heroTitle', e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">الوصف الترحيبي العام (Hero Description) *</label>
                      <textarea
                        rows={3}
                        required
                        value={draftHome.heroDescription}
                        onChange={(e) => updateDraftField('heroDescription', e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right leading-relaxed"
                      />
                    </div>

                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      <label className="text-xs font-bold text-gray-700 block">صورة البنر العلوي والواجهة الترحيبية (Hero Background Image) *</label>
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* URL, Upload and Presets */}
                        <div className="lg:col-span-8 space-y-4 text-right">
                          
                          {/* Drag & Drop Zone */}
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('hero-file-upload')?.click()}
                            className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                              isDragging 
                                ? 'border-emerald-600 bg-emerald-50/70 scale-[0.99]' 
                                : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/10'
                            }`}
                          >
                            <input
                              type="file"
                              id="hero-file-upload"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleImageFile(e.target.files[0]);
                                }
                              }}
                            />
                            <Upload className={`h-8 w-8 ${isDragging ? 'text-emerald-700 animate-bounce' : 'text-gray-400'}`} />
                            <div className="text-xs font-bold text-emerald-950">اسحب وأفلت صورة البنر هنا، أو انقر للاختيار من جهازك</div>
                            <p className="text-[10px] text-gray-400">يدعم صيغ PNG, JPG, WEBP. سيتم ضغط الصورة تلقائياً لسرعة التحميل وتفادي بطء المتصفح.</p>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                            <span className="h-px bg-gray-200 flex-1"></span>
                            <span>أو استخدام رابط مباشر</span>
                            <span className="h-px bg-gray-200 flex-1"></span>
                          </div>

                          <input
                            type="text"
                            placeholder="أدخل رابط الصورة المباشر (URL) أو اختر من المعرض السريع أدناه..."
                            value={draftHome.heroImage || ''}
                            onChange={(e) => updateDraftField('heroImage', e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-left font-mono"
                            dir="ltr"
                          />
                          <p className="text-[11px] text-gray-400">يمكنك وضع أي رابط مباشر لصورة من الإنترنت لتظهر كخلفية للبنر الترحيبي، أو اختيار صورة مميزة من المعرض السريع أدناه.</p>
                          
                          {/* Image Presets */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-bold text-gray-500 block">معرض صور مقترحة لبلدة قارة وجبال القلمون:</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <button
                                type="button"
                                onClick={() => updateDraftField('heroImage', '')}
                                className={`p-2 border rounded-xl text-center text-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${!draftHome.heroImage ? 'border-emerald-700 bg-emerald-50/50 text-emerald-900 font-bold' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                              >
                                <span className="w-full h-8 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center text-[10px] text-gray-400 font-sans">
                                  البنر الافتراضي الأصلي
                                </span>
                                <span className="text-[10px] truncate">البنر الأساسي الجديد</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateDraftField('heroImage', 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&w=1200&q=80')}
                                className={`p-2 border rounded-xl text-center text-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${draftHome.heroImage === 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&w=1200&q=80' ? 'border-emerald-700 bg-emerald-50/50 text-emerald-900 font-bold' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                              >
                                <img src="https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&w=100&h=60" alt="" className="w-full h-8 object-cover rounded-md" referrerPolicy="no-referrer" />
                                <span className="text-[10px] truncate">بساتين وحقول الكرز</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateDraftField('heroImage', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80')}
                                className={`p-2 border rounded-xl text-center text-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${draftHome.heroImage === 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' ? 'border-emerald-700 bg-emerald-50/50 text-emerald-900 font-bold' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                              >
                                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=100&h=60" alt="" className="w-full h-8 object-cover rounded-md" referrerPolicy="no-referrer" />
                                <span className="text-[10px] truncate">جبال القلمون الشامخة</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateDraftField('heroImage', 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80')}
                                className={`p-2 border rounded-xl text-center text-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${draftHome.heroImage === 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80' ? 'border-emerald-700 bg-emerald-50/50 text-emerald-900 font-bold' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                              >
                                <img src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=100&h=60" alt="" className="w-full h-8 object-cover rounded-md" referrerPolicy="no-referrer" />
                                <span className="text-[10px] truncate">البيوت والمعالم الحجرية</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Live Preview of image */}
                        <div className="lg:col-span-4 flex flex-col justify-center items-center p-3 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
                          <span className="text-[11px] font-bold text-gray-500 mb-2">معاينة البنر الحالي:</span>
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow border border-gray-100 bg-gray-200">
                            <img
                              src={draftHome.heroImage || heroBanner}
                              alt="معاينة البنر"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/invalid/1920/1080?brightness=80";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center text-white text-[10px] font-bold font-sans">
                              {!draftHome.heroImage ? 'صورة افتراضية نشطة' : 'صورة مخصصة نشطة'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logos Customization Subsection */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 text-right">
                      <div className="flex items-center gap-2 flex-row-reverse justify-end">
                        <Award className="h-4 w-4 text-emerald-800" />
                        <h4 className="text-xs font-bold text-emerald-950 font-sans">
                          إضافة وتخصيص شعارات البنر العلوي (المجلس المحلي والهوية البصرية):
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-sans font-medium">
                        تتيح لك هذه الخاصية رفع شعار المجلس المحلي وشعار الهوية البصرية للموقع، والتحكم بمواقعهما بدقة في زوايا البنر الترحيبي مع خيار تحديد لون الخلفية المناسب لهما أو وضعهما بشفافية تامة.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* 1. Local Council Logo Block */}
                        <div className="p-4 bg-emerald-50/20 border border-emerald-900/5 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2 flex-row-reverse justify-end border-b border-emerald-900/5 pb-2">
                            <span className="p-1 bg-emerald-800 text-amber-300 rounded-lg text-[9px] font-bold font-sans">أ</span>
                            <span className="text-xs font-bold text-emerald-950 font-sans">شعار المجلس المحلي لبلدة قارة</span>
                          </div>

                          {/* Upload logo */}
                          <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-gray-700 font-sans">رفع شعار المجلس المحلي:</label>
                            <div className="flex gap-2 items-center flex-row-reverse justify-end">
                              <button
                                type="button"
                                onClick={() => document.getElementById('council-logo-upload')?.click()}
                                className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer font-sans"
                              >
                                <Upload className="h-3.5 w-3.5" />
                                <span>اختر ملف الشعار</span>
                              </button>
                              <input
                                type="file"
                                id="council-logo-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleLogoFile(e.target.files[0], 'councilLogo');
                                  }
                                }}
                              />
                              {draftHome.councilLogo ? (
                                <button
                                  type="button"
                                  onClick={() => setDraftHome(prev => ({ ...prev, councilLogo: '' }))}
                                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans"
                                >
                                  إزالة الشعار
                                </button>
                              ) : (
                                <span className="text-[10px] text-gray-400 font-sans">لم يتم تحديد شعار بعد</span>
                              )}
                            </div>

                            {/* Logo URL input alternative */}
                            <div className="pt-1.5">
                              <input
                                type="text"
                                placeholder="أو أدخل رابط الشعار المباشر (URL)..."
                                value={draftHome.councilLogo || ''}
                                onChange={(e) => setDraftHome(prev => ({ ...prev, councilLogo: e.target.value }))}
                                className="w-full p-2 bg-white border border-gray-200 focus:border-emerald-700 rounded-xl outline-none text-[10px] text-left font-mono"
                                dir="ltr"
                              />
                            </div>
                          </div>

                          {draftHome.councilLogo && (
                            <div className="space-y-3 pt-2 border-t border-emerald-900/5">
                              {/* Position Control */}
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-extrabold text-gray-700 font-sans">تحديد موقع شعار المجلس:</label>
                                <div className="grid grid-cols-3 gap-1.5">
                                  {[
                                    { id: 'top_right', label: 'الزاوية العليا يمين' },
                                    { id: 'top_left', label: 'الزاوية العليا يسار' },
                                    { id: 'top_center', label: 'الوسط في الأعلى' }
                                  ].map((pos) => (
                                    <button
                                      key={pos.id}
                                      type="button"
                                      onClick={() => setDraftHome(prev => ({ ...prev, councilLogoPosition: pos.id as any }))}
                                      className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all text-center cursor-pointer font-sans ${
                                        (draftHome.councilLogoPosition || 'top_right') === pos.id
                                          ? 'bg-emerald-800 border-emerald-800 text-white shadow-sm'
                                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                      }`}
                                    >
                                      {pos.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Background Control */}
                              <div className="space-y-1.5 pt-1">
                                <label className="block text-[10px] font-extrabold text-gray-700 font-sans">لون خلفية الشعار:</label>
                                <div className="flex gap-2 items-center flex-row-reverse justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setDraftHome(prev => ({ ...prev, councilLogoBgColor: 'transparent' }))}
                                    className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer font-sans ${
                                      (draftHome.councilLogoBgColor || 'transparent') === 'transparent'
                                        ? 'bg-amber-500 border-amber-500 text-emerald-950 shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    شفاف (بدون خلفية)
                                  </button>
                                  <input
                                    type="color"
                                    value={
                                      draftHome.councilLogoBgColor && draftHome.councilLogoBgColor !== 'transparent' && draftHome.councilLogoBgColor.startsWith('#')
                                        ? draftHome.councilLogoBgColor
                                        : '#ffffff'
                                    }
                                    onChange={(e) => setDraftHome(prev => ({ ...prev, councilLogoBgColor: e.target.value }))}
                                    className="w-7 h-7 rounded-lg cursor-pointer border border-gray-200 p-0 overflow-hidden bg-transparent"
                                  />
                                  <input
                                    type="text"
                                    placeholder="#ffffff"
                                    value={draftHome.councilLogoBgColor || ''}
                                    onChange={(e) => setDraftHome(prev => ({ ...prev, councilLogoBgColor: e.target.value }))}
                                    className="flex-1 p-1 bg-white border border-gray-200 rounded-lg text-[10px] text-center font-mono"
                                  />
                                </div>
                              </div>

                              {/* Width Control Slider */}
                              <div className="space-y-1 pt-1">
                                <div className="flex justify-between items-center flex-row-reverse">
                                  <span className="text-[10px] text-emerald-800 font-bold font-mono">{draftHome.councilLogoWidth ?? 80}px</span>
                                  <label className="block text-[10px] font-extrabold text-gray-700 font-sans">عرض وحجم الشعار:</label>
                                </div>
                                <input
                                  type="range"
                                  min="40"
                                  max="160"
                                  step="5"
                                  value={draftHome.councilLogoWidth ?? 80}
                                  onChange={(e) => setDraftHome(prev => ({ ...prev, councilLogoWidth: parseInt(e.target.value, 10) }))}
                                  className="w-full accent-emerald-800 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 2. Visual Identity Logo Block */}
                        <div className="p-4 bg-emerald-50/20 border border-emerald-900/5 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2 flex-row-reverse justify-end border-b border-emerald-900/5 pb-2">
                            <span className="p-1 bg-emerald-800 text-amber-300 rounded-lg text-[9px] font-bold font-sans">ب</span>
                            <span className="text-xs font-bold text-emerald-950 font-sans">شعار الهوية البصرية للموقع</span>
                          </div>

                          {/* Upload logo */}
                          <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-gray-700 font-sans">رفع شعار الهوية البصرية:</label>
                            <div className="flex gap-2 items-center flex-row-reverse justify-end">
                              <button
                                type="button"
                                onClick={() => document.getElementById('identity-logo-upload')?.click()}
                                className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer font-sans"
                              >
                                <Upload className="h-3.5 w-3.5" />
                                <span>اختر ملف الشعار</span>
                              </button>
                              <input
                                type="file"
                                id="identity-logo-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleLogoFile(e.target.files[0], 'identityLogo');
                                  }
                                }}
                              />
                              {draftHome.identityLogo ? (
                                <button
                                  type="button"
                                  onClick={() => setDraftHome(prev => ({ ...prev, identityLogo: '' }))}
                                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans"
                                >
                                  إزالة الشعار
                                </button>
                              ) : (
                                <span className="text-[10px] text-gray-400 font-sans">لم يتم تحديد شعار بعد</span>
                              )}
                            </div>

                            {/* Logo URL input alternative */}
                            <div className="pt-1.5">
                              <input
                                type="text"
                                placeholder="أو أدخل رابط الشعار المباشر (URL)..."
                                value={draftHome.identityLogo || ''}
                                onChange={(e) => setDraftHome(prev => ({ ...prev, identityLogo: e.target.value }))}
                                className="w-full p-2 bg-white border border-gray-200 focus:border-emerald-700 rounded-xl outline-none text-[10px] text-left font-mono"
                                dir="ltr"
                              />
                            </div>
                          </div>

                          {draftHome.identityLogo && (
                            <div className="space-y-3 pt-2 border-t border-emerald-900/5">
                              {/* Position Control */}
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-extrabold text-gray-700 font-sans">تحديد موقع شعار الهوية:</label>
                                <div className="grid grid-cols-3 gap-1.5">
                                  {[
                                    { id: 'top_right', label: 'الزاوية العليا يمين' },
                                    { id: 'top_left', label: 'الزاوية العليا يسار' },
                                    { id: 'top_center', label: 'الوسط في الأعلى' }
                                  ].map((pos) => (
                                    <button
                                      key={pos.id}
                                      type="button"
                                      onClick={() => setDraftHome(prev => ({ ...prev, identityLogoPosition: pos.id as any }))}
                                      className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all text-center cursor-pointer font-sans ${
                                        (draftHome.identityLogoPosition || 'top_left') === pos.id
                                          ? 'bg-emerald-800 border-emerald-800 text-white shadow-sm'
                                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                      }`}
                                    >
                                      {pos.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Background Control */}
                              <div className="space-y-1.5 pt-1">
                                <label className="block text-[10px] font-extrabold text-gray-700 font-sans">لون خلفية الشعار:</label>
                                <div className="flex gap-2 items-center flex-row-reverse justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setDraftHome(prev => ({ ...prev, identityLogoBgColor: 'transparent' }))}
                                    className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer font-sans ${
                                      (draftHome.identityLogoBgColor || 'transparent') === 'transparent'
                                        ? 'bg-amber-500 border-amber-500 text-emerald-950 shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    شفاف (بدون خلفية)
                                  </button>
                                  <input
                                    type="color"
                                    value={
                                      draftHome.identityLogoBgColor && draftHome.identityLogoBgColor !== 'transparent' && draftHome.identityLogoBgColor.startsWith('#')
                                        ? draftHome.identityLogoBgColor
                                        : '#ffffff'
                                    }
                                    onChange={(e) => setDraftHome(prev => ({ ...prev, identityLogoBgColor: e.target.value }))}
                                    className="w-7 h-7 rounded-lg cursor-pointer border border-gray-200 p-0 overflow-hidden bg-transparent"
                                  />
                                  <input
                                    type="text"
                                    placeholder="#ffffff"
                                    value={draftHome.identityLogoBgColor || ''}
                                    onChange={(e) => setDraftHome(prev => ({ ...prev, identityLogoBgColor: e.target.value }))}
                                    className="flex-1 p-1 bg-white border border-gray-200 rounded-lg text-[10px] text-center font-mono"
                                  />
                                </div>
                              </div>

                              {/* Width Control Slider */}
                              <div className="space-y-1 pt-1">
                                <div className="flex justify-between items-center flex-row-reverse">
                                  <span className="text-[10px] text-emerald-800 font-bold font-mono">{draftHome.identityLogoWidth ?? 80}px</span>
                                  <label className="block text-[10px] font-extrabold text-gray-700 font-sans">عرض وحجم الشعار:</label>
                                </div>
                                <input
                                  type="range"
                                  min="40"
                                  max="160"
                                  step="5"
                                  value={draftHome.identityLogoWidth ?? 80}
                                  onChange={(e) => setDraftHome(prev => ({ ...prev, identityLogoWidth: parseInt(e.target.value, 10) }))}
                                  className="w-full accent-emerald-800 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hero Buttons & Preset Models Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 text-right">
                      <h4 className="text-xs font-bold text-emerald-950 flex items-center justify-end gap-1.5">
                        <span>أزرار وروابط البنر العلوي (Hero Action Buttons)</span>
                        <MousePointer className="h-4 w-4 text-amber-500" />
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
                        تحكم في الأزرار والروابط التي تظهر في الواجهة الترحيبية للبلدة. اختر من بين النماذج الجاهزة المتناسقة هندسياً أو عدل النصوص والتبويبات المستهدفة يدوياً.
                      </p>

                      {/* 1. Preset Models */}
                      <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-900/5 space-y-2.5">
                        <span className="text-[11px] font-bold text-emerald-900 block">اختر نموذج روابط جاهز ومتناسق:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const model: HeroLink[] = [
                                { id: "hl-1", label: "الخدمات الإلكترونية الرقمية", targetTab: "services", variant: "primary", iconName: "Building2" },
                                { id: "hl-2", label: "استكشف المشاريع التنموية", targetTab: "projects", variant: "secondary", iconName: "Briefcase" }
                              ];
                              setDraftHome(prev => ({ ...prev, heroLinks: model }));
                              setHomeContent({ ...draftHome, heroLinks: model });
                              triggerNotification("تم تطبيق النموذج الخدمي التنموي بنجاح!");
                            }}
                            className="bg-white border border-gray-200 hover:border-emerald-600 p-2.5 rounded-xl text-xs font-bold text-emerald-950 hover:bg-emerald-50/20 text-center transition-all cursor-pointer font-sans"
                          >
                            ⚙ النموذج الخدمي التنموي
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const model: HeroLink[] = [
                                { id: "hl-1", label: "أحدث الأخبار والمناسبات", targetTab: "news", variant: "primary", iconName: "Newspaper" },
                                { id: "hl-2", label: "تقديم طلب أو شكوى", targetTab: "projects", variant: "secondary", iconName: "FileText" }
                              ];
                              setDraftHome(prev => ({ ...prev, heroLinks: model }));
                              setHomeContent({ ...draftHome, heroLinks: model });
                              triggerNotification("تم تطبيق النموذج الإخباري والتفاعلي بنجاح!");
                            }}
                            className="bg-white border border-gray-200 hover:border-emerald-600 p-2.5 rounded-xl text-xs font-bold text-emerald-950 hover:bg-emerald-50/20 text-center transition-all cursor-pointer font-sans"
                          >
                            📰 النموذج الإخباري والاتصال
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const model: HeroLink[] = [
                                { id: "hl-1", label: "بوابة الخدمات الرقمية", targetTab: "services", variant: "primary", iconName: "Building2" },
                                { id: "hl-2", label: "معرض الصور التشاركي", targetTab: "gallery", variant: "accent", iconName: "ImageIcon" }
                              ];
                              setDraftHome(prev => ({ ...prev, heroLinks: model }));
                              setHomeContent({ ...draftHome, heroLinks: model });
                              triggerNotification("تم تطبيق النموذج الشامل والمعرض بنجاح!");
                            }}
                            className="bg-white border border-gray-200 hover:border-emerald-600 p-2.5 rounded-xl text-xs font-bold text-emerald-950 hover:bg-emerald-50/20 text-center transition-all cursor-pointer font-sans"
                          >
                            ✨ النموذج الشامل والمعرض
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const model: HeroLink[] = [
                                { id: "hl-1", label: "البث المباشر لقارة 🔴", targetTab: "live_stream", variant: "primary", iconName: "Video" },
                                { id: "hl-2", label: "بوابة الخدمات الرقمية", targetTab: "services", variant: "secondary", iconName: "Building2" },
                                { id: "hl-3", label: "معرض الصور والذكريات", targetTab: "gallery", variant: "accent", iconName: "ImageIcon" }
                              ];
                              setDraftHome(prev => ({ ...prev, heroLinks: model }));
                              setHomeContent({ ...draftHome, heroLinks: model });
                              triggerNotification("تم تطبيق نموذج البث المباشر والخدمات الرقمية بنجاح!");
                            }}
                            className="bg-white border border-rose-200 hover:border-rose-600 p-2.5 rounded-xl text-xs font-bold text-rose-950 hover:bg-rose-50/30 text-center transition-all cursor-pointer font-sans"
                          >
                            📺 نموذج البث المباشر الرقمي
                          </button>
                        </div>
                      </div>

                      {/* 2. Custom Buttons Form */}
                      <div className="space-y-3">
                        <span className="text-[11px] font-bold text-gray-700 block">تعديل الأزرار المخصصة يدوياً (الحد الأقصى: 3 أزرار):</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[0, 1, 2].map((idx) => {
                            const currentLinks = draftHome.heroLinks || [];
                            const link = currentLinks[idx];
                            
                            return (
                              <div key={idx} className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100 space-y-2.5">
                                <div className="flex items-center justify-between flex-row-reverse">
                                  <span className="text-xs font-bold text-emerald-900 font-sans">الزر رقم {idx + 1}</span>
                                  <span className={`w-2.5 h-2.5 rounded-full ${link ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                                </div>

                                {link ? (
                                  <>
                                    {/* Link label */}
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-gray-500 block font-sans">نص الزر:</label>
                                      <input
                                        type="text"
                                        value={link.label}
                                        onChange={(e) => {
                                          const updated = [...currentLinks];
                                          updated[idx] = { ...link, label: e.target.value };
                                          setDraftHome(prev => ({ ...prev, heroLinks: updated }));
                                        }}
                                        className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none text-xs text-right focus:border-emerald-700 font-sans"
                                      />
                                    </div>

                                    {/* Target Tab */}
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-gray-500 block font-sans">التبويب المستهدف عند الضغط:</label>
                                      <select
                                        value={link.targetTab === 'citizens' ? 'projects' : link.targetTab}
                                        onChange={(e) => {
                                          const updated = [...currentLinks];
                                          updated[idx] = { ...link, targetTab: e.target.value };
                                          setDraftHome(prev => ({ ...prev, heroLinks: updated }));
                                        }}
                                        className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none text-xs cursor-pointer focus:border-emerald-700 font-sans font-bold text-emerald-900"
                                      >
                                        <option value="citizen_auth">🔑 نافذة تسجيل الدخول أو تسجيل حساب مواطن</option>
                                        <option value="live_stream">🔴 البث المباشر (فتح نافذة البث المباشر)</option>
                                        <option value="services">بوابة المعاملات والخدمات الرقمية</option>
                                        <option value="projects">المشاريع والمقترحات والشكاوى</option>
                                        <option value="news">محرر الأخبار والفعاليات الرسمية</option>
                                        <option value="gallery">معرض الصور والألبوم التشاركي</option>
                                        <option value="directory">دليل قارة الخدمي والتجاري</option>
                                        <option value="survey">استطلاعات الرأي والتقييمات</option>
                                        <option value="qara_city">مدينة قارة وتاريخها</option>
                                        <option value="landmarks">المعالم الأثرية والمقامات</option>
                                        <option value="home">الصفحة الرئيسية</option>
                                        <option value="admin">لوحة التحكم (أدمن)</option>
                                      </select>
                                    </div>

                                    {/* Button Style / Variant */}
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-gray-500 block font-sans">مظهر ولون الزر:</label>
                                      <select
                                        value={link.variant}
                                        onChange={(e) => {
                                          const updated = [...currentLinks];
                                          updated[idx] = { ...link, variant: e.target.value as any };
                                          setDraftHome(prev => ({ ...prev, heroLinks: updated }));
                                        }}
                                        className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none text-xs cursor-pointer focus:border-emerald-700 font-sans"
                                      >
                                        <option value="primary">1. 🟡 ذهبي فخم عريض (متناسق رئيسي)</option>
                                        <option value="secondary">2. 🟢 زمردي ملكي داكن (متناسق كلاسيكي)</option>
                                        <option value="accent">3. ⚪ أبيض ناصع معزز (تباين أقصى)</option>
                                        <option value="royal_dark">4. 🔴 ياقوتي / عقيقي ملكي (أحمر داكن فاخر)</option>
                                        <option value="navy_blue">5. 🔵 كحلي نيلي أنيق (أزرق ملكي)</option>
                                        <option value="purple_violet">6. 🟣 بنفسجي ملكي فاخر (أرجواني مميز)</option>
                                        <option value="glass_emerald">7. 🧊 زجاجي بلوري شفاف (Frosted Emerald Glass)</option>
                                        <option value="dark_charcoal">8. 🖤 فحمي ليلي مع ذهبي (Dark Charcoal & Gold)</option>
                                        <option value="gradient_amber_emerald">9. 🌅 تدرج ذهبي إلى زمردي (Amber to Emerald Gradient)</option>
                                        <option value="gradient_rose_amber">10. 🌺 تدرج وردي إلى ذهبي (Rose to Amber Gradient)</option>
                                        <option value="outline_gold">11. 🌟 إطار ذهبي شفاف متألق (Gold Outline Glass)</option>
                                        <option value="outline_white">12. ⚡ إطار أبيض شفاف ناصع (White Outline Glass)</option>
                                      </select>
                                    </div>

                                    {/* Button Icon Selector */}
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-gray-500 block font-sans">أيقونة الزر (تظهر في الواجهة الترحيبية):</label>
                                      <select
                                        value={link.iconName || link.targetTab}
                                        onChange={(e) => {
                                          const updated = [...currentLinks];
                                          updated[idx] = { ...link, iconName: e.target.value };
                                          setDraftHome(prev => ({ ...prev, heroLinks: updated }));
                                        }}
                                        className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none text-xs cursor-pointer focus:border-emerald-700 font-sans font-medium text-emerald-950"
                                      >
                                        <option value="Cherry">🍒 ثمرة الكرز (Cherry)</option>
                                        <option value="UserCheck">👤 حساب مواطن / دخول (UserCheck)</option>
                                        <option value="Building2">🏢 مبنى / خدمات بلديات (Building2)</option>
                                        <option value="Briefcase">💼 حقيبة / مشاريع وتطوير (Briefcase)</option>
                                        <option value="Newspaper">📰 صحيفة / أخبار وفعاليات (Newspaper)</option>
                                        <option value="ImageIcon">🖼️ صورة / معرض صور (ImageIcon)</option>
                                        <option value="BookOpen">📖 كتاب / دليل تجاري وخدمي (BookOpen)</option>
                                        <option value="HelpCircle">❓ علامة استفهام / استطلاعات رأي (HelpCircle)</option>
                                        <option value="Building">🏛️ معلم أثري / تاريخ قارة (Building)</option>
                                        <option value="Sparkles">✨ نجوم / معالم سياحية (Sparkles)</option>
                                        <option value="FileText">📝 مستند / تقديم طلب أو شكوى (FileText)</option>
                                        <option value="Compass">🧭 بوصلة / استكشاف (Compass)</option>
                                      </select>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = currentLinks.filter((_, i) => i !== idx);
                                        setDraftHome(prev => ({ ...prev, heroLinks: updated }));
                                        triggerNotification("تم إزالة الزر.");
                                      }}
                                      className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center block font-sans"
                                    >
                                      إزالة هذا الزر نهائياً
                                    </button>
                                  </>
                                ) : (
                                  <div className="py-6 text-center space-y-2">
                                    <p className="text-[10px] text-gray-400 font-sans">الزر غير نشط حالياً</p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...currentLinks];
                                        updated[idx] = {
                                          id: "hl-" + Date.now(),
                                          label: "زر مخصص جديد",
                                          targetTab: "services",
                                          variant: "primary",
                                          iconName: "Building2"
                                        };
                                        setDraftHome(prev => ({ ...prev, heroLinks: updated }));
                                        triggerNotification("تم تفعيل الزر الجديد!");
                                      }}
                                      className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer font-sans"
                                    >
                                      + تفعيل الزر وإضافته
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Intro and Origin */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/20">
                <button
                  type="button"
                  onClick={() => setExpandedHomeSection(expandedHomeSection === 'intro' ? '' : 'intro')}
                  className="w-full p-4 bg-emerald-50 hover:bg-emerald-100/70 transition-all text-right font-bold text-emerald-950 flex items-center justify-between flex-row-reverse"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg text-xs font-mono">٢</span>
                    <span>النبذة التعريفية وتاريخ المدينة (Intro & Origins)</span>
                  </div>
                  <span>{expandedHomeSection === 'intro' ? '▲' : '▼'}</span>
                </button>
                {expandedHomeSection === 'intro' && (
                  <div className="p-6 bg-white space-y-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">عنوان النبذة التعريفية *</label>
                        <input
                          type="text"
                          required
                          value={draftHome.introTitle}
                          onChange={(e) => updateDraftField('introTitle', e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">عنوان بطاقة التعاون الأهلي *</label>
                        <input
                          type="text"
                          required
                          value={draftHome.awardTitle}
                          onChange={(e) => updateDraftField('awardTitle', e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1 md:col-span-1">
                        <label className="text-xs font-bold text-gray-700 block">نص بطاقة التعاون الأهلي *</label>
                        <textarea
                          rows={6}
                          required
                          value={draftHome.awardText}
                          onChange={(e) => updateDraftField('awardText', e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right leading-relaxed"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-1">
                        <label className="text-xs font-bold text-gray-700 block">النص التعريفي العام (Intro Text) *</label>
                        <textarea
                          rows={6}
                          required
                          value={draftHome.introText}
                          onChange={(e) => updateDraftField('introText', e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right leading-relaxed"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-1">
                        <label className="text-xs font-bold text-gray-700 block">أصل التسمية والجغرافيا (Origin Text) *</label>
                        <textarea
                          rows={6}
                          required
                          value={draftHome.originText}
                          onChange={(e) => updateDraftField('originText', e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Agriculture and Crops */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/20">
                <button
                  type="button"
                  onClick={() => setExpandedHomeSection(expandedHomeSection === 'agriculture' ? '' : 'agriculture')}
                  className="w-full p-4 bg-emerald-50 hover:bg-emerald-100/70 transition-all text-right font-bold text-emerald-950 flex items-center justify-between flex-row-reverse"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg text-xs font-mono">٣</span>
                    <span>القطاع الزراعي وأبرز محاصيل قارة (Agriculture & Crops)</span>
                  </div>
                  <span>{expandedHomeSection === 'agriculture' ? '▲' : '▼'}</span>
                </button>
                {expandedHomeSection === 'agriculture' && (
                  <div className="p-6 bg-white space-y-6 border-t border-gray-100">
                    
                    {/* 1. Basic Content Block */}
                    <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-900/5 space-y-4">
                      <h4 className="font-bold text-sm text-emerald-950 text-right flex items-center gap-1.5 justify-end">
                        <span>البيانات الأساسية للقسم الزراعي</span>
                        <span className="p-1 bg-emerald-100 text-emerald-800 rounded">📝</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-gray-700 block">عنوان القطاع الزراعي *</label>
                          <input
                            type="text"
                            required
                            value={draftHome.agricultureTitle}
                            onChange={(e) => updateDraftField('agricultureTitle', e.target.value)}
                            className="w-full p-2.5 bg-white border border-gray-200 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 rounded-xl outline-none text-xs text-right"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-gray-700 block">النص التعريفي لزراعة قارة *</label>
                          <textarea
                            rows={2}
                            required
                            value={draftHome.agricultureText}
                            onChange={(e) => updateDraftField('agricultureText', e.target.value)}
                            className="w-full p-2.5 bg-white border border-gray-200 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 rounded-xl outline-none text-xs text-right leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Font & Formatting Customization Panel */}
                    <div className="bg-amber-50/20 p-4 rounded-2xl border border-amber-900/10 space-y-4">
                      <h4 className="font-bold text-sm text-emerald-950 text-right flex items-center gap-1.5 justify-end">
                        <span>خيارات تنسيق مظهر ونوع خطوط القسم</span>
                        <span className="p-1 bg-amber-100 text-amber-800 rounded">✍</span>
                      </h4>
                      <p className="text-[11px] text-gray-500 font-sans text-right font-sans">قم بتخصيص خط ونمط الكتابة الخاص بقسم القطاع الزراعي ليتناسب مع رؤيتك التصميمية</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-gray-700 block">نوع الخط (Font Family)</label>
                          <select
                            value={draftHome.agricultureFontFamily || 'Cairo'}
                            onChange={(e) => updateDraftField('agricultureFontFamily', e.target.value)}
                            className="w-full p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs text-right font-sans"
                          >
                            <option value="Cairo">خط القاهرة الحديث (Cairo)</option>
                            <option value="Tajawal">خط تاجوال المعاصر (Tajawal)</option>
                            <option value="Almarai">خط المراعي الناعم (Almarai)</option>
                            <option value="Amiri">خط الأميري الكلاسيكي (Amiri)</option>
                            <option value="Harmattan">خط هارماتان (Harmattan)</option>
                            <option value="Lalezar">خط لاليزار العريض (Lalezar)</option>
                          </select>
                        </div>

                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-gray-700 block">حجم الخط (Font Size)</label>
                          <select
                            value={draftHome.agricultureFontSize || '14'}
                            onChange={(e) => updateDraftField('agricultureFontSize', e.target.value)}
                            className="w-full p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs text-right font-sans"
                          >
                            <option value="12">12px (صغير)</option>
                            <option value="13">13px (متوسط صغير)</option>
                            <option value="14">14px (الافتراضي للقسم)</option>
                            <option value="15">15px (متوسط مريح)</option>
                            <option value="16">16px (كبير)</option>
                            <option value="18">18px (ضخم)</option>
                          </select>
                        </div>

                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-gray-700 block">وزن الخط (Font Weight)</label>
                          <select
                            value={draftHome.agricultureFontWeight || 'normal'}
                            onChange={(e) => updateDraftField('agricultureFontWeight', e.target.value)}
                            className="w-full p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs text-right font-sans"
                          >
                            <option value="normal">عادي (Normal)</option>
                            <option value="medium">متوسط (Medium)</option>
                            <option value="bold">عريض (Bold)</option>
                            <option value="extrabold">عريض جداً (Extrabold)</option>
                          </select>
                        </div>

                        <div className="space-y-1 text-right flex flex-col justify-end pb-2">
                          <label className="text-xs font-bold text-gray-700 block mb-2">تأثيرات إضافية</label>
                          <div className="flex items-center gap-2 justify-end bg-white border border-gray-200 p-2 rounded-xl h-[38px]">
                            <span className="text-xs text-gray-700 font-sans">خط مائل (Italic)</span>
                            <input
                              type="checkbox"
                              checked={draftHome.agricultureFontStyle === 'italic'}
                              onChange={(e) => updateDraftField('agricultureFontStyle', e.target.checked ? 'italic' : 'normal')}
                              className="rounded border-gray-300 text-emerald-800 focus:ring-emerald-700 cursor-pointer w-4 h-4"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Color Customization Sub-panel */}
                    <div className="bg-emerald-50/20 p-4 rounded-2xl border border-emerald-950/5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 flex-row-reverse text-right">
                        <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5 justify-end">
                          <span>تعديل لون الخلفية والأقسام الفرعية</span>
                          <span className="p-1 bg-emerald-100 text-emerald-800 rounded">🎨</span>
                        </h4>
                        
                        {/* Preset Buttons */}
                        <div className="flex flex-wrap items-center gap-1.5 justify-end">
                          <span className="text-[10px] text-gray-400 font-bold ml-1.5">لوحات ألوان جاهزة:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setDraftHome(prev => ({
                                ...prev,
                                agricultureBgColor: "#064e3b",
                                agricultureTextColor: "#ecfdf5",
                                agricultureSubBgColor: "rgba(2, 44, 34, 0.4)",
                                agricultureSubBorderColor: "rgba(6, 78, 59, 0.4)",
                                agricultureTitleColor: "#fbbf24",
                                agricultureCropTitleColor: "#fcd34d",
                                agricultureCropDescColor: "rgba(209, 250, 229, 0.8)"
                              }));
                              triggerNotification('تم تطبيق لوحة ألوان الزمرد الافتراضية!');
                            }}
                            className="px-2 py-1 rounded bg-emerald-800 text-white text-[10px] font-bold border border-emerald-700 hover:bg-emerald-700 cursor-pointer"
                          >
                            زمردي (افتراضي)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDraftHome(prev => ({
                                ...prev,
                                agricultureBgColor: "#0f172a",
                                agricultureTextColor: "#f1f5f9",
                                agricultureSubBgColor: "rgba(30, 41, 59, 0.5)",
                                agricultureSubBorderColor: "rgba(71, 85, 105, 0.4)",
                                agricultureTitleColor: "#38bdf8",
                                agricultureCropTitleColor: "#7dd3fc",
                                agricultureCropDescColor: "rgba(241, 245, 249, 0.8)"
                              }));
                              triggerNotification('تم تطبيق لوحة ألوان الأزرق الجبلي الداكن!');
                            }}
                            className="px-2 py-1 rounded bg-slate-800 text-white text-[10px] font-bold border border-slate-700 hover:bg-slate-700 cursor-pointer"
                          >
                            أزرق جبلي
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDraftHome(prev => ({
                                ...prev,
                                agricultureBgColor: "#451a03",
                                agricultureTextColor: "#fef3c7",
                                agricultureSubBgColor: "rgba(120, 53, 4, 0.4)",
                                agricultureSubBorderColor: "rgba(180, 83, 9, 0.4)",
                                agricultureTitleColor: "#fbbf24",
                                agricultureCropTitleColor: "#fcd34d",
                                agricultureCropDescColor: "rgba(254, 243, 199, 0.8)"
                              }));
                              triggerNotification('تم تطبيق لوحة ألوان الخريف الذهبي!');
                            }}
                            className="px-2 py-1 rounded bg-amber-900 text-white text-[10px] font-bold border border-amber-800 hover:bg-amber-800 cursor-pointer"
                          >
                            خريف ذهبي
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDraftHome(prev => ({
                                ...prev,
                                agricultureBgColor: "#1e293b",
                                agricultureTextColor: "#f8fafc",
                                agricultureSubBgColor: "rgba(15, 23, 42, 0.5)",
                                agricultureSubBorderColor: "rgba(71, 85, 105, 0.4)",
                                agricultureTitleColor: "#34d399",
                                agricultureCropTitleColor: "#6ee7b7",
                                agricultureCropDescColor: "rgba(248, 250, 252, 0.8)"
                              }));
                              triggerNotification('تم تطبيق لوحة ألوان الفحمي الأنيق!');
                            }}
                            className="px-2 py-1 rounded bg-gray-800 text-white text-[10px] font-bold border border-gray-700 hover:bg-gray-700 cursor-pointer"
                          >
                            رمادي فحمي
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-right">
                        {/* Main background color input */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">لون الخلفية الرئيسي للقسم</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={draftHome.agricultureBgColor || '#064e3b'}
                              onChange={(e) => updateDraftField('agricultureBgColor', e.target.value)}
                              className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 shrink-0"
                            />
                            <input
                              type="text"
                              value={draftHome.agricultureBgColor || '#064e3b'}
                              onChange={(e) => updateDraftField('agricultureBgColor', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        {/* Title color input */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">لون عنوان القسم والزخارف</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={draftHome.agricultureTitleColor || '#fbbf24'}
                              onChange={(e) => updateDraftField('agricultureTitleColor', e.target.value)}
                              className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 shrink-0"
                            />
                            <input
                              type="text"
                              value={draftHome.agricultureTitleColor || '#fbbf24'}
                              onChange={(e) => updateDraftField('agricultureTitleColor', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        {/* Text color input */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">لون النص التعريفي الرئيسي</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={draftHome.agricultureTextColor || '#ecfdf5'}
                              onChange={(e) => updateDraftField('agricultureTextColor', e.target.value)}
                              className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 shrink-0"
                            />
                            <input
                              type="text"
                              value={draftHome.agricultureTextColor || '#ecfdf5'}
                              onChange={(e) => updateDraftField('agricultureTextColor', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        {/* Subbg color input */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">خلفية بطاقات المحاصيل الفرعية</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={draftHome.agricultureSubBgColor && draftHome.agricultureSubBgColor.startsWith('#') ? draftHome.agricultureSubBgColor : '#022c22'}
                              onChange={(e) => updateDraftField('agricultureSubBgColor', e.target.value)}
                              className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 shrink-0"
                            />
                            <input
                              type="text"
                              value={draftHome.agricultureSubBgColor || 'rgba(2, 44, 34, 0.4)'}
                              onChange={(e) => updateDraftField('agricultureSubBgColor', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        {/* Subborder color input */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">حدود وإطارات بطاقات المحاصيل</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={draftHome.agricultureSubBorderColor && draftHome.agricultureSubBorderColor.startsWith('#') ? draftHome.agricultureSubBorderColor : '#064e3b'}
                              onChange={(e) => updateDraftField('agricultureSubBorderColor', e.target.value)}
                              className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 shrink-0"
                            />
                            <input
                              type="text"
                              value={draftHome.agricultureSubBorderColor || 'rgba(6, 78, 59, 0.4)'}
                              onChange={(e) => updateDraftField('agricultureSubBorderColor', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        {/* Crop Title color input */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">لون عناوين المحاصيل الفرعية</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={draftHome.agricultureCropTitleColor || '#fcd34d'}
                              onChange={(e) => updateDraftField('agricultureCropTitleColor', e.target.value)}
                              className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 shrink-0"
                            />
                            <input
                              type="text"
                              value={draftHome.agricultureCropTitleColor || '#fcd34d'}
                              onChange={(e) => updateDraftField('agricultureCropTitleColor', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        {/* Crop Desc color input */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">لون وصف وتفاصيل المحاصيل</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={draftHome.agricultureCropDescColor && draftHome.agricultureCropDescColor.startsWith('#') ? draftHome.agricultureCropDescColor : '#d1fae5'}
                              onChange={(e) => updateDraftField('agricultureCropDescColor', e.target.value)}
                              className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 shrink-0"
                            />
                            <input
                              type="text"
                              value={draftHome.agricultureCropDescColor || 'rgba(209, 250, 229, 0.8)'}
                              onChange={(e) => updateDraftField('agricultureCropDescColor', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. Crop management and adding new crops */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between flex-row-reverse border-b border-gray-100 pb-2.5">
                        <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-1.5 justify-end">
                          <span>قائمة المحاصيل الزراعية المتاحة</span>
                          <span className="p-1 bg-amber-100 text-amber-800 rounded">🌱</span>
                        </h4>
                        
                        <button
                          type="button"
                          onClick={addDraftCrop}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                        >
                          <Plus className="h-4 w-4 text-amber-400" />
                          <span>إضافة محصول زراعي جديد</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {draftHome.agricultureCrops && draftHome.agricultureCrops.map((crop, idx) => (
                          <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-4 text-right relative overflow-hidden group hover:shadow-md transition-all">
                            {/* Header row with Delete */}
                            <div className="flex items-center justify-between flex-row-reverse">
                              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">المحصول #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => removeDraftCrop(idx)}
                                className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all cursor-pointer"
                                title="حذف هذا المحصول"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Name input */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-gray-700 block">اسم المحصول</label>
                              <input
                                type="text"
                                required
                                value={crop.name}
                                onChange={(e) => updateDraftCrop(idx, 'name', e.target.value)}
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs text-right"
                              />
                            </div>

                            {/* Description input */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-gray-700 block">وصف المحصول ومميزاته</label>
                              <textarea
                                rows={2}
                                required
                                value={crop.desc}
                                onChange={(e) => updateDraftCrop(idx, 'desc', e.target.value)}
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs text-right leading-relaxed"
                              />
                            </div>

                            {/* Start Special Symbol bullet selection ("علامات بداية الكتابة") */}
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-emerald-950 block">علامة بداية الكتابة (أيقونة المحصول)</label>
                              <div className="flex flex-wrap gap-1.5 p-2 bg-white border border-gray-100 rounded-xl justify-start" dir="rtl">
                                {[
                                  '🌱', '🍒', '🫒', '🍇', '🌿', '🌾', '🌻', '🍎', '🍐', '🍑', '🍊', '🌳', '✨', '★', '●', '■', '◆', '✔', '🔸', '🔹', '☘'
                                ].map((markerSymbol) => {
                                  const isSelected = crop.symbol === markerSymbol;
                                  return (
                                    <button
                                      key={markerSymbol}
                                      type="button"
                                      onClick={() => updateDraftCrop(idx, 'symbol', markerSymbol)}
                                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer border ${
                                        isSelected 
                                          ? 'bg-emerald-50 border-emerald-800 scale-110 shadow-sm font-bold ring-2 ring-emerald-700/20' 
                                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                      }`}
                                      title={`تطبيق ${markerSymbol}`}
                                    >
                                      {markerSymbol}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4: Heritage Landmarks */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/20">
                <button
                  type="button"
                  onClick={() => setExpandedHomeSection(expandedHomeSection === 'heritage' ? '' : 'heritage')}
                  className="w-full p-4 bg-emerald-50 hover:bg-emerald-100/70 transition-all text-right font-bold text-emerald-950 flex items-center justify-between flex-row-reverse"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg text-xs font-mono">٤</span>
                    <span>المعالم الأثرية والمقدسات (Heritage Landmarks)</span>
                  </div>
                  <span>{expandedHomeSection === 'heritage' ? '▲' : '▼'}</span>
                </button>
                {expandedHomeSection === 'heritage' && (
                  <div className="p-6 bg-white space-y-8 border-t border-gray-100 text-right">
                    
                    {/* General Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">عنوان قسم المعالم الأثرية *</label>
                        <input
                          type="text"
                          required
                          value={draftHome.heritageTitle}
                          onChange={(e) => updateDraftField('heritageTitle', e.target.value)}
                          className="w-full p-2.5 bg-white border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">الوصف العام للمعالم الأثرية بقارة *</label>
                        <input
                          type="text"
                          required
                          value={draftHome.heritageDescription}
                          onChange={(e) => updateDraftField('heritageDescription', e.target.value)}
                          className="w-full p-2.5 bg-white border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-medium"
                        />
                      </div>
                    </div>

                    {/* Color customizers */}
                    <div className="space-y-4 border-t border-gray-100 pt-6">
                      <h5 className="font-extrabold text-xs text-emerald-900 flex items-center gap-1.5 flex-row-reverse">
                        <span>🎨 لوحة تخصيص ألوان وتصميم أزرار وبطاقات المعالم الأثرية</span>
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Active button BG */}
                        <div className="space-y-1 bg-emerald-50/10 p-3 rounded-xl border border-emerald-900/5">
                          <label className="text-[11px] font-bold text-gray-700 block">خلفية الزر بعد الضغط (النشط)</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={draftHome.heritageActiveBgColor || '#065f46'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageActiveBgColor: e.target.value }))}
                              className="h-8 w-10 border border-gray-200 rounded cursor-pointer bg-white"
                            />
                            <input
                              type="text"
                              value={draftHome.heritageActiveBgColor || '#065f46'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageActiveBgColor: e.target.value }))}
                              className="w-full p-1 border border-gray-200 rounded text-[11px] font-mono text-center outline-none bg-white"
                            />
                          </div>
                        </div>

                        {/* Active button text color */}
                        <div className="space-y-1 bg-emerald-50/10 p-3 rounded-xl border border-emerald-900/5">
                          <label className="text-[11px] font-bold text-gray-700 block">عنوان وعلامة الزر النشط</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={draftHome.heritageActiveTextColor || '#ffffff'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageActiveTextColor: e.target.value }))}
                              className="h-8 w-10 border border-gray-200 rounded cursor-pointer bg-white"
                            />
                            <input
                              type="text"
                              value={draftHome.heritageActiveTextColor || '#ffffff'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageActiveTextColor: e.target.value }))}
                              className="w-full p-1 border border-gray-200 rounded text-[11px] font-mono text-center outline-none bg-white"
                            />
                          </div>
                        </div>

                        {/* Inactive button BG */}
                        <div className="space-y-1 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                          <label className="text-[11px] font-bold text-gray-700 block">خلفية الزر قبل الضغط (غير النشط)</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={draftHome.heritageInactiveBgColor || '#ffffff'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageInactiveBgColor: e.target.value }))}
                              className="h-8 w-10 border border-gray-200 rounded cursor-pointer bg-white"
                            />
                            <input
                              type="text"
                              value={draftHome.heritageInactiveBgColor || '#ffffff'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageInactiveBgColor: e.target.value }))}
                              className="w-full p-1 border border-gray-200 rounded text-[11px] font-mono text-center outline-none bg-white"
                            />
                          </div>
                        </div>

                        {/* Inactive button text color */}
                        <div className="space-y-1 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                          <label className="text-[11px] font-bold text-gray-700 block">عنوان وعلامة الزر غير النشط</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={draftHome.heritageInactiveTextColor || '#374151'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageInactiveTextColor: e.target.value }))}
                              className="h-8 w-10 border border-gray-200 rounded cursor-pointer bg-white"
                            />
                            <input
                              type="text"
                              value={draftHome.heritageInactiveTextColor || '#374151'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageInactiveTextColor: e.target.value }))}
                              className="w-full p-1 border border-gray-200 rounded text-[11px] font-mono text-center outline-none bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Detailed card BG */}
                        <div className="space-y-1 bg-amber-50/5 p-3 rounded-xl border border-amber-900/5">
                          <label className="text-[11px] font-bold text-gray-700 block">خلفية بطاقة تفاصيل المعلم</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={draftHome.heritageContentBgColor || '#ffffff'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageContentBgColor: e.target.value }))}
                              className="h-8 w-10 border border-gray-200 rounded cursor-pointer bg-white"
                            />
                            <input
                              type="text"
                              value={draftHome.heritageContentBgColor || '#ffffff'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageContentBgColor: e.target.value }))}
                              className="w-full p-1 border border-gray-200 rounded text-[11px] font-mono text-center outline-none bg-white"
                            />
                          </div>
                        </div>

                        {/* Detailed card Title Color */}
                        <div className="space-y-1 bg-amber-50/5 p-3 rounded-xl border border-amber-900/5">
                          <label className="text-[11px] font-bold text-gray-700 block">لون اسم المعلم ببطاقة التفاصيل</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={draftHome.heritageContentTitleColor || '#022c22'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageContentTitleColor: e.target.value }))}
                              className="h-8 w-10 border border-gray-200 rounded cursor-pointer bg-white"
                            />
                            <input
                              type="text"
                              value={draftHome.heritageContentTitleColor || '#022c22'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageContentTitleColor: e.target.value }))}
                              className="w-full p-1 border border-gray-200 rounded text-[11px] font-mono text-center outline-none bg-white"
                            />
                          </div>
                        </div>

                        {/* Detailed card Description Text color */}
                        <div className="space-y-1 bg-amber-50/5 p-3 rounded-xl border border-amber-900/5">
                          <label className="text-[11px] font-bold text-emerald-950 block">لون أسطر ووصف المعلم (ألوان الخطوط)</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={draftHome.heritageContentTextColor || '#4b5563'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageContentTextColor: e.target.value }))}
                              className="h-8 w-10 border border-gray-200 rounded cursor-pointer bg-white"
                            />
                            <input
                              type="text"
                              value={draftHome.heritageContentTextColor || '#4b5563'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, heritageContentTextColor: e.target.value }))}
                              className="w-full p-1 border border-gray-200 rounded text-[11px] font-mono text-center outline-none bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Redirect Banner to Dedicated Landmarks Tab */}
                    <div className="space-y-4 border-t border-gray-100 pt-6">
                      <div className="p-5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5 justify-end">
                            <span>إدارة وتوثيق المعالم الأثرية والشروحات الكاملة</span>
                            <Sparkles className="h-4 w-4 text-amber-600" />
                          </h4>
                          <p className="text-xs text-amber-900/80">
                            تم نقل التحكم التفصيلي الكامل بجميع معالم بلدة قارة الأثرية وصورها وشروحاتها إلى التبويب المخصص <strong>"🏛️ المعالم الأثرية"</strong> في الشريط العلوى للوحة التحكم، مع الربط المباشر بعرض أحدث 4 معالم على الصفحة الرئيسية تلقائياً.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveSubTab('landmarks')}
                          className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
                        >
                          <span>الانتقال لتبويب المعالم الأثرية</span>
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Section 5: Emergency Contacts */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/20">
                <button
                  type="button"
                  onClick={() => setExpandedHomeSection(expandedHomeSection === 'emergency' ? '' : 'emergency')}
                  className="w-full p-4 bg-emerald-50 hover:bg-emerald-100/70 transition-all text-right font-bold text-emerald-950 flex items-center justify-between flex-row-reverse"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg text-xs font-mono">٥</span>
                    <span>دليل الطوارئ والخطوط الساخنة (Emergency Directory)</span>
                  </div>
                  <span>{expandedHomeSection === 'emergency' ? '▲' : '▼'}</span>
                </button>
                {expandedHomeSection === 'emergency' && (
                  <div className="p-6 bg-white space-y-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">عنوان دليل الطوارئ والخطوط الساخنة *</label>
                        <input
                          type="text"
                          required
                          value={draftHome.emergencyTitle}
                          onChange={(e) => updateDraftField('emergencyTitle', e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">وصف دليل الجهات الساخنة بقارة *</label>
                        <input
                          type="text"
                          required
                          value={draftHome.emergencyDescription}
                          onChange={(e) => updateDraftField('emergencyDescription', e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-extrabold text-sm text-emerald-950 border-b border-gray-100 pb-2">قائمة هواتف الطوارئ والجهات الأربعة الرئيسية:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {draftHome.emergencyContacts.map((contact, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-right">
                            <span className="text-xs font-bold text-emerald-800">الدائرة / رقم الهواتف #{idx + 1}</span>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[11px] text-gray-500 block">اسم الجهة / الهيئة</label>
                                <input
                                  type="text"
                                  required
                                  value={contact.name}
                                  onChange={(e) => updateDraftContact(idx, 'name', e.target.value)}
                                  className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none text-xs text-right"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] text-gray-500 block">رقم الهاتف</label>
                                <input
                                  type="text"
                                  required
                                  value={contact.number}
                                  onChange={(e) => updateDraftContact(idx, 'number', e.target.value)}
                                  className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none text-xs text-right font-mono"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[11px] text-gray-500 block">طبيعة الشؤون والخدمات</label>
                                <input
                                  type="text"
                                  required
                                  value={contact.role}
                                  onChange={(e) => updateDraftContact(idx, 'role', e.target.value)}
                                  className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none text-xs text-right"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] text-gray-500 block">أيقونة الجهة</label>
                                <select
                                  value={contact.iconName}
                                  onChange={(e) => updateDraftContact(idx, 'iconName', e.target.value)}
                                  className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none text-xs text-right"
                                >
                                  <option value="Building">بلدية / حكومي (Building)</option>
                                  <option value="HeartPulse">صحي / طبي (HeartPulse)</option>
                                  <option value="ShieldAlert">إطفاء / طوارئ (ShieldAlert)</option>
                                  <option value="Sprout">إرشاد زراعي (Sprout)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 6: Stats */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/20">
                <button
                  type="button"
                  onClick={() => setExpandedHomeSection(expandedHomeSection === 'stats' ? '' : 'stats')}
                  className="w-full p-4 bg-emerald-50 hover:bg-emerald-100/70 transition-all text-right font-bold text-emerald-950 flex items-center justify-between flex-row-reverse"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg text-xs font-mono">٦</span>
                    <span>الإحصائيات السريعة والبيانات الرقمية (City Stats)</span>
                  </div>
                  <span>{expandedHomeSection === 'stats' ? '▲' : '▼'}</span>
                </button>
                {expandedHomeSection === 'stats' && (
                  <div className="p-6 bg-white space-y-4 border-t border-gray-100">
                    <h4 className="font-extrabold text-sm text-emerald-950 border-b border-gray-100 pb-2">البطاقات الرقمية الأربعة في البنر التعريفي:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {draftHome.stats.map((stat, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-right">
                          <span className="text-xs font-bold text-emerald-800">بطاقة إحصائية #{idx + 1}</span>
                          <div className="space-y-1">
                            <label className="text-[11px] text-gray-500 block">العنوان الجانبي</label>
                            <input
                              type="text"
                              required
                              value={stat.label}
                              onChange={(e) => updateDraftStat(idx, 'label', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none text-xs text-right"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] text-gray-500 block">القيمة الرقمية (مثال: +١٢ أو ١,٣٠٠ م)</label>
                            <input
                              type="text"
                              required
                              value={stat.value}
                              onChange={(e) => updateDraftStat(idx, 'value', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none text-xs text-right font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Stats Banner design customizer */}
                    <div className="mt-6 pt-6 border-t border-gray-100 text-right space-y-4">
                      <h5 className="font-extrabold text-xs text-emerald-900 flex items-center gap-1 flex-row-reverse">
                        <span>🎨 خيارات التخصيص والمظهر لبنر الإحصائيات</span>
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Background color */}
                        <div className="space-y-1 text-right">
                          <label className="text-[11px] font-bold text-gray-600 block">لون خلفية البنر</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={draftHome.statsBgColor || '#ffffff'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, statsBgColor: e.target.value }))}
                              className="h-9 w-12 border border-gray-200 rounded-lg cursor-pointer bg-white"
                            />
                            <input
                              type="text"
                              value={draftHome.statsBgColor || '#ffffff'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, statsBgColor: e.target.value }))}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        {/* Value Text color */}
                        <div className="space-y-1 text-right">
                          <label className="text-[11px] font-bold text-gray-600 block">لون الأرقام والقيم</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={draftHome.statsValueColor || '#064e3b'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, statsValueColor: e.target.value }))}
                              className="h-9 w-12 border border-gray-200 rounded-lg cursor-pointer bg-white"
                            />
                            <input
                              type="text"
                              value={draftHome.statsValueColor || '#064e3b'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, statsValueColor: e.target.value }))}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        {/* Label text color */}
                        <div className="space-y-1 text-right">
                          <label className="text-[11px] font-bold text-gray-600 block">لون العناوين والكلمات</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={draftHome.statsLabelColor || '#6b7280'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, statsLabelColor: e.target.value }))}
                              className="h-9 w-12 border border-gray-200 rounded-lg cursor-pointer bg-white"
                            />
                            <input
                              type="text"
                              value={draftHome.statsLabelColor || '#6b7280'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, statsLabelColor: e.target.value }))}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none text-xs font-mono text-center"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Banner height control */}
                        <div className="space-y-1 bg-emerald-50/20 p-3 rounded-xl border border-emerald-900/5 text-right">
                          <div className="flex justify-between items-center flex-row-reverse">
                            <label className="text-[11px] font-bold text-gray-700">ارتفاع البنر الإجمالي (الحشوة الداخلية)</label>
                            <span className="text-xs font-bold text-emerald-800 font-mono">{draftHome.statsHeight !== undefined ? draftHome.statsHeight : 12}px</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="48"
                            value={draftHome.statsHeight !== undefined ? draftHome.statsHeight : 12}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, statsHeight: parseInt(e.target.value, 10) }))}
                            className="w-full accent-emerald-800 cursor-pointer"
                          />
                          <span className="text-[9px] text-gray-400 block leading-tight">اسحب الشريط لليسار لتصغير سماكة وارتفاع بنر الإحصائيات الكامل لجعله رشيقاً ومناسباً للتصميم.</span>
                        </div>

                        {/* Font size control */}
                        <div className="space-y-1 bg-emerald-50/20 p-3 rounded-xl border border-emerald-900/5 text-right">
                          <div className="flex justify-between items-center flex-row-reverse">
                            <label className="text-[11px] font-bold text-gray-700">حجم خط الإحصائيات ونسبة تناسب القيم</label>
                            <span className="text-xs font-bold text-emerald-800 font-mono">{draftHome.statsFontSize || 12}px</span>
                          </div>
                          <input
                            type="range"
                            min="8"
                            max="20"
                            value={draftHome.statsFontSize || 12}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, statsFontSize: parseInt(e.target.value, 10) }))}
                            className="w-full accent-emerald-800 cursor-pointer"
                          />
                          <span className="text-[9px] text-gray-400 block leading-tight">يتحكم بحجم خط كتابة العناوين ويقوم تلقائياً بتكبير أو تصغير الأرقام بشكل متناسب.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 6.5: News Ticker Controls */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/20">
                <button
                  type="button"
                  onClick={() => setExpandedHomeSection(expandedHomeSection === 'news_ticker' ? '' : 'news_ticker')}
                  className="w-full p-4 bg-emerald-50 hover:bg-emerald-100/70 transition-all text-right font-bold text-emerald-950 flex items-center justify-between flex-row-reverse"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg text-xs font-mono">٦.٥</span>
                    <span>إعدادات الشريط الإخباري المتحرك العام (News Ticker)</span>
                  </div>
                  <span>{expandedHomeSection === 'news_ticker' ? '▲' : '▼'}</span>
                </button>
                {expandedHomeSection === 'news_ticker' && (
                  <div className="p-6 bg-white space-y-6 border-t border-gray-100 text-right">
                    
                    {/* Enable/Disable Toggle */}
                    <div className="flex flex-col sm:flex-row-reverse justify-between items-start sm:items-center gap-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50">
                      <div className="space-y-1 text-right">
                        <span className="font-bold text-sm text-emerald-950 block">تفعيل الشريط الإخباري في الصفحة الرئيسية</span>
                        <span className="text-xs text-gray-400">إظهار شريط إخباري متحرك يمتد على كامل الصفحة فوق النبذة التعريفية</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={draftHome.tickerEnabled !== false}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, tickerEnabled: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
                      </label>
                    </div>

                    {/* Basic Styling Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      {/* Background Color */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">لون خلفية الشريط الإخباري</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={draftHome.tickerBgColor || '#022c22'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, tickerBgColor: e.target.value }))}
                            className="h-10 w-12 border border-gray-200 rounded-lg cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={draftHome.tickerBgColor || '#022c22'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, tickerBgColor: e.target.value }))}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:bg-white rounded-xl outline-none text-xs text-center font-mono"
                          />
                        </div>
                      </div>

                      {/* Text Color */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">لون نص الأخبار والإعلانات</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={draftHome.tickerTextColor || '#fcd34d'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, tickerTextColor: e.target.value }))}
                            className="h-10 w-12 border border-gray-200 rounded-lg cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={draftHome.tickerTextColor || '#fcd34d'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, tickerTextColor: e.target.value }))}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:bg-white rounded-xl outline-none text-xs text-center font-mono"
                          />
                        </div>
                      </div>

                      {/* Font size */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center flex-row-reverse">
                          <label className="text-xs font-bold text-gray-700">حجم خط الشريط الإخباري</label>
                          <span className="text-xs font-bold text-emerald-800 font-mono">{draftHome.tickerFontSize || 13}px</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="18"
                          value={draftHome.tickerFontSize || 13}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, tickerFontSize: parseInt(e.target.value, 10) }))}
                          className="w-full accent-emerald-800 cursor-pointer h-10"
                        />
                      </div>
                    </div>

                    {/* News Ticker Title Label, Colors & Side Settings */}
                    <div className="border-t border-gray-100 pt-5 mt-4 space-y-4">
                      <span className="font-extrabold text-xs text-emerald-950 block text-right">🏷️ تخصيص صندوق عنوان الشريط (آخر الأخبار)</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title Text */}
                        <div className="space-y-2 text-right">
                          <label className="text-xs font-bold text-gray-700 block">نص عنوان صندوق الشريط</label>
                          <input
                            type="text"
                            value={draftHome.tickerTitle !== undefined ? draftHome.tickerTitle : 'آخر الأخبار'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, tickerTitle: e.target.value }))}
                            placeholder="مثال: آخر الأخبار، تنويه هام، إعلانات..."
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:bg-white rounded-xl outline-none text-xs text-right font-medium"
                          />
                        </div>

                        {/* Title Position / Alignment */}
                        <div className="space-y-2 text-right">
                          <label className="text-xs font-bold text-gray-700 block">جهة وتموضع صندوق العنوان</label>
                          <select
                            value={draftHome.tickerTitlePosition || 'left'}
                            onChange={(e: any) => setDraftHome(prev => ({ ...prev, tickerTitlePosition: e.target.value }))}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:bg-white rounded-xl outline-none text-xs text-right font-semibold text-gray-700"
                          >
                            <option value="left">جهة اليسار (الجهة المقابلة - ممتد للداخل)</option>
                            <option value="right">جهة اليمين (البداية الطبيعية)</option>
                          </select>
                          <span className="text-[10px] text-gray-400 block leading-tight">اختر "اليسار" لتثبيته في الجهة المقابلة لتدفق النصوص.</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title Bg Color */}
                        <div className="space-y-2 text-right">
                          <label className="text-xs font-bold text-gray-700 block">لون خلفية صندوق العنوان</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={draftHome.tickerTitleBgColor || '#f59e0b'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, tickerTitleBgColor: e.target.value }))}
                              className="h-10 w-12 border border-gray-200 rounded-lg cursor-pointer bg-white"
                            />
                            <input
                              type="text"
                              value={draftHome.tickerTitleBgColor || '#f59e0b'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, tickerTitleBgColor: e.target.value }))}
                              className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:bg-white rounded-xl outline-none text-xs text-center font-mono"
                            />
                          </div>
                        </div>

                        {/* Title Text Color */}
                        <div className="space-y-2 text-right">
                          <label className="text-xs font-bold text-gray-700 block">لون نص عنوان الصندوق</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={draftHome.tickerTitleTextColor || '#022c22'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, tickerTitleTextColor: e.target.value }))}
                              className="h-10 w-12 border border-gray-200 rounded-lg cursor-pointer bg-white"
                            />
                            <input
                              type="text"
                              value={draftHome.tickerTitleTextColor || '#022c22'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, tickerTitleTextColor: e.target.value }))}
                              className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:bg-white rounded-xl outline-none text-xs text-center font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-50 pt-4">
                      {/* Movement Direction */}
                      <div className="space-y-2 text-right">
                        <label className="text-xs font-bold text-gray-700 block">جهة واتجاه تحرك الشريط</label>
                        <select
                          value={draftHome.tickerDirection || 'rtl'}
                          onChange={(e: any) => setDraftHome(prev => ({ ...prev, tickerDirection: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:bg-white rounded-xl outline-none text-xs text-right font-semibold text-gray-700"
                        >
                          <option value="rtl">من اليمين إلى اليسار (الافتراضي للغة العربية)</option>
                          <option value="ltr">من اليسار إلى اليمين</option>
                        </select>
                        <span className="text-[10px] text-gray-400 block leading-tight">تتوقف حركة الشريط بالكامل وبشكل فوري عند تمرير مؤشر الفأرة فوق أي خبر.</span>
                      </div>

                      {/* News Source Toggle */}
                      <div className="space-y-2 text-right">
                        <label className="text-xs font-bold text-gray-700 block">مصدر الأخبار الرئيسي للشريط</label>
                        <select
                          value={draftHome.tickerSourceFromNewsTab ? 'true' : 'false'}
                          onChange={(e) => {
                            const isNewsSource = e.target.value === 'true';
                            setDraftHome(prev => ({ ...prev, tickerSourceFromNewsTab: isNewsSource }));
                          }}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:bg-white rounded-xl outline-none text-xs text-right font-semibold text-gray-700"
                        >
                          <option value="true">أخذ عناوين الأخبار من صفحة الأخبار الفعلية تلقائياً</option>
                          <option value="false">أخبار وإعلانات مخصصة يكتبها المدير يدوياً أدناه</option>
                        </select>
                        <span className="text-[10px] text-gray-400 block leading-tight">عند تفعيل الأخذ من صفحة الأخبار، يربط الشريط تلقائياً الأخبار بصفحاتها ويفتح تفاصيل الخبر فور الضغط عليه.</span>
                      </div>
                    </div>

                    {/* Custom Items Manager - Only shows when tickerSourceFromNewsTab is false */}
                    {!draftHome.tickerSourceFromNewsTab && (
                      <div className="border border-amber-900/10 rounded-2xl p-4 bg-amber-50/20 space-y-4 text-right">
                        <div className="border-b border-amber-900/5 pb-2">
                          <span className="font-extrabold text-xs text-emerald-950 block">📝 إدارة الأخبار والإعلانات اليدوية المخصصة</span>
                          <span className="text-[10px] text-gray-400 block leading-tight mt-0.5">اكتب عدة إعلانات أو تنويهات لتظهر متتالية في الشريط الإخباري. يمكنك إضافة العدد الذي تريده وحذف أي إعلان بسهولة.</span>
                        </div>

                        {/* List of custom items */}
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {((draftHome.tickerCustomItems) || []).length === 0 ? (
                            <span className="text-xs text-gray-400 block text-center py-4 bg-white rounded-xl border border-dashed border-gray-200">لا توجد أخبار مخصصة مضافة حالياً. اكتب خبراً بالأسفل لإضافته.</span>
                          ) : (
                            ((draftHome.tickerCustomItems) || []).map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100 flex-row-reverse shadow-xs">
                                <span className="text-xs text-gray-700 font-medium text-right leading-tight flex-grow">{item}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDraftHome(prev => {
                                      const items = [...(prev.tickerCustomItems || [])];
                                      items.splice(idx, 1);
                                      return { ...prev, tickerCustomItems: items };
                                    });
                                  }}
                                  className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-all"
                                  title="حذف هذا الخبر"
                                >
                                  ❌
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add new custom item */}
                        <div className="flex gap-2 flex-row-reverse">
                          <input
                            type="text"
                            placeholder="اكتب الخبر أو الإعلان المخصص هنا..."
                            value={newTickerItem}
                            onChange={(e) => setNewTickerItem(e.target.value)}
                            className="flex-grow p-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs text-right"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!newTickerItem.trim()) return;
                              setDraftHome(prev => {
                                const items = [...(prev.tickerCustomItems || [])];
                                return { ...prev, tickerCustomItems: [...items, newTickerItem.trim()] };
                              });
                              setNewTickerItem("");
                            }}
                            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shrink-0"
                          >
                            ➕ إضافة للشريط
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* Section 7: Visitor Counter Settings */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/20">
                <button
                  type="button"
                  onClick={() => setExpandedHomeSection(expandedHomeSection === 'visitor_counter' ? '' : 'visitor_counter')}
                  className="w-full p-4 bg-emerald-50 hover:bg-emerald-100/70 transition-all text-right font-bold text-emerald-950 flex items-center justify-between flex-row-reverse"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg text-xs font-mono">٧</span>
                    <span>إعدادات عداد الزوار ومكان عرضه في الصفحة الرئيسية (Visitor Counter)</span>
                  </div>
                  <span>{expandedHomeSection === 'visitor_counter' ? '▲' : '▼'}</span>
                </button>
                {expandedHomeSection === 'visitor_counter' && (
                  <div className="p-6 bg-white space-y-6 border-t border-gray-100 text-right">
                    <div className="flex flex-col sm:flex-row-reverse justify-between items-start sm:items-center gap-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50">
                      <div className="space-y-1 text-right">
                        <span className="font-bold text-sm text-emerald-950 block">تفعيل عداد الزوار في الصفحة الرئيسية</span>
                        <span className="text-xs text-gray-400">إظهار أو إخفاء العداد العام لزوار المنصة بالكامل</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={draftHome.visitorCountEnabled !== false}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, visitorCountEnabled: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Position selection */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">مكان عرض عداد الزوار في الصفحة الرئيسية *</label>
                        <select
                          value={draftHome.visitorCounterPosition || 'below_gallery'}
                          onChange={(e: any) => setDraftHome(prev => ({ ...prev, visitorCounterPosition: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        >
                          <option value="below_gallery">تحت ألبوم صور أهالي قارة (الموقع الافتراضي المطلوب)</option>
                          <option value="below_hero">تحت بنر البداية والبطاقات الرقمية</option>
                          <option value="above_footer">في أسفل الصفحة الرئيسية (قبل التذييل مباشرة)</option>
                          <option value="navbar_top_left">البنر العلوي للتبويبات (أعلى اليسار بجانب أرقام الطوارئ والدليل)</option>
                        </select>
                        <p className="text-[10px] text-gray-400">تحكم بالتموضع ليتوافق مع تفضيلات التصميم والوضوح البصري.</p>
                      </div>

                      {/* Initial count value */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">القيمة الحالية/البدئية لعداد الزوار</label>
                        <input
                          type="number"
                          value={draftHome.visitorCount ?? 14582}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, visitorCount: parseInt(e.target.value, 10) || 0 }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-mono"
                          placeholder="مثال: 14582"
                        />
                        <p className="text-[10px] text-gray-400">تعديل هذا الرقم يغير رصيد قراءات الزيارات مباشرة لتبدأ منها قراءة العداد.</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 block">العنوان المرافق لبطاقة العداد</label>
                      <input
                        type="text"
                        required
                        value={draftHome.visitorCounterTitle || 'إجمالي زوار بوابة قارة الإلكترونية'}
                        onChange={(e) => setDraftHome(prev => ({ ...prev, visitorCounterTitle: e.target.value }))}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        placeholder="مثال: إجمالي زوار البوابة الإلكترونية لبلدة قارة"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Background Color */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 block">لون خلفية بطاقة العداد</label>
                        <div className="flex gap-2 flex-row-reverse">
                          <input
                            type="color"
                            value={draftHome.visitorCounterBg || '#064e3b'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, visitorCounterBg: e.target.value }))}
                            className="w-12 h-10 border border-gray-200 rounded-xl outline-none cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={draftHome.visitorCounterBg || '#064e3b'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, visitorCounterBg: e.target.value }))}
                            className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                          />
                        </div>
                      </div>

                      {/* Digits Color */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 block">لون الأرقام النشطة</label>
                        <div className="flex gap-2 flex-row-reverse">
                          <input
                            type="color"
                            value={draftHome.visitorCounterColor || '#fbbf24'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, visitorCounterColor: e.target.value }))}
                            className="w-12 h-10 border border-gray-200 rounded-xl outline-none cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={draftHome.visitorCounterColor || '#fbbf24'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, visitorCounterColor: e.target.value }))}
                            className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 8: Aesthetic and Spacing Styling */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                <button
                  type="button"
                  onClick={() => setExpandedHomeSection(expandedHomeSection === 'aesthetic_styling' ? '' : 'aesthetic_styling')}
                  className="w-full p-4 bg-emerald-50 hover:bg-emerald-100/70 transition-all text-right font-bold text-emerald-950 flex items-center justify-between flex-row-reverse"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg text-xs font-mono">٨</span>
                    <span>التحكم في المظهر الجمالي وتنسيق مسميات الصفحات وتبويبات البنر والتباعد</span>
                  </div>
                  <span>{expandedHomeSection === 'aesthetic_styling' ? '▲' : '▼'}</span>
                </button>
                {expandedHomeSection === 'aesthetic_styling' && (
                  <div className="p-6 bg-white space-y-6 border-t border-gray-100 text-right">
                    
                    {/* Spacing and Alignment Header */}
                    <div className="border-b border-gray-100 pb-3">
                      <span className="font-extrabold text-sm text-emerald-950 block">١. تباعد أقسام الصفحة الرئيسية (Section Spacing)</span>
                      <span className="text-xs text-gray-400">تقليل أو زيادة المسافات العمودية الفاصلة بين الأقسام المختلفة في الصفحة الرئيسية لتقليل الفراغات الكبيرة</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">تباعد الأقسام العمودي (Padding/Spacing)</label>
                        <select
                          value={draftHome.sectionSpacing || 'medium'}
                          onChange={(e: any) => setDraftHome(prev => ({ ...prev, sectionSpacing: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        >
                          <option value="small">متقارب ومدمج (تقليل المسافات بنسبة ٣٠٪ - رغبة المستخدم)</option>
                          <option value="medium">طبيعي معتدل (المسافات القياسية للبوابة)</option>
                          <option value="large">متباعد مريح (مسافات فارغة واسعة)</option>
                        </select>
                        <p className="text-[10px] text-gray-400">سيتم تطبيق هذا التباعد تلقائياً على الفواصل بين أقسام الصفحة الرئيسية.</p>
                      </div>
                    </div>

                    {/* Navigation Bar Tabs Customization */}
                    <div className="border-b border-gray-100 pt-4 pb-3">
                      <span className="font-extrabold text-sm text-emerald-950 block">٢. شكل وتنسيق أزرار تبويبات البنر العلوي (Navigation Tabs Style)</span>
                      <span className="text-xs text-gray-400">تخصيص شكل وحجم أزرار التبويبات بالبنر العلوي في الموقع بالكامل لتبدو بسطر واحد جذابة ومنسقة</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">نمط وتصميم الأزرار بالبنر العلوي</label>
                        <select
                          value={draftHome.tabStyle || 'pill'}
                          onChange={(e: any) => setDraftHome(prev => ({ ...prev, tabStyle: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        >
                          <option value="pill">أزرار كبسولة دائرية (Pill Tabs)</option>
                          <option value="classic">كلاسيكي ناعم مع خط سفلي للتبويب النشط (Underlined)</option>
                          <option value="glass">تأثير زجاجي مع إطار شبه شفاف (Glassmorphism)</option>
                          <option value="bordered">أزرار بإطار ملون واضح (Bordered Outline)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">حجم خط التبويبات بالبكسل</label>
                        <select
                          value={draftHome.tabFontSize || '16'}
                          onChange={(e: any) => setDraftHome(prev => ({ ...prev, tabFontSize: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-mono"
                        >
                          <option value="14">14px (صغير وناعم)</option>
                          <option value="15">15px (أنيق)</option>
                          <option value="16">16px (الافتراضي)</option>
                          <option value="17">17px (كبير قليلاً)</option>
                          <option value="18">18px (واضح وجريء)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Active Tab Text Color */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 block">لون نص التبويب النشط</label>
                        <div className="flex gap-2 flex-row-reverse">
                          <input
                            type="color"
                            value={draftHome.tabColorActive || '#064e3b'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, tabColorActive: e.target.value }))}
                            className="w-12 h-10 border border-gray-200 rounded-xl outline-none cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={draftHome.tabColorActive || '#064e3b'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, tabColorActive: e.target.value }))}
                            className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                          />
                        </div>
                      </div>

                      {/* Active Tab Background Color */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 block">لون خلفية التبويب النشط (للأزرار الدائرية)</label>
                        <div className="flex gap-2 flex-row-reverse">
                          <input
                            type="color"
                            value={draftHome.tabBgActive || '#f0fdf4'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, tabBgActive: e.target.value }))}
                            className="w-12 h-10 border border-gray-200 rounded-xl outline-none cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={draftHome.tabBgActive || '#f0fdf4'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, tabBgActive: e.target.value }))}
                            className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                          />
                        </div>
                      </div>

                      {/* Inactive Tab Text Color */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 block">لون نصوص التبويبات غير النشطة</label>
                        <div className="flex gap-2 flex-row-reverse">
                          <input
                            type="color"
                            value={draftHome.tabColorInactive || '#4b5563'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, tabColorInactive: e.target.value }))}
                            className="w-12 h-10 border border-gray-200 rounded-xl outline-none cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={draftHome.tabColorInactive || '#4b5563'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, tabColorInactive: e.target.value }))}
                            className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tab Hover Effect Models Selector */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between flex-row-reverse">
                        <span className="text-xs font-bold text-emerald-950 block">✨ نماذج تفاعل أزرار التبويبات عند الوقوف بالأشيرة (Hover Effects):</span>
                        <span className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-sans font-bold">تفاعل حركي انسيابي</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-sans leading-relaxed">
                        اختر التأثير البصري المفضل عند وقوف زائر الموقع على أي اسم صفحة أو تبويب في شريط العنوان العلوي:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          {
                            id: 'lift_up',
                            title: 'تفاعل الارتفاع للأعلى (Lift Up)',
                            desc: 'ترتفع اسم الصفحة بسلاسة للأعلى مع إلقاء ظل خفيف عند الوقوف عليها.',
                            previewClass: 'hover:-translate-y-1 hover:shadow-md'
                          },
                          {
                            id: 'lift_glow',
                            title: 'ارتفاع مع وهج إشعاعي ذهبي (Lift & Glow)',
                            desc: 'ترتفع الصفحة للأعلى مع ظهور هالة ضوئية ذهبية متوهجة حول الزر.',
                            previewClass: 'hover:-translate-y-1.5 hover:shadow-lg hover:shadow-amber-500/30 hover:border-amber-400/60'
                          },
                          {
                            id: 'scale_bounce',
                            title: 'تكبير حركي مرن (Scale Bounce)',
                            desc: 'يتوسع حجم الزر بشكل ناعم ومرن لإبراز اسم التبويب المستهدف.',
                            previewClass: 'hover:scale-105'
                          },
                          {
                            id: 'underline_slide',
                            title: 'انزلاق خط سفلي متوهج (Underline Slide)',
                            desc: 'ينساب خط ملون أنيق أسفل نص التبويب يمتد بسلاسة من المنتصف.',
                            previewClass: 'after:content-[\'\'] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-emerald-600 hover:after:w-3/4'
                          },
                          {
                            id: '3d_flip',
                            title: 'إمالة ثلاثية الأبعاد تفاعلية (3D Tilt & Scale)',
                            desc: 'يميل الزر بدرجة طفيفة مع ارتضاع بصري جذّاب ثلاثي الأبعاد.',
                            previewClass: 'hover:-translate-y-1 hover:-rotate-1 hover:scale-105'
                          },
                          {
                            id: 'none',
                            title: 'مظهر ثابت هادئ (Classic)',
                            desc: 'تغير ناعم في الشفافية بدون حركة ارتفاع أو تكبير.',
                            previewClass: 'hover:opacity-80'
                          }
                        ].map((model) => {
                          const isSelected = (draftHome.tabHoverEffect || 'lift_up') === model.id;
                          return (
                            <button
                              key={model.id}
                              type="button"
                              onClick={() => setDraftHome(prev => ({ ...prev, tabHoverEffect: model.id as any }))}
                              className={`p-3.5 rounded-2xl border-2 text-right transition-all cursor-pointer flex flex-col justify-between gap-2 group relative overflow-hidden ${
                                isSelected
                                  ? 'bg-emerald-50/70 border-emerald-800 ring-4 ring-emerald-800/10 shadow-sm'
                                  : 'bg-white border-gray-200 hover:border-emerald-600 text-gray-700'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full flex-row-reverse">
                                <span className={`text-xs font-bold font-sans ${isSelected ? 'text-emerald-950' : 'text-gray-900'}`}>
                                  {model.title}
                                </span>
                                {isSelected && <Check className="h-4 w-4 text-emerald-800 shrink-0" />}
                              </div>
                              <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
                                {model.desc}
                              </p>
                              
                              {/* Demo Preview */}
                              <div className="mt-2 p-2 bg-gray-50 rounded-xl flex items-center justify-center text-center border border-gray-100">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold text-emerald-900 bg-white border border-gray-200 transition-all duration-300 relative ${model.previewClass}`}>
                                  تجربة الوقوف بالأشيرة 🖱️
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Page Titles Header Customization */}
                    <div className="border-b border-gray-100 pt-4 pb-3">
                      <span className="font-extrabold text-sm text-emerald-950 block">٣. تنسيق مسميات وعناوين الصفحات (Page Titles Customization)</span>
                      <span className="text-xs text-gray-400">تغيير شكل وطريقة ظهور عناوين التبويبات والصفحات (أخبار، خدمات، مشاريع، معرض الصور) لتعطي مظهراً سياحياً وتراثياً جذاباً</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">شكل وإطار عنوان الصفحة الرئيسي</label>
                        <select
                          value={draftHome.pageHeaderStyle || 'bottom_line'}
                          onChange={(e: any) => setDraftHome(prev => ({ ...prev, pageHeaderStyle: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        >
                          <option value="simple">بسيط وناعم بدون إطار</option>
                          <option value="bottom_line">خط سفلي ذهبي عريض ومصمم (المقترح)</option>
                          <option value="side_border">حافة ملوّنة أنيقة على اليمين</option>
                          <option value="box_card">لوحة ملوّنة أنيقة بالكامل (Box Card)</option>
                          <option value="ornamented">زخرفة دمشقية شرقية عريقة (قلمونية تراثية)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">محاذاة عناوين الصفحات</label>
                        <select
                          value={draftHome.pageHeaderAlignment || 'center'}
                          onChange={(e: any) => setDraftHome(prev => ({ ...prev, pageHeaderAlignment: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        >
                          <option value="center">محاذاة وتوسيط بالمنتصف (مركزية)</option>
                          <option value="right">محاذاة لليمين (محليّ تقليدي)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">مقاس وحجم خط العناوين</label>
                        <select
                          value={draftHome.pageHeaderFontSize || 'base'}
                          onChange={(e: any) => setDraftHome(prev => ({ ...prev, pageHeaderFontSize: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        >
                          <option value="small">صغير وناعم (Compact)</option>
                          <option value="base">حجم طبيعي معتدل (الافتراضي)</option>
                          <option value="large">ضخم وعريض لجذب الانتباه (Bold Display)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Page Header Text Color */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 block">لون العنوان الرئيسي والزخرفة</label>
                        <div className="flex gap-2 flex-row-reverse">
                          <input
                            type="color"
                            value={draftHome.pageHeaderTextColor || '#064e3b'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, pageHeaderTextColor: e.target.value }))}
                            className="w-12 h-10 border border-gray-200 rounded-xl outline-none cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={draftHome.pageHeaderTextColor || '#064e3b'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, pageHeaderTextColor: e.target.value }))}
                            className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                          />
                        </div>
                      </div>

                      {/* Page Header Badge Bg */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 block">لون خلفية بطاقة التصنيف (Badge Bg)</label>
                        <div className="flex gap-2 flex-row-reverse">
                          <input
                            type="color"
                            value={draftHome.pageHeaderBadgeBg || '#fef3c7'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, pageHeaderBadgeBg: e.target.value }))}
                            className="w-12 h-10 border border-gray-200 rounded-xl outline-none cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={draftHome.pageHeaderBadgeBg || '#fef3c7'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, pageHeaderBadgeBg: e.target.value }))}
                            className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                          />
                        </div>
                      </div>

                      {/* Page Header Badge Text Color */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 block">لون نص بطاقة التصنيف (Badge Text)</label>
                        <div className="flex gap-2 flex-row-reverse">
                          <input
                            type="color"
                            value={draftHome.pageHeaderBadgeColor || '#78350f'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, pageHeaderBadgeColor: e.target.value }))}
                            className="w-12 h-10 border border-gray-200 rounded-xl outline-none cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={draftHome.pageHeaderBadgeColor || '#78350f'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, pageHeaderBadgeColor: e.target.value }))}
                            className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Font Family Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">نوع خط مسميات وعناوين الصفحات</label>
                        <select
                          value={draftHome.pageHeaderFontFamily || 'Cairo'}
                          onChange={(e: any) => setDraftHome(prev => ({ ...prev, pageHeaderFontFamily: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                        >
                          <option value="Cairo">خط القاهرة الحديث (Cairo)</option>
                          <option value="Tajawal">خط تاجوال المعاصر (Tajawal)</option>
                          <option value="Almarai">خط المراعي الأنيق (Almarai)</option>
                          <option value="Amiri">خط الأميري التراثي الفاخر (Amiri)</option>
                          <option value="Lalezar">خط لاليزار الصحفي العريض (Lalezar)</option>
                        </select>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* SECTION 9: FOOTER & BOTTOM BANNER CUSTOMIZATION */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpandedHomeSection(expandedHomeSection === 'footer_settings' ? '' : 'footer_settings')}
                  className="w-full p-4 bg-emerald-50 hover:bg-emerald-100/70 transition-all text-right font-bold text-emerald-950 flex items-center justify-between flex-row-reverse"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg text-xs font-mono">٩</span>
                    <span>التحكم وتخصيص البانر السفلي (تذييل البوابة والشعار المائي)</span>
                  </div>
                  <span>{expandedHomeSection === 'footer_settings' ? '▲' : '▼'}</span>
                </button>
                {expandedHomeSection === 'footer_settings' && (
                  <div className="p-6 bg-white space-y-6 border-t border-gray-100 text-right">
                    
                    {/* Part 1: Text Customization */}
                    <div className="border-b border-gray-100 pb-3">
                      <span className="font-extrabold text-sm text-emerald-950 block">١. النصوص والعناوين للبانر السفلي</span>
                      <span className="text-xs text-gray-400">تعديل محتويات النصوص وعناوين التعريف المعروضة في الجزء السفلي للبوابة</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">العنوان الرئيسي/اسم الجهة</label>
                        <input
                          type="text"
                          value={draftHome.footerAboutTitle || ''}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, footerAboutTitle: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                          placeholder="مثال: مجلس مدينة قارة السورية"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">العنوان الجغرافي والمبنى</label>
                        <input
                          type="text"
                          value={draftHome.footerAddress || ''}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, footerAddress: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                          placeholder="مثال: مبنى مجلس المدينة - الساحة العامة - قارة"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 block">الوصف والنبذة التعريفية</label>
                      <textarea
                        value={draftHome.footerAboutText || ''}
                        onChange={(e) => setDraftHome(prev => ({ ...prev, footerAboutText: e.target.value }))}
                        rows={3}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right leading-relaxed"
                        placeholder="أدخل وصفاً تعريفياً مختصراً عن بوابة بلدة قارة وخدماتها الرقمية..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">أوقات العمل الرسمي والدوام</label>
                        <input
                          type="text"
                          value={draftHome.footerWorkingHours || ''}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, footerWorkingHours: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                          placeholder="مثال: دوام مجلس المدينة: 8:00 ص - 3:00 م"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">نص الترحيب السفلي (Made with Love)</label>
                        <input
                          type="text"
                          value={draftHome.footerMadeWithLoveText || ''}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, footerMadeWithLoveText: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                          placeholder="مثال: صُنع بحب لأهالي مدينة قارة العريقة"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">نص حقوق الملكية (Copyright)</label>
                        <input
                          type="text"
                          value={draftHome.footerCopyrightText || ''}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, footerCopyrightText: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                          placeholder="مثال: بوابة مدينة قارة الإلكترونية - التنمية المحلية"
                        />
                      </div>
                    </div>

                    {/* Part 2: Contact Info */}
                    <div className="border-b border-gray-100 pt-4 pb-3">
                      <span className="font-extrabold text-sm text-emerald-950 block">٢. أرقام الاتصال وعناوين الدعم الفني</span>
                      <span className="text-xs text-gray-400">تحديث هاتف وإيميل تواصل البانر السفلي</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">رقم الهاتف الرسمي</label>
                        <input
                          type="text"
                          value={draftHome.footerPhone || ''}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, footerPhone: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-mono"
                          placeholder="+963 (11) 781-2345"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">البريد الإلكتروني للبلدة</label>
                        <input
                          type="text"
                          value={draftHome.footerEmail || ''}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, footerEmail: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-mono"
                          placeholder="info@qara-city.gov.sy"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 block">الرمز البريدي</label>
                        <input
                          type="text"
                          value={draftHome.footerZipCode || ''}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, footerZipCode: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-mono"
                          placeholder="625129"
                        />
                      </div>
                    </div>

                    {/* Part 3: Styling, Colors, and Alignment */}
                    <div className="border-b border-gray-100 pt-4 pb-3">
                      <span className="font-extrabold text-sm text-emerald-950 block">٣. المظهر والألوان ومحاذاة البانر السفلي</span>
                      <span className="text-xs text-gray-400">التحكم بالألوان وتوجيه النصوص ومحاذاة العناصر كلياً لتتناسب مع الرؤية البصرية</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      
                      <div className="space-y-1 md:col-span-1">
                        <label className="text-xs font-semibold text-gray-700 block">محاذاة نصوص وعناوين البانر</label>
                        <select
                          value={draftHome.footerAlignment || 'right'}
                          onChange={(e: any) => setDraftHome(prev => ({ ...prev, footerAlignment: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                        >
                          <option value="right">محاذاة لليمين (الافتراضي للأبجدية العربية)</option>
                          <option value="center">توسيط كافة العناصر بالمنتصف (Center)</option>
                          <option value="left">محاذاة لليسار (Left-aligned)</option>
                        </select>
                      </div>

                      {/* Footer Bg Color */}
                      <div className="space-y-2 md:col-span-1">
                        <label className="text-xs font-semibold text-gray-700 block">لون خلفية البانر السفلي</label>
                        <div className="flex gap-2 flex-row-reverse">
                          <input
                            type="color"
                            value={draftHome.footerBgColor || '#022c22'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, footerBgColor: e.target.value }))}
                            className="w-10 h-9 border border-gray-200 rounded-xl outline-none cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={draftHome.footerBgColor || '#022c22'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, footerBgColor: e.target.value }))}
                            className="flex-grow p-1.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                          />
                        </div>
                      </div>

                      {/* Footer Text Color */}
                      <div className="space-y-2 md:col-span-1">
                        <label className="text-xs font-semibold text-gray-700 block">لون نصوص البانر</label>
                        <div className="flex gap-2 flex-row-reverse">
                          <input
                            type="color"
                            value={draftHome.footerTextColor || '#ecfdf5'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, footerTextColor: e.target.value }))}
                            className="w-10 h-9 border border-gray-200 rounded-xl outline-none cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={draftHome.footerTextColor || '#ecfdf5'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, footerTextColor: e.target.value }))}
                            className="flex-grow p-1.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                          />
                        </div>
                      </div>

                      {/* Footer Accent/Border Color */}
                      <div className="space-y-2 md:col-span-1">
                        <label className="text-xs font-semibold text-gray-700 block">لون الزخرفة والأيقونات</label>
                        <div className="flex gap-2 flex-row-reverse">
                          <input
                            type="color"
                            value={draftHome.footerAccentColor || '#d97706'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, footerAccentColor: e.target.value }))}
                            className="w-10 h-9 border border-gray-200 rounded-xl outline-none cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={draftHome.footerAccentColor || '#d97706'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, footerAccentColor: e.target.value }))}
                            className="flex-grow p-1.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-mono text-center"
                          />
                        </div>
                      </div>

                    </div>

                    {/* Part 4: Watermark Logo Customization */}
                    <div className="border-b border-gray-100 pt-4 pb-3">
                      <span className="font-extrabold text-sm text-emerald-950 block">٤. الشعار المائي للبانر السفلي (Background Watermark)</span>
                      <span className="text-xs text-gray-400">إضافة علامة مائية لبلدة قارة في منتصف خلفية البانر للتحكم بدرجة تكرارها وشفافيتها وميلانها</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="space-y-3">
                        <label className="text-xs font-semibold text-gray-700 block">شعار البانر السفلي (العلامة المائية)</label>
                        
                        <div className="flex flex-wrap gap-2 items-center flex-row-reverse">
                          <button
                            type="button"
                            onClick={() => document.getElementById('footer-watermark-upload')?.click()}
                            className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            <span>تحميل من جهازك</span>
                          </button>
                          <input
                            type="file"
                            id="footer-watermark-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleLogoFile(e.target.files[0], 'footerWatermarkLogo');
                              }
                            }}
                          />
                          
                          {draftHome.footerWatermarkLogo ? (
                            <button
                              type="button"
                              onClick={() => setDraftHome(prev => ({ ...prev, footerWatermarkLogo: '' }))}
                              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                            >
                              إزالة الشعار
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => {
                              setDraftHome(prev => ({
                                ...prev,
                                footerWatermarkLogo: "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?auto=format&fit=crop&w=300&q=80"
                              }));
                            }}
                            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                          >
                            شعار تجريبي
                          </button>
                        </div>

                        {/* Image Preview if available */}
                        {draftHome.footerWatermarkLogo && (
                          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100 w-full flex-row-reverse">
                            <img 
                              src={draftHome.footerWatermarkLogo} 
                              alt="Watermark preview" 
                              className="h-10 w-10 object-contain rounded bg-emerald-950/25 p-1 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="text-right overflow-hidden flex-grow">
                              <span className="text-[10px] font-bold text-gray-500 block">معاينة الشعار المائي الحالي</span>
                              <span className="text-[9px] text-gray-400 font-mono truncate block" dir="ltr">
                                {draftHome.footerWatermarkLogo.startsWith('data:') ? 'صورة محملة محلياً (Base64)' : draftHome.footerWatermarkLogo}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1 pt-1">
                          <label className="text-[10px] font-semibold text-gray-500 block">أو أدخل رابط الصورة المباشر (URL)</label>
                          <input
                            type="text"
                            value={draftHome.footerWatermarkLogo || ''}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, footerWatermarkLogo: e.target.value }))}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-left font-mono"
                            placeholder="https://example.com/logo.png"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-700 block">نمط ظهور وتكرار الشعار المائي</label>
                          <select
                            value={draftHome.footerWatermarkRepeat || 'no-repeat'}
                            onChange={(e: any) => setDraftHome(prev => ({ ...prev, footerWatermarkRepeat: e.target.value }))}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                          >
                            <option value="no-repeat">شعار واحد بالمنتصف تماماً (علامة رئيسية عريقة)</option>
                            <option value="repeat">تكرار الشعار عدة مرات (نقش مكرر على كامل الخلفية)</option>
                          </select>
                        </div>

                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          يمكنك تحميل صورة شعار من حاسوبك (مثل شعار مجلس بلدة قارة أو أي نقش تراثي عريق)، أو استخدام روابط مباشرة. الشعار المائي سيظهر في خلفية البانر السفلي بدرجة الشفافية والتناوب التي تحددها في الخيارات بالأسفل.
                        </p>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      
                      {/* Opacity Control */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center flex-row-reverse">
                          <label className="text-xs font-semibold text-gray-700 block">درجة شفافية الشعار المائي</label>
                          <span className="text-xs font-bold text-emerald-900 font-mono">
                            {Math.round((draftHome.footerWatermarkOpacity !== undefined ? draftHome.footerWatermarkOpacity : 0.15) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={Math.round((draftHome.footerWatermarkOpacity !== undefined ? draftHome.footerWatermarkOpacity : 0.15) * 100)}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) / 100;
                            setDraftHome(prev => ({ ...prev, footerWatermarkOpacity: val }));
                          }}
                          className="w-full accent-emerald-800 cursor-pointer"
                        />
                        <span className="text-[9px] text-gray-400 block text-right">القيم المنخفضة (5% - 20%) تضمن عدم تأثير العلامة المائية على مقروئية النصوص.</span>
                      </div>

                      {/* Rotate/Tilt Control */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center flex-row-reverse">
                          <label className="text-xs font-semibold text-gray-700 block">زاوية تدوير وإمالة الشعار</label>
                          <span className="text-xs font-bold text-emerald-900 font-mono">
                            {draftHome.footerWatermarkRotate !== undefined ? draftHome.footerWatermarkRotate : -15}°
                          </span>
                        </div>
                        <div className="flex gap-2 items-center flex-row-reverse">
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={draftHome.footerWatermarkRotate !== undefined ? draftHome.footerWatermarkRotate : -15}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              setDraftHome(prev => ({ ...prev, footerWatermarkRotate: val }));
                            }}
                            className="flex-grow accent-emerald-800 cursor-pointer"
                          />
                        </div>
                        <span className="text-[9px] text-gray-400 block text-right">أدر لليمين (قيم موجبة) أو اليسار (قيم سالبة) بمقدار محدد لإعطاء لمسة فنية.</span>
                      </div>

                      {/* Logo Width Control */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center flex-row-reverse">
                          <label className="text-xs font-semibold text-gray-700 block">عرض وحجم الشعار بالبكسل</label>
                          <span className="text-xs font-bold text-emerald-900 font-mono">
                            {draftHome.footerWatermarkWidth || 150}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="400"
                          value={draftHome.footerWatermarkWidth || 150}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setDraftHome(prev => ({ ...prev, footerWatermarkWidth: val }));
                          }}
                          className="w-full accent-emerald-800 cursor-pointer"
                        />
                        <span className="text-[9px] text-gray-400 block text-right">تحكّم بالحجم الظاهري لتوسيط مثالي يتناسب مع دقة الصورة.</span>
                      </div>

                    </div>

                    {/* Advanced Watermark Position & Offset Controls */}
                    <div className="border-t border-gray-100 mt-6 pt-4">
                      <span className="font-bold text-xs text-emerald-900 block mb-3 text-right">⚙️ خيارات التموضع والإزاحة الدقيقة للشعار المائي</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Watermark Base Position Selector */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-700 block text-right">محاذاة الشعار المائي الرئيسية</label>
                          <select
                            value={draftHome.footerWatermarkPosition || 'center'}
                            onChange={(e: any) => setDraftHome(prev => ({ ...prev, footerWatermarkPosition: e.target.value }))}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                          >
                            <option value="center">بالمنتصف تماماً</option>
                            <option value="right">بجهة اليمين (خلف النبذة التعريفية)</option>
                            <option value="left">بجهة اليسار (خلف تواصل معنا والروابط)</option>
                          </select>
                        </div>

                        {/* Watermark X Offset */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center flex-row-reverse">
                            <label className="text-xs font-semibold text-gray-700 block">الإزاحة الأفقية المخصصة (X-Offset)</label>
                            <span className="text-xs font-bold text-emerald-900 font-mono">
                              {draftHome.footerWatermarkX !== undefined ? draftHome.footerWatermarkX : 0}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-400"
                            max="400"
                            value={draftHome.footerWatermarkX !== undefined ? draftHome.footerWatermarkX : 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              setDraftHome(prev => ({ ...prev, footerWatermarkX: val }));
                            }}
                            className="w-full accent-emerald-800 cursor-pointer"
                          />
                          <span className="text-[9px] text-gray-400 block text-right">موجب يزيح الشعار لليسار، سالب يزيحه لليمين.</span>
                        </div>

                        {/* Watermark Y Offset */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center flex-row-reverse">
                            <label className="text-xs font-semibold text-gray-700 block">الإزاحة العمودية المخصصة (Y-Offset)</label>
                            <span className="text-xs font-bold text-emerald-900 font-mono">
                              {draftHome.footerWatermarkY !== undefined ? draftHome.footerWatermarkY : 0}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-200"
                            max="200"
                            value={draftHome.footerWatermarkY !== undefined ? draftHome.footerWatermarkY : 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              setDraftHome(prev => ({ ...prev, footerWatermarkY: val }));
                            }}
                            className="w-full accent-emerald-800 cursor-pointer"
                          />
                          <span className="text-[9px] text-gray-400 block text-right">موجب يزيح لأسفل، سالب يزيح لأعلى.</span>
                        </div>

                      </div>
                    </div>

                    {/* Columns Shift and Layout Section */}
                    <div className="border-t border-gray-100 mt-6 pt-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-right">
                      <span className="font-extrabold text-sm text-emerald-950 block mb-1">↔️ التحكم بإزاحة وتوزيع أعمدة البانر (الروابط والتواصل)</span>
                      <span className="text-xs text-gray-500 block mb-4">اضبط المساحات الفارغة وأزح أعمدة الروابط والمعلومات لليسار لتجنب تغطية شعار البانر والتحكم بالتصميم المثالي</span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Layout Mode Selector */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-700 block">نمط توزيع أعمدة البانر الافتراضي</label>
                          <select
                            value={draftHome.footerColumnsLayout || 'default'}
                            onChange={(e: any) => setDraftHome(prev => ({ ...prev, footerColumnsLayout: e.target.value }))}
                            className="w-full p-2.5 bg-white border border-gray-200 focus:border-emerald-700 rounded-xl outline-none text-xs text-right"
                          >
                            <option value="default">الافتراضي (توزيع متساوي على كامل البانر)</option>
                            <option value="left_shifted">تفريغ المنتصف للشعار (إزاحة الأعمدة تلقائياً لليسار وترك فراغ أوسط)</option>
                            <option value="wide_spaced">تباعد واسع جداً للأعمدة (تباعد موسع لأطراف البانر)</option>
                          </select>
                          <span className="text-[10px] text-gray-400 block">حدد خيار "تفريغ المنتصف" للحصول تلقائياً على مساحة فارغة لعرض الشعار بشكل كامل بالوسط.</span>
                        </div>

                        {/* Custom Offset Slider */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center flex-row-reverse">
                            <label className="text-xs font-bold text-gray-700 block">إزاحة الروابط والتواصل لليسار يدوياً</label>
                            <span className="text-xs font-bold text-emerald-950 font-mono">
                              {draftHome.footerLinksContactShift || 0}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="350"
                            value={draftHome.footerLinksContactShift || 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              setDraftHome(prev => ({ ...prev, footerLinksContactShift: val }));
                            }}
                            className="w-full accent-emerald-800 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-gray-400 flex-row-reverse">
                            <span>إزاحة قصوى (350 بكسل)</span>
                            <span>دون إزاحة (0)</span>
                          </div>
                          <span className="text-[10px] text-gray-400 block leading-tight">اسحب الشريط لليسار لتحريك أعمدة "الروابط السريعة" و "تواصل معنا" نحو اليسار بحرية وبالمقدار الدقيق الذي يناسب حجم الشعار.</span>
                        </div>

                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* SECTION 10: SIDE BANNERS (RIGHT & LEFT) */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpandedHomeSection(expandedHomeSection === 'side_banners' ? '' : 'side_banners')}
                  className="w-full p-4 bg-emerald-50 hover:bg-emerald-100/70 transition-all text-right font-bold text-emerald-950 flex items-center justify-between flex-row-reverse"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg text-xs font-mono">١٠</span>
                    <span>البنارات الجانبية للصفحة الرئيسية (يمين ويسار)</span>
                  </div>
                  <span>{expandedHomeSection === 'side_banners' ? '▲' : '▼'}</span>
                </button>
                {expandedHomeSection === 'side_banners' && (
                  <div className="p-6 bg-white space-y-6 border-t border-gray-100 text-right" dir="rtl">
                    
                    {/* Master Toggle */}
                    <div className="flex items-center justify-between p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                      <div>
                        <span className="font-extrabold text-sm text-emerald-950 block">تفعيل إظهار البنارات الجانبية بالصفحة الرئيسية</span>
                        <span className="text-xs text-gray-500 block mt-0.5">عند تفعيل هذا الخيار، تظهر البنارات الجانبية المفعّلة على يمين ويسار الصفحة الرئيسية بتنسيق جذاب ومحاذي للمحتوى</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={draftHome.sideBannersEnabled !== false}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, sideBannersEnabled: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
                      </label>
                    </div>

                    {/* Add New Side Banner Button */}
                    <div className="flex items-center justify-between pt-2">
                      <h4 className="font-bold text-sm text-emerald-950">قائمة البنارات الجانبية المخصصة:</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newBanner: SideBanner = {
                            id: 'banner-' + Date.now(),
                            title: 'بنار جانبي جديد',
                            content: 'اكتب محتوى البنار الجانبي هنا...',
                            position: 'right',
                            enabled: true,
                            bgColor: '#064e3b',
                            textColor: '#ffffff',
                            buttonLabel: 'الانتقال للقسم',
                            buttonLinkTab: 'services'
                          };
                          const updated = [...(draftHome.sideBanners || []), newBanner];
                          setDraftHome(prev => ({ ...prev, sideBanners: updated }));
                          triggerNotification('تمت إضافة بنار جانبي جديد! قم بتنسيقه وحفظ التعديلات.');
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                      >
                        <Plus className="h-4 w-4" />
                        <span>إضافة بنار جانبي جديد</span>
                      </button>
                    </div>

                    {/* List of Side Banners */}
                    <div className="space-y-4">
                      {(!draftHome.sideBanners || draftHome.sideBanners.length === 0) ? (
                        <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-xs text-gray-500">
                          لا توجد بنارات جانبية حالياً. انقر على زر "إضافة بنار جانبي جديد" بالأعلى لإضافة أول بنار.
                        </div>
                      ) : (
                        draftHome.sideBanners.map((banner, idx) => (
                          <div key={banner.id || idx} className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                            
                            {/* Card Header & Controls */}
                            <div className="flex items-center justify-between border-b border-gray-200 pb-3 flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white ${banner.position === 'right' ? 'bg-amber-600' : 'bg-emerald-800'}`}>
                                  {banner.position === 'right' ? 'يمين الصفحة ➡️' : 'يسار الصفحة ⬅️'}
                                </span>
                                <span className="font-extrabold text-xs text-emerald-950">{banner.title || 'بنار بدون عنوان'}</span>
                              </div>

                              <div className="flex items-center gap-3">
                                {/* Enable / Disable toggle */}
                                <label className="flex items-center gap-1.5 text-xs text-gray-700 font-bold cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={banner.enabled}
                                    onChange={(e) => {
                                      const updated = [...(draftHome.sideBanners || [])];
                                      updated[idx] = { ...updated[idx], enabled: e.target.checked };
                                      setDraftHome(prev => ({ ...prev, sideBanners: updated }));
                                    }}
                                    className="rounded text-emerald-800 focus:ring-emerald-700"
                                  />
                                  <span>مفعّل</span>
                                </label>

                                {/* Delete button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (draftHome.sideBanners || []).filter((_, i) => i !== idx);
                                    setDraftHome(prev => ({ ...prev, sideBanners: updated }));
                                    triggerNotification('تم حذف البنار الجانبي.');
                                  }}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                  title="حذف البنار"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Editable Fields Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              
                              {/* Title */}
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 block">عنوان البنار *</label>
                                <input
                                  type="text"
                                  value={banner.title}
                                  onChange={(e) => {
                                    const updated = [...(draftHome.sideBanners || [])];
                                    updated[idx] = { ...updated[idx], title: e.target.value };
                                    setDraftHome(prev => ({ ...prev, sideBanners: updated }));
                                  }}
                                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-emerald-950 outline-none focus:border-emerald-700"
                                  placeholder="عنوان البنار..."
                                />
                              </div>

                              {/* Position */}
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 block">موقع البنار الجانبي *</label>
                                <select
                                  value={banner.position}
                                  onChange={(e: any) => {
                                    const updated = [...(draftHome.sideBanners || [])];
                                    updated[idx] = { ...updated[idx], position: e.target.value };
                                    setDraftHome(prev => ({ ...prev, sideBanners: updated }));
                                  }}
                                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-emerald-950 outline-none focus:border-emerald-700"
                                >
                                  <option value="right">يمين الصفحة (الجانب الأيمن)</option>
                                  <option value="left">يسار الصفحة (الجانب الأيسر)</option>
                                </select>
                              </div>

                              {/* Button Link Tab */}
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 block">القسم المستهدف عند الضغط على الزر</label>
                                <select
                                  value={banner.buttonLinkTab || 'services'}
                                  onChange={(e) => {
                                    const updated = [...(draftHome.sideBanners || [])];
                                    updated[idx] = { ...updated[idx], buttonLinkTab: e.target.value };
                                    setDraftHome(prev => ({ ...prev, sideBanners: updated }));
                                  }}
                                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-emerald-950 outline-none focus:border-emerald-700"
                                >
                                  <option value="services">الخدمات الإلكترونية (services)</option>
                                  <option value="projects">المشاريع والتطوير (projects)</option>
                                  <option value="news">الأخبار والمستجدات (news)</option>
                                  <option value="directory">دليل الأنشطة والمؤسسات (directory)</option>
                                  <option value="gallery">معرض الصور (gallery)</option>
                                </select>
                              </div>

                              {/* Content / Description */}
                              <div className="space-y-1 md:col-span-2 lg:col-span-3">
                                <label className="text-xs font-bold text-gray-700 block">محتوى ونص البنار *</label>
                                <textarea
                                  rows={2}
                                  value={banner.content}
                                  onChange={(e) => {
                                    const updated = [...(draftHome.sideBanners || [])];
                                    updated[idx] = { ...updated[idx], content: e.target.value };
                                    setDraftHome(prev => ({ ...prev, sideBanners: updated }));
                                  }}
                                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 outline-none focus:border-emerald-700"
                                  placeholder="محتوى البنار الجانبي والشرح المختصر..."
                                />
                              </div>

                              {/* Button Label */}
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 block">نص زر الانتقال (اختياري)</label>
                                <input
                                  type="text"
                                  value={banner.buttonLabel || ''}
                                  onChange={(e) => {
                                    const updated = [...(draftHome.sideBanners || [])];
                                    updated[idx] = { ...updated[idx], buttonLabel: e.target.value };
                                    setDraftHome(prev => ({ ...prev, sideBanners: updated }));
                                  }}
                                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-700"
                                  placeholder="مثال: الانتقال للخدمة"
                                />
                              </div>

                              {/* Background Color */}
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 block">لون خلفية البنار</label>
                                <div className="flex gap-2">
                                  <input
                                    type="color"
                                    value={banner.bgColor || '#064e3b'}
                                    onChange={(e) => {
                                      const updated = [...(draftHome.sideBanners || [])];
                                      updated[idx] = { ...updated[idx], bgColor: e.target.value };
                                      setDraftHome(prev => ({ ...prev, sideBanners: updated }));
                                    }}
                                    className="w-10 h-9 border border-gray-200 rounded-xl cursor-pointer bg-white"
                                  />
                                  <input
                                    type="text"
                                    value={banner.bgColor || '#064e3b'}
                                    onChange={(e) => {
                                      const updated = [...(draftHome.sideBanners || [])];
                                      updated[idx] = { ...updated[idx], bgColor: e.target.value };
                                      setDraftHome(prev => ({ ...prev, sideBanners: updated }));
                                    }}
                                    className="flex-grow p-2 bg-white border border-gray-200 rounded-xl text-xs font-mono text-center"
                                  />
                                </div>
                              </div>

                              {/* Text Color */}
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 block">لون نص البنار</label>
                                <div className="flex gap-2">
                                  <input
                                    type="color"
                                    value={banner.textColor || '#ffffff'}
                                    onChange={(e) => {
                                      const updated = [...(draftHome.sideBanners || [])];
                                      updated[idx] = { ...updated[idx], textColor: e.target.value };
                                      setDraftHome(prev => ({ ...prev, sideBanners: updated }));
                                    }}
                                    className="w-10 h-9 border border-gray-200 rounded-xl cursor-pointer bg-white"
                                  />
                                  <input
                                    type="text"
                                    value={banner.textColor || '#ffffff'}
                                    onChange={(e) => {
                                      const updated = [...(draftHome.sideBanners || [])];
                                      updated[idx] = { ...updated[idx], textColor: e.target.value };
                                      setDraftHome(prev => ({ ...prev, sideBanners: updated }));
                                    }}
                                    className="flex-grow p-2 bg-white border border-gray-200 rounded-xl text-xs font-mono text-center"
                                  />
                                </div>
                              </div>

                              {/* Image URL Optional */}
                              <div className="space-y-1 md:col-span-2 lg:col-span-3">
                                <label className="text-xs font-bold text-gray-700 block">رابط صورة البنار (اختياري)</label>
                                <input
                                  type="url"
                                  value={banner.imageUrl || ''}
                                  onChange={(e) => {
                                    const updated = [...(draftHome.sideBanners || [])];
                                    updated[idx] = { ...updated[idx], imageUrl: e.target.value };
                                    setDraftHome(prev => ({ ...prev, sideBanners: updated }));
                                  }}
                                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs text-left outline-none focus:border-emerald-700 font-mono"
                                  placeholder="https://example.com/banner-image.jpg"
                                  dir="ltr"
                                />
                              </div>

                            </div>

                          </div>
                        ))
                      )}
                    </div>

                  </div>
                )}
              </div>

              {/* SECTION 11: HOME SECTIONS ORDER MANAGER */}
              <div className="border border-emerald-200 rounded-2xl overflow-hidden shadow-sm bg-emerald-50/20">
                <button
                  type="button"
                  onClick={() => setExpandedHomeSection(expandedHomeSection === 'sections_order' ? '' : 'sections_order')}
                  className="w-full p-4 bg-emerald-800 hover:bg-emerald-900 text-white transition-all text-right font-bold flex items-center justify-between flex-row-reverse"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="p-1.5 bg-amber-400 text-emerald-950 rounded-lg text-xs font-mono font-black">١١</span>
                    <span className="flex items-center gap-2">
                      <span>إدارة وترتيب مواضع أقسام الصفحة الرئيسية (Home Page Sections Reordering)</span>
                      <Sparkles className="h-4 w-4 text-amber-300" />
                    </span>
                  </div>
                  <span>{expandedHomeSection === 'sections_order' ? '▲' : '▼'}</span>
                </button>
                {expandedHomeSection === 'sections_order' && (
                  <div className="p-6 bg-white space-y-6 border-t border-emerald-100 text-right" dir="rtl">
                    <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 text-right space-y-1">
                      <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                        <span>🎯 التحكم الكامل بترتيب ومواضع أقسام الواجهة الرئيسية</span>
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        يمكنك تغيير ترتيب وظهور أي قسم في الصفحة الرئيسية بسهولة عبر أزرار تقديم وتأخير الترتيب. كما تم رفع محاذاة "النبذة التعريفية" لتكون متناسقة ومتساوية تماماً مع القسم الأخضر الخاص بـ "خيرات قارة الجبلية".
                      </p>
                    </div>

                    {/* Reordering list */}
                    <div className="space-y-3">
                      {(() => {
                        const currentOrder = (draftHome.homeSectionOrder && draftHome.homeSectionOrder.length > 0)
                          ? draftHome.homeSectionOrder
                          : ['intro_agriculture', 'heritage', 'emergency', 'photo_marquee'];

                        const sectionLabels: Record<string, { title: string; desc: string; icon: string }> = {
                          'intro_agriculture': {
                            title: 'النبذة التعريفية + خيرات قارة الجبلية (معاً بمحاذاة أعلى متناسقة)',
                            desc: 'عرض النبذة عن قارة وبطاقة المحاصيل الجبلية جنباً إلى جنب في شبكة متوازية مع ارتفاع متناسق',
                            icon: '🌾'
                          },
                          'intro': {
                            title: 'النبذة التعريفية لبلدة قارة (منفردة بعرض كامل)',
                            desc: 'عرض تاريخ ونشأة البلدة والجوائز المستلمة بشكل مستقل',
                            icon: 'ℹ️'
                          },
                          'agriculture': {
                            title: 'خيرات قارة الجبلية والمحاصيل الزراعية (منفردة بعرض كامل)',
                            desc: 'عرض بطاقة المحاصيل الزراعية مثل الكرز والمشمش واللوز المستقلة',
                            icon: '🍒'
                          },
                          'heritage': {
                            title: 'المعالم والآثار التاريخية',
                            desc: 'عرض المعالم التاريخية كالدير والكنائس والجامع الكبير مع إمكانية التفاعل',
                            icon: '🏰'
                          },
                          'emergency': {
                            title: 'دليل الطوارئ والاتصال السريع',
                            desc: 'أرقام ودليل الاتصال بالطوارئ والمؤسسات الرسمية والخدمية',
                            icon: '🚨'
                          },
                          'photo_marquee': {
                            title: 'معرض صور بلدة قارة (شريط العرض التشاركي الأفقي)',
                            desc: 'شريط الصور المنزلق في أسفل الصفحة الرئيسية',
                            icon: '🖼️'
                          }
                        };

                        const moveSection = (index: number, direction: 'up' | 'down') => {
                          const newOrder = [...currentOrder];
                          const targetIndex = direction === 'up' ? index - 1 : index + 1;
                          if (targetIndex < 0 || targetIndex >= newOrder.length) return;
                          const temp = newOrder[index];
                          newOrder[index] = newOrder[targetIndex];
                          newOrder[targetIndex] = temp;
                          setDraftHome(prev => ({ ...prev, homeSectionOrder: newOrder }));
                        };

                        return (
                          <div className="space-y-2.5">
                            {currentOrder.map((sectionKey, index) => {
                              const info = sectionLabels[sectionKey] || { title: sectionKey, desc: '', icon: '📌' };
                              return (
                                <div
                                  key={sectionKey}
                                  className="p-4 bg-stone-50 hover:bg-emerald-50/40 border border-stone-200 rounded-2xl flex items-center justify-between gap-4 transition-all"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="w-7 h-7 bg-emerald-800 text-amber-300 font-mono font-bold text-xs rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                      {index + 1}
                                    </span>
                                    <div>
                                      <h5 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-2">
                                        <span>{info.icon}</span>
                                        <span>{info.title}</span>
                                      </h5>
                                      <p className="text-[11px] text-stone-500 mt-0.5">{info.desc}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      disabled={index === 0}
                                      onClick={() => moveSection(index, 'up')}
                                      className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                        index === 0
                                          ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                                      }`}
                                      title="رفع القسم للأعلى"
                                    >
                                      ▲ <span>رفع للأعلى</span>
                                    </button>

                                    <button
                                      type="button"
                                      disabled={index === currentOrder.length - 1}
                                      onClick={() => moveSection(index, 'down')}
                                      className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                        index === currentOrder.length - 1
                                          ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                                      }`}
                                      title="خفض للأسفل"
                                    >
                                      ▼ <span>خفض للأسفل</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}

                            <div className="pt-3 flex items-center justify-between flex-row-reverse gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setDraftHome(prev => ({
                                    ...prev,
                                    homeSectionOrder: ['intro_agriculture', 'heritage', 'emergency', 'photo_marquee']
                                  }));
                                  triggerNotification("تم استعادة ترتيب أقسام الصفحة الرئيسية الافتراضي!");
                                }}
                                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                              >
                                🔄 استعادة الترتيب القياسي الافتراضي
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                  </div>
                )}
              </div>

            </div>

            {/* Bottom Form Actions */}
            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 flex-row-reverse">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="h-5 w-5" />
                حفظ وتأكيد كافة التعديلات في الصفحة الرئيسية
              </button>
            </div>
          </form>
        )}

        {/* TAB 0.15: ARCHAEOLOGICAL LANDMARKS MANAGEMENT */}
        {activeSubTab === 'landmarks' && (
          <div className="space-y-6 text-right" dir="rtl">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-emerald-950 font-sans flex items-center gap-2">
                  <span>إدارة وثائق ومعالم بلدة قارة الأثرية</span>
                  <span className="text-xs font-normal bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-mono">
                    {homeContent.heritagePoints ? homeContent.heritagePoints.length : 0} معلم توثيقي
                  </span>
                </h3>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  إضافة وتحرير معالم قارة الأثرية والمقدسات، رفع الصور من جهازك أو بـ URL، وكتابة الشروحات التاريخية والنبذة المعروضة على الصفحة الرئيسية (يتم ربط أحدث 4 معالم مباشرة بالصفحة الرئيسية).
                </p>
              </div>
              
              {!isAddingLandmark && !editingLandmarkId && (
                <button
                  type="button"
                  onClick={() => {
                    setLandmarkForm({
                      title: '',
                      period: '',
                      location: '',
                      description: '',
                      docsSectionTitle: '',
                      docsSectionContent: '',
                      fullExplanation: '',
                      image: '',
                      showMediaSection: true,
                      additionalSectionTitle: '',
                      additionalImagesText: '',
                      additionalImagesList: [],
                      showAdditionalImages: true,
                      videoUrl: '',
                      researchNotes: '',
                      modalFooterText: ''
                    });
                    setIsAddingLandmark(true);
                  }}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-amber-400" />
                  <span>إضافة معلم أثري جديد</span>
                </button>
              )}
            </div>

            {/* Notification & Info Card */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-950">
              <Sparkles className="h-5 w-5 text-amber-600 shrink-0" />
              <span>
                <strong>تنبيه ربط العرض:</strong> يتم عرض أحدث 4 معالم أثرية مضافة في أعلى القائمة في قسم الآثار بـ <strong>الصفحة الرئيسية</strong> تلقائياً مع زر يفتح النافذة المكبرة للشرح الكامل والأخبار المربوطة.
              </span>
            </div>

            {/* ADD / EDIT LANDMARK FORM */}
            {(isAddingLandmark || editingLandmarkId) && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!landmarkForm.title.trim()) {
                    alert('يرجى كتابة اسم المعلم الأثري');
                    return;
                  }

                  const updatedPoints = [...(homeContent.heritagePoints || [])];

                  // Source of truth for additional images is landmarkForm.additionalImagesList
                  let allImagesCombined: string[] = Array.from(new Set<string>(landmarkForm.additionalImagesList)).filter(Boolean);

                  let finalMainImage = landmarkForm.image;
                  if (finalMainImage) {
                    if (!allImagesCombined.includes(finalMainImage)) {
                      allImagesCombined.unshift(finalMainImage);
                    }
                  } else if (allImagesCombined.length > 0) {
                    finalMainImage = allImagesCombined[0];
                  }

                  if (editingLandmarkId) {
                    const idx = updatedPoints.findIndex(p => p.id === editingLandmarkId || p.title === editingLandmarkId);
                    if (idx !== -1) {
                      updatedPoints[idx] = {
                        ...updatedPoints[idx],
                        title: landmarkForm.title,
                        period: landmarkForm.period,
                        location: landmarkForm.location,
                        description: landmarkForm.description,
                        docsSectionTitle: landmarkForm.docsSectionTitle || undefined,
                        docsSectionContent: landmarkForm.docsSectionContent || undefined,
                        fullExplanation: landmarkForm.fullExplanation,
                        image: finalMainImage,
                        showMediaSection: landmarkForm.showMediaSection,
                        additionalSectionTitle: landmarkForm.additionalSectionTitle || undefined,
                        additionalImages: allImagesCombined,
                        showAdditionalImages: landmarkForm.showAdditionalImages,
                        videoUrl: landmarkForm.videoUrl || undefined,
                        researchNotes: landmarkForm.researchNotes || undefined,
                        modalFooterText: landmarkForm.modalFooterText || undefined
                      };
                    }
                    triggerNotification('تم تحديث بيانات الشرح والتوثيق والمعرض للمعلم الأثري بنجاح!');
                  } else {
                    const newPoint: HeritagePoint = {
                      id: `h_${Date.now()}`,
                      title: landmarkForm.title,
                      period: landmarkForm.period || 'العصر الإسلامي والبيزنطي',
                      location: landmarkForm.location || 'بلدة قارة القديمة',
                      description: landmarkForm.description,
                      docsSectionTitle: landmarkForm.docsSectionTitle || undefined,
                      docsSectionContent: landmarkForm.docsSectionContent || undefined,
                      fullExplanation: landmarkForm.fullExplanation || landmarkForm.description,
                      image: finalMainImage,
                      showMediaSection: landmarkForm.showMediaSection,
                      additionalSectionTitle: landmarkForm.additionalSectionTitle || undefined,
                      additionalImages: allImagesCombined,
                      showAdditionalImages: landmarkForm.showAdditionalImages,
                      videoUrl: landmarkForm.videoUrl || undefined,
                      researchNotes: landmarkForm.researchNotes || undefined,
                      modalFooterText: landmarkForm.modalFooterText || undefined,
                      createdAt: new Date().toISOString()
                    };
                    updatedPoints.unshift(newPoint); // Add to top so it's instantly among the latest 4 on Home
                    triggerNotification('تمت إضافة المعلم الأثري الجديد وربطه بالصفحة الرئيسية بنجاح!');
                  }

                  setHomeContent({
                    ...homeContent,
                    heritagePoints: updatedPoints
                  });

                  // Reset form
                  setIsAddingLandmark(false);
                  setEditingLandmarkId(null);
                  setLandmarkForm({
                    title: '',
                    period: '',
                    location: '',
                    description: '',
                    docsSectionTitle: '',
                    docsSectionContent: '',
                    fullExplanation: '',
                    image: '',
                    showMediaSection: true,
                    additionalSectionTitle: '',
                    additionalImagesText: '',
                    additionalImagesList: [],
                    showAdditionalImages: true,
                    videoUrl: '',
                    researchNotes: '',
                    modalFooterText: ''
                  });
                }}
                className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-6"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h4 className="font-extrabold text-base text-emerald-950 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-amber-600" />
                    <span>{editingLandmarkId ? 'تعديل بيانات وشرح المعلم الأثري' : 'إضافة معلم أثري جديد'}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingLandmark(false);
                      setEditingLandmarkId(null);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-all cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-xs font-extrabold text-gray-700 block">اسم المعلم الأثري *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: الجامع الكبير في قارة"
                      value={landmarkForm.title}
                      onChange={(e) => setLandmarkForm({ ...landmarkForm, title: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs text-right focus:bg-white focus:border-emerald-700 transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-xs font-extrabold text-gray-700 block">العصر أو الحقبة التاريخية</label>
                    <input
                      type="text"
                      placeholder="مثال: القرن السادس الميلادي - العصر البيزنطي/الإسلامي"
                      value={landmarkForm.period}
                      onChange={(e) => setLandmarkForm({ ...landmarkForm, period: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs text-right focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-xs font-extrabold text-gray-700 block">الموقع الميداني ببلدة قارة</label>
                    <input
                      type="text"
                      placeholder="مثال: وسط البلدة القديمة - بالقرب من الساحة الرئيسية"
                      value={landmarkForm.location}
                      onChange={(e) => setLandmarkForm({ ...landmarkForm, location: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs text-right focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                {/* Excerpt Summary */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-gray-700 block">النبذة المختصرة المعروضة بطاقة المعلم في الصفحة الرئيسية *</label>
                    <span className="text-[10px] text-gray-400">تظهر مباشرة في الكرت الخارجي بالصفحة الرئيسية</span>
                  </div>
                  <textarea
                    rows={2}
                    required
                    placeholder="اكتب موجزاً عن أهمية هذا المعلم وموقعه الأساسي لشد انتباه الزائر..."
                    value={landmarkForm.description}
                    onChange={(e) => setLandmarkForm({ ...landmarkForm, description: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs text-right leading-relaxed focus:bg-white focus:border-emerald-700 transition-all"
                  />
                </div>

                {/* Custom Title and Content for Documentation Section */}
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-emerald-950 block">تخصيص عنوان قسم التوثيق والشرح التاريخي (تعديل العنوان لمنع التكرار)</label>
                    <span className="text-[10px] text-emerald-800 font-bold">يمكنك تغييره مثلاً إلى: "المراجع التاريخية وجديد الاعتماد الأثري"</span>
                  </div>
                  <input
                    type="text"
                    placeholder="التوثيق والشرح التاريخي (أو أية تسمية مخصصة مثل: المراجع التاريخية والتوثيق الرسمي)"
                    value={landmarkForm.docsSectionTitle}
                    onChange={(e) => setLandmarkForm({ ...landmarkForm, docsSectionTitle: e.target.value })}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs text-right font-bold text-emerald-950 focus:border-emerald-700 transition-all"
                  />

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">محتوى قسم التوثيق والمراجع المخصصة (اختياري - يحل محل الشرح الافتراضي إن وُجد):</label>
                    <textarea
                      rows={3}
                      placeholder="اكتب المراجع والمصادر التوثيقية والجهات المعتمدة لهذا المعلم التاريخي..."
                      value={landmarkForm.docsSectionContent}
                      onChange={(e) => setLandmarkForm({ ...landmarkForm, docsSectionContent: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs text-right leading-relaxed focus:border-emerald-700 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Full Explanation */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-emerald-950 block">الشرح التفصيلي والتاريخي الكامل المعروض بالنافذة المكبرة *</label>
                    <span className="text-[10px] text-emerald-700 font-bold">يظهر عند ضغط الزائر على زر "قراءة التوثيق والشرح"</span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="اكتب تاريخ المعلم بالكامل، الأبحاث التي جرت عليه، مراحل الترميم، والخصائص المعمارية بالتفصيل..."
                    value={landmarkForm.fullExplanation}
                    onChange={(e) => setLandmarkForm({ ...landmarkForm, fullExplanation: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs text-right leading-loose focus:bg-white focus:border-emerald-700 transition-all font-sans"
                  />
                </div>

                {/* Modal Footer Banner Text */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">نص التذييل بأسفل النافذة المنبثقة (اختياري):</label>
                  <input
                    type="text"
                    placeholder="مثال: التوثيق معتمد رسمياً من المديرية العامة للآثار والمتاحف - مجلس بلدة قارة"
                    value={landmarkForm.modalFooterText}
                    onChange={(e) => setLandmarkForm({ ...landmarkForm, modalFooterText: e.target.value })}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs text-right font-medium text-gray-700 focus:border-emerald-700 transition-all"
                  />
                </div>

                {/* Multi-Image Management & Main Image Selection Section */}
                <div className="space-y-4 bg-gradient-to-br from-amber-50/60 to-emerald-50/40 p-5 rounded-2xl border border-amber-200/80">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-amber-200/60 pb-3">
                    <div>
                      <span className="text-sm font-extrabold text-emerald-950 block flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-amber-600" />
                        <span>معرض صور المعلم الأثري (إضافة أكثر من صورة واختيار الرئيسية)</span>
                      </span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        قم برفع أكثر من صورة للمعلم الأثري، وحدد الصورة التي تكون هي الرئيسية للواجهة. باقي الصور ستظهر بأسفل البطاقة تحت المراجع.
                      </p>
                    </div>

                    {/* Admin Permission Toggle to Show or Hide Additional Images */}
                    <label className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-amber-300 shadow-2xs cursor-pointer text-xs font-bold text-emerald-950 hover:bg-amber-50 shrink-0">
                      <input
                        type="checkbox"
                        checked={landmarkForm.showAdditionalImages !== false}
                        onChange={(e) => setLandmarkForm({ ...landmarkForm, showAdditionalImages: e.target.checked })}
                        className="rounded text-emerald-700 focus:ring-emerald-600 h-4 w-4"
                      />
                      <span>إظهار معرض الصور الإضافية للزوار بأسفل بطاقة المعلم</span>
                    </label>
                  </div>

                  {/* List of current added images & main image chooser */}
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold text-gray-800 block">
                      الصور المضافة لهذا المعلم ({landmarkForm.additionalImagesList.length}):
                    </span>

                    {landmarkForm.additionalImagesList.length === 0 ? (
                      <div className="p-4 bg-white/80 rounded-xl border border-dashed border-gray-300 text-center text-xs text-gray-500">
                        لم يتم إضافة أية صور لهذا المعلم بعد. استخدم خيارات الإضافة أدناه لرفع صورة رئيسية وصور إضافية.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {landmarkForm.additionalImagesList.map((imgUrl, imgIdx) => {
                          const isMain = landmarkForm.image === imgUrl || (!landmarkForm.image && imgIdx === 0);
                          return (
                            <div 
                              key={imgIdx}
                              className={`p-2 bg-white rounded-2xl border transition-all flex flex-col justify-between gap-2 shadow-2xs relative ${
                                isMain ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="h-28 w-full rounded-xl overflow-hidden relative bg-gray-100">
                                <img src={imgUrl} alt={`صورة ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                {isMain && (
                                  <span className="absolute top-2 right-2 bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                                    ⭐ الرئيسية
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1">
                                {!isMain ? (
                                  <button
                                    type="button"
                                    onClick={() => setLandmarkForm({ ...landmarkForm, image: imgUrl })}
                                    className="w-full py-1 bg-amber-50 hover:bg-amber-100 text-amber-950 rounded-lg text-[10px] font-extrabold transition-all border border-amber-200 cursor-pointer text-center"
                                  >
                                    ⭐ تعيين كصورة رئيسية
                                  </button>
                                ) : (
                                  <span className="block text-center text-[10px] font-extrabold text-emerald-800 bg-emerald-50 py-1 rounded-lg border border-emerald-200">
                                    ✓ الصورة الرئيسية المعروضة
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    const deletedUrl = landmarkForm.additionalImagesList[imgIdx];
                                    const updatedList = landmarkForm.additionalImagesList.filter((_, i) => i !== imgIdx);
                                    let newMain = landmarkForm.image;
                                    if (isMain || landmarkForm.image === deletedUrl) {
                                      newMain = updatedList.length > 0 ? updatedList[0] : '';
                                    }
                                    setLandmarkForm({
                                      ...landmarkForm,
                                      additionalImagesList: updatedList,
                                      image: newMain
                                    });
                                  }}
                                  className="w-full py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer"
                                >
                                  🗑️ حذف الصورة
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Adding Options */}
                  <div className="space-y-2 pt-2 border-t border-amber-200/50">
                    <span className="text-xs font-bold text-gray-700 block">إضافة صور جديدة للمعلم:</span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Choice 1: Computer Upload Multiple */}
                      <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                        <label className="text-[11px] font-bold text-gray-700 block">١. رفع صور من الكمبيوتر (يمكن تحديد أكثر من صورة):</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []) as File[];
                            if (files.length > 0) {
                              const promises = files.map((file: File) => new Promise<string>((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') resolve(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }));

                              Promise.all(promises).then(urls => {
                                const newList = Array.from(new Set([...landmarkForm.additionalImagesList, ...urls]));
                                const newMain = landmarkForm.image || (newList.length > 0 ? newList[0] : '');
                                setLandmarkForm({
                                  ...landmarkForm,
                                  additionalImagesList: newList,
                                  image: newMain
                                });
                              });
                            }
                          }}
                          className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-50 file:text-emerald-700 cursor-pointer"
                        />
                      </div>

                      {/* Choice 2: Add by URL */}
                      <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                        <label className="text-[11px] font-bold text-gray-700 block">٢. إضافة رابط صورة من الإنترنت:</label>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            placeholder="https://..."
                            id="landmark_url_input"
                            className="w-full p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-left font-mono outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('landmark_url_input') as HTMLInputElement;
                              if (input && input.value.trim()) {
                                const url = input.value.trim();
                                const newList = Array.from(new Set([...landmarkForm.additionalImagesList, url]));
                                const newMain = landmarkForm.image || url;
                                setLandmarkForm({
                                  ...landmarkForm,
                                  additionalImagesList: newList,
                                  image: newMain
                                });
                                input.value = '';
                              }
                            }}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs rounded-lg cursor-pointer shrink-0"
                          >
                            إضافة
                          </button>
                        </div>
                      </div>

                      {/* Choice 3: Gallery Item Selection */}
                      <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                        <label className="text-[11px] font-bold text-gray-700 block">٣. إضافة من معرض صور الموقع:</label>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              const url = e.target.value;
                              const newList = Array.from(new Set([...landmarkForm.additionalImagesList, url]));
                              const newMain = landmarkForm.image || url;
                              setLandmarkForm({
                                ...landmarkForm,
                                additionalImagesList: newList,
                                image: newMain
                              });
                              e.target.value = '';
                            }
                          }}
                          className="w-full p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-right outline-none cursor-pointer"
                        >
                          <option value="">-- اختر صورة لإضافتها --</option>
                          {galleryItems.filter(p => p.status === 'approved').map(item => (
                            <option key={item.id} value={item.imageUrl}>
                              {item.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingLandmark(false);
                      setEditingLandmarkId(null);
                    }}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="h-4 w-4 text-amber-400" />
                    <span>{editingLandmarkId ? 'حفظ تعديلات المعلم الأثري' : 'تأكيد وإضافة المعلم الأثري'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* LANDMARKS SEARCH & LIST */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
                <div className="w-full sm:w-72 relative">
                  <input
                    type="text"
                    placeholder="ابحث عن معلم أثري..."
                    value={landmarkSearch}
                    onChange={(e) => setLandmarkSearch(e.target.value)}
                    className="w-full p-2.5 pr-9 bg-gray-50 border border-gray-200 rounded-xl text-xs text-right outline-none focus:bg-white focus:border-emerald-700 transition-all font-medium"
                  />
                  <Search className="h-4 w-4 text-gray-400 absolute right-3 top-3" />
                </div>

                <span className="text-xs text-gray-500 font-sans">
                  إجمالي المعالم المسجلة: <strong className="text-emerald-900 font-bold">{homeContent.heritagePoints ? homeContent.heritagePoints.length : 0}</strong>
                </span>
              </div>

              {/* Landmarks Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(homeContent.heritagePoints || [])
                  .filter(item => 
                    !landmarkSearch.trim() || 
                    item.title.includes(landmarkSearch) || 
                    item.description.includes(landmarkSearch) ||
                    (item.period && item.period.includes(landmarkSearch))
                  )
                  .map((item, idx) => {
                    const isFeaturedOnHome = idx < 4;

                    return (
                      <div 
                        key={item.id || idx}
                        className={`p-5 rounded-3xl bg-white border transition-all space-y-4 text-right relative flex flex-col justify-between shadow-2xs hover:shadow-md ${
                          isFeaturedOnHome ? 'border-amber-300 ring-2 ring-amber-100' : 'border-gray-100'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-gray-400">#{(item.id || idx + 1).toString().slice(-4)}</span>
                            
                            <div className="flex items-center gap-2">
                              {isFeaturedOnHome && (
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-950 px-2.5 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                                  <Sparkles className="h-3 w-3 text-amber-600" />
                                  معروض بالصفحة الرئيسية (ضمن أحدث 4)
                                </span>
                              )}
                              {item.period && (
                                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                                  {item.period}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Image & Title Header */}
                          <div className="flex gap-4 items-start">
                            {item.image && (
                              <div className="h-20 w-24 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 shadow-xs">
                                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                              </div>
                            )}

                            <div className="space-y-1 flex-1">
                              <h4 className="font-extrabold text-base text-gray-900">{item.title}</h4>
                              {item.location && (
                                <span className="text-xs text-gray-500 block">📍 {item.location}</span>
                              )}
                            </div>
                          </div>

                          {/* Excerpt */}
                          <p className="text-xs text-gray-600 leading-relaxed font-sans line-clamp-2 bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                            {item.description}
                          </p>

                          {/* Full Explanation snippet */}
                          {item.fullExplanation && (
                            <div className="text-[11px] text-emerald-900 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100/60 leading-relaxed line-clamp-2 font-sans">
                              <strong className="block text-emerald-950 font-bold mb-0.5">الشرح الكامل:</strong>
                              {item.fullExplanation}
                            </div>
                          )}
                        </div>

                        {/* Actions bar */}
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            {/* Move Up */}
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const list = [...(homeContent.heritagePoints || [])];
                                  const temp = list[idx];
                                  list[idx] = list[idx - 1];
                                  list[idx - 1] = temp;
                                  setHomeContent({ ...homeContent, heritagePoints: list });
                                  triggerNotification('تم إعادة ترتيب المعلم للأعلى');
                                }}
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                title="نقل للأعلى"
                              >
                                ⬆️
                              </button>
                            )}

                            {/* Move Down */}
                            {idx < (homeContent.heritagePoints || []).length - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const list = [...(homeContent.heritagePoints || [])];
                                  const temp = list[idx];
                                  list[idx] = list[idx + 1];
                                  list[idx + 1] = temp;
                                  setHomeContent({ ...homeContent, heritagePoints: list });
                                  triggerNotification('تم إعادة ترتيب المعلم للأسفل');
                                }}
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                title="نقل للأسفل"
                              >
                                ⬇️
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const imgs = Array.from(new Set([...(item.additionalImages || []), ...(item.image ? [item.image] : [])])).filter(Boolean);
                                setEditingLandmarkId(item.id || item.title);
                                setLandmarkForm({
                                  title: item.title,
                                  period: item.period || '',
                                  location: item.location || '',
                                  description: item.description,
                                  docsSectionTitle: item.docsSectionTitle || '',
                                  docsSectionContent: item.docsSectionContent || '',
                                  fullExplanation: item.fullExplanation || item.description,
                                  image: item.image || '',
                                  showMediaSection: item.showMediaSection !== false,
                                  additionalSectionTitle: item.additionalSectionTitle || '',
                                  additionalImagesText: item.additionalImages ? item.additionalImages.join('\n') : '',
                                  additionalImagesList: imgs,
                                  showAdditionalImages: item.showAdditionalImages !== false,
                                  videoUrl: item.videoUrl || '',
                                  researchNotes: item.researchNotes || '',
                                  modalFooterText: item.modalFooterText || ''
                                });
                                setIsAddingLandmark(false);
                              }}
                              className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              <span>تعديل</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`هل أنت متأكد من حذف المعلم الأثري "${item.title}"؟`)) {
                                  const updated = (homeContent.heritagePoints || []).filter((_, i) => i !== idx);
                                  setHomeContent({ ...homeContent, heritagePoints: updated });
                                  triggerNotification('تم حذف المعلم الأثري بنجاح');
                                }
                              }}
                              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 0.2: COMMERCIAL AND SERVICE DIRECTORY MANAGEMENT */}
        {activeSubTab === 'directory' && (
          <div className="space-y-6 text-right" dir="rtl">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-emerald-950 font-sans">إدارة الدليل التجاري والخدمي لبلدة قارة</h3>
                <p className="text-xs text-gray-400 font-sans">قم بإضافة وتحرير الفعاليات والأنشطة، وتدقيق مشاركات الجمهور، وتثبيت البطاقات في أعلى الدليل.</p>
              </div>
              
              {!isAddingActivity && !editingActivity && (
                <div className="flex flex-col sm:flex-row gap-2 self-stretch sm:self-auto justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من إعادة تعيين الدليل التجاري والخدمي إلى القيم الافتراضية؟ سيؤدي ذلك لحذف التعديلات والطلبات المضافة مؤخراً.')) {
                        setActivities(INITIAL_BUSINESS_ACTIVITIES);
                        triggerNotification('تمت إعادة تعيين الدليل للقيم الافتراضية بنجاح!');
                      }
                    }}
                    className="px-4 py-2.5 border border-amber-900/20 hover:bg-amber-50 text-amber-900 text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 justify-center"
                  >
                    <span>🔄 إعادة تعيين الدليل الافتراضي</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddActivity}
                    className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold rounded-xl shadow transition-all cursor-pointer flex items-center gap-2 justify-center"
                  >
                    <Plus className="h-4 w-4" />
                    إضافة فعالية تجارية/خدمية جديدة
                  </button>
                </div>
              )}
            </div>

            {/* Page Renaming Control Box */}
            {!isAddingActivity && !editingActivity && (
              <div className="bg-gradient-to-l from-emerald-50/40 to-emerald-50/10 p-5 rounded-2xl border border-emerald-100/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-right">
                  <h4 className="font-extrabold text-emerald-900 text-sm font-sans flex items-center gap-2">
                    <Edit3 className="h-4 w-4 text-emerald-700" />
                    تخصيص مسمى صفحة الدليل التجاري والخدمي
                  </h4>
                  <p className="text-xs text-gray-500">
                    يمكنك تغيير الاسم الافتراضي للصفحة المعروضة في شريط التنقل العلوي وتذييل الصفحة وعنوان القسم بما يناسب رؤيتك.
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto">
                  <input
                    type="text"
                    value={tempDirectoryName}
                    onChange={(e) => setTempDirectoryName(e.target.value)}
                    placeholder="مسمى صفحة الدليل (مثال: دليل الأنشطة والمهن)"
                    className="flex-grow sm:w-64 px-3.5 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 outline-none text-sm text-right"
                  />
                  <button
                    onClick={handleSaveDirectoryName}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
                  >
                    تعديل الاسم
                  </button>
                </div>
              </div>
            )}

            {/* Business Categories Management Box */}
            {!isAddingActivity && !editingActivity && (
              <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-emerald-950 text-sm font-sans flex items-center gap-2">
                      <Store className="h-4 w-4 text-emerald-700" />
                      إدارة تصنيفات الأنشطة والمهن التجارية والخدمية ({currentCategories.length})
                    </h4>
                    <p className="text-xs text-gray-500">
                      يمكنك إضافة تصنيفات جديدة، أو تعديل أسماء التصنيفات الحالية أو حذفها بسهولة حسب الأنشطة المدرجة أو التي سيتم إدراجها مستقبلاً.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('إعادة تصنيفات الدليل للوضع الافتراضي؟')) {
                        const defaults = ["تجاري", "خدمي", "صحي", "تراثي", "تعليمي", "زراعي", "صناعي", "مهن وحرف"];
                        setHomeContent({ ...homeContent, directoryCategories: defaults });
                        triggerNotification('تم إعادة تصنيفات الدليل للوضع الافتراضي');
                      }
                    }}
                    className="text-[11px] font-bold text-amber-800 hover:underline cursor-pointer"
                  >
                    🔄 استعادة التصنيفات الافتراضية
                  </button>
                </div>

                {/* Add New Category Input */}
                <div className="flex items-center gap-2 max-w-lg">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    placeholder="أدخل اسم تصنيف جديد (مثال: تعليمي، مقاولات، مطاعم ومقاهي...)"
                    className="flex-grow px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-right focus:bg-white focus:border-emerald-700 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDirectoryCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddDirectoryCategory()}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all shrink-0 flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    إضافة تصنيف
                  </button>
                </div>

                {/* Categories Grid List */}
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {currentCategories.map((cat, idx) => {
                    const count = activities.filter(a => a.category === cat).length;
                    const isEditing = editingCatIndex === idx;

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs font-bold text-emerald-900"
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingCatValue}
                              onChange={(e) => setEditingCatValue(e.target.value)}
                              className="px-2 py-0.5 bg-white border border-emerald-400 rounded-md text-xs text-right w-28 outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleEditDirectoryCategory(idx)}
                              className="p-1 bg-emerald-700 text-white rounded hover:bg-emerald-800 text-[10px] cursor-pointer"
                              title="حفظ"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCatIndex(null)}
                              className="p-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-[10px] cursor-pointer"
                              title="إلغاء"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span>{cat}</span>
                            <span className="px-1.5 py-0.2 bg-emerald-200/60 text-emerald-950 rounded-full text-[10px] font-extrabold">
                              {count}
                            </span>
                            <div className="flex items-center gap-1 mr-1 border-r border-emerald-200 pr-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCatIndex(idx);
                                  setEditingCatValue(cat);
                                }}
                                className="p-0.5 hover:text-emerald-700 text-emerald-700 transition-colors cursor-pointer"
                                title="تعديل اسم التصنيف"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDirectoryCategory(cat)}
                                className="p-0.5 hover:text-rose-700 text-emerald-700 transition-colors cursor-pointer"
                                title="حذف التصنيف"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Statistics boxes (only when not adding/editing) */}
            {!isAddingActivity && !editingActivity && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 flex items-center justify-between">
                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">إجمالي الفعاليات والأنشطة</span>
                    <span className="text-2xl font-bold text-emerald-950">{activities.length}</span>
                  </div>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50 flex items-center justify-between">
                  <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">بانتظار موافقة الإدارة</span>
                    <span className="text-2xl font-bold text-amber-800">{activities.filter(a => a.status === 'pending').length}</span>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 flex items-center justify-between">
                  <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-gray-500 block">الفعاليات المثبتة في الأعلى</span>
                    <span className="text-2xl font-bold text-blue-950">{activities.filter(a => a.isPinned).length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* FORM: Add/Edit activity */}
            {(isAddingActivity || editingActivity) && (
              <form onSubmit={handleSaveActivity} className="space-y-6 bg-gray-50/40 p-6 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-emerald-900 border-b border-gray-100 pb-2">
                  {editingActivity ? 'تحرير بيانات الفعالية' : 'إضافة فعالية تجارية أو خدمية جديدة'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">اسم الفعالية أو المنشأة *</label>
                    <input 
                      type="text"
                      required
                      value={activityFormName}
                      onChange={(e) => setActivityFormName(e.target.value)}
                      placeholder="مثال: مطعم الياسمين، عيادة الدكتور أحمد، مغسلة الهدى"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 outline-none text-sm text-right"
                    />
                  </div>

                  {/* Category field */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-bold text-gray-700">تصنيف النشاط *</label>
                      <span className="text-[11px] text-emerald-800 font-bold">يمكن اختيار تصنيف أو إضافة جديد</span>
                    </div>
                    <select
                      value={activityFormCategory}
                      onChange={(e) => {
                        setActivityFormCategory(e.target.value);
                        if (e.target.value !== '__new__') {
                          setCustomFormCategory('');
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 outline-none text-sm text-right cursor-pointer font-bold text-emerald-950"
                    >
                      {currentCategories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="__new__">➕ إضافة تصنيف جديد...</option>
                    </select>

                    {activityFormCategory === '__new__' && (
                      <div className="mt-2 space-y-1">
                        <input
                          type="text"
                          required
                          value={customFormCategory}
                          onChange={(e) => setCustomFormCategory(e.target.value)}
                          placeholder="اكتب اسم التصنيف الجديد (مثال: زراعي، تعليمي، مقاولات...)"
                          className="w-full px-4 py-2 bg-amber-50/60 border border-amber-300 rounded-xl text-xs text-right focus:bg-white focus:border-emerald-700 outline-none font-bold"
                        />
                        <p className="text-[10px] text-amber-800 font-bold">
                          سيتم حفظ هذا التصنيف الجديد تلقائياً في دليل التصنيفات العامة لإتاحته للفلترة لجمهور الموقع.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Description field */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700">الوصف والتعريف بالنشاط</label>
                    <textarea 
                      value={activityFormDescription}
                      onChange={(e) => setActivityFormDescription(e.target.value)}
                      placeholder="صف نشاطك التجاري أو الخدمي، والمنتجات أو الخدمات التي تقدمها للجمهور ومواعيد العمل..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 outline-none text-sm text-right"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">رقم الهاتف للتواصل</label>
                    <input 
                      type="text"
                      value={activityFormPhone}
                      onChange={(e) => setActivityFormPhone(e.target.value)}
                      placeholder="مثال: 0912345678 أو 011543210"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 outline-none text-sm text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Whatsapp field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">رقم الواتساب للتواصل المباشر</label>
                    <input 
                      type="text"
                      value={activityFormWhatsapp}
                      onChange={(e) => setActivityFormWhatsapp(e.target.value)}
                      placeholder="مثال: +963912345678"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 outline-none text-sm text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Address field */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700">عنوان الفعالية بالتفصيل</label>
                    <input 
                      type="text"
                      value={activityFormAddress}
                      onChange={(e) => setActivityFormAddress(e.target.value)}
                      placeholder="مثال: قارة، الشارع العام، بجانب الجامع الكبير، بناء الهلال"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 outline-none text-sm text-right"
                    />
                  </div>

                  {/* Image input options */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">رابط صورة الفعالية من الإنترنت</label>
                    <input 
                      type="url"
                      value={activityFormImage}
                      onChange={(e) => setActivityFormImage(e.target.value)}
                      placeholder="https://example.com/logo.jpg"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 outline-none text-sm text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Base64 uploader */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">أو رفع صورة من جهاز الكمبيوتر</label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 cursor-pointer transition-all">
                        <Upload className="h-4 w-4" />
                        اختر ملف صورة
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setActivityFormImage(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {activityFormImage && (
                        <div className="flex items-center gap-2">
                          <img src={activityFormImage} className="h-10 w-10 object-cover rounded-lg border border-gray-200 shadow-sm" alt="Preview" />
                          <button 
                            type="button" 
                            onClick={() => setActivityFormImage('')}
                            className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                          >
                            إزالة
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card design settings */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">طراز وتصميم البطاقة</label>
                    <select
                      value={activityFormCardStyle}
                      onChange={(e) => setActivityFormCardStyle(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 outline-none text-sm text-right cursor-pointer"
                    >
                      <option value="simple">بسيط وعملي (حدود ناعمة وتنسيق فلات)</option>
                      <option value="modern">حديث وعصري (حواف مستديرة وظلال جذابة)</option>
                      <option value="heritage">تراثي كلاسيكي (مستوحى من عراقة قارة وطابعها الطيني)</option>
                      <option value="classic">تقليدي منظم (فاصل ملون عريض بالجانب)</option>
                    </select>
                  </div>

                  {/* Card Color Picker */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">لون خلفية بطاقة الفعالية</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color"
                        value={activityFormCardColor}
                        onChange={(e) => setActivityFormCardColor(e.target.value)}
                        className="h-10 w-16 p-0 border border-gray-200 rounded-lg cursor-pointer"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {['#ffffff', '#fdfbf7', '#f4f6f0', '#fef3c7', '#f0fdf4', '#ecfeff', '#fff1f2'].map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setActivityFormCardColor(c)}
                            className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* IsPinned field */}
                  <div className="space-y-2 md:col-span-2 flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox"
                      id="activityFormIsPinned"
                      checked={activityFormIsPinned}
                      onChange={(e) => setActivityFormIsPinned(e.target.checked)}
                      className="h-4 w-4 text-emerald-800 border-gray-300 rounded focus:ring-emerald-800"
                    />
                    <label htmlFor="activityFormIsPinned" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                      تثبيت الفعالية بشكل دائم في أعلى صفحة الدليل (الأولوية الأولى للعرض)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 flex-row-reverse">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold rounded-xl shadow cursor-pointer"
                  >
                    حفظ الفعالية
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingActivity(false);
                      setEditingActivity(null);
                    }}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold rounded-xl cursor-pointer"
                  >
                    إلغاء التغييرات
                  </button>
                </div>
              </form>
            )}

            {/* PENDING SUBMISSIONS (if any exists) */}
            {!isAddingActivity && !editingActivity && activities.some(a => a.status === 'pending') && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-r-4 border-amber-500 pr-3">
                  <h4 className="font-extrabold text-amber-800 text-base font-sans">طلبات التسجيل الجديدة وبانتظار المراجعة والاعتماد ({activities.filter(a => a.status === 'pending').length})</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.filter(a => a.status === 'pending').map(act => (
                    <div key={act.id} className="bg-amber-50/30 border border-amber-200 rounded-2xl p-4 flex gap-4 text-right">
                      {act.image ? (
                        <img src={act.image} alt={act.name} className="w-20 h-20 object-cover rounded-xl border border-amber-100 shrink-0" />
                      ) : (
                        <div className="w-20 h-20 bg-amber-100/50 flex items-center justify-center rounded-xl text-amber-700 shrink-0">
                          <Building2 className="h-8 w-8" />
                        </div>
                      )}
                      
                      <div className="flex-grow space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-emerald-950 text-sm">{act.name}</h5>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">{act.category}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{act.description || 'بلا شرح أو وصف إضافي.'}</p>
                        <div className="text-[11px] text-gray-600 space-y-0.5">
                          {act.phone && <div dir="ltr" className="text-right">📞 {act.phone}</div>}
                          {act.whatsapp && <div dir="ltr" className="text-right">💬 {act.whatsapp}</div>}
                          {act.address && <div>📍 {act.address}</div>}
                        </div>
                        
                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            onClick={() => handleApproveActivity(act.id)}
                            className="px-3 py-1 bg-green-700 hover:bg-green-800 text-white text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                          >
                            <Check className="h-3.5 w-3.5" />
                            موافقة ونشر بالدليل
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(act.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            رفض وحذف الطلب
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* APPROVED ACTIVITIES LIST */}
            {!isAddingActivity && !editingActivity && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="font-extrabold text-emerald-900 text-base font-sans">قائمة الفعاليات المعتمدة حالياً في الدليل ({activities.filter(a => a.status === 'approved').length})</h4>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right text-gray-600 min-w-[600px]">
                    <thead className="text-xs text-emerald-900 uppercase bg-emerald-50/50 font-bold">
                      <tr>
                        <th scope="col" className="px-4 py-3 rounded-r-xl">الفعالية والشعار</th>
                        <th scope="col" className="px-4 py-3">التصنيف والنوع</th>
                        <th scope="col" className="px-4 py-3">أرقام التواصل والعنوان</th>
                        <th scope="col" className="px-4 py-3">الحالة والنمط</th>
                        <th scope="col" className="px-4 py-3 rounded-l-xl text-left">خيارات التحكم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {activities.filter(a => a.status === 'approved').map(act => (
                        <tr key={act.id} className="hover:bg-gray-50/40 transition-colors">
                          <td className="px-4 py-3.5 font-medium text-gray-900 flex items-center gap-3">
                            {act.image ? (
                              <img src={act.image} alt={act.name} className="w-10 h-10 object-cover rounded-lg border shadow-sm shrink-0" />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400 shrink-0">
                                <Building2 className="h-5 w-5" />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-950">{act.name}</span>
                                {act.isPinned && (
                                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-extrabold rounded flex items-center gap-0.5" title="مثبت في القمة">
                                    📌 مثبت
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400 block line-clamp-1">{act.description || 'لا يوجد وصف مضاف.'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-100/50">
                              {act.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs space-y-0.5">
                            {act.phone && <div dir="ltr" className="text-right text-gray-700 font-mono">📞 {act.phone}</div>}
                            {act.whatsapp && <div dir="ltr" className="text-right text-emerald-600 font-mono font-bold">💬 {act.whatsapp}</div>}
                            {act.address && <div className="text-gray-400">📍 {act.address}</div>}
                          </td>
                          <td className="px-4 py-3 text-xs space-y-1">
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <span>نشط ومعروض</span>
                            </div>
                            <span className="text-[10px] text-gray-400 block bg-gray-100 px-1.5 py-0.5 rounded w-max font-mono">طراز: {act.cardStyle || 'simple'}</span>
                          </td>
                          <td className="px-4 py-3 text-left">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => handleTogglePinActivity(act.id)}
                                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                  act.isPinned 
                                    ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100' 
                                    : 'bg-white border-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                                title={act.isPinned ? 'إلغاء التثبيت من القمة' : 'تثبيت الفعالية في القمة'}
                              >
                                <span className="text-xs">📌</span>
                              </button>
                              
                              <button
                                onClick={() => handleOpenEditActivity(act)}
                                className="p-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl transition-all cursor-pointer animate-none"
                                title="تحرير البيانات والنمط"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteActivity(act.id)}
                                className="p-2 bg-white hover:bg-red-50 text-red-600 border border-red-100 rounded-xl transition-all cursor-pointer animate-none"
                                title="حذف نهائي"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: QARA MARKETPLACE MANAGEMENT */}
        {activeSubTab === 'marketplace' && (
          <MarketplaceAdminManager
            listings={marketplaceListings}
            setListings={setMarketplaceListings}
            homeContent={homeContent}
            setHomeContent={setHomeContent}
          />
        )}

        {/* TAB 0.5: PHOTO GALLERY MANAGEMENT */}
        {activeSubTab === 'gallery' && (
          <div className="space-y-6 text-right">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
              <div className="text-right">
                <h3 className="font-extrabold text-lg text-emerald-950 font-sans">مكتب تدقيق واعتماد صور الأهالي والتحكم</h3>
                <p className="text-xs text-gray-400 font-sans">راجع واعتمد لقطات ومشاركات أهالي قارة، تصفح أرشيف الصور، واضبط إعدادات المعرض</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmConfig({
                      title: 'إعادة تعيين معرض الصور',
                      message: 'هل تريد تصفير معرض الصور وإعادته للحالة الافتراضية؟ سيتم إرجاع الصور المرفوعة مؤخراً لحالة الانتظار.',
                      danger: true,
                      onConfirm: () => {
                        setGalleryItems(prev => prev.map(item => ({ ...item, status: item.id.startsWith('g-user') ? 'pending' : 'approved' })));
                        triggerNotification("تمت إعادة تعيين المعرض بنجاح!");
                      }
                    });
                  }}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans"
                >
                  إعادة تعيين المعرض
                </button>
              </div>
            </div>

            {/* Subtabs for Gallery Management */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-1 flex-row-reverse" dir="rtl">
              <button
                type="button"
                onClick={() => setGallerySubTab('pending')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  gallerySubTab === 'pending'
                    ? 'bg-amber-500 text-emerald-950 shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                <span>قيد التدقيق</span>
                {galleryItems.filter(p => p.status === 'pending').length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {galleryItems.filter(p => p.status === 'pending').length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setGallerySubTab('published')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  gallerySubTab === 'published'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>المنشورة حالياً ({galleryItems.filter(p => p.status === 'approved').length}/48)</span>
              </button>

              <button
                type="button"
                onClick={() => setGallerySubTab('archive')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  gallerySubTab === 'archive'
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Archive className="h-4 w-4" />
                <span>أرشيف الصور</span>
                {galleryItems.filter(p => p.status === 'archived').length > 0 && (
                  <span className="bg-gray-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {galleryItems.filter(p => p.status === 'archived').length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setGallerySubTab('categories')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  gallerySubTab === 'categories'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>تصنيفات المعرض ({ (draftHome.galleryCategories || ['صور المناطق الطبيعية', 'صور الأطفال', 'صور المناسبات الاجتماعية', 'صور متنوعة']).length })</span>
              </button>

              <button
                type="button"
                onClick={() => setGallerySubTab('livestream')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  gallerySubTab === 'livestream'
                    ? 'bg-rose-700 text-white shadow-sm ring-2 ring-rose-500/30 font-black'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/80'
                }`}
              >
                <Video className="h-4 w-4 text-rose-600 animate-pulse" />
                <span>🔴 التحكم بالبث المباشر</span>
              </button>

              <button
                type="button"
                onClick={() => setGallerySubTab('settings')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  gallerySubTab === 'settings'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Sliders className="h-4 w-4" />
                <span>إعدادات المعرض</span>
              </button>
            </div>

            {/* Content for GALLERY PENDING */}
            {gallerySubTab === 'pending' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-emerald-950 border-b border-gray-100 pb-2 flex items-center justify-end gap-1.5 flex-row-reverse">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping inline-block"></span>
                  <span>طلبات الإضافة المعلقة المرفوعة حديثاً ({galleryItems.filter(p => p.status === 'pending').length})</span>
                </h4>

                {galleryItems.filter(p => p.status === 'pending').length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems
                      .filter(p => p.status === 'pending')
                      .map((photo) => (
                        <div key={photo.id} className="bg-white border-2 border-amber-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                          <div className="relative h-48 bg-gray-100">
                            <img
                              src={photo.imageUrl}
                              alt={photo.title}
                              className="w-full h-full object-cover select-none"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80";
                              }}
                            />
                            <span className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500 text-emerald-950 text-[10px] font-bold rounded-lg shadow-sm font-sans">
                              بانتظار المراجعة
                            </span>
                          </div>

                          <div className="p-4 text-right space-y-3">
                            <div>
                              <h5 className="font-bold text-gray-900 text-sm line-clamp-1">{photo.title}</h5>
                              <p className="text-[11px] text-gray-500 mt-1 font-sans">
                                المرسِل: <span className="text-emerald-800 font-bold">{photo.submitter}</span> | {photo.date}
                              </p>
                            </div>

                            {/* Category selector for Admin / Moderator before approving */}
                            <div className="space-y-1 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200 text-right">
                              <label className="block text-[11px] font-bold text-emerald-950 flex items-center justify-between flex-row-reverse">
                                <span>تعديل تصنيف الصورة:</span>
                                <span className="text-[10px] text-amber-800 font-medium">(صلاحية المدير والمشرف)</span>
                              </label>
                              <select
                                value={photo.category || (draftHome.galleryCategories?.[0] || 'صور متنوعة')}
                                onChange={(e) => {
                                  const newCat = e.target.value;
                                  setGalleryItems(prev => prev.map(item => item.id === photo.id ? { ...item, category: newCat } : item));
                                  triggerNotification(`تم تحديث تصنيف الصورة إلى "${newCat}"`);
                                }}
                                className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-emerald-950 outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                              >
                                {(draftHome.galleryCategories || ['صور المناطق الطبيعية', 'صور الأطفال', 'صور المناسبات الاجتماعية', 'صور متنوعة']).map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setGalleryItems(prev => prev.map(item => {
                                    if (item.id === photo.id) {
                                      return { ...item, status: 'approved' as const };
                                    }
                                    return item;
                                  }));
                                  triggerNotification(`تم اعتماد ونشر لقطة "${photo.title}" بنجاح!`);
                                }}
                                className="py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors font-sans"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>قبول ونشر</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmConfig({
                                    title: 'حذف ورفض المشاركة',
                                    message: `هل أنت متأكد من رفض وحذف مشاركة الصورة "${photo.title}" نهائياً من النظام؟ لا يمكن التراجع عن هذا الإجراء.`,
                                    danger: true,
                                    onConfirm: () => {
                                      setGalleryItems(prev => prev.filter(item => item.id !== photo.id));
                                      triggerNotification("تم رفض وحذف مشاركة الصورة نهائياً.");
                                    }
                                  });
                                }}
                                className="py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors font-sans"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>حذف نهائي</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-xs font-bold font-sans">جميع الطلبات معالجة ومكتملة!</p>
                    <p className="text-gray-400 text-[11px] mt-0.5 font-sans">لا توجد صور معلقة بانتظار التدقيق والمراجعة حالياً.</p>
                  </div>
                )}
              </div>
            )}

            {/* Content for GALLERY PUBLISHED */}
            {gallerySubTab === 'published' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-emerald-950 border-b border-gray-100 pb-2 font-sans">
                  الصور المعتمدة والمنشورة حالياً في ألبوم البوابة ({galleryItems.filter(p => p.status === 'approved').length}/48)
                </h4>

                {galleryItems.filter(p => p.status === 'approved').length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryItems
                      .filter(p => p.status === 'approved')
                      .map((photo) => (
                        <div key={photo.id} className="bg-gray-50/50 rounded-xl overflow-hidden border border-gray-100 flex flex-col justify-between">
                          <div className="relative h-32 bg-gray-100">
                            <img
                              src={photo.imageUrl}
                              alt={photo.title}
                              className="w-full h-full object-cover select-none"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80";
                              }}
                            />
                            <div className="absolute bottom-1 right-1 bg-emerald-950/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] text-amber-300 font-bold font-sans flex items-center gap-1">
                              <span>عدسة: {photo.submitter}</span>
                            </div>
                          </div>

                          <div className="p-3 text-right space-y-2">
                            <div>
                              <h6 className="font-bold text-gray-900 text-xs truncate">{photo.title}</h6>
                              <p className="text-[10px] text-gray-500 truncate font-sans">عدسة: {photo.submitter}</p>
                            </div>

                            {/* Category dropdown for Published Photos */}
                            <div className="space-y-0.5">
                              <span className="text-[9px] text-gray-400 block font-sans">التصنيف:</span>
                              <select
                                value={photo.category || (draftHome.galleryCategories?.[0] || 'صور متنوعة')}
                                onChange={(e) => {
                                  const newCat = e.target.value;
                                  setGalleryItems(prev => prev.map(item => item.id === photo.id ? { ...item, category: newCat } : item));
                                  triggerNotification(`تم تعديل تصنيف الصورة المنشورة إلى "${newCat}"`);
                                }}
                                className="w-full p-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-emerald-900 outline-none cursor-pointer"
                              >
                                {(draftHome.galleryCategories || ['صور المناطق الطبيعية', 'صور الأطفال', 'صور المناسبات الاجتماعية', 'صور متنوعة']).map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex gap-1.5 w-full">
                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmConfig({
                                    title: 'سحب موافقة النشر',
                                    message: `هل تريد إلغاء اعتماد الصورة "${photo.title}" وسحبها من المعرض العام؟ ستعود للأرشيف المعلق للمراجعة مجدداً.`,
                                    danger: false,
                                    onConfirm: () => {
                                      setGalleryItems(prev => prev.map(item => {
                                        if (item.id === photo.id) {
                                          return { ...item, status: 'pending' as const };
                                        }
                                        return item;
                                      }));
                                      triggerNotification("تم إلغاء النشر وسحب الصورة للأرشيف المعلق.");
                                    }
                                  });
                                }}
                                className="flex-grow py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center font-sans"
                              >
                                سحب الموافقة
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmConfig({
                                    title: 'حذف الصورة نهائياً',
                                    message: `هل أنت متأكد من حذف الصورة المعتمدة "${photo.title}" نهائياً من النظام والملفات؟ لا يمكن الاسترجاع.`,
                                    danger: true,
                                    onConfirm: () => {
                                      setGalleryItems(prev => prev.filter(item => item.id !== photo.id));
                                      triggerNotification("تم حذف الصورة المعتمدة نهائياً.");
                                    }
                                  });
                                }}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg transition-colors cursor-pointer"
                                title="حذف الصورة نهائياً"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 text-xs font-sans">
                    لا توجد صور معروضة حالياً. اعتمد بعض الصور أعلاه لتظهر هنا وفي واجهة البوابة الرئيسية.
                  </div>
                )}
              </div>
            )}

            {/* Content for GALLERY ARCHIVE */}
            {gallerySubTab === 'archive' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-right">
                  <p className="text-xs text-gray-500 font-sans leading-relaxed">
                    <strong>عن أرشيف الصور:</strong> يظهر هنا الصور الأقدم التي تم استبعادها تلقائياً من الألبوم النشط للحفاظ على المساحة بعد تجاوز حد الـ 48 صورة. يمكنك في أي وقت حذفها نهائياً لتوفير المساحة، أو إعادتها للألبوم النشط (سيؤدي ذلك تلقائياً لأرشفة أقدم صورة من الألبوم النشط للمحافظة على سقف الـ 48 صورة).
                  </p>
                </div>

                <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 font-sans">
                  صور الأرشيف المتجاوزة للحد الأقصى ({galleryItems.filter(p => p.status === 'archived').length})
                </h4>

                {galleryItems.filter(p => p.status === 'archived').length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryItems
                      .filter(p => p.status === 'archived')
                      .map((photo) => (
                        <div key={photo.id} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex flex-col justify-between opacity-90 hover:opacity-100 transition-opacity">
                          <div className="relative h-32 bg-gray-100">
                            <img
                              src={photo.imageUrl}
                              alt={photo.title}
                              className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all select-none"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80";
                              }}
                            />
                            <div className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-gray-800/90 text-white text-[9px] font-bold rounded">
                              مؤرشفة
                            </div>
                            <div className="absolute bottom-1 right-1 bg-gray-950/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] text-gray-300 font-sans">
                              عدسة: {photo.submitter}
                            </div>
                          </div>

                          <div className="p-3 text-right space-y-2">
                            <div>
                              <h6 className="font-bold text-gray-900 text-xs truncate">{photo.title}</h6>
                              <p className="text-[10px] text-gray-500 font-sans truncate">{photo.date}</p>
                            </div>

                            <div className="flex gap-1.5 w-full">
                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmConfig({
                                    title: 'إعادة الصورة للألبوم',
                                    message: `هل تريد إعادة الصورة "${photo.title}" للألبوم النشط؟ هذا قد يؤدي لأرشفة أقدم صورة في المعرض تلقائياً للحفاظ على حد الـ 48 صورة.`,
                                    danger: false,
                                    onConfirm: () => {
                                      setGalleryItems(prev => prev.map(item => {
                                        if (item.id === photo.id) {
                                          return { ...item, status: 'approved' as const };
                                        }
                                        return item;
                                      }));
                                      triggerNotification("تمت إعادة الصورة للألبوم النشط بنجاح!");
                                    }
                                  });
                                }}
                                className="flex-grow py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center font-sans"
                              >
                                إعادة للألبوم
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmConfig({
                                    title: 'حذف نهائي ومؤكد',
                                    message: `هل تريد حذف هذه الصورة المؤرشفة "${photo.title}" نهائياً من أرشيف الموقع؟ لا يمكن الاسترجاع أبداً.`,
                                    danger: true,
                                    onConfirm: () => {
                                      setGalleryItems(prev => prev.filter(item => item.id !== photo.id));
                                      triggerNotification("تم حذف الصورة المؤرشفة نهائياً.");
                                    }
                                  });
                                }}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg transition-colors cursor-pointer"
                                title="حذف نهائي"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400 text-xs font-sans">
                    لا توجد صور في الأرشيف حالياً.
                  </div>
                )}
              </div>
            )}

            {/* Content for GALLERY CATEGORIES */}
            {gallerySubTab === 'categories' && (
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6 text-right" dir="rtl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-950 font-sans flex items-center gap-2">
                      <Folder className="h-4 w-4 text-amber-500" />
                      <span>إدارة وتخصيص تصنيفات ألبوم معرض الصور</span>
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 font-sans leading-relaxed">
                      قم بإنشاء تصنيفات جديدة لمعرض الصور، وتعديل أسماء التصنيفات الحالية أو حذفها. يتم ربط هذه التصنيفات مباشرة مع نموذج رفع الصور للمشاهدين وقائمة الفلترة الذكية في المعرض العام.
                    </p>
                  </div>
                </div>

                {/* Form to Add New Category */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3">
                  <h5 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-emerald-700" />
                    <span>إضافة تصنيف جديد لمعرض الصور:</span>
                  </h5>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                      placeholder="أدخل اسم التصنيف الجديد (مثال: صور المباني التاريخية)..."
                      className="flex-grow w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl text-xs outline-none text-right font-bold text-emerald-950"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4" />
                      <span>إضافة التصنيف</span>
                    </button>
                  </div>
                </div>

                {/* Categories List */}
                <div className="space-y-3">
                  <h5 className="font-bold text-xs text-emerald-950 flex items-center justify-between">
                    <span>التصنيفات المعتمدة حالياً في المعرض:</span>
                    <span className="text-gray-500 text-[11px] font-normal font-mono">
                      الإجمالي: {(draftHome.galleryCategories || ["صور المناطق الطبيعية", "صور الأطفال", "صور المناسبات الاجتماعية", "صور متنوعة"]).length} تصنيف
                    </span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                    {(draftHome.galleryCategories || ["صور المناطق الطبيعية", "صور الأطفال", "صور المناسبات الاجتماعية", "صور متنوعة"]).map((cat, idx) => {
                      const photoCount = galleryItems.filter(i => (i.category || "صور متنوعة") === cat).length;
                      const isEditing = editingCategoryIndex === idx;

                      return (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-3">
                          {isEditing ? (
                            <div className="flex items-center gap-2 flex-grow">
                              <input
                                type="text"
                                value={editingCategoryValue}
                                onChange={(e) => setEditingCategoryValue(e.target.value)}
                                className="flex-grow p-1.5 bg-gray-50 border border-emerald-600 rounded-lg text-xs font-bold text-emerald-950 text-right outline-none"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveCategoryEdit(idx, cat)}
                                className="p-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 cursor-pointer"
                                title="حفظ"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCategoryIndex(null);
                                  setEditingCategoryValue('');
                                }}
                                className="p-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 cursor-pointer"
                                title="إلغاء"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 text-right">
                                <Tag className="h-4 w-4 text-amber-500 flex-shrink-0" />
                                <div>
                                  <span className="font-bold text-xs text-emerald-950 block">{cat}</span>
                                  <span className="text-[10px] text-gray-400 block font-mono mt-0.5">
                                    {photoCount} صورة مسجلة بهذا التصنيف
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCategoryIndex(idx);
                                    setEditingCategoryValue(cat);
                                  }}
                                  className="p-1.5 text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                  title="تعديل اسم التصنيف"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(idx, cat)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="حذف التصنيف"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Content for GALLERY SETTINGS */}
            {gallerySubTab === 'settings' && (
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6 text-right">
                <h4 className="font-extrabold text-sm text-emerald-950 font-sans border-b border-gray-200 pb-2">
                  إعدادات وضوابط معرض صور الأهالي والزوار
                </h4>

                {/* Size Limit Option */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-700 font-sans">
                    الحد الأقصى لحجم ملف الصورة المرفوعة:
                  </label>
                  <p className="text-[11px] text-gray-400 font-sans">
                    حدد سقف الحجم الأقصى للملف الذي يمكن للزائر رفعه على البوابة. يدعم ما يصل إلى 2 جيجابايت لتجربة رفع فائقة الدقة.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono font-bold">كيلوبايت (KB)</span>
                      <input
                        type="number"
                        min="512"
                        max="2097152"
                        value={draftHome.maxUploadSizeKB || 5120}
                        onChange={(e) => {
                          const val = Math.min(2097152, Math.max(512, parseInt(e.target.value) || 5120));
                          setDraftHome(prev => ({ ...prev, maxUploadSizeKB: val }));
                        }}
                        className="flex-grow p-2.5 bg-white border border-gray-200 rounded-xl font-mono text-center font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 text-xs"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 items-center justify-end">
                      <span className="text-xs text-gray-400 font-sans ml-2">اختصارات سريعة:</span>
                      {[
                        { label: '5 MB', val: 5120 },
                        { label: '50 MB', val: 51200 },
                        { label: '500 MB', val: 512000 },
                        { label: '1 GB', val: 1048576 },
                        { label: '2 GB (الأقصى)', val: 2097152 }
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => {
                            setDraftHome(prev => ({ ...prev, maxUploadSizeKB: preset.val }));
                            triggerNotification(`تم تعيين الحد الأقصى لـ ${preset.label}`);
                          }}
                          className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer border ${
                            draftHome.maxUploadSizeKB === preset.val
                              ? 'bg-emerald-800 border-emerald-800 text-white'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gallery Header Fields */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h5 className="font-extrabold text-xs text-emerald-950 font-sans">
                    تخصيص نصوص المعرض والرسالة التعريفية:
                  </h5>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-700 font-sans">
                        عنوان المعرض الرئيسي بجانب زر المشاركة:
                      </label>
                      <input
                        type="text"
                        value={draftHome.galleryTitle || ''}
                        onChange={(e) => setDraftHome(prev => ({ ...prev, galleryTitle: e.target.value }))}
                        placeholder="مثال: ألبوم صور وذكريات بلدة قارة"
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs text-right"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-700 font-sans">
                        الرسالة الترحيبية أو الرسالة التعريفية للمعرض:
                      </label>
                      <textarea
                        rows={3}
                        value={draftHome.galleryDescription || ''}
                        onChange={(e) => setDraftHome(prev => ({ ...prev, galleryDescription: e.target.value }))}
                        placeholder="أدخل رسالة تصف محتويات المعرض وأهميته للزوار..."
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs text-right leading-relaxed font-sans"
                      />
                    </div>
                  </div>
                </div>



                {/* Watermark/Copyright Customization */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between flex-row-reverse border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2 flex-row-reverse text-right">
                      <Sliders className="h-4 w-4 text-emerald-800" />
                      <h5 className="font-extrabold text-xs text-emerald-950 font-sans">
                        تخصيص علامة الحقوق والملكية الفكرية على الصور:
                      </h5>
                    </div>
                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={draftHome.galleryWatermarkEnabled !== false}
                        onChange={(e) => setDraftHome(prev => ({ ...prev, galleryWatermarkEnabled: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-800"></div>
                      <span className="mr-2 text-xs font-semibold text-gray-700 font-sans">تفعيل العلامة المائية</span>
                    </label>
                  </div>
                  
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed text-right font-medium">
                    تحكم بالكامل بمظهر وتصميم مربع الحقوق الذي يظهر على صور المعرض وصور ألبوم بلدة قارة تخليداً لصاحب اللقطة وحفظاً لملكيته الفكرية.
                  </p>

                  {draftHome.galleryWatermarkEnabled !== false && (
                    <div className="space-y-4 animate-fade-in">
                      {/* Watermark Position Choice */}
                      <div className="space-y-2 text-right">
                        <label className="block text-xs font-semibold text-gray-700 font-sans">
                          تحديد مكان ظهور علامة الحقوق على الصورة:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            { id: 'bottom_right', label: 'أسفل الصورة الزاوية اليمين' },
                            { id: 'bottom_left', label: 'أسفل الصورة الزاوية اليسار' },
                            { id: 'bottom_center', label: 'أسفل الصورة في الوسط' }
                          ].map((pos) => (
                            <button
                              key={pos.id}
                              type="button"
                              onClick={() => setDraftHome(prev => ({ ...prev, galleryWatermarkPosition: pos.id as any }))}
                              className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                                (draftHome.galleryWatermarkPosition || 'bottom_right') === pos.id
                                  ? 'bg-emerald-50 border-emerald-800 text-emerald-900 shadow-sm'
                                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Background Color Picker */}
                        <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-right">
                          <label className="block text-xs font-semibold text-gray-700 font-sans">
                            لون خلفية صندوق الحقوق:
                          </label>
                          <div className="flex gap-2 items-center flex-row-reverse">
                            <input
                              type="color"
                              value={
                                draftHome.galleryWatermarkBgColor?.startsWith('rgba')
                                  ? '#000000'
                                  : (draftHome.galleryWatermarkBgColor || '#000000')
                              }
                              onChange={(e) => {
                                const hex = e.target.value;
                                const r = parseInt(hex.slice(1, 3), 16);
                                const g = parseInt(hex.slice(3, 5), 16);
                                const b = parseInt(hex.slice(5, 7), 16);
                                setDraftHome(prev => ({
                                  ...prev,
                                  galleryWatermarkBgColor: `rgba(${r}, ${g}, ${b}, 0.65)`
                                }));
                              }}
                              className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 overflow-hidden bg-transparent"
                            />
                            <input
                              type="text"
                              value={draftHome.galleryWatermarkBgColor || 'rgba(0, 0, 0, 0.65)'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, galleryWatermarkBgColor: e.target.value }))}
                              placeholder="rgba(0, 0, 0, 0.65)"
                              className="flex-1 p-1.5 bg-white border border-gray-200 rounded-lg text-[10px] text-center font-mono"
                            />
                          </div>
                          <p className="text-[9px] text-gray-400 font-sans">يمكنك استخدام صيغة RGBA للشفافية.</p>
                        </div>

                        {/* Text Size Slider */}
                        <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-right">
                          <div className="flex justify-between items-center flex-row-reverse">
                            <span className="text-[11px] text-emerald-800 font-bold font-mono">{draftHome.galleryWatermarkFontSize ?? 11}px</span>
                            <label className="block text-xs font-semibold text-gray-700 font-sans">
                              حجم خط صندوق الحقوق:
                            </label>
                          </div>
                          <input
                            type="range"
                            min="8"
                            max="18"
                            step="1"
                            value={draftHome.galleryWatermarkFontSize ?? 11}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, galleryWatermarkFontSize: parseInt(e.target.value, 10) }))}
                            className="w-full accent-emerald-800 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <p className="text-[9px] text-gray-400 font-sans">يتحكم في حجم خط اسم صاحب الصورة والموقع بشكل متناسب.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Text Color Line 1 */}
                        <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-right">
                          <label className="block text-xs font-semibold text-gray-700 font-sans">
                            لون خط اسم الكاتب:
                          </label>
                          <div className="flex gap-2 items-center flex-row-reverse">
                            <input
                              type="color"
                              value={draftHome.galleryWatermarkTextColor || '#ffffff'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, galleryWatermarkTextColor: e.target.value }))}
                              className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 overflow-hidden bg-transparent"
                            />
                            <input
                              type="text"
                              value={draftHome.galleryWatermarkTextColor || '#ffffff'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, galleryWatermarkTextColor: e.target.value }))}
                              placeholder="#ffffff"
                              className="flex-1 p-1.5 bg-white border border-gray-200 rounded-lg text-[10px] text-center font-mono"
                            />
                          </div>
                          <p className="text-[9px] text-gray-400 font-sans">اللون المخصص لكتابة اسم صاحب اللقطة.</p>
                        </div>

                        {/* Text Color Line 2 (© symbol and site name) */}
                        <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-right">
                          <label className="block text-xs font-semibold text-gray-700 font-sans">
                            لون خط رمز © والسطر الثاني:
                          </label>
                          <div className="flex gap-2 items-center flex-row-reverse">
                            <input
                              type="color"
                              value={draftHome.galleryWatermarkTextColorSecondary || '#fbbf24'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, galleryWatermarkTextColorSecondary: e.target.value }))}
                              className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 overflow-hidden bg-transparent"
                            />
                            <input
                              type="text"
                              value={draftHome.galleryWatermarkTextColorSecondary || '#fbbf24'}
                              onChange={(e) => setDraftHome(prev => ({ ...prev, galleryWatermarkTextColorSecondary: e.target.value }))}
                              placeholder="#fbbf24"
                              className="flex-1 p-1.5 bg-white border border-gray-200 rounded-lg text-[10px] text-center font-mono"
                            />
                          </div>
                          <p className="text-[9px] text-gray-400 font-sans">اللون المخصص لرمز الملكية الفكرية والسطر الثاني.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>



                {/* Marquee Position Option */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <label className="block text-xs font-bold text-gray-700 font-sans">
                    موقع شريط معرض الصور في الصفحة الرئيسية:
                  </label>
                  <p className="text-[11px] text-gray-400 font-sans">
                    يمكنك التحكم في طريقة عرض ألبوم الكرز وتغيير مكانه ليظهر كشريط متحرك أفقي في تذييل الصفحة، أو كشريط عمودي في السايدبار الجانبي (يسار أو يمين الصفحة).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'bottom_horizontal',
                        title: 'شريط أفقي أسفل الصفحة',
                        desc: 'يظهر كشريط متحرك كامل العرض في أسفل الصفحة الرئيسية بأسلوب انسيابي.'
                      },
                      {
                        id: 'sidebar_right',
                        title: 'شريط عمودي جانبي (يمين)',
                        desc: 'يقسم محتوى الصفحة الرئيسية ويضع شريط الصور في الجهة اليمنى من المحتوى.'
                      },
                      {
                        id: 'sidebar_left',
                        title: 'شريط عمودي جانبي (يسار)',
                        desc: 'يقسم محتوى الصفحة الرئيسية ويضع شريط الصور في الجهة اليسرى من المحتوى.'
                      }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setDraftHome(prev => ({ ...prev, homeMarqueePosition: opt.id as any }));
                        }}
                        className={`p-4 rounded-xl border-2 text-right transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                          draftHome.homeMarqueePosition === opt.id
                            ? 'bg-emerald-50/50 border-emerald-800 ring-4 ring-emerald-800/10'
                            : 'bg-white border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <span className={`text-xs font-extrabold font-sans ${draftHome.homeMarqueePosition === opt.id ? 'text-emerald-900' : 'text-gray-800'}`}>
                          {opt.title}
                        </span>
                        <span className="text-[10px] text-gray-400 leading-relaxed font-sans">
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Save Button for Settings */}
                <div className="pt-4 border-t border-gray-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setHomeContent(draftHome);
                      triggerNotification("تم حفظ وتطبيق إعدادات وضوابط معرض الصور بنجاح!");
                    }}
                    className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>حفظ وتطبيق إعدادات المعرض</span>
                  </button>
                </div>
              </div>
            )}

            {/* Content for GALLERY LIVE STREAM CONTROL (تبويب رئيسي لإدارة البث المباشر) */}
            {gallerySubTab === 'livestream' && (
              <div className="space-y-6 animate-fade-in text-right" dir="rtl">
                <div className="space-y-5 bg-gradient-to-l from-stone-900 via-emerald-950 to-stone-900 p-6 rounded-3xl text-white shadow-xl">
                  <div className="flex items-center justify-between flex-row-reverse flex-wrap gap-4 border-b border-stone-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-rose-600/30 text-rose-400 rounded-2xl border border-rose-500/40 animate-pulse shrink-0">
                        <Video className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-extrabold text-white font-sans flex items-center gap-2">
                          <span>إدارة وتخصيص البث المباشر الرقمي (Live Stream Control Center)</span>
                        </h4>
                        <p className="text-xs text-emerald-200/80 font-sans mt-0.5">
                          تبويب رئيسي تحت إدارة المعرض مخصص لضبط البث الحي، تحديث رابط القناة أو البث، وتشغيل كاميرا الجوال المباشرة.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="bg-rose-950/60 border border-rose-500/30 rounded-xl px-3 py-1.5 text-[11px] text-rose-200 font-bold flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>عند التفعيل يتم تحويل نموذج الواجهة الترحيبية تلقائياً إلى نموذج البث الرقمي</span>
                      </div>
                      <label className="flex items-center gap-2.5 cursor-pointer bg-stone-800/90 px-4 py-2 rounded-2xl border border-stone-700 shadow-sm hover:border-rose-500/50 transition-all">
                        <span className="text-xs font-bold text-stone-200 font-sans">
                          {draftHome.liveStreamEnabled !== false ? 'البث المباشر مفعّل 🟢' : 'البث المباشر معطّل 🔴'}
                        </span>
                        <input
                          type="checkbox"
                          checked={draftHome.liveStreamEnabled !== false}
                          onChange={(e) => {
                            const isEnabled = e.target.checked;
                            const liveStreamHeroModel: HeroLink[] = [
                              { id: "hl-1", label: "البث المباشر لقارة 🔴", targetTab: "live_stream", variant: "primary", iconName: "Video" },
                              { id: "hl-2", label: "بوابة الخدمات الرقمية", targetTab: "services", variant: "secondary", iconName: "Building2" },
                              { id: "hl-3", label: "معرض الصور والذكريات", targetTab: "gallery", variant: "accent", iconName: "ImageIcon" }
                            ];
                            const defaultFallbackModel: HeroLink[] = [
                              { id: "hl-1", label: "الخدمات الإلكترونية الرقمية", targetTab: "services", variant: "primary", iconName: "Building2" },
                              { id: "hl-2", label: "استكشف المشاريع التنموية", targetTab: "projects", variant: "secondary", iconName: "Briefcase" }
                            ];

                            if (isEnabled) {
                              const currentHeroLinks = (draftHome.heroLinks && draftHome.heroLinks.length > 0) ? draftHome.heroLinks : undefined;
                              const updated = {
                                ...draftHome,
                                liveStreamEnabled: true,
                                previousHeroLinks: currentHeroLinks || draftHome.previousHeroLinks,
                                heroLinks: liveStreamHeroModel
                              };
                              setDraftHome(updated);
                              setHomeContent(updated);
                              triggerNotification("تم تفعيل البث المباشر وتبديل نموذج الواجهة الترحيبية تلقائياً إلى (نموذج البث المباشر الرقمي) 🔴");
                            } else {
                              const restoredHeroLinks = (draftHome.previousHeroLinks && draftHome.previousHeroLinks.length > 0)
                                ? draftHome.previousHeroLinks
                                : defaultFallbackModel;
                              const updated = {
                                ...draftHome,
                                liveStreamEnabled: false,
                                heroLinks: restoredHeroLinks
                              };
                              setDraftHome(updated);
                              setHomeContent(updated);
                              triggerNotification("تم إيقاف البث المباشر وإعادة نموذج الواجهة الترحيبية إلى آخر نموذج كان مفعّلاً بنجاح 🟢");
                            }
                          }}
                          className="w-4.5 h-4.5 accent-rose-600 rounded cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {draftHome.liveStreamEnabled !== false ? (
                    <div className="space-y-5 pt-2">
                      
                      {/* Streaming Mode Selector (URL vs Camera) */}
                      <div className="space-y-2 p-4 bg-stone-950/80 rounded-2xl border border-emerald-800/40">
                        <label className="block text-xs font-bold text-amber-300 font-sans">
                          🎥 اختر مصدر ونوع البث المباشر (Streaming Source Mode):
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setDraftHome(prev => ({ ...prev, liveStreamMode: 'url' }))}
                            className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                              (draftHome.liveStreamMode || 'url') === 'url'
                                ? 'bg-emerald-900/60 border-emerald-500 text-white shadow-md ring-2 ring-emerald-500/30'
                                : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-emerald-700'
                            }`}
                          >
                            <div>
                              <span className="text-xs font-bold font-sans block">📺 رابط بث خارجي (يوتيوب / قناة)</span>
                              <span className="text-[10px] text-stone-400 font-sans">تضمين فيديو مباشر عبر رابط يوتيوب أو Iframe</span>
                            </div>
                            {(draftHome.liveStreamMode || 'url') === 'url' && <Check className="h-4 w-4 text-emerald-400 shrink-0" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDraftHome(prev => ({ ...prev, liveStreamMode: 'camera' }))}
                            className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                              draftHome.liveStreamMode === 'camera'
                                ? 'bg-rose-950/80 border-rose-500 text-white shadow-md ring-2 ring-rose-500/30'
                                : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-rose-700'
                            }`}
                          >
                            <div>
                              <span className="text-xs font-bold font-sans block">📹 كمرا الجوال / الجهاز مباشرة</span>
                              <span className="text-[10px] text-rose-300/80 font-sans">بث حي مباشر بالكميرا لأعضاء الإدارة المخولين</span>
                            </div>
                            {draftHome.liveStreamMode === 'camera' && <Check className="h-4 w-4 text-rose-400 shrink-0" />}
                          </button>
                        </div>
                      </div>

                      {/* Live Stream URL */}
                      {(draftHome.liveStreamMode || 'url') === 'url' && (
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-emerald-300 font-sans">
                            رابط البث المباشر (Live Stream Link):
                          </label>
                          <input
                            type="text"
                            value={draftHome.liveStreamUrl || ''}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, liveStreamUrl: e.target.value }))}
                            placeholder="مثال: https://www.youtube.com/watch?v=VIDEO_ID أو https://youtu.be/..."
                            className="w-full p-3 bg-stone-950 border border-stone-700 focus:border-rose-500 rounded-xl outline-none text-xs text-left font-mono text-stone-100"
                            dir="ltr"
                          />
                          <p className="text-[10px] text-stone-400 font-sans">
                            * يدعم نظام البث المباشر روابط يوتيوب العادية، روابط القنوات المباشرة، أو روابط الـ Iframe المباشرة.
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Live Status Text */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-emerald-300 font-sans">
                            عبارة شارة البث المباشر (الشريط العلوي):
                          </label>
                          <input
                            type="text"
                            value={draftHome.liveStreamStatusText || 'مباشر الآن 🔴'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, liveStreamStatusText: e.target.value }))}
                            placeholder="مباشر الآن 🔴"
                            className="w-full p-2.5 bg-stone-950 border border-stone-700 focus:border-rose-500 rounded-xl outline-none text-xs text-right font-sans text-white"
                          />
                        </div>

                        {/* Bottom Badge Text */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-emerald-300 font-sans">
                            العبارة التوضيحية أسفل شاشة البث المباشر:
                          </label>
                          <input
                            type="text"
                            value={draftHome.liveStreamBadge || 'بث مباشر من قارة'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, liveStreamBadge: e.target.value }))}
                            placeholder="بث مباشر من قارة"
                            className="w-full p-2.5 bg-stone-950 border border-stone-700 focus:border-rose-500 rounded-xl outline-none text-xs text-right font-sans text-white"
                          />
                        </div>
                      </div>

                      {/* Copyright Title & Content */}
                      <div className="space-y-3 pt-2 border-t border-stone-800">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-emerald-300 font-sans">
                            عنوان إرشادات وملكية البث المباشر:
                          </label>
                          <input
                            type="text"
                            value={draftHome.liveStreamCopyrightTitle || 'حقوق وإرشادات البث المباشر'}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, liveStreamCopyrightTitle: e.target.value }))}
                            placeholder="حقوق وإرشادات البث المباشر"
                            className="w-full p-2.5 bg-stone-950 border border-stone-700 focus:border-rose-500 rounded-xl outline-none text-xs text-right font-sans text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-emerald-300 font-sans">
                            نص ومحتوى حقوق الملكية وشروط النقل المباشر:
                          </label>
                          <textarea
                            rows={3}
                            value={draftHome.liveStreamCopyrightContent || ''}
                            onChange={(e) => setDraftHome(prev => ({ ...prev, liveStreamCopyrightContent: e.target.value }))}
                            placeholder="اكتب تفاصيل حقوق الملكية والنقل لمدينة قارة..."
                            className="w-full p-2.5 bg-stone-950 border border-stone-700 focus:border-rose-500 rounded-xl outline-none text-xs text-right font-sans text-white leading-relaxed"
                          />
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="p-6 bg-stone-950/60 rounded-2xl border border-rose-900/40 text-center space-y-2">
                      <p className="text-xs text-rose-300 font-bold">البث المباشر معطّل حالياً من المفتاح العلوي 🔴</p>
                      <p className="text-[11px] text-stone-400">قم بتعليم خيار "البث المباشر مفعّل 🟢" لتفعيل شاشات البث للجمهور والأهالي.</p>
                    </div>
                  )}
                </div>

                {/* Action Save Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      let updatedHome = { ...draftHome };
                      const liveStreamHeroModel: HeroLink[] = [
                        { id: "hl-1", label: "البث المباشر لقارة 🔴", targetTab: "live_stream", variant: "primary", iconName: "Video" },
                        { id: "hl-2", label: "بوابة الخدمات الرقمية", targetTab: "services", variant: "secondary", iconName: "Building2" },
                        { id: "hl-3", label: "معرض الصور والذكريات", targetTab: "gallery", variant: "accent", iconName: "ImageIcon" }
                      ];
                      const defaultFallbackModel: HeroLink[] = [
                        { id: "hl-1", label: "الخدمات الإلكترونية الرقمية", targetTab: "services", variant: "primary", iconName: "Building2" },
                        { id: "hl-2", label: "استكشف المشاريع التنموية", targetTab: "projects", variant: "secondary", iconName: "Briefcase" }
                      ];

                      if (draftHome.liveStreamEnabled !== false) {
                        updatedHome = {
                          ...updatedHome,
                          previousHeroLinks: draftHome.previousHeroLinks || draftHome.heroLinks,
                          heroLinks: liveStreamHeroModel
                        };
                      } else {
                        const restoredHeroLinks = (draftHome.previousHeroLinks && draftHome.previousHeroLinks.length > 0)
                          ? draftHome.previousHeroLinks
                          : defaultFallbackModel;
                        updatedHome = {
                          ...updatedHome,
                          heroLinks: restoredHeroLinks
                        };
                      }
                      setDraftHome(updatedHome);
                      setHomeContent(updatedHome);
                      triggerNotification("تم حفظ وتطبيق إعدادات البث المباشر ونموذج الواجهة بنجاح! 🟢");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-600 hover:to-rose-700 text-white font-black text-xs rounded-2xl flex items-center gap-2 shadow-lg transition-all cursor-pointer border border-rose-500/30"
                  >
                    <Check className="h-4 w-4" />
                    <span>حفظ وتطبيق إعدادات البث المباشر</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {activeSubTab === 'services' && (
          <div className="space-y-6">
            
            {/* Control Panel for Electronic Services Page Availability */}
            <div className="bg-gradient-to-l from-emerald-50/60 to-amber-50/30 p-6 rounded-3xl border border-emerald-900/10 space-y-6 text-right" dir="rtl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/10 pb-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-emerald-950 text-base flex items-center gap-2">
                    <Lock className="h-5 w-5 text-emerald-800" />
                    التحكم بظهور وحالة صفحة الخدمات الإلكترونية (مفعّلة / متوقفة)
                  </h4>
                  <p className="text-xs text-gray-500">
                    يمكنك تفعيل ظهور محتوى صفحة الخدمات الإلكترونية للجمهور، أو حجبها مؤقتاً وعرض إشعار صيانة أو قريباً أو بانتظار الاعتماد.
                  </p>
                </div>

                {/* Toggle button */}
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm shrink-0">
                  <span className="text-xs font-bold text-gray-700">حالة ظهور الصفحة:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newVal = draftHome.servicesPageEnabled === false ? true : false;
                      setDraftHome(prev => ({ ...prev, servicesPageEnabled: newVal }));
                      setHomeContent({ ...homeContent, servicesPageEnabled: newVal });
                      triggerNotification(newVal ? 'تم تفعيل ظهور صفحة الخدمات الإلكترونية للعامة' : 'تم إيقاف وحجب صفحة الخدمات الإلكترونية وعرض حالة التوقف');
                    }}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors cursor-pointer ${
                      draftHome.servicesPageEnabled !== false ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        draftHome.servicesPageEnabled !== false ? 'translate-x-1' : 'translate-x-7'
                      }`}
                    />
                  </button>
                  <span className={`text-xs font-extrabold ${draftHome.servicesPageEnabled !== false ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {draftHome.servicesPageEnabled !== false ? 'متاحة للعامة' : 'محجوبة / متوقفة'}
                  </span>
                </div>
              </div>

              {/* Form fields when servicesPageEnabled is false */}
              {draftHome.servicesPageEnabled === false && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Mode selector */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">اختر نوع حالة التوقف والعرض للجمهور:</label>
                      <select
                        value={draftHome.servicesDisabledMode || 'coming_soon'}
                        onChange={(e) => {
                          const mode = e.target.value as any;
                          let ar = draftHome.servicesDisabledTitleAr || '';
                          let en = draftHome.servicesDisabledTitleEn || '';
                          if (mode === 'coming_soon') {
                            ar = 'قريباً';
                            en = 'Coming Soon';
                          } else if (mode === 'maintenance') {
                            ar = 'الصفحة تحت الصيانة';
                            en = 'Under Maintenance';
                          } else if (mode === 'awaiting_approval') {
                            ar = 'بإنتظار الاعتماد';
                            en = 'Awaiting Approval';
                          }
                          setDraftHome(prev => ({ 
                            ...prev, 
                            servicesDisabledMode: mode,
                            servicesDisabledTitleAr: ar,
                            servicesDisabledTitleEn: en
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs font-bold text-emerald-950 focus:border-emerald-800"
                      >
                        <option value="coming_soon">قريباً (Coming Soon)</option>
                        <option value="maintenance">الصفحة تحت الصيانة (Under Maintenance)</option>
                        <option value="awaiting_approval">بإنتظار الاعتماد (Awaiting Approval)</option>
                        <option value="custom">عنوان مخصص (Custom Title)</option>
                      </select>
                    </div>

                    {/* Arabic Title */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">العنوان الرئيسي بالعربية:</label>
                      <input
                        type="text"
                        value={draftHome.servicesDisabledTitleAr || ''}
                        onChange={(e) => setDraftHome(prev => ({ ...prev, servicesDisabledTitleAr: e.target.value }))}
                        placeholder="مثال: قريباً / الصفحة تحت الصيانة / بإنتظار الاعتماد"
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs text-right font-bold text-emerald-950"
                      />
                    </div>

                    {/* English Title */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">العنوان الفرعي بالإنجليزية (English Title):</label>
                      <input
                        type="text"
                        value={draftHome.servicesDisabledTitleEn || ''}
                        onChange={(e) => setDraftHome(prev => ({ ...prev, servicesDisabledTitleEn: e.target.value }))}
                        placeholder="e.g. Coming Soon / Under Maintenance / Awaiting Approval"
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs text-left font-mono font-bold text-emerald-950"
                        dir="ltr"
                      />
                    </div>

                    {/* Logo input/file uploader */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">رابط أو ملف الشعار لبطاقة التوقف:</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={draftHome.servicesDisabledLogo || ''}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, servicesDisabledLogo: e.target.value }))}
                          placeholder="شعار الهوية البصرية الافتراضي"
                          className="flex-1 px-3.5 py-2 bg-white border border-gray-200 rounded-xl outline-none text-xs font-mono"
                          dir="ltr"
                        />
                        <label className="px-3 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-900 transition-all shrink-0">
                          رفع صورة
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setDraftHome(prev => ({ ...prev, servicesDisabledLogo: reader.result as string }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Flag input/file uploader */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700">رابط أو ملف علم سوريا لبطاقة التوقف (أو اتركه فارغاً لاستخدام علم سوريا الجديد الافتراضي):</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={draftHome.servicesDisabledFlagUrl || ''}
                          onChange={(e) => setDraftHome(prev => ({ ...prev, servicesDisabledFlagUrl: e.target.value }))}
                          placeholder="العلم الافتراضي (علم سوريا الجديد)"
                          className="flex-1 px-3.5 py-2 bg-white border border-gray-200 rounded-xl outline-none text-xs font-mono"
                          dir="ltr"
                        />
                        <label className="px-3 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-amber-700 transition-all shrink-0">
                          رفع صورة علم
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setDraftHome(prev => ({ ...prev, servicesDisabledFlagUrl: reader.result as string }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700">رسالة التنبيه والشرح للجمهور:</label>
                      <textarea
                        rows={2}
                        value={draftHome.servicesDisabledMessage || ''}
                        onChange={(e) => setDraftHome(prev => ({ ...prev, servicesDisabledMessage: e.target.value }))}
                        placeholder="اكتب التوضيح الخاص بسبب إيقاف الخدمات أو موعد إطلاقها..."
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs text-right leading-relaxed font-medium"
                      />
                    </div>

                  </div>

                  {/* Save Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setHomeContent(draftHome);
                        triggerNotification('تم حفظ وتطبيق إعدادات ظهور وحالة صفحة الخدمات بنجاح!');
                      }}
                      className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      حفظ خيارات حالة الخدمات
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center flex-row-reverse border-b border-gray-100 pb-4">
              <div className="text-right">
                <h3 className="font-extrabold text-lg text-emerald-950">إدارة دليل الخدمات الإلكترونية</h3>
                <p className="text-xs text-gray-400">يمكنك تعديل الأوراق المطلوبة أو إضافة خدمة بلدية وصحية جديدة</p>
              </div>
              <button
                onClick={handleOpenAddService}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                إضافة خدمة جديدة
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => (
                <div key={srv.id} className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-emerald-700/20 transition-all flex flex-col justify-between h-48 text-right">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start flex-row-reverse">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-full">
                        {srv.category}
                      </span>
                      <span className="text-xs font-mono text-gray-400">ID: {srv.id}</span>
                    </div>
                    <h4 className="font-bold text-emerald-950 text-sm sm:text-base line-clamp-1">{srv.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{srv.description}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between flex-row-reverse text-xs">
                    <span className="text-gray-400">وقت الإنجاز: {srv.processingTime}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleOpenEditService(srv)}
                        className="p-1.5 bg-white text-emerald-800 border border-gray-200 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="تعديل الخدمة"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        className="p-1.5 bg-white text-red-600 border border-gray-200 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="حذف الخدمة"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: NEWS MANAGER */}
        {activeSubTab === 'news' && (
          <div className="space-y-6">
            {/* Sub-tab Selection Bar */}
            <div className="flex border-b border-gray-200 gap-6 mb-6 flex-row-reverse font-sans" dir="rtl">
              <button
                type="button"
                onClick={() => setNewsSubSection('articles')}
                className={`pb-3 text-xs sm:text-sm font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                  newsSubSection === 'articles'
                    ? 'text-emerald-800 border-b-2 border-emerald-800 font-extrabold'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span>محرر الأخبار والفعاليات العامة ({newsList.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setNewsSubSection('community')}
                className={`pb-3 text-xs sm:text-sm font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                  newsSubSection === 'community'
                    ? 'text-emerald-800 border-b-2 border-emerald-800 font-extrabold'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span>منبر ومناسبات الأهالي ({communityAnnouncements.length})</span>
                {communityAnnouncements.filter(p => p.status === 'pending').length > 0 && (
                  <span className="bg-amber-100 text-amber-950 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {communityAnnouncements.filter(p => p.status === 'pending').length} جديد
                  </span>
                )}
              </button>
            </div>

            {newsSubSection === 'articles' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center flex-row-reverse border-b border-gray-100 pb-4">
                  <div className="text-right">
                    <h3 className="font-extrabold text-lg text-emerald-950">محرر الأخبار والفعاليات العامة</h3>
                    <p className="text-xs text-gray-400">أضف الأخبار، تحكم بنسب القراء، وإدارة تبويبات الأخبار للأهالي</p>
                  </div>
                  <button
                    onClick={handleOpenAddNews}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    إضافة ونشر خبر جديد
                  </button>
                </div>

                {/* News Categories / Tabs Management Card */}
                <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-900/10 space-y-4 text-right" dir="rtl">
                  <div className="flex items-center justify-between flex-row-reverse">
                    <div className="flex items-center gap-2 flex-row-reverse">
                      <FolderPlus className="h-5 w-5 text-amber-800" />
                      <div>
                        <h4 className="font-extrabold text-sm text-emerald-950">إدارة تبويبات وتصنيفات الأخبار</h4>
                        <p className="text-[11px] text-gray-500">قم بإضافة تبويبات جديدة للأخبار (مثل: أخبار عامة، بلدي، اجتماعي...) أو تعديل المسميات الحالية</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-start items-center">
                    {currentNewsCategories.map((cat, idx) => (
                      <div key={idx} className="bg-white border border-amber-900/15 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-xs">
                        {editingNewsCatIndex === idx ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingNewsCatValue}
                              onChange={(e) => setEditingNewsCatValue(e.target.value)}
                              className="w-28 px-2 py-0.5 border border-emerald-600 rounded text-xs outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleEditNewsCategory(idx)}
                              className="text-emerald-700 hover:text-emerald-900 font-bold text-xs cursor-pointer"
                            >
                              حفظ
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNewsCatIndex(null)}
                              className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-emerald-950">{cat}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNewsCatIndex(idx);
                                setEditingNewsCatValue(cat);
                              }}
                              className="text-gray-400 hover:text-emerald-700 transition-colors cursor-pointer"
                              title="تعديل اسم التبويب"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNewsCategory(cat)}
                              className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="حذف هذا التبويب"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add new tab input */}
                  <div className="flex gap-2 max-w-md flex-row-reverse items-center pt-1">
                    <input
                      type="text"
                      placeholder="اسم التبويب الإخباري الجديد (مثلاً: أخبار عاجلة، تقارير...)"
                      value={newNewsCatInput}
                      onChange={(e) => setNewNewsCatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddNewsCategory();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-white border border-amber-900/20 rounded-xl outline-none text-xs text-right focus:border-emerald-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddNewsCategory()}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      إضافة تبويب
                    </button>
                  </div>
                </div>

            <div className="space-y-4">
              {newsList.map((news) => (
                <div key={news.id} className="p-4 sm:p-5 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-emerald-700/10 transition-all space-y-4 text-right">
                  <div className="flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-row-reverse text-right">
                      <img 
                        src={news.image} 
                        alt="" 
                        className="w-14 h-14 rounded-xl object-cover shrink-0 bg-gray-200"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/qara_news_fallback/150/150" }}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-row-reverse justify-end">
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">{news.category}</span>
                          <span className="text-[10px] text-gray-400">{news.date}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">{news.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-start">
                      <div className="text-xs text-gray-400 font-mono space-y-0.5 text-right sm:text-left">
                        <p>المشاهدات: {news.views}</p>
                        <p>الإعجابات: {news.likes}</p>
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleOpenEditNews(news)}
                          className="p-1.5 bg-white text-emerald-800 border border-gray-200 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="تحرير المقال"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(news.id)}
                          className="p-1.5 bg-white text-red-600 border border-gray-200 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="حذف المقال"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comments section under each news article */}
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div className="flex items-center justify-between flex-row-reverse">
                      <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-emerald-800" />
                        التعليقات والمناقشات ({news.comments ? news.comments.length : 0})
                      </span>
                    </div>

                    {news.comments && news.comments.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {news.comments.map((comment) => (
                          <div 
                            key={comment.id} 
                            className="p-3 bg-white border border-gray-100 rounded-xl flex items-start justify-between gap-4 text-right flex-row-reverse"
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 flex-row-reverse">
                                <span className="text-xs font-bold text-emerald-950">{comment.author}</span>
                                <span className="text-[9px] text-gray-400 font-mono">{comment.date}</span>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed font-sans">{comment.content}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteComment(news.id, comment.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer shrink-0"
                              title="حذف هذا التعليق"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-400 font-sans italic text-right">لا يوجد أي تعليقات على هذا الخبر بعد.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

          {newsSubSection === 'community' && (
            <div className="space-y-8 text-right" dir="rtl">
              <div className="border-b border-gray-100 pb-4">
              <h3 className="font-extrabold text-lg text-emerald-950">إدارة منبر ومناسبات الأهالي</h3>
              <p className="text-xs text-gray-400">تحكّم في مظهر شريط الأخبار المتحرك للأهالي، وقُم بمراجعة، تعديل وتدقيق، أو حذف المشاركات المجتمعية قبل نشرها للعامة.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Customization Settings */}
              <div className="lg:col-span-5 bg-gray-50/70 p-6 rounded-3xl border border-gray-100 space-y-6">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Sliders className="h-5 w-5 text-emerald-800" />
                  <h4 className="font-bold text-sm text-emerald-950">تخصيص مظهر وحركة شريط الأهالي</h4>
                </div>

                <form onSubmit={handleSaveCommunitySettings} className="space-y-4 text-right">
                  {/* Speed Controller */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">سرعة حركة التمرير (بالثواني)</label>
                    <div className="flex items-center gap-4 flex-row-reverse">
                      <input 
                        type="range" 
                        min="5" 
                        max="60" 
                        value={commScrollSpeed} 
                        onChange={(e) => setCommScrollSpeed(Number(e.target.value))}
                        className="w-full accent-emerald-800" 
                      />
                      <span className="text-xs font-mono font-bold text-emerald-950 w-12 text-center bg-white border px-2 py-1 rounded">
                        {commScrollSpeed}ث
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {commScrollSpeed <= 10 ? "تمرير سريع جداً" : commScrollSpeed <= 25 ? "تمرير معتدل" : "تمرير بطيء ومريح للقرائة"}
                    </p>
                  </div>

                  {/* Height Controller */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">ارتفاع صندوق منبر الأهالي (بكسل)</label>
                    <div className="flex items-center gap-4 flex-row-reverse">
                      <input 
                        type="range" 
                        min="250" 
                        max="800" 
                        step="10"
                        value={commScrollHeight} 
                        onChange={(e) => setCommScrollHeight(Number(e.target.value))}
                        className="w-full accent-emerald-800" 
                      />
                      <span className="text-xs font-mono font-bold text-emerald-950 w-16 text-center bg-white border px-2 py-1 rounded">
                        {commScrollHeight}px
                      </span>
                    </div>
                  </div>

                  {/* Font Size & Padding */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700">حجم خط الرسائل</label>
                      <select 
                        value={commItemFontSize}
                        onChange={(e) => setCommItemFontSize(e.target.value as any)}
                        className="w-full text-xs p-2.5 rounded-xl bg-white border border-gray-200 outline-none focus:border-emerald-800 text-right"
                      >
                        <option value="xs">صغير جداً</option>
                        <option value="sm">صغير</option>
                        <option value="base">متوسط</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700">المساحة الداخلية (حشو)</label>
                      <select 
                        value={commItemPadding}
                        onChange={(e) => setCommItemPadding(e.target.value as any)}
                        className="w-full text-xs p-2.5 rounded-xl bg-white border border-gray-200 outline-none focus:border-emerald-800 text-right"
                      >
                        <option value="3">ضيق (p-3)</option>
                        <option value="4">عادي (p-4)</option>
                        <option value="5">واسع (p-5)</option>
                        <option value="6">واسع جداً (p-6)</option>
                      </select>
                    </div>
                  </div>

                  {/* Colors Customizer Grid */}
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <h5 className="text-xs font-bold text-emerald-900">تعديل لوحة الألوان المخصصة</h5>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {/* Box Bg */}
                      <div className="flex items-center justify-between gap-2 border bg-white p-2 rounded-xl">
                        <input 
                          type="color" 
                          value={commBgColor} 
                          onChange={(e) => setCommBgColor(e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0"
                        />
                        <span className="text-gray-600 font-medium">خلفية اللوحة</span>
                      </div>

                      {/* Box Title Color */}
                      <div className="flex items-center justify-between gap-2 border bg-white p-2 rounded-xl">
                        <input 
                          type="color" 
                          value={commTitleColor} 
                          onChange={(e) => setCommTitleColor(e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0"
                        />
                        <span className="text-gray-600 font-medium">عنوان اللوحة</span>
                      </div>

                      {/* Item Bg */}
                      <div className="flex items-center justify-between gap-2 border bg-white p-2 rounded-xl">
                        <input 
                          type="color" 
                          value={commItemBgColor} 
                          onChange={(e) => setCommItemBgColor(e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0"
                        />
                        <span className="text-gray-600 font-medium">خلفية الخبر</span>
                      </div>

                      {/* Item Border */}
                      <div className="flex items-center justify-between gap-2 border bg-white p-2 rounded-xl">
                        <input 
                          type="color" 
                          value={commBorderColor} 
                          onChange={(e) => setCommBorderColor(e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0"
                        />
                        <span className="text-gray-600 font-medium">لون الحدود</span>
                      </div>

                      {/* Item Text */}
                      <div className="flex items-center justify-between gap-2 border bg-white p-2 rounded-xl">
                        <input 
                          type="color" 
                          value={commItemTextColor} 
                          onChange={(e) => setCommItemTextColor(e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0"
                        />
                        <span className="text-gray-600 font-medium">نص الخبر</span>
                      </div>

                      {/* Item Title */}
                      <div className="flex items-center justify-between gap-2 border bg-white p-2 rounded-xl">
                        <input 
                          type="color" 
                          value={commItemTitleColor} 
                          onChange={(e) => setCommItemTitleColor(e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0"
                        />
                        <span className="text-gray-600 font-medium">عنوان الخبر</span>
                      </div>

                      {/* Date Text */}
                      <div className="flex items-center justify-between gap-2 border bg-white p-2 rounded-xl">
                        <input 
                          type="color" 
                          value={commDateColor} 
                          onChange={(e) => setCommDateColor(e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0"
                        />
                        <span className="text-gray-600 font-medium">لون التاريخ</span>
                      </div>

                      {/* Heart Color */}
                      <div className="flex items-center justify-between gap-2 border bg-white p-2 rounded-xl">
                        <input 
                          type="color" 
                          value={commHeartColor} 
                          onChange={(e) => setCommHeartColor(e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0"
                        />
                        <span className="text-gray-600 font-medium">زر الإعجاب</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-2xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    حفظ خيارات وتصميم اللوحة
                  </button>
                </form>

                {/* Real-time Styling Live Card Preview */}
                <div className="p-4 bg-white border border-gray-100 rounded-2xl space-y-3 text-right">
                  <p className="text-[10px] font-bold text-gray-400">معاينة حية لتصميم الكرت طبقاً للألوان المختارة:</p>
                  <div 
                    className="border rounded-xl text-right relative transition-all"
                    style={{
                      backgroundColor: commItemBgColor,
                      borderColor: commBorderColor,
                      padding: commItemPadding === '3' ? '12px' : commItemPadding === '4' ? '16px' : commItemPadding === '5' ? '20px' : '24px',
                      fontSize: commItemFontSize === 'xs' ? '12px' : commItemFontSize === 'sm' ? '14px' : '16px',
                      color: commItemTextColor
                    }}
                  >
                    <span className="absolute top-3 left-3 text-[9px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-sans">معاينة حية</span>
                    <h6 className="font-bold" style={{ color: commItemTitleColor }}>عنوان الإعلان التجريبي للبلدة</h6>
                    <p className="mt-1 opacity-90 text-[11px] leading-relaxed">هذا نص عينة لتوضيح حجم الخط ولون النص والحدود طبقاً للخيارات الحالية التي تم اختيارها من قبلك.</p>
                    <div className="flex items-center justify-between flex-row-reverse pt-2 border-t border-black/5 text-[9px] mt-2">
                      <span className="font-bold flex items-center gap-1" style={{ color: commHeartColor }}>
                        ❤️ زر التفاعل واللايك
                      </span>
                      <span style={{ color: commDateColor }}>اليوم، 12:30 م</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Moderation list */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex gap-2 text-xs flex-row-reverse">
                    {[
                      { id: 'all', label: 'الكل' },
                      { id: 'pending', label: `بانتظار الموافقة (${communityAnnouncements.filter(a => a.status === 'pending').length})` },
                      { id: 'approved', label: 'المنشورة والمعتمدة' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setCommunityFilter(tab.id as any)}
                        className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                          communityFilter === tab.id
                            ? 'bg-amber-500 text-emerald-950 shadow-sm'
                            : 'bg-white text-gray-600 border border-gray-150 hover:bg-gray-50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <h4 className="font-bold text-sm text-emerald-950">قائمة مشاركات ومناسبات الأهالي</h4>
                </div>

                {/* List Container */}
                <div className="space-y-4">
                  {(() => {
                    const filtered = communityAnnouncements.filter(ann => {
                      if (communityFilter === 'pending') return ann.status === 'pending';
                      if (communityFilter === 'approved') return ann.status !== 'pending';
                      return true;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="py-16 text-center text-gray-400 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                          <ClipboardList className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                          <p className="text-xs font-semibold">لا يوجد مشاركات تتبع لهذا التصنيف حالياً.</p>
                        </div>
                      );
                    }

                    return filtered.map((ann) => {
                      const isEditing = editingAnnId === ann.id;

                      if (isEditing) {
                        return (
                          <form 
                            key={ann.id} 
                            onSubmit={handleSaveEditCommunity}
                            className="p-5 rounded-2xl border-2 border-amber-400 bg-amber-50/20 space-y-4 text-right animate-fadeIn"
                          >
                            <div className="flex justify-between items-center border-b border-amber-200 pb-2 flex-row-reverse">
                              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                                <Edit3 className="h-3 w-3" />
                                تحرير وتصحيح رسالة المشارك
                              </span>
                              <button 
                                type="button" 
                                onClick={() => setEditingAnnId(null)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-gray-700">اسم صاحب المشاركة</label>
                                <input 
                                  type="text" 
                                  value={editAnnAuthor}
                                  onChange={(e) => setEditAnnAuthor(e.target.value)}
                                  className="w-full text-xs p-2.5 rounded-xl bg-white border border-gray-200 outline-none focus:border-emerald-800 text-right font-sans"
                                  placeholder="اسم المشارك"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-gray-700">التصنيف</label>
                                <select 
                                  value={editAnnCategory}
                                  onChange={(e) => setEditAnnCategory(e.target.value as any)}
                                  className="w-full text-xs p-2.5 rounded-xl bg-white border border-gray-200 outline-none focus:border-emerald-800 text-right font-sans"
                                >
                                  <option value="اجتماعي">اجتماعي</option>
                                  <option value="بلدي">بلدي</option>
                                  <option value="رياضي">رياضي</option>
                                  <option value="ثقافي">ثقافي</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-gray-700">عنوان المشاركة</label>
                              <input 
                                type="text" 
                                value={editAnnTitle}
                                onChange={(e) => setEditAnnTitle(e.target.value)}
                                className="w-full text-xs p-2.5 rounded-xl bg-white border border-gray-200 outline-none focus:border-emerald-800 text-right font-bold text-gray-900 font-sans"
                                placeholder="عنوان الخبر"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-gray-700">نص الرسالة والخبر</label>
                              <textarea 
                                rows={4}
                                value={editAnnContent}
                                onChange={(e) => setEditAnnContent(e.target.value)}
                                className="w-full text-xs p-2.5 rounded-xl bg-white border border-gray-200 outline-none focus:border-emerald-800 text-right leading-relaxed text-gray-700 font-sans"
                                placeholder="اكتب نص الخبر أو التهنئة أو المناسبة هنا..."
                                required
                              />
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                              <button
                                type="button"
                                onClick={() => setEditingAnnId(null)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                              >
                                إلغاء
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="h-3 w-3" />
                                حفظ التعديلات
                              </button>
                            </div>
                          </form>
                        );
                      }

                      return (
                        <div 
                          key={ann.id} 
                          className="p-5 rounded-2xl bg-white border border-gray-150 hover:border-emerald-700/15 transition-all text-right flex flex-col justify-between gap-4"
                        >
                          <div className="space-y-3">
                            {/* Header details */}
                            <div className="flex justify-between items-center flex-row-reverse">
                              <div className="flex items-center gap-2 flex-row-reverse">
                                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">{ann.category}</span>
                                {ann.status === 'pending' ? (
                                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md flex items-center gap-1 flex-row-reverse">
                                    ⏱️ بانتظار الاعتماد
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded-md flex items-center gap-1 flex-row-reverse font-sans">
                                    ✅ منشور على المنبر
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                                {ann.date}
                                <Calendar className="h-3 w-3 inline text-amber-600" />
                              </span>
                            </div>

                            {/* Sender */}
                            <div className="text-xs text-gray-500 font-sans flex items-center gap-1.5 flex-row-reverse">
                              <Users className="h-3.5 w-3.5 text-gray-400" />
                              <span>المرسل: <strong className="text-gray-800">{ann.authorName || ann.authorName === "" ? ann.authorName : "مشارك من الأهالي"}</strong></span>
                            </div>

                            {/* Content body */}
                            <div className="space-y-1">
                              <h5 className="font-extrabold text-sm text-gray-950 leading-relaxed">{ann.title}</h5>
                              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line font-sans bg-gray-50/50 p-3 rounded-xl border border-gray-100">{ann.content}</p>
                            </div>
                          </div>

                          {/* Action footer */}
                          <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-3 flex-row-reverse">
                            <div className="flex gap-1.5 flex-row-reverse">
                              {ann.status === 'pending' && (
                                <button
                                  onClick={() => handleApproveCommunity(ann.id)}
                                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                                  title="موافقة ونشر فوراً"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  موافقة واعتماد النشر
                                </button>
                              )}
                              <button
                                onClick={() => handleStartEditCommunity(ann)}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                title="تحرير النص وتصحيح الأخطاء"
                              >
                                <Edit3 className="h-3.5 w-3.5 text-gray-500" />
                                تعديل وتصحيح
                              </button>
                              <button
                                onClick={() => handleDeleteCommunity(ann.id)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                title="حذف المشاركة"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                                حذف المشاركة
                              </button>
                            </div>

                            {/* Ticker Likes stats */}
                            <div className="text-[10px] text-gray-400 font-semibold font-mono flex items-center gap-1">
                              <span>إعجابات الأهالي: {ann.likes} ❤️</span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )}

        {/* TAB 3: PROJECTS MANAGER */}
        {activeSubTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-row-reverse border-b border-gray-100 pb-4">
              <div className="text-right">
                <h3 className="font-extrabold text-lg text-emerald-950">خطة إدارة المشاريع والموازنات</h3>
                <p className="text-xs text-gray-400">تعديل نسب الإنجاز للمشاريع (الإنارة، الآبار، البنى التحتية) وتحديث الميزانيات</p>
              </div>
              <button
                onClick={handleOpenAddProject}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                إضافة مشروع تنموي
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 flex flex-col justify-between h-56 text-right space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start flex-row-reverse">
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">{proj.category}</span>
                      <span className="text-xs font-mono text-gray-400">تمويل: {proj.budget.split(' ')[0]}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">{proj.title}</h4>
                    
                    {/* Progress Slider Display */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-emerald-950 font-mono">
                        <span>نسبة الإنجاز: {proj.percentage}%</span>
                        <span className="text-gray-400">الحالة: {proj.status}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-800" style={{ width: `${proj.percentage}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between flex-row-reverse text-xs">
                    <span className="text-gray-400">المتطوعين: {proj.volunteersCount} متطوع</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleOpenEditProject(proj)}
                        className="p-1.5 bg-white text-emerald-800 border border-gray-200 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="تعديل المشروع"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1.5 bg-white text-red-600 border border-gray-200 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="إلغاء المشروع"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CITIZENS REQUESTS & SUGGESTIONS */}
        {activeSubTab === 'citizens' && (
          <div className="space-y-8">
            {/* Service Requests */}
            <div className="space-y-4 text-right">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-base text-emerald-950 flex items-center justify-end gap-1.5">
                  <span>طلبات المعاملات المبدئية للمواطنين ({requests.length})</span>
                  <ClipboardList className="h-5 w-5 text-emerald-800" />
                </h3>
                <p className="text-xs text-gray-400">الطلبات التي يقدمها الأهالي إلكترونياً لتسهيل الاستخراج</p>
              </div>

              {requests.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {requests.map((req) => (
                    <div key={req.id} className="p-4 rounded-2xl bg-emerald-50/30 border border-emerald-950/5 space-y-3 relative text-right">
                      <button
                        onClick={() => handleDeleteRequest(req.id)}
                        className="absolute left-3 top-3 p-1 hover:text-red-500 text-gray-400 transition-colors cursor-pointer"
                        title="حذف/أرشفة الطلب"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="space-y-1">
                        <span className="text-[10px] text-amber-800 font-mono font-bold">{req.dateSubmitted}</span>
                        <h4 className="font-bold text-xs text-emerald-950 max-w-[85%] leading-relaxed">{req.serviceName}</h4>
                      </div>

                      <div className="text-xs text-gray-600 space-y-1 leading-normal font-sans">
                        <p><span className="font-bold text-gray-800">الاسم:</span> {req.applicantName}</p>
                        <p><span className="font-bold text-gray-800">رقم الهاتف:</span> {req.phoneNumber}</p>
                        {req.notes && <p className="bg-white p-2 rounded-lg border border-gray-100 text-[11px] text-gray-500">{req.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-xs">لم يتقدم أي مواطن بطلبات معاملات رقمية مبدئية حتى الآن.</p>
                </div>
              )}
            </div>

            {/* Suggestions Box */}
            <div className="space-y-4 text-right pt-4 border-t border-gray-100">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-base text-emerald-950 flex items-center justify-end gap-1.5">
                  <span>مقترحات ومبادرات الأهالي ({suggestions.length})</span>
                  <Sprout className="h-5 w-5 text-emerald-800" />
                </h3>
                <p className="text-xs text-gray-400">الأفكار التنموية المقترحة من قبل المغتربين وأهالي قارة</p>
              </div>

              {suggestions.length > 0 ? (
                <div className="space-y-4">
                  {suggestions.map((sug) => (
                    <div key={sug.id} className="p-5 rounded-3xl bg-amber-50/10 border border-amber-900/10 space-y-4 relative text-right flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center flex-row-reverse">
                          <div className="flex items-center gap-2 flex-row-reverse">
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-full">{sug.category}</span>
                            {sug.status === 'pending' ? (
                              <span className="text-[10px] font-extrabold bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full">
                                ⏳ بانتظار المراجعة والاعتماد
                              </span>
                            ) : (
                              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-950 px-2.5 py-0.5 rounded-full">
                                ✅ منشور في البوابة العامة
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">{sug.date}</span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-gray-950 text-xs sm:text-sm leading-relaxed">{sug.title}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed font-sans bg-white p-3 rounded-xl border border-gray-100">{sug.content}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 pt-1 flex-row-reverse justify-end">
                            <span>✍️ صاحب المقترح: <strong>{sug.author}</strong></span>
                            <span className="text-gray-300">|</span>
                            <span>👍 تصويت المشاهدين: <strong>{sug.likes} صوتاً</strong></span>
                            <span className="text-gray-300">|</span>
                            
                            {/* Municipality Vote Indicator */}
                            <span className="flex items-center gap-1 flex-row-reverse">
                              <span>🗳️ تصويت البلدية: </span>
                              {sug.municipalityVote === 'approve' && <strong className="text-emerald-700">💚 مؤيد وموافق</strong>}
                              {sug.municipalityVote === 'disagree' && <strong className="text-red-700">❌ معترض / غير ملائم</strong>}
                              {sug.municipalityVote === 'study' && <strong className="text-amber-700">⏱️ قيد الدراسة</strong>}
                              {(sug.municipalityVote === 'none' || !sug.municipalityVote) && <strong className="text-gray-400 font-normal">⏳ لم يصوت بعد</strong>}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Management Action bar */}
                      <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-3 gap-3 flex-row-reverse">
                        <div className="flex flex-wrap gap-2 flex-row-reverse">
                          {/* Approve/Publish Button */}
                          {sug.status !== 'approved' && (
                            <button
                              onClick={() => {
                                const updated = suggestions.map(s => s.id === sug.id ? { ...s, status: 'approved' as const } : s);
                                setSuggestions(updated);
                                triggerNotification('تمت الموافقة على نشر المقترح للعامة بنجاح!');
                              }}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                              title="اعتماد المبادرة ونشرها للعموم"
                            >
                              <Check className="h-3.5 w-3.5" />
                              موافقة ونشر المقترح
                            </button>
                          )}

                          {/* Edit / Spelling Correction Button */}
                          <button
                            onClick={() => {
                              setEditingSug(sug);
                              setSugFormTitle(sug.title);
                              setSugFormContent(sug.content);
                              setSugFormCategory(sug.category);
                            }}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="تعديل وتصحيح الأخطاء الإملائية"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            تعديل وتصحيح إملائي
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteSuggestion(sug.id)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="حذف المقترح نهائياً"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            حذف المقترح
                          </button>
                        </div>

                        {/* Municipality Vote toggler selector */}
                        <div className="flex items-center gap-1.5 flex-row-reverse bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                          <label className="text-[10px] font-bold text-gray-500">تصويت البلدية على المبادرة:</label>
                          <select
                            value={sug.municipalityVote || 'none'}
                            onChange={(e) => {
                              const updated = suggestions.map(s => s.id === sug.id ? { ...s, municipalityVote: e.target.value as any } : s);
                              setSuggestions(updated);
                              triggerNotification('تم تحديث تصويت البلدية على هذا المقترح.');
                            }}
                            className="p-1 text-[11px] font-bold bg-white border border-gray-200 rounded-lg outline-none text-emerald-950 focus:border-emerald-700 cursor-pointer"
                          >
                            <option value="none">⏳ لم يتم التصويت بعد</option>
                            <option value="approve">💚 تأييد وموافقة كاملة</option>
                            <option value="disagree">❌ تحفظ / غير ملائم حالياً</option>
                            <option value="study">⏱️ قيد الدراسة والمراجعة</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-xs">لا يوجد مبادرات مقترحة حالياً.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: STATS & ANALYTICS DASHBOARD */}
        {activeSubTab === 'stats' && (
          <div className="space-y-6 animate-fade-in text-right" dir="rtl">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-extrabold text-lg text-emerald-950 flex items-center justify-end gap-2">
                <span>إدارة الاستمارات والإحصائيات الميدانية</span>
                <ClipboardList className="h-5 w-5 text-emerald-800" />
              </h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                تصميم نماذج الاستبيان، تفعيل وإخفاء الخانات، وإدارة ردود المواطنين وإحصائياتهم الميدانية لبلدة قارة.
              </p>
            </div>
            <AdminSurveyManager
              templates={surveyTemplates}
              setTemplates={setSurveyTemplates}
              responses={surveyResponses}
              setResponses={setSurveyResponses}
            />
          </div>
        )}

        {false && (() => {
          // Calculations
          const totalProjects = projects.length;
          const completedProjects = projects.filter(p => p.status === 'مكتمل' || p.percentage === 100).length;
          const ongoingProjects = projects.filter(p => p.status === 'قيد التنفيذ').length;
          const plannedProjects = projects.filter(p => p.status === 'قيد التخطيط').length;
          
          const totalVolunteers = projects.reduce((sum, p) => sum + (p.volunteersCount || 0), 0);
          
          const totalBudget = projects.reduce((sum, p) => {
            const num = parseInt(p.budget.replace(/[^0-9]/g, ''), 10) || 0;
            return sum + num;
          }, 0);

          const projectData = projects.map(p => {
            const budgetNum = parseInt(p.budget.replace(/[^0-9]/g, ''), 10) || 0;
            return {
              name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
              budget: budgetNum,
              progress: p.percentage,
              volunteers: p.volunteersCount
            };
          });

          // Aggregate by Category
          const categoryAgg = projects.reduce((acc, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const categoryPieData = Object.entries(categoryAgg).map(([name, value]) => ({
            name,
            value
          }));

          // Colors for pie slices
          const PIE_COLORS = ['#047857', '#fbbf24', '#0ea5e9', '#ec4899', '#8b5cf6'];

          // Simulated visitor stats over the last 7 days
          const dailyVisitors = [
            { day: 'السبت', 'المشاهدات': 1420, 'الزوار الفريدين': 450, 'طلب خدمة': 12 },
            { day: 'الأحد', 'المشاهدات': 1850, 'الزوار الفريدين': 580, 'طلب خدمة': 19 },
            { day: 'الإثنين', 'المشاهدات': 2400, 'الزوار الفريدين': 720, 'طلب خدمة': 28 },
            { day: 'الثلاثاء', 'المشاهدات': 2100, 'الزوار الفريدين': 640, 'طلب خدمة': 15 },
            { day: 'الأربعاء', 'المشاهدات': 2650, 'الزوار الفريدين': 810, 'طلب خدمة': 32 },
            { day: 'الخميس', 'المشاهدات': 3200, 'الزوار الفريدين': 950, 'طلب خدمة': 41 },
            { day: 'الجمعة', 'المشاهدات': 3900, 'الزوار الفريدين': 1200, 'طلب خدمة': 54 }
          ];

          // Monthly visitor growth (Jan - Jul)
          const monthlyTraffic = [
            { month: 'يناير', 'الزوار': 5200, 'نسبة التفاعل': 65 },
            { month: 'فبراير', 'الزوار': 6800, 'نسبة التفاعل': 68 },
            { month: 'مارس', 'الزوار': 8900, 'نسبة التفاعل': 72 },
            { month: 'أبريل', 'الزوار': 11400, 'نسبة التفاعل': 70 },
            { month: 'مايو', 'الزوار': 14200, 'نسبة التفاعل': 75 },
            { month: 'يونيو', 'الزوار': 18500, 'نسبة التفاعل': 82 },
            { month: 'يوليو', 'الزوار': draftHome.visitorCounterValue || 21540, 'نسبة التفاعل': 88 }
          ];

          // Source of traffic simulated
          const trafficSources = [
            { name: 'بحث جوجل المباشر', value: 45, color: '#047857' },
            { name: 'وسائل التواصل الاجتماعي', value: 25, color: '#f59e0b' },
            { name: 'رابط مباشر للبلدة', value: 20, color: '#0d9488' },
            { name: 'روافد أخرى ومغتربين', value: 10, color: '#7c3aed' }
          ];

          return (
            <div className="space-y-8 animate-fade-in text-right">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start flex-row-reverse border-b border-gray-100 pb-5 gap-4">
                <div className="text-right">
                  <h3 className="font-extrabold text-lg text-emerald-950 flex items-center justify-end gap-2">
                    <span>لوحة التقارير والرسوم البيانية الذكية</span>
                    <TrendingUp className="h-5 w-5 text-indigo-700 animate-pulse" />
                  </h3>
                  <p className="text-xs text-gray-500 font-medium font-sans mt-0.5">
                    تحليل فوري وتفاعلي لمدى تقدم المشاريع التنموية ببلدة قارة ومؤشرات تفاعل وزيارة المواطنين للبوابة
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-full text-[10px] font-extrabold">تحديث تلقائي مفعّل</span>
                  <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold">Recharts 2.12</span>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* KPI 1: Visitors */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-indigo-100/10 border border-indigo-100 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-600/5 rounded-bl-full transition-all group-hover:scale-110"></div>
                  <div className="flex justify-between items-start flex-row-reverse z-10">
                    <span className="p-2.5 bg-indigo-100/80 text-indigo-800 rounded-xl">
                      <Users className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">العداد العام</span>
                  </div>
                  <div className="mt-4 z-10">
                    <p className="text-[11px] font-bold text-gray-500 font-sans">إجمالي الزوار المسجلين</p>
                    <h4 className="text-2xl font-extrabold text-indigo-950 font-mono mt-0.5">
                      {(draftHome.visitorCounterValue || 21540).toLocaleString()}
                    </h4>
                    <p className="text-[9px] text-emerald-600 font-bold mt-1">▲ 14% زيادة هذا الأسبوع</p>
                  </div>
                </div>

                {/* KPI 2: Projects Budget */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-emerald-100/10 border border-emerald-100 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-600/5 rounded-bl-full transition-all group-hover:scale-110"></div>
                  <div className="flex justify-between items-start flex-row-reverse z-10">
                    <span className="p-2.5 bg-emerald-100/80 text-emerald-800 rounded-xl">
                      <DollarSign className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">التمويل المرصود</span>
                  </div>
                  <div className="mt-4 z-10">
                    <p className="text-[11px] font-bold text-gray-500 font-sans">إجمالي ميزانيات المشاريع</p>
                    <h4 className="text-2xl font-extrabold text-emerald-950 font-mono mt-0.5">
                      ${totalBudget.toLocaleString()}
                    </h4>
                    <p className="text-[9px] text-emerald-700 font-bold mt-1">موزعة على {totalProjects} مشاريع تنموية</p>
                  </div>
                </div>

                {/* KPI 3: Volunteers */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/50 to-amber-100/10 border border-amber-100 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-600/5 rounded-bl-full transition-all group-hover:scale-110"></div>
                  <div className="flex justify-between items-start flex-row-reverse z-10">
                    <span className="p-2.5 bg-amber-100/80 text-amber-800 rounded-xl">
                      <Heart className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">العمل التطوعي</span>
                  </div>
                  <div className="mt-4 z-10">
                    <p className="text-[11px] font-bold text-gray-500 font-sans">عدد المتطوعين النشطين</p>
                    <h4 className="text-2xl font-extrabold text-amber-950 font-mono mt-0.5">
                      {totalVolunteers}
                    </h4>
                    <p className="text-[9px] text-amber-700 font-bold mt-1">مشاركون في مختلف اللجان الأهلية</p>
                  </div>
                </div>

                {/* KPI 4: Completion Ratio */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/50 to-rose-100/10 border border-rose-100 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-rose-600/5 rounded-bl-full transition-all group-hover:scale-110"></div>
                  <div className="flex justify-between items-start flex-row-reverse z-10">
                    <span className="p-2.5 bg-rose-100/80 text-rose-800 rounded-xl">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">معدل الإنجاز</span>
                  </div>
                  <div className="mt-4 z-10">
                    <p className="text-[11px] font-bold text-gray-500 font-sans">المشاريع المكتملة والمستمرة</p>
                    <h4 className="text-2xl font-extrabold text-rose-950 font-mono mt-0.5">
                      {completedProjects} / {totalProjects}
                    </h4>
                    <p className="text-[9px] text-gray-500 font-bold mt-1">
                      {ongoingProjects} قيد التنفيذ حالياً | {plannedProjects} قيد التخطيط
                    </p>
                  </div>
                </div>

              </div>

              {/* Main Charts Row 1: Visitor Growth & Project Budgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Chart 1.1: Web Visitor Growth (Area Chart) - Occupies 2 cols */}
                <div className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm lg:col-span-2 text-right space-y-4">
                  <div className="flex justify-between items-center flex-row-reverse border-b border-gray-50 pb-3">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 font-sans">منحنى نمو زيارات البوابة وتفاعل الأهالي شهرياً</h4>
                    <span className="text-[10px] text-gray-400 font-mono">الزيارات الشهرية التراكمية</span>
                  </div>
                  
                  <div className="h-64 sm:h-72 w-full text-[10px] sm:text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyTraffic}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorVisitor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4338ca" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#4338ca" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '12px',
                            textAlign: 'right',
                            fontFamily: 'sans-serif'
                          }}
                        />
                        <Legend verticalAlign="top" height={36}/>
                        <Area 
                          type="monotone" 
                          name="الزوار والمغتربين" 
                          dataKey="الزوار" 
                          stroke="#4338ca" 
                          fillOpacity={1} 
                          fill="url(#colorVisitor)" 
                          strokeWidth={3}
                        />
                        <Area 
                          type="monotone" 
                          name="مؤشر تفاعل المعاملات (%)" 
                          dataKey="نسبة التفاعل" 
                          stroke="#059669" 
                          fillOpacity={1} 
                          fill="url(#colorEngagement)" 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-gray-400 text-right leading-relaxed font-sans font-medium pt-1">
                    * تعكس الإحصائيات تصاعداً مستمراً للزيارات والخدمات الإلكترونية تزامناً مع إطلاق الخدمات والمعاملات الرقمية الجديدة لربط المغتربين بالبلدة.
                  </p>
                </div>

                {/* Chart 1.2: Projects Categories distribution (Pie Chart) - Occupies 1 col */}
                <div className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm text-right space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center flex-row-reverse border-b border-gray-50 pb-3">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 font-sans">توزيع المشاريع التنموية</h4>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">حسب القطاع والنوع</span>
                    </div>

                    <div className="h-56 sm:h-64 w-full relative flex items-center justify-center">
                      {categoryPieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryPieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              outerRadius={70}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {categoryPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #e5e7eb', 
                                borderRadius: '12px',
                                textAlign: 'right'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <span className="text-xs text-gray-400">لا يوجد بيانات لعرض القطاعات</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-gray-50">
                    <p className="text-[10px] font-bold text-gray-700">دليل قطاعات التنمية في بلدة قارة:</p>
                    <div className="grid grid-cols-2 gap-1.5 text-[9px] text-gray-500 font-sans">
                      {categoryPieData.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-1.5 justify-end flex-row-reverse">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                          <span className="truncate">{item.name} ({item.value})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Main Charts Row 2: Project Budgets & Daily Visitors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 2.1: Project Budgets comparison (Bar Chart) */}
                <div className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm text-right space-y-4">
                  <div className="flex justify-between items-center flex-row-reverse border-b border-gray-50 pb-3">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 font-sans">الميزانيات المرصودة لمشاريع قارة النشطة ($)</h4>
                    <span className="text-[10px] text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-full">مقارنة مالية</span>
                  </div>

                  <div className="h-64 sm:h-72 w-full text-[10px] sm:text-xs">
                    {projectData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={projectData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                          <XAxis dataKey="name" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip 
                            formatter={(value: any) => [`$${value.toLocaleString()}`, 'الميزانية']}
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e5e7eb', 
                              borderRadius: '12px',
                              textAlign: 'right'
                            }}
                          />
                          <Bar dataKey="budget" name="الميزانية المرصودة ($)" fill="#0284c7" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">لا يوجد مشاريع مسجلة حالياً</div>
                    )}
                  </div>
                </div>

                {/* Chart 2.2: Daily traffic & submission rates (Line & Area Chart) */}
                <div className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm text-right space-y-4">
                  <div className="flex justify-between items-center flex-row-reverse border-b border-gray-50 pb-3">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 font-sans">توزيع الزيارات اليومية ونسب طلبات المعاملات الأسبوعية</h4>
                    <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full">نشاط أسبوعي مفصل</span>
                  </div>

                  <div className="h-64 sm:h-72 w-full text-[10px] sm:text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dailyVisitors}
                        margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '12px',
                            textAlign: 'right'
                          }}
                        />
                        <Legend verticalAlign="top" height={36}/>
                        <Line type="monotone" dataKey="الزوار الفريدين" name="الزوار الفريدين" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="طلب خدمة" name="طلبات الخدمات المقدمة" stroke="#10b981" strokeWidth={2.5} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Extra Interactive Analytics Row: Traffic channels & tips */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {/* Traffic Source bars */}
                <div className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm text-right space-y-3 md:col-span-2">
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 font-sans">توزيع قنوات الوصول ومصادر ترافيك الموقع</h4>
                  <p className="text-[11px] text-gray-400">تحليل القنوات التي يسلكها زوار وأبناء بلدة قارة للوصول للمنصة</p>
                  
                  <div className="space-y-3.5 pt-3">
                    {trafficSources.map(source => (
                      <div key={source.name} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-semibold text-gray-700 flex-row-reverse">
                          <span>{source.name}</span>
                          <span className="font-mono font-bold text-emerald-900">{source.value}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000" 
                            style={{ 
                              width: `${source.value}%`, 
                              backgroundColor: source.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local growth highlights */}
                <div className="p-5 rounded-3xl border border-amber-900/10 bg-amber-50/10 text-right space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100/55 px-2.5 py-1 rounded-full font-sans">توصيات وتحليلات الأداء</span>
                    <h4 className="font-bold text-xs sm:text-sm text-emerald-950 font-sans">تنمية البيانات والعمل الأهلي</h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
                      تظهر المؤشرات أن إضافة ميزة <strong>المعاملات الرقمية وتتبع المشاريع</strong> زادت من معدلات بقاء الزوار داخل البوابة بنسبة تفوق <strong>42%</strong>. 
                    </p>
                    <p className="text-[11px] text-gray-600 leading-relaxed font-sans mt-2">
                      يُوصى بمشاركة روابط تحديثات المشاريع بشكل دوري مع أهالي بلدة قارة في المغتربات لتعزيز ميزانيات الدعم والتبرعات المباشرة.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-amber-900/5">
                    <button 
                      type="button"
                      onClick={() => {
                        triggerNotification('تم تصدير تقرير الإحصائيات الكامل بصيغة PDF بنجاح!');
                      }}
                      className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer font-sans text-center"
                    >
                      تصدير تقرير البيانات الكامل (PDF)
                    </button>
                  </div>
                </div>

              </div>

            </div>
          );
        })()}

        {/* TAB 6: MEMBERS & PERMISSIONS MANAGER */}
        {activeSubTab === 'members' && currentUser.role === 'admin' && (
          <div className="space-y-8 animate-fade-in text-right" dir="rtl">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start flex-row-reverse border-b border-gray-100 pb-5 gap-4">
              <div className="text-right">
                <h3 className="font-extrabold text-lg text-emerald-950 flex items-center justify-end gap-2">
                  <span>إدارة أعضاء البوابة وصلاحياتهم المشتركة</span>
                  <Users className="h-5 w-5 text-violet-700" />
                </h3>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  إضافة وإدارة حسابات الموظفين والأعضاء، وتحديد صلاحياتهم المطلقة لتعديل البوابة أو حذف أو تنسيق الأقسام المصرح لهم بها.
                </p>
              </div>
              <button
                onClick={handleOpenAddMember}
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
                تسجيل عضو جديد بالبوابة
              </button>
            </div>

            {/* Quick Security config for General Admin */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 text-right space-y-4">
              <h4 className="font-bold text-sm text-amber-950 flex items-center justify-end gap-1.5">
                <span>إعدادات حساب وحماية المدير العام (مدير الموقع الرئيسي)</span>
                <ShieldCheck className="h-5 w-5 text-amber-700" />
              </h4>
              <p className="text-xs text-gray-600 font-sans">
                اسم مستخدم المدير العام افتراضياً هو <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-bold">admin</code> وله صلاحية حصريّة لتغيير اسم المستخدم الخاص به وكلمة السر المعقدة.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 block">اسم مستخدم المدير العام (English / Numbers) *</label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs text-left font-mono"
                    dir="ltr"
                    placeholder="admin"
                  />
                  {adminUsername && (
                    <p className={`text-[10px] ${validateUsername(adminUsername).isValid ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}`}>
                      {validateUsername(adminUsername).isValid ? '✓ اسم المستخدم مقبول' : validateUsername(adminUsername).message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 block">كلمة مرور المدير العام (10+ أحرف، رموز، أرقام) *</label>
                  <input
                    type="text"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs text-right font-sans"
                    placeholder="كلمة مرور المدير العام"
                  />
                </div>
              </div>

              <PasswordStrengthMeter password={adminPassword} />

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const uVal = validateUsername(adminUsername);
                    if (!uVal.isValid) {
                      alert(uVal.message || 'اسم مستخدم المدير العام غير صالح');
                      return;
                    }
                    const pVal = validatePassword(adminPassword);
                    if (!pVal.isValid) {
                      alert(pVal.message || 'كلمة المرور غير مطابقة لشروط الأمان الخمسة');
                      return;
                    }
                    localStorage.setItem('qara_admin_username', adminUsername);
                    localStorage.setItem('qara_admin_password', adminPassword);
                    triggerNotification('تم حفظ وتحديث بيانات حساب المدير العام بنجاح!');
                  }}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
                >
                  حفظ بيانات حساب المدير العام
                </button>
              </div>
            </div>

            {/* Members List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {members.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-xs font-bold">لا يوجد أي عضو مسجل حالياً بالبوابة</p>
                  <p className="text-[11px] text-gray-400 mt-1 font-sans">اضغط على زر التسجيل أعلاه لإسناد صلاحيات جديدة لأول عضو</p>
                </div>
              ) : (
                members.map((member) => {
                  const permCount = Object.values(member.permissions).filter(Boolean).length;
                  return (
                    <div key={member.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between flex-row-reverse gap-4">
                          <div>
                            <h4 className="font-extrabold text-sm text-gray-900">{member.name}</h4>
                            <p className="text-[11px] text-gray-400 mt-0.5 font-mono">@{member.username}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-violet-50 text-violet-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            <span>{permCount} صلاحيات مفعّلة</span>
                          </div>
                        </div>

                        {/* Credentials box */}
                        <div className="p-3 bg-gray-50 rounded-2xl flex justify-between items-center text-xs font-sans">
                          <span className="text-gray-400">كلمة المرور الحالية:</span>
                          <span className="font-bold text-gray-800 tracking-wider bg-white px-2 py-1 rounded border border-gray-200 font-mono select-all">
                            {member.password}
                          </span>
                        </div>

                        {/* Permissions checklist */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-gray-600 block">الصلاحيات الممنوحة للعضو:</span>
                          <div className="flex flex-wrap gap-1.5 justify-end">
                            {/* editHome */}
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                              member.permissions.editHome 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                : 'bg-gray-100 text-gray-400 line-through'
                            }`}>
                              <CheckCircle className={`h-3 w-3 ${member.permissions.editHome ? 'text-emerald-700' : 'text-gray-300'}`} />
                              تعديل الصفحة الرئيسية
                            </span>

                            {/* editLandmarks */}
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                              member.permissions.editLandmarks 
                                ? 'bg-amber-50 text-amber-900 border border-amber-200' 
                                : 'bg-gray-100 text-gray-400 line-through'
                            }`}>
                              <CheckCircle className={`h-3 w-3 ${member.permissions.editLandmarks ? 'text-amber-700' : 'text-gray-300'}`} />
                              المعالم الأثرية
                            </span>

                            {/* manageGallery */}
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                              member.permissions.manageGallery 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                : 'bg-gray-100 text-gray-400 line-through'
                            }`}>
                              <CheckCircle className={`h-3 w-3 ${member.permissions.manageGallery ? 'text-emerald-700' : 'text-gray-300'}`} />
                              معرض الصور والذكريات
                            </span>

                            {/* digitalServices */}
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                              member.permissions.digitalServices 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                : 'bg-gray-100 text-gray-400 line-through'
                            }`}>
                              <CheckCircle className={`h-3 w-3 ${member.permissions.digitalServices ? 'text-emerald-700' : 'text-gray-300'}`} />
                              الخدمات الرقمية
                            </span>

                            {/* newsAndCommunity */}
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                              member.permissions.newsAndCommunity 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                : 'bg-gray-100 text-gray-400 line-through'
                            }`}>
                              <CheckCircle className={`h-3 w-3 ${member.permissions.newsAndCommunity ? 'text-emerald-700' : 'text-gray-300'}`} />
                              الأخبار ومنبر الأهالي
                            </span>

                            {/* projects */}
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                              member.permissions.projects 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                : 'bg-gray-100 text-gray-400 line-through'
                            }`}>
                              <CheckCircle className={`h-3 w-3 ${member.permissions.projects ? 'text-emerald-700' : 'text-gray-300'}`} />
                              المشاريع التنموية
                            </span>

                            {/* requestsAndSuggestions */}
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                              member.permissions.requestsAndSuggestions 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                : 'bg-gray-100 text-gray-400 line-through'
                            }`}>
                              <CheckCircle className={`h-3 w-3 ${member.permissions.requestsAndSuggestions ? 'text-emerald-700' : 'text-gray-300'}`} />
                              طلبات ومقترحات المواطنين
                            </span>

                            {/* statsAndCharts */}
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                              member.permissions.statsAndCharts 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                : 'bg-gray-100 text-gray-400 line-through'
                            }`}>
                              <CheckCircle className={`h-3 w-3 ${member.permissions.statsAndCharts ? 'text-emerald-700' : 'text-gray-300'}`} />
                              الرسوم البيانية والإحصائيات
                            </span>

                            {/* liveStreamBroadcast */}
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                              member.permissions.liveStreamBroadcast 
                                ? 'bg-rose-100 text-rose-900 border border-rose-300' 
                                : 'bg-gray-100 text-gray-400 line-through'
                            }`}>
                              <Video className={`h-3 w-3 ${member.permissions.liveStreamBroadcast ? 'text-rose-600' : 'text-gray-300'}`} />
                              بث الكمرا المباشر 📹
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card actions */}
                      <div className="flex gap-2 border-t border-gray-100 pt-3 mt-3 flex-row-reverse">
                        <button
                          onClick={() => handleOpenEditMember(member)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-amber-500 hover:text-emerald-950 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer border border-gray-200 transition-all"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>تعديل الصلاحيات</span>
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-800 text-red-700 hover:text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all border border-red-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>سحب الحساب</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 7: PAGES & NAVIGATION MANAGER */}
        {activeSubTab === 'pages' && currentUser.role === 'admin' && (
          <div className="space-y-8 animate-fade-in text-right" dir="rtl">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start flex-row-reverse border-b border-gray-100 pb-5 gap-4">
              <div className="text-right">
                <h3 className="font-extrabold text-lg text-emerald-950 flex items-center justify-end gap-2">
                  <span>إدارة صفحات الموقع وتنسيق القوائم التراثية</span>
                  <Layers className="h-5 w-5 text-sky-700" />
                </h3>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  تفعيل أو إخفاء أي تبويب من تبويبات البوابة، أو إضافة وحذف صفحات مخصصة ومستوحاة من تراث وبيئة قارة القلمونية العريقة.
                </p>
              </div>
            </div>

            {/* SECTION 1: CORE TABS TOGGLES */}
            <div className="bg-amber-50/40 border border-amber-900/5 rounded-3xl p-6 text-right space-y-4 shadow-sm">
              <h4 className="font-extrabold text-sm text-emerald-950 flex items-center justify-end gap-1.5 border-b border-amber-900/5 pb-3">
                <span>التحكم بظهور أو إخفاء التبويبات الأساسية بالموقع</span>
                <Settings className="h-4 w-4 text-emerald-800" />
              </h4>
              <p className="text-xs text-gray-600 font-sans leading-relaxed">
                هنا يمكنك تعطيل أو تفعيل أي تبويب رئيسي بالموقع بشكل فوري لزوار البوابة (مثال: إخفاء صفحة الخدمات الإلكترونية مؤقتاً).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-3">
                {Object.entries({
                  home: 'الرئيسية 🏠',
                  qara_city: 'مدينة قارة 🏛️',
                  news: 'أخبار قارة 📰',
                  projects: 'المشاريع التنموية 🏗️',
                  services: 'الخدمات الإلكترونية 💻',
                  ramadan: 'مسابقة رمضانية 🌙',
                  survey: 'أحصائيات ميدانية 📊',
                  directory: `${homeContent?.directoryPageName || 'الدليل التجاري والخدمي'} 🏪`,
                  gallery: 'معرض الصور 📸'
                }).map(([key, label]) => {
                  const isVisible = visibleTabs[key] !== false;
                  return (
                    <div key={key} className="p-3.5 bg-white border border-gray-100 rounded-2xl flex flex-col gap-2.5 justify-between shadow-sm hover:shadow transition-shadow">
                      <span className="text-[11px] font-bold text-gray-800 text-center">{label}</span>
                      <button
                        type="button"
                        onClick={() => setVisibleTabs({ ...visibleTabs, [key]: !isVisible })}
                        className={`w-full py-1.5 text-[10px] font-bold rounded-xl cursor-pointer transition-all ${
                          isVisible 
                            ? 'bg-emerald-800 text-white shadow-sm hover:bg-emerald-900' 
                            : 'bg-red-50 text-red-700 border border-red-100 hover:bg-red-100'
                        }`}
                      >
                        {isVisible ? 'مفعّل وظاهر' : 'مخفي مؤقتاً 👁️‍🌫️'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {visibleTabs.qara_city !== false && (
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-right space-y-3 mt-4 animate-fade-in">
                  <div className="flex items-center gap-2 text-amber-950 font-extrabold text-xs">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <span>التحكم في إخفاء / إظهار محتوى صفحة مدينة قارة:</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed font-sans">
                    يمكنك إخفاء محتوى الصفحة التعريفية لمدينة قارة مع الحفاظ التام على اسم "مدينة قارة" في القائمة العلوية وعلى كافة الصفحات التابعة لها (أخبار قارة، المعالم الأثرية، والصفحات المخصصة):
                  </p>
                  <div className="flex gap-2 max-w-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setVisibleTabs({ ...visibleTabs, hide_qara_city_content: false });
                        triggerNotification('تمت إعادة إظهار المحتوى الرئيسي لصفحة مدينة قارة.');
                      }}
                      className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        !visibleTabs.hide_qara_city_content
                          ? 'bg-emerald-800 text-white shadow'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      ✓ عرض محتوى صفحة مدينة قارة بالكامل
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVisibleTabs({ ...visibleTabs, hide_qara_city_content: true });
                        triggerNotification('تم إخفاء محتوى صفحة مدينة قارة مع الإبقاء على اسمها وصفحاتها الفرعية ظاهرة وفعالة.');
                      }}
                      className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        visibleTabs.hide_qara_city_content
                          ? 'bg-amber-800 text-white shadow'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      🔒 إخفاء المحتوى الرئيسي (مع إبقاء الاسم والصفحات الفرعية ظاهرة)
                    </button>
                  </div>
                </div>
              )}

              {visibleTabs.survey !== false && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4 text-right space-y-2 mt-4 max-w-md animate-fade-in">
                  <span className="text-xs font-bold text-gray-800 block">مكان عرض صفحة الإحصائيات الميدانية:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setVisibleTabs({ ...visibleTabs, survey_as_sub: false })}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        !visibleTabs.survey_as_sub
                          ? 'bg-emerald-800 text-white shadow'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      تبويب رئيسي في الهيدر العلوي
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibleTabs({ ...visibleTabs, survey_as_sub: true })}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        visibleTabs.survey_as_sub
                          ? 'bg-emerald-800 text-white shadow'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      تبويب فرعي منسدل (تحت الخدمات الإلكترونية)
                    </button>
                  </div>
                </div>
              )}

              {visibleTabs.directory !== false && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4 text-right space-y-2 mt-4 max-w-md animate-fade-in">
                  <span className="text-xs font-bold text-gray-800 block">مكان عرض {homeContent?.directoryPageName || 'الدليل التجاري والخدمي'}:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setVisibleTabs({ ...visibleTabs, directory_as_sub: false })}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        !visibleTabs.directory_as_sub
                          ? 'bg-emerald-800 text-white shadow'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      تبويب رئيسي في الهيدر العلوي
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibleTabs({ ...visibleTabs, directory_as_sub: true })}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        visibleTabs.directory_as_sub
                          ? 'bg-emerald-800 text-white shadow'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      تبويب فرعي منسدل (تحت الخدمات الإلكترونية)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: CREATE NEW CUSTOM PAGE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Add New Page Form */}
              <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                <h4 className="font-extrabold text-sm text-gray-900 flex items-center justify-end gap-1.5 pb-3 border-b border-gray-100">
                  <span>إضافة صفحة مخصصة جديدة</span>
                  <FolderPlus className="h-4.5 w-4.5 text-sky-700" />
                </h4>
                
                <form onSubmit={handleCreateCustomPage} className="space-y-4 text-right">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">عنوان الصفحة الجديد (التبويب) *</label>
                      <input
                        type="text"
                        required
                        value={newPageTitle}
                        onChange={(e) => setNewPageTitle(e.target.value)}
                        placeholder="مثال: حرفيو قارة، معالم بيزنطية..."
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">اختر النموذج التراثي المناسب *</label>
                      <select
                        value={newPageTemplateId}
                        onChange={(e) => setNewPageTemplateId(e.target.value as any)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right font-sans cursor-pointer"
                      >
                        {TEMPLATE_PRESETS.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">شرح مبسط وجاذب لمحتوى الصفحة *</label>
                    <input
                      type="text"
                      required
                      value={newPageDescription}
                      onChange={(e) => setNewPageDescription(e.target.value)}
                      placeholder="اكتب شرحاً قصيراً يعبر عن الصفحة ويظهر أعلى الصفحة وتحت العنوان..."
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">تصنيف التبويب بقوائم الموقع *</label>
                      <select
                        value={newPageIsMain ? 'main' : 'sub'}
                        onChange={(e) => setNewPageIsMain(e.target.value === 'main')}
                        className="w-full p-2.5 bg-white border border-gray-200 focus:border-sky-600 rounded-xl outline-none text-xs text-right font-sans cursor-pointer"
                      >
                        <option value="main">تبويب رئيسي في شريط التنقل العلوي</option>
                        <option value="sub">تبويب فرعي منسدل (تحت تبويب رئيسي)</option>
                      </select>
                    </div>

                    {!newPageIsMain && (
                      <div className="space-y-1 animate-slide-down">
                        <label className="text-xs font-bold text-gray-700 block">اختر التبويب الرئيسي الأب *</label>
                        <select
                          value={newPageParentId}
                          onChange={(e) => setNewPageParentId(e.target.value)}
                          className="w-full p-2.5 bg-white border border-gray-200 focus:border-sky-600 rounded-xl outline-none text-xs text-right font-sans cursor-pointer"
                        >
                          <option value="">-- اختر تبويب رئيسي --</option>
                          <option value="home">الرئيسية</option>
                          <option value="qara_city">مدينة قارة</option>
                          <option value="news">أخبار قارة</option>
                          <option value="projects">المشاريع التنموية</option>
                          <option value="services">الخدمات الإلكترونية</option>
                          <option value="gallery">معرض الصور</option>
                          {customPages.filter(p => p.isMain).map(p => (
                            <option key={p.id} value={p.id}>{p.title} (مخصص)</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      إنشاء الصفحة التراثية وتجهيز القالب
                    </button>
                  </div>
                </form>
              </div>

              {/* Informative tips box */}
              <div className="bg-emerald-950 text-emerald-100 rounded-3xl p-6 flex flex-col justify-between border border-emerald-900 shadow-lg relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-12 translate-x-12">
                  <Building2 className="h-48 w-48" />
                </div>
                <div className="space-y-4">
                  <h4 className="font-extrabold text-amber-400 text-sm flex items-center justify-end gap-1.5 border-b border-emerald-900 pb-3">
                    <span>قوالب التراث السوري والقلموني</span>
                    <Sparkles className="h-4 w-4" />
                  </h4>
                  <p className="text-xs leading-relaxed text-right font-sans text-white/95">
                    بوابة قارة تتبنى رؤية الحفاظ على التراث. عند إنشاء أي صفحة، ستقوم المنصة تلقائياً بتوليد هيكلية تراثية متكاملة بـ 3 أقسام جاهزة ومزودة بنصوص وصور مستوحاة من واقع قارة العريق:
                  </p>
                  <ul className="space-y-2 text-xs text-right pr-2 text-emerald-200 font-sans">
                    <li>🏺 <strong>المهن اليدوية:</strong> توثيق المنسوجات والنحت القلموني.</li>
                    <li>⛪ <strong>المعالم الأثرية:</strong> ككنيسة مار سركيس والجامع الكبير.</li>
                    <li>🏔️ <strong>الغطاء السياحي:</strong> ترويج الكهوف ومسارات جبل دير مار يعقوب.</li>
                  </ul>
                </div>
                <p className="text-[10px] text-emerald-400 font-serif mt-4 text-right border-t border-emerald-900 pt-3">
                  * كأدمن البوابة، يمكنك لاحقاً تعديل كافة الحكايات والنصوص والروابط بحرية مطلقة.
                </p>
              </div>
            </div>

            {/* SECTION 3: EXISTING CUSTOM PAGES LIST */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-gray-900 flex items-center justify-end gap-1.5 pb-2 border-b border-gray-100">
                <span>الصفحات التراثية المخصصة المنشأة حالياً ({customPages.length})</span>
                <Layers className="h-4 w-4 text-sky-700" />
              </h4>

              {customPages.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <Layers className="h-10 w-10 mx-auto text-gray-300 mb-2 animate-pulse" />
                  <p className="text-xs font-bold">لا توجد صفحات مخصصة حتى الآن</p>
                  <p className="text-[11px] text-gray-400 mt-1 font-sans">قم بإنشاء أول صفحة مخصصة من خلال النموذج أعلاه لتوثيق جوانب بلدتنا الغالية قارة</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customPages.map(page => {
                    const isVisible = page.status === 'active';
                    const templateName = TEMPLATE_PRESETS.find(p => p.id === page.templateId)?.name || page.templateId;
                    
                    // Identify parent label
                    let parentLabel = 'تبويب رئيسي علوي';
                    if (!page.isMain && page.parentId) {
                      const defaultParentMap: { [key: string]: string } = {
                        home: 'الرئيسية',
                        qara_city: 'مدينة قارة',
                        news: 'أخبار قارة',
                        projects: 'المشاريع التنموية',
                        services: 'الخدمات الإلكترونية',
                        gallery: 'معرض الصور'
                      };
                      const customParent = customPages.find(cp => cp.id === page.parentId);
                      parentLabel = `فرعي تحت: [${defaultParentMap[page.parentId] || customParent?.title || page.parentId}]`;
                    }

                    return (
                      <div key={page.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between flex-row-reverse gap-3">
                            <div className="text-right">
                              <h5 className="font-extrabold text-sm text-emerald-950">{page.title}</h5>
                              <span className="text-[10px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold inline-block mt-1 font-sans">
                                {parentLabel}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = customPages.map(p => p.id === page.id ? { ...p, status: (isVisible ? 'hidden' : 'active') as 'hidden' | 'active' } : p);
                                setCustomPages(updated);
                                triggerNotification(`تم ${isVisible ? 'إخفاء' : 'تفعيل وإظهار'} الصفحة المخصصة بنجاح.`);
                              }}
                              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer border transition-all ${
                                isVisible 
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100' 
                                  : 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'
                              }`}
                            >
                              {isVisible ? 'مفعّل وظاهر' : 'مخفي مؤقتاً'}
                            </button>
                          </div>

                          <p className="text-xs text-gray-500 font-sans leading-relaxed text-right line-clamp-2">
                            {page.description}
                          </p>

                          <div className="text-[10px] text-gray-400 font-sans text-right pt-2 border-t border-gray-50">
                            <strong>نمط التصميم:</strong> {templateName} ({page.content.sections.length} أقسام تراثية)
                          </div>
                        </div>

                        <div className="flex gap-2 border-t border-gray-50 pt-3 mt-3 flex-row-reverse">
                          <button
                            type="button"
                            onClick={() => handleStartEditCustomPage(page)}
                            className="px-3.5 py-2 bg-sky-50 hover:bg-sky-500 hover:text-white text-sky-800 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all border border-sky-100"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>تعديل المحتوى والأقسام</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomPage(page.id)}
                            className="px-3.5 py-2 bg-red-50 hover:bg-red-700 hover:text-white text-red-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all border border-red-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>حذف الصفحة</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: CITIZEN ACCOUNTS MANAGER */}
        {activeSubTab === 'citizen_accounts' && currentUser.role === 'admin' && (
          <CitizenAccountsManager
            citizens={citizens}
            setCitizens={setCitizens}
            triggerNotification={triggerNotification}
            draftHome={draftHome}
            setDraftHome={setDraftHome}
            setHomeContent={setHomeContent}
          />
        )}

        {/* TAB 9: RAMADAN COMPETITION MANAGER */}
        {activeSubTab === 'ramadan' && (
          <div className="space-y-8 animate-fade-in text-right font-serif" dir="rtl">
            {/* Control Header */}
            <div className="bg-gradient-to-l from-emerald-950 via-emerald-900 to-amber-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-amber-500/20">
              <div className="absolute left-0 top-0 opacity-10 pointer-events-none transform -translate-y-4 translate-x-4">
                <Moon className="h-64 w-64 text-amber-300" />
              </div>
              <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-6 relative z-10 flex-row-reverse">
                <div className="text-right space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-200 px-3 py-1 rounded-full text-xs font-bold font-sans">
                    <Moon className="h-4 w-4 text-amber-300 animate-pulse" />
                    <span>لوحة تحكم المسابقة الرمضانية</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-amber-100">
                    {ramadanSettings.title || 'إدارة مسابقة شهر رمضان المبارك'}
                  </h3>
                  <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
                    يمكنك هنا طرح وإدارة الأسئلة اليومية لشهر رمضان (حتى 30 يوماً)، التحكم بظهور المسابقة للزوار، إضافة حتى 5 خيارات للإجابات، ومتابعة سجل إجابات الأعضاء المسجلين وترتيب المتصدرين.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !ramadanSettings.isCompetitionEnabled;
                      setRamadanSettings({ ...ramadanSettings, isCompetitionEnabled: nextState });
                      setVisibleTabs({ ...visibleTabs, ramadan: nextState });
                      triggerNotification(nextState ? 'تم تفعيل وإظهار المسابقة الرمضانية للزوار.' : 'تم إخفاء المسابقة الرمضانية مؤقتاً.');
                    }}
                    className={`px-5 py-3 rounded-2xl text-xs font-bold font-sans flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer w-full sm:w-auto ${
                      ramadanSettings.isCompetitionEnabled
                        ? 'bg-amber-400 text-emerald-950 hover:bg-amber-300 font-extrabold'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {ramadanSettings.isCompetitionEnabled ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-900" />
                        <span>المسابقة ظاهرة ومفعّلة للزوار</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-amber-300" />
                        <span>المسابقة مخفية مؤقتاً (تفعيل)</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenAddRamadanQuestion}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-sans rounded-2xl shadow flex items-center justify-center gap-2 cursor-pointer transition-all w-full sm:w-auto border border-emerald-400/30"
                  >
                    <Plus className="h-4 w-4" />
                    <span>إضافة سؤال رمضاني جديد</span>
                  </button>
                </div>
              </div>

              {/* Quick Metrics Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-amber-500/20 text-right font-sans">
                <div className="bg-emerald-900/50 border border-emerald-700/50 rounded-2xl p-3.5">
                  <span className="text-[10px] text-emerald-200 block font-bold">إجمالي أسئلة المسابقة</span>
                  <span className="text-lg font-black text-amber-300">{ramadanQuestions.length} / 30 سؤالاً</span>
                </div>
                <div className="bg-emerald-900/50 border border-emerald-700/50 rounded-2xl p-3.5">
                  <span className="text-[10px] text-emerald-200 block font-bold">اليوم النشط إدارياً</span>
                  <span className="text-lg font-black text-amber-300">اليوم {ramadanSettings.activeDay} من رمضان</span>
                </div>
                <div className="bg-emerald-900/50 border border-emerald-700/50 rounded-2xl p-3.5">
                  <span className="text-[10px] text-emerald-200 block font-bold">إجابات الأعضاء المسجلة</span>
                  <span className="text-lg font-black text-amber-300">{ramadanAnswers.length} إجابة</span>
                </div>
                <div className="bg-emerald-900/50 border border-emerald-700/50 rounded-2xl p-3.5">
                  <span className="text-[10px] text-emerald-200 block font-bold">نسبة الإجابات الصحيحة</span>
                  <span className="text-lg font-black text-amber-300">
                    {ramadanAnswers.length > 0 
                      ? `${Math.round((ramadanAnswers.filter(a => a.isCorrect).length / ramadanAnswers.length) * 100)}%` 
                      : '0%'}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            <div className="flex border-b border-gray-200 gap-2 overflow-x-auto pb-1 font-sans">
              <button
                type="button"
                onClick={() => setRamadanActiveSection('questions')}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  ramadanActiveSection === 'questions'
                    ? 'bg-emerald-800 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>إدارة الأسئلة والخيارات ({ramadanQuestions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setRamadanActiveSection('card_design')}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  ramadanActiveSection === 'card_design'
                    ? 'bg-emerald-800 text-white shadow'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Palette className="h-4 w-4 text-amber-600" />
                <span>مظهر بطاقة السؤال والزخارف 🎨</span>
              </button>

              <button
                type="button"
                onClick={() => setRamadanActiveSection('prayer_times')}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  ramadanActiveSection === 'prayer_times'
                    ? 'bg-emerald-800 text-white shadow'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Clock className="h-4 w-4 text-emerald-700" />
                <span>مواقيت صلاة قارة واليوم الهجري 🕌</span>
              </button>

              <button
                type="button"
                onClick={() => setRamadanActiveSection('settings')}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  ramadanActiveSection === 'settings'
                    ? 'bg-emerald-800 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>إعدادات المسابقة والخطوط والفرص ⚙️</span>
              </button>

              <button
                type="button"
                onClick={() => setRamadanActiveSection('sponsors')}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  ramadanActiveSection === 'sponsors'
                    ? 'bg-amber-600 text-slate-950 shadow font-black'
                    : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Volume2 className="h-4 w-4 text-amber-700" />
                <span>إعلانات ورعاة المسابقة 📢 ({(ramadanSettings.sponsorsList || []).length})</span>
              </button>

              <button
                type="button"
                onClick={() => setRamadanActiveSection('submissions')}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  ramadanActiveSection === 'submissions'
                    ? 'bg-emerald-800 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Trophy className="h-4 w-4 text-amber-500" />
                <span>لوحة المتصدرين والنتائج ({ramadanAnswers.length})</span>
              </button>
            </div>

            {/* SECTION 1: QUESTIONS MANAGEMENT */}
            {ramadanActiveSection === 'questions' && (
              <div className="space-y-6">
                {/* Filter and Add Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm font-sans">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-xs font-bold text-gray-700 whitespace-nowrap">تصفية حسب اليوم:</span>
                    <select
                      value={ramadanFilterDay}
                      onChange={(e) => setRamadanFilterDay(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                      className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none cursor-pointer"
                    >
                      <option value="all">كافة أيام شهر رمضان (30 يوماً)</option>
                      {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>اليوم {day} من رمضان</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddRamadanQuestion}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition-colors w-full sm:w-auto justify-center"
                  >
                    <Plus className="h-4 w-4" />
                    <span>طرح سؤال رمضاني جديد</span>
                  </button>
                </div>

                {/* Questions List */}
                {ramadanQuestions.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 p-8 space-y-3 font-sans">
                    <Moon className="h-12 w-12 text-amber-500 mx-auto animate-bounce" />
                    <h4 className="font-bold text-sm text-gray-800">لا توجد أسئلة مضافة في المسابقة الرمضانية حتى الآن</h4>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      قم بالضغط على زر "طرح سؤال رمضاني جديد" لإضافة أول سؤال متعدد الخيارات لشهر رمضان المبارك.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAddRamadanQuestion}
                      className="px-5 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-emerald-900 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      إضافة سؤال الآن
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ramadanQuestions
                      .filter(q => ramadanFilterDay === 'all' || q.dayNumber === ramadanFilterDay)
                      .sort((a, b) => a.dayNumber - b.dayNumber)
                      .map((q) => {
                        const isActiveToday = q.dayNumber === ramadanSettings.activeDay;
                        const submissionsCount = ramadanAnswers.filter(a => a.questionId === q.id).length;

                        return (
                          <div
                            key={q.id}
                            className={`bg-white border rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden transition-all flex flex-col justify-between ${
                              isActiveToday ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <div className="space-y-3">
                              {/* Card Top Info */}
                              <div className="flex items-center justify-between flex-row-reverse gap-2 font-sans">
                                <div className="flex items-center gap-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                                    isActiveToday ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-900 text-amber-300'
                                  }`}>
                                    اليوم {q.dayNumber} من رمضان {isActiveToday ? '(اليوم النشط 🌟)' : ''}
                                  </span>
                                  {q.category && (
                                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold">
                                      {q.category}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Question Text */}
                              <h4 className="font-bold text-sm text-gray-900 leading-relaxed text-right">
                                {q.questionText}
                              </h4>

                              {/* Options List */}
                              <div className="space-y-2 pt-1 font-sans">
                                <span className="text-[10px] text-gray-500 font-bold block">
                                  الخيارات المعروضة ({q.options.length} خيارات):
                                </span>
                                <div className="space-y-1.5">
                                  {q.options.map((option, idx) => {
                                    const isCorrect = idx === q.correctOptionIndex;
                                    const optionLetters = ['أ', 'ب', 'ج', 'د', 'هـ'];

                                    return (
                                      <div
                                        key={idx}
                                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between flex-row-reverse transition-all ${
                                          isCorrect
                                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-extrabold'
                                            : 'bg-gray-50 border-gray-100 text-gray-700'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                            isCorrect ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-700'
                                          }`}>
                                            {optionLetters[idx] || (idx + 1)}
                                          </span>
                                          <span>{option}</span>
                                        </div>
                                        {isCorrect && (
                                          <span className="text-[10px] text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                                            <Check className="h-3 w-3 text-emerald-800" />
                                            الإجابة الصحيحة
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Explanation if available */}
                              {q.explanation && (
                                <p className="text-[11px] text-gray-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100/60 leading-relaxed text-right font-sans">
                                  💡 <strong>التوضيح للزائر:</strong> {q.explanation}
                                </p>
                              )}
                            </div>

                            {/* Card Footer Actions */}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4 flex-row-reverse font-sans">
                              <span className="text-[11px] text-gray-500">
                                عدد إجابات هذا السؤال: <strong>{submissionsCount}</strong>
                              </span>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditRamadanQuestion(q)}
                                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-500 hover:text-white text-sky-800 font-bold text-xs rounded-xl transition-all cursor-pointer border border-sky-100 flex items-center gap-1"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                  <span>تعديل</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRamadanQuestion(q.id)}
                                  className="px-3 py-1.5 bg-red-50 hover:bg-red-700 hover:text-white text-red-700 font-bold text-xs rounded-xl transition-all cursor-pointer border border-red-100 flex items-center gap-1"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>حذف</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 2: CARD DESIGN TEMPLATES & CUSTOMIZATION (تبويب فرعي لمظهر بطاقة السؤال والزخارف والخطوط) */}
            {ramadanActiveSection === 'card_design' && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-8 font-sans">
                <div className="border-b border-gray-100 pb-4 text-right space-y-1">
                  <h4 className="font-extrabold text-base text-emerald-950 flex items-center justify-end gap-2">
                    <span>نماذج تصميم بطاقة السؤال والهوية البصرية والزخارف والخطوط</span>
                    <Palette className="h-5 w-5 text-amber-600" />
                  </h4>
                  <p className="text-xs text-gray-500">
                    اختر النموذج الفني المناسب لبطاقة السؤال، خصص ألوان نصوص السؤال والخيارات، وأضف زخارف أو صور خلفية مع التحكم التام بفرجة الشفافية.
                  </p>
                </div>

                {/* Part 1: Templates / Models List */}
                <div className="space-y-3 text-right">
                  <span className="text-xs font-extrabold text-emerald-950 block">1. اختر النموذج الفني والنمط البصري للبطاقة:</span>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Model 0: Site Identity Brand (NEW REQUESTED MODEL) */}
                    <div 
                      onClick={() => {
                        setRamadanSettings({ ...ramadanSettings, cardTemplate: 'model_site_identity' });
                        triggerNotification('تم اعتماد نموذج هوية الموقع البصرية الأصيلة!');
                      }}
                      className={`rounded-3xl p-5 border-2 cursor-pointer transition-all space-y-4 relative overflow-hidden ${
                        ramadanSettings.cardTemplate === 'model_site_identity'
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white shadow-xl'
                          : 'border-gray-200 bg-emerald-950 text-emerald-50 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex justify-between items-center flex-row-reverse">
                        <span className="px-3 py-1 bg-amber-400 text-emerald-950 text-xs font-black rounded-full shadow">
                          نموذج الهوية: هوية الموقع الأصيلة 🌲✨
                        </span>
                        {ramadanSettings.cardTemplate === 'model_site_identity' && (
                          <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-md border border-amber-400/40">
                            مفعّل حالياً ✓
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
                        نموذج مخصص يحاكي ألوان الهوية البصرية الرئيسية للموقع تماماً (الأخضر الزمردي الغني، اللمسات الذهبية الملكية والأبيض الناصع للخيارات).
                      </p>

                      <div className="p-4 rounded-2xl bg-emerald-900/90 border border-emerald-400/60 text-center space-y-2 shadow-inner">
                        <div className="text-[11px] text-amber-300 font-serif">🌲 بوابة قارة - الهوية الرسمية 🌲</div>
                        <div className="text-xs font-bold text-amber-100">سؤال اليوم من رمضان؟</div>
                        <div className="p-2 bg-white text-emerald-950 font-bold rounded-xl text-[10px] shadow-sm">
                          أ) الإجابة المتناسقة مع لون الموقع
                        </div>
                      </div>
                    </div>

                    {/* Model 1: Emerald Islamic */}
                    <div 
                      onClick={() => {
                        setRamadanSettings({ ...ramadanSettings, cardTemplate: 'model_emerald_islamic' });
                        triggerNotification('تم اعتماد النموذج الإسلامي الزمردي!');
                      }}
                      className={`rounded-3xl p-5 border-2 cursor-pointer transition-all space-y-4 relative overflow-hidden ${
                        (ramadanSettings.cardTemplate || 'model_emerald_islamic') === 'model_emerald_islamic'
                          ? 'border-amber-400 ring-2 ring-amber-400/40 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white shadow-lg'
                          : 'border-gray-200 bg-gray-900 text-slate-100 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex justify-between items-center flex-row-reverse">
                        <span className="px-3 py-1 bg-amber-400 text-emerald-950 text-xs font-black rounded-full">
                          النموذج 1: الإسلامي الزمردي 🌟
                        </span>
                        {(ramadanSettings.cardTemplate || 'model_emerald_islamic') === 'model_emerald_islamic' && (
                          <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-md border border-amber-400/40">
                            مفعّل حالياً ✓
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
                        أخضر زمردي دافئ مع أقواس إسلامية مذهبة وزخارف نجوم هندسية دقيقة.
                      </p>

                      <div className="p-4 rounded-2xl bg-emerald-900/90 border border-amber-400/40 text-center space-y-2">
                        <div className="text-[11px] text-amber-300 font-serif">✦ 🕌 سؤال اليوم 🕌 ✦</div>
                        <div className="text-xs font-bold text-amber-100">كم عدد سور القرآن الكريم؟</div>
                        <div className="p-2 bg-black/40 border border-white/10 rounded-xl text-[10px] text-emerald-200">
                          أ) 114 سورة
                        </div>
                      </div>
                    </div>

                    {/* Model 2: Gold Arch */}
                    <div 
                      onClick={() => {
                        setRamadanSettings({ ...ramadanSettings, cardTemplate: 'model_gold_arch' });
                        triggerNotification('تم اعتماد النموذج الذهبي الملكي!');
                      }}
                      className={`rounded-3xl p-5 border-2 cursor-pointer transition-all space-y-4 relative overflow-hidden ${
                        ramadanSettings.cardTemplate === 'model_gold_arch'
                          ? 'border-amber-400 ring-2 ring-amber-400/40 bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-amber-50 shadow-lg'
                          : 'border-gray-200 bg-stone-900 text-amber-100 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex justify-between items-center flex-row-reverse">
                        <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black rounded-full">
                          النموذج 2: الذهبي الملكي 👑
                        </span>
                        {ramadanSettings.cardTemplate === 'model_gold_arch' && (
                          <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-md border border-amber-400/40">
                            مفعّل حالياً ✓
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
                        تصميم ذهبي ملكي فاخر بإطار مذهب سميك، حواف مقوسة وشريط علوي مزخرف بنقوش الشرق.
                      </p>

                      <div className="p-4 rounded-2xl bg-amber-950/90 border border-amber-400 text-center space-y-2">
                        <div className="text-[11px] text-amber-300 font-serif">🕌 نموذج الأقواس المذهبة 🕌</div>
                        <div className="text-xs font-bold text-amber-100">أول سفير في الإسلام؟</div>
                        <div className="p-2 bg-stone-950/60 border border-amber-400/40 rounded-xl text-[10px] text-amber-200">
                          أ) مصعب بن عمير
                        </div>
                      </div>
                    </div>

                    {/* Model 3: Royal Cream */}
                    <div 
                      onClick={() => {
                        setRamadanSettings({ ...ramadanSettings, cardTemplate: 'model_royal_cream' });
                        triggerNotification('تم اعتماد النموذج الكلاسيكي العاجي!');
                      }}
                      className={`rounded-3xl p-5 border-2 cursor-pointer transition-all space-y-4 relative overflow-hidden ${
                        ramadanSettings.cardTemplate === 'model_royal_cream'
                          ? 'border-amber-500 ring-2 ring-amber-400/40 bg-amber-50 text-slate-900 shadow-lg'
                          : 'border-gray-200 bg-amber-50/60 text-slate-800 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex justify-between items-center flex-row-reverse">
                        <span className="px-3 py-1 bg-emerald-800 text-amber-200 text-xs font-black rounded-full">
                          النموذج 3: الكلاسيكي العاجي 📜
                        </span>
                        {ramadanSettings.cardTemplate === 'model_royal_cream' && (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                            مفعّل حالياً ✓
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-700 leading-relaxed font-sans">
                        خلفية عاجية مريحة للعين مع إطار موزاييك حجر القلمون، نصوص زمردية داكنة وأزرار ذهبية.
                      </p>

                      <div className="p-4 rounded-2xl bg-white border-2 border-amber-400/60 text-center space-y-2 shadow-sm">
                        <div className="text-[11px] text-emerald-800 font-serif font-bold">📜 الموزاييك العاجي الأصيل</div>
                        <div className="text-xs font-bold text-emerald-950">عاصمة الدولة الأموية؟</div>
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[10px] text-emerald-900 font-bold">
                          أ) دمشق الشام
                        </div>
                      </div>
                    </div>

                    {/* Model 4: Modern Night */}
                    <div 
                      onClick={() => {
                        setRamadanSettings({ ...ramadanSettings, cardTemplate: 'model_modern_night' });
                        triggerNotification('تم اعتماد النموذج الليلي العالي التباين!');
                      }}
                      className={`rounded-3xl p-5 border-2 cursor-pointer transition-all space-y-4 relative overflow-hidden ${
                        ramadanSettings.cardTemplate === 'model_modern_night'
                          ? 'border-amber-400 ring-2 ring-amber-400/40 bg-slate-900 text-slate-100 shadow-lg'
                          : 'border-gray-200 bg-slate-900/80 text-slate-300 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex justify-between items-center flex-row-reverse">
                        <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full">
                          النموذج 4: الليلي العالي التباين 🌙
                        </span>
                        {ramadanSettings.cardTemplate === 'model_modern_night' && (
                          <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-md border border-amber-400/40">
                            مفعّل حالياً ✓
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        تصميم ليلي مريح باللون الكحلي والزمردي الداكن لقراءة ليلية متناسقة.
                      </p>

                      <div className="p-4 rounded-2xl bg-slate-800/90 border border-amber-500/40 text-center space-y-2">
                        <div className="text-[11px] text-amber-300 font-serif">🌙 ليالي قارة الرمضانية 🌙</div>
                        <div className="text-xs font-bold text-slate-100">أين تقع مئذنة قارة القديمة؟</div>
                        <div className="p-2 bg-amber-500/20 border border-amber-400/40 rounded-xl text-[10px] text-amber-200">
                          أ) الجامع الكبير بقارة
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Part 2: Custom Text Colors for Card Elements (تغيير ألوان الخطوط في النماذج) */}
                <div className="p-5 bg-emerald-50/50 border border-emerald-200/80 rounded-3xl space-y-4 text-right">
                  <div className="flex items-center justify-between flex-row-reverse">
                    <span className="text-xs font-extrabold text-emerald-950 block">
                      2. تخصيص ألوان الخطوط للنموذج المختار (تعديل ألوان نص السؤال والخيارات والترويسة):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setRamadanSettings({
                          ...ramadanSettings,
                          cardQuestionTextColor: '',
                          cardOptionsTextColor: '',
                          cardHeaderBadgeColor: ''
                        });
                        triggerNotification('تم إعادة ألوان الخطوط إلى الوضع الافتراضي للنموذج');
                      }}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 underline font-bold cursor-pointer"
                    >
                      إعادة الألوان الافتراضية للنموذج 🔄
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Question Text Color */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">لون خط نص السؤال:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={ramadanSettings.cardQuestionTextColor || '#fef3c7'}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, cardQuestionTextColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5 shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="افتراضي حسب النموذج"
                          value={ramadanSettings.cardQuestionTextColor || ''}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, cardQuestionTextColor: e.target.value })}
                          className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-right"
                        />
                      </div>
                    </div>

                    {/* Options Text Color */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">لون خط الخيارات المتاحة:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={ramadanSettings.cardOptionsTextColor || '#ffffff'}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, cardOptionsTextColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5 shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="افتراضي حسب النموذج"
                          value={ramadanSettings.cardOptionsTextColor || ''}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, cardOptionsTextColor: e.target.value })}
                          className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-right"
                        />
                      </div>
                    </div>

                    {/* Header Badge Color */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">لون شريط الترويسة والزخرفة العلوي:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={ramadanSettings.cardHeaderBadgeColor || '#fcd34d'}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, cardHeaderBadgeColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5 shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="افتراضي حسب النموذج"
                          value={ramadanSettings.cardHeaderBadgeColor || ''}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, cardHeaderBadgeColor: e.target.value })}
                          className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-right"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Part 3: Islamic Motifs, Background Image & Opacity Controls */}
                <div className="p-5 bg-amber-50/60 border border-amber-200/80 rounded-3xl space-y-4 text-right">
                  <span className="text-xs font-extrabold text-amber-950 block">
                    3. الزخارف الإسلامية وصورة خلفية بطاقة السؤال والتحكم بالشفافية 🖼️:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Pattern Selection */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">نوع الزخرفة / خلفية البطاقة:</label>
                      <select
                        value={ramadanSettings.cardBgPattern || 'islamic_stars'}
                        onChange={(e) => setRamadanSettings({ ...ramadanSettings, cardBgPattern: e.target.value as any })}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none cursor-pointer text-right"
                      >
                        <option value="none">بدون زخرفة خلفية (سادة)</option>
                        <option value="islamic_stars">شبكة النجوم والزخرفة الهندسية الإسلامية ✦</option>
                        <option value="arabesque">النقوش النباتية والأرابيسك الرمضاني 🌿</option>
                        <option value="qara_mosaic">نقوش موزاييك حجر القلمون وفيسفساء قارة 🏛️</option>
                        <option value="custom_image">صورة خلفية مخصصة برابط URL 🖼️</option>
                      </select>
                    </div>

                    {/* Opacity Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                        <span>نسبة درجة الشفافية (Opacity):</span>
                        <span className="text-emerald-800 font-mono font-black text-sm bg-emerald-100 px-2 py-0.5 rounded-md">
                          {Math.round((ramadanSettings.cardBgImageOpacity !== undefined ? ramadanSettings.cardBgImageOpacity : 0.15) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="1.0"
                        step="0.05"
                        value={ramadanSettings.cardBgImageOpacity !== undefined ? ramadanSettings.cardBgImageOpacity : 0.15}
                        onChange={(e) => setRamadanSettings({ ...ramadanSettings, cardBgImageOpacity: parseFloat(e.target.value) })}
                        className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-emerald-800 mt-2"
                      />
                    </div>
                  </div>

                  {/* Custom Image URL Field */}
                  {(ramadanSettings.cardBgPattern === 'custom_image' || ramadanSettings.cardBgImageUrl) && (
                    <div className="space-y-1 pt-2 border-t border-amber-200">
                      <label className="text-xs font-bold text-gray-700 block">رابط صورة الخلفية المخصصة (URL):</label>
                      <input
                        type="url"
                        placeholder="https://example.com/ramadan-pattern.jpg"
                        value={ramadanSettings.cardBgImageUrl || ''}
                        onChange={(e) => setRamadanSettings({ ...ramadanSettings, cardBgImageUrl: e.target.value })}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono outline-none text-left ltr"
                      />
                      <p className="text-[10px] text-gray-500 text-right">
                        يمكنك إضافة رابط صورة زخرفية إسلامية من الإنترنت لتبدو كخلفية لبطاقات الأسئلة مع التحكم التام بفرجة الشفافية أعلاه.
                      </p>
                    </div>
                  )}
                </div>

                {/* Save Button for Design Tab */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveRamadanSettings(e as any);
                    }}
                    className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    <span>حفظ وتطبيق المظهر والزخارف والخطوط والشفافية</span>
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 3: PRAYER TIMES & HIJRI DATE SETTINGS (تبويب مواقيت الصلاة لبلدة قارة) */}
            {ramadanActiveSection === 'prayer_times' && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
                <div className="border-b border-gray-100 pb-4 text-right space-y-1">
                  <h4 className="font-extrabold text-base text-emerald-950 flex items-center justify-end gap-2">
                    <span>إعدادات اليوم الهجري ومواقيت الصلاة لبلدة قارة</span>
                    <Clock className="h-5 w-5 text-emerald-800" />
                  </h4>
                  <p className="text-xs text-gray-500">
                    تحديث اسم المدينة، السنة الهجرية، ومواقيت الصلوات الخمس ليتم حساب الصلاة القادمة واليوم آلياً في الواجهة الرئيسية.
                  </p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    triggerNotification('تم حفظ وتحديث مواقيت الصلاة لبلدة قارة والتقويم الهجري بنجاح!');
                  }} 
                  className="space-y-5 text-right"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">اسم المدينة / البلدة *</label>
                      <input
                        type="text"
                        required
                        value={ramadanSettings.prayerTimesCity || "بلدة قارة - القلمون"}
                        onChange={(e) => setRamadanSettings({ ...ramadanSettings, prayerTimesCity: e.target.value })}
                        placeholder="بلدة قارة - القلمون"
                        className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-emerald-800 focus:bg-white rounded-xl outline-none text-xs text-right"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">السنة الهجرية *</label>
                      <input
                        type="text"
                        required
                        value={ramadanSettings.hijriYear || "1447 هـ"}
                        onChange={(e) => setRamadanSettings({ ...ramadanSettings, hijriYear: e.target.value })}
                        placeholder="1447 هـ"
                        className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-emerald-800 focus:bg-white rounded-xl outline-none text-xs text-right font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-3">
                    <span className="text-xs font-extrabold text-emerald-950 block">مواقيت الصلوات الخمس لبلدة قارة (تحديث آلي للصلاة القادمة):</span>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-gray-600 block">صلاة الفجر:</span>
                        <input
                          type="text"
                          value={ramadanSettings.prayerSchedule?.fajr || "04:45 ص"}
                          onChange={(e) => setRamadanSettings({
                            ...ramadanSettings,
                            prayerSchedule: { ...(ramadanSettings.prayerSchedule || { fajr: "04:45 ص", dhuhr: "12:30 م", asr: "03:45 م", maghrib: "06:40 م", isha: "08:10 م" }), fajr: e.target.value }
                          })}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs text-center font-bold font-mono outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-gray-600 block">صلاة الظهر:</span>
                        <input
                          type="text"
                          value={ramadanSettings.prayerSchedule?.dhuhr || "12:30 م"}
                          onChange={(e) => setRamadanSettings({
                            ...ramadanSettings,
                            prayerSchedule: { ...(ramadanSettings.prayerSchedule || { fajr: "04:45 ص", dhuhr: "12:30 م", asr: "03:45 م", maghrib: "06:40 م", isha: "08:10 م" }), dhuhr: e.target.value }
                          })}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs text-center font-bold font-mono outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-gray-600 block">صلاة العصر:</span>
                        <input
                          type="text"
                          value={ramadanSettings.prayerSchedule?.asr || "03:45 م"}
                          onChange={(e) => setRamadanSettings({
                            ...ramadanSettings,
                            prayerSchedule: { ...(ramadanSettings.prayerSchedule || { fajr: "04:45 ص", dhuhr: "12:30 م", asr: "03:45 م", maghrib: "06:40 م", isha: "08:10 م" }), asr: e.target.value }
                          })}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs text-center font-bold font-mono outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-gray-600 block">صلاة المغرب:</span>
                        <input
                          type="text"
                          value={ramadanSettings.prayerSchedule?.maghrib || "06:40 م"}
                          onChange={(e) => setRamadanSettings({
                            ...ramadanSettings,
                            prayerSchedule: { ...(ramadanSettings.prayerSchedule || { fajr: "04:45 ص", dhuhr: "12:30 م", asr: "03:45 م", maghrib: "06:40 م", isha: "08:10 م" }), maghrib: e.target.value }
                          })}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs text-center font-bold font-mono outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-gray-600 block">صلاة العشاء:</span>
                        <input
                          type="text"
                          value={ramadanSettings.prayerSchedule?.isha || "08:10 م"}
                          onChange={(e) => setRamadanSettings({
                            ...ramadanSettings,
                            prayerSchedule: { ...(ramadanSettings.prayerSchedule || { fajr: "04:45 ص", dhuhr: "12:30 م", asr: "03:45 م", maghrib: "06:40 م", isha: "08:10 م" }), isha: e.target.value }
                          })}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs text-center font-bold font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>حفظ مواقيت الصلاة والتقويم الهجري</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECTION 4: COMPETITION SETTINGS & TYPOGRAPHY / UNLOCKS */}
            {ramadanActiveSection === 'settings' && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
                <div className="border-b border-gray-100 pb-4 text-right space-y-1">
                  <h4 className="font-extrabold text-base text-emerald-950 flex items-center justify-end gap-2">
                    <span>إعدادات المسابقة، أحجام الخطوط، الألوان وتفعيل الفرص الفائتة</span>
                    <Settings className="h-5 w-5 text-emerald-800" />
                  </h4>
                  <p className="text-xs text-gray-500">
                    التحكم الكامل بأحجام خطوط وألوان العنوان الرئيسي، تفعيل اليوم النشط، والسماح بالإجابة على الأيام الفائتة.
                  </p>
                </div>

                <form onSubmit={handleSaveRamadanSettings} className="space-y-6 text-right">
                  {/* Title & Active Day */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">عنوان المسابقة الرئيسي *</label>
                      <input
                        type="text"
                        required
                        value={tempRamadanTitle}
                        onChange={(e) => setTempRamadanTitle(e.target.value)}
                        placeholder="المسابقة الرمضانية اليومية"
                        className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-emerald-800 focus:bg-white rounded-xl outline-none text-xs text-right font-serif"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">اليوم النشط المعروض للزوار يدوياً *</label>
                      <select
                        value={tempRamadanActiveDay}
                        onChange={(e) => setTempRamadanActiveDay(Number(e.target.value))}
                        className="w-full p-3 bg-amber-50 border border-amber-300 focus:border-emerald-800 rounded-xl outline-none text-xs text-right font-bold text-amber-950 cursor-pointer"
                      >
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                          <option key={day} value={day}>اليوم {day} من رمضان ({day} رمضان)</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Header Titles & Custom Texts */}
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-4">
                    <span className="text-xs font-extrabold text-amber-950 block">تخصيص نصوص وعناوين الهيدر والبنر الرئيسي للمسابقة:</span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">نص الشارة العلوية البارزة بالهيدر (الـ Badge):</label>
                        <input
                          type="text"
                          value={ramadanSettings.badgeText || ''}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, badgeText: e.target.value })}
                          placeholder="رمضان مبارك 1448 هـ - بلدة قارة"
                          className="w-full p-2.5 bg-white border border-gray-200 focus:border-amber-600 rounded-xl outline-none text-xs text-right font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">عنوان الترحيب المباشر (المجموعة الفرعية):</label>
                        <input
                          type="text"
                          value={ramadanSettings.welcomeTitle || ''}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, welcomeTitle: e.target.value })}
                          placeholder="أهلاً بكم في المسابقة الرمضانية اليومية 🌙"
                          className="w-full p-2.5 bg-white border border-gray-200 focus:border-amber-600 rounded-xl outline-none text-xs text-right font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">نص مخصص لشريط تاريخ الانطلاق المعروض بالبنر:</label>
                      <input
                        type="text"
                        value={ramadanSettings.launchDateCustomLabel || ''}
                        onChange={(e) => setRamadanSettings({ ...ramadanSettings, launchDateCustomLabel: e.target.value })}
                        placeholder="الإثنين 8 فبراير 2027 م (الموافق 1 رمضان 1448 هـ)"
                        className="w-full p-2.5 bg-white border border-gray-200 focus:border-amber-600 rounded-xl outline-none text-xs text-right"
                      />
                    </div>

                    {/* Additional Subtitle / Notice Under Start Date */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">نص إضافي يظهر في البنر الرئيسي تحت تاريخ الانطلاق (اختياري):</label>
                      <textarea
                        rows={2}
                        value={ramadanSettings.headerBannerSubtitle || ''}
                        onChange={(e) => setRamadanSettings({ ...ramadanSettings, headerBannerSubtitle: e.target.value })}
                        placeholder="مثال: يرجى متابعة الصفحة يومياً لمعرفة السؤال الجديد وإرسال الإجابة قبل موعد أذان المغرب..."
                        className="w-full p-2.5 bg-white border border-gray-200 focus:border-amber-600 rounded-xl outline-none text-xs text-right"
                      />
                    </div>

                    {/* Additional Banner Image Upload */}
                    <div className="space-y-2 border-t border-amber-200/60 pt-3">
                      <label className="text-xs font-bold text-gray-700 block">إضافة صورة مخصصة في البنر الرئيسي تحت تاريخ الانطلاق (اختياري):</label>
                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <input
                          type="text"
                          value={ramadanSettings.headerBannerImageUrl || ''}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, headerBannerImageUrl: e.target.value })}
                          placeholder="رابط صورة مباشر https://... أو ارفع صورة من جهازك"
                          className="w-full p-2.5 bg-white border border-gray-200 focus:border-amber-600 rounded-xl outline-none text-xs text-right font-mono"
                        />
                        <label className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl cursor-pointer shrink-0 transition-colors shadow flex items-center gap-1.5 w-full sm:w-auto justify-center">
                          <span>رفع صورة 🖼️</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleRamadanHeaderBannerImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {ramadanSettings.headerBannerImageUrl && (
                        <div className="relative mt-2 w-full max-w-xs rounded-xl overflow-hidden border border-amber-300 shadow">
                          <img 
                            src={ramadanSettings.headerBannerImageUrl} 
                            alt="معاينة بنر المسابقة" 
                            className="w-full h-28 object-cover" 
                          />
                          <button
                            type="button"
                            onClick={() => setRamadanSettings({ ...ramadanSettings, headerBannerImageUrl: '' })}
                            className="absolute top-1 left-1 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-md font-bold shadow hover:bg-red-700"
                          >
                            حذف الصورة ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Automatic Ramadan Calendar Progression & First Day Setting */}
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-2">
                      <span className="text-xs font-extrabold text-emerald-950 block">
                        تعديل أول يوم في رمضان والانتقال التلقائي للأسئلة والتاريخ:
                      </span>
                      <label className="flex items-center gap-2 text-xs font-bold text-emerald-900 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ramadanSettings.autoAdvanceDays !== false}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, autoAdvanceDays: e.target.checked })}
                          className="w-4 h-4 text-emerald-800 rounded cursor-pointer"
                        />
                        <span>تفعيل الانتقال والتنقل التلقائي اليومي بالأسئلة والتاريخ</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">
                          تاريخ أول يوم في رمضان (حسب اللجان الشرعية ولجنة رؤية الهلال):
                        </label>
                        <input
                          type="date"
                          value={ramadanSettings.startDate || '2027-02-08'}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, startDate: e.target.value })}
                          className="w-full p-2.5 bg-white border border-gray-200 focus:border-emerald-800 rounded-xl outline-none text-xs text-right font-mono font-bold"
                        />
                        <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
                          عند ثبوت الهلال وتعديل هذا التاريخ، سيتغير احتساب اليوم الفعلي تلقائياً وبشكل فوري لدى كافة الزوار.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">
                          تفعيل المساحة الإعلانية الخاصة بالرعاة:
                        </label>
                        <label className="flex items-center gap-2 p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 cursor-pointer h-[42px]">
                          <input
                            type="checkbox"
                            checked={ramadanSettings.sponsorAdsEnabled !== false}
                            onChange={(e) => setRamadanSettings({ ...ramadanSettings, sponsorAdsEnabled: e.target.checked })}
                            className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                          />
                          <span>إظهار شريط إعلانات الرعاة في صفحة المسابقة</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* HIJRI CALENDAR OFFSET & QARA PRAYER TIMES SECTION */}
                  <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-300/60 pb-2">
                      <span className="text-xs font-extrabold text-amber-950 block flex items-center gap-1.5">
                        <Moon className="h-4 w-4 text-amber-600" />
                        <span>مزامنة التاريخ الهجري، ضبط رؤية الهلال ومواقيت صلاة بلدة قارة:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setRamadanSettings(prev => ({
                            ...prev,
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
                          }));
                          triggerNotification('تم تطبيق مواقيت الصلاة والتقويم الهجري لبلدة قارة بنجاح! 🕌');
                        }}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg shadow transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        تطبيق مواقيت قارة الافتراضية 🕌
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Hijri Day Offset Control (+/- Days for Moon Sighting) */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-950 block">
                          تعديل رؤية الهلال (إزاحة التاريخ الهجري):
                        </label>
                        <select
                          value={ramadanSettings.hijriDayOffset || 0}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, hijriDayOffset: Number(e.target.value) })}
                          className="w-full p-2.5 bg-white border border-amber-300 focus:border-amber-600 rounded-xl outline-none text-xs font-bold text-amber-950 cursor-pointer"
                        >
                          <option value={-2}>تأخير يومين (-2 يوم)</option>
                          <option value={-1}>تأخير يوم واحد (-1 يوم - رؤية الهلال)</option>
                          <option value={0}>تلقائي بدون تعديل (0 يوم - متزامن مع التقويم)</option>
                          <option value={1}>تقديم يوم واحد (+1 يوم - رؤية الهلال)</option>
                          <option value={2}>تقديم يومين (+2 يوم)</option>
                        </select>
                        <p className="text-[10px] text-amber-800 font-sans">
                          يُتيح زيادة أو إنقاص اليوم الهجري بمقدار يوم أو يومين فورياً حسب إعلان الهلال واللجان الشرعية.
                        </p>
                      </div>

                      {/* Hijri Year */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-950 block">
                          السنة الهجرية:
                        </label>
                        <input
                          type="text"
                          value={ramadanSettings.hijriYear || '1448 هـ'}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, hijriYear: e.target.value })}
                          placeholder="1448 هـ"
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-xl outline-none text-xs text-right font-bold"
                        />
                      </div>

                      {/* City Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-950 block">
                          اسم المدينة والبلدة:
                        </label>
                        <input
                          type="text"
                          value={ramadanSettings.prayerTimesCity || 'بلدة قارة - القلمون'}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, prayerTimesCity: e.target.value })}
                          placeholder="بلدة قارة - القلمون"
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-xl outline-none text-xs text-right font-bold"
                        />
                      </div>
                    </div>

                    {/* 5 Prayer Times Inputs for Qara */}
                    <div className="space-y-2 pt-2 border-t border-amber-200">
                      <span className="text-xs font-bold text-amber-950 block">مواقيت الصلوات الخمس لبلدة قارة (صيغة: 04:35 ص / 12:35 م):</span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">الفجر</label>
                          <input
                            type="text"
                            value={ramadanSettings.prayerSchedule?.fajr || '04:35 ص'}
                            onChange={(e) => setRamadanSettings({
                              ...ramadanSettings,
                              prayerSchedule: {
                                ...(ramadanSettings.prayerSchedule || { fajr: "04:35 ص", dhuhr: "12:35 م", asr: "03:50 م", maghrib: "06:45 م", isha: "08:15 م" }),
                                fajr: e.target.value
                              }
                            })}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">الظهر</label>
                          <input
                            type="text"
                            value={ramadanSettings.prayerSchedule?.dhuhr || '12:35 م'}
                            onChange={(e) => setRamadanSettings({
                              ...ramadanSettings,
                              prayerSchedule: {
                                ...(ramadanSettings.prayerSchedule || { fajr: "04:35 ص", dhuhr: "12:35 م", asr: "03:50 م", maghrib: "06:45 م", isha: "08:15 م" }),
                                dhuhr: e.target.value
                              }
                            })}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">العصر</label>
                          <input
                            type="text"
                            value={ramadanSettings.prayerSchedule?.asr || '03:50 م'}
                            onChange={(e) => setRamadanSettings({
                              ...ramadanSettings,
                              prayerSchedule: {
                                ...(ramadanSettings.prayerSchedule || { fajr: "04:35 ص", dhuhr: "12:35 م", asr: "03:50 م", maghrib: "06:45 م", isha: "08:15 م" }),
                                asr: e.target.value
                              }
                            })}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">المغرب</label>
                          <input
                            type="text"
                            value={ramadanSettings.prayerSchedule?.maghrib || '06:45 م'}
                            onChange={(e) => setRamadanSettings({
                              ...ramadanSettings,
                              prayerSchedule: {
                                ...(ramadanSettings.prayerSchedule || { fajr: "04:35 ص", dhuhr: "12:35 م", asr: "03:50 م", maghrib: "06:45 م", isha: "08:15 م" }),
                                maghrib: e.target.value
                              }
                            })}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 block">العشاء</label>
                          <input
                            type="text"
                            value={ramadanSettings.prayerSchedule?.isha || '08:15 م'}
                            onChange={(e) => setRamadanSettings({
                              ...ramadanSettings,
                              prayerSchedule: {
                                ...(ramadanSettings.prayerSchedule || { fajr: "04:35 ص", dhuhr: "12:35 م", asr: "03:50 م", maghrib: "06:45 م", isha: "08:15 م" }),
                                isha: e.target.value
                              }
                            })}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtitle text */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">العنوان الفرعي والوصف المشجع *</label>
                    <textarea
                      rows={2}
                      required
                      value={tempRamadanSubtitle}
                      onChange={(e) => setTempRamadanSubtitle(e.target.value)}
                      placeholder="شاركونا الإجابة اليومية مع فرصة الفوز بجوائز قيمة..."
                      className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-emerald-800 focus:bg-white rounded-xl outline-none text-xs text-right"
                    />
                  </div>

                  {/* Font Sizes & Text Colors Customization */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
                    <span className="text-xs font-extrabold text-emerald-950 block">التحكم بأحجام الخطوط وألوان الكتابة:</span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Font Size */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">حجم خط العنوان الرئيسي:</label>
                        <select
                          value={ramadanSettings.titleFontSize || 'text-3xl'}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, titleFontSize: e.target.value as any })}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                        >
                          <option value="text-xl">صغير (xl)</option>
                          <option value="text-2xl">متوسط (2xl)</option>
                          <option value="text-3xl">كبير متناسق (3xl)</option>
                          <option value="text-4xl">كبير جداً (4xl)</option>
                          <option value="text-5xl">ضخم بارز (5xl)</option>
                        </select>
                      </div>

                      {/* Main Title Color */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">لون خط العنوان الرئيسي:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={ramadanSettings.titleTextColor || '#fef3c7'}
                            onChange={(e) => setRamadanSettings({ ...ramadanSettings, titleTextColor: e.target.value })}
                            className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={ramadanSettings.titleTextColor || '#fef3c7'}
                            onChange={(e) => setRamadanSettings({ ...ramadanSettings, titleTextColor: e.target.value })}
                            className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold"
                          />
                        </div>
                      </div>

                      {/* Subtitle Color */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">لون خط الوصف والشرح الفرعي:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={ramadanSettings.subtitleTextColor || '#a7f3d0'}
                            onChange={(e) => setRamadanSettings({ ...ramadanSettings, subtitleTextColor: e.target.value })}
                            className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={ramadanSettings.subtitleTextColor || '#a7f3d0'}
                            onChange={(e) => setRamadanSettings({ ...ramadanSettings, subtitleTextColor: e.target.value })}
                            className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second Chance & History Settings */}
                  <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
                    <span className="text-xs font-extrabold text-amber-950 block">صلاحيات التحكم بالأيام الفائتة وسجل الأيام:</span>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!ramadanSettings.showQuestionsHistory}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, showQuestionsHistory: e.target.checked })}
                          className="w-4 h-4 text-emerald-800 rounded cursor-pointer"
                        />
                        <span>عرض كافة أسئلة شهر رمضان للأعضاء وتصفح الأيام مجاناً</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!ramadanSettings.allowSecondChanceForPastDays}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, allowSecondChanceForPastDays: e.target.checked })}
                          className="w-4 h-4 text-emerald-800 rounded cursor-pointer"
                        />
                        <span>السماح بالإجابة وتفعيل الفرصة الثانية لجميع الأيام الفائتة كلياً</span>
                      </label>
                    </div>

                    {/* Manual Individual Day Unlock Control */}
                    <div className="pt-2 border-t border-amber-200 space-y-2">
                      <span className="text-[11px] font-bold text-amber-900 block">
                        إعادة تفعيل يوم محدد يدوياً كـ "فرصة ثانية" (انقر على رقم اليوم لتفعيله):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                          const isUnlocked = (ramadanSettings.unlockedDays || []).includes(day);
                          const isActiveToday = day === tempRamadanActiveDay;

                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                const currentUnlocked = ramadanSettings.unlockedDays || [];
                                const updated = isUnlocked 
                                  ? currentUnlocked.filter(d => d !== day)
                                  : [...currentUnlocked, day];
                                setRamadanSettings({ ...ramadanSettings, unlockedDays: updated });
                                triggerNotification(isUnlocked ? `تم إغلاق اليوم ${day}` : `تم فتح وإعادة تفعيل اليوم ${day} فرصة ثانية!`);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                                isActiveToday
                                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-black'
                                  : isUnlocked
                                  ? 'bg-emerald-600 text-white border-emerald-500'
                                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              {day} {isUnlocked ? '🔓' : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>حفظ كافة إعدادات المسابقة والخطوط</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECTION: SPONSOR ADS MANAGEMENT */}
            {ramadanActiveSection === 'sponsors' && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="text-right space-y-1">
                    <h4 className="font-extrabold text-base text-amber-950 flex items-center justify-start sm:justify-end gap-2">
                      <span>إدارة إعلانات ورعاة المسابقة الرمضانية</span>
                      <Volume2 className="h-5 w-5 text-amber-600" />
                    </h4>
                    <p className="text-xs text-gray-500">
                      إضافة وتعديل رعاة المسابقة الرمضانية (الراعي الماسي، الذهبي، الشريك الفضي...) مع شريحة إعلانية متحركة ومحددة بالثواني.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddSponsor}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition-all cursor-pointer flex items-center gap-2 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    <span>إضافة راعي / إعلان جديد ➕</span>
                  </button>
                </div>

                {/* General Sponsor Settings */}
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-amber-200/60 pb-3">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs font-bold text-amber-950 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ramadanSettings.sponsorAdsEnabled !== false}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, sponsorAdsEnabled: e.target.checked })}
                          className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                        />
                        <span>تفعيل عرض الشريط الإخباري لرعاة المسابقة</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Template Design Style Selector */}
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <Palette className="h-4 w-4 text-amber-600" />
                        <span>نموذج وتصميم بطاقة الرعاة:</span>
                        <select
                          value={ramadanSettings.sponsorAdsCardStyle || 'site_emerald'}
                          onChange={(e) => setRamadanSettings({ 
                            ...ramadanSettings, 
                            sponsorAdsCardStyle: e.target.value as any 
                          })}
                          className="p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer"
                        >
                          <option value="site_emerald">🌲 زمردي ملائم لهوية قارة (افتراضي)</option>
                          <option value="soft_cream">🍦 كريمي هادئ وأنيق</option>
                          <option value="modern_slate">🌃 كحلي فاخر بروابط ذهبية</option>
                          <option value="heritage_amber">🕌 عنبري تراثي دافئ</option>
                          <option value="minimal_white">⚪ أبيض رقيق ومينيمال</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <span>سرعة الحركة التلقائية للشريط (بالثواني):</span>
                        <input
                          type="number"
                          min={2}
                          max={60}
                          value={ramadanSettings.sponsorAdsAutoSlideInterval || 12}
                          onChange={(e) => setRamadanSettings({ ...ramadanSettings, sponsorAdsAutoSlideInterval: Number(e.target.value) })}
                          className="w-16 p-2 bg-white border border-gray-300 rounded-xl text-center font-mono font-bold outline-none"
                        />
                        <span>ثوانٍ</span>
                      </div>
                    </div>
                  </div>

                  {/* Custom Texts for Sponsor Card Header */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Edit className="h-3.5 w-3.5 text-amber-600" />
                        <span>عنوان ترويسة بطاقة الشريط الإخباري:</span>
                      </label>
                      <input
                        type="text"
                        value={ramadanSettings.sponsorAdsHeaderTitle || ''}
                        placeholder="افتراضي: 📢 الشريط الإخباري لرعاة المسابقة"
                        onChange={(e) => setRamadanSettings({ ...ramadanSettings, sponsorAdsHeaderTitle: e.target.value })}
                        className="w-full p-2 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Edit className="h-3.5 w-3.5 text-amber-600" />
                        <span>نص الشارة والملاحظة أسفل الشريط:</span>
                      </label>
                      <input
                        type="text"
                        value={ramadanSettings.sponsorAdsBadgeText || ''}
                        placeholder="افتراضي: ▲ شريط إخباري متحرك مستمر"
                        onChange={(e) => setRamadanSettings({ ...ramadanSettings, sponsorAdsBadgeText: e.target.value })}
                        className="w-full p-2 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Current Sponsors List */}
                {(ramadanSettings.sponsorsList || []).length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl space-y-3">
                    <Volume2 className="h-10 w-10 text-gray-400 mx-auto opacity-50" />
                    <p className="text-xs font-bold text-gray-500">
                      لا يوجد رعاة مضافون حالياً. اضغط على "إضافة راعي / إعلان جديد" لبدء إضافة إعلانات الرعاة.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(ramadanSettings.sponsorsList || []).map((sponsor, idx) => (
                      <div 
                        key={sponsor.id || idx}
                        className={`p-5 text-white border rounded-2xl shadow-md space-y-3 relative overflow-hidden text-right transition-all ${
                          sponsor.isPinned 
                            ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 border-amber-400 shadow-amber-500/10' 
                            : 'bg-gradient-to-br from-slate-900 to-amber-950 border-amber-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span 
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-black text-slate-950"
                              style={{ backgroundColor: sponsor.badgeBgColor || '#fbbf24' }}
                            >
                              {sponsor.sponsorType || 'راعي المسابقة'}
                            </span>
                            {sponsor.isPinned && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow flex items-center gap-1">
                                <Pin className="h-3 w-3 fill-slate-950" />
                                <span>مثبّت رئيسي 📌</span>
                              </span>
                            )}
                            {sponsor.isActive === false && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                معطل 🚫
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Pin / Unpin Button */}
                            <button
                              type="button"
                              onClick={() => handleTogglePinSponsor(idx)}
                              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                sponsor.isPinned
                                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                                  : 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-300'
                              }`}
                              title={sponsor.isPinned ? "إلغاء تثبيت الإعلان" : "تثبيت كإعلان رئيسي في أعلى الشريط"}
                            >
                              {sponsor.isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditSponsor(idx, sponsor)}
                              className="p-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded-lg transition-all cursor-pointer"
                              title="تعديل الإعلان"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSponsor(idx)}
                              className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 rounded-lg transition-all cursor-pointer"
                              title="حذف الإعلان"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {sponsor.imageUrl && (
                            <img 
                              src={sponsor.imageUrl} 
                              alt={sponsor.title} 
                              className="w-16 h-16 rounded-xl object-cover border border-amber-400/30 shrink-0"
                            />
                          )}
                          <div className="space-y-1 text-right flex-1">
                            <h5 className="text-sm font-black text-amber-200 leading-snug">
                              {sponsor.title}
                            </h5>
                            {sponsor.description && (
                              <p className="text-xs text-emerald-100/80 line-clamp-2 leading-relaxed">
                                {sponsor.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-amber-200/80 font-mono">
                          <span>⏱️ العرض: {sponsor.durationSeconds || 5} ثوانٍ</span>
                          {sponsor.linkUrl && (
                            <a 
                              href={sponsor.linkUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-amber-300 underline hover:text-amber-200 flex items-center gap-1 font-sans"
                            >
                              <span>الرابط المرفق</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sponsor Modal */}
                {isSponsorModalOpen && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-right space-y-5 border border-amber-200">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <h3 className="text-base font-extrabold text-amber-950 flex items-center gap-2">
                          <Volume2 className="h-5 w-5 text-amber-600" />
                          <span>{editingSponsorIndex !== null ? 'تعديل بيانات راعي المسابقة' : 'إضافة راعي مسابقة جديد'}</span>
                        </h3>
                        <button 
                          onClick={() => setIsSponsorModalOpen(false)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveSponsor} className="space-y-4 font-sans text-right">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700 block">عنوان الإعلان / اسم الراعي *</label>
                          <input
                            type="text"
                            required
                            value={sponsorFormTitle}
                            onChange={(e) => setSponsorFormTitle(e.target.value)}
                            placeholder="مثلاً: شركة ألبان وزيوت قارة الوطنية"
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-amber-600 rounded-xl outline-none text-xs font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">نوع الرعاية (الشارة المميزة)</label>
                            <input
                              type="text"
                              value={sponsorFormType}
                              onChange={(e) => setSponsorFormType(e.target.value)}
                              placeholder="مثلاً: الراعي الماسي / الشريك الذهبي"
                              className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-amber-600 rounded-xl outline-none text-xs font-bold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">لون الشارة المميزة</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={sponsorFormBadgeColor}
                                onChange={(e) => setSponsorFormBadgeColor(e.target.value)}
                                className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                              />
                              <input
                                type="text"
                                value={sponsorFormBadgeColor}
                                onChange={(e) => setSponsorFormBadgeColor(e.target.value)}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700 block">شرح وتفاصيل الإعلان (اختياري)</label>
                          <textarea
                            rows={2}
                            value={sponsorFormDesc}
                            onChange={(e) => setSponsorFormDesc(e.target.value)}
                            placeholder="تفاصيل العروض أو الرسالة الإعلانية الخاصة بالراعي..."
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-amber-600 rounded-xl outline-none text-xs"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-700 block">صورة الإعلان / الشعار (رفع من الكمبيوتر 📁 أو رابط URL)</label>
                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            <label className="w-full sm:w-auto px-3.5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0">
                              <Upload className="h-4 w-4 text-amber-600" />
                              <span>رفع صورة من الكمبيوتر 📁</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleSponsorImageUpload} 
                                className="hidden" 
                              />
                            </label>
                            <div className="flex-1 w-full">
                              <input
                                type="text"
                                value={sponsorFormImageUrl}
                                onChange={(e) => setSponsorFormImageUrl(e.target.value)}
                                placeholder="أو ادخل رابط صورة مباشر (https://...)"
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-amber-600 rounded-xl outline-none text-xs font-mono"
                              />
                            </div>
                          </div>
                          {sponsorFormImageUrl && (
                            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-amber-300 bg-slate-900 flex items-center justify-center group p-1">
                              <img src={sponsorFormImageUrl} alt="معاينة الشعار" className="w-full h-full object-contain rounded-lg" />
                              <button
                                type="button"
                                onClick={() => setSponsorFormImageUrl('')}
                                className="absolute top-2 left-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow transition-all cursor-pointer"
                                title="حذف الصورة"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">رابط الصفحة / الواتساب (URL)</label>
                            <input
                              type="text"
                              value={sponsorFormLinkUrl}
                              onChange={(e) => setSponsorFormLinkUrl(e.target.value)}
                              placeholder="https://wa.me/963900000000"
                              className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-amber-600 rounded-xl outline-none text-xs font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">مدة عرض الإعلان (بالثواني)</label>
                            <input
                              type="number"
                              min={2}
                              max={60}
                              value={sponsorFormDuration}
                              onChange={(e) => setSponsorFormDuration(Number(e.target.value))}
                              className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-amber-600 rounded-xl outline-none text-xs font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div className="pt-2 space-y-2">
                          {/* Pinned Checkbox */}
                          <label className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-950 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={sponsorFormIsPinned}
                              onChange={(e) => setSponsorFormIsPinned(e.target.checked)}
                              className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                            />
                            <span className="flex items-center gap-1">
                              <Pin className="h-3.5 w-3.5 text-amber-600" />
                              <span>تثبيت كإعلان رئيسي (📌 يثبت أعلى الشريط الإخباري - إعلان واحد فقط)</span>
                            </span>
                          </label>

                          <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={sponsorFormActive}
                              onChange={(e) => setSponsorFormActive(e.target.checked)}
                              className="w-4 h-4 text-emerald-800 rounded cursor-pointer"
                            />
                            <span>تفعيل وعرض هذا الإعلان في شريحة الرعاة</span>
                          </label>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => setIsSponsorModalOpen(false)}
                            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition-colors cursor-pointer"
                          >
                            حفظ الإعلان 💾
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: SUBMISSIONS LOG & EXCEL EXPORT */}
            {ramadanActiveSection === 'submissions' && (
              <div className="space-y-6 font-sans">
                {/* Header Action & Reset & Excel Export */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <span>سجل كافة الإجابات وإحصائيات المشاركين بالمسابقة</span>
                  </h4>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    {ramadanAnswers.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={handleExportRamadanAnswersToExcel}
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <FileSpreadsheet className="h-4 w-4 text-emerald-300" />
                          <span>تصدير النتائج إلى Excel 📊</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleClearRamadanAnswers}
                          className="px-3.5 py-2 bg-red-50 hover:bg-red-700 hover:text-white text-red-700 font-bold text-xs rounded-xl transition-all cursor-pointer border border-red-100 flex items-center gap-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>تصفير ومسح الإجابات</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {ramadanAnswers.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-8 space-y-2">
                    <Trophy className="h-10 w-10 text-gray-300 mx-auto" />
                    <h5 className="font-bold text-sm text-gray-800">لا توجد إجابات مسجلة من الأعضاء حتى الآن</h5>
                    <p className="text-xs text-gray-500">
                      عندما يقوم الأعضاء المسجلون بالدخول والإجابة على الأسئلة اليومية، ستظهر كافة إجاباتهم وسجلاتهم هنا تلقائياً.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Participant Summary Table */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                      <h5 className="font-bold text-xs text-gray-800 text-right">ملخص مشاركات الأعضاء (مرتّب حسب عدد الإجابات الصحيحة):</h5>
                      <div className="overflow-x-auto">
                        <table className="w-full text-right text-xs border-collapse">
                          <thead>
                            <tr className="bg-emerald-950 text-amber-200 border-b border-emerald-900">
                              <th className="p-3 rounded-r-xl">اسم العضو المسجل</th>
                              <th className="p-3">اسم المستخدم</th>
                              <th className="p-3">الإجابات الصحيحة</th>
                              <th className="p-3">الإجابات الخاطئة</th>
                              <th className="p-3">إجمالي المشاركات</th>
                              <th className="p-3">نسبة النجاح</th>
                              <th className="p-3 rounded-l-xl">أحدث مشاركة</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {(() => {
                              const userStats: { [name: string]: { username: string; correct: number; incorrect: number; total: number; lastDate: string } } = {};
                              ramadanAnswers.forEach(ans => {
                                const key = ans.userName || 'عضو غير معروف';
                                if (!userStats[key]) {
                                  userStats[key] = {
                                    username: ans.userUsername || '-',
                                    correct: 0,
                                    incorrect: 0,
                                    total: 0,
                                    lastDate: ans.submittedAt
                                  };
                                }
                                userStats[key].total += 1;
                                if (ans.isCorrect) {
                                  userStats[key].correct += 1;
                                } else {
                                  userStats[key].incorrect += 1;
                                }
                                userStats[key].lastDate = ans.submittedAt;
                              });

                              return Object.entries(userStats)
                                .sort((a, b) => b[1].correct - a[1].correct || b[1].total - a[1].total)
                                .map(([name, stat], idx) => {
                                  const successRate = Math.round((stat.correct / stat.total) * 100);

                                  return (
                                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                                      <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                                        <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                                          idx === 0 ? 'bg-amber-400 text-emerald-950' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                          {idx + 1}
                                        </span>
                                        <span>{name}</span>
                                      </td>
                                      <td className="p-3 text-gray-600">@{stat.username}</td>
                                      <td className="p-3 font-black text-emerald-700">
                                        {stat.correct} ✓
                                      </td>
                                      <td className="p-3 font-bold text-rose-600">
                                        {stat.incorrect} ✗
                                      </td>
                                      <td className="p-3 font-bold text-slate-800">
                                        {stat.total} إجابة
                                      </td>
                                      <td className="p-3 font-mono font-bold text-emerald-900">
                                        <span className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                          {successRate}%
                                        </span>
                                      </td>
                                      <td className="p-3 text-gray-500 text-[11px]">{stat.lastDate}</td>
                                    </tr>
                                  );
                                });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* All Submissions Detailed Log with Filtering & Sorting */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-3 border-b border-gray-100">
                        <div>
                          <h5 className="font-extrabold text-sm text-gray-900 text-right">
                            سجل كافة الإجابات الفردية في المسابقة
                          </h5>
                          <p className="text-xs text-gray-500 mt-0.5">
                            تصفح وفرز الإجابات الصحيحة والخاطئة مع إمكانية البحث وتصفية اليوم.
                          </p>
                        </div>

                        {/* Export to Excel Button inside Detailed Log */}
                        <button
                          type="button"
                          onClick={handleExportRamadanAnswersToExcel}
                          className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          <FileSpreadsheet className="h-4 w-4 text-emerald-300" />
                          <span>تصدير هذا السجل إلى Excel</span>
                        </button>
                      </div>

                      {/* Filter & Sorting Controls Bar */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80">
                        {/* Correct / Incorrect Tabs */}
                        <div className="md:col-span-6 flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
                          <button
                            type="button"
                            onClick={() => setRamadanAnswersFilter('all')}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              ramadanAnswersFilter === 'all'
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            كافة الإجابات ({ramadanAnswers.length})
                          </button>

                          <button
                            type="button"
                            onClick={() => setRamadanAnswersFilter('correct')}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              ramadanAnswersFilter === 'correct'
                                ? 'bg-emerald-700 text-white shadow-sm'
                                : 'text-emerald-800 hover:bg-emerald-50'
                            }`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>الصحيحة فقط ({ramadanAnswers.filter(a => a.isCorrect).length})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRamadanAnswersFilter('incorrect')}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              ramadanAnswersFilter === 'incorrect'
                                ? 'bg-rose-700 text-white shadow-sm'
                                : 'text-rose-800 hover:bg-rose-50'
                            }`}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>الخاطئة فقط ({ramadanAnswers.filter(a => !a.isCorrect).length})</span>
                          </button>
                        </div>

                        {/* Day Filter */}
                        <div className="md:col-span-3">
                          <select
                            value={ramadanAnswersDayFilter}
                            onChange={(e) => setRamadanAnswersDayFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none cursor-pointer text-right"
                          >
                            <option value="all">كافة أيام شهر رمضان (30 يوم)</option>
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                              <option key={d} value={d}>اليوم {d} من رمضان</option>
                            ))}
                          </select>
                        </div>

                        {/* Search Input */}
                        <div className="md:col-span-3 relative">
                          <input
                            type="text"
                            placeholder="بحث باسم العضو..."
                            value={ramadanAnswersSearch}
                            onChange={(e) => setRamadanAnswersSearch(e.target.value)}
                            className="w-full p-2 pr-8 bg-white border border-gray-200 rounded-xl text-xs outline-none text-right"
                          />
                          <Search className="h-3.5 w-3.5 text-gray-400 absolute right-2.5 top-3" />
                        </div>
                      </div>

                      {/* Log Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-right text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-100 text-gray-700 border-b border-gray-200">
                              <th className="p-3 rounded-r-xl">اليوم</th>
                              <th className="p-3">اسم العضو المشارك</th>
                              <th className="p-3">اسم المستخدم</th>
                              <th className="p-3">السؤال الرمضاني</th>
                              <th className="p-3">الخيار المختار</th>
                              <th className="p-3">النتيجة</th>
                              <th className="p-3 rounded-l-xl">تاريخ الإجابة</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {(() => {
                              let filtered = [...ramadanAnswers];

                              if (ramadanAnswersFilter === 'correct') {
                                filtered = filtered.filter(a => a.isCorrect);
                              } else if (ramadanAnswersFilter === 'incorrect') {
                                filtered = filtered.filter(a => !a.isCorrect);
                              }

                              if (ramadanAnswersDayFilter !== 'all') {
                                filtered = filtered.filter(a => a.dayNumber === Number(ramadanAnswersDayFilter));
                              }

                              if (ramadanAnswersSearch.trim()) {
                                const q = ramadanAnswersSearch.toLowerCase();
                                filtered = filtered.filter(a =>
                                  (a.userName || '').toLowerCase().includes(q) ||
                                  (a.userUsername || '').toLowerCase().includes(q)
                                );
                              }

                              if (filtered.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500 font-bold">
                                      لا توجد إجابات تطابق خيارات التصفية والفرز المحددة.
                                    </td>
                                  </tr>
                                );
                              }

                              return filtered.map((ans) => {
                                const qObj = ramadanQuestions.find(rq => rq.dayNumber === ans.dayNumber || rq.id === ans.questionId);
                                const qText = qObj?.questionText || `سؤال اليوم ${ans.dayNumber}`;

                                return (
                                  <tr key={ans.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="p-3 font-extrabold text-emerald-950">
                                      <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[11px]">
                                        {ans.dayNumber} رمضان
                                      </span>
                                    </td>
                                    <td className="p-3 font-bold text-gray-900">{ans.userName}</td>
                                    <td className="p-3 text-gray-500">@{ans.userUsername || '-'}</td>
                                    <td className="p-3 text-gray-800 max-w-xs truncate" title={qText}>
                                      {qText}
                                    </td>
                                    <td className="p-3 text-gray-800 font-medium">{ans.selectedOption}</td>
                                    <td className="p-3 font-bold">
                                      {ans.isCorrect ? (
                                        <span className="text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                          <span>صحيحة ✓</span>
                                        </span>
                                      ) : (
                                        <span className="text-rose-800 bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                                          <XCircle className="h-3.5 w-3.5 text-rose-600" />
                                          <span>خاطئة ✗</span>
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-3 text-gray-500 text-[10px]">{ans.submittedAt}</td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODAL: ADD / EDIT RAMADAN QUESTION */}
        <AnimatePresence>
          {isAddingRamadanQuestion && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans" dir="rtl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10 text-right"
              >
                <div className="p-5 bg-gradient-to-l from-emerald-950 to-emerald-900 text-amber-200 flex justify-between items-center flex-row-reverse border-b border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-amber-400" />
                    <h3 className="font-extrabold text-base">
                      {editingRamadanQuestion ? 'تعديل السؤال الرمضاني' : 'إضافة سؤال رمضاني جديد'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsAddingRamadanQuestion(false)}
                    className="p-1 rounded-full hover:bg-emerald-800/80 text-emerald-200 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveRamadanQuestion} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">اليوم المبارك *</label>
                      <select
                        value={ramadanFormDay}
                        onChange={(e) => setRamadanFormDay(Number(e.target.value))}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-800 rounded-xl outline-none text-xs font-bold text-emerald-950 cursor-pointer"
                      >
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                          <option key={d} value={d}>اليوم {d} من رمضان</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">تصنيف السؤال (اختياري)</label>
                      <input
                        type="text"
                        value={ramadanFormCategory}
                        onChange={(e) => setRamadanFormCategory(e.target.value)}
                        placeholder="سيرة، قرآن، تاريخ قارة..."
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-800 rounded-xl outline-none text-xs text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">نص السؤال الرمضاني *</label>
                    <textarea
                      rows={3}
                      required
                      value={ramadanFormQuestionText}
                      onChange={(e) => setRamadanFormQuestionText(e.target.value)}
                      placeholder="اكتب السؤال بوضوح هنا..."
                      className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-emerald-800 rounded-xl outline-none text-xs text-right leading-relaxed"
                    />
                  </div>

                  {/* Multi-Choice Options Builder (Up to 5 options) */}
                  <div className="space-y-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60">
                    <div className="flex justify-between items-center flex-row-reverse">
                      <label className="text-xs font-bold text-emerald-950 block">
                        خيارات الإجابة المتعددة (حدد الإجابة الصحيحة):
                      </label>
                      {ramadanFormOptions.length < 5 && (
                        <button
                          type="button"
                          onClick={() => setRamadanFormOptions([...ramadanFormOptions, `خيار ${ramadanFormOptions.length + 1}`])}
                          className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>إضافة خيار آخر (حتى 5)</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 pt-1">
                      {ramadanFormOptions.map((opt, idx) => {
                        const isCorrect = ramadanFormCorrectIdx === idx;
                        const optionLetters = ['أ', 'ب', 'ج', 'د', 'هـ'];

                        return (
                          <div key={idx} className="flex items-center gap-2 flex-row-reverse">
                            <button
                              type="button"
                              onClick={() => setRamadanFormCorrectIdx(idx)}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border whitespace-nowrap ${
                                isCorrect
                                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              <span>{isCorrect ? '✓ الإجابة الصحيحة' : 'تحديد كصحيحة'}</span>
                            </button>

                            <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-emerald-800">
                              <span className="text-xs font-bold text-gray-400 font-sans">
                                {optionLetters[idx] || (idx + 1)}-
                              </span>
                              <input
                                type="text"
                                required
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...ramadanFormOptions];
                                  updated[idx] = e.target.value;
                                  setRamadanFormOptions(updated);
                                }}
                                placeholder={`الخيار ${idx + 1}`}
                                className="w-full text-xs outline-none text-right font-sans"
                              />
                            </div>

                            {ramadanFormOptions.length > 2 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = ramadanFormOptions.filter((_, i) => i !== idx);
                                  setRamadanFormOptions(updated);
                                  if (ramadanFormCorrectIdx >= updated.length) {
                                    setRamadanFormCorrectIdx(0);
                                  }
                                }}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="حذف هذا الخيار"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">شرح توضيحي للإجابة الصحيحة (يظهر للمستخدم بعد الإجابة)</label>
                    <input
                      type="text"
                      value={ramadanFormExplanation}
                      onChange={(e) => setRamadanFormExplanation(e.target.value)}
                      placeholder="اكتب التوضيح الحكيم أو الفائدة العلمية والتاريخية..."
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-800 rounded-xl outline-none text-xs text-right"
                    />
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                    >
                      {editingRamadanQuestion ? 'تحديث السؤال والخيارات' : 'حفظ ونشر السؤال الرمضاني'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingRamadanQuestion(false)}
                      className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

      {/* ======================================================== */}
      {/* MODAL: SERVICE ADD/EDIT MODAL FORM */}
      {/* ======================================================== */}
      <AnimatePresence>
        {(editingService || isAddingService) && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10 text-right"
            >
              <div className="p-6 bg-emerald-900 text-white flex justify-between items-center flex-row-reverse">
                <h3 className="font-bold text-base sm:text-lg">
                  {editingService ? 'تعديل الخدمة الإلكترونية' : 'إضافة خدمة إلكترونية جديدة'}
                </h3>
                <button
                  onClick={() => { setEditingService(null); setIsAddingService(false); }}
                  className="p-1.5 rounded-full hover:bg-emerald-950/80 text-emerald-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveService} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">اسم الخدمة / الوثيقة المخرجة *</label>
                  <input
                    type="text"
                    required
                    value={srvName}
                    onChange={(e) => setSrvName(e.target.value)}
                    placeholder="مثال: سند تعهد عقاري لترميم المسكن"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right animate-fadeIn"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">تصنيف الدائرة الخدمية</label>
                    <select
                      value={srvCategory}
                      onChange={(e: any) => setSrvCategory(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                    >
                      <option value="بلدية">بلدية قارة</option>
                      <option value="صحية">مستوصف وخدمات صحية</option>
                      <option value="تعليمية">مكتب ثقافي ومدارس</option>
                      <option value="اجتماعية">جمعية خيرية وتطوعية</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">زمن المعالجة والاستخراج</label>
                    <input
                      type="text"
                      required
                      value={srvTime}
                      onChange={(e) => setSrvTime(e.target.value)}
                      placeholder="مثال: 30 دقيقة / يومي عمل"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">الوصف الموجز للخدمة</label>
                  <textarea
                    rows={2}
                    required
                    value={srvDesc}
                    onChange={(e) => setSrvDesc(e.target.value)}
                    placeholder="اكتب هنا شرحاً تفصيلياً يوضح من هم الفئات المستهدفة من هذه الخدمة وكيف تساعد المواطن..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-amber-900 block">الوثائق المطلوبة (كل سطر وثيقة)</label>
                    <textarea
                      rows={3}
                      required
                      value={srvDocs}
                      onChange={(e) => setSrvDocs(e.target.value)}
                      placeholder="الهوية الشخصية&#10;سند الملكية&#10;دفتر العائلة"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-emerald-900 block">خطوات التقديم (كل سطر خطوة)</label>
                    <textarea
                      rows={3}
                      required
                      value={srvSteps}
                      onChange={(e) => setSrvSteps(e.target.value)}
                      placeholder="تقديم الطلب إلكترونياً&#10;الكشف الفني للبلدية&#10;دفع الرسوم في الصندوق"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                  >
                    حفظ وتحديث الخدمة
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingService(null); setIsAddingService(false); }}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: NEWS ADD/EDIT MODAL FORM */}
      {/* ======================================================== */}
      <AnimatePresence>
        {(editingNews || isAddingNews) && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10 text-right"
            >
              <div className="p-6 bg-emerald-900 text-white flex justify-between items-center flex-row-reverse">
                <h3 className="font-bold text-base sm:text-lg">
                  {editingNews ? 'تعديل وتحرير الخبر' : 'نشر خبر أو فعالية جديدة في قارة'}
                </h3>
                <button
                  onClick={() => { setEditingNews(null); setIsAddingNews(false); }}
                  className="p-1.5 rounded-full hover:bg-emerald-950/80 text-emerald-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNews} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">عنوان المقال الإخباري *</label>
                  <input
                    type="text"
                    required
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    placeholder="اكتب عنواناً جذاباً ومختصراً للخبر"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                  />
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">التصنيف الإخباري (التبويب)</label>
                    <select
                      value={newsCategory}
                      onChange={(e: any) => setNewsCategory(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                    >
                      {currentNewsCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">صورة الخبر (رابط أو رفع ملف من الجهاز)</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={newsImage}
                        onChange={(e) => setNewsImage(e.target.value)}
                        placeholder="رابط الصورة (https://...) أو اختر ملفاً من الجهاز"
                        className="flex-1 p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-left font-mono"
                        dir="ltr"
                      />
                      <label className="px-3 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-900 transition-all shrink-0 flex items-center gap-1">
                        <Upload className="h-3.5 w-3.5" />
                        رفع صورة
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewsImage(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {newsImage && (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 h-36 bg-gray-100">
                      <img src={newsImage} alt="معاينة صورة الخبر" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewsImage('')}
                        className="absolute top-2 left-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer"
                        title="حذف الصورة"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">نص المحتوى الكامل للخبر *</label>
                  <textarea
                    rows={6}
                    required
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    placeholder="اكتب هنا تفاصيل الخبر كاملة ليقرأها الأهالي والمغتربون..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right leading-relaxed font-sans"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                  >
                    نشر وتأكيد الخبر
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingNews(null); setIsAddingNews(false); }}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: PROJECT ADD/EDIT MODAL FORM */}
      {/* ======================================================== */}
      <AnimatePresence>
        {(editingProject || isAddingProject) && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10 text-right"
            >
              <div className="p-6 bg-emerald-900 text-white flex justify-between items-center flex-row-reverse">
                <h3 className="font-bold text-base sm:text-lg">
                  {editingProject ? 'تعديل بيانات المشروع التنموي' : 'إطلاق مشروع استثماري/خدمي جديد بقارة'}
                </h3>
                <button
                  onClick={() => { setEditingProject(null); setIsAddingProject(false); }}
                  className="p-1.5 rounded-full hover:bg-emerald-950/80 text-emerald-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">اسم المشروع التنموي *</label>
                  <input
                    type="text"
                    required
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="مثال: مشروع تجهيز مستوصف قارة بغرفة أشعة جديدة"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">التصنيف والقطاع</label>
                    <select
                      value={projCategory}
                      onChange={(e: any) => setProjCategory(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                    >
                      <option value="بنى تحتية">بنى تحتية وطرق</option>
                      <option value="زراعي">زراعي وتبريد محاصيل</option>
                      <option value="طاقة متجددة">طاقة شمسية ومياه</option>
                      <option value="ثقافي وخدمي">ثقافي، تدريب وتأهيل</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">حالة العمل الحالية</label>
                    <select
                      value={projStatus}
                      onChange={(e: any) => setProjStatus(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right"
                    >
                      <option value="قيد التخطيط">قيد التخطيط والتمويل</option>
                      <option value="قيد التنفيذ">قيد العمل والنشاط الميداني</option>
                      <option value="مكتمل">مكتمل وتم تدشينه</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1 col-span-1">
                    <label className="text-[11px] font-semibold text-gray-700 block">نسبة الإنجاز % *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={projPercent}
                      onChange={(e) => setProjPercent(Number(e.target.value))}
                      className="w-full p-2 bg-gray-50 border border-gray-200 focus:border-emerald-700 rounded-xl outline-none text-xs text-center font-mono"
                    />
                  </div>

                  <div className="space-y-1 col-span-1">
                    <label className="text-[11px] font-semibold text-gray-700 block">عدد المتطوعين الحاليين</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={projVolunteers}
                      onChange={(e) => setProjVolunteers(Number(e.target.value))}
                      className="w-full p-2 bg-gray-50 border border-gray-200 focus:border-emerald-700 rounded-xl outline-none text-xs text-center font-mono"
                    />
                  </div>

                  <div className="space-y-1 col-span-1">
                    <label className="text-[11px] font-semibold text-gray-700 block">الميزانية ومصدرها *</label>
                    <input
                      type="text"
                      required
                      value={projBudget}
                      onChange={(e) => setProjBudget(e.target.value)}
                      placeholder="مثال: 50,000 $ (تبرعات)"
                      className="w-full p-2 bg-gray-50 border border-gray-200 focus:border-emerald-700 rounded-xl outline-none text-xs text-right"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">رابط الصورة التوضيحية للمشروع</label>
                  <input
                    type="url"
                    value={projImage}
                    onChange={(e) => setProjImage(e.target.value)}
                    placeholder="رابط الصورة (JPG/PNG)"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-left font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">الوصف التفصيلي لأهداف وأهمية المشروع *</label>
                  <textarea
                    rows={4}
                    required
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    placeholder="اشرح هنا بالتفصيل مخرجات المشروع، أين يقع في قارة، والجدول الزمني للانتهاء..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl outline-none text-xs text-right leading-relaxed font-sans"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                  >
                    حفظ وتدشين المشروع
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingProject(null); setIsAddingProject(false); }}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: MEMBER ADD/EDIT MODAL FORM */}
      {/* ======================================================== */}
      <AnimatePresence>
        {(editingMember || isAddingMember) && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10 text-right font-sans"
              dir="rtl"
            >
              <div className="p-6 bg-violet-900 text-white flex justify-between items-center flex-row-reverse">
                <h3 className="font-bold text-base sm:text-lg">
                  {editingMember ? 'تعديل بيانات العضو وصلاحياته' : 'تسجيل عضو جديد وإسناد الصلاحيات'}
                </h3>
                <button
                  onClick={() => { setEditingMember(null); setIsAddingMember(false); }}
                  className="p-1.5 rounded-full hover:bg-violet-950/80 text-violet-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMember} className="p-6 space-y-4">
                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-gray-700 block">اسم العضو بالكامل *</label>
                  <input
                    type="text"
                    required
                    value={memberFormName}
                    onChange={(e) => setMemberFormName(e.target.value)}
                    placeholder="مثال: المهندس خالد الأيوبي"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-violet-700 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">اسم مستخدم الدخول (English / Numbers) *</label>
                    <input
                      type="text"
                      required
                      value={memberFormUsername}
                      disabled={!!editingMember}
                      onChange={(e) => setMemberFormUsername(e.target.value)}
                      placeholder="مثال: khaled_2026"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-violet-700 focus:bg-white rounded-xl outline-none text-xs text-left font-mono"
                      dir="ltr"
                    />
                    {memberFormUsername && (
                      <p className={`text-[10px] ${validateUsername(memberFormUsername).isValid ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}`}>
                        {validateUsername(memberFormUsername).isValid ? '✓ اسم المستخدم مقبول' : validateUsername(memberFormUsername).message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">كلمة المرور الشخصية (10+ خانات) *</label>
                    <input
                      type="text"
                      required
                      value={memberFormPassword}
                      onChange={(e) => setMemberFormPassword(e.target.value)}
                      placeholder="كلمة المرور الشخصية للدخول"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-violet-700 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                    />
                  </div>
                </div>

                <PasswordStrengthMeter password={memberFormPassword} />

                <div className="p-3 bg-violet-50/70 rounded-2xl border border-violet-100 text-right space-y-1">
                  <span className="text-[11px] font-bold text-violet-900 flex items-center justify-end gap-1">
                    <span>إنشاء حساب مواطن تلقائياً للعضو 🛡️</span>
                    <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  </span>
                  <p className="text-[10px] text-violet-800 leading-relaxed font-sans">
                    سيتم إنشاء/مزامنة حساب مواطن تلقائياً للعضو بشارة <strong>"الإدارة 🛡️"</strong> وصلاحيات الإشراف وحذف التعليقات المسيئة.
                  </p>
                </div>

                {/* Permissions Toggles in exact requested order */}
                <div className="space-y-3 pt-2 text-right">
                  <label className="text-xs font-bold text-gray-700 block border-b border-gray-100 pb-1">
                    تحديد الصلاحيات للتحكم الكامل (تعديل، حذف، تنسيق):
                  </label>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto p-1 bg-gray-50 rounded-2xl border border-gray-100">
                    {/* Permission 1: تعديل الصفحة الرئيسية */}
                    <label className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-100 hover:bg-gray-100/50 cursor-pointer transition-colors flex-row-reverse">
                      <span className="text-xs font-semibold text-gray-800">تعديل الصفحة الرئيسية</span>
                      <input
                        type="checkbox"
                        checked={memberFormPermissions.editHome}
                        onChange={(e) => setMemberFormPermissions(prev => ({ ...prev, editHome: e.target.checked }))}
                        className="w-4.5 h-4.5 rounded border-gray-300 text-violet-650 focus:ring-violet-500 cursor-pointer"
                      />
                    </label>

                    {/* Permission 2: إدارة معرض الصور والذكريات */}
                    <label className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-100 hover:bg-gray-100/50 cursor-pointer transition-colors flex-row-reverse">
                      <span className="text-xs font-semibold text-gray-800">إدارة معرض الصور والذكريات</span>
                      <input
                        type="checkbox"
                        checked={memberFormPermissions.manageGallery}
                        onChange={(e) => setMemberFormPermissions(prev => ({ ...prev, manageGallery: e.target.checked }))}
                        className="w-4.5 h-4.5 rounded border-gray-300 text-violet-650 focus:ring-violet-500 cursor-pointer"
                      />
                    </label>

                    {/* Permission 3: الخدمات الرقمية */}
                    <label className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-100 hover:bg-gray-100/50 cursor-pointer transition-colors flex-row-reverse">
                      <span className="text-xs font-semibold text-gray-800">الخدمات الرقمية</span>
                      <input
                        type="checkbox"
                        checked={memberFormPermissions.digitalServices}
                        onChange={(e) => setMemberFormPermissions(prev => ({ ...prev, digitalServices: e.target.checked }))}
                        className="w-4.5 h-4.5 rounded border-gray-300 text-violet-650 focus:ring-violet-500 cursor-pointer"
                      />
                    </label>

                    {/* Permission 4: محرر الأخبار والفعاليات ومنبر الأهالي */}
                    <label className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-100 hover:bg-gray-100/50 cursor-pointer transition-colors flex-row-reverse">
                      <span className="text-xs font-semibold text-gray-800">محرر الأخبار والفعاليات ومنبر الأهالي</span>
                      <input
                        type="checkbox"
                        checked={memberFormPermissions.newsAndCommunity}
                        onChange={(e) => setMemberFormPermissions(prev => ({ ...prev, newsAndCommunity: e.target.checked }))}
                        className="w-4.5 h-4.5 rounded border-gray-300 text-violet-650 focus:ring-violet-500 cursor-pointer"
                      />
                    </label>

                    {/* Permission 5: المشاريع التنموية */}
                    <label className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-100 hover:bg-gray-100/50 cursor-pointer transition-colors flex-row-reverse">
                      <span className="text-xs font-semibold text-gray-800">المشاريع التنموية</span>
                      <input
                        type="checkbox"
                        checked={memberFormPermissions.projects}
                        onChange={(e) => setMemberFormPermissions(prev => ({ ...prev, projects: e.target.checked }))}
                        className="w-4.5 h-4.5 rounded border-gray-300 text-violet-650 focus:ring-violet-500 cursor-pointer"
                      />
                    </label>

                    {/* Permission 6: طلبات ومقترحات المواطنين */}
                    <label className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-100 hover:bg-gray-100/50 cursor-pointer transition-colors flex-row-reverse">
                      <span className="text-xs font-semibold text-gray-800">طلبات ومقترحات المواطنين</span>
                      <input
                        type="checkbox"
                        checked={memberFormPermissions.requestsAndSuggestions}
                        onChange={(e) => setMemberFormPermissions(prev => ({ ...prev, requestsAndSuggestions: e.target.checked }))}
                        className="w-4.5 h-4.5 rounded border-gray-300 text-violet-650 focus:ring-violet-500 cursor-pointer"
                      />
                    </label>

                    {/* Permission 7: الرسم البياني والإحصائيات */}
                    <label className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-100 hover:bg-gray-100/50 cursor-pointer transition-colors flex-row-reverse">
                      <span className="text-xs font-semibold text-gray-800">الرسم البياني والإحصائيات</span>
                      <input
                        type="checkbox"
                        checked={memberFormPermissions.statsAndCharts}
                        onChange={(e) => setMemberFormPermissions(prev => ({ ...prev, statsAndCharts: e.target.checked }))}
                        className="w-4.5 h-4.5 rounded border-gray-300 text-violet-650 focus:ring-violet-500 cursor-pointer"
                      />
                    </label>

                    {/* Permission 8: إدارة الدليل التجاري والخدمي */}
                    <label className="flex items-center justify-between p-2.5 bg-sky-50/60 rounded-xl border border-sky-100 hover:bg-sky-100/50 cursor-pointer transition-colors flex-row-reverse">
                      <span className="text-xs font-semibold text-sky-950">إدارة الدليل التجاري والخدمي</span>
                      <input
                        type="checkbox"
                        checked={memberFormPermissions.manageDirectory !== false}
                        onChange={(e) => setMemberFormPermissions(prev => ({ ...prev, manageDirectory: e.target.checked }))}
                        className="w-4.5 h-4.5 rounded border-sky-300 text-sky-650 focus:ring-sky-500 cursor-pointer"
                      />
                    </label>

                    {/* Permission 9: إدارة متجر قارة الإلكتروني */}
                    <label className="flex items-center justify-between p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 hover:bg-emerald-100/50 cursor-pointer transition-colors flex-row-reverse">
                      <span className="text-xs font-semibold text-emerald-950">🛒 إدارة متجر قارة الإلكتروني (البيع والشراء)</span>
                      <input
                        type="checkbox"
                        checked={memberFormPermissions.manageMarketplace !== false}
                        onChange={(e) => setMemberFormPermissions(prev => ({ ...prev, manageMarketplace: e.target.checked }))}
                        className="w-4.5 h-4.5 rounded border-emerald-300 text-emerald-650 focus:ring-emerald-500 cursor-pointer"
                      />
                    </label>

                    {/* Permission 10: المعالم الأثرية والتاريخية */}
                    <label className="flex items-center justify-between p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 hover:bg-amber-100/50 cursor-pointer transition-colors flex-row-reverse">
                      <span className="text-xs font-semibold text-amber-950">🏛️ تعديل المعالم الأثرية والتاريخية</span>
                      <input
                        type="checkbox"
                        checked={!!memberFormPermissions.editLandmarks}
                        onChange={(e) => setMemberFormPermissions(prev => ({ ...prev, editLandmarks: e.target.checked }))}
                        className="w-4.5 h-4.5 rounded border-amber-300 text-amber-650 focus:ring-amber-500 cursor-pointer"
                      />
                    </label>

                    {/* Permission 8: البث المباشر من كمرا الجوال */}
                    <label className="flex items-center justify-between p-2.5 bg-rose-50/60 rounded-xl border border-rose-200/80 hover:bg-rose-100/50 cursor-pointer transition-colors flex-row-reverse col-span-1 sm:col-span-2">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-rose-600 shrink-0 animate-pulse" />
                        <div>
                          <span className="text-xs font-bold text-rose-950 block">📹 تشغيل البث المباشر المباشر من كمرا الجوال</span>
                          <span className="text-[10px] text-rose-700/80 block">صلاحية خاصة يمنحها المدير العام للعضو لبدء بث الكاميرا الحي من الجوال</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={!!memberFormPermissions.liveStreamBroadcast}
                        onChange={(e) => setMemberFormPermissions(prev => ({ ...prev, liveStreamBroadcast: e.target.checked }))}
                        className="w-4.5 h-4.5 rounded border-rose-400 text-rose-650 focus:ring-rose-500 cursor-pointer accent-rose-600"
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                  >
                    {editingMember ? 'تحديث صلاحيات العضو' : 'تسجيل وتفعيل العضو'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingMember(null); setIsAddingMember(false); }}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: SUGGESTION EDIT & GRAMMAR CORRECTION MODAL FORM */}
      {/* ======================================================== */}
      <AnimatePresence>
        {editingSug && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10 text-right font-sans"
              dir="rtl"
            >
              <div className="p-6 bg-indigo-900 text-white flex justify-between items-center flex-row-reverse">
                <h3 className="font-bold text-base sm:text-lg">
                  ✏️ تعديل وتصحيح المقترح إملائياً
                </h3>
                <button
                  onClick={() => setEditingSug(null)}
                  className="p-1.5 rounded-full hover:bg-indigo-950/80 text-indigo-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSuggestionEdit} className="p-6 space-y-4">
                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-gray-700 block">عنوان المقترح *</label>
                  <input
                    type="text"
                    required
                    value={sugFormTitle}
                    onChange={(e) => setSugFormTitle(e.target.value)}
                    placeholder="عنوان المقترح الواضح"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-indigo-700 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                  />
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-gray-700 block">تصنيف المقترح *</label>
                  <select
                    value={sugFormCategory}
                    onChange={(e) => setSugFormCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-indigo-700 focus:bg-white rounded-xl outline-none text-xs text-right font-sans cursor-pointer"
                  >
                    <option value="تحسين خدمات">تحسين خدمات</option>
                    <option value="فكرة مشروع">فكرة مشروع</option>
                    <option value="شكوى">شكوى</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-gray-700 block">محتوى المقترح (صحيح الأخطاء الإملائية هنا) *</label>
                  <textarea
                    rows={6}
                    required
                    value={sugFormContent}
                    onChange={(e) => setSugFormContent(e.target.value)}
                    placeholder="محتوى المبادرة أو المقترح بالكامل..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-indigo-700 focus:bg-white rounded-xl outline-none text-xs text-right leading-relaxed font-sans"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                  >
                    حفظ وتصحيح المقترح
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSug(null)}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: CUSTOM PAGE ADD/EDIT SECTION DETAILS */}
      {/* ======================================================== */}
      <AnimatePresence>
        {editingPageId && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10 text-right font-sans"
              dir="rtl"
            >
              <div className="p-6 bg-sky-900 text-white flex justify-between items-center flex-row-reverse">
                <h3 className="font-bold text-base sm:text-lg">
                  ✏️ تعديل محتوى وتفاصيل الصفحة التراثية المخصصة
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingPageId(null)}
                  className="p-1.5 rounded-full hover:bg-sky-950/80 text-sky-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCustomPageEdit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Core parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-5 text-right">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">عنوان الصفحة الرئيسي (التبويب) *</label>
                    <input
                      type="text"
                      required
                      value={editingPageTitle}
                      onChange={(e) => setEditingPageTitle(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                    />
                  </div>

                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-gray-700 block">الشرح المبسط أعلى الصفحة *</label>
                    <input
                      type="text"
                      required
                      value={editingPageDescription}
                      onChange={(e) => setEditingPageDescription(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right font-sans"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2 text-right">
                    <label className="text-xs font-bold text-gray-700 block">نص المقدمة الترحيبية بالصفحة *</label>
                    <textarea
                      rows={3}
                      required
                      value={editingPageIntroText}
                      onChange={(e) => setEditingPageIntroText(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-sky-600 focus:bg-white rounded-xl outline-none text-xs text-right leading-relaxed font-sans"
                    />
                  </div>
                </div>

                {/* Content sections editing */}
                <div className="space-y-6 text-right">
                  <h4 className="font-extrabold text-sm text-emerald-950 flex items-center justify-end gap-1.5 border-b border-gray-100 pb-2">
                    <span>تعديل الأقسام والفقرات الفرعية بالصفحة ({editingPageSections.length})</span>
                    <Sparkles className="h-4 w-4 text-emerald-700" />
                  </h4>

                  {editingPageSections.map((sec, idx) => (
                    <div key={sec.id} className="p-5 bg-gray-50 border border-gray-100 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2 flex-row-reverse">
                        <span className="text-xs font-bold text-gray-700">القسم رقم #{idx + 1}</span>
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-mono font-bold">
                          المعرّف: {sec.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-600 block">عنوان القسم الفرعي *</label>
                          <input
                            type="text"
                            required
                            value={sec.title}
                            onChange={(e) => handleUpdateEditingSection(idx, 'title', e.target.value)}
                            className="w-full p-2.5 bg-white border border-gray-200 focus:border-sky-600 rounded-xl outline-none text-xs text-right font-sans"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-600 block">شعار / تصنيف صغير (Badge)</label>
                          <input
                            type="text"
                            value={sec.badge || ''}
                            onChange={(e) => handleUpdateEditingSection(idx, 'badge', e.target.value)}
                            placeholder="مثال: معلم أثري، حرفة تراثية..."
                            className="w-full p-2.5 bg-white border border-gray-200 focus:border-sky-600 rounded-xl outline-none text-xs text-right font-sans"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[11px] font-bold text-gray-600 block">رابط صورة القسم (من Unsplash أو رابط مباشر)</label>
                          <input
                            type="text"
                            value={sec.image || ''}
                            onChange={(e) => handleUpdateEditingSection(idx, 'image', e.target.value)}
                            placeholder="https://..."
                            className="w-full p-2.5 bg-white border border-gray-200 focus:border-sky-600 rounded-xl outline-none text-xs text-right font-sans"
                          />
                          {sec.image && (
                            <div className="mt-1 flex justify-end">
                              <img src={sec.image} alt={sec.title} className="h-16 w-28 object-cover rounded-lg border shadow-sm" referrerPolicy="no-referrer" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[11px] font-bold text-gray-600 block">نص المحتوى والتفاصيل للقسم *</label>
                          <textarea
                            rows={4}
                            required
                            value={sec.content}
                            onChange={(e) => handleUpdateEditingSection(idx, 'content', e.target.value)}
                            className="w-full p-3 bg-white border border-gray-200 focus:border-sky-600 rounded-xl outline-none text-xs text-right leading-relaxed font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex gap-2 flex-row-reverse border-t border-gray-100">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                  >
                    حفظ التغييرات كاملة وتعديل الصفحة
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPageId(null)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    إلغاء التعديل
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Dialog Modal */}
      <AnimatePresence>
        {confirmConfig && (
          <div className="fixed inset-0 bg-emerald-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-amber-900/10 text-right font-sans"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-row-reverse">
                <h4 className="font-bold text-gray-950 text-base flex items-center gap-2">
                  <AlertTriangle className={`h-5 w-5 ${confirmConfig.danger ? 'text-red-500' : 'text-amber-500'}`} />
                  <span>{confirmConfig.title}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setConfirmConfig(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer transition-colors"
                >
                  &times;
                </button>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-600 my-5 leading-relaxed">
                {confirmConfig.message}
              </p>

              <div className="flex justify-end gap-2.5 flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    confirmConfig.onConfirm();
                    setConfirmConfig(null);
                  }}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl text-white transition-all cursor-pointer shadow hover:shadow-md ${
                    confirmConfig.danger 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-emerald-800 hover:bg-emerald-900'
                  }`}
                >
                  تأكيد الإجراء
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmConfig(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
