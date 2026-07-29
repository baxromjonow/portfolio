import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="fixed inset-0 z-[200] grid place-items-center bg-[#050816]">
          <div className="text-center">
            <motion.img
              src="/ba-monogram.png"
              initial={{ scale: 0.55, opacity: 0, rotateY: -35 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto h-28 w-36 object-contain drop-shadow-[0_0_28px_rgba(40,123,255,.45)]"
              alt="BA"
            />
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-5 text-xs font-bold tracking-[.45em] text-slate-400">
              BAXROMJONOV ASADBEK
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
