"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Flame, Link as LinkIcon, Mail, MessageCircle, Video } from "lucide-react";

const actionIcons = {
  flame: Flame,
  video: Video,
  mail: Mail,
  message: MessageCircle,
  link: LinkIcon
};

export default function SiteEnhancements({ settings }) {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [barTop, setBarTop] = useState(72);
  const reduceMotion = useReducedMotion();

  const measureHeader = useCallback(() => {
    const el = document.getElementById("site-header");
    if (el) setBarTop(Math.round(el.getBoundingClientRect().height));
  }, []);

  useEffect(() => {
    measureHeader();
    const el = document.getElementById("site-header");
    const ro = typeof ResizeObserver !== "undefined" && el ? new ResizeObserver(measureHeader) : null;
    ro?.observe(el);

    const onScroll = () => {
      const root = document.documentElement;
      const total = root.scrollHeight - root.clientHeight;
      setProgress(total > 0 ? Math.min(1, root.scrollTop / total) : 0);
      setShowTop(root.scrollTop > 420);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measureHeader);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureHeader);
      ro?.disconnect();
    };
  }, [measureHeader, pathname]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <>
      <a
        href="#main-content"
        className="skip-to-main pointer-events-auto fixed left-4 z-[200] rounded-full border border-yellow-200/55 bg-[#0a0908] px-4 py-3 text-sm font-semibold text-yellow-50 shadow-[0_8px_32px_rgba(0,0,0,0.55)] outline-none transition-[transform,opacity] focus:ring-2 focus:ring-yellow-200/90 focus:ring-offset-2 focus:ring-offset-[#050505]"
      >
        Skip to main content
      </a>

      <div
        className="pointer-events-none fixed left-0 right-0 z-[48] h-[3px] overflow-hidden bg-white/[0.06]"
        style={{ top: barTop }}
        aria-hidden
      >
        <div
          className="h-full w-full origin-left bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-700"
          style={{
            transform: `scaleX(${progress})`,
            transition: reduceMotion ? "none" : "transform 120ms ease-out"
          }}
        />
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            aria-label="Back to top"
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={scrollTop}
            className="fixed bottom-[calc(max(1.25rem,env(safe-area-inset-bottom,0px))+4.75rem)] right-[max(1rem,env(safe-area-inset-right,0px))] z-[90] grid h-11 w-11 touch-manipulation place-items-center rounded-full border border-yellow-200/45 bg-gradient-to-br from-yellow-100/95 to-amber-600/90 text-[#16110a] shadow-[0_12px_40px_rgba(216,184,106,0.35)] transition hover:brightness-105 active:scale-95 sm:bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] sm:h-14 sm:w-14"
          >
            <ArrowUp size={22} strokeWidth={2.25} className="sm:h-6 sm:w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {!!settings?.quickActions?.length && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="nav-pills-scroll fixed bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] left-1/2 z-[88] flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-black/68 p-1.5 shadow-[0_18px_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:bottom-[max(1rem,env(safe-area-inset-bottom,0px))] sm:gap-2 sm:p-2"
        >
          {settings.quickActions.slice(0, 4).map((action, index) => {
            const Icon = actionIcons[action.icon] || LinkIcon;
            return (
              <motion.a
                key={`${action.label}-${index}`}
                href={action.url || "#"}
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="group inline-flex h-11 min-w-11 shrink-0 touch-manipulation items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.065] px-3 text-sm text-white/78 transition hover:border-yellow-200/40 hover:bg-yellow-200/12 hover:text-yellow-50 active:scale-95 sm:px-4"
              >
                <Icon size={17} className="text-yellow-200" />
                <span className="hidden max-w-24 truncate sm:inline">{action.label}</span>
              </motion.a>
            );
          })}
        </motion.div>
      )}
    </>
  );
}
