import { Service, News, Project, Suggestion, HomeContent, HeroLink, GalleryItem, BusinessActivity } from '../types';

export const QARA_HISTORY = {
  intro: "مدينة قارة هي واحدة من أعرق الحواضر التاريخية في جبال القلمون السورية. تقع على الطريق الدولي بين دمشق وحمص، وترتفع حوالي 1300 متر عن سطح البحر، مما يمنحها مناخاً جبلياً متميزاً وطبيعة ساحرة.",
  origin: "يعود اسم قارة إلى اللغات السامية القديمة، وتعني 'القرية' أو 'الحصن'، حيث كانت محطة هامة على طرق القوافل التجارية منذ العصور الرومانية والبيزنطية. عُرفت تاريخياً باسم 'كارا' (Chara) وذكرها العديد من الجغرافيين والرحالة التاريخيين كياقوت الحموي والظاهري.",
  heritagePoints: [
    {
      title: "دير مار يعقوب المقطع التاريخي",
      description: "يعود تأسيسه إلى القرن السادس الميلادي (حوالي عام 550م)، وهو صرح روحي وتاريخي عريق يقع في جبال قارة الغربية، يضم أيقونات فريدة ورسوماً جدارية أثرية رممت حديثاً، ويشكل رمزاً للتآخي والعيش المشترك."
    },
    {
      title: "الجامع الكبير الأثري",
      description: "بني في عهد الخليفة العباسي المأمون، وتؤكد الشواهد المعمارية أنه بُني فوق أنقاض معبد روماني قديم تحول لاحقاً إلى كنيسة بيزنطية ثم إلى مسجد، ويمتاز بمئذنته المربعة الطراز ونقوشه الحجرية الأثرية."
    },
    {
      title: "الأقنية الرومانية القديمة",
      description: "شبكة مائية جوفية محفورة في الصخر بطرق هندسية مبهرة تمتد لعدة كيلومترات، استخدمها أهالي قارة منذ آلاف السنين لري بساتينهم العريقة وتأمين مياه الشرب العذبة."
    },
    {
      title: "كنيسة القديس سرجيوس وقبر يعقوب المقطع",
      description: "كنيسة قديمة في قلب المدينة تتميز بقبوها الأثري وعمارتها القلمونية الحجرية التقليدية، وتعتبر من أقدم مراكز العبادة في المنطقة."
    }
  ],
  agriculture: {
    text: "تشتهر مدينة قارة بإنتاجها الزراعي المتميز المعتمد على البيئة الجبلية النظيفة ومياه الينابيع العذبة. وتعد الزراعة الركيزة الاقتصادية الأساسية للعديد من الأسر القارّية.",
    crops: [
      { name: "الكرز القلموني", desc: "يمتاز بجودته العالية وحلاوة طعمه، ويُصدر للعديد من المحافظات والدول." },
      { name: "التين والزيتون", desc: "بساتين الزيتون المعمر وحقول التين تنتشر في السهول والمدرجات الجبلية." },
      { name: "العنب واللوزيات", desc: "تنتج قارة أصنافاً ممتازة من العنب الفاخر واللوز البلدي الشهير." },
      { name: "السماق القاري", desc: "سماق جبلي ذو نكهة قوية وجودة استثنائية يُجنى يدوياً من التلال المحيطة." }
    ]
  },
  stats: [
    { label: "الارتفاع عن سطح البحر", value: "1,300 م" },
    { label: "المسافة عن دمشق", value: "95 كم" },
    { label: "أبرز المحاصيل زراعةً", value: "الكرز واللوز والزيتون" },
    { label: "عدد المعالم الأثرية الرئيسية", value: "+12 معلم أثري" }
  ]
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: "srv_civil_registry",
    name: "بوابة السجل المدني والمعاملات الشخصية",
    iconName: "FileText",
    category: "بلدية",
    description: "تسهيل استخراج الوثائق الرسمية مثل بيان الولادة، بيان الزواج، غير الموظف، وبيان القيد العائلي بالتنسيق مع مجلس مدينة قارة ومركز خدمة المواطن.",
    requiredDocuments: [
      "البطاقة الشخصية (الهوية) لمقدم الطلب",
      "دفتر العائلة الأصلي للمطابقة",
      "طوابع مالية وبلدية (متوفرة في المركز)"
    ],
    steps: [
      "تقديم الطلب إلكترونياً أو في ديوان مجلس المدينة.",
      "مراجعة الموظف المختص لتدقيق البيانات ومطابقتها.",
      "تسديد الرسوم الرمزية في صندوق البلدية.",
      "استلام الوثيقة الرسمية الموقعة والمختومة."
    ],
    processingTime: "خلال 15 - 30 دقيقة"
  },
  {
    id: "srv_construction_license",
    name: "رخص البناء والترميم العقاري",
    iconName: "Home",
    category: "بلدية",
    description: "تقديم طلبات الحصول على رخص بناء جديدة، توسيع طابقي، أو ترميم المنازل القديمة والمتضررة في مدينة قارة وضواحيها.",
    requiredDocuments: [
      "سند ملكية عقاري حديث (إخراج قيد عقاري)",
      "مخطط كادسترالي (مساحي) ومخطط دلالة",
      "مخطط هندسي معتمد من نقابة المهندسين",
      "براءة ذمة مالية من البلدية"
    ],
    steps: [
      "تقديم ملف الترخيص الفني والملكية لمهندس البلدية.",
      "إجراء الكشف الميداني من قبل اللجنة الفنية بالبلدية للتحقق من الحدود والمواصفات.",
      "دراسة المخططات الهندسية ومطابقتها لضابطة البناء في قارة.",
      "إصدار قرار الترخيص بعد موافقة رئيس مجلس المدينة ودفع الرسوم المقررة."
    ],
    processingTime: "7 - 14 يوم عمل"
  },
  {
    id: "srv_health_center",
    name: "المركز الصحي العيادي وحجز المواعيد",
    iconName: "HeartPulse",
    category: "صحية",
    description: "خدمات حجز مواعيد العيادات العامة والأسنان والنسائية والتلقيح المجاني للأطفال في مركز قارة الصحي والمستوصف المحلي.",
    requiredDocuments: [
      "دفتر اللقاحات الخاص بالطفل (لقسم اللقاح)",
      "الهوية الشخصية للمراجع أو دفتر العائلة"
    ],
    steps: [
      "اختيار العيادة المطلوبة والوقت المناسب.",
      "تأكيد موعد الحجز واستلام رقم التسلسل.",
      "الحضور قبل الموعد بـ 10 دقائق لفتح الكرت الطبي والاستشارة مجاناً."
    ],
    processingTime: "حجز فوري (تأكيد تلقائي)"
  },
  {
    id: "srv_agriculture_support",
    name: "دعم المزارعين والمازوت الزراعي والسماد",
    iconName: "Sprout",
    category: "اجتماعية",
    description: "طلب الحصول على مخصصات المازوت الزراعي لتشغيل مضخات الآبار، والحصول على الأسمدة المدعومة والغراس الزراعية (كرز، لوز، زيتون) من الوحدة الإرشادية بقارة.",
    requiredDocuments: [
      "الوثيقة الزراعية (ترخيص البئر أو وثيقة ملكية أرض مشجرة)",
      "كتاب من الجمعية الفلاحية بقارة يؤكد استثمار الأرض",
      "صورة عن الهوية الشخصية للمستفيد"
    ],
    steps: [
      "تقديم الطلب للوحدة الإرشادية وتحديد نوع المحصول والمساحة.",
      "كشف ميداني من مرشد الوحدة الزراعية للتحقق من جهوزية الأرض والبئر.",
      "إدراج الاسم ضمن قوائم الدعم الفصلية وتحديد موعد الاستلام."
    ],
    processingTime: "3 - 5 أيام عمل"
  },
  {
    id: "srv_scholarship_charity",
    name: "دعم الطلاب والمنح الدراسية والاجتماعية",
    iconName: "GraduationCap",
    category: "تعليمية",
    description: "مبادرات رعاية وتكريم الطلاب المتفوقين في الشهادتين الإعدادية والثانوية بالتعاون مع الفعاليات الأهلية والجمعيات الخيرية بقارة، وتأمين حافلات نقل الطلاب للجامعات.",
    requiredDocuments: [
      "صورة عن وثيقة النجاح أو العلامات الرسمية",
      "إثبات قيد جامعي حديث للطلاب الجامعيين المستفيدين من النقل",
      "صورة الهوية وسند إقامة في قارة"
    ],
    steps: [
      "التسجيل عبر الاستمارة الإلكترونية لجمعية قارة الخيرية أو المكتب الثقافي.",
      "دراسة وتدقيق المستندات من لجنة المنح والدعم الطلابي.",
      "توزيع تذاكر النقل المدعومة أو المنح المالية التشجيعية للطلاب."
    ],
    processingTime: "خلال أسبوع من التسجيل"
  }
];

export const INITIAL_NEWS: News[] = [
  {
    id: "news_1",
    title: "موسم قطاف الكرز في قارة: جودة ممتازة وإقبال متميز هذا العام",
    content: "بدأ مزارعو مدينة قارة جني محصول الكرز السنوي الشهير في المزارع الممتدة على أطراف جبال القلمون الشرقية والغربية. ويُبشر المحصول هذا العام بإنتاج ذو جودة عالية جداً بفضل الظروف الجوية الملائمة وهطول الأمطار والثلوج الغزيرة في الشتاء المنصرم. \n\nوأكد رئيس الجمعية الفلاحية بقارة أن الكرز القاري يكتسب سمعة ممتازة محلياً ودولياً نظراً لاعتماد المزارعين على أساليب ري طبيعية ومكافحة حيوية آمنة، مما يجعله خالياً من المتبقيات الكيميائية ولذيذاً للغاية. وقد تم تنظيم سوق محلي مؤقت لتسهيل نقل المحصول وتصديره باتجاه أسواق الهال بدمشق وحمص.",
    date: "2026-06-25",
    category: "اجتماعي",
    views: 452,
    likes: 88,
    image: "https://picsum.photos/seed/cherries/800/400",
    comments: [
      { id: "c1", author: "أبو محمد القاري", content: "ما شاء الله، كرز قارة لا يعلى عليه طعماً وجودة. نتمنى اهتماماً أكبر بتأمين محروقات الآبار لاستمرار بساتيننا الخيرة.", date: "2026-06-26" },
      { id: "c2", author: "سارة كرباج", content: "كل التوفيق لأهلنا الكرام في قارة، موسم خير وبركة إن شاء الله.", date: "2026-06-26" }
    ]
  },
  {
    id: "news_2",
    title: "مجلس مدينة قارة يدشن المرحلة الثانية من مشروع الإنارة الشمسية للشوارع الرئيسية",
    content: "أعلن مجلس مدينة قارة بالتعاون مع المجتمع الأهلي والجمعيات الخيرية، عن إنجاز وتركيب 120 جهاز إنارة شوارع جديد يعمل بالطاقة الشمسية الصديقة للبيئة، لتبلغ نسبة تغطية الشوارع الرئيسية والساحات في المدينة ما يقارب 85%.\n\nتأتي هذه الخطوة الهامة في ظل النقص الحاصل في التغذية الكهربائية للحد من الحوادث وتسهيل حركة المواطنين ليلاً في المحاور الحيوية كطريق الدير والشارع الرئيسي ومدخل المدينة الشمالي والجنوبي. وأعرب أهالي المدينة عن امتنانهم للجهود التشاركية بين البلدية والمغتربين والجهات الداعمة لإنجاح هذه المبادرة الاستثنائية التي جعلت قارة نموذجاً يُحتذى به في التنمية المحلية المستقلة.",
    date: "2026-07-05",
    category: "بلدي",
    views: 389,
    likes: 124,
    image: "https://picsum.photos/seed/solar_street/800/400",
    comments: [
      { id: "c3", author: "م. وسيم غانم", content: "مشروع رائد يثبت وعي أهلنا في قارة والتفاتهم للتنمية المستدامة. تحية لكل من ساهم بالتمويل والتركيب.", date: "2026-07-06" }
    ]
  },
  {
    id: "news_3",
    title: "ترميم وتأهيل أجزاء من دير مار يعقوب المقطع الأثري لاستقبال الزوار",
    content: "بجهود مشتركة بين المديرية العامة للآثار والمتاحف وإدارة دير مار يعقوب المقطع الأثري في قارة، تم الانتهاء من أعمال ترميم الواجهات الحجرية وتدعيم السقف الخشبي لبعض القاعات الأثرية التاريخية التي تعود للقرن السادس الميلادي.\n\nتضمن المشروع إزالة آثار الرطوبة والتصدعات الجدارية وإصلاح الممرات المؤدية إلى الصوامع التاريخية والكهوف الجبلية المجاورة مع الحفاظ الصارم على الهوية المعمارية واللوحات الجدارية البيزنطية النادرة. ويعد الدير مقصداً سياحياً وثقافياً واعداً يسهم في تنشيط السياحة الثقافية لمدينة قارة ومنطقة القلمون عموماً.",
    date: "2026-06-18",
    category: "ثقافي",
    views: 512,
    likes: 156,
    image: "https://picsum.photos/seed/monastery/800/400",
    comments: [
      { id: "c4", author: "فادي بطرس", content: "هذا الدير كنز حقيقي وتاريخي لقارة وسوريا كلها. عمل عظيم للحفاظ على الإرث الوطني.", date: "2026-06-19" },
      { id: "c5", author: "حسام خليل", content: "قارة غنية جداً بالآثار المنسية، نأمل الاستمرار في الكشف عن باقي الآثار وقنوات المياه الرومانية.", date: "2026-06-20" }
    ]
  },
  {
    id: "news_4",
    title: "انطلاق دوري فرع قارة الرياضي بكرة القدم للشباب بمشاركة 8 فرق محلية",
    content: "تحت رعاية نادي قارة الرياضي وبأجواء حماسية غامرة، انطلقت منافسات دوري الأحياء الشعبية والشباب بكرة القدم على أرض ملعب قارة البلدي المعشب صناعياً.\n\nشهد الافتتاح حضوراً جماهيرياً كبيراً من عشاق الرياضة وأهالي المدينة، وتخلل الحفل عروض فنية وفلكلورية قدمتها كشافة قارة. يهدف هذا الدوري السنوي إلى تنشيط الحركة الرياضية واكتشاف المواهب الشابة لضمها لصفوف النادي الأول لتمثيل المدينة في بطولات المحافظة، والتشجيع على نمط حياة صحي وإيجابي للشباب.",
    date: "2026-07-01",
    category: "رياضي",
    views: 290,
    likes: 72,
    image: "https://picsum.photos/seed/football/800/400",
    comments: []
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj_solar",
    title: "توليد الطاقة الشمسية للآبار المائية المغذية للمدينة",
    description: "تأمين مصدر طاقة مستدام ونظيف لتشغيل الآبار الارتوازية ومضخات ضخ المياه الرئيسية في السهول الغربية لقارة. يهدف المشروع للحد من مشكلة انقطاع المياه الطويل عن المنازل وضمان تزويد المواطنين بمياه الشرب بشكل دوري ومنتظم.",
    status: "قيد التنفيذ",
    percentage: 75,
    budget: "120,000 $ (تبرعات ومساهمات أهلية)",
    volunteersCount: 34,
    category: "طاقة متجددة",
    dateStarted: "2026-01-10",
    dateTarget: "2026-09-01",
    image: "https://picsum.photos/seed/solar_water/600/400"
  },
  {
    id: "proj_road_paving",
    title: "تأهيل وتعبيد شبكة الطرق الداخلية والفرعية في أحياء قارة",
    description: "إعادة تعبيد الحفر وتسوية الطرق الفرعية المتضررة بفعل العوامل الجوية، وخصوصاً الشوارع المحيطة بالمدارس، السوق التجاري، والمستوصف الصحي، لضمان حركة آمنة للمشاة والسيارات والآليات الزراعية.",
    status: "مكتمل",
    percentage: 100,
    budget: "85,000 $ (مجلس مدينة قارة ومساهمة وزارة الإدارة المحلية)",
    volunteersCount: 15,
    category: "بنى تحتية",
    dateStarted: "2025-08-15",
    dateTarget: "2026-05-20",
    image: "https://picsum.photos/seed/road/600/400"
  },
  {
    id: "proj_cherry_cold_storage",
    title: "إنشاء وحدة تبريد وتوضيب لثمار الكرز واللوزيات",
    description: "مشروع رائد يهدف لمساعدة مزارعي قارة على تخزين محاصيلهم الحساسة وتوضيبها بشكل احترافي مما يحميهم من الخسائر بسبب تدني الأسعار أثناء ذروة الموسم، ويزيد من القيمة المضافة لإنتاج الكرز القلموني من خلال تبريد منظم وتصدير تدريجي.",
    status: "قيد التخطيط",
    percentage: 20,
    budget: "150,000 $ (استثمار تشاركي وتعاوني)",
    volunteersCount: 8,
    category: "زراعي",
    dateStarted: "2026-05-01",
    dateTarget: "2027-04-15",
    image: "https://picsum.photos/seed/cold_storage/600/400"
  },
  {
    id: "proj_cultural_center",
    title: "تأسيس مركز تدريب مهني وصناعات يدوية للشباب والمرأة",
    description: "تجهيز مبنى مجتمعي في وسط قارة لتقديم دورات تدريبية مجانية في مجالات صيانة الأجهزة الإلكترونية، البرمجة، الخياطة وتصميم الأزياء، وتعبئة وحفظ الفواكه المجففة والحلويات القلمونية التراثية، بهدف تمكين العائلات محلياً.",
    status: "قيد التنفيذ",
    percentage: 45,
    budget: "40,000 $ (جمعيات خيرية ومنظمات مجتمع مدني)",
    volunteersCount: 19,
    category: "ثقافي وخدمي",
    dateStarted: "2026-03-20",
    dateTarget: "2026-11-30",
    image: "https://picsum.photos/seed/learning/600/400"
  }
];

export const INITIAL_SUGGESTIONS: Suggestion[] = [
  {
    id: "sug_1",
    author: "خالد المرزوقي",
    title: "فكرة لإنشاء متحف تراثي صغير بجانب الجامع الأثري",
    content: "أقترح على مجلس المدينة بالتعاون مع المدارس وأهالي المدينة، جمع المقتنيات التاريخية القديمة وأدوات الزراعة التراثية التي كانت تستخدم في قارة وجبال القلمون، وعرضها في متحف تراثي صغير لتعريف الأجيال القادمة والسياح بهوية بلدتنا وتاريخها العريق.",
    category: "فكرة مشروع",
    likes: 42,
    date: "2026-07-08",
    status: "approved",
    municipalityVote: "study"
  },
  {
    id: "sug_2",
    author: "رهام الكاتب",
    title: "تأمين سلل مهملات وحاويات إضافية في الأحياء السكنية",
    content: "نلاحظ نقصاً في سلال المهملات في شارع المدارس الفرعي والساحة العامة، نقترح زيادة عدد الحاويات وتفعيل حملات توعية دورية لطلاب المدارس للحفاظ على نظافة شوارع قارة الجميلة وجدرانها العتيقة.",
    category: "تحسين خدمات",
    likes: 29,
    date: "2026-07-10",
    status: "approved",
    municipalityVote: "approve"
  }
];

export const INITIAL_HOME_CONTENT: HomeContent = {
  heroBadge: "حضارة تمتد لآلاف السنين في جبال القلمون",
  heroTitle: "مرحباً بكم في مدينة قارة الأثرية",
  heroDescription: "شمس التاريخ الساطع من قمم القلمون الشامخة. بوابتكم الرسمية المتكاملة للخدمات البلدية، والأنشطة الأهلية والمشاريع الحيوية المستدامة التي يرويها عبق حقول الكرز المعطاءة.",
  introTitle: "أصالة الجذور وشموخ جبال القلمون",
  introText: "مدينة قارة هي واحدة من أعرق الحواضر التاريخية في جبال القلمون السورية. تقع على الطريق الدولي بين دمشق وحمص، وترتفع حوالي 1300 متر عن سطح البحر، مما يمنحها مناخاً جبلياً متميزاً وطبيعة ساحرة.",
  originText: "يعود اسم قارة إلى اللغات السامية القديمة، وتعني 'القرية' أو 'الحصن'، حيث كانت محطة هامة على طرق القوافل التجارية منذ العصور الرومانية والبيزنطية. عُرفت تاريخياً باسم 'كارا' (Chara) وذكرها العديد من الجغرافيين والرحالة التاريخيين كياقوت الحموي والظاهري.",
  awardTitle: "روح قارة المعطاءة",
  awardText: "يمتاز مجتمع قارة بروح التعاون العالية والمثابرة على التنمية، حيث تتكاتف طاقات العائلات المحلية والمغتربين مع الفعاليات الأهلية لتبني وتطوير البنى الخدمية والزراعية بالاعتماد على التشاركية.",
  agricultureTitle: "خيرات قارة الجبلية",
  agricultureText: "تشتهر مدينة قارة بإنتاجها الزراعي المتميز المعتمد على البيئة الجبلية النظيفة ومياه الينابيع العذبة. وتعد الزراعة الركيزة الاقتصادية الأساسية للعديد من الأسر القارّية.",
  agricultureCrops: [
    { name: "الكرز القلموني", desc: "يمتاز بجودته العالية وحلاوة طعمه، ويُصدر للعديد من المحافظات والدول.", symbol: "🍒" },
    { name: "التين والزيتون", desc: "بساتين الزيتون المعمر وحقول التين تنتشر في السهول والمدرجات الجبلية.", symbol: "🫒" },
    { name: "العنب واللوزيات", desc: "تنتج قارة أصنافاً ممتازة من العنب الفاخر واللوز البلدي الشهير.", symbol: "🍇" },
    { name: "السماق القاري", desc: "سماق جبلي ذو نكهة قوية وجودة استثنائية يُجنى يدوياً من التلال المحيطة.", symbol: "🌿" }
  ],
  stats: [
    { label: "الارتفاع عن سطح البحر", value: "1,300 م" },
    { label: "المسافة عن دمشق", value: "95 كم" },
    { label: "أبرز المحاصيل زراعةً", value: "الكرز واللوز والزيتون" },
    { label: "عدد المعالم الأثرية الرئيسية", value: "+12 معلم أثري" }
  ],
  heritageTitle: "شواهد أثرية تحكي حكاية قارة",
  heritageDescription: "تحتضن قارة مجموعة من أهم المعالم الأثرية والدينية في منطقة القلمون، التي تعكس تعاقب العصور الرومانية، البيزنطية، والإسلامية بتآلف وتناغم تامين.",
  heritagePoints: [
    {
      id: "h1",
      title: "دير مار يعقوب المقطع التاريخي",
      description: "صرح روحي وتاريخي عريق يقع في جبال قارة الغربية يعود للقرن السادس الميلادي ويضم أيقونات فريدة وجداريات تاريخية.",
      fullExplanation: "يعود تأسيس دير مار يعقوب المقطع إلى القرن السادس الميلادي (حوالي عام 550م)، وهو صرح روحي وتاريخي عريق يقع في جبال قارة الغربية. يضم الدير أيقونات بيزنطية فريدة ورسوماً جدارية أثرية رممت حديثاً بالتعاون مع المديرية العامة للآثار والمتاحف. يتكون الدير من عدة صوامع جبلية وكهوف محفورة في الصخر، ويشكل رمزاً تاريخياً للتآخي والتلاحم بين أبناء قارة والقلمون.",
      image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80",
      period: "القرن السادس الميلادي (البيزنطي)",
      location: "جبال قارة الغربية"
    },
    {
      id: "h2",
      title: "الجامع الكبير الأثري",
      description: "جامع عباسي عريق بني في عهد الخليفة المأمون فوق شواهد معمارية رومانية وبيزنطية مع مئذنة مربعة.",
      fullExplanation: "بني الجامع الكبير في مدينة قارة في عهد الخليفة العباسي المأمون، وتؤكد الشواهد المعمارية والآثار الحجرية المتبقية أنه بُني فوق أنقاض معبد روماني قديم تحول لاحقاً إلى كنيسة بيزنطية ثم إلى هذا المسجد العريق. يمتاز الجامع بمئذنته المربعة الطراز ونقوشه الحجرية الكوفية الأصيلة وعموديه الرومانيين الشاهدين على تعاقب العصور.",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
      period: "العصر العباسي (القرن التاسع الميلادي)",
      location: "وسط مدينة قارة القديمة"
    },
    {
      id: "h3",
      title: "الأقنية الرومانية القديمة",
      description: "شبكة مائية جوفية محفورة في الصخر بطرق هندسية مبهرة تمتد لعدة كيلومترات واستخدمت لري البساتين.",
      fullExplanation: "تعد الأقنية الرومانية في قارة شبكة مائية جوفية محفورة في الصخر بطرق هندسية مبهرة تمتد لعدة كيلومترات عبر السهل والجبل. استخدمها أهالي قارة منذ آلاف السنين لري بساتينهم العريقة وتأمين مياه الشرب العذبة، وتعد شاهداً حياً على عبقرية الري والهندسة المائية في العصر الروماني.",
      image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=800&q=80",
      period: "العصر الروماني",
      location: "المنطقة الزراعية والأحياء القديمة"
    },
    {
      id: "h4",
      title: "كنيسة القديس سرجيوس وقبر يعقوب المقطع",
      description: "كنيسة أثرية قديمة تتميز بقبوها الأثري وعمارتها القلمونية الحجرية وتعتبر من أقدم مراكز العبادة.",
      fullExplanation: "كنيسة قديمة تقع في قلب مدينة قارة القديمة وتتميز بقبوها الأثري وعمارتها القلمونية الحجرية التقليدية المحافظة على طابعها الأصيل. تعتبر الكنيسة وقبرها الأثري من أقدم مراكز العبادة والمعالم الروحية والتاريخية المحفوظة في القلمون.",
      image: "https://images.unsplash.com/photo-1548625361-155deee262cd?auto=format&fit=crop&w=800&q=80",
      period: "العصر البيزنطي المبكر",
      location: "الحي القديم - قارة"
    }
  ],
  heritageActiveBgColor: "#065f46",
  heritageActiveTextColor: "#ffffff",
  heritageInactiveBgColor: "#ffffff",
  heritageInactiveTextColor: "#374151",
  heritageContentBgColor: "#ffffff",
  heritageContentTextColor: "#4b5563",
  heritageContentTitleColor: "#022c22",
  emergencyTitle: "دليل الجهات والخطوط الساخنة في قارة",
  emergencyDescription: "دليل أرقام الهواتف والدوائر الخدمية الهامة لتأمين الاستجابة السريعة وحل مشكلات المواطنين وتسهيل الخدمات الطبية والبلدية لجميع العائلات داخل قارة.",
  emergencyContacts: [
    { name: "المجلس المحلي لمدينة قارة", number: "7812001", role: "شؤون المواطنين والمعاملات والخدمات العامة", iconName: "Building" },
    { name: "مركز قارة الصحي والمستوصف", number: "7812200", role: "الطوارئ الطبية، العيادات الخارجية واللقاحات", iconName: "HeartPulse" },
    { name: "الدفاع المدني وشعبة الإطفاء", number: "113", role: "الحرائق، الكوارث وحالات الإنقاذ الطارئة", iconName: "ShieldAlert" },
    { name: "الوحدة الإرشادية والجمعية الفلاحية", number: "7812115", role: "شؤون المزارعين، الري، ومخصصات المحاصيل الجبلية", iconName: "Sprout" }
  ],
  heroImage: "",
  heroLinks: [
    { id: 'btn-1', label: "الخدمات الإلكترونية الرقمية", targetTab: "services", variant: "primary", iconName: "Building2" },
    { id: 'btn-2', label: "استكشف المشاريع التنموية", targetTab: "projects", variant: "secondary", iconName: "Briefcase" }
  ],
  agricultureBgColor: "#064e3b",
  agricultureTextColor: "#ecfdf5",
  agricultureSubBgColor: "rgba(2, 44, 34, 0.4)",
  agricultureSubBorderColor: "rgba(6, 78, 59, 0.4)",
  agricultureTitleColor: "#fbbf24",
  agricultureCropTitleColor: "#fcd34d",
  agricultureCropDescColor: "rgba(209, 250, 229, 0.8)",
  agricultureFontFamily: "Cairo",
  agricultureFontSize: "14",
  agricultureFontWeight: "normal",
  agricultureFontStyle: "normal",

  // Default Visitor Counter Options
  visitorCountEnabled: true,
  visitorCount: 14582,
  visitorCounterPosition: "below_gallery",
  visitorCounterTitle: "إجمالي زوار بوابة قارة الإلكترونية",
  visitorCounterColor: "#fbbf24",
  visitorCounterBg: "#064e3b",

  // Default Gallery Options
  newsCategories: ['أخبار عامة', 'بلدي', 'اجتماعي', 'رياضي', 'ثقافي'],
  maxUploadSizeKB: 5000,
  homeMarqueePosition: "bottom_horizontal",
  galleryTitle: "ألبوم صور وذكريات بلدة قارة",
  galleryDescription: "مساحة تواصل بصرية تجمع لقطات ومساهمات أهالي بلدة قارة الأبية لتخليد جمال طبيعتها، بساتين الكرز، أحيائها التراثية الشامخة، وجبال القلمون الممتدة.",
  galleryWatermarkEnabled: true,
  galleryWatermarkBgColor: "rgba(0, 0, 0, 0.65)",
  galleryWatermarkTextColor: "#ffffff",
  galleryWatermarkTextColorSecondary: "#fbbf24",
  galleryWatermarkFontSize: 11,
  galleryWatermarkPosition: "bottom_right",

  // Default Electronic Services Page Visibility Controls
  servicesPageEnabled: true,
  servicesDisabledMode: "coming_soon",
  servicesDisabledTitleAr: "",
  servicesDisabledTitleEn: "",
  servicesDisabledMessage: "",
  servicesDisabledLogo: "",
  servicesDisabledFlagUrl: "",

  // Default Council & Identity Logos configuration
  councilLogo: "",
  councilLogoPosition: "top_right",
  councilLogoBgColor: "transparent",
  councilLogoWidth: 80,
  identityLogo: "",
  identityLogoPosition: "top_left",
  identityLogoBgColor: "transparent",
  identityLogoWidth: 80,

  // Header / Top Navigation Bar default customization
  headerPortalTitle: "بوابة قارة الإلكترونية",
  headerPortalSubtitle: "جبال القلمون، سوريا",
  headerTitleColor: "#022c22",
  headerSubtitleColor: "#92400e",
  headerBgColor: "#fdfbf7",
  headerBorderColor: "rgba(217, 119, 6, 0.15)",
  headerPresetStyle: "emerald_gold",
  headerHeightMode: "normal",
  headerDistinctionFx: "gold_glow",
  headerLogoIcon: "Building2",

  // Tab Title and Page Header custom styling options
  tabStyle: "pill",
  tabColorActive: "#064e3b",
  tabColorInactive: "#4b5563",
  tabBgActive: "#f0fdf4",
  tabFontSize: "16",
  tabHoverEffect: "lift_up",

  // Live Stream default options
  liveStreamEnabled: true,
  liveStreamMode: "url",
  liveStreamUrl: "https://www.youtube.com/embed/live_stream?channel=UCqara_city_official",
  liveStreamBadge: "بث مباشر من قارة",
  liveStreamStatusText: "مباشر الآن 🔴",
  liveStreamCopyrightTitle: "حقوق وإرشادات البث المباشر",
  liveStreamCopyrightContent: "جميع حقوق البث والنقل الحي محفوظة لمجلس مدينة قارة واللجنة الإعلامية المعتمدة. يمنع إعادة البث أو استخدام اللقطات لأغراض تجارية دون إذن رسمي مكتوب.",

  pageHeaderStyle: "ornamented",
  pageHeaderColor: "#022c22",
  pageHeaderBg: "transparent",
  pageHeaderFontSize: "32",
  pageHeaderFontFamily: "Cairo",
  pageHeaderAlignment: "center",
  sectionSpacing: "compact",

  // Bottom Banner / Footer default options
  footerAboutTitle: "مجلس مدينة قارة السورية",
  footerAboutText: "المنصة الرسمية الموحدة لمدينة قارة، لتأمين التواصل المباشر وتسهيل المعاملات والخدمات للمواطنين داخل القطر والمغتربين، وتسليط الضوء على الإرث التاريخي العريق وجوانب التنمية المحلية في قارة الأثرية.",
  footerAddress: "مبنى مجلس المدينة - الساحة العامة - قارة، ريف دمشق، سوريا",
  footerPhone: "+963 (11) 781-2345",
  footerEmail: "info@qara-city.gov.sy",
  footerZipCode: "625129",
  footerWorkingHours: "دوام مجلس المدينة: 8:00 ص - 3:00 م",
  footerMadeWithLoveText: "صُنع بحب لأهالي مدينة قارة العريقة في سوريا الحبيبة",
  footerCopyrightText: "بوابة مدينة قارة الإلكترونية - التنمية المحلية المستدامة",
  footerBgColor: "#022c22", // green-950
  footerTextColor: "#ecfdf5", // emerald-100
  footerAccentColor: "#d97706", // amber-600
  footerAlignment: "right",
  footerWatermarkLogo: "", // default empty
  footerWatermarkOpacity: 0.15,
  footerWatermarkRepeat: "no-repeat",
  footerWatermarkRotate: -15,
  footerWatermarkWidth: 150,
  footerWatermarkPosition: "center",
  footerWatermarkX: 0,
  footerWatermarkY: 0,
  footerColumnsLayout: "default",
  footerLinksContactShift: 0,

  // Stats Banner default customization
  statsBgColor: "#ffffff",
  statsHeight: 12, // smaller vertical padding (compact)
  statsFontSize: 12, // compact text size
  statsValueColor: "#064e3b",
  statsLabelColor: "#6b7280",

  // News Ticker default options
  tickerEnabled: true,
  tickerBgColor: "#022c22", // deep green match footer/hero
  tickerTextColor: "#fcd34d", // elegant amber
  tickerFontSize: 13,
  tickerDirection: "rtl",
  tickerSourceFromNewsTab: true,
  tickerCustomItems: [
    "بلدية قارة ترحب بجميع زوار البوابة الإلكترونية وتؤكد استمرار تسيير المعاملات الرقمية بيسر وسهولة.",
    "تنويه: يرجى من الإخوة المزارعين مراجعة الوحدة الإرشادية لتسجيل مخصصات المازوت لقطاع ري أشجار الكرز.",
    "المجلس المحلي يعلن عن بدء المرحلة الثانية من تعبيد وإنارة طريق دير مار يعقوب الأثري بالطاقة البديلة."
  ],
  tickerTitle: "آخر الأخبار",
  tickerTitleBgColor: "#f59e0b", // Amber 500
  tickerTitleTextColor: "#022c22", // Emerald 950
  tickerTitlePosition: "left",

  // Community board default customization
  communityScrollSpeed: 15, // 15 seconds
  communityScrollHeight: 450, // 450px
  communityBgColor: "#ffffff",
  communityTitleColor: "#022c22",
  communityItemBgColor: "#fffbeb", // amber-50/20
  communityItemTextColor: "#4b5563", // gray-600
  communityItemTitleColor: "#111827", // gray-900
  communityBorderColor: "#fde68a", // amber-200
  communityDateColor: "#9ca3af", // gray-400
  communityHeartColor: "#ef4444", // red-500
  communityItemFontSize: "xs",
  communityItemPadding: "4",
  directoryPageName: "الدليل التجاري والخدمي",
  marketplaceConfig: {
    enabled: true,
    storeTitle: "متجر قارة الإلكتروني",
    storeSubtitle: "المنصة المخصصة لأهالي وأعضاء مدينة قارة لإدراج وتصفح إعلانات البيع والشراء مباشرة",
    categories: ["عقارات", "سيارات ومحركات", "إلكترونيات وأجهزة", "طاقة شمسية ومولدات", "أثاث ومستلزمات منزلية", "مواشي ومنتجات زراعية", "خدمات وتبادلات"],
    addFormTitle: "بطاقة إضافة إعلان سلعة جديد",
    addFormInstructions: "💡 يرجى كتابة اسم السلعة بوضوح، تحديد الفئة المناسبة، إضافة الوصف وصور واضحة للسلعة، وتحديد رقم الهاتف للتواصل. يمكن لمالك الإعلان تعديله أو حذفه أو تعيينه كـ (تم البيع) في أي وقت.",
    autoDeleteHoursAfterSold: 48,
  },
  galleryCategories: [
    "صور المناطق الطبيعية",
    "صور الأطفال",
    "صور المناسبات الاجتماعية",
    "صور متنوعة"
  ],
  directoryCategories: [
    "تجاري",
    "خدمي",
    "صحي",
    "تراثي",
    "تعليمي",
    "زراعي",
    "صناعي",
    "مهن وحرف"
  ],
  sideBannersEnabled: true,
  sideBanners: [
    {
      id: "banner-right-1",
      title: "خدمات أهالي قارة السريعة",
      content: "يمكنكم التقديم المباشر للحصول على بيانات الأحوال الشخصية ورخص البناء والاستعلام عن الخدمات الخدمية.",
      position: "right",
      enabled: true,
      bgColor: "#022c22",
      textColor: "#ffffff",
      buttonLabel: "الانتقال للخدمات",
      buttonLinkTab: "services",
      iconName: "FileText"
    },
    {
      id: "banner-left-1",
      title: "المبادرات والتبرعات الأهلية",
      content: "تعرف على المشاريع التنموية الحالية وساهم في تطوير وتجميل المرافق العامة ببلدة قارة.",
      position: "left",
      enabled: true,
      bgColor: "#064e3b",
      textColor: "#ffffff",
      buttonLabel: "استكشف المشاريع",
      buttonLinkTab: "projects",
      iconName: "Sparkles"
    }
  ]
};

export const INITIAL_COMMUNITY_ANNOUNCEMENTS: News[] = [
  {
    id: "ann_1",
    title: "تهنئة بمناسبة النجاح الباهر في امتحانات الشهادة الثانوية العامة",
    content: "يتقدم مجلس بلدة قارة بأحر التهاني والتبريكات لجميع طلابنا الناجحين في الشهادة الثانوية لهذا العام، متمنين لهم مستقبلاً علمياً زاهراً لخدمة بلدتهم ورفعة وطنهم.",
    date: "2026-07-15",
    category: "اجتماعي",
    views: 124,
    likes: 45,
    comments: [],
    status: "approved",
    authorName: "عاصم كاره"
  },
  {
    id: "ann_2",
    title: "حملة تشجير وتجميل مدخل قارة الغربي يوم الجمعة القادم",
    content: "يدعو فريق مبادرو قارة التطوعي كافة الأهالي والشباب والمهتمين للمشاركة في حملة التشجير وزراعة الغراس وتجميل المنصفات على الطريق العام لمدخل البلدة الغربي. التجمع في تمام الساعة 8 صباحاً.",
    date: "2026-07-12",
    category: "بلدي",
    views: 98,
    likes: 32,
    comments: [],
    status: "approved",
    authorName: "فريق صناع الخير"
  },
  {
    id: "ann_3",
    title: "موعد توزيع الدفعة الأولى من مازوت التدفئة للعائلات",
    content: "تعلن لجنة المحروقات ببلدية قارة عن بدء تسجيل الدفعة الأولى لمازوت التدفئة للعائلات، يرجى التوجه لمركز الخدمة مصطحبين البطاقة العائلية لتأكيد البيانات وتنزيل المخصصات.",
    date: "2026-07-10",
    category: "بلدي",
    views: 215,
    likes: 67,
    comments: [],
    status: "approved",
    authorName: "المكتب الخدمي بالبلدية"
  },
  {
    id: "ann_4",
    title: "إقامة حفل زفاف جماعي لأبناء البلدة برعاية الجمعية الخيرية",
    content: "تحتفي بلدة قارة هذا الأسبوع بإقامة حفل زفاف جماعي لـ 15 شاباً وشابة من أبناء البلدة الميسورين لتسهيل سبل العيش وتخفيف التكاليف، برعاية ودعم كامل من جمعية قارة الخيرية والمغتربين.",
    date: "2026-07-08",
    category: "اجتماعي",
    views: 310,
    likes: 154,
    comments: [],
    status: "approved",
    authorName: "أبو ماجد الغانم"
  },
  {
    id: "ann_5",
    title: "مقترح تنظيم دوري كرة قدم خماسي لفرق أحياء قارة",
    content: "أقترح على اللجنة الرياضية والشباب إقامة دوري خماسي بكرة القدم على الملعب البلدي الجديد يضم شباب الأحياء في قارة لتنشيط الروح الرياضية والتجمع الودي المسائي للأهالي.",
    date: "2026-07-18",
    category: "رياضي",
    views: 45,
    likes: 12,
    comments: [],
    status: "pending",
    authorName: "علاء زكريا (مشارك معلق)"
  }
];

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g-1",
    title: "بساتين الكرز القاري في الربيع",
    submitter: "أبو أحمد القاري",
    imageUrl: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&w=1200&q=80",
    date: "2026-06-20",
    status: "approved",
    category: "صور المناطق الطبيعية"
  },
  {
    id: "g-2",
    title: "قمم جبال القلمون الشامخة",
    submitter: "مضر زكريا",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    date: "2026-07-02",
    status: "approved",
    category: "صور المناطق الطبيعية"
  },
  {
    id: "g-3",
    title: "البيوت الجبلية الحجرية في حارات قارة القديمة",
    submitter: "سامر كاره",
    imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80",
    date: "2026-07-05",
    status: "approved",
    category: "صور متنوعة"
  }
];

export const INITIAL_BUSINESS_ACTIVITIES: BusinessActivity[] = [
  {
    id: "biz-1",
    name: "بساتين أبو أحمد لإنتاج الكرز واللوز القلموني",
    activity: "إنتاج زراعي وتوريد كرز ولوز بلدي فاخر بأسعار تفضيلية",
    phone: "+963-933-111222",
    whatsapp: "+963933111222",
    email: "abu.ahmad.cherry@gmail.com",
    address: "سهول قارة الشرقية وبساتين جبل القلمون",
    image: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&w=800&q=80",
    isPinned: true,
    status: "approved",
    cardColor: "bg-emerald-50/90",
    textColor: "text-emerald-950",
    cardStyle: "heritage",
    createdAt: "2026-07-15"
  },
  {
    id: "biz-2",
    name: "مكتبة ومطبعة الياسمين بالقلمون",
    activity: "قرطاسية كاملة، خدمات طباعة وتصوير وتجليد وتجهيز المعاملات للمواطنين",
    phone: "+963-955-444333",
    whatsapp: "+963955444333",
    address: "شارع الجلاء، بجانب الساحة العامة، قارة",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
    isPinned: true,
    status: "approved",
    cardColor: "bg-sky-50/90",
    textColor: "text-sky-950",
    cardStyle: "modern",
    createdAt: "2026-07-16"
  },
  {
    id: "biz-3",
    name: "معصرة قارة الحديثة لعصر الزيتون البلدي",
    activity: "عصر زيتون على البارد بطرق حديثة وإنتاج زيت زيتون قلموني مكفول 100%",
    phone: "+963-944-777888",
    whatsapp: "+963944777888",
    address: "المنطقة الصناعية، مدخل مدينة قارة الشمالي",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    status: "approved",
    cardColor: "bg-amber-50/90",
    textColor: "text-amber-950",
    cardStyle: "heritage",
    createdAt: "2026-07-17"
  },
  {
    id: "biz-4",
    name: "ورشة فؤاد لنجارة الحفر العربي التقليدي",
    activity: "تصميم وصناعة الأثاث التراثي والموزاييك والشرقيات الخشبية يدوياً",
    phone: "+963-932-999000",
    whatsapp: "+963932999000",
    address: "حارة المسجد الأثري، قارة القديمة",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    status: "approved",
    cardColor: "bg-stone-50/90",
    textColor: "text-stone-950",
    cardStyle: "classic",
    createdAt: "2026-07-17"
  },
  {
    id: "biz-5",
    name: "مركز القلمون لخدمات وصيانة الأجهزة الذكية والكمبيوتر",
    activity: "صيانة هاردوير وسوفتوير ومبيعات إكسسوارات الهواتف والشبكات المنزلية",
    phone: "+963-991-222333",
    whatsapp: "+963991222333",
    address: "الشارع الرئيسي المقابل لمجلس مدينة قارة",
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    status: "approved",
    cardColor: "bg-indigo-50/90",
    textColor: "text-indigo-950",
    cardStyle: "modern",
    createdAt: "2026-07-18"
  },
  {
    id: "biz-6",
    name: "مطعم ومقصف دير مار يعقوب السياحي",
    activity: "مأكولات تراثية شرقية وغربية وجلسات عائلية هادئة في أحضان الطبيعة الجبلية",
    phone: "+963-966-222888",
    whatsapp: "+963966222888",
    address: "بجانب دير مار يعقوب المقطع، جبال قارة الغربية",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    status: "approved",
    cardColor: "bg-rose-50/90",
    textColor: "text-rose-950",
    cardStyle: "heritage",
    createdAt: "2026-07-18"
  },
  {
    id: "biz-7",
    name: "صيدلية المدينة الحديثة",
    activity: "تأمين كافة الأدوية والمستلزمات الطبية وحليب الأطفال وخدمات قياس الضغط والسكري الميدانية",
    phone: "+963-988-111444",
    whatsapp: "+963988111444",
    address: "ساحة الاستقلال، بالقرب من المستوصف الصحي، قارة",
    image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    status: "approved",
    cardColor: "bg-teal-50/90",
    textColor: "text-teal-950",
    cardStyle: "simple",
    createdAt: "2026-07-18"
  },
  {
    id: "biz-8",
    name: "محلات الوردة الشامية للمنسوجات والسجاد القلموني",
    activity: "بيع الأقمشة الفاخرة والسجاد اليدوي والمطرزات التراثية المستوحاة من ثقافة القلمون",
    phone: "+963-931-555666",
    whatsapp: "+963931555666",
    address: "سوق القيصرية القديم، قارة",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    status: "approved",
    cardColor: "bg-amber-50/90",
    textColor: "text-amber-950",
    cardStyle: "classic",
    createdAt: "2026-07-18"
  },
  {
    id: "biz-9",
    name: "مخبز قارة الآلي التقليدي",
    activity: "إنتاج الخبز البلدي والمعجنات والحلويات وحلويات العيد بالدقيق الفاخر",
    phone: "+963-944-222111",
    whatsapp: "+963944222111",
    address: "بجانب الساحة العامة، قارة",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    status: "approved",
    cardColor: "bg-yellow-50/90",
    textColor: "text-yellow-950",
    cardStyle: "simple",
    createdAt: "2026-07-19"
  },
  {
    id: "biz-10",
    name: "محطة الوقود والخدمات السريعة (قارة الدولي)",
    activity: "تعبئة الوقود، غسيل وتشحيم وصيانة الإطارات على مدار 24 ساعة",
    phone: "+963-955-888999",
    whatsapp: "+963955888999",
    address: "الأوتوستراد الدولي دمشق-حمص، مفرق قارة الرئيسي",
    image: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    status: "approved",
    cardColor: "bg-slate-50/90",
    textColor: "text-slate-950",
    cardStyle: "modern",
    createdAt: "2026-07-19"
  }
];

export const INITIAL_MARKETPLACE_LISTINGS: import('../types').MarketplaceListing[] = [
  {
    id: 'mp-1',
    title: 'منظومة طاقة شمسية كاملة 5.5 كيو (إنفرتر ومبخر بطاريات ليثيوم)',
    category: 'طاقة شمسية ومولدات',
    price: '1,450 دولار',
    description: 'منظومة طاقة شمسية ممتازة بحالة جديدة، تتضمن 6 ألواح 550 واط نخب أول، إنفرتر هايبرد 5.5 كيلو واط، وبطارية ليثيوم 100 أمبير 48 فولت. جاهزة للتركيب الفوري مع كوابل حماية وسكاكين تحويل.',
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80'
    ],
    sellerName: 'المهندس أحمد القلموني',
    sellerEmail: 'ahmed.qalamoun@gmail.com',
    sellerPhone: '+963-933-445566',
    sellerLocation: 'حي الكروم، قارة',
    createdAt: '2026-07-28T14:30:00.000Z',
    status: 'active',
    comments: [
      {
        id: 'c-1',
        authorName: 'أبو عمر القاري',
        authorEmail: 'abouomar@qara.org',
        content: 'السلام عليكم، هل السعر شامل أجور التركيب والنقل داخل قارة؟',
        createdAt: '2026-07-28T16:10:00.000Z'
      },
      {
        id: 'c-2',
        authorName: 'المهندس أحمد القلموني',
        authorEmail: 'ahmed.qalamoun@gmail.com',
        content: 'وعليكم السلام، نعم التوصيل مجاني داخل قارة والتركيب مع فني مختص بتكلفة رمزية جداً.',
        createdAt: '2026-07-28T17:00:00.000Z'
      }
    ]
  },
  {
    id: 'mp-2',
    title: 'أرض زراعية مشجرة بآلاف أشجار الكرز والمشمش القلموني',
    category: 'عقارات',
    price: 'قابل للتفاوض',
    description: 'أرض زراعية خصبة بمساحة 12 دونم تقع في أراضي قارة الزراعية، تحتوي على بئر ماء وشبكة ري بالتنقيط حديثة، مشجرة كرز ومشمش قلموني منتج بأعلى جودة. الملكية طابو أخضر نظامي 2400 سهم.',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80'
    ],
    sellerName: 'أبو يوسف الشامي',
    sellerEmail: 'yousef.shami@gmail.com',
    sellerPhone: '+963-944-778899',
    sellerLocation: 'منطقة المزارع، قارة',
    createdAt: '2026-07-27T09:15:00.000Z',
    status: 'active',
    comments: []
  },
  {
    id: 'mp-3',
    title: 'سيارة هيونداي فيرنا بحالة الفابريكة خالية العلام',
    category: 'سيارات ومحركات',
    price: '42,000,000 ل.س',
    description: 'سيارة هيونداي فيرنا موديل 2008، محرك 1600cc خالية من الداخل والخارج، غيار أوتوماتيك، شاشة وكاميرا خلفية، مكيف جليد، جاهزية 100% ولا تحتاج لأي مصروف.',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
    ],
    sellerName: 'خالد الزين',
    sellerEmail: 'khaled.zain@yahoo.com',
    sellerPhone: '+963-988-223344',
    sellerLocation: 'شارع الجلاء، قارة',
    createdAt: '2026-07-26T18:45:00.000Z',
    status: 'active',
    comments: []
  }
];



