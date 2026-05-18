"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 420, damping: 34 });
  const springY = useSpring(y, { stiffness: 420, damping: 34 });
  const dotX = useSpring(x, { stiffness: 700, damping: 28 });
  const dotY = useSpring(y, { stiffness: 700, damping: 28 });

  useEffect(() => {
    const move = (event) => {
      setVisible(true);
      x.set(event.clientX - 18);
      y.set(event.clientY - 18);
    };
    const leave = () => setVisible(false);
    const over = (event) => {
      setActive(Boolean(event.target.closest("a, button, input, textarea, [data-cursor='active']")));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseout", leave);
    document.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseout", leave);
      document.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-9 w-9 rounded-full border-2 border-yellow-200/80 bg-yellow-200/10 shadow-[0_0_28px_rgba(216,184,106,0.45)] md:block"
        style={{ x: springX, y: springY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: active ? 1.65 : 1
        }}
        transition={{ duration: 0.16 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[10000] hidden h-2.5 w-2.5 rounded-full bg-yellow-100 shadow-[0_0_18px_rgba(255,239,184,0.95)] md:block"
        style={{ x: dotX, y: dotY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: active ? 0.9 : 1
        }}
        transition={{ duration: 0.12 }}
      />
    </>
  );
}
