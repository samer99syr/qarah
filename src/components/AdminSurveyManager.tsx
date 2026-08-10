import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Eye, 
  FileSpreadsheet, 
  FileText, 
  Upload, 
  Settings, 
  Layers, 
  Check, 
  X, 
  Info, 
  Sparkles,
  User,
  Phone,
  BarChart2,
  Calendar,
  Globe,
  Printer
} from 'lucide-react';
import { SurveyTemplate, SurveyResponse, SurveyField } from '../types';

interface AdminSurveyManagerProps {
  templates: SurveyTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<SurveyTemplate[]>>;
  responses: SurveyResponse[];
  setResponses: React.Dispatch<React.SetStateAction<SurveyResponse[]>>;
}

export default function AdminSurveyManager({
  templates,
  setTemplates,
  responses,
  setResponses
}: AdminSurveyManagerProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'responses'>('templates');

  // --- Template Creation & Editing state ---
  const [editingTemplate, setEditingTemplate] = useState<SurveyTemplate | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form Meta states
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaImage, setMetaImage] = useState('');
  const [metaStatus, setMetaStatus] = useState<'active' | 'hidden'>('active');
  const [metaDisplayType, setMetaDisplayType] = useState<'main' | 'sub'>('main');

  // New Field Builder state
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState<'text' | 'number' | 'select' | 'textarea' | 'checkbox'>('text');
  const [fieldSection, setFieldSection] = useState<'personal' | 'contact' | 'survey'>('survey');
  const [fieldOptions, setFieldOptions] = useState('');
  const [fieldRequired, setFieldRequired] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active fields list being configured in the editor
  const [editorFields, setEditorFields] = useState<SurveyField[]>([]);

  // Selected response for the detailed popup modal
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  // Filter responses by survey
  const [selectedSurveyFilter, setSelectedSurveyFilter] = useState<string>(
    templates.length > 0 ? templates[0].id : 'all'
  );

  // Trigger file upload from local machine
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Convert uploaded image file to Base64 to save locally in localStorage
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setMetaImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Start creating a brand new template
  const handleCreateNewTemplate = () => {
    setIsNew(true);
    setMetaTitle('مسح إحصائي جديد لبلدة قارة');
    setMetaDescription('يرجى كتابة شرح توضيحي هنا لأهداف الإحصاء والمسح الميداني للمواطنين والمستفيدين.');
    setMetaImage('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800');
    setMetaStatus('active');
    setMetaDisplayType('main');
    
    // Add essential default fields for any survey to save time for the admin
    const defaultFields: SurveyField[] = [
      { id: 'p_name', label: 'الاسم الثلاثي والكنية', type: 'text', section: 'personal', required: true },
      { id: 'c_phone', label: 'رقم الهاتف المحمول', type: 'text', section: 'contact', required: true }
    ];
    setEditorFields(defaultFields);
    
    setEditingTemplate({
      id: `survey_${Date.now()}`,
      title: '',
      description: '',
      image: '',
      status: 'active',
      displayType: 'main',
      fields: [],
      createdAt: new Date().toISOString()
    });
  };

  // Start editing an existing template
  const handleStartEditTemplate = (template: SurveyTemplate) => {
    setIsNew(false);
    setMetaTitle(template.title);
    setMetaDescription(template.description || '');
    setMetaImage(template.image || '');
    setMetaStatus(template.status);
    setMetaDisplayType(template.displayType);
    setEditorFields([...template.fields]);
    setEditingTemplate(template);
  };

  // Add field to the template configuration
  const handleAddField = () => {
    if (!fieldLabel.trim()) return;

    const newField: SurveyField = {
      id: `field_${Date.now()}`,
      label: fieldLabel.trim(),
      type: fieldType,
      section: fieldSection,
      required: fieldRequired,
      options: fieldType === 'select' ? fieldOptions.split(',').map(o => o.trim()).filter(Boolean) : undefined
    };

    setEditorFields(prev => [...prev, newField]);
    
    // Reset inputs
    setFieldLabel('');
    setFieldOptions('');
    setFieldRequired(false);
  };

  // Remove field from the template configuration
  const handleRemoveField = (fieldId: string) => {
    setEditorFields(prev => prev.filter(f => f.id !== fieldId));
  };

  // Save survey template
  const handleSaveTemplate = () => {
    if (!metaTitle.trim()) {
      alert('الرجاء إدخال عنوان واضح للإحصاء.');
      return;
    }

    if (!editingTemplate) return;

    const updatedTemplate: SurveyTemplate = {
      ...editingTemplate,
      title: metaTitle,
      description: metaDescription,
      image: metaImage,
      status: metaStatus,
      displayType: metaDisplayType,
      fields: editorFields
    };

    let updatedList: SurveyTemplate[];
    if (isNew) {
      updatedList = [updatedTemplate, ...templates];
    } else {
      updatedList = templates.map(t => t.id === editingTemplate.id ? updatedTemplate : t);
    }

    setTemplates(updatedList);
    localStorage.setItem('qara_survey_templates', JSON.stringify(updatedList));
    setEditingTemplate(null);
  };

  // Delete survey template
  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الاستبيان وجميع الأسئلة المهيأة داخله؟')) {
      const updated = templates.filter(t => t.id !== id);
      setTemplates(updated);
      localStorage.setItem('qara_survey_templates', JSON.stringify(updated));
      
      // Also clean up responses associated with this template
      const updatedResponses = responses.filter(r => r.surveyId !== id);
      setResponses(updatedResponses);
      localStorage.setItem('qara_survey_responses', JSON.stringify(updatedResponses));
    }
  };

  // Delete individual citizen response
  const handleDeleteResponse = (responseId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الاستجابة نهائياً من النظام؟')) {
      const updated = responses.filter(r => r.id !== responseId);
      setResponses(updated);
      localStorage.setItem('qara_survey_responses', JSON.stringify(updated));
      if (selectedResponse?.id === responseId) {
        setSelectedResponse(null);
      }
    }
  };

  // EXPORT 1: Excel CSV with proper Arabic UTF-8 BOM
  const handleExportCSV = (template: SurveyTemplate) => {
    const surveyResp = responses.filter(r => r.surveyId === template.id);
    if (surveyResp.length === 0) {
      alert('لا توجد استجابات مسجلة بعد لهذا الاستبيان لتصديرها.');
      return;
    }

    // Build headers from all fields in template
    const headers = ['تاريخ تقديم الاستجابة', ...template.fields.map(f => f.label)];
    
    // Build rows
    const rows = surveyResp.map(resp => {
      const dateStr = new Date(resp.submittedAt).toLocaleDateString('ar-SY', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      const rowAnswers = template.fields.map(f => {
        const val = resp.answers[f.id];
        if (f.type === 'checkbox') {
          return val ? 'نعم / موافق' : 'لا / غير موافق';
        }
        return val || '';
      });
      return [dateStr, ...rowAnswers];
    });

    // Excel CSV structure with BOM prefix \uFEFF to load Arabic successfully
    const csvContent = "\uFEFF" + [
      headers.join(','), 
      ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `إحصائيات_${template.title.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // EXPORT 2: Full-featured Printable PDF Report
  const handlePrintReport = (template: SurveyTemplate) => {
    const surveyResp = responses.filter(r => r.surveyId === template.id);
    if (surveyResp.length === 0) {
      alert('لا توجد بيانات مسجلة لطباعتها في تقرير.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Generate HTML print view
    let rowsHTML = '';
    surveyResp.forEach((resp, index) => {
      const dateStr = new Date(resp.submittedAt).toLocaleDateString('ar-SY', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      
      let answersHTML = '';
      template.fields.forEach(f => {
        const val = resp.answers[f.id];
        let displayVal = val;
        if (f.type === 'checkbox') {
          displayVal = val ? '☑ نعم' : '☐ لا';
        }
        answersHTML += `
          <div class="field-item">
            <span class="field-label">${f.label}:</span>
            <span class="field-val">${displayVal || 'غير معبأ'}</span>
          </div>
        `;
      });

      rowsHTML += `
        <div class="citizen-record">
          <div class="record-header">المواطن المتقدم #${index + 1} - تاريخ الاستجابة: ${dateStr}</div>
          <div class="record-body">
            ${answersHTML}
          </div>
        </div>
      `;
    });

    const reportTitle = `تقرير نتائج إحصاء: ${template.title}`;

    printWindow.document.write(`
      <html dir="rtl">
      <head>
        <title>${reportTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
          body {
            font-family: 'Cairo', sans-serif;
            margin: 40px;
            color: #111;
            background-color: #fff;
          }
          .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .header-cell {
            vertical-align: top;
            text-align: right;
            font-size: 13px;
          }
          .header-cell.left {
            text-align: left;
          }
          .report-title-container {
            text-align: center;
            border-top: 3px double #064e3b;
            border-bottom: 3px double #064e3b;
            padding: 15px 0;
            margin-bottom: 40px;
          }
          .report-title {
            font-size: 20px;
            font-weight: 900;
            color: #064e3b;
            margin: 0;
          }
          .stats-summary {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 30px;
            font-size: 14px;
          }
          .citizen-record {
            border: 1px solid #ddd;
            margin-bottom: 25px;
            border-radius: 8px;
            overflow: hidden;
            page-break-inside: avoid;
          }
          .record-header {
            background-color: #064e3b;
            color: white;
            padding: 10px 15px;
            font-size: 14px;
            font-weight: bold;
          }
          .record-body {
            padding: 15px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .field-item {
            font-size: 12px;
            border-bottom: 1px dashed #eee;
            padding-bottom: 6px;
          }
          .field-label {
            font-weight: bold;
            color: #555;
            margin-left: 5px;
          }
          .field-val {
            color: #000;
          }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td class="header-cell">
              <strong>الجمهورية العربية السورية</strong><br>
              وزارة الإدارة المحلية والبيئة<br>
              مجلس بلدية قارة - القلمون<br>
              قسم الإحصاء والمسح الميداني
            </td>
            <td class="header-cell left">
              التاريخ: ${new Date().toLocaleDateString('ar-SY')}<br>
              عدد الاستجابات: ${surveyResp.length}<br>
              بوابة قارة الذكية
            </td>
          </tr>
        </table>

        <div class="report-title-container">
          <h1 class="report-title">${reportTitle}</h1>
          <p style="margin: 5px 0 0 0; font-size:12px; color:#555;">تقرير شامل صادر عن لوحة التحكم الإدارية لبوابة بلدية قارة الإلكترونية</p>
        </div>

        <div class="stats-summary">
          <strong>ملخص الإحصاء:</strong><br>
          موضوع المسح: ${template.description || 'لم يتم تحديد شرح.'}<br>
          تاريخ الاستخراج: ${new Date().toLocaleString('ar-SY')} - بواسطة منسق البيانات المعتمد.
        </div>

        <div class="records-container">
          ${rowsHTML}
        </div>

        <div style="margin-top: 50px; text-align: left; font-size:13px; page-break-inside: avoid;">
          <table style="width: 100%;">
            <tr>
              <td></td>
              <td style="text-align: left; width: 300px;">
                <strong>توقيع منسق البيانات الميدانية</strong><br><br><br>
                -----------------------------------<br>
                مجلس بلدية قارة - الختم الرسمي
              </td>
            </tr>
          </table>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getSectionFields = (section: 'personal' | 'contact' | 'survey') => {
    return editorFields.filter(f => f.section === section);
  };

  // Get filtered responses for the active table
  const getFilteredResponses = () => {
    if (selectedSurveyFilter === 'all') {
      return responses;
    }
    return responses.filter(r => r.surveyId === selectedSurveyFilter);
  };

  return (
    <div className="space-y-6">
      
      {/* Top action switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div className="text-right">
          <h3 className="font-extrabold text-lg text-emerald-950">إدارة الإحصائيات الميدانية والمسوح الذكية</h3>
          <p className="text-xs text-gray-400">إطلاق استبيانات للبلدة، تصميم خانات البيانات ديناميكياً، والاطلاع على نتائج ومشاركات المواطنين وتصديرها</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl border shrink-0">
          <button
            onClick={() => {
              setActiveTab('templates');
              setEditingTemplate(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'templates' && !editingTemplate
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-gray-600 hover:text-emerald-950'
            }`}
          >
            النماذج والمسوح ({templates.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('responses');
              setEditingTemplate(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'responses'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-gray-600 hover:text-emerald-950'
            }`}
          >
            الاستجابات والمشاركات ({responses.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- 1. MODEL / TEMPLATES CMS TAB --- */}
        {activeTab === 'templates' && !editingTemplate && (
          <motion.div
            key="templates-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-end">
              <button
                onClick={handleCreateNewTemplate}
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow hover:shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4.5 w-4.5 text-amber-300" />
                <span>إطلاق مسح إحصائي جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map(template => {
                const count = responses.filter(r => r.surveyId === template.id).length;
                return (
                  <div 
                    key={template.id}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between space-y-4 text-right hover:border-emerald-100 transition-all"
                  >
                    <div className="flex justify-between items-start flex-row-reverse">
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          template.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}>
                          {template.status === 'active' ? 'نشط ومستمر' : 'مسودة / مخفي'}
                        </span>
                        <h4 className="text-base font-black text-gray-900 leading-snug">
                          {template.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-sans leading-relaxed line-clamp-2">
                          {template.description}
                        </p>
                      </div>

                      {template.image && (
                        <img 
                          src={template.image} 
                          alt={template.title} 
                          className="h-14 w-14 rounded-2xl object-cover border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/survey_thumb/200/200";
                          }}
                        />
                      )}
                    </div>

                    <div className="bg-gray-50 p-3 rounded-2xl flex items-center justify-between text-xs font-sans text-gray-600 flex-row-reverse">
                      <span>الظهور: {template.displayType === 'main' ? 'تبويب رئيسي بالموقع' : 'تبويب فرعي بالخدمات'}</span>
                      <span>الأسئلة: {template.fields.length}</span>
                      <span className="font-semibold text-emerald-800 bg-emerald-50/50 px-2 py-0.5 rounded-lg">الاستجابات: {count}</span>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => handleExportCSV(template)}
                        className="p-2 bg-emerald-50 text-emerald-800 rounded-xl hover:bg-emerald-100 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-emerald-100"
                        title="تصدير النتائج إلى إكسل"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
                        <span className="hidden sm:inline">تصدير Excel</span>
                      </button>

                      <button
                        onClick={() => handlePrintReport(template)}
                        className="p-2 bg-indigo-50 text-indigo-800 rounded-xl hover:bg-indigo-100 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-indigo-100"
                        title="طباعة تقرير PDF"
                      >
                        <Printer className="h-4 w-4 text-indigo-700" />
                        <span className="hidden sm:inline">تقرير PDF</span>
                      </button>

                      <button
                        onClick={() => handleStartEditTemplate(template)}
                        className="px-3.5 py-2 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-gray-200"
                      >
                        <Settings className="h-4 w-4" />
                        <span>تعديل النموذج والخانات</span>
                      </button>

                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100 cursor-pointer"
                        title="حذف الاستبيان نهائياً"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* --- 1B. TEMPLATE ACTIVE EDITOR MODE --- */}
        {activeTab === 'templates' && editingTemplate && (
          <motion.div
            key="template-editor"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-3xl border border-gray-100 p-6 space-y-8 text-right"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
              <div className="text-right">
                <h4 className="font-extrabold text-base text-emerald-950">
                  {isNew ? 'تصميم وإطلاق نموذج مسح إحصائي جديد' : 'تعديل وتهيئة الاستبيان الميداني'}
                </h4>
                <p className="text-xs text-gray-400">تحكم بالعنوان، الصورة، وبناء الحقول المخصصة لكل قسم</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="h-4.5 w-4.5" />
                  <span>حفظ النموذج ونشره</span>
                </button>
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer border"
                >
                  <X className="h-4.5 w-4.5" />
                  <span>إلغاء</span>
                </button>
              </div>
            </div>

            {/* Part 1: Meta Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Details Column */}
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-bold text-gray-800">العنوان الواضح والجذاب للإحصاء</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    placeholder="مثال: إحصاء الكفاءات المهنية والحرفية لبلدة قارة..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-bold text-gray-800">شرح مبسط وجذاب لموضوع الاستبيان (المقدمة)</label>
                  <textarea
                    rows={4}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    placeholder="اكتب مقدمة قصيرة لتشجيع المواطنين على تعبئة هذا الاستبيان وما الفائدة المرجوة منه..."
                  />
                </div>
              </div>

              {/* Right Media & Position Column */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-bold text-gray-800">تخصيص صورة الغلاف للإحصاء</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={metaImage}
                      onChange={(e) => setMetaImage(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white font-sans text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800"
                      placeholder="رابط صورة غلاف ويب (URL)..."
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={handleImageUploadClick}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 rounded-xl text-xs font-bold border border-amber-200 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      title="رفع صورة من جهاز الكمبيوتر"
                    >
                      <Upload className="h-4 w-4 text-amber-700" />
                      <span>رفع</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 font-sans mt-0.5">يمكنك لصق رابط صورة مباشرة أو الضغط على رفع لاختيار صورة من الكمبيوتر.</p>

                  {metaImage && (
                    <div className="relative h-24 w-full rounded-2xl overflow-hidden mt-2 border">
                      <img src={metaImage} alt="Cover Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setMetaImage('')}
                        className="absolute top-1.5 right-1.5 bg-black/60 text-white p-1 rounded-full text-xs hover:bg-black/85 transition-all"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-800">حالة النموذج</label>
                    <select
                      value={metaStatus}
                      onChange={(e) => setMetaStatus(e.target.value as 'active' | 'hidden')}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 font-sans text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-white"
                    >
                      <option value="active">نشط ومستمر</option>
                      <option value="hidden">مسودة ومخفي</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-800">مكان وموقع التبويب</label>
                    <select
                      value={metaDisplayType}
                      onChange={(e) => setMetaDisplayType(e.target.value as 'main' | 'sub')}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 font-sans text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-white"
                    >
                      <option value="main">تبويب رئيسي بالموقع</option>
                      <option value="sub">تبويب فرعي (تحت الخدمات)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Part 2: Custom Fields Builder Tool */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/60 space-y-5">
              <div className="border-r-4 border-amber-500 pr-3 text-right">
                <h5 className="font-extrabold text-sm text-slate-900 flex items-center gap-1 justify-end">
                  <span>أداة إضافة خانات مخصصة وديناميكية للاستبيان</span>
                  <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                </h5>
                <p className="text-[11px] text-gray-400">اختر القسم، والاسم، ونوع الخانة لإضافتها لقائمة الأسئلة</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">قسم حقول الإحصاء المستهدف</label>
                  <select
                    value={fieldSection}
                    onChange={(e) => setFieldSection(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-sans text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-white"
                  >
                    <option value="personal">📋 1. البيانات الشخصية للمواطن</option>
                    <option value="contact">📞 2. بيانات الاتصال للتواصل</option>
                    <option value="survey">📊 3. بيانات الإحصاء المطلوب والمسوح</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700">اسم أو تسمية الخانة (سؤال الاستبيان)</label>
                  <input
                    type="text"
                    value={fieldLabel}
                    onChange={(e) => setFieldLabel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white font-sans text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    placeholder="مثال: هل تعتمد على الطاقة البديلة كخيار أساسي؟"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">نوع الخانة وطبيعة الإجابة</label>
                  <select
                    value={fieldType}
                    onChange={(e) => setFieldType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-sans text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-white"
                  >
                    <option value="text">نص عادي (Text Input)</option>
                    <option value="number">رقم عددي (Numeric Input)</option>
                    <option value="select">قائمة خيارات منسدلة (Dropdown Select)</option>
                    <option value="textarea">شرح أو فقرة طويلة (Textarea)</option>
                    <option value="checkbox">خيار تفعيل نعم/لا (Checkbox)</option>
                  </select>
                </div>
              </div>

              {fieldType === 'select' && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-rose-800">خيارات القائمة المنسدلة (يرجى فصلها بفاصلة عربية أو إنجليزية)</label>
                  <input
                    type="text"
                    value={fieldOptions}
                    onChange={(e) => setFieldOptions(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-white font-sans text-xs focus:outline-none focus:ring-2 focus:ring-rose-800"
                    placeholder="مثال: نعم بكل تأكيد, نعم بشكل جزئي, لا أستخدمها مطلقاً"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200/50">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={fieldRequired}
                    onChange={(e) => setFieldRequired(e.target.checked)}
                    className="h-4.5 w-4.5 rounded text-emerald-800 focus:ring-emerald-800 border-gray-300"
                  />
                  <span className="text-xs font-bold text-gray-700">تحديد هذه الخانة كخانة إجبارية (مطلوبة للتقديم)</span>
                </label>

                <button
                  type="button"
                  onClick={handleAddField}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة الخانة للنموذج</span>
                </button>
              </div>
            </div>

            {/* Part 3: Active fields preview list grouped by Section */}
            <div className="space-y-6">
              <h5 className="font-extrabold text-sm text-emerald-950 border-r-4 border-emerald-800 pr-3 mb-2">قائمة حقول النموذج المعتمدة حالياً</h5>

              {[
                { key: 'personal', title: '📋 حقول القسم الأول: البيانات الشخصية للمواطن', icon: User },
                { key: 'contact', title: '📞 حقول القسم الثاني: معلومات الاتصال بالتفصيل', icon: Phone },
                { key: 'survey', title: '📊 حقول القسم الثالث: تفاصيل الإحصاء والمسوح المطلوبة', icon: BarChart2 }
              ].map(sec => {
                const secFields = getSectionFields(sec.key as any);
                return (
                  <div key={sec.key} className="border border-gray-100 rounded-3xl p-5 space-y-3 bg-white shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900 flex-row-reverse border-b pb-2">
                      <sec.icon className="h-4 w-4 text-emerald-800" />
                      <span>{sec.title}</span>
                      <span className="text-[10px] text-gray-400 font-mono">({secFields.length} خانة)</span>
                    </div>

                    {secFields.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {secFields.map(f => (
                          <div 
                            key={f.id}
                            className="p-3 rounded-xl border bg-gray-50/50 flex justify-between items-center flex-row-reverse text-right"
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-gray-800">
                                {f.label} {f.required && <span className="text-rose-500">*</span>}
                              </span>
                              <div className="flex items-center gap-1.5 justify-end flex-row-reverse text-[9px] text-gray-400 font-sans">
                                <span>النوع: {
                                  f.type === 'text' ? 'نص عادي' :
                                  f.type === 'number' ? 'رقمي' :
                                  f.type === 'select' ? 'قائمة خيارات' :
                                  f.type === 'textarea' ? 'فقرة طويلة' : 'خيار تفعيل'
                                }</span>
                                {f.options && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="truncate max-w-[120px]" title={f.options.join(', ')}>الخيارات: {f.options.join(', ')}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Avoid deleting default critical fields if matching specific IDs in template_1 */}
                            <button
                              type="button"
                              onClick={() => handleRemoveField(f.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all hover:border-rose-100 border border-transparent cursor-pointer"
                              title="حذف الخانة"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-gray-400 bg-gray-50/20 rounded-2xl border border-dashed">
                        لا توجد أي خانات مضافة في هذا القسم حالياً.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </motion.div>
        )}

        {/* --- 2. CITIZEN RESPONSES VIEWING TAB --- */}
        {activeTab === 'responses' && (
          <motion.div
            key="responses-management"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 text-right"
          >
            {/* Filter and overview metrics */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/60 p-4 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-3 flex-row-reverse text-right">
                <span className="text-xs font-bold text-gray-700 shrink-0">تصفية حسب نموذج الإحصاء:</span>
                <select
                  value={selectedSurveyFilter}
                  onChange={(e) => setSelectedSurveyFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold font-sans focus:outline-none"
                >
                  <option value="all">عرض كافة استجابات المواطنين (الكل)</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              {selectedSurveyFilter !== 'all' && (() => {
                const activeTemp = templates.find(t => t.id === selectedSurveyFilter);
                if (activeTemp) {
                  return (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExportCSV(activeTemp)}
                        className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-amber-300" />
                        <span>تصدير Excel لـ {activeTemp.fields.length} حقل</span>
                      </button>

                      <button
                        onClick={() => handlePrintReport(activeTemp)}
                        className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-xs font-bold transition-all border border-indigo-100 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="h-4 w-4 text-indigo-700" />
                        <span>طباعة تقرير PDF</span>
                      </button>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Collected Submissions Table */}
            {getFilteredResponses().length > 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse" dir="rtl">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-100 text-slate-800 text-xs font-extrabold">
                        <th className="px-5 py-4">مقدم الاستجابة (المواطن)</th>
                        <th className="px-5 py-4">نموذج الإحصاء المستهدف</th>
                        <th className="px-5 py-4">رقم الاتصال السريع</th>
                        <th className="px-5 py-4">تاريخ ووقت الإرسال</th>
                        <th className="px-5 py-4 text-left">خيارات التحكم والتقرير</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs font-sans text-gray-700">
                      {getFilteredResponses().map((resp) => {
                        const template = templates.find(t => t.id === resp.surveyId);
                        // Try to find full name inside answers
                        const citizenName = resp.answers.p_name || resp.answers.p_name_three || 'مواطن مجهول';
                        const citizenPhone = resp.answers.c_phone || 'لا يتوفر هاتف';
                        const surveyTitle = template ? template.title : 'إحصاء محذوف';
                        
                        return (
                          <tr key={resp.id} className="hover:bg-gray-550/20 transition-all">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2.5 flex-row-reverse text-right">
                                <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                                  {citizenName.slice(0, 1)}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900">{citizenName}</div>
                                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {resp.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 font-semibold text-slate-900 max-w-[200px] truncate" title={surveyTitle}>
                              {surveyTitle}
                            </td>
                            <td className="px-5 py-4 font-mono text-gray-600">
                              {citizenPhone}
                            </td>
                            <td className="px-5 py-4 text-gray-400">
                              {new Date(resp.submittedAt).toLocaleDateString('ar-SY', {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </td>
                            <td className="px-5 py-4 text-left">
                              <div className="flex items-center gap-1.5 justify-start">
                                <button
                                  onClick={() => setSelectedResponse(resp)}
                                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-all border border-emerald-100 flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>عرض التفاصيل</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteResponse(resp.id)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                                  title="حذف الاستجابة"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-400">
                <Info className="h-8 w-8 text-gray-300 mx-auto mb-2 animate-bounce" />
                <p className="text-sm font-bold">لا توجد أي استجابات أو مشاركات مسجلة حالياً لنموذج التصفية المحدد.</p>
                <p className="text-xs text-gray-400 mt-1">عندما يقوم المواطنون بتعبئة الإحصاء، ستظهر استجاباتهم المفصلة هنا فوراً.</p>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>

      {/* --- POPUP MODAL: DETAILED CITIZEN RESPONSE VIEWER --- */}
      <AnimatePresence>
        {selectedResponse && (() => {
          const template = templates.find(t => t.id === selectedResponse.surveyId);
          if (!template) return null;

          const citizenName = selectedResponse.answers.p_name || 'مواطن مجهول';

          return (
            <motion.div
              key="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs text-right"
            >
              <motion.div
                key="modal-content"
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col justify-between"
              >
                {/* Header of Modal */}
                <div className="bg-emerald-800 text-white p-5 flex justify-between items-center flex-row-reverse border-b">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-amber-300 bg-emerald-950/50 px-2.5 py-1 rounded-md">
                      بيانات الاستجابة الرسمية للبلدة
                    </span>
                    <h4 className="text-base sm:text-lg font-black mt-1 leading-snug">
                      الاستبيان: {citizenName}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedResponse(null)}
                    className="p-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 text-white transition-all cursor-pointer border border-emerald-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Body of Modal - Grouped into 3 logical blocks */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                  
                  {[
                    { key: 'personal', title: '📋 البيانات الشخصية والمؤهلات', color: 'border-emerald-800 text-emerald-950' },
                    { key: 'contact', title: '📞 معلومات الاتصال والعنوان', color: 'border-emerald-800 text-emerald-950' },
                    { key: 'survey', title: '📊 إجابات الإحصاء والمسح المطلوب', color: 'border-amber-600 text-amber-950' }
                  ].map(sec => {
                    const secFields = template.fields.filter(f => f.section === sec.key);
                    if (secFields.length === 0) return null;

                    return (
                      <div key={sec.key} className="space-y-3">
                        <h5 className={`font-black text-xs sm:text-sm border-r-4 pr-3 ${sec.color}`}>
                          {sec.title}
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          {secFields.map(f => {
                            const val = selectedResponse.answers[f.id];
                            let formattedVal = val;
                            if (f.type === 'checkbox') {
                              formattedVal = val ? '☑ نعم / موافق' : '☐ لا / غير موافق';
                            }

                            return (
                              <div key={f.id} className="space-y-0.5 text-right font-sans">
                                <span className="block text-[10px] text-gray-400 font-bold">{f.label}</span>
                                <span className="block text-xs sm:text-sm text-gray-900 font-semibold leading-relaxed">
                                  {formattedVal || <em className="text-gray-300">غير معبأ</em>}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                </div>

                {/* Footer of Modal */}
                <div className="p-5 border-t bg-gray-50 flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => {
                      // Support printing individual citizen sheet
                      const printWindow = window.open('', '_blank');
                      if (!printWindow) return;
                      
                      let fieldsHTML = '';
                      template.fields.forEach(f => {
                        const val = selectedResponse.answers[f.id];
                        let formattedVal = val;
                        if (f.type === 'checkbox') {
                          formattedVal = val ? '☑ نعم / موافق' : '☐ لا / غير موافق';
                        }
                        fieldsHTML += `
                          <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px; font-weight: bold; width: 40%; color: #444; font-size:13px;">${f.label}</td>
                            <td style="padding: 10px; color: #111; font-size:13px;">${formattedVal || '-'}</td>
                          </tr>
                        `;
                      });

                      printWindow.document.write(`
                        <html dir="rtl">
                        <head>
                          <title>استمارة إحصاء: ${citizenName}</title>
                          <style>
                            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                            body { font-family: 'Cairo', sans-serif; margin: 40px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                          </style>
                        </head>
                        <body>
                          <h2 style="text-align: center; color: #064e3b;">مجلس بلدية قارة - استمارة استجابة فردية</h2>
                          <p style="text-align: center; font-size:12px; color:#666;">تاريخ التقديم: ${new Date(selectedResponse.submittedAt).toLocaleString('ar-SY')}</p>
                          <hr style="border: 1px solid #064e3b;">
                          <h3>${template.title}</h3>
                          <table>
                            ${fieldsHTML}
                          </table>
                          <script>window.onload = function() { window.print(); }</script>
                        </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }}
                    className="px-4 py-2 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all border border-indigo-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="h-4 w-4 text-indigo-700" />
                    <span>طباعة هذه الاستمارة</span>
                  </button>

                  <button
                    onClick={() => handleDeleteResponse(selectedResponse.id)}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all border border-rose-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>حذف الاستجابة</span>
                  </button>

                  <button
                    onClick={() => setSelectedResponse(null)}
                    className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold transition-all cursor-pointer border"
                  >
                    إغلاق النافذة
                  </button>
                </div>

              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
