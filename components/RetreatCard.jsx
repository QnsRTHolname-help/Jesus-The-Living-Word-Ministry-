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
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/20 backdrop-blur-xl"
    >
      <Link href={`/retreats/${retreat._id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-white/8">
          <img
            src={retreat.image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/10 to-transparent" />
        </div>
        <div className="p-6">
          <h3 className="font-[var(--font-playfair)] text-2xl font-semibold">{retreat.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/58">{retreat.description}</p>
          <div className="mt-5 grid gap-2 text-sm text-white/66">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} className="text-yellow-200" />
              {date}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-yellow-200" />
              {retreat.location}
            </span>
          </div>
          <span className="btn-ghost mt-6 min-h-10 px-4 text-sm">View details</span>
        </div>
      </Link>
    </motion.article>
  );
}
