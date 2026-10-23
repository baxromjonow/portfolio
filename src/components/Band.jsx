import { useRef } from "react";
import { gsap, prefersReduced, useIsoLayoutEffect } from "../lib/motion";

const ROW1 = ["Frontend", "Ustoz", "Server", "Botlar", "Dizayn"];
const ROW2 = ["React", "Docker", "Telegram", "Darsliklar", "Deploy"];

function Row({ words, cls }) {
  const items = [...words, ...words, ...words];
  return (
    <div className={`band-row ${cls}`}>
      {items.map((w, i) => (
        <span key={i}>
          {w}
          <i aria-hidden="true">✳</i>
        </span>
      ))}
    </div>
  );
}

export default function Band() {
  const root = useRef(null);
  useIsoLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.4 };
      gsap.fromTo(".band-a", { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger: st });
      gsap.fromTo(".band-b", { xPercent: -30 }, { xPercent: 0, ease: "none", scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="band" ref={root} aria-label="Yo‘nalishlarim">
      <Row words={ROW1} cls="band-a" />
      <Row words={ROW2} cls="band-b outline" />
    </section>
  );
}
