import React from 'react';
import { HomeContent } from '../types';
import { Sparkles } from 'lucide-react';

interface PageHeaderProps {
  badge: string;
  title: string;
  description?: string;
  homeContent: HomeContent;
  action?: React.ReactNode;
}

export default function PageHeader({ badge, title, description, homeContent, action }: PageHeaderProps) {
  const {
    pageHeaderStyle = 'ornamented',
    pageHeaderColor = '#022c22',
    pageHeaderBg = 'transparent',
    pageHeaderFontSize = '32',
    pageHeaderFontFamily = 'Cairo',
    pageHeaderAlignment = 'center',
  } = homeContent || {};

  // Custom inline style mapping
  const headerStyle: React.CSSProperties = {
    color: pageHeaderColor,
    fontFamily: pageHeaderFontFamily ? `"${pageHeaderFontFamily}", "Cairo", sans-serif` : undefined,
    fontSize: pageHeaderFontSize ? `${pageHeaderFontSize}px` : undefined,
  };

  const alignmentClass = 
    pageHeaderAlignment === 'right' ? 'text-right items-end' :
    pageHeaderAlignment === 'left' ? 'text-left items-start' : 'text-center items-center';

  const containerBgClass = 
    pageHeaderBg !== 'transparent' ? 'p-6 rounded-2xl shadow-sm border border-amber-900/10' : 'bg-transparent';

  const renderStyledTitle = () => {
    // Force title to be strictly in a single line with responsive size scaling
    const commonClass = "whitespace-nowrap overflow-hidden text-ellipsis max-w-full font-extrabold tracking-tight transition-all duration-300";
    
    // Calculate responsive sizes relative to default
    // pageHeaderFontSize is typically "24" to "48"
    const sizeNum = parseInt(pageHeaderFontSize, 10) || 32;
    const mobileSize = Math.max(18, sizeNum * 0.65);
    const smSize = Math.max(22, sizeNum * 0.85);

    // Embed custom media query for strict responsive font sizes
    const styleTag = (
      <style>{`
        .custom-page-title-${title.length} {
          font-size: ${mobileSize}px !important;
        }
        @media (min-width: 640px) {
          .custom-page-title-${title.length} {
            font-size: ${smSize}px !important;
          }
        }
        @media (min-width: 1024px) {
          .custom-page-title-${title.length} {
            font-size: ${sizeNum}px !important;
          }
        }
      `}</style>
    );

    switch (pageHeaderStyle) {
      case 'bottom_line':
        return (
          <div className="flex flex-col w-full overflow-hidden items-center">
            {styleTag}
            <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-full flex-wrap">
              <h1 
                style={headerStyle}
                className={`${commonClass} custom-page-title-${title.length} pb-2`}
              >
                {title}
              </h1>
              {action && <div className="inline-flex items-center mb-2">{action}</div>}
            </div>
            <div className="flex items-center gap-2 mt-1 justify-center">
              <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded"></div>
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <div className="h-[2px] w-20 bg-gradient-to-l from-transparent via-amber-500 to-transparent rounded"></div>
            </div>
          </div>
        );

      case 'side_border':
        return (
          <div className="flex items-center justify-between border-r-4 border-amber-500 pr-4 py-1.5 w-full overflow-hidden text-right flex-wrap gap-3">
            <div className="flex items-center gap-3">
              {styleTag}
              <h1 
                style={headerStyle}
                className={`${commonClass} custom-page-title-${title.length}`}
              >
                {title}
              </h1>
            </div>
            {action && <div className="inline-flex items-center">{action}</div>}
          </div>
        );

      case 'box_card':
        return (
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800/10 via-amber-500/5 to-emerald-900/5 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-md shadow-emerald-950/5 w-full text-center">
            {/* Elegant Background Patterns */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-700/10 rounded-full blur-2xl"></div>
            {styleTag}
            
            <div className="relative z-10 space-y-2 flex flex-col items-center">
              <div className="flex justify-between items-center w-full flex-wrap gap-2">
                <span className="inline-block text-xs uppercase tracking-widest text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full font-bold shadow-sm">
                  {badge}
                </span>
                {action && <div className="inline-flex items-center">{action}</div>}
              </div>
              <h1 
                style={headerStyle}
                className={`${commonClass} custom-page-title-${title.length} py-1 text-center bg-gradient-to-r from-emerald-950 via-amber-900 to-emerald-950 bg-clip-text text-transparent`}
              >
                {title}
              </h1>
              {description && (
                <p className="text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed mt-2">
                  {description}
                </p>
              )}
            </div>
          </div>
        );

      case 'ornamented':
        return (
          <div className="flex flex-col items-center justify-center w-full overflow-hidden">
            {styleTag}
            <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-full flex-wrap">
              <span className="text-amber-600 text-lg sm:text-2xl select-none animate-pulse hidden sm:inline">❦</span>
              <h1 
                style={headerStyle}
                className={`${commonClass} custom-page-title-${title.length} py-1 px-2`}
              >
                {title}
              </h1>
              <span className="text-amber-600 text-lg sm:text-2xl select-none animate-pulse hidden sm:inline">❧</span>
              {action && <div className="inline-flex items-center sm:mr-3">{action}</div>}
            </div>
            <div className="text-amber-600/30 text-xs tracking-widest mt-1 select-none">❖ ━━━━━━ ❖</div>
          </div>
        );

      case 'simple':
      default:
        return (
          <div className="w-full overflow-hidden flex items-center justify-between flex-wrap gap-3">
            {styleTag}
            <h1 
              style={headerStyle}
              className={`${commonClass} custom-page-title-${title.length}`}
            >
              {title}
            </h1>
            {action && <div className="inline-flex items-center">{action}</div>}
          </div>
        );
    }
  };

  // If style is box_card, the card already contains the badge and description internally for layout elegance
  if (pageHeaderStyle === 'box_card') {
    return (
      <div className="w-full mb-10 transition-all duration-300">
        {renderStyledTitle()}
      </div>
    );
  }

  return (
    <div 
      className={`max-w-3xl mx-auto flex flex-col ${alignmentClass} mb-12 space-y-3.5 transition-all duration-300`}
      style={{ backgroundColor: pageHeaderBg }}
    >
      <div className={`w-full flex flex-col ${alignmentClass} ${containerBgClass} space-y-3`}>
        {badge && (
          <span className="text-[11px] sm:text-xs px-3.5 py-1.5 bg-emerald-800 text-amber-100 rounded-full font-bold shadow-sm inline-flex items-center gap-1.5 hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
            {badge}
          </span>
        )}
        
        {renderStyledTitle()}
        
        {description && (
          <p className="text-gray-500 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl transition-colors duration-200">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
