"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;
  const success = toast.type !== "error";
  const Icon = success ? CircleCheck : CircleAlert;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        className={`fixed bottom-5 right-5 z-[90] flex max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
          success ? "border-emerald-300/25 bg-emerald-500/12 text-emerald-50" : "border-red-300/25 bg-red-500/12 text-red-50"
        }`}
        onClick={onClose}
      >
        <Icon size={20} className={success ? "text-emerald-200" : "text-red-200"} />
        <p className="text-sm leading-6">{toast.message}</p>
      </motion.div>
    </AnimatePresence>
  );
}
