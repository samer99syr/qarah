import React, { useState } from 'react';
import { Menu, X, Building2, Landmark, Shield, TreePine, Crown, Castle, MapPin, Users, ChevronDown, Sparkles, Cherry, Snowflake, UserCheck, User, LogOut } from 'lucide-react';
import { HomeContent, CustomPage, CitizenUser } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  homeContent: HomeContent;
  visitorCount: number;
  visibleTabs?: { [key: string]: boolean };
  customPages?: CustomPage[];
  onOpenLiveStream?: () => void;
  loggedCitizen?: CitizenUser | null;
  onOpenCitizenAuth?: () => void;
  onOpenCitizenPortal?: () => void;
  onCitizenLogout?: () => void;
}

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  homeContent, 
  visitorCount,
  visibleTabs = { home: true, qara_city: true, news: true, landmarks: true, projects: true, services: true, gallery: true, survey: true, directory: true, ramadan: true, marketplace: true },
  customPages = [],
  onOpenLiveStream,
  loggedCitizen,
  onOpenCitizenAuth,
  onOpenCitizenPortal,
  onCitizenLogout
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterDropdown = (tabId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdownId(tabId);
  };

  const handleMouseLeaveDropdown = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdownId(null);
    }, 250);
  };

  const renderCompactCounter = () => {
    if (homeContent.visitorCountEnabled === false || homeContent.visitorCounterPosition !== 'navbar_top_left') {
      return null;
    }

    return (
      <div 
        id="compact-navbar-counter" 
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all shadow-sm font-sans shrink-0"
        style={{
          backgroundColor: homeContent.visitorCounterBg || '#064e3b',
          borderColor: (homeContent.visitorCounterColor || '#fbbf24') + '25',
          color: homeContent.visitorCounterColor || '#fbbf24'
        }}
      >
        <span className="flex h-1.5 w-1.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
        </span>
        <Users className="h-3.5 w-3.5 opacity-90" />
        <span className="text-xs font-bold font-mono tracking-wider">
          {visitorCount.toLocaleString('en-US')}
        </span>
        <span className="text-[10px] text-white/80 font-medium">زائر</span>
      </div>
    );
  };

  // Header Preset Configurations
  const presetStyle = homeContent?.headerPresetStyle || 'emerald_gold';

  const getPresetDefaults = () => {
    switch (presetStyle) {
      case 'glassmorphic':
        return {
          bg: 'rgba(255, 255, 255, 0.85)',
          border: 'rgba(229, 231, 235, 0.8)',
          titleColor: '#064e3b',
          subtitleColor: '#d97706',
          tabActive: '#064e3b',
          tabInactive: '#374151',
          tabBgActive: '#ecfdf5',
        };
      case 'royal_luxe':
        return {
          bg: '#064e3b',
          border: '#043e2e',
          titleColor: '#fef3c7',
          subtitleColor: '#fcd34d',
          tabActive: '#fbbf24',
          tabInactive: '#d1fae5',
          tabBgActive: '#022c22',
        };
      case 'midnight_obsidian':
        return {
          bg: '#0f172a',
          border: '#1e293b',
          titleColor: '#f8fafc',
          subtitleColor: '#fbbf24',
          tabActive: '#38bdf8',
          tabInactive: '#94a3b8',
          tabBgActive: '#1e293b',
        };
      case 'clean_white':
        return {
          bg: '#ffffff',
          border: '#f3f4f6',
          titleColor: '#111827',
          subtitleColor: '#059669',
          tabActive: '#047857',
          tabInactive: '#4b5563',
          tabBgActive: '#ecfdf5',
        };
      case 'warm_sunset':
        return {
          bg: '#fffbeb',
          border: '#fef3c7',
          titleColor: '#14532d',
          subtitleColor: '#b45309',
          tabActive: '#064e3b',
          tabInactive: '#78350f',
          tabBgActive: '#fef3c7',
        };
      case 'emerald_gold':
      default:
        return {
          bg: '#fdfbf7',
          border: 'rgba(217, 119, 6, 0.15)',
          titleColor: '#022c22',
          subtitleColor: '#92400e',
          tabActive: '#064e3b',
          tabInactive: '#4b5563',
          tabBgActive: '#f0fdf4',
        };
    }
  };

  const presetDefaults = getPresetDefaults();

  const effectiveBg = homeContent?.headerBgColor || presetDefaults.bg;
  const effectiveBorder = homeContent?.headerBorderColor || presetDefaults.border;
  const effectiveTitleColor = homeContent?.headerTitleColor || presetDefaults.titleColor;
  const effectiveSubtitleColor = homeContent?.headerSubtitleColor || presetDefaults.subtitleColor;
  const tabColorActive = homeContent?.tabColorActive || presetDefaults.tabActive;
  const tabColorInactive = homeContent?.tabColorInactive || presetDefaults.tabInactive;
  const tabBgActive = homeContent?.tabBgActive || presetDefaults.tabBgActive;
  const tabStyle = homeContent?.tabStyle || 'pill';
  const tabFontSize = homeContent?.tabFontSize || '16';

  // Height Mode
  const heightMode = homeContent?.headerHeightMode || 'normal';
  let heightClass = 'h-18 sm:h-20';
  if (heightMode === 'compact') {
    heightClass = 'h-14 sm:h-16';
  } else if (heightMode === 'spacious') {
    heightClass = 'h-24';
  }

  // Distinction FX
  const distinctionFx = homeContent?.headerDistinctionFx || 'gold_glow';
  let fxClasses = 'shadow-sm';
  if (distinctionFx === 'glass_blur') {
    fxClasses = 'backdrop-blur-md shadow-sm';
  } else if (distinctionFx === 'gold_glow') {
    fxClasses = 'shadow-[0_4px_20px_-4px_rgba(217,119,6,0.15)]';
  } else if (distinctionFx === 'shadow_elevated') {
    fxClasses = 'shadow-md sm:shadow-lg';
  }

  // Logo Icon render
  const renderLogoIcon = () => {
    const iconName = homeContent?.headerLogoIcon || 'Building2';
    switch (iconName) {
      case 'Landmark': return <Landmark className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'Shield': return <Shield className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'TreePine': return <TreePine className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'Crown': return <Crown className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'Castle': return <Castle className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'Cherry': return <Cherry className="h-5 w-5 sm:h-6 sm:w-6 text-rose-200" />;
      case 'Snowflake': return <Snowflake className="h-5 w-5 sm:h-6 sm:w-6 text-sky-200 animate-pulse" />;
      default: return <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />;
    }
  };

  // Check if services tab should be visible
  const isServicesVisible = visibleTabs.services !== false && homeContent?.servicesPageEnabled !== false;

  // Build navigation items respecting visibility toggles
  const defaultItems: { id: string; label: string }[] = [];

  if (visibleTabs.home !== false) {
    defaultItems.push({ id: 'home', label: 'الرئيسية' });
  }

  if (visibleTabs.qara_city !== false) {
    defaultItems.push({ id: 'qara_city', label: 'مدينة قارة' });
  }

  if (visibleTabs.projects !== false) {
    defaultItems.push({ id: 'projects', label: 'المشاريع التنموية' });
  }

  if (isServicesVisible) {
    defaultItems.push({ id: 'services', label: 'الخدمات الإلكترونية' });
  }

  if (visibleTabs.survey !== false && (!visibleTabs.survey_as_sub || !isServicesVisible)) {
    defaultItems.push({ id: 'survey', label: 'أحصائيات ميدانية' });
  }

  if (visibleTabs.directory !== false && (!visibleTabs.directory_as_sub || !isServicesVisible)) {
    defaultItems.push({ id: 'directory', label: homeContent?.directoryPageName || 'الدليل التجاري والخدمي' });
  }

  if (visibleTabs.gallery !== false) {
    defaultItems.push({ id: 'gallery', label: 'معرض الصور' });
  }

  if (visibleTabs.ramadan !== false) {
    defaultItems.push({ id: 'ramadan', label: 'مسابقة رمضانية 🌙' });
  }

  const visibleDefaultItems = defaultItems;

  const activeCustomMainItems = customPages
    .filter(p => p.isMain && p.status === 'active')
    .map(p => ({ id: p.id, label: p.title }));

  const allMainTabs = [...visibleDefaultItems, ...activeCustomMainItems];

  const getSubTabsFor = (parentId: string) => {
    const subs = customPages
      .filter(p => !p.isMain && p.parentId === parentId && p.status === 'active')
      .map(p => ({ id: p.id, title: p.title }));

    if (parentId === 'directory') {
      const dirSubs: { id: string; title: string }[] = [];
      if (visibleTabs.marketplace !== false) {
        dirSubs.push({ id: 'marketplace', title: homeContent?.marketplaceConfig?.storeTitle || '🛒 متجر قارة الإلكتروني (البيع والشراء)' });
      }
      return [...dirSubs, ...subs];
    }

    if (parentId === 'qara_city') {
      const qaraSubs: { id: string; title: string }[] = [];
      if (visibleTabs.news !== false) {
        qaraSubs.push({ id: 'news', title: 'أخبار قارة' });
      }
      if (visibleTabs.landmarks !== false) {
        qaraSubs.push({ id: 'landmarks', title: 'المعالم الأثرية' });
      }
      return [...qaraSubs, ...subs];
    }

    if (parentId === 'services') {
      const extraSubs = [...subs];
      if (visibleTabs.survey !== false && visibleTabs.survey_as_sub) {
        extraSubs.push({ id: 'survey', title: 'أحصائيات ميدانية' });
      }
      if (visibleTabs.directory !== false && visibleTabs.directory_as_sub) {
        extraSubs.push({ id: 'directory', title: homeContent?.directoryPageName || 'الدليل التجاري والخدمي' });
      }
      return extraSubs;
    }
    return subs;
  };

  const getTabStyles = (isActive: boolean) => {
    const baseStyle: React.CSSProperties = {
      fontSize: `${tabFontSize}px`,
    };

    if (isActive) {
      baseStyle.color = tabColorActive;
      if (tabStyle === 'pill') {
        baseStyle.backgroundColor = tabBgActive;
      } else if (tabStyle === 'glass') {
        baseStyle.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        baseStyle.backdropFilter = 'blur(4px)';
        baseStyle.border = `1px solid ${tabColorActive}25`;
        baseStyle.boxShadow = '0 2px 8px -1px rgba(0,0,0,0.04)';
      } else if (tabStyle === 'bordered') {
        baseStyle.border = `2px solid ${tabColorActive}`;
        baseStyle.backgroundColor = `${tabColorActive}05`;
      }
    } else {
      baseStyle.color = tabColorInactive;
    }

    return baseStyle;
  };

  const tabHoverEffect = homeContent?.tabHoverEffect || 'lift_up';

  const getTabClasses = (isActive: boolean) => {
    let classes = "px-3.5 py-2 rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 relative whitespace-nowrap select-none flex items-center gap-1 cursor-pointer ";
    
    if (isActive) {
      classes += "font-bold ";
    }
    
    switch (tabHoverEffect) {
      case 'lift_up':
        classes += "hover:-translate-y-1 hover:shadow-md transform transition-transform duration-200 ease-out ";
        break;
      case 'lift_glow':
        classes += "hover:-translate-y-1.5 hover:shadow-lg hover:shadow-amber-500/30 hover:border-amber-400/60 transform transition-all duration-200 ";
        break;
      case 'scale_bounce':
        classes += "hover:scale-105 transform transition-transform duration-200 ease-out ";
        break;
      case 'underline_slide':
        classes += "after:content-[''] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-current after:transition-all after:duration-300 hover:after:w-3/4 ";
        break;
      case '3d_flip':
        classes += "hover:-translate-y-1 hover:-rotate-1 hover:scale-105 transform transition-all duration-200 ";
        break;
      case 'none':
      default:
        classes += "hover:opacity-80 ";
        break;
    }
    
    return classes;
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${fxClasses}`}
      style={{
        backgroundColor: effectiveBg,
        borderBottom: `1px solid ${effectiveBorder}`
      }}
    >
      {/* Optional Top Accent Bar */}
      {distinctionFx === 'accent_top' && (
        <div className="h-1 w-full bg-gradient-to-r from-emerald-800 via-amber-400 to-emerald-800"></div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 transition-all duration-300 min-h-[60px]" style={{ height: heightClass ? undefined : 'auto' }}>
          
          {/* Standalone Logo at Far Right (if position is 'right' or default) */}
          {homeContent?.headerLogo && (homeContent?.headerLogoPosition || 'right') === 'right' && (
            <div className="flex items-center justify-center shrink-0 transition-transform hover:scale-105 duration-300">
              <img 
                src={homeContent.headerLogo} 
                alt="شعار الهيدر الرئيسي" 
                style={{
                  height: `${homeContent.headerLogoHeight || 44}px`,
                  maxHeight: '85px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
                className="rounded-lg shadow-2xs"
              />
            </div>
          )}

          {/* Independent Logo & Portal Title Section */}
          <div 
            className="flex items-center space-x-2.5 space-x-reverse cursor-pointer group select-none shrink-0" 
            onClick={() => setActiveTab('home')}
            onDoubleClick={() => setActiveTab('admin')}
            title="بوابة قارة (انقر مرتين للوصول للوحة التحكم)"
          >
            <div className="p-2 sm:p-2.5 bg-emerald-800 text-amber-100 rounded-xl shadow-md border border-emerald-700/60 transition-transform group-hover:scale-105 duration-300 shrink-0">
              {renderLogoIcon()}
            </div>
            <div className="flex flex-col text-right justify-center min-w-0">
              {/* Single line title - Guaranteed whitespace-nowrap */}
              <span 
                className="text-base sm:text-lg md:text-xl font-extrabold font-sans tracking-wide whitespace-nowrap leading-tight overflow-hidden text-ellipsis"
                style={{ color: effectiveTitleColor }}
              >
                {homeContent?.headerPortalTitle || 'بوابة قارة الإلكترونية'}
              </span>
              <span 
                className="text-[10px] sm:text-xs flex items-center gap-1 mt-0.5 justify-end font-mono whitespace-nowrap opacity-90"
                style={{ color: effectiveSubtitleColor }}
              >
                {homeContent?.headerPortalSubtitle || 'جبال القلمون، سوريا'} 
                <MapPin className="h-3 w-3 inline shrink-0 animate-bounce" />
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 space-x-reverse" dir="rtl">
            {allMainTabs.map((item) => {
              const subTabs = getSubTabsFor(item.id);
              const isParentActive = activeTab === item.id || subTabs.some(sub => activeTab === sub.id);
              
              if (subTabs.length > 0) {
                const isDropdownOpen = activeDropdownId === item.id;
                return (
                  <div 
                    key={item.id} 
                    className="relative group z-50"
                    onMouseEnter={() => handleMouseEnterDropdown(item.id)}
                    onMouseLeave={handleMouseLeaveDropdown}
                  >
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setActiveDropdownId(null);
                      }}
                      style={getTabStyles(isParentActive)}
                      className={getTabClasses(isParentActive)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`h-3 w-3 text-current transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      {isParentActive && tabStyle === 'classic' && (
                        <span 
                          className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full"
                          style={{ backgroundColor: tabColorActive }}
                        />
                      )}
                    </button>
                    
                    {/* Hover Dropdown Menu with Hover Bridge & State Stability */}
                    <div 
                      className={`absolute right-0 top-full pt-1.5 w-60 z-50 text-right transition-all duration-200 origin-top-right ${
                        isDropdownOpen 
                          ? 'opacity-100 visible scale-100 translate-y-0 pointer-events-auto' 
                          : 'opacity-0 invisible scale-95 -translate-y-2 pointer-events-none'
                      }`}
                    >
                      {/* Invisible Hover Bridge to prevent gap glitches between button and menu */}
                      <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent"></div>

                      <div 
                        className="w-full rounded-2xl border shadow-xl py-2"
                        style={{
                          backgroundColor: effectiveBg.includes('rgba') ? '#ffffff' : effectiveBg,
                          borderColor: effectiveBorder
                        }}
                      >
                        {subTabs.map(sub => {
                          const isSubActive = activeTab === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                setActiveTab(sub.id);
                                setActiveDropdownId(null);
                              }}
                              className={`w-full text-right px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-emerald-50 hover:text-emerald-950 transition-colors cursor-pointer ${
                                isSubActive ? 'text-emerald-800 bg-emerald-50/60 font-bold' : 'text-gray-600'
                              }`}
                            >
                              <span>{sub.title}</span>
                              {isSubActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-800" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={getTabStyles(isParentActive)}
                  className={getTabClasses(isParentActive)}
                >
                  {item.label}
                  {isParentActive && tabStyle === 'classic' && (
                    <span 
                      className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full"
                      style={{ backgroundColor: tabColorActive }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Contact & Emergency Button & Citizen Profile (Logged In) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* CITIZEN PROFILE BUTTON (If logged in) */}
            {loggedCitizen && (
              <div className="flex items-center gap-1.5 bg-emerald-950/80 p-1 rounded-2xl border border-emerald-700/60 shadow-sm">
                <button
                  onClick={onOpenCitizenPortal}
                  className="px-3 py-1.5 text-xs font-extrabold text-emerald-200 hover:text-white flex items-center gap-1.5 cursor-pointer rounded-xl hover:bg-emerald-800/60 transition-all"
                  title="الانتقال إلى صفحتي وبوابتي الشخصية"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <User className="h-3.5 w-3.5 text-amber-300" />
                  <span className="max-w-[120px] truncate">{loggedCitizen.fullName}</span>
                </button>
                <button
                  onClick={onCitizenLogout}
                  className="p-1.5 text-emerald-300 hover:text-rose-300 hover:bg-rose-950/60 rounded-xl transition-all cursor-pointer"
                  title="تسجيل الخروج من حساب المواطن"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {homeContent?.liveStreamEnabled !== false && onOpenLiveStream && (
              <button
                onClick={onOpenLiveStream}
                className="px-3 py-1.5 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-600 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer animate-pulse shrink-0 border border-rose-400/40"
                title="مشاهدة البث المباشر لمدينة قارة"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>البث المباشر 🔴</span>
              </button>
            )}
            {renderCompactCounter()}
            <button 
              onClick={() => {
                const element = document.getElementById('emergency-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('home');
                  setTimeout(() => {
                    document.getElementById('emergency-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              أرقام الطوارئ والدليل
            </button>
          </div>

          {/* Standalone Logo at Far Left (if position is 'left') - Positioned after Emergency & Directory */}
          {homeContent?.headerLogo && homeContent?.headerLogoPosition === 'left' && (
            <div className="flex items-center justify-center shrink-0 transition-transform hover:scale-105 duration-300">
              <img 
                src={homeContent.headerLogo} 
                alt="شعار الهيدر الرئيسي" 
                style={{
                  height: `${homeContent.headerLogoHeight || 44}px`,
                  maxHeight: '85px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
                className="rounded-lg shadow-2xs"
              />
            </div>
          )}
 
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2 shrink-0">
            {renderCompactCounter()}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-emerald-800 hover:bg-black/5 focus:outline-none transition-colors"
              aria-label="القائمة الرئيسية"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
 
      {/* Mobile Drawer */}
      {isOpen && (
        <div 
          className="md:hidden border-b px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fadeIn text-right" 
          style={{ backgroundColor: effectiveBg.includes('rgba') ? '#ffffff' : effectiveBg, borderColor: effectiveBorder }}
          dir="rtl"
        >
          {allMainTabs.map((item) => {
            const subTabs = getSubTabsFor(item.id);
            const isParentActive = activeTab === item.id || subTabs.some(sub => activeTab === sub.id);
            return (
              <div key={item.id} className="space-y-1 text-right">
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    if (subTabs.length === 0) {
                      setIsOpen(false);
                    }
                  }}
                  style={getTabStyles(isParentActive)}
                  className={`w-full text-right px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center justify-between ${
                    isParentActive 
                      ? 'shadow-sm font-bold' 
                      : 'hover:bg-black/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {subTabs.length > 0 && <ChevronDown className="h-4 w-4 text-gray-400" />}
                </button>

                {subTabs.length > 0 && (
                  <div className="pr-4 mr-2 border-r-2 border-amber-500/20 flex flex-col space-y-1 py-1.5 rounded-l-xl text-right">
                    {subTabs.map(sub => {
                      const isSubActive = activeTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveTab(sub.id);
                            setIsOpen(false);
                          }}
                          className={`w-full text-right py-2 px-4 text-xs rounded-lg font-bold transition-all ${
                            isSubActive 
                              ? 'text-emerald-900 bg-emerald-50 font-extrabold' 
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          ↳ {sub.title}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <div className="pt-4 border-t border-gray-200/50 px-2 space-y-2">
            {loggedCitizen && (
              <div className="flex items-center justify-between p-2.5 bg-emerald-950 text-emerald-100 rounded-xl">
                <button
                  onClick={() => { setIsOpen(false); if (onOpenCitizenPortal) onOpenCitizenPortal(); }}
                  className="flex items-center gap-2 font-bold text-xs cursor-pointer"
                >
                  <User className="h-4 w-4 text-amber-300" />
                  <span>صفحتي ({loggedCitizen.fullName})</span>
                </button>
                <button
                  onClick={() => { setIsOpen(false); if (onCitizenLogout) onCitizenLogout(); }}
                  className="p-1 text-rose-300 hover:text-white cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}

            <button 
              onClick={() => {
                setIsOpen(false);
                const element = document.getElementById('emergency-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('home');
                  setTimeout(() => {
                    document.getElementById('emergency-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="w-full py-3 px-4 text-center text-sm font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              أرقام الطوارئ والدليل المحلي
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

