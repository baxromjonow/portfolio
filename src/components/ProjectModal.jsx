import { useEffect, useRef } from "react";
import { gsap, lockScroll, prefersReduced } from "../lib/motion";
import { projects } from "../data/projects";
import { Showcase } from "./Preview";

const catLabel = { web: "Web ilova", alaziz: "Al-Aziz platformasi", bot: "Telegram bot", edu: "Ta’lim materiali" };

export default function ProjectModal({ id, onClose, onNav }) {
  const root = useRef(null);
  const closeBtn = useRef(null);
  const idx = projects.findIndex((p) => p.id === id);
  const p = projects[idx];
  const open = Boolean(p);

  useEffect(() => {
    if (!open) return undefined;
    lockScroll(true);
    const last = document.activeElement;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      last?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, onNav]);

  useEffect(() => {
    if (!open || prefersReduced()) return;
    const el = root.current;
    gsap.fromTo(el.querySelector(".pm-panel"), { yPercent: 8, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out" });
    gsap.fromTo(el.querySelectorAll(".pm-anim"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.6, delay: 0.1 });
    gsap.fromTo(el.querySelector(".pm-preview"), { rotateX: 18, scale: 0.92 }, { rotateX: 0, scale: 1, duration: 0.9, ease: "expo.out" });
  }, [id, open]);

  if (!open) return null;

  return (
    <div className="pm" data-lenis-prevent ref={root} role="dialog" aria-modal="true" aria-labelledby="pm-title" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pm-panel" style={{ "--accent": p.accent }}>
        <div className="pm-top">
          <span className="pm-cat">{catLabel[p.category]}</span>
          <div className="pm-nav">
            <button type="button" onClick={() => onNav(-1)} aria-label="Oldingi loyiha">←</button>
            <span>{String(idx + 1).padStart(2, "0")} / {projects.length}</span>
            <button type="button" onClick={() => onNav(1)} aria-label="Keyingi loyiha">→</button>
            <button type="button" ref={closeBtn} className="pm-close" onClick={onClose} aria-label="Yopish">✕</button>
          </div>
        </div>

        <div className="pm-body">
          <div className="pm-preview is-live">
            <Showcase project={p} />
          </div>
          <div className="pm-info">
            <p className="pm-kicker pm-anim">{p.kicker}</p>
            <h2 id="pm-title" className="pm-anim">{p.title}</h2>
            <p className="pm-summary pm-anim">{p.summary}</p>
            <ul className="pm-features pm-anim">
              {p.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <div className="pm-stack pm-anim">
              {p.stack.map((s) => <span key={s}>{s}</span>)}
            </div>
            {p.url ? (
              <a className="btn btn-dark pm-anim pm-go" href={p.url} target="_blank" rel="noreferrer noopener">
                {p.category === "bot" ? "Botni ochish" : "Saytni ochish"} <span aria-hidden="true">↗</span>
                <small>{p.domain}</small>
              </a>
            ) : (
              <p className="pm-private pm-anim">Bu loyiha ichki foydalanish uchun, ochiq havolasi yo‘q.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
