"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/retreats", label: "Retreats" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar({ settings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/62 shadow-2xl shadow-black/30 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="container-shell flex min-h-20 items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-yellow-200/30 bg-white/10 text-yellow-200 shadow-lg shadow-yellow-900/20">
            {settings?.logoUrl ? <img src={settings.logoUrl} alt="" className="h-7 w-7 rounded-full object-cover" /> : <Sparkles size={18} />}
          </span>
          <span className="font-[var(--font-playfair)] text-xl font-semibold tracking-wide">{settings?.siteTitle || "Aurora Ministry"}</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1 backdrop-blur-xl md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                  active ? "text-black" : "text-white/74 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-600"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <Link href="/admin/login" className="btn-ghost hidden min-h-10 px-4 text-sm md:inline-flex">
          Admin
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/10 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="container-shell mb-4 rounded-2xl border border-white/10 bg-black/88 p-3 backdrop-blur-xl md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-white/78 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/admin/login" onClick={() => setOpen(false)} className="mt-2 block rounded-xl px-4 py-3 text-yellow-200">
            Admin login
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}
