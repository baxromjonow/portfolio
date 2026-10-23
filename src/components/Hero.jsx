import { useRef } from "react";
import { gsap, ScrollTrigger, prefersReduced, scrollToId, useIsoLayoutEffect } from "../lib/motion";
import { projects } from "../data/projects";

const live = projects.filter((p) => p.url).length;

function Chars({ text }) {
  return Array.from(text).map((c, i) => (
    <span className="ch" key={i}><span>{c}</span></span>
  ));
}

export default function Hero({ ready }) {
  const root = useRef(null);

  useIsoLayoutEffect(() => {
    if (!ready) return undefined;
    const reduced = prefersReduced();
    const ctx = gsap.context(() => {
      if (!reduced) {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".hero-l1 .ch > span", { yPercent: 115, duration: 1.1, stagger: 0.045 })
          .from(".hero-l2 .ch > span", { yPercent: 115, duration: 1.1, stagger: 0.03 }, 0.12)
          .from(".hero-photo", { clipPath: "inset(100% 0 0 0)", duration: 1.3, ease: "expo.out" }, 0.2)
          .from(".hero-photo img", { scale: 1.35, duration: 1.6, ease: "expo.out" }, 0.2)
          .from(".hero-meta > *", { y: 24, autoAlpha: 0, stagger: 0.07, duration: 0.9 }, 0.55);
      }

      // Scroll: ism ikki tomonga tarqaladi, portret yaqinlashadi.
      if (!reduced) {
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-l1", { xPercent: -18, ease: "none", scrollTrigger: st });
        gsap.to(".hero-l2", { xPercent: 14, ease: "none", scrollTrigger: st });
        gsap.to(".hero-photo", { yPercent: 18, scale: 1.08, ease: "none", scrollTrigger: st });
        gsap.to(".hero-photo img", { filter: "grayscale(0) contrast(1.05)", ease: "none", scrollTrigger: { ...st, end: "40% top" } });
        gsap.to(".hero-meta", { autoAlpha: 0, y: -40, ease: "none", scrollTrigger: { ...st, end: "45% top" } });
      }
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero-grid" aria-hidden="true" />
      <h1 className="hero-title">
        <span className="sr-only">Baxromjonov Asadbek — Frontend developer va IT instructor</span>
        <span className="hero-l1" aria-hidden="true"><Chars text="ASADBEK" /></span>
        <span className="hero-photo" aria-hidden="true">
          <img src="/img/asadbek-hero.webp" alt="" width="900" height="1350" fetchpriority="high" />
        </span>
        <span className="hero-l2" aria-hidden="true"><Chars text="BAXROMJONOV" /></span>
      </h1>

      <div className="hero-meta">
        <p className="hero-lead">
          Frontend developer va IT ustoz. Darsda o‘rgataman, kechqurun esa o‘quvchilar va markaz uchun
          platformalar quraman: <em>darslikdan serverdagi deploygacha.</em>
        </p>
        <div className="hero-facts">
          <div><b>{projects.length}</b><span>loyiha</span></div>
          <div><b>{live}</b><span>jonli manzil</span></div>
          <div><b>1</b><span>o‘z serverim</span></div>
        </div>
        <div className="hero-cta">
          <a href="#works" className="btn btn-light" onClick={(e) => { e.preventDefault(); scrollToId("works"); }}>
            Ishlarni ko‘rish <span aria-hidden="true">↓</span>
          </a>
          <a href="#contact" className="btn btn-ghost" onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>
            Menga yozish
          </a>
        </div>
      </div>

      <div className="hero-ticker" aria-hidden="true">
        <div>
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              React · Vite · GSAP · Node.js · Next.js · PostgreSQL · Docker · Nginx · Cloudflare Tunnel · Telegram Bots · Figma ·&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
