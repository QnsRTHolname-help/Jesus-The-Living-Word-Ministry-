"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Home, LayoutDashboard, LogOut, Menu, Settings, Sparkles, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/retreats", label: "Retreats", icon: CalendarDays },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export default function AdminShell({ children, title, eyebrow, adminEmail, settings }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const siteTitle = settings?.siteTitle || "Ministry";
  const logoUrl = settings?.logoUrl;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(216,184,106,0.13),transparent_30rem),radial-gradient(circle_at_82%_16%,rgba(125,38,61,0.18),transparent_28rem)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[290px_1fr]">
        <div className="sticky top-0 z-40 border-b border-white/10 bg-black/72 p-3 backdrop-blur-2xl lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <BrandMark logoUrl={logoUrl} />
              <div className="min-w-0">
                <p className="truncate font-[var(--font-playfair)] text-lg font-semibold">{siteTitle}</p>
                <p className="truncate text-xs text-white/42">{adminEmail}</p>
              </div>
            </Link>
            <button type="button" onClick={() => setMobileOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/10">
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
          {mobileOpen && (
            <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 grid gap-2">
              <AdminNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              <Link href="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/72 hover:bg-white/[0.065]">
                <Home size={18} /> View website
              </Link>
              <button type="button" onClick={logout} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-red-100/80 hover:bg-red-500/10">
                <LogOut size={18} /> Logout
              </button>
            </motion.nav>
          )}
        </div>

        <aside className="hidden border-b border-white/10 bg-black/38 p-4 backdrop-blur-2xl lg:sticky lg:top-0 lg:block lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <Link href="/" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
              <BrandMark logoUrl={logoUrl} />
              <div className="min-w-0">
                <p className="truncate font-[var(--font-playfair)] text-xl font-semibold">{siteTitle}</p>
                <p className="truncate text-xs text-white/42">Admin studio</p>
              </div>
            </Link>

            <nav className="mt-6 grid gap-2"><AdminNav pathname={pathname} /></nav>

            <div className="mt-6 grid gap-2 lg:mt-auto">
              <Link href="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/58 hover:bg-white/[0.065] hover:text-white">
                <Home size={18} />
                View website
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-red-100/72 hover:bg-red-500/10 hover:text-red-100"
              >
                <LogOut size={18} />
                Logout
              </button>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-yellow-100/60">Signed in</p>
                <p className="mt-2 break-all text-sm text-white/64">{adminEmail}</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 p-4 pb-24 md:p-6 md:pb-24 lg:pb-8 xl:p-8">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-6 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl md:p-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(216,184,106,0.12),transparent_24rem)]" />
            <div className="relative">
              <p className="section-kicker">{eyebrow}</p>
              <h1 className="mt-3 font-[var(--font-playfair)] text-3xl font-semibold leading-tight md:text-5xl">{title}</h1>
              <p className="mt-3 text-sm text-white/50">{siteTitle} - {adminEmail}</p>
            </div>
          </motion.header>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </section>

        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/82 px-3 py-2 backdrop-blur-2xl lg:hidden">
          <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-medium transition ${
                    active ? "bg-yellow-200 text-black" : "bg-white/[0.055] text-white/62 active:bg-white/12"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </main>
  );
}

function BrandMark({ logoUrl }) {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-yellow-200/12 text-yellow-100 ring-1 ring-yellow-100/20">
      {logoUrl ? <img src={logoUrl} alt="" className="h-full w-full object-cover" /> : <Sparkles size={20} />}
    </span>
  );
}

function AdminNav({ pathname, onNavigate }) {
  return navItems.map((item) => {
    const Icon = item.icon;
    const active = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
          active ? "bg-yellow-200 text-black shadow-lg shadow-yellow-900/20" : "text-white/62 hover:bg-white/[0.065] hover:text-white"
        }`}
      >
        <Icon size={18} />
        {item.label}
      </Link>
    );
  });
}
