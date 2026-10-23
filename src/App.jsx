import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger, useSmoothScroll } from "./lib/motion";
import { projects } from "./data/projects";
import Loader from "./components/Loader";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import About from "./components/About";
import Band from "./components/Band";
import Wall from "./components/Wall";
import Works from "./components/Works";
import Bots from "./components/Bots";
import Index from "./components/Index";
import Pipeline from "./components/Pipeline";
import Journey from "./components/Journey";
import Moments from "./components/Moments";
import StudentWorks from "./components/StudentWorks";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProjectModal from "./components/ProjectModal";

const HASH = "ish-";

function idFromHash() {
  const h = decodeURIComponent(window.location.hash.slice(1));
  if (!h.startsWith(HASH)) return null;
  const id = h.slice(HASH.length);
  return projects.some((p) => p.id === id) ? id : null;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [openId, setOpenId] = useState(() => (typeof window !== "undefined" ? idFromHash() : null));

  useSmoothScroll(true);

  // Har bir loyihaning o'z havolasi bor: baxromjonov.uz/#ish-qr
  const open = useCallback((id) => {
    setOpenId(id);
    history.replaceState(null, "", `#${HASH}${id}`);
  }, []);
  const close = useCallback(() => {
    setOpenId(null);
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);
  const nav = useCallback(
    (dir) => {
      setOpenId((cur) => {
        const i = projects.findIndex((p) => p.id === cur);
        const next = projects[(i + dir + projects.length) % projects.length].id;
        history.replaceState(null, "", `#${HASH}${next}`);
        return next;
      });
    },
    []
  );

  useEffect(() => {
    const onHash = () => setOpenId(idFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Shriftlar va rasmlar yuklangach o'lchamlarni qayta hisoblash.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <Loader onDone={() => setReady(true)} />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Manifesto />
        <About />
        <Band />
        <Wall />
        <Works onOpen={open} />
        <Bots onOpen={open} />
        <Index onOpen={open} />
        <Pipeline />
        <Journey />
        <Moments />
        <StudentWorks />
        <Contact />
      </main>
      <Footer />
      <ProjectModal id={openId} onClose={close} onNav={nav} />
    </>
  );
}
