import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserCheck, ShieldCheck, Mail, Phone, MapPin, KeyRound, Lock, Eye, EyeOff, CheckCircle2, XCircle, AlertCircle, FileText, Sparkles, LogOut, RefreshCw, Calendar, CreditCard, Users, Clock, Send, ChevronLeft, Moon, Award, BookOpen } from 'lucide-react';
import { CitizenUser, ServiceRequest, Suggestion, validatePassword, RamadanQuestion, RamadanUserAnswer } from '../types';

interface CitizenPortalTabProps {
  loggedCitizen: CitizenUser | null;
  onLogout: () => void;
  onUpdateCitizenInfo?: (updated: CitizenUser) => void;
  requests?: ServiceRequest[];
  suggestions?: Suggestion[];
  setActiveTab?: (tab: string) => void;
  onOpenAuthModal?: () => void;
  ramadanQuestions?: RamadanQuestion[];
  ramadanAnswers?: RamadanUserAnswer[];
}

export default function CitizenPortalTab({
  loggedCitizen,
  onLogout,
  onUpdateCitizenInfo = () => {},
  requests = [],
  suggestions = [],
  setActiveTab = () => {},
  onOpenAuthModal,
  ramadanQuestions = [],
  ramadanAnswers = []
}: CitizenPortalTabProps) {
  const [subTab, setSubTab] = useState<'profile' | 'requests' | 'ramadan' | 'security' | 'future_services'>('profile');

  // Edit profile state
  const [phone, setPhone] = useState(loggedCitizen.phone || '');
  const [address, setAddress] = useState(loggedCitizen.address || '');
  const [nationalId, setNationalId] = useState(loggedCitizen.nationalId || '');
  const [familyMembersCount, setFamilyMembersCount] = useState<number>(loggedCitizen.familyMembersCount || 1);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Password change state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [secError, setSecError] = useState('');
  const [secSuccess, setSecSuccess] = useState('');

  const passwordValidation = validatePassword(newPassword);

  // Filter requests submitted by this citizen (matched by name or phone)
  const myRequests = requests.filter(r => 
    (r.applicantName && r.applicantName.includes(loggedCitizen.fullName)) ||
    (r.phoneNumber && r.phoneNumber === loggedCitizen.phone)
  );

  // Filter suggestions submitted by this citizen
  const mySuggestions = suggestions.filter(s =>
    s.author && s.author.includes(loggedCitizen.fullName)
  );

  // Filter Ramadan answers submitted by this citizen
  const myRamadanAnswers = ramadanAnswers.filter(a => a.userId === loggedCitizen.id);
  const totalRamadanPoints = myRamadanAnswers.reduce((sum, a) => sum + (a.pointsEarned || (a.isCorrect ? 10 : 0)), 0);
  const correctRamadanCount = myRamadanAnswers.filter(a => a.isCorrect).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CitizenUser = {
      ...loggedCitizen,
      phone,
      address,
      nationalId,
      familyMembersCount
    };
    onUpdateCitizenInfo(updated);
    setProfileSuccessMsg('تم تحديث وحفظ بياناتك الشخصية بنجاح! ✨');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setSecError('');
    setSecSuccess('');

    if (currentPasswordInput !== loggedCitizen.password) {
      setSecError('كلمة المرور الحالية غير صحيحة. يرجى التأكد وإعادة المحاولة.');
      return;
    }

    if (!passwordValidation.isValid) {
      setSecError(passwordValidation.message || 'كلمة المرور الجديدة غير متوافقة مع شروط الأمان المعيارية.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setSecError('كلمتا المرور غير متطابقتين.');
      return;
    }

    const updated: CitizenUser = {
      ...loggedCitizen,
      password: newPassword
    };
    onUpdateCitizenInfo(updated);
    setSecSuccess('تم تغيير كلمة المرور بنجاح وفق ضوابط الأمان المعيارية! 🔑');
    setCurrentPasswordInput('');
    setNewPassword('');
    setConfirmNewPassword('');
    setTimeout(() => setSecSuccess(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-right font-sans" dir="rtl">
      
      {/* Top Banner & Profile Overview */}
      <div className="relative bg-gradient-to-l from-stone-900 via-emerald-950 to-stone-900 p-6 sm:p-8 rounded-3xl text-white shadow-2xl border border-emerald-800/40 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="p-4 sm:p-5 bg-gradient-to-tr from-amber-500 to-emerald-600 text-stone-950 font-black text-2xl rounded-3xl shadow-xl border-2 border-white/20 shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
              {loggedCitizen.fullName.substring(0, 2)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {loggedCitizen.fullName}
                </h1>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>مواطن مسجل ممرن 🟢</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-emerald-200/90 font-mono flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>اسم المستخدم (الإيميل): <strong>{loggedCitizen.email}</strong></span>
              </p>

              <div className="flex items-center gap-4 text-[11px] text-stone-300 pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-amber-400" />
                  <span>{loggedCitizen.phone}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-amber-400" />
                  <span>{loggedCitizen.address || 'قارة'}</span>
                </span>
                <span className="flex items-center gap-1 font-mono text-stone-400">
                  <Calendar className="h-3 w-3 text-amber-400" />
                  <span>تاريخ التسجيل: {new Date(loggedCitizen.createdAt).toLocaleDateString('ar-EG')}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setActiveTab('services')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>تقديم معاملة جديدة</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-800/40 relative z-10">
          <div className="p-3.5 bg-stone-950/60 rounded-2xl border border-stone-800 text-center">
            <p className="text-[11px] text-stone-400 font-bold">معاملاتي وحساباتي</p>
            <p className="text-xl font-black text-amber-400 font-mono mt-0.5">{myRequests.length}</p>
          </div>
          <div className="p-3.5 bg-stone-950/60 rounded-2xl border border-stone-800 text-center">
            <p className="text-[11px] text-stone-400 font-bold">مشاركاتي ومقترحاتي</p>
            <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">{mySuggestions.length}</p>
          </div>
          <div className="p-3.5 bg-stone-950/60 rounded-2xl border border-stone-800 text-center">
            <p className="text-[11px] text-stone-400 font-bold">حالة الحساب</p>
            <p className="text-xs font-bold text-emerald-400 mt-1">نشط وموثق 🟢</p>
          </div>
          <div className="p-3.5 bg-stone-950/60 rounded-2xl border border-stone-800 text-center">
            <p className="text-[11px] text-stone-400 font-bold">مستوى أمان كلمة المرور</p>
            <p className="text-xs font-bold text-amber-300 mt-1">عالي المعيارية 🔒</p>
          </div>
        </div>
      </div>

      {/* Main Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setSubTab('profile')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            subTab === 'profile'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>البيانات الشخصية والبطاقة الرقمية</span>
        </button>

        <button
          onClick={() => setSubTab('requests')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            subTab === 'requests'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>طلباتي ومعاملاتي المقدمة ({myRequests.length})</span>
        </button>

        <button
          onClick={() => setSubTab('ramadan')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            subTab === 'ramadan'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Moon className="h-4 w-4 text-amber-600" />
          <span>مشاركاتي في المسابقة الرمضانية ({myRamadanAnswers.length})</span>
        </button>

        <button
          onClick={() => setSubTab('security')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            subTab === 'security'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <KeyRound className="h-4 w-4 text-amber-300" />
          <span>أمان الحساب وتغيير كلمة المرور</span>
        </button>

        <button
          onClick={() => setSubTab('future_services')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            subTab === 'future_services'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>الخدمات المخصصة المستقبلية</span>
        </button>
      </div>

      {/* TAB CONTENT 1: PERSONAL PROFILE */}
      {subTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-black text-stone-900 font-sans">
              📋 تعديل وتحديث بيانات المواطن
            </h2>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              يمكنك تحديث بيانات التواصل والعنوان لضمان وصول التنبيهات والردود الخاصة بمعاملاتك.
            </p>
          </div>

          {profileSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 font-sans">
                  اسم المواطن الكامل (ثابت):
                </label>
                <input
                  type="text"
                  disabled
                  value={loggedCitizen.fullName}
                  className="w-full p-3 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-600 font-bold cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 font-sans">
                  اسم المستخدم (البريد الإلكتروني - ثابت):
                </label>
                <input
                  type="text"
                  disabled
                  value={loggedCitizen.email}
                  className="w-full p-3 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-600 font-mono cursor-not-allowed"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 font-sans">
                  رقم الهاتف / الجوال المعتمد:
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-300 focus:border-emerald-600 rounded-xl outline-none text-xs text-stone-900 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 font-sans">
                  رقم الهوية الوطنية / القيد الشخصي:
                </label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="مثال: 030100xxxxx"
                  className="w-full p-3 bg-white border border-stone-300 focus:border-emerald-600 rounded-xl outline-none text-xs text-stone-900 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 font-sans">
                  الحي / العنوان بالتفصيل في قارة:
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: الحي الشمالي - قرب الدير"
                  className="w-full p-3 bg-white border border-stone-300 focus:border-emerald-600 rounded-xl outline-none text-xs text-stone-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 font-sans">
                  عدد أفراد الأسرة المسجلين بالدفتر العائلي:
                </label>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={familyMembersCount}
                  onChange={(e) => setFamilyMembersCount(parseInt(e.target.value) || 1)}
                  className="w-full p-3 bg-white border border-stone-300 focus:border-emerald-600 rounded-xl outline-none text-xs text-stone-900 font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>حفظ التغييرات والبيانات</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT 2: MY REQUESTS & TRANSACTIONS */}
      {subTab === 'requests' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-stone-900 font-sans">
                📂 معاملاتي وطلباتي الإلكترونية
              </h2>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                قائمة المعاملات الرسمية المقدمة من حسابك لمجلس المدينة والمؤسسات الخدمية.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('services')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="h-4 w-4" />
              <span>تقديم معاملة جديدة</span>
            </button>
          </div>

          {myRequests.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-3xl border border-dashed border-stone-300 space-y-3">
              <FileText className="h-10 w-10 text-stone-400 mx-auto" />
              <p className="text-sm font-bold text-stone-700">لم تقم بتقديم أي معاملات إلكترونية حتى الآن</p>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                يمكنك التوجه إلى تبويب "الخدمات الإلكترونية" لاختيار الخدمة المطلوبة واستكمال النموذج بسهولة.
              </p>
              <button
                onClick={() => setActiveTab('services')}
                className="mt-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black text-xs rounded-xl cursor-pointer"
              >
                تصفح قائمة الخدمات والمعاملات
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req) => (
                <div key={req.id} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl hover:border-emerald-300 transition-all space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs">
                        {req.serviceName}
                      </span>
                      <span className="text-xs text-stone-500 font-mono">
                        رقم الطلب: #{req.id.substring(req.id.length - 6)}
                      </span>
                    </div>

                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status === 'approved' ? 'مقبول / مكتمل 🟢' :
                       req.status === 'rejected' ? 'مرفوض 🔴' : 'قيد التدقيق والمراجعة 🟡'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed font-sans">
                    <strong>ملاحظات مقدم الطلب:</strong> {req.notes || 'لا توجد ملاحظات إضافية'}
                  </p>

                  <div className="text-[11px] text-stone-500 font-mono pt-2 border-t border-stone-200 flex items-center justify-between">
                    <span>تاريخ التقديم: {req.dateSubmitted}</span>
                    <span>الجهة المستلمة: مجلس مدينة قارة - قسم خدمات المواطن</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: ACCOUNT SECURITY & PASSWORD CHANGE */}
      {subTab === 'security' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-black text-stone-900 font-sans flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-600" />
              <span>أمان الحساب وتغيير كلمة المرور المعيارية</span>
            </h2>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              تغيير كلمة المرور الخاصة بك وفق معايير الأمان الدولية المنصوص عليها (10 خانات، حرف كبير، حرف صغير، رقم، ورمز خاص).
            </p>
          </div>

          {secError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <span>{secError}</span>
            </div>
          )}

          {secSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{secSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 font-sans">
                كلمة المرور الحالية: <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-3 pr-10 pl-10 bg-white border border-stone-300 focus:border-emerald-600 rounded-xl outline-none text-xs text-stone-900 font-mono"
                  dir="ltr"
                />
                <Lock className="absolute right-3 top-3.5 h-4 w-4 text-stone-400" />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute left-3 top-3.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 font-sans">
                كلمة المرور الجديدة: <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-3 pr-10 pl-10 bg-white border border-stone-300 focus:border-emerald-600 rounded-xl outline-none text-xs text-stone-900 font-mono"
                  dir="ltr"
                />
                <Lock className="absolute right-3 top-3.5 h-4 w-4 text-stone-400" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-3 top-3.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* PASSWORD SECURITY CHECKLIST FOR NEW PASSWORD */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <p className="font-bold text-stone-800 text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>ضوابط أمان كلمة المرور المعيارية المفروضة:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                <div className={`flex items-center gap-1.5 ${passwordValidation.hasMinLength ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>
                  <CheckCircle2 className={`h-3.5 w-3.5 ${passwordValidation.hasMinLength ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span>تتألف من 10 خانات على الأقل</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordValidation.hasUppercase ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>
                  <CheckCircle2 className={`h-3.5 w-3.5 ${passwordValidation.hasUppercase ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span>تحتوي على حرف كبير (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordValidation.hasLowercase ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>
                  <CheckCircle2 className={`h-3.5 w-3.5 ${passwordValidation.hasLowercase ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span>تحتوي على حرف صغير (a-z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordValidation.hasDigit ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>
                  <CheckCircle2 className={`h-3.5 w-3.5 ${passwordValidation.hasDigit ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span>تحتوي على رقم (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 col-span-1 sm:col-span-2 ${passwordValidation.hasSpecialChar ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>
                  <CheckCircle2 className={`h-3.5 w-3.5 ${passwordValidation.hasSpecialChar ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span>تحتوي على رمز خاص (مثل @, #, $, !, %, ^, &)</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 font-sans">
                تأكيد كلمة المرور الجديدة: <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="تأكيد كلمة المرور الجديدة"
                className="w-full p-3 bg-white border border-stone-300 focus:border-emerald-600 rounded-xl outline-none text-xs text-stone-900 font-mono"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={!passwordValidation.isValid || newPassword !== confirmNewPassword}
              className={`w-full py-3.5 font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 ${
                passwordValidation.isValid && newPassword === confirmNewPassword
                  ? 'bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              <span>حفظ وتحديث كلمة المرور الحالية</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: RAMADAN COMPETITION PARTICIPATION */}
      {subTab === 'ramadan' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold rounded-full mb-1">
                <Moon className="h-3.5 w-3.5 text-amber-600" />
                <span>سجل المسابقة الرمضانية لكافة الأيام</span>
              </div>
              <h2 className="text-xl font-black text-stone-900">
                مشاركاتي وإجاباتي المسجلة في المسابقة الرمضانية 🌙
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                استعرض إجاباتك اليومية وتأكد من نتائج الإجابات الصحيحة والخاطئة.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                <span className="text-[10px] text-emerald-800 block font-bold">إجمالي المشاركات</span>
                <span className="text-lg font-black text-emerald-700 font-mono">{myRamadanAnswers.length} إجابة</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                <span className="text-[10px] text-amber-800 block font-bold">الإجابات الصحيحة</span>
                <span className="text-lg font-black text-amber-700 font-mono">{correctRamadanCount} / {myRamadanAnswers.length}</span>
              </div>
            </div>
          </div>

          {/* Privacy & Lock Disclaimer */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-2xl font-medium flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>ضوابط المسابقة:</strong> يحق لكل عضو مسجل الإجابة مرة واحدة فقط لكل يوم ولا يمكن تعديل أو تغيير أي إجابة بعد اعتمادها.
            </span>
          </div>

          {myRamadanAnswers.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-3">
              <Moon className="h-12 w-12 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">لم تقم بالإجابة على أي سؤال رمضاني بعد</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                توجه إلى صفحة المسابقة الرمضانية للإجابة على سؤال اليوم النشط والمشاركة في المسابقة.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('ramadan')}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>الانتقال لصفحة المسابقة الرمضانية 🌙</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myRamadanAnswers.map((ans) => {
                const q = ramadanQuestions.find(item => item.dayNumber === ans.dayNumber || item.id === ans.questionId);
                const qText = q?.questionText || `سؤال اليوم ${ans.dayNumber} من شهر رمضان`;
                const correctText = q?.options?.[q.correctOptionIndex] || '';

                return (
                  <div
                    key={ans.id}
                    className={`p-5 rounded-2xl border text-right space-y-3 transition-all ${
                      ans.isCorrect
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex justify-between items-center flex-row-reverse gap-2">
                      <span className="text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
                        {ans.dayNumber} رمضان
                      </span>

                      {ans.isCorrect ? (
                        <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>إجابة صحيحة ✓</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold rounded-full flex items-center gap-1">
                          <XCircle className="h-4 w-4 text-rose-600" />
                          <span>إجابة خاطئة ✗</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-extrabold text-stone-900">
                      {qText}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-stone-200/80">
                      <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                        <span className="text-stone-500 block font-bold text-[11px]">إجابتك المسجلة:</span>
                        <strong className="text-amber-900 font-bold block mt-0.5">
                          {ans.selectedOption || q?.options?.[ans.selectedOptionIndex] || 'غير محدد'}
                        </strong>
                      </div>

                      {!ans.isCorrect && (
                        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                          <span className="text-emerald-700 block font-bold text-[11px]">الإجابة الصحيحة:</span>
                          <strong className="text-emerald-950 font-bold block mt-0.5">
                            {correctText}
                          </strong>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-stone-400 pt-1 font-mono">
                      <span>تاريخ الإرسال: {new Date(ans.submittedAt).toLocaleDateString('ar-EG')}</span>
                      <span className="text-emerald-700 font-bold">موثقة بحسابك 🔒</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: FUTURE SERVICES */}
      {subTab === 'future_services' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-black text-stone-900 font-sans flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span>البوابة الرقمية المخصصة للمواطن - الخدمات المستقبلية</span>
            </h2>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              هذه الصفحة مجهزة لاستقبال الربط مع الخدمات والتوسعات المستقبلية الخاصة بحساب المواطن في قارة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-gradient-to-br from-emerald-900 to-stone-900 text-white rounded-2xl space-y-2.5">
              <span className="text-[10px] px-2.5 py-1 bg-amber-500 text-stone-950 font-black rounded-full">قريباً ⏳</span>
              <h3 className="font-bold text-sm text-amber-300">بطاقة المواطن الرقمية والتراخيص الشخصية</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed font-sans">
                استعراض بطاقتك الشخصية الرقمية ورخص البناء والتراخيص المهنية والتجارية المنسوبة لاسمك في مجلس المدينة.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-stone-900 to-emerald-950 text-white rounded-2xl space-y-2.5">
              <span className="text-[10px] px-2.5 py-1 bg-emerald-500 text-stone-950 font-black rounded-full">قريباً ⏳</span>
              <h3 className="font-bold text-sm text-emerald-300">نظام الإشعارات المباشرة وتنبيهات الجباية</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed font-sans">
                تلقي إشعارات فورية حول فواتير المياه، رسوم البلدية، ومواعيد توزيع المازوت والخدمات الزراعية مباشرة في حسابك.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-2xl space-y-2.5">
              <span className="text-[10px] px-2.5 py-1 bg-amber-500 text-stone-950 font-black rounded-full">قريباً ⏳</span>
              <h3 className="font-bold text-sm text-amber-300">سجل الشكاوى والملاحظات الفردية</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                إمكانية تقديم الشكاوى المباشرة ومتابعة حالة معالجتها بشكل خاص وسري دون النشر في المنبر العام.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-emerald-950 to-stone-900 text-white rounded-2xl space-y-2.5">
              <span className="text-[10px] px-2.5 py-1 bg-emerald-500 text-stone-950 font-black rounded-full">قريباً ⏳</span>
              <h3 className="font-bold text-sm text-emerald-300">التصويت والاستبيانات الخاصة بالأهالي</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed font-sans">
                المشاركة الحصرية في التصويت على المشاريع البلدية والتنموية المخصصة للمواطنين المسجلين في قارة.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
