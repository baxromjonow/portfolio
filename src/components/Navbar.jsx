import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  ["Bosh sahifa", "home"],
  ["Men haqimda", "about"],
  ["Faoliyatim", "career"],
  ["Yo‘nalishlar", "skills"],
  ["Media", "media"],
  ["Aloqa", "contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      animate={{
        backgroundColor: scrolled ? "rgba(5,8,22,.9)" : "rgba(5,8,22,.68)",
        borderColor: scrolled ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.07)",
      }}
      className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl"
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 lg:px-8 ${scrolled ? "h-[72px]" : "h-[86px]"}`}>
        <a href="#home" className="group flex shrink-0 items-center" aria-label="Bosh sahifa">
          <img
            src="/ba-logo.png"
            className={`w-auto object-contain transition duration-300 group-hover:scale-[1.025] ${scrolled ? "h-[45px]" : "h-[52px]"}`}
            alt="Baxromjonov Asadbek logotipi"
          />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, id]) => (
            <a
              key={id}
              className="relative text-sm font-semibold text-slate-300 transition after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-cyan after:transition-all hover:text-cyan hover:after:w-full"
              href={`#${id}`}
            >
              {label}
            </a>
          ))}
          <a href="#contact" className="rounded-xl border border-electric/60 px-5 py-2.5 text-sm font-bold transition hover:bg-electric">
            Bog‘lanish
          </a>
        </nav>

        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menyuni ochish">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="border-t border-white/10 bg-[#070b18] px-5 py-5 lg:hidden"
          >
            {links.map(([label, id]) => (
              <a onClick={() => setOpen(false)} key={id} className="block border-b border-white/5 py-3 text-slate-200" href={`#${id}`}>
                {label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
