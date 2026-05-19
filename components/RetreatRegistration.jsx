"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LoaderCircle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RetreatRegistration({ retreat }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", guests: "1", notes: "" });

  if (!retreat.registrationEnabled) {
    return (
      <Link href="/contact" className="btn-primary mt-6 w-full sm:mt-7 flex justify-center">
        Register interest <ArrowRight size={18} />
      </Link>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch(`/api/retreats/${retreat._id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary mt-6 w-full sm:mt-7 flex justify-center">
        Register Now
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0d0d0c] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-200 to-yellow-600" />
              
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-[var(--font-playfair)] font-semibold text-white">Retreat Registration</h2>
                    <p className="text-sm text-yellow-100/70 mt-1">{retreat.title}</p>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition">
                    <X size={24} />
                  </button>
                </div>

                {status === "success" ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center">
                    <CheckCircle className="mx-auto h-16 w-16 text-yellow-200" />
                    <h3 className="text-xl font-semibold mt-4">Registration Received!</h3>
                    <p className="text-white/60 mt-2">We have securely recorded your registration and will be in touch soon.</p>
                    <button onClick={() => setIsOpen(false)} className="btn-ghost mt-8 px-8">Close</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid gap-4">
                    <input required className="input-field" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <input required type="email" className="input-field" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                      <input className="input-field" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                      <input required type="number" min="1" className="input-field" placeholder="Number of Guests" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} />
                    </div>
                    <textarea className="input-field min-h-24 resize-y" placeholder="Special requirements or notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                    
                    {status === "error" && (
                      <p className="text-red-400 text-sm">Failed to submit registration. Please try again.</p>
                    )}
                    
                    <button type="submit" disabled={status === "submitting"} className="btn-primary mt-2 justify-center">
                      {status === "submitting" ? <LoaderCircle className="animate-spin" size={20} /> : null}
                      {status === "submitting" ? "Submitting..." : "Complete Registration"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
