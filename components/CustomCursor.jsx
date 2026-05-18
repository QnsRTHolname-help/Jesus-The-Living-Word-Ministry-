"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);
  const dotRawX = useMotionValue(-100);
  const dotRawY = useMotionValue(-100);
  const springX = useSpring(ringX, { stiffness: 420, damping: 34 });
  const springY = useSpring(ringY, { stiffness: 420, damping: 34 });
  const dotX = useSpring(dotRawX, { stiffness: 850, damping: 30 });
  const dotY = useSpring(dotRawY, { stiffness: 850, damping: 30 });

  useEffect(() => {
    const move = (event) => {
      setVisible(true);
      ringX.set(event.clientX - 18);
      ringY.set(event.clientY - 18);
      dotRawX.set(event.clientX - 5);
      dotRawY.set(event.clientY - 5);
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
  }, [ringX, ringY, dotRawX, dotRawY]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="custom-cursor-only pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border-2 border-yellow-200/85 bg-yellow-200/10 shadow-[0_0_28px_rgba(216,184,106,0.45),inset_0_0_18px_rgba(216,184,106,0.08)]"
        style={{ x: springX, y: springY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: active ? 1.55 : 1
        }}
        transition={{ duration: 0.16 }}
      />
      <motion.div
        aria-hidden="true"
        className="custom-cursor-only pointer-events-none fixed left-0 top-0 z-[10000] h-2.5 w-2.5 rounded-full bg-yellow-100 shadow-[0_0_18px_rgba(255,239,184,0.95)]"
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
