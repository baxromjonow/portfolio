import { useRef } from "react";
import { gsap, prefersReduced, useIsoLayoutEffect } from "../lib/motion";

const TEXT =
  "Men o‘quvchilarga kod yozishni o‘rgataman. Ular yozgan sayt shu kunning o‘zida internetda turishi uchun platforma quraman. Botlar, darsliklar, serverlar: hammasi bitta maqsadga xizmat qiladi, ta’lim jonli bo‘lsin.";

const ACCENT = new Set(["o‘rgataman.", "internetda", "jonli"]);

export default function Manifesto() {
  const root = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mf-word",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: ".mf-text",
            start: "top 80%",
            end: "bottom 45%",
            scrub: true,
          },
        }
      );
      gsap.from(".mf-label", {
        x: -30,
        autoAlpha: 0,
        duration: 0.9,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="manifesto paper" ref={root}>
      <div className="wrap">
        <p className="mf-label eyebrow">Manifest</p>
        <p className="mf-text">
          {TEXT.split(" ").map((w, i) => (
            <span key={i} className={`mf-word ${ACCENT.has(w) ? "is-accent" : ""}`}>{w} </span>
          ))}
        </p>
      </div>
    </section>
  );
}
