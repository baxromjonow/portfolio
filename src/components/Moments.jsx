import { useRef, useState } from "react";
import { gsap, prefersReduced, useIsoLayoutEffect } from "../lib/motion";

// Hayotimdan lavhalar: rasmlar dastasi scroll bilan bittadan "uchib" ketadi.
const items = [
  { src: "/img/m-award.webp", title: "Tashakkurnoma", sub: "Al-Aziz Academy", w: 1000, h: 1333 },
  { src: "/img/m-students.webp", title: "O‘quvchilarim bilan", sub: "Dasturlash ustozi · Chinoz", w: 1000, h: 750 },
  { src: "/img/m-certificate.webp", title: "Sertifikat", sub: "O‘rganishdan to‘xtamayman", w: 933, h: 1400 },
  { src: "/img/m-lanyard.webp", title: "Ish kunim", sub: "Al-Aziz Academy", w: 1000, h: 1333 },
  { src: "/img/m-proweb.webp", title: "IT muhiti", sub: "Kod, jamoa, g‘oyalar", w: 1000, h: 1237 },
  { src: "/img/m-evening.webp", title: "Kechki Toshkent", sub: "Dam olishda ham fikr kodda", w: 787, h: 1400 },
];

const tilt = [-5, 4, -2, 6, -4, 3];

export default function Moments() {
  const root = useRef(null);
  const [active, setActive] = useState(0);

  useIsoLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".mo-card");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".mo-stage",
          start: "top top",
          end: `+=${items.length * 60}%`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => setActive(Math.min(items.length - 1, Math.floor(self.progress * items.length * 0.999))),
        },
      });
      cards.slice(0, -1).forEach((card, i) => {
        const dir = i % 2 ? 1 : -1;
        tl.to(card, {
          xPercent: dir * 130,
          yPercent: -40,
          rotate: dir * 28,
          autoAlpha: 0,
          duration: 1,
          ease: "power2.in",
        }).to(cards[i + 1], { scale: 1, rotate: 0, duration: 0.5, ease: "power2.out" }, "<0.4");
      });
      tl.to({}, { duration: 0.6 });
    }, root);
    return () => ctx.revert();
  }, []);

  const cur = items[active];

  return (
    <section className="moments" ref={root} aria-label="Lavhalar">
      <div className="mo-stage">
        <div className="mo-copy">
          <p className="eyebrow">Lavhalar</p>
          <h2 className="display">Kod ortidagi<br /><em>odam</em></h2>
          <div className="mo-cap" aria-live="polite">
            <span>{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
            <b>{cur.title}</b>
            <em>{cur.sub}</em>
          </div>
        </div>
        <div className="mo-deck">
          {items.map((it, i) => (
            <figure
              key={it.src}
              className="mo-card"
              style={{ zIndex: items.length - i, transform: i ? `rotate(${tilt[i]}deg) scale(0.94)` : undefined }}
            >
              <img src={it.src} alt={it.title} width={it.w} height={it.h} loading="lazy" decoding="async" />
              <figcaption>{it.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
