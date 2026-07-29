import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [mode, setMode] = useState("default");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (event) => setPosition({ x: event.clientX, y: event.clientY });
    const hover = (event) => {
      const target = event.target.closest("a, button, input, textarea, select, [data-cursor]");
      if (!target) return setMode("default");
      if (target.matches("input, textarea, select")) setMode("text");
      else setMode("link");
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", hover);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", hover);
    };
  }, []);

  return (
    <motion.div
      className={`cursor-dot cursor-${mode}`}
      animate={{ x: position.x - 5, y: position.y - 5 }}
      transition={{ type: "spring", stiffness: 900, damping: 45, mass: 0.15 }}
    />
  );
}
