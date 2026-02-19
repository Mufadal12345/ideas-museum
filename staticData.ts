import { Quote, Course, Idea } from '../types';

const AUTHOR_NAME = 'MUF';
const AUTHOR_ROLE = 'admin';
const AUTHOR_ID = 'muf_official';

// Helper to generate dates
const getDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
};

// --- 1. عبارات ملهمة (30 عنصر) ---
export const STATIC_QUOTES: Quote[] = [
    { text: "لا تطلب السرعة في العمل بل اطلب التجويد، فإن الناس لا يسألون في كم فرغ من العمل، بل ينظرون إلى إتقانه.", author: "أفلاطون" },
    { text: "العقل ليس وعاءً يجب ملؤه، ولكنه نار يجب إيقادها.", author: "بلوتارك" },
    { text: "الرأي هو شيء وسط بين العلم والجهل.", author: "أرسطو" },
    { text: "اطلب العلم من المهد إلى اللحد، فإن الفكر لا يشيخ.", author: "حكمة عربية" },
    { text: "أنا أفكر، إذن أنا موجود.", author: "رينيه ديكارت" },
    { text: "المعرفة قوة.", author: "فرانسيس بيكون" },
    { text: "كلما ازددت علماً، ازداد إحساسي بجهلي.", author: "أينشتاين" },
    { text: "لا يكفي أن يكون لديك عقل جيد، المهم هو أن تستخدمه جيداً.", author: "ديكارت" },
    { text: "الإنسان عدو ما يجهل.", author: "علي بن أبي طالب" },
    { text: "في المعرفة، كما في السباحة، من لا يتقدم يغرق.", author: "مثل صيني" },
    { text: "القراءة تمد العقل فقط بلوازم المعرفة، أما التفكير فيجعلنا نملك ما نقرأ.", author: "جون لوك" },
    { text: "التعليم هو السلاح الأقوى الذي يمكنك استخدامه لتغيير العالم.", author: "نيلسون مانديلا" },
    { text: "قطرة المطر تحفر في الصخر، ليس بالعنف ولكن بالتكرار.", author: "أوفيد" },
    { text: "الحكمة هي ملخص الماضي، والجمال هو وعد المستقبل.", author: "أوليفر هولمز" },
    { text: "ليس العار في أن نسقط، ولكن العار أن لا نستطيع النهوض.", author: "مثل" },
    { text: "من لم يذق مر التعلم ساعة، تجرع ذل الجهل طول حياته.", author: "الشافعي" },
    { text: "قمة الجبل ليست إلا القاع لجبل آخر.", author: "جبران خليل جبران" },
    { text: "التفكير هو أصعب عمل يوجد، وهذا هو السبب المحتمل لقلة من يمارسونه.", author: "هنري فورد" },
    { text: "الخيال أهم من المعرفة.", author: "أينشتاين" },
    { text: "لا تبحث عن الأخطاء، ابحث عن العلاج.", author: "هنري فورد" },
    { text: "العبقرية هي واحد بالمئة إلهام، وتسعة وتسعون بالمئة جهد وعرق.", author: "توماس إديسون" },
    { text: "إذا أردت أن تفهم الحاضر، فدرس الماضي.", author: "كونفوشيوس" },
    { text: "أفضل طريقة للتنبؤ بالمستقبل هي اختراعه.", author: "آلان كاي" },
    { text: "الجمال يوقظ الروح للعمل.", author: "دانتي أليغييري" },
    { text: "الفن يمسح عن الروح غبار الحياة اليومية.", author: "بيكاسو" },
    { text: "الحرية هي الحق في أن تقول للناس ما لا يريدون سماعه.", author: "جورج أورويل" },
    { text: "لا يوجد طريق للسعادة، السعادة هي الطريق.", author: "غاندي" },
    { text: "التغيير هو القانون الوحيد الثابت في الحياة.", author: "هيراقليدس" },
    { text: "النجاح ليس نهائياً، والفشل ليس قاتلاً: الشجاعة على الاستمرار هي ما يهم.", author: "تشرشل" },
    { text: "كن التغيير الذي تريد أن تراه في العالم.", author: "غاندي" }
].map((q, i) => ({
    id: `static_quote_${i}`,
    text: q.text,
    author: q.author,
    addedBy: AUTHOR_NAME,
    isDefault: true,
    createdAt: getDate(i)
}));

// --- 2. مصادر تعلم (20 عنصر) ---
export const STATIC_COURSES: Course[] = [
    { title: 'CS50: علوم الحاسب', type: 'كورس أونلاين', link: 'https://pll.harvard.edu/course/cs50', desc: 'مقدمة هارفارد الشهيرة في علوم الحاسب والبرمجة.' },
    { title: 'Elzero Web School', type: 'قناة يوتيوب', link: 'https://www.youtube.com/c/ElzeroInfo', desc: 'المسار الشامل لتعلم تطوير الويب باللغة العربية.' },
    { title: 'Coursera', type: 'منصة تعليمية', link: 'https://www.coursera.org', desc: 'دورات من أفضل جامعات العالم في شتى المجالات.' },
    { title: 'EdX', type: 'منصة تعليمية', link: 'https://www.edx.org', desc: 'تعلم من هارفارد وMIT وغيرهم مجاناً.' },
    { title: 'Khan Academy', type: 'منصة تعليمية', link: 'https://www.khanacademy.org', desc: 'دروس مجانية في الرياضيات والعلوم والاقتصاد.' },
    { title: 'Crash Course', type: 'قناة يوتيوب', link: 'https://www.youtube.com/user/crashcourse', desc: 'شرح مبسط للتاريخ، العلوم، الفلسفة، والأدب.' },
    { title: 'TED', type: 'منصة تعليمية', link: 'https://www.ted.com', desc: 'أفكار تستحق الانتشار ومحادثات ملهمة.' },
    { title: 'Duolingo', type: 'منصة تعليمية', link: 'https://www.duolingo.com', desc: 'تعلم اللغات بطريقة ممتعة وتفاعلية.' },
    { title: 'Udemy', type: 'منصة تعليمية', link: 'https://www.udemy.com', desc: 'أكبر مكتبة للكورسات العملية في العالم.' },
    { title: 'MIT OpenCourseWare', type: 'كورس أونلاين', link: 'https://ocw.mit.edu', desc: 'مواد دراسية من معهد ماساتشوستس للتكنولوجيا.' },
    { title: 'Project Gutenberg', type: 'كتب', link: 'https://www.gutenberg.org', desc: 'مكتبة تضم أكثر من 60 ألف كتاب مجاني.' },
    { title: 'Goodreads', type: 'كتب', link: 'https://www.goodreads.com', desc: 'مجتمع للقراء ومراجعات الكتب.' },
    { title: 'Google Arts & Culture', type: 'فن', link: 'https://artsandculture.google.com', desc: 'جولات افتراضية في متاحف العالم.' },
    { title: 'Behance', type: 'فن', link: 'https://www.behance.net', desc: 'استلهم من أعمال المصممين المبدعين حول العالم.' },
    { title: 'Stanford Encyclopedia of Philosophy', type: 'مقالات', link: 'https://plato.stanford.edu', desc: 'المرجع الأول في الفلسفة الأكاديمية.' },
    { title: 'Investopedia', type: 'مقالات', link: 'https://www.investopedia.com', desc: 'كل ما تحتاج معرفته عن الاقتصاد والاستثمار.' },
    { title: 'National Geographic', type: 'علوم', link: 'https://www.nationalgeographic.com', desc: 'استكشف الطبيعة والعلوم والتاريخ.' },
    { title: 'NASA', type: 'علوم', link: 'https://www.nasa.gov', desc: 'آخر اكتشافات الفضاء والكون.' },
    { title: 'Medium', type: 'مقالات', link: 'https://medium.com', desc: 'مقالات متنوعة من كتاب ومفكرين مستقلين.' },
    { title: 'ArXiv', type: 'مقالات', link: 'https://arxiv.org', desc: 'أوراق بحثية علمية في الفيزياء والرياضيات وعلوم الحاسب.' }
].map((c, i) => ({
    id: `static_course_${i}`,
    title: c.title,
    type: c.type,
    description: c.desc,
    link: c.link,
    preview: undefined,
    addedBy: AUTHOR_NAME,
    addedByRole: AUTHOR_ROLE,
    createdAt: getDate(i * 2),
    likes: 100 + i * 15,
    likedBy: [],
    views: 500 + i * 50
}));

// --- 3. توليد 1000 مقال وفكرة (تنظيف المحتوى) ---

const DB_TOPICS = [
    { term: 'الذكاء الاصطناعي', cat: 'تقنية' },
    { term: 'الفلسفة الرواقية', cat: 'فلسفة' },
    { term: 'البلوك تشين', cat: 'تقنية' },
    { term: 'الفيزياء الكمومية', cat: 'علوم' },
    { term: 'الأدب الروسي', cat: 'أدب' },
    { term: 'عصر النهضة', cat: 'فن' },
    { term: 'علم النفس السلوكي', cat: 'اجتماع' },
    { term: 'التغير المناخي', cat: 'علوم' },
    { term: 'الميتافيرس', cat: 'تقنية' },
    { term: 'الوجودية', cat: 'فلسفة' },
    { term: 'الأمن السيبراني', cat: 'تقنية' },
    { term: 'تحرير الجينات', cat: 'علوم' },
    { term: 'الفن التجريدي', cat: 'فن' },
    { term: 'الاقتصاد الكلي', cat: 'اجتماع' },
    { term: 'الرواية الحديثة', cat: 'أدب' },
    { term: 'الخوارزميات', cat: 'تقنية' },
    { term: 'علم الاجتماع', cat: 'اجتماع' },
    { term: 'الثقوب السوداء', cat: 'علوم' },
    { term: 'العمارة الإسلامية', cat: 'فن' },
    { term: 'الشعر الجاهلي', cat: 'أدب' },
    { term: 'إنترنت الأشياء', cat: 'تقنية' },
    { term: 'الأخلاق النفعية', cat: 'فلسفة' },
    { term: 'الطاقة المتجددة', cat: 'علوم' },
    { term: 'السينما العالمية', cat: 'فن' },
    { term: 'النقد الأدبي', cat: 'أدب' },
    { term: 'الحوسبة السحابية', cat: 'تقنية' },
    { term: 'نظرية المعرفة', cat: 'فلسفة' },
    { term: 'علم الأعصاب', cat: 'علوم' },
    { term: 'التصوير الفوتوغرافي', cat: 'فن' },
    { term: 'الأنثروبولوجيا', cat: 'اجتماع' },
    { term: 'البيانات الضخمة', cat: 'تقنية' },
    { term: 'المنطق الصوري', cat: 'فلسفة' },
    { term: 'استكشاف الفضاء', cat: 'علوم' },
    { term: 'المسرح التجريبي', cat: 'أدب' },
    { term: 'التسويق الرقمي', cat: 'اجتماع' },
    { term: 'الروبوتات', cat: 'تقنية' },
    { term: 'ما بعد الحداثة', cat: 'فلسفة' },
    { term: 'الكيمياء الحيوية', cat: 'علوم' },
    { term: 'فن الخط العربي', cat: 'فن' },
    { term: 'أدب السجون', cat: 'أدب' },
    { term: 'نظرية الألعاب', cat: 'اجتماع' },
    { term: 'النانو تكنولوجي', cat: 'تقنية' },
    { term: 'الأدب المقارن', cat: 'أدب' },
    { term: 'تاريخ الحضارات', cat: 'اجتماع' },
    { term: 'التصميم الجرافيكي', cat: 'فن' }
];

const TEMPLATES = [
    "مستقبل {0} في القرن الحادي والعشرين",
    "تاريخ {0}: رحلة عبر الزمن",
    "أهمية {0} في حياتنا اليومية",
    "تحديات {0} والفرص المتاحة",
    "مدخل شامل إلى عالم {0}",
    "كيف يغير {0} وجه العالم؟",
    "دراسة تحليلية في مفاهيم {0}",
    "{0} بين النظرية والتطبيق",
    "حقائق مذهلة عن {0} يجب أن تعرفها",
    "تأثير {0} على المجتمع البشري",
    "أخلاقيات {0}: نظرة نقدية",
    "تطور {0} عبر العصور",
    "علاقة {0} بالعلوم الأخرى",
    "لماذا يجب عليك تعلم {0}؟",
    "خرافات وحقائق حول {0}",
    "أبرز رواد {0} وإنجازاتهم",
    "فلسفة {0} وأبعادها المعرفية",
    "جماليات {0} في العصر الحديث",
    "مخاطر وفوائد {0}",
    "رؤية جديدة لمفهوم {0}",
    "أساسيات {0} للمبتدئين",
    "تعقيدات {0} بأسلوب مبسط",
    "هل {0} هو الحل لمشاكلنا؟",
    "حوارات حول {0} والجدل القائم",
    "تطبيقات {0} العملية في الواقع"
];

const generateContent = (): Idea[] => {
    const items: Idea[] = [];
    const targetCount = 1000;
    
    for (let i = 0; i < targetCount; i++) {
        const topic = DB_TOPICS[i % DB_TOPICS.length];
        const templateIndex = (i + Math.floor(i / DB_TOPICS.length)) % TEMPLATES.length; 
        const mixedTemplate = TEMPLATES[templateIndex];
        const title = mixedTemplate.replace("{0}", topic.term);
        
        // Vary content length for UX testing
        const contentBody = `إن دراسة "${topic.term}" تفتح آفاقاً واسعة لفهم تقاطعات المعرفة في عصرنا الراهن. يتناول هذا المقال التحليلي كيف أثر "${topic.term}" على مسار التطور الإنساني، مع التركيز على الجوانب الأخلاقية والعملية التي تمس حياتنا اليومية.\n\nمن خلال البحث في أصول "${topic.term}"، نجد أنه يمثل حجر زاوية في فهمنا لـ ${topic.cat}. يهدف متحف الفكر من خلال هذا الطرح إلى تعميق الوعي الجماهيري حول التحديات والفرص التي يفرضها هذا المفهوم على مستقبل الحضارة.\n\nإننا مدعوون اليوم لإعادة قراءة المفاهيم التقليدية لـ "${topic.term}" برؤية نقدية معاصرة، تستوعب المتغيرات التقنية والاجتماعية المتسارعة. هذا التحليل هو جزء من مبادرة MUF لإثراء المحتوى المعرفي العربي الراقي.`;

        items.push({
            id: `static_muf_${i}`,
            title: title,
            category: topic.cat,
            content: contentBody,
            author: AUTHOR_NAME,
            authorId: AUTHOR_ID,
            authorRole: AUTHOR_ROLE,
            views: 100 + (i * 13) % 2000,
            likes: 20 + (i * 7) % 600,
            likedBy: '',
            featured: i % 25 === 0,
            deleted: false,
            createdAt: getDate(i % 365)
        });
    }
    return items;
}

export const STATIC_CONTENT: Idea[] = generateContent();
