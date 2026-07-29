import { motion } from "framer-motion";

const techs = [
  { label: "HTML", cls: "tech-html", x: "8%", y: "18%", delay: 0 },
  { label: "CSS", cls: "tech-css", x: "82%", y: "14%", delay: 1.2 },
  { label: "JS", cls: "tech-js", x: "72%", y: "42%", delay: 2.1 },
  { label: "REACT", cls: "tech-react", x: "15%", y: "63%", delay: 0.7 },
  { label: "</>", cls: "tech-code", x: "88%", y: "75%", delay: 1.8 },
  { label: "{ }", cls: "tech-code", x: "38%", y: "84%", delay: 2.8 },
];

export default function FloatingTech() {
  return (
    <div className="floating-tech" aria-hidden="true">
      {techs.map((tech, index) => (
        <motion.div
          key={`${tech.label}-${index}`}
          className={`tech-badge ${tech.cls}`}
          style={{ left: tech.x, top: tech.y }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.035, 0.085, 0.045],
            y: [0, -12, 0],
            x: [0, index % 2 ? 7 : -7, 0],
            rotate: [0, index % 2 ? 4 : -4, 0],
          }}
          transition={{ duration: 12 + index * 0.8, delay: tech.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {tech.label}
        </motion.div>
      ))}
    </div>
  );
}
