import { useEffect, useRef, useState } from "react";
import { gsap, prefersReduced, useIsoLayoutEffect, useLive } from "../lib/motion";
import { featured } from "../data/projects";
import { Showcase } from "./Preview";

// Har bir karta markazdan uzoqligiga qarab 3D egiladi — "bukilgan ekran" galereyasi.
function curve(cards, centerX, width) {
  cards.forEach((card) => {
    const r = card.getBoundingClientRect();
    const c = r.left + r.width / 2;
    const d = Math.max(-1.4, Math.min(1.4, (c - centerX) / (width * 0.62)));
    const rot = d * -26;
    const z = -Math.pow(Math.abs(d), 1.3) * 260;
    const s = 1 - Math.abs(d) * 0.06;
    card.style.transform = `translateZ(${z.toFixed(1)}px) rotateY(${rot.toFixed(2)}deg) scale(${s.toFixed(3)})`;
    card.style.setProperty("--dim", Math.min(1, Math.abs(d)).toFixed(3));
  });
}

export default function Works({ onOpen }) {
  const root = useRef(null);
  const track = useRef(null);
  const live = useLive();
  const [idx, setIdx] = useState(0);

  useIsoLayoutEffect(() => {
    const reduced = prefersReduced();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      if (reduced) return undefined;
      const cards = gsap.utils.toArray(".wk-card", track.current);
      const getDist = () => track.current.scrollWidth - window.innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -getDist(),
        ease: "none",
        scrollTrigger: {
          trigger: ".wk-pin",
          start: "top top",
          end: () => `+=${getDist()}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            curve(cards, window.innerWidth / 2, window.innerWidth);
            setIdx(Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1))));
            gsap.set(".wk-progress i", { scaleX: self.progress });
          },
          onRefresh: () => curve(cards, window.innerWidth / 2, window.innerWidth),
        },
      });
      curve(cards, window.innerWidth / 2, window.innerWidth);
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        cards.forEach((c) => (c.style.transform = ""));
      };
    });
    return () => mm.revert();
  }, []);

  // Telefon: gorizontal swipe + o'sha 3D egilish.
  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    const mq = window.matchMedia("(max-width: 899px)");
    let raf = 0;
    const onScroll = () => {
      if (!mq.matches) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cards = el.querySelectorAll(".wk-card");
        const rect = el.getBoundingClientRect();
        if (!prefersReduced()) curve(cards, rect.left + rect.width / 2, rect.width * 1.25);
        const step = el.scrollWidth / cards.length;
        setIdx(Math.min(cards.length - 1, Math.round(el.scrollLeft / step)));
      });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="works paper" id="works" ref={root}>
      <div className="wk-pin" ref={live}>
        <header className="wk-head">
          <div>
            <p className="eyebrow">Tanlangan ishlar</p>
            <h2 className="display">Jonli<br /><em>loyihalar</em></h2>
          </div>
          <div className="wk-count" aria-live="polite">
            <b>{String(idx + 1).padStart(2, "0")}</b>
            <span>/ {String(featured.length).padStart(2, "0")}</span>
            <div className="wk-progress"><i /></div>
          </div>
        </header>

        <div className="wk-viewport">
          <div className="wk-track" ref={track}>
            {featured.map((p, i) => (
              <article className="wk-card" key={p.id}>
                <button type="button" className="wk-hit" onClick={() => onOpen(p.id)} aria-label={`${p.title} haqida batafsil`}>
                  <Showcase project={p} />
                </button>
                <div className="wk-cap">
                  <span className="wk-num">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.kicker}</p>
                  </div>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer noopener" className="wk-link">{p.domain} ↗</a>
                  ) : (
                    <span className="wk-link muted">{p.domain}</span>
                  )}
                </div>
              </article>
            ))}
            <div className="wk-end" aria-hidden="true">
              <span>Hammasi pastda ↓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
