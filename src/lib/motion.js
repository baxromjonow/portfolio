import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out" });

export { gsap, ScrollTrigger };

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

let lenis = null;
export const getLenis = () => lenis;

// Silliq scroll: Lenis + GSAP ScrollTrigger bitta ritmda ishlaydi.
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled || prefersReduced()) return undefined;
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, [enabled]);
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth" });
}

export function lockScroll(lock) {
  if (lenis) (lock ? lenis.stop() : lenis.start());
  document.documentElement.classList.toggle("is-locked", lock);
}

// Ekranda ko'ringanda .is-live klassini qo'shadi (CSS animatsiyalar faqat shunda yuradi).
export function useLive(options = { rootMargin: "120px" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      el.classList.toggle("is-live", entry.isIntersecting);
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

// Matnni so'z/harflarga bo'lish (SplitText o'rniga yengil yechim).
export function splitChars(text) {
  return Array.from(text).map((ch, i) => ({ ch: ch === " " ? " " : ch, i }));
}
