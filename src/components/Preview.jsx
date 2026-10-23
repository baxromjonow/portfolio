import { memo, useMemo } from "react";

// Har bir loyiha uchun kod bilan chizilgan "jonli" mini-ko'rinish.
// Animatsiyalar faqat ota elementda .is-live klassi bo'lganda yuradi (ekranda ko'rinsa).

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function QR() {
  const cells = useMemo(() => {
    const n = 25;
    const rnd = seeded(20251);
    const out = [];
    const inFinder = (x, y) =>
      (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        if (inFinder(x, y)) continue;
        if (rnd() > 0.52) out.push([x, y]);
      }
    return out;
  }, []);
  const finder = (x, y) => (
    <g key={`${x}-${y}`} className="qr-finder">
      <rect x={x} y={y} width="7" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x={x + 2} y={y + 2} width="3" height="3" rx=".8" fill="currentColor" />
    </g>
  );
  return (
    <div className="pv pv-qr">
      <div className="pv-qr-side">
        {["Link", "Wi-Fi", "Telegram", "Instagram", "Email", "Matn"].map((t, i) => (
          <span key={t} className={i === 1 ? "on" : ""}>{t}</span>
        ))}
      </div>
      <div className="pv-qr-code">
        <svg viewBox="-1.5 -1.5 28 28" aria-hidden="true">
          {finder(0.5, 0.5)}
          {finder(17.5, 0.5)}
          {finder(0.5, 17.5)}
          {cells.map(([x, y], i) => (
            <rect key={i} x={x} y={y} width=".92" height=".92" rx=".3" style={{ "--d": `${(i % 37) * 28}ms` }} />
          ))}
        </svg>
        <i className="pv-scan" />
      </div>
      <div className="pv-qr-meta">
        <b>CHINOZ_WIFI</b>
        <span>PNG · 4096 px</span>
        <em>Yuklab olish</em>
      </div>
    </div>
  );
}

function TypeP() {
  return (
    <div className="pv pv-type">
      <div className="pv-type-top">
        <span>wpm <b>72</b></span>
        <span>acc <b>98%</b></span>
        <span className="pv-type-time">0:24</span>
      </div>
      <div className="pv-type-text">
        <p data-text="kod yozish ham san'at, har bir harf o'z joyida turishi kerak">
          kod yozish ham san'at, har bir harf o'z joyida turishi kerak
        </p>
      </div>
      <div className="pv-type-themes">
        <i style={{ background: "#381932" }} />
        <i style={{ background: "#741a2f" }} />
        <i style={{ background: "#ffc6a8" }} />
        <i style={{ background: "#fff3e6" }} />
      </div>
    </div>
  );
}

function Bunker() {
  const cards = [
    ["PROFESSION", "Doctor", "Argue why the group needs you."],
    ["SKILL", "Fluent in 3 languages", "Explain how it helps survival."],
    ["SECRET", "Afraid of the dark", "Defend yourself in 30 seconds."],
  ];
  return (
    <div className="pv pv-bunker">
      <div className="pv-bunker-timer">
        <span>SPEAKING</span>
        <b>00:30</b>
      </div>
      <div className="pv-bunker-stack">
        {cards.map(([k, v, t], i) => (
          <div key={k} className="pv-bcard" style={{ "--i": i }}>
            <span>{k}</span>
            <b>{v}</b>
            <p>{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Arena() {
  const rows = [
    ["Madina", 96],
    ["Sardor", 88],
    ["Javohir", 81],
    ["Malika", 74],
    ["Bekzod", 63],
  ];
  return (
    <div className="pv pv-arena">
      <div className="pv-arena-q">
        <span>12 / 20 · CSS</span>
        <b>Flexbox’da elementlarni markazga qaysi xususiyat tekislaydi?</b>
        <ul>
          <li>text-align</li>
          <li className="ok">justify-content</li>
          <li>float</li>
        </ul>
      </div>
      <ol className="pv-arena-board">
        {rows.map(([n, s], i) => (
          <li key={n} style={{ "--w": `${s}%`, "--i": i }}>
            <span>{i + 1}</span>
            <em>{n}</em>
            <i />
            <b>{s}</b>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Ielts() {
  const parts = [
    ["Listening", 8],
    ["Reading", 7.5],
    ["Writing", 6.5],
    ["Speaking", 7],
  ];
  return (
    <div className="pv pv-ielts">
      <div className="pv-ielts-band">
        <span>Overall band</span>
        <b>7.5</b>
      </div>
      <div className="pv-ielts-parts">
        {parts.map(([n, s], i) => (
          <div key={n} style={{ "--w": `${(s / 9) * 100}%`, "--i": i }}>
            <span>{n}</span>
            <i />
            <b>{s}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function Store() {
  const items = [
    ["Oversize hoodie", "349 000", "M4 10 L10 5 L14 7 Q16 9 18 7 L22 5 L28 10 L25 14 L23 13 L23 27 L9 27 L9 13 L7 14 Z"],
    ["Basic tee", "149 000", "M5 9 L11 5 Q16 8 21 5 L27 9 L24 13 L22 12 L22 27 L10 27 L10 12 L8 13 Z"],
    ["Cargo pants", "289 000", "M10 4 L22 4 L24 28 L18 28 L16 12 L14 28 L8 28 Z"],
    ["Cap", "99 000", "M6 20 Q6 10 16 10 Q26 10 26 20 Z M26 20 L31 21 L26 22 Z"],
  ];
  return (
    <div className="pv pv-store">
      <div className="pv-store-top">
        <b>STARBOY</b>
        <span>Yangi kolleksiya</span>
      </div>
      <div className="pv-store-grid">
        {items.map(([n, p, d], i) => (
          <div key={n} className="pv-store-item" style={{ "--i": i }}>
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d={d} />
            </svg>
            <span>{n}</span>
            <b>{p} so‘m</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function Note() {
  return (
    <div className="pv pv-note">
      <aside>
        <span className="on">Bugun</span>
        <span>Darslar</span>
        <span>G‘oyalar</span>
        <span>Server</span>
      </aside>
      <div className="pv-note-page">
        <b>9-B guruh · Flexbox</b>
        <i style={{ "--w": "92%" }} />
        <i style={{ "--w": "78%" }} />
        <i style={{ "--w": "85%" }} />
        <i style={{ "--w": "40%" }} />
        <div className="pv-note-check">
          <span>☑ Uy vazifasini tekshirish</span>
          <span>☐ Quiz savollari</span>
        </div>
      </div>
    </div>
  );
}

function Api() {
  const lines = [
    ["k", "GET"], ["p", " /api/products"],
    ["br"],
    ["s", "200 OK"], ["d", " · application/json"],
    ["br"], ["br"],
    ["d", "[{"], ["br"],
    ["d", "  "], ["k", "\"name\""], ["d", ": "], ["s", "\"iPhone 15\""], ["d", ","], ["br"],
    ["d", "  "], ["k", "\"price\""], ["d", ": "], ["n", "9500000"], ["d", ","], ["br"],
    ["d", "  "], ["k", "\"categoryId\""], ["d", ": "], ["s", "\"phones\""], ["d", ","], ["br"],
    ["d", "  "], ["k", "\"stock\""], ["d", ": "], ["n", "10"], ["d", ","], ["br"],
    ["d", "  "], ["k", "\"featured\""], ["d", ": "], ["n", "true"], ["br"],
    ["d", "}]"],
  ];
  return (
    <div className="pv pv-api">
      <div className="pv-api-eps">
        <b>Online Shop API 🚀</b>
        {["/api/auth", "/api/products", "/api/categories", "/api/orders"].map((e, i) => (
          <span key={e} className={i === 1 ? "on" : ""}>{e}</span>
        ))}
      </div>
      <pre>
        {lines.map(([t, v], i) => (t === "br" ? <br key={i} /> : <span key={i} className={`c-${t}`}>{v}</span>))}
      </pre>
    </div>
  );
}

function Deploy() {
  const steps = [
    "ali-portfolio.zip yuklandi · 4.2 MB",
    "Xavfsizlik tekshiruvi ✓",
    "Fayllar ochildi · 38 ta",
    "Konteyner ishga tushdi",
  ];
  return (
    <div className="pv pv-deploy">
      <div className="pv-deploy-drop">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
        <span>ZIP ni shu yerga tashlang</span>
      </div>
      <div className="pv-deploy-log">
        {steps.map((s, i) => (
          <span key={s} style={{ "--i": i }}>› {s}</span>
        ))}
        <b style={{ "--i": steps.length }}>ali.student.alazizacademychinoz.uz ● LIVE</b>
      </div>
      <i className="pv-deploy-bar" />
    </div>
  );
}

function Lms() {
  return (
    <div className="pv pv-lms">
      <aside>
        <b>AL-AZIZ</b>
        {["Guruhlar", "Darslar", "Vazifalar", "Jurnal", "Reyting"].map((t, i) => (
          <span key={t} className={i === 1 ? "on" : ""}>{t}</span>
        ))}
      </aside>
      <div className="pv-lms-main">
        <div className="pv-lms-tabs">
          <span className="on">1-blok</span>
          <span>2-blok</span>
          <span>3-blok</span>
        </div>
        <div className="pv-lms-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={i < 4 ? "open" : ""} style={{ "--i": i }}>
              <span>{i + 1}-dars</span>
              <i />
              <em>{i < 4 ? "★★★★★".slice(0, 5 - (i % 2)) : "Yopiq"}</em>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Learn() {
  return (
    <div className="pv pv-learn">
      <div className="pv-learn-page">
        <span>3-bob · Excel</span>
        <b>СУММ va ЕСЛИ funksiyalari</b>
        <i style={{ "--w": "96%" }} />
        <i style={{ "--w": "88%" }} />
        <i style={{ "--w": "70%" }} />
        <div className="pv-learn-cells">
          {Array.from({ length: 12 }).map((_, i) => <em key={i} style={{ "--i": i }} />)}
        </div>
      </div>
      <div className="pv-learn-progress">
        <span>Progress</span>
        <b>64%</b>
        <i />
      </div>
    </div>
  );
}

function Cards() {
  return (
    <div className="pv pv-cards">
      <span className="pv-cards-hint no">Bilmayman</span>
      <div className="pv-flip">
        <div className="pv-flip-inner">
          <div className="pv-flip-front"><b>apple</b><span>/ˈæp.əl/</span></div>
          <div className="pv-flip-back"><b>olma</b><span>noun</span></div>
        </div>
      </div>
      <span className="pv-cards-hint yes">Bilaman</span>
      <div className="pv-cards-count">14 / 100</div>
    </div>
  );
}

function Bot({ project }) {
  const lines = project?.bot?.lines || [];
  return (
    <div className="pv pv-bot">
      <div className="pv-bot-head">
        <i />
        <div>
          <b>{project?.title}</b>
          <span>bot</span>
        </div>
      </div>
      <div className="pv-bot-chat">
        {lines.map(([dir, text], i) => (
          <p key={i} className={dir} style={{ "--i": i }}>{text}</p>
        ))}
      </div>
    </div>
  );
}

function Book() {
  return (
    <div className="pv pv-book">
      <div className="pv-book-cover">
        <span>AL-AZIZ ACADEMY · CHINOZ</span>
        <b>Kompyuter<br />savodxonligi</b>
        <em>Word · Excel · PowerPoint · Canva</em>
      </div>
      <div className="pv-book-page p1"><i /><i /><i /><u /></div>
      <div className="pv-book-page p2"><i /><i /><u /><i /></div>
    </div>
  );
}

function Sheet() {
  const cols = ["№", "Savol", "A", "B", "C", "D"];
  const tones = ["#2E6BFF", "#30D158", "#FF9F0A", "#BF5AF2", "#64D2FF"];
  return (
    <div className="pv pv-sheet">
      <div className="pv-sheet-row head">{cols.map((c) => <span key={c}>{c}</span>)}</div>
      {Array.from({ length: 7 }).map((_, r) => (
        <div key={r} className="pv-sheet-row" style={{ "--c": tones[r % 5], "--i": r }}>
          <span>{r + 1}</span>
          <span><i /></span>
          <span /><span /><span /><span />
        </div>
      ))}
    </div>
  );
}

function Slides() {
  return (
    <div className="pv pv-slides">
      {["useState", "Props", "React · 1-dars"].map((t, i) => (
        <div key={t} className="pv-slide" style={{ "--i": i }}>
          <span>{String(3 - i).padStart(2, "0")} / 40</span>
          <b>{t}</b>
          <code>{i === 2 ? "npm create vite@latest" : i === 1 ? "<Card title=\"Hi\" />" : "const [n, setN] = useState(0)"}</code>
        </div>
      ))}
    </div>
  );
}

function HonorCard() {
  return (
    <div className="pv pv-honor">
      <div className="pv-honor-card">
        <span className="cap">AL-AZIZ ACADEMY</span>
        <div className="ph" />
        <span className="name">Faxriy o‘quvchi</span>
        <div className="foot"><em>Maktab</em><em>Mahalla</em></div>
        <small>Chinoz filiali</small>
      </div>
      <div className="pv-honor-cert">
        <b>SERTIFIKAT</b>
        <i /><i /><u />
      </div>
    </div>
  );
}

const map = {
  qr: QR,
  type: TypeP,
  bunker: Bunker,
  arena: Arena,
  ielts: Ielts,
  store: Store,
  note: Note,
  api: Api,
  deploy: Deploy,
  lms: Lms,
  learn: Learn,
  cards: Cards,
  bot: Bot,
  book: Book,
  sheet: Sheet,
  slides: Slides,
  card: HonorCard,
};

function Preview({ project, chrome = true }) {
  const Comp = map[project.preview] || Note;
  return (
    <div className="pv-window" style={{ "--accent": project.accent }}>
      {chrome && (
        <div className="pv-bar">
          <i /><i /><i />
          <span>{project.domain}</span>
        </div>
      )}
      <div className="pv-body">
        {project.image ? (
          <img src={project.image} alt={`${project.title} sayti`} loading="lazy" decoding="async" width="1440" height="900" />
        ) : (
          <Comp project={project} />
        )}
      </div>
    </div>
  );
}

export default memo(Preview);

// Desktop skrinshot + ustida suzib turgan telefon (mobil versiya).
export const Showcase = memo(function Showcase({ project, chrome = true }) {
  return (
    <div className={`sc ${project.mobile ? "has-phone" : ""}`}>
      <Preview project={project} chrome={chrome} />
      {project.mobile && (
        <div className="sc-phone" aria-hidden="true">
          <i className="sc-notch" />
          <img src={project.mobile} alt="" loading="lazy" decoding="async" width="585" height="1266" />
        </div>
      )}
    </div>
  );
});
