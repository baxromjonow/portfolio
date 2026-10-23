import { useRef, useState } from "react";
import { gsap, prefersReduced, useIsoLayoutEffect, useLive } from "../lib/motion";
import { bots } from "../data/projects";
import Preview from "./Preview";

// 6 ta bot 3D silindr bo'ylab joylashgan, scroll bilan aylanadi.
export default function Bots({ onOpen }) {
  const root = useRef(null);
  const live = useLive();
  const [active, setActive] = useState(0);
  // 4 ta bot halqada siyrak ko'rinmasligi uchun halqa 2 marta takrorlanadi (8 ta karta).
  const ring = [...bots, ...bots];
  const step = 360 / ring.length;

  useIsoLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.to(".bt-ring", {
        rotateY: -step * (bots.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".bt-stage",
          start: "top top",
          end: `+=${bots.length * 55}%`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          snap: { snapTo: 1 / (bots.length - 1), duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut" },
          onUpdate: (self) => setActive(Math.round(self.progress * (bots.length - 1))),
        },
      });
      gsap.from(".bt-title span", {
        yPercent: 100,
        stagger: 0.08,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, [step]);

  const cur = bots[active];

  return (
    <section className="bots" id="bots" ref={root}>
      <div className="bt-stage" ref={live}>
        <h2 className="bt-title display" aria-label="Telegram botlar">
          <span>Telegram</span> <span><em>botlar</em></span>
        </h2>

        <div className="bt-scene">
          <div className="bt-orbit">
          <div className="bt-ring" style={{ "--n": bots.length }}>
            {ring.map((b, i) => (
              <button
                type="button"
                key={`${b.id}-${i}`}
                className={`bt-card ${i === active ? "is-front" : ""}`}
                tabIndex={i < bots.length ? 0 : -1}
                style={{ transform: `rotateY(${i * step}deg) translateZ(var(--r))` }}
                onClick={() => onOpen(b.id)}
                aria-label={`${b.title} haqida batafsil`}
              >
                <Preview project={b} chrome={false} />
              </button>
            ))}
          </div>
          </div>
        </div>

        <div className="bt-info" aria-live="polite">
          <span className="bt-idx">{String(active + 1).padStart(2, "0")} / {String(bots.length).padStart(2, "0")}</span>
          <h3>{cur.title}</h3>
          <p>{cur.summary}</p>
          <button type="button" className="btn btn-ghost sm" onClick={() => onOpen(cur.id)}>Batafsil</button>
        </div>
      </div>
    </section>
  );
}
