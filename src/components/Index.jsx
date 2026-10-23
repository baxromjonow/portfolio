import { useRef, useState } from "react";
import { Flip } from "gsap/Flip";
import { gsap, ScrollTrigger, prefersReduced, useIsoLayoutEffect, useLive } from "../lib/motion";
import { categories, projects } from "../data/projects";
import Preview from "./Preview";

gsap.registerPlugin(Flip);

export default function Index({ onOpen }) {
  const root = useRef(null);
  const grid = useRef(null);
  const live = useLive();
  const flipState = useRef(null);
  const [cat, setCat] = useState("all");

  const counts = Object.fromEntries(
    categories.map((c) => [c.id, c.id === "all" ? projects.length : projects.filter((p) => p.category === c.id).length])
  );

  const choose = (id) => {
    if (id === cat) return;
    if (!prefersReduced()) flipState.current = Flip.getState(grid.current.querySelectorAll(".ix-card"));
    setCat(id);
  };

  // Filtr almashganda kartalar joyidan "uchib" o'tadi (GSAP Flip).
  useIsoLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.7,
      ease: "power3.inOut",
      stagger: 0.02,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, delay: 0.15 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.35 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
    flipState.current = null;
  }, [cat]);

  useIsoLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".ix-head > *", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.9,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      ScrollTrigger.batch(".ix-card", {
        start: "top 92%",
        once: true,
        onEnter: (els) =>
          gsap.fromTo(els, { y: 60, rotateX: -12, autoAlpha: 0 }, { y: 0, rotateX: 0, autoAlpha: 1, stagger: 0.07, duration: 0.9, overwrite: true }),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="index" id="index" ref={root}>
      <div className="wrap" ref={live}>
        <header className="ix-head">
          <p className="eyebrow">Arxiv</p>
          <h2 className="display">Barcha<br /><em>loyihalar</em></h2>
          <div className="ix-filters" role="tablist" aria-label="Loyiha turlari">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={cat === c.id}
                className={cat === c.id ? "on" : ""}
                onClick={() => choose(c.id)}
              >
                {c.label}<sup>{counts[c.id]}</sup>
              </button>
            ))}
          </div>
        </header>

        <div className="ix-grid" ref={grid}>
          {projects.map((p) => (
            <article
              key={p.id}
              className="ix-card"
              data-flip-id={p.id}
              hidden={!(cat === "all" || p.category === cat)}
            >
              <button type="button" className="ix-hit" onClick={() => onOpen(p.id)} aria-label={`${p.title} haqida batafsil`}>
                <Preview project={p} />
              </button>
              <div className="ix-meta">
                <h3>{p.title}</h3>
                <p>{p.kicker}</p>
                <div className="ix-tags">
                  {p.stack.slice(0, 3).map((s) => <span key={s}>{s}</span>)}
                </div>
                {p.url ? (
                  <a className="ix-url" href={p.url} target="_blank" rel="noreferrer noopener">{p.domain} ↗</a>
                ) : (
                  <span className="ix-url muted">{p.domain}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
