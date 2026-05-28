"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Home, LayoutDashboard, LogOut, Menu, Settings, Sparkles, UserCog, X, Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/notifications", label: "Inbox", icon: Bell },
  { href: "/admin/retreats", label: "Retreats", icon: CalendarDays },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Admins", icon: UserCog }
];

export default function AdminShell({ children, title, eyebrow, adminEmail, settings }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const siteTitle = settings?.siteTitle || "Ministry";
  const logoUrl = settings?.logoUrl;

  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const latestNotifIdRef = useRef(null);

  const fetchUnread = async (isFirstLoad = false) => {
    try {
      const res = await fetch("/api/admin/notifications/unread");
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);

        if (data.latest) {
          const currentLatestId = data.latest._id;
          
          // Show toast if there's a new notification and it's not the first load
          if (!isFirstLoad && latestNotifIdRef.current && latestNotifIdRef.current !== currentLatestId) {
            setToast({
              name: data.latest.name,
              subject: data.latest.subject || "(No Subject)"
            });
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("New ministry message", {
                body: `${data.latest.name}: ${data.latest.subject || "Contact message"}`
              });
            }
            // Automatically clear toast after 5 seconds
            setTimeout(() => setToast(null), 5000);
          }
          latestNotifIdRef.current = currentLatestId;
        }
      }
    } catch (err) {
      console.error("Failed to poll unread notifications:", err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUnread(true);
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    // Set up polling interval
    const interval = setInterval(() => {
      fetchUnread(false);
    }, 3000);

    // Listen for custom events to trigger instant updates when a user acts on notifications
    const handleUpdated = () => fetchUnread(true);
    window.addEventListener("notificationsUpdated", handleUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notificationsUpdated", handleUpdated);
    };
  }, []);

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
              <AdminNav pathname={pathname} onNavigate={() => setMobileOpen(false)} unreadCount={unreadCount} />
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

            <nav className="mt-6 grid gap-2">
              <AdminNav pathname={pathname} unreadCount={unreadCount} />
            </nav>

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
          <div className="nav-pills-scroll mx-auto flex max-w-md gap-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              const isNotifications = item.href === "/admin/notifications";
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex min-h-14 min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-2xl px-2 text-[11px] font-medium transition ${
                    active ? "bg-yellow-200 text-black" : "bg-white/[0.055] text-white/62 active:bg-white/12"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                  {isNotifications && unreadCount > 0 && (
                    <span className="absolute right-3 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-black">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Floating Live Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            onClick={() => {
              setToast(null);
              router.push("/admin/notifications");
            }}
            className="fixed bottom-20 right-4 z-50 cursor-pointer overflow-hidden rounded-[24px] border border-yellow-200/30 bg-black/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:bottom-6 sm:right-6 max-w-sm w-full"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-200 to-amber-500" />
            <div className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-yellow-200/12 text-yellow-100">
                <Bell size={20} className="animate-bounce" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wider text-yellow-100 font-semibold">New Contact Message</p>
                <p className="mt-1 font-semibold text-white text-sm truncate">{toast.name}</p>
                <p className="mt-0.5 text-xs text-white/62 truncate">{toast.subject}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

function AdminNav({ pathname, onNavigate, unreadCount }) {
  return navItems.map((item) => {
    const Icon = item.icon;
    const active = pathname === item.href;
    const isNotifications = item.href === "/admin/notifications";
    
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
          active ? "bg-yellow-200 text-black shadow-lg shadow-yellow-900/20" : "text-white/62 hover:bg-white/[0.065] hover:text-white"
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon size={18} />
          {item.label}
        </span>
        {isNotifications && unreadCount > 0 && (
          <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
            active ? "bg-black text-yellow-200" : "bg-red-500 text-white"
          }`}>
            {unreadCount}
          </span>
        )}
      </Link>
    );
  });
}
