import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

/**
 * CursorGlow — Halo circulaire qui suit le curseur de façon fluide.
 * Désactivé sur les appareils tactiles / écrans fins.
 */
const CursorGlow: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Spring pour un suivi fluide du curseur
  const x = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 });
  const y = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 });

  useEffect(() => {
    // N'activer que sur les appareils avec une souris fine
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest("a, button, input, textarea, select, [role='button']")) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
    >
      <motion.div
        animate={{
          scale: hovering ? 1.6 : 1,
          opacity: hovering ? 0.35 : 0.18,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        className="-translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 64,
          height: 64,
          background: "radial-gradient(circle, rgba(2,56,214,0.9) 0%, rgba(2,56,214,0) 70%)",
          filter: "blur(2px)",
        }}
      />
    </motion.div>
  );
};

export default CursorGlow;
