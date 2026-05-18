"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.message || "Invalid admin credentials.");
        return;
      }

      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next?.startsWith("/admin") ? next : "/admin/dashboard");
      router.refresh();
    } catch {
      setLoading(false);
      setError("Unable to reach the login service. Please try again.");
      return;
    }
  }

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-[#050505] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(216,184,106,0.18),transparent_30rem),radial-gradient(circle_at_80%_20%,rgba(125,38,61,0.24),transparent_32rem)]" />
      <div className="absolute inset-0 cinema-bg opacity-26" />
      <div className="absolute inset-0 bg-black/54" />

      <div className="relative z-10 grid place-items-center">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="relative rounded-[34px] border border-yellow-100/20 bg-[#10100f]/88 p-8 shadow-[0_0_110px_rgba(216,184,106,0.18)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 rounded-[34px] bg-gradient-to-br from-yellow-200/12 via-white/[0.025] to-red-300/10" />
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-yellow-200/30 bg-yellow-200/12 text-yellow-100"
              >
                <Sparkles size={24} />
              </motion.div>

              <div className="mt-7 text-center">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/58">
                  <ShieldCheck size={14} className="text-yellow-200" />
                  Secure admin access
                </p>
                <h1 className="mt-4 font-[var(--font-playfair)] text-5xl font-semibold text-white">Welcome back</h1>
                <p className="mt-3 text-sm leading-6 text-white/68">Manage retreats, ministry content, and live site settings.</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
                <label className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/38" size={18} />
                  <input
                    className="input-field pl-12"
                    style={{ paddingLeft: "3rem" }}
                    type="email"
                    placeholder="Admin email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>
                <label className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/38" size={18} />
                  <input
                    className="input-field px-12"
                    style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-white/44 hover:bg-white/10 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="btn-primary mt-2" disabled={loading}>
                  {loading ? <LoaderCircle className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                  {loading ? "Signing in..." : "Enter dashboard"}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
