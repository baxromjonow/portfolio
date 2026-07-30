import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const items = [
  {
    src: "/asadbek-hero.png",
    title: "Professional portret",
    type: "Shaxsiy brend",
    note: "Portfolio uchun asosiy portret va shaxsiy uslub.",
    position: "center 20%",
  },
  {
    src: "/asadbek-academy.png",
    title: "Al-Aziz Academy",
    type: "Faoliyat",
    note: "Ta'lim, dars jarayonlari va akademiyadagi faoliyat.",
    position: "center 18%",
  },
  {
    src: "/asadbek-casual.png",
    title: "IT muhiti",
    type: "Kadr ortida",
    note: "Dasturlash, loyihalar va kundalik ish jarayonidan lavha.",
    position: "center 16%",
  },
];

export default function Media() {
  const [activeIndex, setActiveIndex] = useState(null);
  const active = activeIndex === null ? null : items[activeIndex];

  const close = () => setActiveIndex(null);
  const prev = () => setActiveIndex((current) => (current - 1 + items.length) % items.length);
  const next = () => setActiveIndex((current) => (current + 1) % items.length);

  useEffect(() => {
    if (activeIndex === null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex]);

  return (
    <section id="media" className="media-section relative overflow-hidden border-y border-white/10 py-24 sm:py-28">
      <div className="media-glow media-glow-left" />
      <div className="media-glow media-glow-right" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="section-kicker mx-auto"><Sparkles size={14} /> Media</div>
          <h2 className="section-title mt-5">Faoliyatimdan <span className="text-gradient">lavhalar.</span></h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
            Shaxsiy brend, ta'lim muhiti va kundalik IT faoliyatimdan saralangan kadrlar.
          </p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <motion.button
              type="button"
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.42, delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              onClick={() => setActiveIndex(index)}
              className="media-card-v3 group relative overflow-hidden rounded-[1.65rem] text-left"
              aria-label={`${item.title} rasmini kattalashtirish`}
            >
              <div className="media-image-stage">
                <div className="media-image-halo" aria-hidden="true" />
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="media-image-contain"
                  style={{ objectPosition: item.position }}
                />
                <div className="media-image-fade" />
                <span className="media-expand-v3"><Maximize2 size={17} /></span>
              </div>

              <div className="media-copy-v3">
                <div className="flex items-center justify-between gap-4">
                  <span className="media-pill">{item.type}</span>
                  <span className="text-[11px] font-bold tracking-[.18em] text-slate-600">0{index + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-extrabold tracking-tight text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.note}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="media-modal fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => event.currentTarget === event.target && close()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.22 }}
              className="media-viewer relative w-full max-w-4xl overflow-hidden rounded-[2rem]"
            >
              <div className="relative flex min-h-[48vh] items-center justify-center bg-[#050918] p-4 sm:p-7">
                <img src={active.src} alt={active.title} className="max-h-[68vh] max-w-full object-contain" />
                <button type="button" onClick={close} className="media-icon-button absolute right-4 top-4" aria-label="Yopish"><X size={20} /></button>
                <button type="button" onClick={prev} className="media-icon-button absolute left-4 top-1/2 -translate-y-1/2" aria-label="Oldingi rasm"><ChevronLeft size={22} /></button>
                <button type="button" onClick={next} className="media-icon-button absolute right-4 top-1/2 -translate-y-1/2" aria-label="Keyingi rasm"><ChevronRight size={22} /></button>
              </div>

              <div className="flex flex-col gap-3 border-t border-white/10 bg-slate-950/95 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="media-pill">{active.type}</span>
                  <h3 className="mt-2 text-xl font-extrabold">{active.title}</h3>
                </div>
                <p className="max-w-xl text-sm leading-6 text-slate-400">{active.note}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
