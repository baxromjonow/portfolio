import { useEffect, useRef, useState } from "react";
import { gsap, prefersReduced, useIsoLayoutEffect } from "../lib/motion";
import { projects } from "../data/projects";

const steps = [
  ["Kod", "React, Next.js, Node.js yoki Go. VS Code va GitHub."],
  ["Arxiv", "Loyiha .zip bo‘lib serverga yuboriladi."],
  ["Ubuntu server", "O‘z serverim: Ubuntu 24.04, 16 GB RAM."],
  ["Docker Compose", "Har loyiha alohida konteynerda, bir-biriga xalal bermaydi."],
  ["Nginx", "Statik fayllar va proksi, tez javob."],
  ["Cloudflare Tunnel", "Port ochmasdan, HTTPS bilan internetga chiqadi."],
];

const domains = projects.filter((p) => p.url);

// Brauzer har bir manzilga "no-cors" so'rov yuboradi: javob kelsa — ishlayapti.
function usePing() {
  const [state, setState] = useState({});
  useEffect(() => {
    let alive = true;
    domains.forEach((p) => {
      if (p.url.startsWith("https://t.me")) {
        setState((s) => ({ ...s, [p.id]: "bot" }));
        return;
      }
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 7000);
      const started = performance.now();
      fetch(p.url, { mode: "no-cors", cache: "no-store", signal: ctrl.signal })
        .then(() => alive && setState((s) => ({ ...s, [p.id]: Math.round(performance.now() - started) })))
        .catch(() => alive && setState((s) => ({ ...s, [p.id]: "off" })))
        .finally(() => clearTimeout(t));
    });
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

export default function Pipeline() {
  const root = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: "200px" });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useIsoLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".pl-steps", start: "top 75%", end: "bottom 55%", scrub: 0.6 },
      });
      tl.fromTo(".pl-line i", { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 1 }, 0);
      gsap.utils.toArray(".pl-step").forEach((el, i, arr) => {
        tl.fromTo(el, { autoAlpha: 0.15, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.25 }, (i / arr.length) * 0.9);
        tl.fromTo(el.querySelector(".pl-dot"), { scale: 0.3 }, { scale: 1, duration: 0.15 }, (i / arr.length) * 0.9);
      });
      gsap.from(".pl-board li", {
        y: 20,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.6,
        scrollTrigger: { trigger: ".pl-board", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="pipeline paper" ref={root}>
      <div className="wrap pl-wrap">
        <div className="pl-left">
          <p className="eyebrow">Deploy</p>
          <h2 className="display">Koddan<br /><em>internetgacha</em></h2>
          <p className="pl-lead">
            Hosting uchun obuna to‘lamayman. Loyihalarim o‘z serverimda ishlaydi va men ularni boshidan oxirigacha
            o‘zim ishga tushiraman.
          </p>
          {visible && <Board />}
        </div>
        <div className="pl-steps">
          <div className="pl-line" aria-hidden="true"><i /></div>
          <ol>
          {steps.map(([t, d], i) => (
            <li className="pl-step" key={t}>
              <span className="pl-dot" aria-hidden="true" />
              <span className="pl-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Board() {
  const ping = usePing();
  return (
    <ul className="pl-board" aria-label="Jonli manzillar holati">
      {domains.map((p) => {
        const s = ping[p.id];
        const state = s === undefined ? "wait" : s === "off" ? "off" : "on";
        return (
          <li key={p.id} className={`is-${state}`}>
            <i aria-hidden="true" />
            <a href={p.url} target="_blank" rel="noreferrer noopener">{p.domain}</a>
            <span>
              {s === undefined ? "tekshirilmoqda" : s === "off" ? "javob yo‘q" : s === "bot" ? "Telegram" : `${s} ms`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
