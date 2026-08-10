import { SurveyTemplate, SurveyResponse } from '../types';

export const INITIAL_SURVEY_TEMPLATES: SurveyTemplate[] = [
  {
    id: 'survey_1',
    title: 'مسح الاحتياجات الخدمية والتنموية والزراعية في بلدة قارة',
    description: 'يهدف هذا الإحصاء إلى حصر وتصنيف المتطلبات الحياتية والخدمية للمواطنين والنشاطات الزراعية لبلدة قارة، لتنظيم خطط الدعم وتوجيه جهود المانحين والعمل الأهلي.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800',
    status: 'active',
    displayType: 'main',
    createdAt: '2026-07-20T10:00:00.000Z',
    fields: [
      // Personal Data Section
      { id: 'p_name', label: 'الاسم الثلاثي والكنية', type: 'text', section: 'personal', required: true },
      { id: 'p_national_id', label: 'الرقم الوطني / رقم الهوية', type: 'text', section: 'personal', required: true },
      { id: 'p_family_count', label: 'عدد أفراد الأسرة المقيمين بالمنزل', type: 'number', section: 'personal', required: true },
      
      // Contact Data Section
      { id: 'c_phone', label: 'رقم الهاتف المحمول', type: 'text', section: 'contact', required: true },
      { id: 'c_whatsapp', label: 'رقم الواتساب للتواصل', type: 'text', section: 'contact', required: false },
      { id: 'c_neighborhood', label: 'الحي السكني أو اسم الشارع بالتفصيل', type: 'text', section: 'contact', required: true },
      
      // Survey/Statistics Section
      { 
        id: 's_income_source', 
        label: 'المصدر الرئيسي لدخل الأسرة المعيشي', 
        type: 'select', 
        section: 'survey', 
        options: ['الزراعة والمواشي', 'الوظائف الحكومية والقطاع العام', 'الأعمال الحرة والتجارة', 'الحرف والمهن اليدوية', 'التحويلات الخارجية من المغتربين', 'أخرى'], 
        required: true 
      },
      { 
        id: 's_solar_energy', 
        label: 'هل تتوفر لديكم منظومة طاقة شمسية في المنزل؟', 
        type: 'select', 
        section: 'survey', 
        options: ['نعم، منظومة كاملة (إنارة وتشغيل أجهزة)', 'نعم، منظومة إنارة بسيطة فقط', 'لا تتوفر لدينا طاقة شمسية مطلقاً'], 
        required: true 
      },
      { 
        id: 's_water_source', 
        label: 'المصدر الرئيسي الذي تعتمد عليه في تأمين مياه الشرب والمنزل', 
        type: 'select', 
        section: 'survey', 
        options: ['شبكة المياه العامة للبلدية', 'شراء صهاريج مياه مأجورة', 'آبار جوفية مشتركة أو خاصة', 'مناهل مياه خيرية'], 
        required: true 
      },
      { 
        id: 's_has_land', 
        label: 'هل تملك أراضي زراعية أو كروم ضمن النطاق العقاري لمدينة قارة؟', 
        type: 'select', 
        section: 'survey', 
        options: ['نعم، أراضي منتجة ومستثمرة حالياً', 'نعم، أراضي لكنها غير مستثمرة أو مهملة', 'لا أملك أي أراض زراعية'], 
        required: true 
      },
      { 
        id: 's_crop_type', 
        label: 'إذا كنت تملك أرضاً زراعية، ما هي طبيعة المحاصيل والكروم الغالبة لديك؟', 
        type: 'select', 
        section: 'survey', 
        options: ['أشجار مثمرة (كرز، مشمش، لوز)', 'حبوب وبقوليات (قمح، شعير، إلخ)', 'زراعات محمية وخضروات', 'أخرى / لا ينطبق'], 
        required: false 
      },
      { id: 's_needs_text', label: 'اكتب بالتفصيل أبرز الاحتياجات أو المشكلات الخدمية في حيكم (مياه، صرف صحي، إنارة، طرق...)', type: 'textarea', section: 'survey', required: true }
    ]
  },
  {
    id: 'survey_2',
    title: 'إحصاء الكفاءات المهنية والخبرات والأيدي العاملة',
    description: 'مبادرة لتسجيل وتنظيم المهارات الحرفية، الهندسية، الطبية، والأكاديمية لأهالي بلدة قارة بهدف تفعيل التنمية التشاركية وبناء شبكة دعم وتشغيل متبادلة.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b904737c88?auto=format&fit=crop&q=80&w=800',
    status: 'active',
    displayType: 'main',
    createdAt: '2026-07-21T08:00:00.000Z',
    fields: [
      // Personal Data Section
      { id: 'p_name', label: 'الاسم الكامل للمهني/الخبير', type: 'text', section: 'personal', required: true },
      { id: 'p_gender', label: 'الجنس', type: 'select', section: 'personal', options: ['ذكر', 'أنثى'], required: true },
      { id: 'p_qualification', label: 'التحصيل العلمي الحالي', type: 'select', section: 'personal', options: ['دون تعليم نظامي', 'الشهادة الابتدائية / الإعدادية', 'الشهادة الثانوية بكل فروعها', 'دبلوم تقني أو معهد متوسط', 'إجازة جامعية (بكالوريوس)', 'دراسات عليا (ماجستير أو دكتوراه)'], required: true },
      
      // Contact Data Section
      { id: 'c_phone', label: 'رقم الموبايل الشخصي للتواصل', type: 'text', section: 'contact', required: true },
      { id: 'c_email', label: 'البريد الإلكتروني (إن وجد)', type: 'text', section: 'contact', required: false },
      
      // Survey Section
      { 
        id: 's_sector', 
        label: 'مجال الاختصاص أو القطاع المهني والعملي', 
        type: 'select', 
        section: 'survey', 
        options: ['التعليم، التدريب والأكاديميا', 'الطب، التمريض والصيدلة', 'الهندسة، المقاولات وأعمال البناء', 'الحرف اليدوية والصناعية (نجارة، حدادة، كهرباء...)', 'الزراعة، الإنتاج الحيواني والتصنيع الغذائي', 'البرمجيات، الاتصالات وتقنية المعلومات', 'المهن الحرة والتسويق والمبيعات', 'شؤون الإدارة والمحاسبة والقانون'], 
        required: true 
      },
      { id: 's_exp_years', label: 'عدد سنوات الخبرة العملية في هذا المجال', type: 'number', section: 'survey', required: true },
      { 
        id: 's_volunteer', 
        label: 'هل ترغب في التطوع بوقتك أو خبرتك للمساهمة في لجان التنمية المحلية ببلدة قارة؟', 
        type: 'select', 
        section: 'survey', 
        options: ['نعم، أرغب بشدة ومستعد لأي مساهمات تنموية', 'نعم، بحسب الوقت المتاح والفرص المناسبة', 'أفضل تقديم الاستشارات الفنية فقط دون نزول ميداني', 'لا أستطيع التطوع حالياً بسبب ضيق الوقت'], 
        required: true 
      }
    ]
  }
];

export const INITIAL_SURVEY_RESPONSES: SurveyResponse[] = [
  {
    id: 'resp_1',
    surveyId: 'survey_1',
    answers: {
      p_name: 'محمد خالد كحيل',
      p_national_id: '03098847253',
      p_family_count: '6',
      c_phone: '0933456712',
      c_whatsapp: '0933456712',
      c_neighborhood: 'الحي الغربي - قرب المسجد الكبير',
      s_income_source: 'الزراعة والمواشي',
      s_solar_energy: 'نعم، منظومة إنارة بسيطة فقط',
      s_water_source: 'شراء صهاريج مياه مأجورة',
      s_has_land: 'نعم، أراضي منتجة ومستثمرة حالياً',
      s_crop_type: 'أشجار مثمرة (كرز، مشمش، لوز)',
      s_needs_text: 'نعاني من نقص شديد في وصول مياه البلدية للحي الغربي مما يضطرنا لشراء الصهاريج بأسعار مرتفعة جداً ترهق كاهل الأسرة المعيشي، كذلك نأمل بإنارة الطرقات بالطاقة الشمسية ليلاً.'
    },
    submittedAt: '2026-07-21T01:22:15.000Z'
  },
  {
    id: 'resp_2',
    surveyId: 'survey_1',
    answers: {
      p_name: 'أبو عمر مأمون صوان',
      p_national_id: '03045618294',
      p_family_count: '4',
      c_phone: '0988711425',
      c_whatsapp: '0988711425',
      c_neighborhood: 'حارة الكروم - مدخل قارة الجنوبي',
      s_income_source: 'التحويلات الخارجية من المغتربين',
      s_solar_energy: 'نعم، منظومة كاملة (إنارة وتشغيل أجهزة)',
      s_water_source: 'شبكة المياه العامة للبلدية',
      s_has_land: 'لا أملك أي أراض زراعية',
      s_crop_type: 'أخرى / لا ينطبق',
      s_needs_text: 'شبكة الصرف الصحي في المنطقة الجنوبية تحتاج لترميم وتوسيع بسبب التوسع السكاني الجديد لمنع تسرب المياه وتلوث التربة الكرمية.'
    },
    submittedAt: '2026-07-21T02:45:00.000Z'
  },
  {
    id: 'resp_3',
    surveyId: 'survey_2',
    answers: {
      p_name: 'د. سلوى عماد الشوفي',
      p_gender: 'أنثى',
      p_qualification: 'دراسات عليا (ماجستير أو دكتوراه)',
      c_phone: '0955611488',
      c_email: 'salwa.shoufi@outlook.com',
      s_sector: 'الطب، التمريض والصيدلة',
      s_exp_years: '12',
      s_volunteer: 'نعم، أرغب بشدة ومستعد لأي مساهمات تنموية'
    },
    submittedAt: '2026-07-21T03:10:00.000Z'
  },
  {
    id: 'resp_4',
    surveyId: 'survey_2',
    answers: {
      p_name: 'المهندس رامي فوزي الفيصل',
      p_gender: 'ذكر',
      p_qualification: 'إجازة جامعية (بكالوريوس)',
      c_phone: '0944111322',
      c_email: 'rami.feisal@gmail.com',
      s_sector: 'البرمجيات، الاتصالات وتقنية المعلومات',
      s_exp_years: '5',
      s_volunteer: 'نعم، بحسب الوقت المتاح والفرص المناسبة'
    },
    submittedAt: '2026-07-21T04:15:30.000Z'
  },
  {
    id: 'resp_5',
    surveyId: 'survey_2',
    answers: {
      p_name: 'أبو أحمد ياسين القاري',
      p_gender: 'ذكر',
      p_qualification: 'الشهادة الابتدائية / الإعدادية',
      c_phone: '0932155776',
      c_email: '',
      s_sector: 'الحرف اليدوية والصناعية (نجارة، حدادة، كهرباء...)',
      s_exp_years: '25',
      s_volunteer: 'أفضل تقديم الاستشارات الفنية فقط دون نزول ميداني'
    },
    submittedAt: '2026-07-21T04:30:10.000Z'
  }
];
