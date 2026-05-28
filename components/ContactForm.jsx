"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Eye, LoaderCircle, Mail, MessageSquareHeart, Phone, ShieldCheck, UserRound, XCircle } from "lucide-react";

const requestTypes = [
  { value: "general", label: "General message" },
  { value: "prayer", label: "Prayer request" },
  { value: "retreat", label: "Retreat question" },
  { value: "volunteer", label: "Volunteer" },
  { value: "partnership", label: "Partnership" },
  { value: "care", label: "Pastoral care" }
];

function makeCaptcha() {
  return {
    a: Math.floor(Math.random() * 6) + 3,
    b: Math.floor(Math.random() * 5) + 2
  };
}

export default function ContactForm({ settings }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requestType: "general",
    subject: "",
    message: "",
    website: "",
    captchaAnswer: ""
  });
  const [captcha, setCaptcha] = useState({ a: 4, b: 5 });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCaptcha(makeCaptcha());
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  function resetCaptcha() {
    setCaptcha(makeCaptcha());
    setFormData((prev) => ({ ...prev, captchaAnswer: "" }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          captchaA: captcha.a,
          captchaB: captcha.b,
          sourcePage: "/contact"
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || settings?.contactSuccessMessage || "Your message has been sent successfully.");
        setFormData({ name: "", email: "", phone: "", requestType: "general", subject: "", message: "", website: "", captchaAnswer: "" });
        resetCaptcha();
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to send message. Please try again.");
        resetCaptcha();
      }
    } catch (error) {
      setStatus("error");
      setMessage("Unable to reach the contact service. Please try again.");
      resetCaptcha();
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="grid w-full gap-4"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <IconField icon={UserRound}>
          <input className="input-reset" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        </IconField>
        <IconField icon={Mail}>
          <input className="input-reset" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        </IconField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <IconField icon={Phone}>
          <input className="input-reset" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone optional" />
        </IconField>
        <select className="input-field" name="requestType" value={formData.requestType} onChange={handleChange}>
          {requestTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <IconField icon={MessageSquareHeart}>
        <input className="input-reset" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" />
      </IconField>
      <textarea
        className="input-field min-h-40 resize-y"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Write your message, prayer request, or ministry question..."
        required
      />

      <input
        className="hidden"
        name="website"
        value={formData.website}
        onChange={handleChange}
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/24 p-4 sm:grid-cols-[1fr_160px] sm:items-center">
        <div className="flex items-center gap-3 text-sm text-white/64">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-yellow-200/12 text-yellow-100">
            <ShieldCheck size={18} />
          </span>
          <span>Security check: what is {captcha.a} + {captcha.b}?</span>
        </div>
        <input
          className="input-field"
          inputMode="numeric"
          name="captchaAnswer"
          value={formData.captchaAnswer}
          onChange={handleChange}
          placeholder="Answer"
          required
        />
      </div>

      <motion.button
        type="submit"
        disabled={status === "submitting"}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:justify-self-start"
      >
        {status === "submitting" ? <LoaderCircle className="animate-spin" size={18} /> : <Eye size={18} />}
        {status === "submitting" ? "Sending securely..." : "Send message"}
      </motion.button>

      <AnimatePresence>
        {(status === "success" || status === "error") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${
              status === "success"
                ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"
                : "border-red-400/24 bg-red-500/10 text-red-100"
            }`}
          >
            {status === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

function IconField({ icon: Icon, children }) {
  return (
    <label className="flex min-h-[3.25rem] items-center gap-3 rounded-[14px] border border-white/12 bg-white/[0.06] px-4 text-white transition focus-within:border-yellow-200/60 focus-within:shadow-[0_0_0_4px_rgba(216,184,106,0.08)]">
      <Icon size={18} className="shrink-0 text-white/42" />
      {children}
    </label>
  );
}
