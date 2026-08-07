import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Sparkles, Pause, Play } from "lucide-react";

const projects = [
  { id: "natureeee", title: "Technology & Nature", type: "Tabiat va texnologiya", tech: ["HTML", "CSS", "Responsive"], description: "Tabiat va zamonaviy texnologiyalar uyg‘unligida yaratilgan kreativ landing page." },
  { id: "nike", title: "Nike", type: "Mahsulot sayti", tech: ["HTML", "CSS", "Media Query"], description: "Nike mahsulotlarini zamonaviy hero, katalog va moslashuvchan interfeysda namoyish qiluvchi loyiha." },
  { id: "totembo", title: "TOTEMBO", type: "Online katalog", tech: ["HTML", "CSS", "Grid"], description: "Soat va aksessuarlar uchun premium ko‘rinishdagi katta katalog sahifasi." },
  { id: "vue-cinema", title: "Vue Cinema", type: "Kino platformasi", tech: ["HTML", "CSS", "Video"], description: "Filmlar, seriallar va media kontent uchun atmosfera va animatsiyalarga boy kino interfeysi." },
  { id: "silver-house", title: "Silver House", type: "Ko‘chmas mulk", tech: ["HTML", "CSS", "Responsive"], description: "Yangi uylar va ko‘chmas mulk mavzusidagi toza, tartibli va informatsion web sahifa." },
].map((p) => ({ ...p, url: `/student-projects/${p.id}/index.html` }));

const HOLD_AT_END = 1200;
const STATIC_HOLD = 8000;
const MIN_SCROLL_TIME = 13000;
const MAX_SCROLL_TIME = 30000;
const PX_PER_SECOND = 92;

export default function StudentProjects() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const iframeRef = useRef(null);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);
  const startedAtRef = useRef(0);
  const elapsedBeforePauseRef = useRef(0);
  const runConfigRef = useRef(null);
  const current = projects[index];

  const clearPlayback = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    rafRef.current = null;
    timeoutRef.current = null;
  }, []);

  const go = useCallback((next) => {
    clearPlayback();
    setProgress(0);
    elapsedBeforePauseRef.current = 0;
    runConfigRef.current = null;
    setIndex((next + projects.length) % projects.length);
  }, [clearPlayback]);

  const startProjectScroll = useCallback(() => {
    clearPlayback();
    if (paused) return;

    const frame = iframeRef.current;
    if (!frame) return;

    let win;
    let doc;
    try {
      win = frame.contentWindow;
      doc = frame.contentDocument || win?.document;
    } catch {
      timeoutRef.current = window.setTimeout(() => go(index + 1), STATIC_HOLD);
      return;
    }
    if (!win || !doc) return;

    try {
      let style = doc.getElementById("bw-kiosk-style");
      if (!style) {
        style = doc.createElement("style");
        style.id = "bw-kiosk-style";
        style.textContent = `html{scrollbar-width:none!important;scroll-behavior:auto!important}body{-ms-overflow-style:none!important}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important}`;
        doc.head?.appendChild(style);
      }
    } catch {}

    win.scrollTo(0, 0);
    const root = doc.documentElement;
    const body = doc.body;
    const scrollHeight = Math.max(root?.scrollHeight || 0, body?.scrollHeight || 0);
    const viewport = frame.clientHeight || win.innerHeight || 1;
    const maxScroll = Math.max(0, scrollHeight - viewport);

    if (maxScroll < 40) {
      runConfigRef.current = { type: "hold", duration: STATIC_HOLD };
      startedAtRef.current = performance.now();
      setProgress(0);
      const tickHold = (now) => {
        if (paused) return;
        const elapsed = now - startedAtRef.current + elapsedBeforePauseRef.current;
        const p = Math.min(1, elapsed / STATIC_HOLD);
        setProgress(p);
        if (p >= 1) {
          timeoutRef.current = window.setTimeout(() => go(index + 1), 350);
          return;
        }
        rafRef.current = requestAnimationFrame(tickHold);
      };
      rafRef.current = requestAnimationFrame(tickHold);
      return;
    }

    const duration = Math.max(
      MIN_SCROLL_TIME,
      Math.min(MAX_SCROLL_TIME, (maxScroll / PX_PER_SECOND) * 1000)
    );
    runConfigRef.current = { type: "scroll", duration, maxScroll, win };
    startedAtRef.current = performance.now();
    setProgress(0);

    const tick = (now) => {
      if (paused) return;
      const elapsed = now - startedAtRef.current + elapsedBeforePauseRef.current;
      const p = Math.min(1, elapsed / duration);
      win.scrollTo(0, maxScroll * p);
      setProgress(p);
      if (p >= 1) {
        timeoutRef.current = window.setTimeout(() => go(index + 1), HOLD_AT_END);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [clearPlayback, go, index, paused]);

  useEffect(() => () => clearPlayback(), [clearPlayback]);

  useEffect(() => {
    if (paused) {
      clearPlayback();
      if (startedAtRef.current) {
        elapsedBeforePauseRef.current += performance.now() - startedAtRef.current;
      }
      return;
    }

    if (!runConfigRef.current) return;
    const cfg = runConfigRef.current;
    startedAtRef.current = performance.now();

    const resume = (now) => {
      if (paused) return;
      const elapsed = now - startedAtRef.current + elapsedBeforePauseRef.current;
      const p = Math.min(1, elapsed / cfg.duration);
      if (cfg.type === "scroll") cfg.win?.scrollTo(0, cfg.maxScroll * p);
      setProgress(p);
      if (p >= 1) {
        timeoutRef.current = window.setTimeout(() => go(index + 1), cfg.type === "scroll" ? HOLD_AT_END : 350);
        return;
      }
      rafRef.current = requestAnimationFrame(resume);
    };
    rafRef.current = requestAnimationFrame(resume);
  }, [paused, clearPlayback, go, index]);

  return (
    <section id="student-projects" className="student-projects-section student-kiosk-section relative overflow-hidden py-20 md:py-28">
      <div className="student-projects-glow student-projects-glow-a" />
      <div className="student-projects-glow student-projects-glow-b" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-5 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[.06] px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-cyan-300">
              <Sparkles size={15} /> O‘quvchilar ishlari — jonli namoyish
            </div>
            <h2 className="max-w-4xl text-3xl font-black tracking-tight text-white md:text-5xl">
              Har bir loyiha <span className="text-gradient">o‘zi hikoya qiladi</span>
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
              Ekranga tegish shart emas: loyiha sahifasi yuqoridan pastga avtomatik ko‘rsatiladi, tugagach navbatdagi o‘quvchi loyihasiga o‘tadi.
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-4xl font-black text-white">0{index + 1}<span className="text-lg text-slate-600"> / 0{projects.length}</span></div>
            <div className="mt-1 text-xs uppercase tracking-[.22em] text-slate-500">Infinite showcase</div>
          </div>
        </div>

        <div className="student-kiosk-stage">
          <div className="student-kiosk-topbar">
            <div className="flex items-center gap-2">
              <span className="student-live-dot" />
              <span className="student-kiosk-label">LIVE PROJECT</span>
            </div>
            <div className="student-kiosk-project-name">{current.title}</div>
            <a href={current.url} target="_blank" rel="noreferrer" className="student-browser-open" aria-label="Loyihani yangi oynada ochish">
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="student-kiosk-screen">
            <AnimatePresence mode="wait">
              <motion.iframe
                ref={iframeRef}
                key={current.id}
                src={current.url}
                title={current.title}
                initial={{ opacity: 0, scale: 1.015, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: .992, filter: "blur(6px)" }}
                transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}
                className="student-kiosk-frame"
                onLoad={() => {
                  elapsedBeforePauseRef.current = 0;
                  runConfigRef.current = null;
                  window.setTimeout(startProjectScroll, 450);
                }}
                tabIndex="-1"
              />
            </AnimatePresence>

            <div className="student-kiosk-vignette" />

            <AnimatePresence mode="wait">
              <motion.div
                key={`caption-${current.id}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: .45 }}
                className="student-kiosk-caption"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="student-project-badge">O‘quvchi loyihasi</span>
                    <span className="student-kiosk-type">{current.type}</span>
                  </div>
                  <h3>{current.title}</h3>
                </div>
                <div className="hidden max-w-xl lg:block">
                  <p>{current.description}</p>
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    {current.tech.map((item) => <span key={item} className="student-tech-pill">{item}</span>)}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="student-kiosk-controls">
            <button
              onClick={() => setPaused((v) => !v)}
              className="student-pause"
              aria-label={paused ? "Davom ettirish" : "To‘xtatish"}
            >
              {paused ? <Play size={15} /> : <Pause size={15} />}
            </button>
            <div className="student-kiosk-progress-track">
              <motion.div className="student-kiosk-progress-fill" animate={{ scaleX: progress }} transition={{ duration: .08, ease: "linear" }} />
            </div>
            <div className="student-kiosk-status">{paused ? "PAUSED" : "AUTO SCROLL"}</div>
          </div>

          <div className="student-kiosk-dots">
            {projects.map((project, i) => (
              <button key={project.id} onClick={() => go(i)} className={`student-kiosk-dot ${i === index ? "is-active" : ""}`} aria-label={`${project.title} loyihasiga o‘tish`}>
                <span />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
