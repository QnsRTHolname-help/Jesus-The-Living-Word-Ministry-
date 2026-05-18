"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

export default function GalleryGrid({ images }) {
  const [active, setActive] = useState(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <motion.button
            key={`${image}-${index}`}
            type="button"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.04 }}
            onClick={() => setActive(image)}
            className="group relative aspect-[4/3] overflow-hidden rounded-[24px] border border-white/10 bg-white/8 text-left"
          >
            <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/74 via-transparent to-transparent opacity-70 transition group-hover:opacity-40" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-black/86 p-4 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              aria-label="Close preview"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white"
              onClick={() => setActive(null)}
            >
              <X size={20} />
            </button>
            <motion.img
              src={active}
              alt=""
              className="max-h-[86vh] w-full max-w-5xl rounded-[28px] object-contain shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
