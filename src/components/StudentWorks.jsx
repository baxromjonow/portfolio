import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, prefersReduced, useIsoLayoutEffect } from "../lib/motion";
import { studentProjects } from "../data/projects";

const SPEED = 70; // px/s
const MIN = 9000;
const MAX = 24000;
const HOLD = 6000;

// O'quvchi saytlari jonli iframe ichida avtomatik pastga "aylanadi", tugagach keyingisiga o'tadi.
export default function StudentWorks() {
  const root = useRef(null);
  const frame = useRef(null);
  const raf = useRef(0);
  const timer = useRef(0);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [progress, setProgress] = useState(0);
  const cur = studentProjects[i];

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    clearTimeout(timer.current);
  }, []);

  const next = useCallback(() => setI((v) => (v + 1) % studentProjects.length), []);

  const run = useCallback(() => {
    stop();
    setProgress(0);
    if (paused || !inView) return;
    const f = frame.current;
    let win;
    let doc;
    try {
      win = f.contentWindow;
      doc = f.contentDocument;
    } catch {
      timer.current = setTimeout(next, HOLD);
      return;
    }
    if (!win || !doc?.documentElement) return;
    try {
      if (!doc.getElementById("kiosk-style")) {
        const st = doc.createElement("style");
        st.id = "kiosk-style";
        st.textContent = "html{scrollbar-width:none;scroll-behavior:auto!important}::-webkit-scrollbar{display:none}";
        doc.head?.appendChild(st);
      }
    } catch {}
    win.scrollTo(0, 0);
    const max = Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight || 0) - f.clientHeight;
    const dur = max < 40 ? HOLD : Math.max(MIN, Math.min(MAX, (max / SPEED) * 1000));
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      if (max >= 40) win.scrollTo(0, max * (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2));
      setProgress(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else timer.current = setTimeout(next, 1200);
    };
    raf.current = requestAnimationFrame(tick);
  }, [inView, next, paused, stop]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (frame.current?.dataset.loaded === cur.id) run();
    return stop;
  }, [run, stop, cur.id]);

  useIsoLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".sw-screen", {
        rotateX: 28,
        scale: 0.86,
        y: 80,
        transformOrigin: "50% 100%",
        ease: "none",
        scrollTrigger: { trigger: ".sw-screen", start: "top bottom", end: "top 30%", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="student" ref={root} aria-label="O‘quvchilar loyihalari">
      <div className="wrap">
        <header className="sw-head">
          <div>
            <p className="eyebrow">O‘quvchilarim ishlari</p>
            <h2 className="display">Ular ham<br /><em>quradi</em></h2>
          </div>
          <p className="sw-lead">
            Darsda yozilgan haqiqiy saytlar. Sahifa o‘zi pastga aylanadi, tugagach keyingi o‘quvchi ishiga o‘tadi.
          </p>
        </header>

        <div className="sw-layout">
          <div className="sw-list" role="tablist" aria-label="O‘quvchi loyihalari">
            {studentProjects.map((p, k) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={k === i}
                className={k === i ? "on" : ""}
                onClick={() => setI(k)}
              >
                <span>{String(k + 1).padStart(2, "0")}</span>
                <b>{p.title}</b>
                <em>{p.type}</em>
                <i style={{ transform: `scaleX(${k === i ? progress : 0})` }} />
              </button>
            ))}
          </div>

          <div className="sw-screen">
            <div className="sw-bar">
              <i /><i /><i />
              <span>baxromjonov.uz/student-projects/{cur.id}</span>
              <button type="button" onClick={() => setPaused((v) => !v)} aria-label={paused ? "Davom ettirish" : "To‘xtatish"}>
                {paused ? "▶" : "❚❚"}
              </button>
              <a href={cur.url} target="_blank" rel="noreferrer" aria-label="Yangi oynada ochish">↗</a>
            </div>
            <div className="sw-view">
              {inView || frame.current ? (
                <iframe
                  ref={frame}
                  key={cur.id}
                  src={cur.url}
                  title={cur.title}
                  tabIndex={-1}
                  loading="lazy"
                  onLoad={(e) => {
                    e.currentTarget.dataset.loaded = cur.id;
                    setTimeout(run, 400);
                  }}
                />
              ) : (
                <div className="sw-placeholder" />
              )}
            </div>
            <div className="sw-tags">
              {cur.tech.map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
