"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SiteEnhancements from "@/components/SiteEnhancements";

export default function SiteChrome({ children, settings }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      <CustomCursor />
      {!isAdmin && (
        <>
          <SiteEnhancements settings={settings} />
          <Navbar settings={settings} />
        </>
      )}
      <AnimatePresence mode="wait">
        <motion.main
          id="main-content"
          tabIndex={-1}
          key={pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[100dvh] w-full max-w-[100vw] overflow-x-clip outline-none focus-visible:ring-2 focus-visible:ring-yellow-200/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {!isAdmin && <Footer settings={settings} />}
    </>
  );
}
