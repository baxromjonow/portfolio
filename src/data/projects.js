// ─────────────────────────────────────────────────────────────
//  BARCHA LOYIHALAR SHU YERDA.
//  Yangi loyiha qo'shish: shu ro'yxatga bitta obyekt qo'shing.
//
//  id        — qisqa nom (URL: baxromjonov.uz/#ish-<id>)
//  preview   — kartadagi jonli mini-ko'rinish turi (src/components/Preview.jsx)
//  image     — ixtiyoriy haqiqiy skrinshot: "/shots/qr.webp" kabi.
//              Fayl public/shots/ ichida bo'lsa, mini-ko'rinish o'rniga rasm chiqadi.
//  url       — jonli manzil (bo'lmasa null)
//  featured  — true bo'lsa "Tanlangan ishlar" 3D galereyasiga chiqadi
// ─────────────────────────────────────────────────────────────

export const categories = [
  { id: "all", label: "Hammasi" },
  { id: "web", label: "Web ilovalar" },
  { id: "alaziz", label: "Al-Aziz platformalari" },
  { id: "bot", label: "Telegram botlar" },
];

export const projects = [
  {
    id: "deploy",
    title: "Al-Aziz Deploy",
    kicker: "Student Cloud",
    category: "alaziz",
    preview: "deploy",
    image: "/shots/deploy-d.webp",
    mobile: "/shots/deploy-m.webp",
    featured: true,
    url: "https://deploy.alazizacademychinoz.uz",
    domain: "deploy.alazizacademychinoz.uz",
    accent: "#0F4C3A",
    summary:
      "«G‘oyangiz. Kodingiz. Endi online.» O‘quvchi ZIP yoki papkani yuklaydi, sayti esa o‘z subdomenida darhol ishga tushadi. Darsda yozilgan kod shu kunning o‘zida internetda turadi.",
    features: [
      "ZIP yoki papka yuklash, har bir loyihaga *.student subdomen",
      "HTML/CSS/JS, React/Vite dist, CRA build, SPA routing",
      "Yangi versiya yuklansa ham manzil o‘zgarmaydi",
      "Google bilan kirish, o‘quvchi kabineti, deploy log",
      "Limitlar: 60 MB upload, 3000 fayl, 1 GB joy",
    ],
    stack: ["Node.js", "Docker", "Nginx", "Cloudflare Tunnel", "Wildcard DNS"],
  },
  {
    id: "lms",
    title: "Al-Aziz LMS",
    kicker: "Chinoz filiali o‘quv tizimi",
    category: "alaziz",
    preview: "lms",
    featured: true,
    url: "https://lms.alazizacademychinoz.uz",
    domain: "lms.alazizacademychinoz.uz",
    accent: "#22819A",
    summary:
      "Noldan qurilgan o‘quv platformasi: guruhlar, video darslar, uy vazifalari va ustoz baholashi bitta joyda.",
    features: [
      "12 darslik bloklar, ustoz darsni guruhga o‘zi ochadi",
      "To‘lov belgisi: to‘lanmagan o‘quvchi uchun dars yopiladi",
      "Uy vazifasi platformada topshiriladi va baholanadi",
      "Davomat va baholar jurnali, reyting, e’lonlar",
      "Kunduzgi «Teal» va tungi «Frozen» ranglar",
    ],
    stack: ["Next.js", "PostgreSQL", "Docker", "Nginx"],
  },
  {
    id: "qr",
    title: "Asadbek QR",
    kicker: "QR Studio · Precision QR Engine",
    category: "web",
    preview: "qr",
    image: "/shots/qr-d.webp",
    mobile: "/shots/qr-m.webp",
    featured: true,
    url: "https://qr.baxromjonov.uz",
    domain: "qr.baxromjonov.uz",
    accent: "#6E7BFF",
    summary:
      "«Bir qarashda premium. Bir skanda ochiladi.» QR kod brauzerning o‘zida yaratiladi, ma’lumot serverga yuborilmaydi. Natija chop etishga tayyor 2048 yoki 4096 px PNG.",
    features: [
      "7 xil tur: havola, Wi-Fi, Telegram, Instagram, telefon, email, matn",
      "Brauzerda yaratiladi, ma’lumot serverga ketmaydi",
      "QR rangi va fonini tanlash, jonli preview",
      "2048 / 4096 px PNG, xatoga chidamlilik darajasi High",
    ],
    stack: ["Next.js", "Redis", "PostgreSQL", "Docker"],
  },
  {
    id: "type",
    title: "Asadbek Type",
    kicker: "Tez yozish trenajyori",
    category: "web",
    preview: "type",
    image: "/shots/type-d.webp",
    mobile: "/shots/type-m.webp",
    featured: true,
    url: "https://type.baxromjonov.uz",
    domain: "type.baxromjonov.uz",
    accent: "#F5C518",
    summary:
      "Monkeytype uslubidagi klaviatura trenajyori. O‘zbek, ingliz va rus tilidagi so‘zlar bilan tezlik va aniqlikni o‘yin kabi oshiradi.",
    features: [
      "3 til: UZ / EN / RU",
      "15, 30, 60 va 120 soniyalik rejimlar",
      "WPM, RAW, aniqlik, xatolar va eng yaxshi natija",
      "5 xil rang mavzusi, Tab / Esc bilan qayta boshlash",
      "Telefon va kompyuterda ishlaydi",
    ],
    stack: ["React", "Vite"],
  },
  {
    id: "bunker",
    title: "Bunker",
    kicker: "Digital board game · V5 beta",
    category: "web",
    preview: "bunker",
    image: "/shots/bunker-d.webp",
    mobile: "/shots/bunker-m.webp",
    featured: true,
    url: "https://bunker.baxromjonov.uz",
    domain: "bunker.baxromjonov.uz",
    accent: "#F7C948",
    summary:
      "«Convince. Vote. Survive.» Ingliz tilida o‘ynaladigan ijtimoiy omon qolish o‘yini: yashirin dosyelar, maxfiy ovoz berish va surgun. Darsda speaking mashqi uchun ishlataman.",
    features: [
      "Xona yaratish va kod bilan qo‘shilish",
      "Yashirin dosyelar, maxfiy ovoz berish, surgun",
      "Basic va Survival Story rejimlari",
      "Server-authoritative: o‘yin mantig‘i serverda",
      "Chop etiladigan A4 kartalar to‘plami",
    ],
    stack: ["React", "Node.js", "WebSocket", "PostgreSQL", "Redis", "Docker"],
  },
  {
    id: "arena",
    title: "Student Arena",
    kicker: "Bilim ol. Bellash. Lider bo‘l.",
    category: "web",
    preview: "arena",
    image: "/shots/arena-d.webp",
    mobile: "/shots/arena-m.webp",
    featured: true,
    url: "https://arena.baxromjonov.uz",
    domain: "arena.baxromjonov.uz",
    accent: "#3B82F6",
    summary:
      "Al-Aziz Academy Chinoz o‘quvchilari uchun bellashuv maydoni. Quizlar, XP, level va reyting orqali har bir natija ko‘rinib turadi.",
    features: [
      "Quizlar, javobga darhol natija",
      "XP, level va umumiy reyting",
      "O‘quvchi o‘zi ro‘yxatdan o‘tadi",
      "UZ / RU / EN",
    ],
    stack: ["React", "TypeScript", "Prisma", "PostgreSQL", "Docker"],
  },
  {
    id: "note",
    title: "Asadbek Notes",
    kicker: "Learn less. Remember more.",
    category: "web",
    preview: "note",
    image: "/shots/note-d.webp",
    mobile: "/shots/note-m.webp",
    featured: true,
    url: "https://note.baxromjonov.uz",
    domain: "note.baxromjonov.uz",
    accent: "#A7F3C0",
    summary:
      "Kurs ham, darslik ham emas: o‘qiganlarni bir qarashda eslab olish uchun shaxsiy bilim kutubxonasi. Qisqa izohlar va jonli sxemalar.",
    features: [
      "85 ta qisqa konspekt, 5 yo‘nalish",
      "English 44 · HTML 9 · CSS 9 · JavaScript 11 · React 12",
      "Ctrl + K qidiruv, saqlanganlar, oxirgi ko‘rilganlar",
      "Ko‘rib chiqilgan mavzular bo‘yicha progress",
    ],
    stack: ["React", "Vite", "Docker"],
  },
  {
    id: "shop-api",
    title: "Online Shop API",
    kicker: "O‘quvchilar uchun backend",
    category: "web",
    preview: "api",
    featured: true,
    url: "https://shopbackend.baxromjonov.uz",
    domain: "shopbackend.baxromjonov.uz",
    accent: "#64D2FF",
    summary:
      "Onlayn do‘kon backendi. O‘quvchilar frontendni real API ga ulab, mahsulot, kategoriya va buyurtma bilan ishlashni o‘rganadi.",
    features: [
      "/api/auth: ro‘yxatdan o‘tish va kirish",
      "/api/products va /api/categories",
      "/api/orders: buyurtmalar",
      "Render’dan o‘z serverimga ko‘chirildi",
    ],
    stack: ["Express", "JSON", "Docker"],
  },
  {
    id: "learn",
    title: "Al-Aziz Learn",
    kicker: "Elektron darslik platformasi",
    category: "alaziz",
    preview: "learn",
    featured: false,
    url: null,
    domain: "ichki platforma",
    accent: "#2E6BFF",
    summary:
      "O‘quvchi va adminlar uchun raqamli darslik: darslar, baholash va boshqaruv. Mobil uchun birinchi navbatda qurilgan.",
    features: [
      "O‘quvchi kabineti, darslar, baholash",
      "UZ / RU / EN, kunduzgi va tungi rejim",
      "Migratsiyalarda baza va fayllar saqlanadi",
    ],
    stack: ["Next.js", "Tailwind", "PostgreSQL", "Docker"],
  },

  // ── Telegram botlar ──
  {
    id: "feedback-bot",
    title: "Rahbarga murojaat",
    kicker: "Anonim murojaatlar boti",
    category: "bot",
    preview: "bot",
    bot: {
      lines: [
        ["in", "Assalomu alaykum! Murojaatingizni yozing. Ismingiz ko‘rsatilmaydi."],
        ["out", "Kompyuter xonasida Wi-Fi sekin ishlayapti"],
        ["in", "Qabul qilindi ✓ Holat: ko‘rib chiqilmoqda"],
      ],
    },
    url: "https://t.me/alaziz_raxbarga_murojaat_bot",
    domain: "@alaziz_raxbarga_murojaat_bot",
    accent: "#2AABEE",
    summary:
      "O‘quvchi va xodimlar rahbariyatga anonim yozadi. Adminlar holatni o‘zgartiradi va javob beradi.",
    features: [
      "O‘quvchi va xodimlar uchun alohida havolalar",
      "Shaxsiy ma’lumot oddiy adminlardan yashirin",
      "Superadmin harakatlari audit-logga yoziladi",
    ],
    stack: ["Telegram Bot API", "Node.js"],
  },
  {
    id: "attendance-bot",
    title: "Davomat boti",
    kicker: "Hikvision → Telegram",
    category: "bot",
    preview: "bot",
    bot: {
      lines: [
        ["in", "🟢 KELDI · 08:52 · Aliyev Ali"],
        ["in", "🟢 KELDI · 08:57 · Karimova Madina"],
        ["in", "🔴 KETDI · 17:04 · Aliyev Ali"],
      ],
    },
    url: null,
    domain: "ichki bot",
    accent: "#30D158",
    summary:
      "Kirish terminalidagi har bir kirish-chiqish guruhdagi DAVOMAT bo‘limiga vaqt va rasm bilan tushadi.",
    features: [
      "Kunning birinchi KELDI / KETDI hodisasi",
      "Takrorlar filtrlanadi",
      "Qurilma snapshot rasmi bilan",
    ],
    stack: ["Hikvision ISAPI", "Telegram Bot API"],
  },
  {
    id: "quiz-bot",
    title: "Quiz bot",
    kicker: "Har kuni 3 ta savol",
    category: "bot",
    preview: "bot",
    bot: {
      lines: [
        ["in", "09:00 · Bugungi savol: <div> qaysi turdagi element?"],
        ["out", "Block element"],
        ["in", "To‘g‘ri! 🔥 Seriya: 6 kun · Daraja: Pro"],
      ],
    },
    url: null,
    domain: "guruh boti",
    accent: "#FF9F0A",
    summary:
      "Guruhlarga haftada 6 kun, har kuni soat 09:00 da 3 ta savol. HTML/CSS/JS va kompyuter savodxonligi.",
    features: [
      "Excel’dan savollar importi",
      "Variantlar aralashtiriladi, savollar takrorlanmaydi",
      "Statistika va darajalar",
    ],
    stack: ["Telegram Bot API", "Cron"],
  },
  {
    id: "mentor-bot",
    title: "Mentor reyting boti",
    kicker: "Ustozlar reytingi va sertifikatlar",
    category: "bot",
    preview: "bot",
    bot: {
      lines: [
        ["in", "Ustozingizni baholang ⭐️⭐️⭐️⭐️⭐️"],
        ["out", "⭐️⭐️⭐️⭐️⭐️"],
        ["in", "Rahmat! Sertifikat tayyor 📄"],
      ],
    },
    url: null,
    domain: "ichki bot",
    accent: "#FFD60A",
    summary: "Mentorlarni baholash va sertifikat chiqarish uchun bot. 20 ga yaqin versiyadan o‘tgan.",
    features: ["Baholash va reyting", "Sertifikat generatsiyasi"],
    stack: ["Go", "Telegram Bot API"],
  },
];

export const featured = projects.filter((p) => p.featured);
export const bots = projects.filter((p) => p.category === "bot");

// O'quvchilar loyihalari (public/student-projects ichida)
export const studentProjects = [
  { id: "natureeee", title: "Technology & Nature", type: "Landing page", tech: ["HTML", "CSS", "Responsive"] },
  { id: "nike", title: "Nike", type: "Mahsulot sayti", tech: ["HTML", "CSS", "Media Query"] },
  { id: "totembo", title: "TOTEMBO", type: "Onlayn katalog", tech: ["HTML", "CSS", "Grid"] },
  { id: "vue-cinema", title: "Vue Cinema", type: "Kino platformasi", tech: ["HTML", "CSS", "Video"] },
  { id: "silver-house", title: "Silver House", type: "Ko‘chmas mulk", tech: ["HTML", "CSS", "Responsive"] },
].map((p) => ({ ...p, url: `/student-projects/${p.id}/index.html` }));

export const socials = [
  { id: "telegram", label: "Telegram", handle: "@asadbek_baxromjonov", href: "https://t.me/asadbek_baxromjonov" },
  { id: "channel", label: "Kanal", handle: "@chinoz_dasturlash", href: "https://t.me/chinoz_dasturlash" },
  { id: "instagram", label: "Instagram", handle: "@asadbekbw", href: "https://www.instagram.com/asadbekbw/" },
  { id: "github", label: "GitHub", handle: "baxromjonow", href: "https://github.com/baxromjonow" },
];
