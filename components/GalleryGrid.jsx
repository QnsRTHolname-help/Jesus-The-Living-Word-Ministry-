"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

export default function GalleryGrid({ images }) {
  const [active, setActive] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {images.map((image, index) => (
          <motion.button
            key={`${image}-${index}`}
            type="button"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5, delay: index * 0.04 }}
            onClick={() => setActive(image)}
            className="group relative aspect-[4/3] min-h-[12rem] w-full overflow-hidden rounded-[clamp(1rem,2.5vw,1.5rem)] border border-white/10 bg-white/8 text-left touch-manipulation outline-none ring-offset-2 ring-offset-[#050505] transition-shadow focus-visible:ring-2 focus-visible:ring-yellow-200/70 sm:min-h-0"
          >
            <img src={image} alt="" className="h-full w-full object-cover transition duration-700 ease-out will-change-transform md:group-hover:scale-105" />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/74 via-transparent to-transparent opacity-70 transition group-hover:opacity-45 group-active:opacity-90" />
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/80 opacity-80 sm:bottom-4 sm:left-4 sm:text-[11px] sm:opacity-0 sm:group-hover:opacity-100">
              Tap to enlarge
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-black/88 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              aria-label="Close preview"
              className="absolute right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] grid h-12 w-12 touch-manipulation place-items-center rounded-full bg-white/12 text-white transition hover:bg-white/20 sm:right-6 sm:top-6 sm:h-11 sm:w-11"
              onClick={() => setActive(null)}
            >
              <X size={22} />
            </button>
            <motion.img
              src={active}
              alt=""
              className="max-h-[min(88dvh,88vh)] w-full max-w-5xl rounded-[clamp(1rem,2vw,1.75rem)] object-contain shadow-2xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
