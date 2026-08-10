import React, { useState, useEffect } from 'react';
import { Building2, Heart, Mail, Phone, MapPin, ExternalLink, Calendar } from 'lucide-react';
import { HomeContent, CustomPage } from '../types';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  homeContent?: HomeContent;
  visibleTabs?: { [key: string]: boolean };
  customPages?: CustomPage[];
}

export default function Footer({ 
  setActiveTab, 
  homeContent,
  visibleTabs = { home: true, qara_city: true, news: true, landmarks: true, projects: true, services: true, gallery: true, survey: true, directory: true, ramadan: true, marketplace: true },
  customPages = []
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Extract variables with defaults
  const aboutTitle = homeContent?.footerAboutTitle || "مجلس مدينة قارة السورية";
  const aboutText = homeContent?.footerAboutText || "المنصة الرسمية الموحدة لمدينة قارة، لتأمين التواصل المباشر وتسهيل المعاملات والخدمات للمواطنين داخل القطر والمغتربين، وتسليط الضوء على الإرث التاريخي العريق وجوانب التنمية المحلية في قارة الأثرية.";
  const address = homeContent?.footerAddress || "مبنى مجلس المدينة - الساحة العامة - قارة، ريف دمشق، سوريا";
  const phone = homeContent?.footerPhone || "+963 (11) 781-2345";
  const email = homeContent?.footerEmail || "info@qara-city.gov.sy";
  const zipCode = homeContent?.footerZipCode || "625129";
  const workingHours = homeContent?.footerWorkingHours || "دوام مجلس المدينة: 8:00 ص - 3:00 م";
  const madeWithLove = homeContent?.footerMadeWithLoveText || "صُنع بحب لأهالي مدينة قارة العريقة في سوريا الحبيبة";
  const copyright = homeContent?.footerCopyrightText || "بوابة مدينة قارة الإلكترونية - التنمية المحلية المستدامة";
  
  const bgColor = homeContent?.footerBgColor || "#022c22"; // green-950
  const textColor = homeContent?.footerTextColor || "#ecfdf5"; // emerald-100
  const accentColor = homeContent?.footerAccentColor || "#d97706"; // amber-600
  
  const alignment = homeContent?.footerAlignment || "right"; // 'right' | 'center' | 'left'
  
  const watermarkLogo = homeContent?.footerWatermarkLogo || "";
  const watermarkOpacity = homeContent?.footerWatermarkOpacity !== undefined ? homeContent.footerWatermarkOpacity : 0.15;
  const watermarkRepeat = homeContent?.footerWatermarkRepeat || "no-repeat";
  const watermarkRotate = homeContent?.footerWatermarkRotate !== undefined ? homeContent.footerWatermarkRotate : -15;
  const watermarkWidth = homeContent?.footerWatermarkWidth || 150;
  const watermarkPosition = homeContent?.footerWatermarkPosition || "center";
  const watermarkX = homeContent?.footerWatermarkX !== undefined ? homeContent.footerWatermarkX : 0;
  const watermarkY = homeContent?.footerWatermarkY !== undefined ? homeContent.footerWatermarkY : 0;
  const columnsLayout = homeContent?.footerColumnsLayout || "default";
  const linksContactShift = homeContent?.footerLinksContactShift !== undefined ? homeContent.footerLinksContactShift : 0;

  // Alignment classes mapping
  const alignTextClass = alignment === 'center' ? 'text-center' : alignment === 'left' ? 'text-left' : 'text-right';
  const flexAlignClass = alignment === 'center' ? 'justify-center' : alignment === 'left' ? 'justify-start' : 'justify-end';
  const itemsAlignClass = alignment === 'center' ? 'items-center' : alignment === 'left' ? 'items-start' : 'items-end';

  // Responsive columns translate offset for links/contact (translating left in RTL: negative translateX)
  const columnsShiftStyle: React.CSSProperties = isDesktop && linksContactShift > 0 ? {
    transform: `translateX(-${linksContactShift}px)`,
    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  } : {};

  // Custom positioning styles for the watermark
  const getWatermarkStyle = (): React.CSSProperties => {
    if (watermarkRepeat === 'repeat') {
      return {
        opacity: watermarkOpacity,
        backgroundImage: `url(${watermarkLogo})`,
        backgroundSize: `${watermarkWidth}px`,
        backgroundRepeat: 'repeat',
        transform: `rotate(${watermarkRotate}deg) translate(${watermarkX}px, ${watermarkY}px)`,
        width: '100%',
        height: '100%',
        transition: 'all 0.2s ease-out',
      };
    }

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      width: `${watermarkWidth}px`,
      transform: `translate(${watermarkX}px, calc(-50% + ${watermarkY}px)) rotate(${watermarkRotate}deg)`,
      transition: 'all 0.2s ease-out',
    };

    if (watermarkPosition === 'center') {
      baseStyle.left = '50%';
      baseStyle.transform = `translate(calc(-50% + ${watermarkX}px), calc(-50% + ${watermarkY}px)) rotate(${watermarkRotate}deg)`;
    } else if (watermarkPosition === 'right') {
      baseStyle.right = '8%';
      baseStyle.left = 'auto';
    } else { // 'left'
      baseStyle.left = '8%';
      baseStyle.right = 'auto';
    }

    return baseStyle;
  };

  return (
    <footer 
      className="relative border-t-4 font-sans overflow-hidden transition-all duration-300 z-10"
      style={{ 
        backgroundColor: bgColor, 
        color: textColor,
        borderColor: accentColor
      }}
    >
      {/* Absolute Watermark Logo */}
      {watermarkLogo && (
        <div 
          className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden"
          style={{ opacity: watermarkOpacity }}
        >
          {watermarkRepeat === 'repeat' ? (
            <div 
              className="shrink-0"
              style={getWatermarkStyle()}
            />
          ) : (
            <img 
              src={watermarkLogo} 
              alt="Footer Watermark" 
              className="max-h-[85%] object-contain"
              style={getWatermarkStyle()}
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      )}

      {/* Foreground Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
        <div className={`grid grid-cols-1 gap-8 ${
          columnsLayout === 'left_shifted' ? 'md:grid-cols-5' :
          columnsLayout === 'wide_spaced' ? 'md:grid-cols-4 md:gap-16' : 'md:grid-cols-4'
        }`}>
          
          {/* Logo and About Column */}
          <div className={`${
            columnsLayout === 'left_shifted' ? 'md:col-span-2' : 'md:col-span-2'
          } space-y-4 ${alignTextClass}`}>
            <div className={`flex items-center space-x-2 space-x-reverse ${flexAlignClass}`}>
              <div 
                className="p-2 rounded-xl transition-all"
                style={{ backgroundColor: accentColor, color: bgColor }}
              >
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-wide text-white">
                {aboutTitle}
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-md inline-block opacity-90">
              {aboutText}
            </p>
            {address && (
              <div className={`flex ${itemsAlignClass} gap-2 text-xs opacity-85 mt-2 ${flexAlignClass}`}>
                {alignment !== 'left' && <span>{address}</span>}
                <MapPin className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
                {alignment === 'left' && <span>{address}</span>}
              </div>
            )}
          </div>

          {/* Empty spacer column for center-cleared look */}
          {columnsLayout === 'left_shifted' && (
            <div className="hidden md:block col-span-1 pointer-events-none" />
          )}

          {/* Quick Nav Links Column */}
          <div 
            className={`space-y-4 ${alignTextClass}`}
            style={columnsShiftStyle}
          >
            <h3 
              className={`font-bold text-md text-white inline-block`}
              style={{ 
                borderRightColor: alignment === 'right' ? accentColor : 'transparent',
                borderLeftColor: alignment === 'left' ? accentColor : 'transparent',
                borderBottomColor: alignment === 'center' ? accentColor : 'transparent',
                borderWidth: alignment === 'center' ? '0 0 2px 0' : alignment === 'left' ? '0 0 0 4px' : '0 4px 0 0',
                paddingRight: alignment === 'right' ? '0.5rem' : '0',
                paddingLeft: alignment === 'left' ? '0.5rem' : '0',
                paddingBottom: alignment === 'center' ? '0.25rem' : '0'
              }}
            >
              روابط سريعة
            </h3>
            <ul className="space-y-2.5 text-sm">
              {(() => {
                interface FooterLink {
                  tab: string;
                  label: string;
                  isSpecial?: boolean;
                }

                const isServicesVisible = visibleTabs.services !== false && homeContent?.servicesPageEnabled !== false;

                const defaultLinks: FooterLink[] = [
                  { tab: 'home', label: 'الرئيسية والمحطات التاريخية' },
                  { tab: 'news', label: 'أخبار ومناسبات المدينة' },
                  { tab: 'projects', label: 'المشاريع التنموية والتطوع' },
                  ...(isServicesVisible ? [{ tab: 'services', label: 'تقديم المعاملات والخدمات' }] : []),
                  { tab: 'directory', label: homeContent?.directoryPageName || 'الدليل التجاري والخدمي' },
                  { tab: 'gallery', label: 'معرض الصور وألبوم بلدة قارة' }
                ];

                // Filter visible default links
                const visibleDefaultLinks = defaultLinks.filter(item => visibleTabs[item.tab] !== false);

                // Filter custom pages which are active (not hidden)
                const activeCustomLinks: FooterLink[] = customPages
                  .filter(p => p.status === 'active')
                  .map(p => ({ tab: p.id, label: p.title }));

                const footerLinks: FooterLink[] = [
                  ...visibleDefaultLinks,
                  ...activeCustomLinks,
                  { tab: 'admin', label: '⚙️ لوحة الإدارة والتحكم الكامل', isSpecial: true }
                ];

                return footerLinks.map((item) => (
                  <li key={item.tab}>
                    <button 
                      onClick={() => setActiveTab(item.tab)} 
                      className={`transition-all duration-150 flex items-center gap-1.5 hover:opacity-80 cursor-pointer w-full ${flexAlignClass} ${item.isSpecial ? 'font-bold' : ''}`}
                      style={{ color: item.isSpecial ? accentColor : 'inherit' }}
                    >
                      <span>{item.label}</span>
                    </button>
                  </li>
                ));
              })()}
            </ul>
          </div>

          {/* Contact & Support Column */}
          <div 
            className={`space-y-4 ${alignTextClass}`}
            style={columnsShiftStyle}
          >
            <h3 
              className={`font-bold text-md text-white inline-block`}
              style={{ 
                borderRightColor: alignment === 'right' ? accentColor : 'transparent',
                borderLeftColor: alignment === 'left' ? accentColor : 'transparent',
                borderBottomColor: alignment === 'center' ? accentColor : 'transparent',
                borderWidth: alignment === 'center' ? '0 0 2px 0' : alignment === 'left' ? '0 0 0 4px' : '0 4px 0 0',
                paddingRight: alignment === 'right' ? '0.5rem' : '0',
                paddingLeft: alignment === 'left' ? '0.5rem' : '0',
                paddingBottom: alignment === 'center' ? '0.25rem' : '0'
              }}
            >
              تواصل معنا
            </h3>
            <ul className="space-y-3 text-sm opacity-90">
              {phone && (
                <li className={`flex ${itemsAlignClass} gap-2 ${flexAlignClass}`}>
                  {alignment !== 'left' && <span dir="ltr">{phone}</span>}
                  <Phone className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
                  {alignment === 'left' && <span dir="ltr">{phone}</span>}
                </li>
              )}
              {email && (
                <li className={`flex ${itemsAlignClass} gap-2 ${flexAlignClass}`}>
                  {alignment !== 'left' && <span dir="ltr">{email}</span>}
                  <Mail className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
                  {alignment === 'left' && <span dir="ltr">{email}</span>}
                </li>
              )}
              {zipCode && (
                <li className={`flex ${itemsAlignClass} gap-2 ${flexAlignClass}`}>
                  {alignment !== 'left' && <span>الرمز البريدي: {zipCode}</span>}
                  <MapPin className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
                  {alignment === 'left' && <span>الرمز البريدي: {zipCode}</span>}
                </li>
              )}
              {workingHours && (
                <li className={`flex ${itemsAlignClass} gap-2 text-xs ${flexAlignClass}`} style={{ color: accentColor }}>
                  {alignment !== 'left' && <span>{workingHours}</span>}
                  <Calendar className="h-4 w-4 shrink-0" />
                  {alignment === 'left' && <span>{workingHours}</span>}
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Decorative Divider */}
        <div className="my-10 flex justify-center">
          <div className="w-full h-[1px] bg-white/10 relative flex justify-center">
            <div 
              className="px-4 -mt-3.5 text-lg select-none"
              style={{ backgroundColor: bgColor, color: accentColor }}
            >
              ❦ ❧
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`flex flex-col md:flex-row ${itemsAlignClass} justify-between text-xs opacity-75 gap-4`}>
          <div className={`flex items-center gap-1.5 ${flexAlignClass}`}>
            <span>{madeWithLove}</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline shrink-0" />
          </div>
          <div className="text-center md:text-left">
            <span>جميع الحقوق محفوظة © {currentYear} {copyright}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
