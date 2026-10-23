import { useEffect, useRef, useState } from "react";
import { gsap, scrollToId, lockScroll } from "../lib/motion";

const links = [
  ["Ishlar", "works"],
  ["Men haqimda", "about"],
  ["Botlar", "bots"],
  ["Barcha loyihalar", "index"],
  ["Aloqa", "contact"],
];

function useTashkentTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("uz-UZ", {
      timeZone: "Asia/Tashkent",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const overlay = useRef(null);
  const time = useTashkentTime();

  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    lockScroll(open);
    if (open) {
      gsap.fromTo(el, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.8, ease: "expo.inOut" });
      gsap.fromTo(el.querySelectorAll(".mnu-link span"), { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 0.8, delay: 0.25, ease: "power4.out" });
    } else {
      gsap.to(el, { clipPath: "circle(0% at 100% 0%)", duration: 0.55, ease: "expo.inOut" });
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 450 : 0);
  };

  return (
    <>
      <header className="nav">
        <a href="#top" className="nav-logo" onClick={go("top")} aria-label="Bosh sahifa">
          <img src="/img/ba-monogram.webp" alt="" width="40" height="32" />
          <span>Baxromjonov</span>
        </a>
        <nav className="nav-links" aria-label="Asosiy menyu">
          {links.map(([l, id]) => (
            <a key={id} href={`#${id}`} onClick={go(id)}>{l}</a>
          ))}
        </nav>
        <div className="nav-right">
          <span className="nav-time" title="Toshkent vaqti">Chinoz · {time}</span>
          <button
            type="button"
            className={`nav-burger ${open ? "is-open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={open}
          >
            <i /><i />
          </button>
        </div>
      </header>

      <div className="mnu" data-lenis-prevent ref={overlay} aria-hidden={!open} style={{ clipPath: "circle(0% at 100% 0%)" }}>
        <nav>
          {links.map(([l, id], i) => (
            <a key={id} href={`#${id}`} className="mnu-link" onClick={go(id)} tabIndex={open ? 0 : -1}>
              <span><small>{String(i + 1).padStart(2, "0")}</small>{l}</span>
            </a>
          ))}
        </nav>
        <p className="mnu-foot">Frontend developer · IT instructor · Al-Aziz Academy Chinoz</p>
      </div>
    </>
  );
}
