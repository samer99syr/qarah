import React, { useState } from 'react';
import { UserCheck, Search, Plus, ShieldCheck, Mail, Phone, MapPin, KeyRound, Lock, Trash2, Ban, CheckCircle, RefreshCw, Send, AlertCircle, Eye, EyeOff, Calendar, Settings, Save, Sparkles, MessageSquare, FileText } from 'lucide-react';
import { CitizenUser, validatePassword, HomeContent } from '../types';

interface CitizenAccountsManagerProps {
  citizens: CitizenUser[];
  setCitizens: (ctzs: CitizenUser[]) => void;
  triggerNotification: (msg: string) => void;
  draftHome?: HomeContent;
  setDraftHome?: React.Dispatch<React.SetStateAction<HomeContent>>;
  setHomeContent?: (content: HomeContent) => void;
}

export default function CitizenAccountsManager({
  citizens,
  setCitizens,
  triggerNotification,
  draftHome,
  setDraftHome,
  setHomeContent
}: CitizenAccountsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  // Portal Customization Settings State
  const [portalTitle, setPortalTitle] = useState(draftHome?.citizenPortalTitle || 'بوابة تسجيل ودخول الحسابات');
  const [portalNoAccountText, setPortalNoAccountText] = useState(draftHome?.citizenPortalNoAccountText || 'ليس لديك حساب بعد؟');
  const [portalRegisterLinkText, setPortalRegisterLinkText] = useState(draftHome?.citizenPortalRegisterLinkText || 'إنشاء حساب جديد الآن');
  const [portalRegisterNote, setPortalRegisterNote] = useState(draftHome?.citizenPortalRegisterNote || '🔒 ملاحظة هامة: التسجيل يمنحك حساباً مخصصاً لمتابعة طلباتك ومشاركاتك. البريد الإلكتروني سيكون هو اسم المستخدم الخاص بك دائماً.');
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);

  // Add Citizen Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addFullName, setAddFullName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addAddress, setAddAddress] = useState('');
  const [addNationalId, setAddNationalId] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [addError, setAddError] = useState('');

  // Reset Password Modal
  const [selectedCitizenForReset, setSelectedCitizenForReset] = useState<CitizenUser | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetError, setResetError] = useState('');

  const addPasswordValidation = validatePassword(addPassword);
  const resetPasswordValidation = validatePassword(resetNewPassword);

  const filteredCitizens = citizens.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    const trimmedEmail = addEmail.trim().toLowerCase();
    if (!addFullName.trim()) {
      setAddError('يرجى إدخال اسم المواطن الكامل');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setAddError('يرجى إدخال بريد إلكتروني صحيح (اسم المستخدم)');
      return;
    }

    if (citizens.some(c => c.email.toLowerCase() === trimmedEmail)) {
      setAddError('البريد الإلكتروني مُسجل بالفعل لحساب مواطن آخر!');
      return;
    }

    if (!addPasswordValidation.isValid) {
      setAddError(addPasswordValidation.message || 'كلمة المرور غير مطابقة لضوابط الأمان المعيارية (10 خانات، حرف كبير، حرف صغير، رقم، ورمز خاص).');
      return;
    }

    const newCitizen: CitizenUser = {
      id: `ctz_${Date.now()}`,
      fullName: addFullName.trim(),
      email: trimmedEmail,
      password: addPassword,
      phone: addPhone.trim(),
      address: addAddress.trim() || 'مدينة قارة',
      nationalId: addNationalId.trim() || undefined,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setCitizens([newCitizen, ...citizens]);
    triggerNotification(`تم تسجيل حساب المواطن (${newCitizen.fullName}) بنجاح!`);
    setIsAddOpen(false);
    setAddFullName('');
    setAddEmail('');
    setAddPhone('');
    setAddAddress('');
    setAddNationalId('');
    setAddPassword('');
  };

  const handleToggleStatus = (citizenId: string) => {
    const updated = citizens.map(c => {
      if (c.id === citizenId) {
        const nextStatus: 'active' | 'suspended' = c.status === 'active' ? 'suspended' : 'active';
        triggerNotification(
          nextStatus === 'suspended'
            ? `تم تعطيل حساب المواطن (${c.fullName})`
            : `تم إعادة تفعيل حساب المواطن (${c.fullName})`
        );
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setCitizens(updated);
  };

  const handleDeleteCitizen = (citizenId: string, name: string) => {
    if (window.confirm(`هل أنت تأكد من حذف حساب المواطن (${name}) نهائياً؟`)) {
      setCitizens(citizens.filter(c => c.id !== citizenId));
      triggerNotification(`تم حذف حساب المواطن (${name}) بنجاح.`);
    }
  };

  const handleAdminResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (!selectedCitizenForReset) return;

    if (!resetPasswordValidation.isValid) {
      setResetError(resetPasswordValidation.message || 'كلمة المرور غير مطابقة لشروط الأمان المعيارية.');
      return;
    }

    const updated = citizens.map(c => {
      if (c.id === selectedCitizenForReset.id) {
        return { ...c, password: resetNewPassword };
      }
      return c;
    });

    setCitizens(updated);
    triggerNotification(`تم تحديث كلمة المرور لحساب المواطن (${selectedCitizenForReset.fullName}) بنجاح!`);
    setSelectedCitizenForReset(null);
    setResetNewPassword('');
  };

  const handleSendResetLinkSimulation = (citizen: CitizenUser) => {
    const resetToken = `RST-${Math.floor(100000 + Math.random() * 900000)}`;
    triggerNotification(`تم توليد وإرسال رابط استعادة كلمة المرور (${resetToken}) بنجاح إلى الإيميل: ${citizen.email}`);
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      
      {/* Header Info Banner */}
      <div className="bg-gradient-to-l from-indigo-950 via-stone-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl border border-indigo-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/30 text-indigo-300 rounded-2xl border border-indigo-500/40 shrink-0">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>إدارة حسابات المواطنين والمسجلين</span>
              <span className="text-xs px-2.5 py-0.5 bg-indigo-900 text-indigo-300 rounded-full border border-indigo-700">
                {citizens.length} حساب
              </span>
            </h3>
            <p className="text-xs text-indigo-200/80 font-sans mt-0.5">
              لوحة التحكم الشاملة لإدارة البريد الإلكتروني (اسم المستخدم)، كلمات المرور المعيارية، وتفعيل/تعطيل حسابات الأهالي.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { setIsAddOpen(true); setAddError(''); }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة حساب جديد</span>
        </button>
      </div>

      {/* Citizen Login Portal Customization Card */}
      <div className="bg-amber-50/50 border border-amber-200/80 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-emerald-950 rounded-xl font-bold">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-emerald-950">تخصيص بوابة تسجيل الدخول وإنشاء الحسابات (نصوص وإرشادات البوابة)</h4>
              <p className="text-[11px] text-gray-600 font-sans">تعديل العنوان الرئيسي، الرسالة السفلية، نص زر إنشاء حساب، والملاحظات التوجيهية الظاهرة للمستخدمين</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
            className="text-xs font-bold text-amber-900 hover:text-emerald-950 px-3 py-1 bg-amber-200/50 hover:bg-amber-200 rounded-xl transition-all cursor-pointer font-sans"
          >
            {isSettingsExpanded ? 'إخفاء الإعدادات' : 'تعديل الإعدادات ⚙️'}
          </button>
        </div>

        {isSettingsExpanded && (
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Portal Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-emerald-950 font-sans">
                  عنوان نافذة تسجيل الدخول:
                </label>
                <input
                  type="text"
                  value={portalTitle}
                  onChange={(e) => setPortalTitle(e.target.value)}
                  placeholder="مثال: بوابة تسجيل الدخول والحسابات"
                  className="w-full p-2.5 bg-white border border-amber-300 focus:border-emerald-700 rounded-xl outline-none text-xs text-gray-900 font-bold"
                />
              </div>

              {/* Bottom No-Account Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-emerald-950 font-sans">
                  الرسالة السفلية (ليس لديك حساب؟):
                </label>
                <input
                  type="text"
                  value={portalNoAccountText}
                  onChange={(e) => setPortalNoAccountText(e.target.value)}
                  placeholder="مثال: ليس لديك حساب بعد؟"
                  className="w-full p-2.5 bg-white border border-amber-300 focus:border-emerald-700 rounded-xl outline-none text-xs text-gray-900 font-bold"
                />
              </div>

              {/* Register Link Text */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-emerald-950 font-sans">
                  نص زر/رابط (إنشاء حساب جديد):
                </label>
                <input
                  type="text"
                  value={portalRegisterLinkText}
                  onChange={(e) => setPortalRegisterLinkText(e.target.value)}
                  placeholder="مثال: إنشاء حساب جديد الآن"
                  className="w-full p-2.5 bg-white border border-amber-300 focus:border-emerald-700 rounded-xl outline-none text-xs text-amber-900 font-extrabold"
                />
              </div>
            </div>

            {/* Registration Note */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-950 font-sans">
                الملاحظة التوجيهية في تبويب إنشاء حساب جديد:
              </label>
              <textarea
                rows={2}
                value={portalRegisterNote}
                onChange={(e) => setPortalRegisterNote(e.target.value)}
                placeholder="أدخل الملاحظة التوجيهية التي تظهر للمستخدم أثناء إنشاء حساب جديد..."
                className="w-full p-2.5 bg-white border border-amber-300 focus:border-emerald-700 rounded-xl outline-none text-xs text-gray-900 font-sans"
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-amber-200/50">
              <button
                type="button"
                onClick={() => {
                  if (setDraftHome) {
                    setDraftHome(prev => ({
                      ...prev,
                      citizenPortalTitle: portalTitle,
                      citizenPortalNoAccountText: portalNoAccountText,
                      citizenPortalRegisterLinkText: portalRegisterLinkText,
                      citizenPortalRegisterNote: portalRegisterNote
                    }));
                  }
                  if (setHomeContent && draftHome) {
                    setHomeContent({
                      ...draftHome,
                      citizenPortalTitle: portalTitle,
                      citizenPortalNoAccountText: portalNoAccountText,
                      citizenPortalRegisterLinkText: portalRegisterLinkText,
                      citizenPortalRegisterNote: portalRegisterNote
                    });
                  }
                  triggerNotification('تم حفظ وتطبيق إعدادات بوابة تسجيل الدخول وإنشاء الحسابات بنجاح! 🟢');
                }}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer font-sans"
              >
                <Save className="h-4 w-4 text-amber-300" />
                <span>حفظ وتطبيق إعدادات البوابة</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث بالاسم، الإيميل (اسم المستخدم) أو الهاتف..."
            className="w-full p-2.5 pr-9 bg-stone-50 border border-stone-300 focus:border-indigo-600 rounded-xl outline-none text-xs text-stone-900"
          />
          <Search className="absolute right-3 top-3 h-4 w-4 text-stone-400" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-stone-600 shrink-0">فلترة الحسابات:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 outline-none cursor-pointer"
          >
            <option value="all">جميع الحسابات ({citizens.length})</option>
            <option value="active">الحسابات النشطة 🟢 ({citizens.filter(c => c.status === 'active').length})</option>
            <option value="suspended">الحسابات المعطلة 🔴 ({citizens.filter(c => c.status === 'suspended').length})</option>
          </select>
        </div>
      </div>

      {/* Citizens Accounts Grid / List */}
      {filteredCitizens.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-stone-300 space-y-3">
          <UserCheck className="h-10 w-10 text-stone-400 mx-auto" />
          <p className="text-sm font-bold text-stone-700">لم يتم العثور على أي حسابات مطابقة</p>
          <button
            type="button"
            onClick={() => { setIsAddOpen(true); setAddError(''); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl shadow cursor-pointer transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة حساب جديد</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCitizens.map((citizen) => (
            <div
              key={citizen.id}
              className={`bg-white rounded-3xl p-5 border transition-all space-y-4 relative shadow-sm hover:shadow-md ${
                citizen.status === 'suspended' ? 'border-rose-300 bg-rose-50/20' : 'border-stone-200 hover:border-indigo-300'
              }`}
            >
              {/* Card Top */}
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-indigo-100 text-indigo-900 font-extrabold rounded-2xl flex items-center justify-center text-sm shrink-0 border border-indigo-200">
                    {citizen.fullName.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900">{citizen.fullName}</h4>
                    <p className="text-[11px] text-indigo-700 font-mono font-bold flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span>{citizen.email}</span>
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                  citizen.status === 'active'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {citizen.status === 'active' ? 'نشط 🟢' : 'معطّل 🔴'}
                </span>
              </div>

              {/* Card Body Details */}
              <div className="space-y-1.5 text-xs text-stone-600 font-sans">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                  <span className="font-mono">{citizen.phone}</span>
                </div>
                {citizen.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                    <span>{citizen.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[11px] text-stone-400 font-mono pt-1">
                  <Calendar className="h-3 w-3 text-stone-400 shrink-0" />
                  <span>تاريخ التسجيل: {new Date(citizen.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-1 flex-wrap text-xs">
                <button
                  type="button"
                  onClick={() => { setSelectedCitizenForReset(citizen); setResetError(''); setResetNewPassword(''); }}
                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold rounded-xl border border-indigo-200 transition-all flex items-center gap-1 cursor-pointer"
                  title="تغيير كلمة المرور مديناً"
                >
                  <KeyRound className="h-3.5 w-3.5 text-indigo-600" />
                  <span>كلمة المرور</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendResetLinkSimulation(citizen)}
                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl border border-amber-200 transition-all flex items-center gap-1 cursor-pointer"
                  title="إرسال رابط استعادة كلمة المرور للإيميل"
                >
                  <Send className="h-3.5 w-3.5 text-amber-600" />
                  <span>إرسال رابط استعادة</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(citizen.id)}
                  className={`px-2.5 py-1.5 font-bold rounded-xl border transition-all flex items-center gap-1 cursor-pointer ${
                    citizen.status === 'active'
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}
                  title={citizen.status === 'active' ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                >
                  {citizen.status === 'active' ? <Ban className="h-3.5 w-3.5 text-stone-500" /> : <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />}
                  <span>{citizen.status === 'active' ? 'تعطيل' : 'تفعيل'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCitizen(citizen.id, citizen.fullName)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  title="حذف الحساب نهائياً"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: ADD NEW ACCOUNT */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-stone-900 text-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-indigo-800/40 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-400" />
                <span>إضافة حساب جديد</span>
              </h3>
              <button type="button" onClick={() => setIsAddOpen(false)} className="text-stone-400 hover:text-white cursor-pointer">✕</button>
            </div>

            {addError && (
              <div className="p-3 bg-rose-950 border border-rose-800 text-rose-200 text-xs font-bold rounded-2xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddCitizenSubmit} className="space-y-4 text-right">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300">الاسم الكامل للمستخدم: *</label>
                <input
                  type="text"
                  required
                  value={addFullName}
                  onChange={(e) => setAddFullName(e.target.value)}
                  placeholder="مثال: خالد محمود الشامي"
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl outline-none text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300">البريد الإلكتروني (اسم المستخدم): *</label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="user@domain.com"
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl outline-none text-xs text-left font-mono text-white"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300">رقم الهاتف: *</label>
                  <input
                    type="tel"
                    required
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    placeholder="09xxxxxxxx"
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl outline-none text-xs text-left font-mono text-white"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300">العنوان:</label>
                  <input
                    type="text"
                    value={addAddress}
                    onChange={(e) => setAddAddress(e.target.value)}
                    placeholder="الحي الشمالي"
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl outline-none text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300">كلمة المرور للحساب: *</label>
                <div className="relative">
                  <input
                    type={showAddPassword ? 'text' : 'password'}
                    required
                    value={addPassword}
                    onChange={(e) => setAddPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full p-2.5 pr-9 pl-9 bg-stone-950 border border-stone-800 rounded-xl outline-none text-xs text-left font-mono text-white"
                    dir="ltr"
                  />
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-stone-500" />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                    className="absolute left-3 top-3 text-stone-500 hover:text-stone-300 cursor-pointer"
                  >
                    {showAddPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password checklist */}
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-[11px] space-y-1">
                <p className="font-bold text-amber-300">الشروط المعيارية لكلمة المرور:</p>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <span className={addPasswordValidation.hasMinLength ? 'text-emerald-400 font-bold' : 'text-stone-500'}>✓ 10 خانات</span>
                  <span className={addPasswordValidation.hasUppercase ? 'text-emerald-400 font-bold' : 'text-stone-500'}>✓ حرف كبير</span>
                  <span className={addPasswordValidation.hasLowercase ? 'text-emerald-400 font-bold' : 'text-stone-500'}>✓ حرف صغير</span>
                  <span className={addPasswordValidation.hasDigit ? 'text-emerald-400 font-bold' : 'text-stone-500'}>✓ رقم</span>
                  <span className={`col-span-2 ${addPasswordValidation.hasSpecialChar ? 'text-emerald-400 font-bold' : 'text-stone-500'}`}>✓ رمز خاص (!@#$)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!addPasswordValidation.isValid}
                  className={`px-5 py-2 font-bold text-xs rounded-xl cursor-pointer ${
                    addPasswordValidation.isValid
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  إنشاء الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADMIN RESET PASSWORD */}
      {selectedCitizenForReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-stone-900 text-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-indigo-800/40 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-indigo-400" />
                <span>تعديل كلمة المرور للحساب</span>
              </h3>
              <button onClick={() => setSelectedCitizenForReset(null)} className="text-stone-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-stone-300 font-sans">
              تعيين كلمة مرور جديدة للمواطن: <strong className="text-indigo-300">{selectedCitizenForReset.fullName}</strong> ({selectedCitizenForReset.email})
            </p>

            {resetError && (
              <div className="p-3 bg-rose-950 border border-rose-800 text-rose-200 text-xs font-bold rounded-2xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleAdminResetPasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300">كلمة المرور الجديدة: *</label>
                <div className="relative">
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full p-2.5 pr-9 pl-9 bg-stone-950 border border-stone-800 rounded-xl outline-none text-xs text-left font-mono text-white"
                    dir="ltr"
                  />
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-stone-500" />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute left-3 top-3 text-stone-500 hover:text-stone-300 cursor-pointer"
                  >
                    {showResetPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password checklist */}
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-[11px] space-y-1">
                <p className="font-bold text-amber-300">الشروط المعيارية:</p>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <span className={resetPasswordValidation.hasMinLength ? 'text-emerald-400 font-bold' : 'text-stone-500'}>✓ 10 خانات</span>
                  <span className={resetPasswordValidation.hasUppercase ? 'text-emerald-400 font-bold' : 'text-stone-500'}>✓ حرف كبير</span>
                  <span className={resetPasswordValidation.hasLowercase ? 'text-emerald-400 font-bold' : 'text-stone-500'}>✓ حرف صغير</span>
                  <span className={resetPasswordValidation.hasDigit ? 'text-emerald-400 font-bold' : 'text-stone-500'}>✓ رقم</span>
                  <span className={`col-span-2 ${resetPasswordValidation.hasSpecialChar ? 'text-emerald-400 font-bold' : 'text-stone-500'}`}>✓ رمز خاص (!@#$)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCitizenForReset(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!resetPasswordValidation.isValid}
                  className={`px-5 py-2 font-bold text-xs rounded-xl cursor-pointer ${
                    resetPasswordValidation.isValid
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  تحديث كلمة المرور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
