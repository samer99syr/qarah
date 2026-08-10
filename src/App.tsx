import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeTab from './components/HomeTab';
import ServicesTab from './components/ServicesTab';
import NewsTab from './components/NewsTab';
import ProjectsTab from './components/ProjectsTab';
import AdminTab from './components/AdminTab';
import GalleryTab from './components/GalleryTab';
import CustomPageTab from './components/CustomPageTab';
import DirectoryTab from './components/DirectoryTab';
import SurveyTab from './components/SurveyTab';
import QaraCityTab from './components/QaraCityTab';
import LandmarksTab from './components/LandmarksTab';
import LiveStreamModal from './components/LiveStreamModal';
import CitizenAuthModal from './components/CitizenAuthModal';
import CitizenPortalTab from './components/CitizenPortalTab';
import MarketplaceTab from './components/MarketplaceTab';
import RamadanCompetitionTab from './components/RamadanCompetitionTab';

import { INITIAL_SERVICES, INITIAL_NEWS, INITIAL_PROJECTS, INITIAL_SUGGESTIONS, INITIAL_HOME_CONTENT, INITIAL_GALLERY_ITEMS, INITIAL_COMMUNITY_ANNOUNCEMENTS, INITIAL_BUSINESS_ACTIVITIES, INITIAL_MARKETPLACE_LISTINGS } from './data/qaraData';
import { INITIAL_SURVEY_TEMPLATES, INITIAL_SURVEY_RESPONSES } from './data/surveyData';
import { INITIAL_CITIZENS } from './data/initialCitizens';
import { INITIAL_RAMADAN_SETTINGS, INITIAL_RAMADAN_QUESTIONS, INITIAL_RAMADAN_ANSWERS } from './data/ramadanData';
import { Service, News, Project, Suggestion, ServiceRequest, HomeContent, GalleryItem, CustomPage, BusinessActivity, SurveyTemplate, SurveyResponse, CitizenUser, MarketplaceListing, RamadanCompetitionSettings, RamadanQuestion, RamadanUserAnswer } from './types';


export default function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('adId') || params.get('listingId')) {
      return 'marketplace';
    }
    return 'home';
  });
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState<boolean>(false);

  // Citizen Authentication & Account Management State
  const [citizens, setCitizens] = useState<CitizenUser[]>(() => {
    const saved = localStorage.getItem('qara_citizens_list');
    return saved ? JSON.parse(saved) : INITIAL_CITIZENS;
  });

  useEffect(() => {
    localStorage.setItem('qara_citizens_list', JSON.stringify(citizens));
  }, [citizens]);

  const [loggedCitizen, setLoggedCitizen] = useState<CitizenUser | null>(() => {
    const saved = localStorage.getItem('qara_logged_citizen');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (loggedCitizen) {
      localStorage.setItem('qara_logged_citizen', JSON.stringify(loggedCitizen));
    } else {
      localStorage.removeItem('qara_logged_citizen');
    }
  }, [loggedCitizen]);

  const [isCitizenAuthOpen, setIsCitizenAuthOpen] = useState<boolean>(false);

  // Unified global state for all editable content
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('qara_services_list');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [newsList, setNewsList] = useState<News[]>(() => {
    const saved = localStorage.getItem('qara_news_list');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [communityAnnouncements, setCommunityAnnouncements] = useState<News[]>(() => {
    const saved = localStorage.getItem('qara_community_news');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_ANNOUNCEMENTS;
  });

  useEffect(() => {
    localStorage.setItem('qara_community_news', JSON.stringify(communityAnnouncements));
  }, [communityAnnouncements]);

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('qara_projects_list');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    const saved = localStorage.getItem('qara_suggestions_list');
    return saved ? JSON.parse(saved) : INITIAL_SUGGESTIONS;
  });

  const [requests, setRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('qara_service_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const CURRENT_APP_VERSION = 'v2.6_livestream';

  const [homeContent, setHomeContent] = useState<HomeContent>(() => {
    const saved = localStorage.getItem('qara_home_content');
    const savedVersion = localStorage.getItem('qara_app_version');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged: HomeContent = {
          ...INITIAL_HOME_CONTENT,
          ...parsed,
          liveStreamEnabled: parsed.liveStreamEnabled !== undefined ? parsed.liveStreamEnabled : INITIAL_HOME_CONTENT.liveStreamEnabled,
          liveStreamUrl: parsed.liveStreamUrl || INITIAL_HOME_CONTENT.liveStreamUrl,
          liveStreamBadge: parsed.liveStreamBadge || INITIAL_HOME_CONTENT.liveStreamBadge,
          liveStreamStatusText: parsed.liveStreamStatusText || INITIAL_HOME_CONTENT.liveStreamStatusText,
          liveStreamCopyrightTitle: parsed.liveStreamCopyrightTitle || INITIAL_HOME_CONTENT.liveStreamCopyrightTitle,
          liveStreamCopyrightContent: parsed.liveStreamCopyrightContent || INITIAL_HOME_CONTENT.liveStreamCopyrightContent,
          tabHoverEffect: parsed.tabHoverEffect || INITIAL_HOME_CONTENT.tabHoverEffect,
        };

        if (savedVersion !== CURRENT_APP_VERSION) {
          localStorage.setItem('qara_app_version', CURRENT_APP_VERSION);
          localStorage.setItem('qara_home_content', JSON.stringify(merged));
        }
        return merged;
      } catch (e) {
        console.error("Failed to parse saved homeContent:", e);
      }
    }
    localStorage.setItem('qara_app_version', CURRENT_APP_VERSION);
    return INITIAL_HOME_CONTENT;
  });

  const [visitorCount, setVisitorCount] = useState<number>(() => {
    const saved = localStorage.getItem('qara_live_visitor_count');
    if (saved) {
      return parseInt(saved, 10);
    }
    return homeContent.visitorCount || 14582;
  });

  useEffect(() => {
    const newCount = visitorCount + 1;
    setVisitorCount(newCount);
    localStorage.setItem('qara_live_visitor_count', newCount.toString());
  }, []);

  useEffect(() => {
    if (homeContent.visitorCount !== undefined) {
      const saved = localStorage.getItem('qara_live_visitor_count');
      const savedNum = saved ? parseInt(saved, 10) : 0;
      if (!saved || Math.abs(savedNum - homeContent.visitorCount) > 100) {
        setVisitorCount(homeContent.visitorCount);
        localStorage.setItem('qara_live_visitor_count', homeContent.visitorCount.toString());
      }
    }
  }, [homeContent.visitorCount]);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('qara_gallery_items');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY_ITEMS;
  });

  const [fontFamily, setFontFamily] = useState<string>(() => {
    return localStorage.getItem('qara_font_family') || 'Cairo';
  });

  const [fontSize, setFontSize] = useState<string>(() => {
    return localStorage.getItem('qara_font_size') || '16';
  });

  const [layoutDirection, setLayoutDirection] = useState<string>(() => {
    return localStorage.getItem('qara_layout_direction') || 'rtl';
  });

  const [textAlignment, setTextAlignment] = useState<string>(() => {
    return localStorage.getItem('qara_text_alignment') || 'right';
  });

  const [activities, setActivities] = useState<BusinessActivity[]>(() => {
    const saved = localStorage.getItem('qara_business_activities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let migrated = false;
          const updated = parsed.map(act => {
            if (!act.status) {
              migrated = true;
              return { ...act, status: 'approved' as const };
            }
            return act;
          });
          if (migrated) {
            localStorage.setItem('qara_business_activities', JSON.stringify(updated));
          }
          return updated;
        }
      } catch (e) {
        console.error("Error migrating saved activities:", e);
      }
    }
    return INITIAL_BUSINESS_ACTIVITIES;
  });

  useEffect(() => {
    localStorage.setItem('qara_business_activities', JSON.stringify(activities));
  }, [activities]);

  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(() => {
    const saved = localStorage.getItem('qara_marketplace_listings');
    return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE_LISTINGS;
  });

  useEffect(() => {
    localStorage.setItem('qara_marketplace_listings', JSON.stringify(marketplaceListings));
  }, [marketplaceListings]);

  const [surveyTemplates, setSurveyTemplates] = useState<SurveyTemplate[]>(() => {
    const saved = localStorage.getItem('qara_survey_templates');
    return saved ? JSON.parse(saved) : INITIAL_SURVEY_TEMPLATES;
  });

  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>(() => {
    const saved = localStorage.getItem('qara_survey_responses');
    return saved ? JSON.parse(saved) : INITIAL_SURVEY_RESPONSES;
  });

  useEffect(() => {
    localStorage.setItem('qara_survey_templates', JSON.stringify(surveyTemplates));
  }, [surveyTemplates]);

  useEffect(() => {
    localStorage.setItem('qara_survey_responses', JSON.stringify(surveyResponses));
  }, [surveyResponses]);

  const [visibleTabs, setVisibleTabs] = useState<{ [key: string]: boolean }>(() => {
    const defaultTabs = {
      home: true,
      qara_city: true,
      news: true,
      landmarks: true,
      projects: true,
      services: true,
      gallery: true,
      survey: true,
      directory: true,
      ramadan: true,
      marketplace: true
    };
    const saved = localStorage.getItem('qara_visible_tabs');
    if (saved) {
      try {
        return { ...defaultTabs, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Error parsing qara_visible_tabs:", e);
      }
    }
    return defaultTabs;
  });

  // Listen to storage changes across tabs/windows in real time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const defaultTabs = {
        home: true,
        qara_city: true,
        news: true,
        landmarks: true,
        projects: true,
        services: true,
        gallery: true,
        survey: true,
        directory: true,
        ramadan: true,
        marketplace: true
      };
      if (e.key === 'qara_visible_tabs' && e.newValue) {
        try {
          setVisibleTabs({ ...defaultTabs, ...JSON.parse(e.newValue) });
        } catch (err) {
          console.error("Error parsing visibleTabs from storage event:", err);
        }
      }
      if (e.key === 'qara_home_content' && e.newValue) {
        try {
          setHomeContent(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Error parsing homeContent from storage event:", err);
        }
      }
      if (e.key === 'qara_custom_pages' && e.newValue) {
        try {
          setCustomPages(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Error parsing customPages from storage event:", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  const [customPages, setCustomPages] = useState<CustomPage[]>(() => {
    const saved = localStorage.getItem('qara_custom_pages');
    return saved ? JSON.parse(saved) : [];
  });

  // Ramadan Competition State
  const [ramadanSettings, setRamadanSettings] = useState<RamadanCompetitionSettings>(() => {
    const saved = localStorage.getItem('qara_ramadan_settings');
    return saved ? JSON.parse(saved) : INITIAL_RAMADAN_SETTINGS;
  });

  const [ramadanQuestions, setRamadanQuestions] = useState<RamadanQuestion[]>(() => {
    const saved = localStorage.getItem('qara_ramadan_questions');
    return saved ? JSON.parse(saved) : INITIAL_RAMADAN_QUESTIONS;
  });

  const [ramadanAnswers, setRamadanAnswers] = useState<RamadanUserAnswer[]>(() => {
    const saved = localStorage.getItem('qara_ramadan_answers');
    return saved ? JSON.parse(saved) : INITIAL_RAMADAN_ANSWERS;
  });

  useEffect(() => {
    localStorage.setItem('qara_ramadan_settings', JSON.stringify(ramadanSettings));
  }, [ramadanSettings]);

  useEffect(() => {
    localStorage.setItem('qara_ramadan_questions', JSON.stringify(ramadanQuestions));
  }, [ramadanQuestions]);

  useEffect(() => {
    localStorage.setItem('qara_ramadan_answers', JSON.stringify(ramadanAnswers));
  }, [ramadanAnswers]);

  // Save states to local storage on changes
  useEffect(() => {
    localStorage.setItem('qara_visible_tabs', JSON.stringify(visibleTabs));
  }, [visibleTabs]);

  useEffect(() => {
    localStorage.setItem('qara_custom_pages', JSON.stringify(customPages));
  }, [customPages]);

  useEffect(() => {
    localStorage.setItem('qara_services_list', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('qara_news_list', JSON.stringify(newsList));
  }, [newsList]);

  useEffect(() => {
    localStorage.setItem('qara_projects_list', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('qara_suggestions_list', JSON.stringify(suggestions));
  }, [suggestions]);

  useEffect(() => {
    localStorage.setItem('qara_service_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('qara_home_content', JSON.stringify(homeContent));
  }, [homeContent]);

  useEffect(() => {
    localStorage.setItem('qara_gallery_items', JSON.stringify(galleryItems));
  }, [galleryItems]);

  // Auto-archive approved gallery items exceeding the 48-item limit (keep newest 48)
  useEffect(() => {
    const approvedItems = galleryItems.filter(item => item.status === 'approved');
    if (approvedItems.length > 48) {
      // Sort approved items by date descending (newest first)
      const sortedApproved = [...approvedItems].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      // Keep the first 48 as approved, and identify the rest to archive
      const keepIds = new Set(sortedApproved.slice(0, 48).map(item => item.id));
      
      const updated = galleryItems.map(item => {
        if (item.status === 'approved' && !keepIds.has(item.id)) {
          return { ...item, status: 'archived' as const };
        }
        return item;
      });
      
      // Only set if there's an actual change to avoid loops
      let hasChange = false;
      for (let i = 0; i < updated.length; i++) {
        if (updated[i].status !== galleryItems[i].status) {
          hasChange = true;
          break;
        }
      }
      if (hasChange) {
        setGalleryItems(updated);
      }
    }
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('qara_font_family', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('qara_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('qara_layout_direction', layoutDirection);
  }, [layoutDirection]);

  useEffect(() => {
    localStorage.setItem('qara_text_alignment', textAlignment);
  }, [textAlignment]);

  // Scroll to top on tab change to provide consistent browser navigation feel
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  // Reset defaults handler
  const handleResetDefaults = () => {
    setServices(INITIAL_SERVICES);
    setNewsList(INITIAL_NEWS);
    setProjects(INITIAL_PROJECTS);
    setSuggestions(INITIAL_SUGGESTIONS);
    setRequests([]);
    setHomeContent(INITIAL_HOME_CONTENT);
    setGalleryItems(INITIAL_GALLERY_ITEMS);
    setCommunityAnnouncements(INITIAL_COMMUNITY_ANNOUNCEMENTS);
    setActivities(INITIAL_BUSINESS_ACTIVITIES);
    setMarketplaceListings(INITIAL_MARKETPLACE_LISTINGS);
    setFontFamily('Cairo');
    setFontSize('16');
    setLayoutDirection('rtl');
    setTextAlignment('right');
    setVisibleTabs({
      home: true,
      directory: true,
      news: true,
      projects: true,
      services: true,
      gallery: true,
      survey: true,
    });
    setSurveyTemplates(INITIAL_SURVEY_TEMPLATES);
    setSurveyResponses(INITIAL_SURVEY_RESPONSES);
    setCustomPages([]);
    localStorage.removeItem('qara_services_list');
    localStorage.removeItem('qara_news_list');
    localStorage.removeItem('qara_projects_list');
    localStorage.removeItem('qara_suggestions_list');
    localStorage.removeItem('qara_service_requests');
    localStorage.removeItem('qara_home_content');
    localStorage.removeItem('qara_gallery_items');
    localStorage.removeItem('qara_community_news');
    localStorage.removeItem('qara_business_activities');
    localStorage.removeItem('qara_marketplace_listings');
    localStorage.removeItem('qara_survey_templates');
    localStorage.removeItem('qara_survey_responses');
    localStorage.removeItem('qara_font_family');
    localStorage.removeItem('qara_font_size');
    localStorage.removeItem('qara_layout_direction');
    localStorage.removeItem('qara_text_alignment');
    localStorage.removeItem('qara_visible_tabs');
    localStorage.removeItem('qara_custom_pages');
  };


  const renderTabContent = () => {
    const foundCustomPage = customPages.find(p => p.id === activeTab);
    if (foundCustomPage) {
      return <CustomPageTab page={foundCustomPage} homeContent={homeContent} />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeTab 
            setActiveTab={setActiveTab} 
            homeContent={homeContent} 
            galleryItems={galleryItems}
            setGalleryItems={setGalleryItems}
            visitorCount={visitorCount}
            setSelectedImageId={setSelectedImageId}
            newsList={newsList}
            visibleTabs={visibleTabs}
            customPages={customPages}
            onOpenLiveStream={() => setIsLiveStreamOpen(true)}
            onOpenCitizenAuth={() => setIsCitizenAuthOpen(true)}
          />
        );
      case 'qara_city':
        return (
          <QaraCityTab
            setActiveTab={setActiveTab}
            homeContent={homeContent}
            newsList={newsList}
            visibleTabs={visibleTabs}
            customPages={customPages}
          />
        );
      case 'landmarks':
        return (
          <LandmarksTab
            homeContent={homeContent}
            newsList={newsList}
            galleryItems={galleryItems}
            setActiveTab={setActiveTab}
            setSelectedImageId={setSelectedImageId}
          />
        );
      case 'gallery':
        return (
          <GalleryTab 
            galleryItems={galleryItems}
            setGalleryItems={setGalleryItems}
            homeContent={homeContent}
            selectedImageId={selectedImageId}
            setSelectedImageId={setSelectedImageId}
          />
        );
      case 'directory':
        return (
          <DirectoryTab 
            activities={activities}
            setActivities={setActivities}
            homeContent={homeContent}
          />
        );
      case 'marketplace':
        return (
          <MarketplaceTab
            listings={marketplaceListings}
            setListings={setMarketplaceListings}
            marketplaceConfig={homeContent.marketplaceConfig}
            loggedCitizen={loggedCitizen}
            onOpenCitizenAuth={() => setIsCitizenAuthOpen(true)}
            homeContent={homeContent}
            isAdmin={true}
          />
        );
      case 'services':
        return <ServicesTab services={services} myRequests={requests} setMyRequests={setRequests} homeContent={homeContent} />;
      case 'news':
        return (
          <NewsTab 
            newsList={newsList} 
            setNewsList={setNewsList} 
            homeContent={homeContent} 
            communityAnnouncements={communityAnnouncements}
            setCommunityAnnouncements={setCommunityAnnouncements}
          />
        );
      case 'projects':
        return (
          <ProjectsTab 
            projects={projects} 
            setProjects={setProjects} 
            suggestions={suggestions} 
            setSuggestions={setSuggestions} 
            homeContent={homeContent}
          />
        );
      case 'survey':
        return (
          <SurveyTab
            templates={surveyTemplates}
            responses={surveyResponses}
            setResponses={setSurveyResponses}
            homeContent={homeContent}
          />
        );
      case 'ramadan':
        return (
          <RamadanCompetitionTab
            settings={ramadanSettings}
            questions={ramadanQuestions}
            answers={ramadanAnswers}
            setAnswers={setRamadanAnswers}
            loggedCitizen={loggedCitizen}
            onOpenAuthModal={() => setIsCitizenAuthOpen(true)}
          />
        );
      case 'citizen_portal':
        return (
          <CitizenPortalTab
            loggedCitizen={loggedCitizen}
            onLogout={() => {
              setLoggedCitizen(null);
              setActiveTab('home');
            }}
            onUpdateCitizenInfo={(updatedUser) => {
              setLoggedCitizen(updatedUser);
              setCitizens(citizens.map(c => c.id === updatedUser.id ? updatedUser : c));
            }}
            requests={requests.filter(r => r.citizenEmail === loggedCitizen?.email)}
            suggestions={suggestions.filter(s => s.citizenEmail === loggedCitizen?.email)}
            setActiveTab={setActiveTab}
            onOpenAuthModal={() => setIsCitizenAuthOpen(true)}
            ramadanQuestions={ramadanQuestions}
            ramadanAnswers={ramadanAnswers}
          />
        );
      case 'admin':
        return (
          <AdminTab
            services={services}
            setServices={setServices}
            newsList={newsList}
            setNewsList={setNewsList}
            projects={projects}
            setProjects={setProjects}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            requests={requests}
            setRequests={setRequests}
            homeContent={homeContent}
            setHomeContent={setHomeContent}
            galleryItems={galleryItems}
            setGalleryItems={setGalleryItems}
            communityAnnouncements={communityAnnouncements}
            setCommunityAnnouncements={setCommunityAnnouncements}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontSize={fontSize}
            setFontSize={setFontSize}
            layoutDirection={layoutDirection}
            setLayoutDirection={setLayoutDirection}
            textAlignment={textAlignment}
            setTextAlignment={setTextAlignment}
            onResetDefaults={handleResetDefaults}
            visibleTabs={visibleTabs}
            setVisibleTabs={setVisibleTabs}
            customPages={customPages}
            setCustomPages={setCustomPages}
            activities={activities}
            setActivities={setActivities}
            surveyTemplates={surveyTemplates}
            setSurveyTemplates={setSurveyTemplates}
            surveyResponses={surveyResponses}
            setSurveyResponses={setSurveyResponses}
            citizens={citizens}
            setCitizens={setCitizens}
            marketplaceListings={marketplaceListings}
            setMarketplaceListings={setMarketplaceListings}
            ramadanSettings={ramadanSettings}
            setRamadanSettings={setRamadanSettings}
            ramadanQuestions={ramadanQuestions}
            setRamadanQuestions={setRamadanQuestions}
            ramadanAnswers={ramadanAnswers}
            setRamadanAnswers={setRamadanAnswers}
          />
        );

      default:
        return (
          <HomeTab 
            setActiveTab={setActiveTab} 
            homeContent={homeContent} 
            galleryItems={galleryItems}
            setGalleryItems={setGalleryItems}
            visitorCount={visitorCount}
            setSelectedImageId={setSelectedImageId}
            newsList={newsList}
            visibleTabs={visibleTabs}
            customPages={customPages}
            onOpenLiveStream={() => setIsLiveStreamOpen(true)}
            onOpenCitizenAuth={() => setIsCitizenAuthOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] selection:bg-emerald-800 selection:text-white transition-all duration-300" dir={layoutDirection}>
      
      {/* Dynamic typography and layout style override */}
      <style>{`
        :root {
          --font-sans: "${fontFamily}", "Cairo", "Tajawal", system-ui, sans-serif !important;
        }
        body, html, button, input, select, textarea {
          font-family: "${fontFamily}", "Cairo", "Tajawal", system-ui, sans-serif !important;
        }
        body, html {
          font-size: ${fontSize}px !important;
          text-align: ${textAlignment};
        }
        p, h1, h2, h3, h4, h5, h6, span, li, blockquote, div {
          /* Apply inherited alignment unless overridden by native alignment tags */
          text-align: inherit;
        }
      `}</style>

      {/* Dynamic Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        homeContent={homeContent} 
        visitorCount={visitorCount} 
        visibleTabs={visibleTabs}
        customPages={customPages}
        onOpenLiveStream={() => setIsLiveStreamOpen(true)}
        loggedCitizen={loggedCitizen}
        onOpenCitizenAuth={() => setIsCitizenAuthOpen(true)}
        onOpenCitizenPortal={() => setActiveTab('citizen_portal')}
        onCitizenLogout={() => {
          setLoggedCitizen(null);
          if (activeTab === 'citizen_portal') {
            setActiveTab('home');
          }
        }}
      />

      {/* Main Interactive Stage with page transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dynamic Footer */}
      <Footer setActiveTab={setActiveTab} homeContent={homeContent} visibleTabs={visibleTabs} customPages={customPages} />

      {/* Live Stream Modal */}
      <LiveStreamModal
        isOpen={isLiveStreamOpen}
        onClose={() => setIsLiveStreamOpen(false)}
        homeContent={homeContent}
      />

      {/* Citizen Authentication Modal */}
      <CitizenAuthModal
        isOpen={isCitizenAuthOpen}
        onClose={() => setIsCitizenAuthOpen(false)}
        citizens={citizens}
        setCitizens={setCitizens}
        homeContent={homeContent}
        onLogin={(user) => {
          setLoggedCitizen(user);
          setIsCitizenAuthOpen(false);
          setActiveTab('citizen_portal');
        }}
        onRegister={(newUser) => {
          setLoggedCitizen(newUser);
          setCitizens([...citizens, newUser]);
          setIsCitizenAuthOpen(false);
          setActiveTab('citizen_portal');
        }}
      />

    </div>
  );
}
