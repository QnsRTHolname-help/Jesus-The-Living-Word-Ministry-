"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";

export default function RetreatCard({ retreat }) {
  const date = new Date(retreat.date).toLocaleDateString("en", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.992 }}
      className="shine-card group overflow-hidden rounded-[clamp(1.25rem,3vw,1.75rem)] border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/20 backdrop-blur-xl transition-[transform,box-shadow] duration-300 md:hover:-translate-y-2 md:hover:border-white/16 md:hover:shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
    >
      <Link href={`/retreats/${retreat._id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-white/8 sm:aspect-[16/9]">
          <img
            src={retreat.image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"}
            alt=""
            className="h-full w-full object-cover transition duration-700 ease-out will-change-transform md:group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent" />
        </div>
        <div className="p-5 sm:p-6">
          <h3 className="font-[var(--font-playfair)] text-xl font-semibold leading-snug sm:text-2xl">{retreat.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/58 sm:leading-7">{retreat.description}</p>
          <div className="mt-5 grid gap-2 text-sm text-white/66">
            <span className="flex items-start gap-2">
              <CalendarDays size={16} className="mt-0.5 shrink-0 text-yellow-200" />
              {date}
            </span>
            <span className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-yellow-200" />
              <span className="leading-snug">{retreat.location}</span>
            </span>
          </div>
          <span className="btn-ghost mt-6 min-h-11 w-full justify-center px-4 text-sm sm:inline-flex sm:min-h-10 sm:w-auto">View details</span>
        </div>
      </Link>
    </motion.article>
  );
}
