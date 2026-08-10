import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCheck, KeyRound, Mail, Lock, Phone, MapPin, ShieldCheck, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Send, RefreshCw, HelpCircle } from 'lucide-react';
import { CitizenUser, validatePassword, HomeContent } from '../types';

interface CitizenAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  citizens: CitizenUser[];
  setCitizens?: React.Dispatch<React.SetStateAction<CitizenUser[]>> | ((citizens: CitizenUser[]) => void);
  onRegister: (newCitizen: CitizenUser) => void;
  onLogin: (citizen: CitizenUser) => void;
  onUpdateCitizenPassword?: (email: string, newPassword: string) => boolean;
  homeContent?: HomeContent;
}

export default function CitizenAuthModal({
  isOpen,
  onClose,
  citizens,
  setCitizens,
  onRegister,
  onLogin,
  onUpdateCitizenPassword,
  homeContent
}: CitizenAuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'sent' | 'reset'>('email');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Real-time password validation results for Registration
  const regPasswordValidation = validatePassword(regPassword);
  // Real-time password validation results for Reset
  const resetPasswordValidation = validatePassword(newPassword);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedEmail = loginEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      setLoginError('يرجى إدخال البريد الإلكتروني (اسم المستخدم)');
      return;
    }
    if (!loginPassword) {
      setLoginError('يرجى إدخال كلمة المرور');
      return;
    }

    const matchedCitizen = citizens.find(
      c => c.email.toLowerCase() === trimmedEmail && c.password === loginPassword
    );

    if (!matchedCitizen) {
      setLoginError('اسم المستخدم (البريد الإلكتروني) أو كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.');
      return;
    }

    if (matchedCitizen.status === 'suspended') {
      setLoginError('حسابك معطّل حالياً من قِبل إدارة البلدية. يرجى المراجعة لاستعادة الحساب.');
      return;
    }

    // Success
    onLogin(matchedCitizen);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    const trimmedEmail = regEmail.trim().toLowerCase();
    if (!regFullName.trim()) {
      setRegError('يرجى إدخال الاسم الكامل الثلاثي');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setRegError('يرجى إدخال بريد إلكتروني صحيح (سيكون هو اسم المستخدم الخاص بك)');
      return;
    }

    // Check if email already registered
    const existing = citizens.find(c => c.email.toLowerCase() === trimmedEmail);
    if (existing) {
      setRegError('البريد الإلكتروني (اسم المستخدم) مُسجل بالفعل! يمكنك تسجيل الدخول مباشرة أو استعادة كلمة المرور.');
      return;
    }

    // Enforce Password Rules
    if (!regPasswordValidation.isValid) {
      setRegError(regPasswordValidation.message || 'كلمة المرور غير مطابقة لشروط الأمان المطلوبة.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('كلمتا المرور غير متطابقتين. يرجى التأكد وإعادة الكتابة.');
      return;
    }

    const newCitizen: CitizenUser = {
      id: `ctz_${Date.now()}`,
      fullName: regFullName.trim(),
      email: trimmedEmail,
      password: regPassword,
      phone: regPhone.trim(),
      address: regAddress.trim() || 'مدينة قارة',
      nationalId: regNationalId.trim() || undefined,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    onRegister(newCitizen);
    onClose();
  };

  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    const trimmedEmail = forgotEmail.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setForgotError('يرجى إدخال البريد الإلكتروني المسجل لدينا');
      return;
    }

    const existingCitizen = citizens.find(c => c.email.toLowerCase() === trimmedEmail);
    if (!existingCitizen) {
      setForgotError('لم نجد أي حساب مواطن مرتبط بهذا البريد الإلكتروني. يرجى التأكد من كتابته بشكل صحيح.');
      return;
    }

    // Generate simulated token
    const generatedToken = `RST-${Math.floor(100000 + Math.random() * 900000)}`;
    setResetToken(generatedToken);
    setForgotStep('sent');
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!resetPasswordValidation.isValid) {
      setForgotError(resetPasswordValidation.message || 'كلمة المرور الجديدة غير مطابقة لضوابط الأمان المعيارية.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotError('كلمتا المرور غير متطابقتين.');
      return;
    }

    const success = onUpdateCitizenPassword(forgotEmail.trim().toLowerCase(), newPassword);
    if (success) {
      setForgotSuccessMessage('تم تحديث كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.');
      setTimeout(() => {
        setActiveTab('login');
        setLoginEmail(forgotEmail);
        setForgotStep('email');
        setForgotSuccessMessage('');
      }, 2000);
    } else {
      setForgotError('حدث خطأ أثناء تغيير كلمة المرور. يرجى المحاولة لاحقاً.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-[#000000_0_0_0] z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-stone-900 border border-emerald-800/40 rounded-3xl shadow-2xl text-white overflow-hidden my-8"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 p-6 border-b border-emerald-800/30 text-right relative">
            <button
              onClick={onClose}
              className="absolute top-5 left-5 p-2 bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="إغلاق النافذة"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl border border-emerald-500/30 shrink-0">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-sans flex items-center gap-2">
                  <span>{homeContent?.citizenPortalTitle || 'بوابة تسجيل ودخول المواطنين'}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-900/80 text-emerald-300 rounded-full border border-emerald-700/50">
                    مدينة قارة
                  </span>
                </h3>
                <p className="text-xs text-emerald-200/80 font-sans mt-0.5">
                  منصة الخدمات والمشاركات والملف الشخصي لأهالي قارة
                </p>
              </div>
            </div>

            {/* Sub-tabs Selector */}
            <div className="grid grid-cols-3 gap-2 mt-5 p-1 bg-stone-950/80 rounded-2xl border border-stone-800 text-center">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setLoginError(''); }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setRegError(''); }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                إنشاء حساب جديد
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('forgot'); setForgotError(''); }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'forgot'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                نسيت كلمة المرور؟
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-right">
            
            {/* TAB 1: LOGIN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-bold rounded-2xl flex items-center gap-2.5">
                    <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-2xl text-[11px] text-amber-200 leading-relaxed">
                  💡 <strong>تنويه:</strong> اسم المستخدم الخاص بك هو <strong className="text-amber-400">البريد الإلكتروني</strong> الذي قمت بالتسجيل به حصراً.
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300 font-sans">
                    البريد الإلكتروني (اسم المستخدم):
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="example@domain.com"
                      className="w-full p-3 pr-10 bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-xl outline-none text-xs text-left font-mono text-white placeholder-stone-600"
                      dir="ltr"
                    />
                    <Mail className="absolute right-3 top-3.5 h-4 w-4 text-stone-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-stone-300 font-sans">
                      كلمة المرور:
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot')}
                      className="text-[11px] text-amber-400 hover:underline font-sans cursor-pointer"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-3 pr-10 pl-10 bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-xl outline-none text-xs text-left font-mono text-white placeholder-stone-600"
                      dir="ltr"
                    />
                    <Lock className="absolute right-3 top-3.5 h-4 w-4 text-stone-500" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute left-3 top-3.5 text-stone-500 hover:text-stone-300 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <UserCheck className="h-5 w-5" />
                  <span>تسجيل الدخول والتوجه للملف الشخصي</span>
                </button>

                <div className="pt-3 border-t border-stone-800 text-center">
                  <p className="text-xs text-stone-400 font-sans">
                    {homeContent?.citizenPortalNoAccountText || 'ليس لديك حساب بعد؟'}{' '}
                    <button
                      type="button"
                      onClick={() => { setActiveTab('register'); setRegError(''); }}
                      className="text-amber-400 hover:underline font-bold cursor-pointer"
                    >
                      {homeContent?.citizenPortalRegisterLinkText || 'إنشاء حساب جديد الآن'}
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* TAB 2: REGISTER */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {regError && (
                  <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-bold rounded-2xl flex items-center gap-2.5">
                    <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                    <span>{regError}</span>
                  </div>
                )}

                <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-2xl text-[11px] text-emerald-200 leading-relaxed whitespace-pre-line">
                  {homeContent?.citizenPortalRegisterNote || '🔒 ملاحظة هامة: التسجيل يمنحك حساباً مخصصاً لمتابعة طلباتك ومشاركاتك. البريد الإلكتروني سيكون هو اسم المستخدم الخاص بك دائماً.'}
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300 font-sans">
                    الاسم الكامل الثلاثي: <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="مثال: أحمد محمد القاري"
                    className="w-full p-3 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl outline-none text-xs text-white"
                  />
                </div>

                {/* Email (Username) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300 font-sans">
                    البريد الإلكتروني (سيكون اسم المستخدم الخاص بك): <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="citizen@gmail.com"
                      className="w-full p-3 pr-10 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl outline-none text-xs text-left font-mono text-white"
                      dir="ltr"
                    />
                    <Mail className="absolute right-3 top-3.5 h-4 w-4 text-stone-500" />
                  </div>
                </div>

                {/* Phone & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-300 font-sans">
                      رقم الهاتف / الجوال: <span className="text-amber-400 font-normal">(اختياري)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="09xxxxxxxx (اختياري)"
                        className="w-full p-3 pr-10 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl outline-none text-xs text-left font-mono text-white"
                        dir="ltr"
                      />
                      <Phone className="absolute right-3 top-3.5 h-4 w-4 text-stone-500" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-300 font-sans">
                      الحي / العنوان في قارة:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        placeholder="مثال: الحي الشمالي"
                        className="w-full p-3 pr-10 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl outline-none text-xs text-white"
                      />
                      <MapPin className="absolute right-3 top-3.5 h-4 w-4 text-stone-500" />
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300 font-sans">
                    كلمة المرور المختارة: <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-3 pr-10 pl-10 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl outline-none text-xs text-left font-mono text-white"
                      dir="ltr"
                    />
                    <Lock className="absolute right-3 top-3.5 h-4 w-4 text-stone-500" />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute left-3 top-3.5 text-stone-500 hover:text-stone-300 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* LIVE PASSWORD REQUIREMENTS CHECKLIST */}
                <div className="p-3.5 bg-stone-950/90 rounded-2xl border border-stone-800 space-y-2 text-xs">
                  <p className="font-bold text-amber-300 text-[11px] flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-amber-400" />
                    <span>شروط وأمان كلمة المرور المعيارية (مطلوبة بالكامل):</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${regPasswordValidation.hasMinLength ? 'text-emerald-400 font-bold' : 'text-stone-500'}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${regPasswordValidation.hasMinLength ? 'text-emerald-400' : 'text-stone-600'}`} />
                      <span>تتألف من 10 خانات على الأقل</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${regPasswordValidation.hasUppercase ? 'text-emerald-400 font-bold' : 'text-stone-500'}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${regPasswordValidation.hasUppercase ? 'text-emerald-400' : 'text-stone-600'}`} />
                      <span>تحتوي على حرف كبير (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${regPasswordValidation.hasLowercase ? 'text-emerald-400 font-bold' : 'text-stone-500'}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${regPasswordValidation.hasLowercase ? 'text-emerald-400' : 'text-stone-600'}`} />
                      <span>تحتوي على حرف صغير (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${regPasswordValidation.hasDigit ? 'text-emerald-400 font-bold' : 'text-stone-500'}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${regPasswordValidation.hasDigit ? 'text-emerald-400' : 'text-stone-600'}`} />
                      <span>تحتوي على رقم (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 col-span-1 sm:col-span-2 ${regPasswordValidation.hasSpecialChar ? 'text-emerald-400 font-bold' : 'text-stone-500'}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${regPasswordValidation.hasSpecialChar ? 'text-emerald-400' : 'text-stone-600'}`} />
                      <span>تحتوي على رمز خاص (مثل @, #, $, !, %, ^, &)</span>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300 font-sans">
                    تأكيد كلمة المرور: <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="إعادة كتابة كلمة المرور"
                    className="w-full p-3 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl outline-none text-xs text-left font-mono text-white"
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!regPasswordValidation.isValid || regPassword !== regConfirmPassword}
                  className={`w-full py-3.5 font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                    regPasswordValidation.isValid && regPassword === regConfirmPassword
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white cursor-pointer'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-70'
                  }`}
                >
                  <UserCheck className="h-5 w-5" />
                  <span>إنشاء الحساب والتوجيه لصفحتي الشخصية</span>
                </button>
              </form>
            )}

            {/* TAB 3: FORGOT / RESET PASSWORD */}
            {activeTab === 'forgot' && (
              <div className="space-y-4">
                {forgotError && (
                  <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-bold rounded-2xl flex items-center gap-2.5">
                    <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                    <span>{forgotError}</span>
                  </div>
                )}

                {forgotSuccessMessage && (
                  <div className="p-3.5 bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs font-bold rounded-2xl flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                    <span>{forgotSuccessMessage}</span>
                  </div>
                )}

                {forgotStep === 'email' && (
                  <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                    <div className="p-3.5 bg-indigo-950/40 border border-indigo-800/40 rounded-2xl text-xs text-indigo-200 leading-relaxed space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-indigo-300">
                        <KeyRound className="h-4 w-4" />
                        <span>نظام استعادة كلمة المرور المعتمد عالمياً:</span>
                      </p>
                      <p className="text-[11px] opacity-90">
                        أدخل البريد الإلكتروني المنسوب لحسابك، وسيقوم النظام بإنشاء رابط استعادة آمن محمي بترميز معتمد عالمياً لضبط كلمة مرور جديدة.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-300 font-sans">
                        البريد الإلكتروني المسجل لدينا (اسم المستخدم):
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="your.email@domain.com"
                          className="w-full p-3 pr-10 bg-stone-950 border border-stone-800 focus:border-indigo-500 rounded-xl outline-none text-xs text-left font-mono text-white"
                          dir="ltr"
                        />
                        <Mail className="absolute right-3 top-3.5 h-4 w-4 text-stone-500" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      <span>إرسال رابط استعادة كلمة المرور</span>
                    </button>
                  </form>
                )}

                {forgotStep === 'sent' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="p-4 bg-emerald-950/80 border border-emerald-700/60 rounded-3xl space-y-3">
                      <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <span>تم إرسال رابط رمز الاستعادة الآمن للبريد الإلكتروني!</span>
                      </div>
                      <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
                        تم توليد رابط استعادة كلمة المرور المشفر بحسب المعايير الآمنة للعنوان: <strong className="font-mono text-amber-300">{forgotEmail}</strong>
                      </p>
                      <div className="p-3 bg-black/60 rounded-xl border border-stone-800 text-[11px] font-mono text-stone-300 space-y-1">
                        <p className="text-stone-400">رمز التوثيق المولد (Reset Token):</p>
                        <p className="text-amber-400 font-bold tracking-widest text-center py-1 bg-stone-900 rounded border border-stone-700">
                          {resetToken}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-stone-300 font-sans">
                          كلمة المرور الجديدة: <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full p-3 pr-10 pl-10 bg-stone-950 border border-stone-800 focus:border-indigo-500 rounded-xl outline-none text-xs text-left font-mono text-white"
                            dir="ltr"
                          />
                          <Lock className="absolute right-3 top-3.5 h-4 w-4 text-stone-500" />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute left-3 top-3.5 text-stone-500 hover:text-stone-300 cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Password requirements for reset */}
                      <div className="p-3 bg-stone-950/90 rounded-2xl border border-stone-800 space-y-1.5 text-[11px]">
                        <p className="font-bold text-indigo-300">ضوابط أمان كلمة المرور الجديدة:</p>
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          <span className={resetPasswordValidation.hasMinLength ? 'text-emerald-400 font-bold' : 'text-stone-500'}>✓ 10 خانات</span>
                          <span className={resetPasswordValidation.hasUppercase ? 'text-emerald-400 font-bold' : 'text-stone-500'}>✓ حرف كبير</span>
                          <span className={resetPasswordValidation.hasLowercase ? 'text-emerald-400 font-bold' : 'text-stone-500'}>✓ حرف صغير</span>
                          <span className={resetPasswordValidation.hasDigit ? 'text-emerald-400 font-bold' : 'text-stone-500'}>✓ رقم</span>
                          <span className={`col-span-2 ${resetPasswordValidation.hasSpecialChar ? 'text-emerald-400 font-bold' : 'text-stone-500'}`}>✓ رمز خاص (!@#$)</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-stone-300 font-sans">
                          تأكيد كلمة المرور الجديدة: <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="تأكيد كلمة المرور الجديدة"
                          className="w-full p-3 bg-stone-950 border border-stone-800 focus:border-indigo-500 rounded-xl outline-none text-xs text-left font-mono text-white"
                          dir="ltr"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!resetPasswordValidation.isValid || newPassword !== confirmNewPassword}
                        className={`w-full py-3.5 font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                          resetPasswordValidation.isValid && newPassword === confirmNewPassword
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white cursor-pointer'
                            : 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-70'
                        }`}
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>تأكيد كلمة المرور الجديدة وتسجيل الدخول</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
