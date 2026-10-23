import { scrollToId } from "../lib/motion";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap ft-row">
        <img src="/ba-logo.png" alt="Baxromjonov Asadbek" className="ft-logo" width="1596" height="352" loading="lazy" />
        <p>© {new Date().getFullYear()} Baxromjonov Asadbek · Chinoz, O‘zbekiston</p>
        <a href="#top" onClick={(e) => { e.preventDefault(); scrollToId("top"); }} className="ft-top">Tepaga ↑</a>
      </div>
    </footer>
  );
}
