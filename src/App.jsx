import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Career from "./components/Career";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Media from "./components/Media";
import StudentProjects from "./components/StudentProjects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import FloatingTech from "./components/FloatingTech";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Loader show={loading} />
      <FloatingTech />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Career />
        <Education />
        <Skills />
        <Media />
        <StudentProjects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
