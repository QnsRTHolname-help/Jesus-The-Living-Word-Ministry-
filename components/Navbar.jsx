"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" }
];

const titleBarHrefs = ["/webex", "/recent-prayers"];

function NavPill({ links, pathname, layoutId }) {
  return (
    <motion.div className="flex shrink-0 flex-nowrap items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.045] p-1 shadow-inner shadow-black/20 backdrop-blur-xl sm:gap-1">
      {links.map((link) => {
        const active = pathname === link.href;
        const isTitleBar = titleBarHrefs.includes(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative shrink-0 rounded-full px-3 py-2.5 text-[13px] transition-colors sm:px-4 sm:py-2 sm:text-sm ${
              isTitleBar
                ? active
                  ? "text-black"
                  : "font-[var(--font-playfair)] font-semibold tracking-wide text-yellow-200/95 hover:text-yellow-100"
                : active
                  ? "text-black"
                  : "text-white/74 hover:text-white"
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-600"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 whitespace-nowrap">{link.label}</span>
          </Link>
        );
      })}
    </motion.div>
  );
}

export default function Navbar({ settings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const retreatBarLinks = useMemo(
    () => [
      { href: "/webex", label: "Webex" },
      { href: "/recent-prayers", label: settings?.prayersNavLabel || "Recent Prayers" },
      { href: "/retreats", label: "Retreats" }
    ],
    [settings?.prayersNavLabel]
  );

  const mobileLinks = useMemo(
    () => [...mainLinks.slice(0, 2), ...retreatBarLinks, ...mainLinks.slice(2)],
    [retreatBarLinks]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      id="site-header"
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-all duration-300 ${
        scrolled ? "bg-black/72 shadow-2xl shadow-black/35 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="container-shell flex min-h-[3.75rem] items-center justify-between gap-2 py-2 sm:min-h-20 sm:gap-3 sm:py-0">
        <Link href="/" className="group flex min-w-0 max-w-[min(100%,11rem)] flex-shrink-0 items-center gap-2 sm:max-w-[min(100%,16rem)] md:max-w-[min(100%,20rem)] lg:max-w-[22rem]">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-yellow-200/30 bg-white/10 text-yellow-200 shadow-lg shadow-yellow-900/20 sm:h-10 sm:w-10">
            {settings?.logoUrl ? <img src={settings.logoUrl} alt="" className="h-6 w-6 rounded-full object-cover sm:h-7 sm:w-7" /> : <Sparkles size={17} className="sm:h-[18px] sm:w-[18px]" />}
          </span>
          <span className="truncate font-[var(--font-playfair)] text-base font-semibold tracking-wide sm:text-lg md:text-xl">
            {settings?.siteTitle || "Aurora Ministry"}
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-1.5 pl-2 md:flex lg:gap-2">
          <div className="nav-pills-scroll flex max-w-[min(100%,28rem)] justify-end overflow-x-auto overscroll-x-contain lg:max-w-none lg:overflow-visible xl:max-w-none">
            <NavPill links={mainLinks} pathname={pathname} layoutId="nav-pill-main" />
          </div>
          <div className="nav-pills-scroll flex max-w-[min(100%,22rem)] shrink-0 justify-end overflow-x-auto overscroll-x-contain lg:max-w-none lg:overflow-visible">
            <NavPill links={retreatBarLinks} pathname={pathname} layoutId="nav-pill-retreats" />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link href="/admin/login" className="btn-ghost hidden min-h-9 px-3 text-xs sm:min-h-10 sm:px-4 sm:text-sm md:inline-flex">
            Admin
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 min-w-11 touch-manipulation place-items-center rounded-full border border-white/10 bg-white/10 md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="border-t border-white/10 bg-black/92 shadow-2xl shadow-black/40 backdrop-blur-xl md:hidden"
        >
          <div className="container-shell max-h-[min(70vh,calc(100dvh-5rem))] overflow-y-auto overscroll-contain py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block min-h-12 touch-manipulation rounded-xl px-4 py-3.5 text-[15px] leading-snug transition-colors active:bg-white/15 ${
                  titleBarHrefs.includes(link.href) ? "font-[var(--font-playfair)] font-semibold text-yellow-200" : "text-white/82"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="mt-1 block min-h-12 touch-manipulation rounded-xl px-4 py-3.5 text-[15px] text-yellow-200/95 active:bg-white/10"
            >
              Admin login
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
