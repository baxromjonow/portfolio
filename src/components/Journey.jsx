import { useRef } from "react";
import { gsap, prefersReduced, useIsoLayoutEffect } from "../lib/motion";

const stages = [
  {
    tag: "Ta’lim",
    title: "Talaba",
    place: "Toshkent davlat texnika universiteti",
    text: "Muhandislik tafakkuri va texnik bilimlar. O‘qish bilan ishni birga olib boraman.",
    bg: "TDTU",
  },
  {
    tag: "Avval",
    title: "IT ustoz",
    place: "Al-Aziz Academy · Gulbahor filiali",
    text: "IT va frontend yo‘nalishida ustozlik faoliyatimni rivojlantirgan bosqich.",
    bg: "GULBAHOR",
  },
  {
    tag: "Hozir",
    title: "IT instructor & frontend developer",
    place: "Al-Aziz Academy · Chinoz filiali",
    text: "Darslar, LMS, Deploy platformasi, botlar va darsliklar. Markazning raqamli infratuzilmasini quraman.",
    bg: "CHINOZ",
  },
];

export default function Journey() {
  const root = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".jr-card");
      const bgs = gsap.utils.toArray(".jr-bg span");
      gsap.set(cards.slice(1), { yPercent: 60, autoAlpha: 0, filter: "blur(10px)" });
      gsap.set(bgs.slice(1), { autoAlpha: 0, xPercent: 30 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".jr-stage",
          start: "top top",
          end: `+=${stages.length * 70}%`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
        },
      });
      for (let i = 1; i < cards.length; i++) {
        tl.to(cards[i - 1], { yPercent: -60, autoAlpha: 0, filter: "blur(10px)", duration: 1 })
          .to(bgs[i - 1], { xPercent: -30, autoAlpha: 0, duration: 1 }, "<")
          .to(cards[i], { yPercent: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1 }, "<0.3")
          .to(bgs[i], { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .to(".jr-dots i", { "--p": i / (cards.length - 1), duration: 1 }, "<")
          .to({}, { duration: 0.6 });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="journey" ref={root} aria-label="Faoliyat yo‘lim">
      <div className="jr-stage">
        <div className="jr-bg" aria-hidden="true">
          {stages.map((s) => <span key={s.bg}>{s.bg}</span>)}
        </div>
        <p className="eyebrow jr-eyebrow">Yo‘lim</p>
        <div className="jr-cards">
          {stages.map((s) => (
            <article className="jr-card" key={s.title}>
              <span className="jr-tag">{s.tag}</span>
              <h3>{s.title}</h3>
              <p className="jr-place">{s.place}</p>
              <p className="jr-text">{s.text}</p>
            </article>
          ))}
        </div>
        <div className="jr-dots" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}
