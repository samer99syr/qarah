import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  User, 
  Phone, 
  BarChart4, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Send 
} from 'lucide-react';
import { SurveyTemplate, SurveyResponse } from '../types';

interface SurveyTabProps {
  templates: SurveyTemplate[];
  responses: SurveyResponse[];
  setResponses: React.Dispatch<React.SetStateAction<SurveyResponse[]>>;
  homeContent: any;
}

export default function SurveyTab({
  templates,
  responses,
  setResponses,
  homeContent
}: SurveyTabProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);
  const [formData, setFormData] = useState<{ [fieldId: string]: any }>({});
  const [formErrors, setFormErrors] = useState<{ [fieldId: string]: string }>({});
  const [activeStep, setActiveStep] = useState<'intro' | 'personal' | 'contact' | 'survey' | 'success'>('intro');

  const activeTemplates = templates.filter(t => t.status === 'active');

  const handleStartSurvey = (template: SurveyTemplate) => {
    setSelectedTemplate(template);
    // Initialize form fields with empty values or defaults
    const initialData: { [fieldId: string]: any } = {};
    template.fields.forEach(f => {
      if (f.type === 'checkbox') {
        initialData[f.id] = false;
      } else {
        initialData[f.id] = '';
      }
    });
    setFormData(initialData);
    setFormErrors({});
    setActiveStep('personal');
  };

  const getStepFields = (section: 'personal' | 'contact' | 'survey') => {
    if (!selectedTemplate) return [];
    return selectedTemplate.fields.filter(f => f.section === section);
  };

  const validateStep = (section: 'personal' | 'contact' | 'survey'): boolean => {
    if (!selectedTemplate) return true;
    const fieldsToValidate = getStepFields(section);
    const errors: { [fieldId: string]: string } = {};
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const value = formData[field.id];
      if (field.required) {
        if (field.type === 'checkbox' && !value) {
          errors[field.id] = 'يجب الموافقة على هذا الخيار للمتابعة.';
          isValid = false;
        } else if (field.type !== 'checkbox' && (value === undefined || String(value).trim() === '')) {
          errors[field.id] = 'هذه الخانة مطلوبة، يرجى ملؤها.';
          isValid = false;
        }
      }
      if (field.type === 'number' && value !== '' && isNaN(Number(value))) {
        errors[field.id] = 'الرجاء إدخال رقم صحيح.';
        isValid = false;
      }
    });

    setFormErrors(prev => ({ ...prev, ...errors }));
    return isValid;
  };

  const handleNext = () => {
    if (activeStep === 'personal') {
      if (validateStep('personal')) {
        setActiveStep('contact');
      }
    } else if (activeStep === 'contact') {
      if (validateStep('contact')) {
        setActiveStep('survey');
      }
    }
  };

  const handleBack = () => {
    if (activeStep === 'contact') {
      setActiveStep('personal');
    } else if (activeStep === 'survey') {
      setActiveStep('contact');
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (formErrors[fieldId]) {
      setFormErrors(prev => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    if (validateStep('survey')) {
      const newResponse: SurveyResponse = {
        id: `resp_${Date.now()}`,
        surveyId: selectedTemplate.id,
        answers: formData,
        submittedAt: new Date().toISOString()
      };

      const updated = [newResponse, ...responses];
      setResponses(updated);
      localStorage.setItem('qara_survey_responses', JSON.stringify(updated));
      setActiveStep('success');
    }
  };

  const renderField = (field: any) => {
    const error = formErrors[field.id];
    const value = formData[field.id];

    return (
      <div key={field.id} className="space-y-1 text-right">
        <label className="block text-sm font-bold text-gray-800">
          {field.label} {field.required && <span className="text-rose-500">*</span>}
        </label>

        {field.type === 'text' && (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 transition-all ${
              error ? 'border-rose-300 bg-rose-50/20' : 'border-gray-200 bg-white'
            }`}
            placeholder={`أدخل ${field.label}...`}
          />
        )}

        {field.type === 'number' && (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 transition-all ${
              error ? 'border-rose-300 bg-rose-50/20' : 'border-gray-200 bg-white'
            }`}
            placeholder="0"
          />
        )}

        {field.type === 'select' && (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 transition-all ${
              error ? 'border-rose-300 bg-rose-50/20' : 'border-gray-200'
            }`}
          >
            <option value="">-- الرجاء تحديد خيار --</option>
            {field.options?.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}

        {field.type === 'textarea' && (
          <textarea
            rows={4}
            value={value || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 transition-all ${
              error ? 'border-rose-300 bg-rose-50/20' : 'border-gray-200 bg-white'
            }`}
            placeholder="اكتب هنا بالتفصيل..."
          />
        )}

        {field.type === 'checkbox' && (
          <label className="flex items-center gap-3.5 mt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-emerald-800 focus:ring-emerald-800"
            />
            <span className="text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed">
              {field.label}
            </span>
          </label>
        )}

        {error && (
          <p className="text-xs text-rose-600 font-medium font-sans flex items-center gap-1">
            <span>⚠️</span> {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header Info */}
      <div className="text-center space-y-3 mb-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-950 text-xs font-bold border border-emerald-100">
          <ClipboardList className="h-3.5 w-3.5 text-emerald-700 animate-pulse" />
          بوابة الإحصاء والمسح الميداني الذكي لبلدة قارة
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug">
          الأحصائيات الميدانية والمسوح التنموية
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
          تساهم هذه المسوح المباشرة في تمكين مجلس البلدية والأعمال الأهلية والجمعيات الخيرية من الحصول على إحصائيات دقيقة لاحتياجات الأهالي والكفاءات وتوجيه الدعم المناسب.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* State 1: Choose survey */}
        {selectedTemplate === null && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {activeTemplates.length > 0 ? (
              activeTemplates.map(template => (
                <div 
                  key={template.id}
                  className="bg-white rounded-3xl overflow-hidden border border-amber-900/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-50">
                    <img 
                      src={template.image || 'https://picsum.photos/seed/survey_def/600/400'} 
                      alt={template.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://picsum.photos/seed/survey_def/600/400";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                    <span className="absolute bottom-3 right-3 text-white text-[10px] font-bold bg-emerald-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-emerald-700 shadow flex items-center gap-1 font-sans">
                      <Calendar className="h-3 w-3" />
                      إحصاء رسمي نشط
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-right">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">
                        {template.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-3">
                        {template.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-sans">
                        عدد الأسئلة: {template.fields.length}
                      </span>
                      <button
                        onClick={() => handleStartSurvey(template)}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow hover:shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>تعبئة الاستبيان</span>
                        <ChevronRight className="h-4 w-4 rotate-180" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-3xl p-12 border border-amber-900/5 text-center text-gray-400">
                <p className="text-sm font-bold">لا توجد أي إحصائيات ميدانية منشورة حالياً في البوابة.</p>
                <p className="text-xs text-gray-400 mt-1">تفضل بزيارتنا لاحقاً للمشاركة في الاستبيانات الجديدة.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* State 2: Active questionnaire */}
        {selectedTemplate !== null && activeStep !== 'success' && (
          <motion.div
            key="survey-flow"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl border border-amber-900/5 shadow-md overflow-hidden"
          >
            {/* Header section with cover image */}
            <div className="relative h-44 sm:h-52 bg-slate-100">
              <img 
                src={selectedTemplate.image || 'https://picsum.photos/seed/survey_flow/800/400'} 
                alt={selectedTemplate.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/survey_flow/800/400";
                }}
              />
              <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-[1px] flex flex-col justify-end p-6 sm:p-8 text-right text-white">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-bold cursor-pointer backdrop-blur-md border border-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span>العودة لجميع الإحصاءات</span>
                </button>

                <h3 className="text-lg sm:text-2xl font-extrabold leading-snug drop-shadow">
                  {selectedTemplate.title}
                </h3>
                <p className="text-xs text-amber-200/90 mt-1 max-w-2xl font-sans drop-shadow leading-relaxed">
                  {selectedTemplate.description}
                </p>
              </div>
            </div>

            {/* Stepper Wizard Indicator */}
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-row-reverse">
              {[
                { step: 'personal', label: 'البيانات الشخصية', icon: User },
                { step: 'contact', label: 'بيانات الاتصال', icon: Phone },
                { step: 'survey', label: 'بيانات الإحصاء', icon: BarChart4 }
              ].map((item, index) => {
                const IconComp = item.icon;
                const isCurrent = activeStep === item.step;
                const isDone = 
                  (item.step === 'personal' && (activeStep === 'contact' || activeStep === 'survey')) ||
                  (item.step === 'contact' && activeStep === 'survey');

                return (
                  <div key={item.step} className="flex items-center gap-2 flex-row-reverse flex-1 last:flex-none justify-center">
                    <div className="flex items-center gap-1.5 flex-row-reverse">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all ${
                        isCurrent 
                          ? 'bg-emerald-800 text-white font-black shadow shadow-emerald-800/20 border border-emerald-700' 
                          : isDone 
                            ? 'bg-emerald-550 text-emerald-800 font-bold border border-emerald-100 bg-emerald-50'
                            : 'bg-white text-gray-400 border border-gray-200'
                      }`}>
                        {isDone ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : index + 1}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold transition-colors hidden sm:inline ${
                        isCurrent ? 'text-emerald-950' : 'text-gray-400'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div className={`flex-grow h-0.5 max-w-[40px] sm:max-w-[80px] rounded-full mx-1.5 ${
                        isDone ? 'bg-emerald-700' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Form Fields Render */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              <AnimatePresence mode="wait">
                {activeStep === 'personal' && (
                  <motion.div
                    key="personal-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div className="border-r-4 border-emerald-800 pr-3 mb-4 text-right">
                      <h4 className="text-base font-black text-emerald-950">الخطوة الأولى: البيانات الشخصية للمواطن</h4>
                      <p className="text-xs text-gray-400 font-sans">تستخدم هذه المعلومات للتحقق وحفظ هوية مقدم البيانات وتجنب التكرار العشوائي.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getStepFields('personal').map(field => renderField(field))}
                    </div>
                  </motion.div>
                )}

                {activeStep === 'contact' && (
                  <motion.div
                    key="contact-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div className="border-r-4 border-emerald-800 pr-3 mb-4 text-right">
                      <h4 className="text-base font-black text-emerald-950">الخطوة الثانية: معلومات الاتصال والعنوان</h4>
                      <p className="text-xs text-gray-400 font-sans">تساهم قنوات التواصل في إمكانية تواصل لجان الدعم أو البلدية معك لتقديم المساعدة المطلوبة.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getStepFields('contact').map(field => renderField(field))}
                    </div>
                  </motion.div>
                )}

                {activeStep === 'survey' && (
                  <motion.div
                    key="survey-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div className="border-r-4 border-emerald-800 pr-3 mb-4 text-right">
                      <h4 className="text-base font-black text-emerald-950">الخطوة الثالثة: البيانات الإحصائية المطلوبة</h4>
                      <p className="text-xs text-gray-400 font-sans">يرجى تحري الدقة والصدق في الإجابات حيث ستبنى عليها قرارات هامة وحيوانية للبلدة والمجتمع.</p>
                    </div>

                    <div className="space-y-5">
                      {getStepFields('survey').map(field => renderField(field))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Navigation Buttons */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                {activeStep !== 'personal' ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-550 text-gray-700 hover:border-gray-300 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span>السابق</span>
                  </button>
                ) : (
                  <div />
                )}

                {activeStep !== 'survey' ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold transition-all shadow hover:shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>التالي</span>
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-extrabold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="h-4 w-4 text-amber-300 shrink-0" />
                    <span>إرسال البيانات ونشر المشاركة</span>
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}

        {/* State 3: Submission success */}
        {activeStep === 'success' && (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-100 shadow-lg text-center space-y-6 max-w-lg mx-auto"
          >
            <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-700 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-emerald-950">تم إرسال بيانات الإحصاء بنجاح!</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                نشكر مشاركتك الفعالة ووقتك الثمين. تم حفظ البيانات وتضمينها بشكل فوري في لوحة التحكم لمراجعتها واستخدامها من قبل اللجان المختصة في بلدة قارة.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-50 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  setActiveStep('intro');
                }}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-sm hover:shadow"
              >
                المشاركة في استبيانات أخرى
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
