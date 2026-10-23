import { useRef } from "react";
import { gsap, prefersReduced, useIsoLayoutEffect, scrollToId } from "../lib/motion";
import { projects } from "../data/projects";

// Haqiqiy skrinshotlardan yasalgan 3D "ekranlar devori".
// Ustunlar scroll bilan qarama-qarshi tomonga suriladi, devor esa asta tekislanadi.
const shots = projects.filter((p) => p.image);

function column(offset) {
  const list = [];
  for (let i = 0; i < 6; i++) {
    const p = shots[(i + offset) % shots.length];
    list.push(i % 3 === 1 && p.mobile ? { p, kind: "m" } : { p, kind: "d" });
  }
  return list;
}

const COLS = [column(0), column(2), column(4), column(1), column(3)];

export default function Wall() {
  const root = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 };
      gsap.utils.toArray(".wl-col").forEach((col, i) => {
        gsap.fromTo(col, { yPercent: i % 2 ? -18 : 6 }, { yPercent: i % 2 ? 6 : -18, ease: "none", scrollTrigger: st });
      });
      gsap.fromTo(
        ".wl-plane",
        { rotateX: 38, rotateZ: -14, scale: 1.1 },
        { rotateX: 22, rotateZ: -8, scale: 1, ease: "none", scrollTrigger: st }
      );
      gsap.from(".wl-copy > *", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        scrollTrigger: { trigger: ".wl-copy", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="wall" ref={root} aria-label="Loyihalarim ekranlari">
      <div className="wl-stage" aria-hidden="true">
        <div className="wl-plane">
          {COLS.map((col, ci) => (
            <div className="wl-col" key={ci}>
              {col.map(({ p, kind }, i) => (
                <figure key={`${p.id}-${i}`} className={`wl-tile ${kind === "m" ? "is-m" : ""}`}>
                  <img src={kind === "m" ? p.mobile : p.image} alt="" loading="lazy" decoding="async" />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="wl-shade" aria-hidden="true" />
      <div className="wl-copy">
        <p className="eyebrow">Hammasi jonli</p>
        <h2 className="display">
          Bular maket emas.<br /><em>Haqiqiy saytlar.</em>
        </h2>
        <p className="wl-lead">
          Har bir ekran internetda ishlayotgan loyihadan olingan. Hammasi o‘z serverimda turadi.
        </p>
        <a href="#works" className="btn btn-light" onClick={(e) => { e.preventDefault(); scrollToId("works"); }}>
          Birma-bir ko‘rish <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
