import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Tv, ShieldCheck, Copy, Check, RefreshCw, Radio, Camera, Video, Mic, MicOff, RotateCcw, Play, Square, Users, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { HomeContent, Member } from '../types';

interface LiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeContent: HomeContent;
}

export default function LiveStreamModal({ isOpen, onClose, homeContent }: LiveStreamModalProps) {
  const [copied, setCopied] = useState(false);
  const [key, setKey] = useState(0);
  
  // Camera & Mic States
  const [activeSourceMode, setActiveSourceMode] = useState<'url' | 'camera'>(homeContent.liveStreamMode || 'url');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isMuted, setIsMuted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen().catch(() => {});
        }
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Sync active source mode whenever homeContent changes or modal opens
  useEffect(() => {
    if (homeContent.liveStreamMode) {
      setActiveSourceMode(homeContent.liveStreamMode);
    }
  }, [homeContent.liveStreamMode, isOpen]);

  // Read current logged in user & check permissions
  let currentUser: { role: 'admin' | 'member'; member?: Member } | null = null;
  const loggedInStr = localStorage.getItem('qara_logged_in_user');
  if (loggedInStr) {
    try {
      currentUser = JSON.parse(loggedInStr);
    } catch (e) {
      console.error(e);
    }
  }

  const isAuthorizedToBroadcast = 
    currentUser?.role === 'admin' || 
    currentUser?.member?.permissions?.liveStreamBroadcast === true;

  // Broadcaster Timer
  useEffect(() => {
    let interval: any = null;
    if (isBroadcasting) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setTimerSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isBroadcasting]);

  // Clean up media tracks when closing or unmounting
  useEffect(() => {
    if (!isOpen && mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
      setIsBroadcasting(false);
    }
  }, [isOpen, mediaStream]);

  if (!isOpen) return null;

  const rawUrl = homeContent.liveStreamUrl || '';

  // Helper to format YouTube or general URLs for iframe embedding
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let trimmed = url.trim();

    if (trimmed.includes('youtube.com/watch?v=')) {
      const videoId = trimmed.split('v=')[1]?.split('&')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    if (trimmed.includes('youtu.be/')) {
      const videoId = trimmed.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    if (trimmed.includes('youtube.com/live/')) {
      const videoId = trimmed.split('youtube.com/live/')[1]?.split('?')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }

    return trimmed;
  };

  const embedUrl = getEmbedUrl(rawUrl);

  const handleCopyLink = () => {
    if (rawUrl) {
      navigator.clipboard.writeText(rawUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Camera Actions
  const startCameraBroadcast = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      setMediaStream(stream);
      setIsBroadcasting(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("تعذر الوصول إلى كاميرا الجوال أو المايكرفون. يرجى السماح بالصلاحيات للمتصفح لاستخدام الكاميرا والمايك.");
    }
  };

  const stopCameraBroadcast = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setIsBroadcasting(false);
  };

  const toggleCameraFacing = async () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);

    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: nextFacing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: !isMuted
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Flip camera error:", err);
    }
  };

  const toggleMute = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-stone-900 border border-emerald-900/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right my-auto"
        >
          {/* Header Bar */}
          <div className="px-5 py-4 bg-gradient-to-r from-stone-950 via-emerald-950 to-stone-950 border-b border-emerald-800/40 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-600/20 text-rose-400 rounded-xl border border-rose-500/30 flex items-center justify-center animate-pulse">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-600/40 font-mono">
                    {homeContent.liveStreamStatusText || 'مباشر الآن 🔴'}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    البث المباشر الرقمي - مدينة قارة
                  </h3>
                </div>
                <p className="text-[11px] text-emerald-200/80 font-sans mt-0.5">
                  البث الحي المباشر للأحداث والمناسبات والجلسات الرسمية في مدينة قارة
                </p>
              </div>
            </div>

            {/* Source Mode Switcher & Fullscreen Bar */}
            <div className="flex items-center gap-1.5 bg-stone-900/90 p-1 rounded-2xl border border-stone-700/60 flex-wrap sm:flex-nowrap">
              <button
                onClick={() => setActiveSourceMode('url')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSourceMode === 'url'
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Tv className="h-3.5 w-3.5" />
                <span>رابط خارجي</span>
              </button>
              <button
                onClick={() => setActiveSourceMode('camera')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSourceMode === 'camera'
                    ? 'bg-rose-800 text-white shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Camera className="h-3.5 w-3.5" />
                <span>كمرا المباشر 📹</span>
              </button>
              <button
                onClick={toggleFullscreen}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isFullscreen
                    ? 'bg-amber-600 border-amber-400 text-white shadow-md animate-pulse'
                    : 'bg-stone-800 border-stone-700 text-amber-300 hover:text-white hover:bg-stone-700'
                }`}
                title={isFullscreen ? 'تصغير الشاشة إلى الحجم الافتراضي' : 'تكبير الشاشة لملأ الشاشة بالكامل دون المساس بوضوح الفيديو'}
              >
                {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                <span>{isFullscreen ? 'حجم افتراضي 🗗' : 'ملأ الشاشة 🗖'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-white bg-stone-800 hover:bg-rose-900/60 rounded-xl transition-all cursor-pointer mr-1"
                title="إغلاق النافذة"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Video Player Container */}
          <div
            ref={containerRef}
            className={`relative w-full bg-black flex items-center justify-center overflow-hidden border-b border-stone-800 shadow-inner transition-all duration-300 ${
              isFullscreen ? 'h-[85vh] sm:h-[90vh] aspect-auto' : 'aspect-video'
            }`}
          >
            
            {/* MODE 1: CAMERA LIVE STREAM */}
            {activeSourceMode === 'camera' ? (
              <div className="relative w-full h-full bg-stone-950 flex flex-col items-center justify-center">
                
                {/* Live Camera Video Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted={isMuted}
                  className={`w-full h-full object-cover ${isBroadcasting ? 'block' : 'hidden'}`}
                />

                {/* Overlays when broadcasting */}
                {isBroadcasting && (
                  <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2 pointer-events-none">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-500/50">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                      <span className="text-xs font-black text-rose-400 font-mono">مباشر على الهواء</span>
                      <span className="text-xs font-mono text-stone-300 border-r border-stone-700 pr-2 mr-1">
                        {formatTimer(timerSeconds)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/40 text-amber-300 text-xs font-bold font-sans">
                      <Users className="h-3.5 w-3.5" />
                      <span>184 مشاهد حي</span>
                    </div>
                  </div>
                )}

                {/* Standby screen when not broadcasting */}
                {!isBroadcasting && (
                  <div className="p-6 sm:p-8 text-center space-y-4 max-w-lg my-auto">
                    <div className="w-16 h-16 bg-rose-950/80 text-rose-400 rounded-3xl flex items-center justify-center mx-auto border border-rose-600/40 shadow-xl animate-pulse">
                      <Camera className="h-8 w-8" />
                    </div>
                    
                    <div>
                      <h4 className="text-base sm:text-lg font-extrabold text-white font-sans">
                        بث كمرا الجوال المباشر (Direct Mobile Camera Stream)
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed font-sans mt-1.5">
                        {isAuthorizedToBroadcast 
                          ? "أهلاً بك! بصفتك كعضو إدارة أو مسئول مخول، يمكنك تشغيل الكاميرا الآن وبدء التغطية الحية لمواطني قارة مباشرة."
                          : "البث الحي من كاميرا الجوال متوقف حالياً. انتظر انطلاق التغطية الحية من مسئول البوابة المعين."}
                      </p>
                    </div>

                    {isAuthorizedToBroadcast && (
                      <button
                        onClick={startCameraBroadcast}
                        className="px-6 py-3 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-600 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-rose-400/40 mx-auto animate-bounce"
                      >
                        <Video className="h-4 w-4" />
                        <span>📹 ابدأ البث الحي الآن من كاميرا جوالك</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Broadcaster Active Controls Bar Overlay */}
                {isBroadcasting && (
                  <div className="absolute bottom-4 right-4 left-4 p-3 bg-black/80 backdrop-blur-md rounded-2xl border border-stone-700 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleCameraFacing}
                        className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-bold rounded-xl border border-stone-600 transition-all flex items-center gap-1.5 cursor-pointer"
                        title="قلب الكاميرا (أمامية / خلفية)"
                      >
                        <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
                        <span>الكاميرا ({facingMode === 'environment' ? 'الخلفية' : 'الأمامية'})</span>
                      </button>

                      <button
                        onClick={toggleMute}
                        className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                          isMuted 
                            ? 'bg-rose-950/80 border-rose-600 text-rose-300' 
                            : 'bg-stone-800 border-stone-600 text-stone-100 hover:bg-stone-700'
                        }`}
                      >
                        {isMuted ? <MicOff className="h-3.5 w-3.5 text-rose-400" /> : <Mic className="h-3.5 w-3.5 text-emerald-400" />}
                        <span>{isMuted ? 'المايك مكتوم' : 'المايك يعمل'}</span>
                      </button>
                    </div>

                    <button
                      onClick={stopCameraBroadcast}
                      className="px-5 py-2 bg-rose-700 hover:bg-rose-600 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Square className="h-3.5 w-3.5 fill-white" />
                      <span>إيقاف وإغلاق البث الحي</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* MODE 2: EXTERNAL URL STREAM (YouTube / Iframe) */
              embedUrl ? (
                <iframe
                  key={key}
                  src={embedUrl}
                  title="البث المباشر لمدينة قارة"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="p-8 text-center space-y-3 max-w-md">
                  <div className="w-16 h-16 bg-stone-800 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-stone-700">
                    <Tv className="h-8 w-8" />
                  </div>
                  <h4 className="text-base font-bold text-stone-200">لا يوجد رابط بث خارجي فعال</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    يمكن لمسؤولي الإدارة تحديث رابط البث الخارجي من لوحة التحكم أو الانتقال لتبويب "كمرا المباشر 📹".
                  </p>
                </div>
              )
            )}

          </div>

          {/* Controls & Bottom Customizable Badge */}
          <div className="p-5 bg-stone-950 space-y-4">
            
            {/* Customizable Bottom Badge - "بث مباشر من قارة" */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-amber-300 font-black text-sm sm:text-base text-center rounded-2xl border border-amber-500/30 shadow-lg flex items-center justify-center gap-2.5">
              <span className="text-lg">📺</span>
              <span>{homeContent.liveStreamBadge || 'بث مباشر من قارة'}</span>
            </div>

            {/* Copyright & Ownership Box */}
            <div className="p-4 bg-stone-900/90 rounded-2xl border border-emerald-900/40 space-y-2 text-stone-300 text-xs leading-relaxed">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{homeContent.liveStreamCopyrightTitle || 'حقوق وإرشادات البث المباشر'}</span>
              </div>
              <p className="text-stone-400 font-sans text-[11px] leading-relaxed pr-6">
                {homeContent.liveStreamCopyrightContent || 'جميع حقوق البث والنقل الحي محفوظة لمجلس مدينة قارة واللجنة الإعلامية المعتمدة. يمنع إعادة البث أو استخدام اللقطات لأغراض تجارية دون إذن رسمي مكتوب.'}
              </p>
            </div>

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isFullscreen
                      ? 'bg-amber-600 border-amber-400 text-white shadow-md'
                      : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-amber-300'
                  }`}
                  title={isFullscreen ? 'تصغير الشاشة إلى الحجم الافتراضي' : 'تكبير الشاشة ملأ الشاشة بالكامل'}
                >
                  {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                  <span>{isFullscreen ? 'تصغير الشاشة' : 'ملأ الشاشة بالكامل 🗖'}</span>
                </button>

                {activeSourceMode === 'url' && (
                  <>
                    <button
                      onClick={() => setKey(prev => prev + 1)}
                      className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>تحديث البث</span>
                    </button>

                    {rawUrl && (
                      <button
                        onClick={handleCopyLink}
                        className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? 'تم نسخ الرابط!' : 'نسخ رابط البث'}</span>
                      </button>
                    )}
                  </>
                )}
                {isAuthorizedToBroadcast && activeSourceMode === 'camera' && !isBroadcasting && (
                  <button
                    onClick={startCameraBroadcast}
                    className="px-3.5 py-2 bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-rose-600"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>تشغيل كمرا الموبايل للبث</span>
                  </button>
                )}
              </div>

              <button
                onClick={onClose}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                إغلاق
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
