import { useEffect, useRef } from "react";
import { gsap, prefersReduced, useIsoLayoutEffect } from "../lib/motion";

const facts = [
  ["Ta’lim", "Toshkent davlat texnika universiteti"],
  ["Hozir", "Al-Aziz Academy · Chinoz filiali"],
  ["Avval", "Al-Aziz Academy · Gulbahor filiali"],
  ["O‘quvchilar", "10–18 yosh"],
];

const teach = ["HTML", "CSS", "JavaScript", "React", "Word", "Excel", "PowerPoint", "Canva", "Arduino"];

// Van Gogh "Yulduzli tun" gravyurasiga o'xshash oqim chiziqlari — bir marta canvas'ga chiziladi.
function Swirl() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = cv.clientWidth;
      const H = cv.clientHeight;
      if (!W || !H) return;
      cv.width = W * dpr;
      cv.height = H * dpr;
      const c = cv.getContext("2d");
      c.scale(dpr, dpr);
      c.fillStyle = "#08090c";
      c.fillRect(0, 0, W, H);
      const vortices = [
        [0.22, 0.3, 0.2],
        [0.7, 0.22, 0.16],
        [0.55, 0.7, 0.24],
        [0.9, 0.62, 0.12],
        [0.12, 0.8, 0.14],
      ].map(([x, y, r]) => [x * W, y * H, r * Math.max(W, H)]);
      const flow = (x, y) => {
        let a = Math.sin(x * 0.0035 + y * 0.002) * 0.9 + Math.cos(y * 0.004 - x * 0.0015) * 0.6;
        for (const [vx, vy, vr] of vortices) {
          const dx = x - vx;
          const dy = y - vy;
          const d = Math.hypot(dx, dy);
          const k = Math.exp(-(d * d) / (vr * vr));
          a = a * (1 - k) + (Math.atan2(dy, dx) + Math.PI / 2) * k;
        }
        return a;
      };
      const gap = W < 700 ? 9 : 11;
      for (let y0 = -H * 0.2; y0 < H * 1.2; y0 += gap) {
        for (let pass = 0; pass < 2; pass++) {
          let x = pass === 0 ? -20 : W * 0.5;
          let y = y0 + (pass ? gap / 2 : 0);
          c.beginPath();
          c.moveTo(x, y);
          for (let i = 0; i < 260; i++) {
            const a = flow(x, y);
            x += Math.cos(a) * 6;
            y += Math.sin(a) * 6;
            c.lineTo(x, y);
            if (x > W + 20 || x < -40 || y < -40 || y > H + 40) break;
          }
          const g = 0.1 + 0.12 * Math.abs(Math.sin(y0 * 0.013 + pass));
          c.strokeStyle = `rgba(214, 222, 240, ${g.toFixed(3)})`;
          c.lineWidth = 1;
          c.stroke();
        }
      }
      for (const [vx, vy, vr] of vortices) {
        const grd = c.createRadialGradient(vx, vy, 0, vx, vy, vr * 0.35);
        grd.addColorStop(0, "rgba(134, 180, 255, 0.22)");
        grd.addColorStop(1, "rgba(134, 180, 255, 0)");
        c.fillStyle = grd;
        c.fillRect(vx - vr, vy - vr, vr * 2, vr * 2);
      }
    };
    draw();
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(draw, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return <canvas ref={ref} />;
}

export default function About() {
  const root = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const mm = gsap.matchMedia();
    mm.add(
      { desktop: "(min-width: 820px)", mobile: "(max-width: 819px)" },
      (c) => {
        const { desktop } = c.conditions;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".ab-stage",
            start: "top top",
            end: desktop ? "+=170%" : "+=130%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });
        tl.fromTo(
          ".ab-card",
          { clipPath: desktop ? "inset(26% 34% 26% 34% round 28px)" : "inset(30% 14% 30% 14% round 24px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 }
        )
          .fromTo(".ab-card img", { scale: 1.5, yPercent: 10 }, { scale: 1, yPercent: 0, ease: "power2.inOut", duration: 1 }, 0)
          .to(".ab-card-title", { scale: 2.4, autoAlpha: 0, ease: "power2.in", duration: 0.55 }, 0.1)
          .fromTo(".ab-shade", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.6)
          .fromTo(".ab-content > *", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.4 }, 0.75)
          .to({}, { duration: 0.35 });
        gsap.to(".ab-tex", {
          rotate: 12,
          scale: 1.25,
          ease: "none",
          scrollTrigger: { trigger: ".ab-stage", start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    );
    return () => mm.revert();
  }, []);

  return (
    <section className="about" id="about" ref={root}>
      <div className="ab-stage">
        <div className="ab-tex" aria-hidden="true">
          <Swirl />
        </div>

        <div className="ab-card">
          <img src="/img/asadbek-casual.webp" alt="Baxromjonov Asadbek ish joyida" width="1000" height="1333" loading="lazy" />
          <div className="ab-shade" />
          <h2 className="ab-card-title" aria-hidden="true">Men<br />haqimda</h2>
          <div className="ab-content">
            <p className="eyebrow">Men haqimda</p>
            <h3>Baxromjonov Asadbek</h3>
            <p className="ab-bio">
              Al-Aziz Academy Chinoz filialida IT instructor va frontend developerman. Darsda kod yozishni o‘rgataman,
              qolgan vaqtimda markaz va o‘quvchilar uchun platforma, bot va darsliklar yarataman. Loyihalarimni o‘z
              serverimda Docker bilan ishga tushiraman.
            </p>
            <dl className="ab-facts">
              {facts.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            <div className="ab-teach">
              {teach.map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
