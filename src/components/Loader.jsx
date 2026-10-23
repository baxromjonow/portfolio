import { useRef, useState } from "react";
import { gsap, prefersReduced, useIsoLayoutEffect } from "../lib/motion";

// To'lqinli doira chiziladi, hisoblagich 0→100, keyin parda ochiladi.
// Ikkinchi tashrifda (shu sessiyada) qisqa variant ishlaydi — zeriktirmaydi.

function wavyCircle(r = 92, waves = 9, amp = 5, steps = 240) {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const rr = r + Math.sin(a * waves) * amp;
    const x = 120 + Math.cos(a - Math.PI / 2) * rr;
    const y = 120 + Math.sin(a - Math.PI / 2) * rr;
    d += `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d + "Z";
}

const PATH = wavyCircle();

export default function Loader({ onDone }) {
  const root = useRef(null);
  const [gone, setGone] = useState(false);

  useIsoLayoutEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("bw-seen") === "1";
      sessionStorage.setItem("bw-seen", "1");
    } catch {}
    const reduced = prefersReduced();
    const ctx = gsap.context(() => {
      const path = root.current.querySelector(".ld-path");
      const len = path.getTotalLength();
      const counter = { v: 0 };
      const num = root.current.querySelector(".ld-num");
      const fast = seen || reduced;
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      const tl = gsap.timeline({
        onComplete: () => {
          setGone(true);
          onDone?.();
        },
      });
      tl.to(path, { strokeDashoffset: 0, duration: fast ? 0.5 : 1.5, ease: "power2.inOut" }, 0)
        .to(counter, {
          v: 100,
          duration: fast ? 0.5 : 1.5,
          ease: "power2.inOut",
          onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, "0")),
        }, 0)
        .from(".ld-word span", { yPercent: 110, stagger: 0.05, duration: 0.7, ease: "power4.out" }, fast ? 0 : 0.25)
        .to(".ld-ring", { rotate: 40, scale: 0.9, duration: fast ? 0.3 : 0.6, ease: "power2.in" }, "-=0.15")
        .to(".ld-inner", { autoAlpha: 0, scale: 0.92, duration: 0.35, ease: "power2.in" }, "<0.15")
        .to(root.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: fast ? 0.55 : 0.95,
          ease: "expo.inOut",
        }, "-=0.05");
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="ld-inner">
        <svg className="ld-ring" viewBox="0 0 240 240">
          <path className="ld-path" d={PATH} />
        </svg>
        <div className="ld-word">
          {"ASADBEK".split("").map((c, i) => <span key={i}>{c}</span>)}
        </div>
      </div>
      <div className="ld-foot">
        <span>Baxromjonov · Portfolio</span>
        <span className="ld-num">000</span>
      </div>
    </div>
  );
}
