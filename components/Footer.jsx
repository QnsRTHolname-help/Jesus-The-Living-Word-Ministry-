import Link from "next/link";
import { Facebook, Instagram, Mail, Youtube } from "lucide-react";

export default function Footer({ settings }) {
  const links = settings?.footerLinks?.length
    ? settings.footerLinks
    : [
        { label: "Instagram", url: "https://instagram.com" },
        { label: "YouTube", url: "https://youtube.com" }
      ];

  return (
    <footer className="mt-24 border-t border-white/10 bg-black/35">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-[var(--font-playfair)] text-2xl font-semibold">{settings?.siteTitle || "Aurora Ministry"}</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-white/58">
            {settings?.footerText || "A quiet, cinematic space for retreats, worship, renewal, and formation in community."}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Explore</p>
          <div className="mt-4 grid gap-2 text-sm text-white/58">
            <Link href="/about">About</Link>
            <Link href="/retreats">Retreats</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Connect</p>
          <div className="mt-4 flex gap-3 text-white/72">
            <a aria-label="Instagram" href="https://instagram.com" className="grid h-10 w-10 place-items-center rounded-full bg-white/8 hover:bg-yellow-200/15">
              <Instagram size={18} />
            </a>
            <a aria-label="YouTube" href="https://youtube.com" className="grid h-10 w-10 place-items-center rounded-full bg-white/8 hover:bg-yellow-200/15">
              <Youtube size={18} />
            </a>
            <a aria-label="Facebook" href="https://facebook.com" className="grid h-10 w-10 place-items-center rounded-full bg-white/8 hover:bg-yellow-200/15">
              <Facebook size={18} />
            </a>
            <a aria-label="Email" href={`mailto:${settings?.contactEmail || "hello@auroraministry.org"}`} className="grid h-10 w-10 place-items-center rounded-full bg-white/8 hover:bg-yellow-200/15">
              <Mail size={18} />
            </a>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-white/50">
            {links.map((link) => (
              <a key={`${link.label}-${link.url}`} href={link.url}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container-shell border-t border-white/10 py-5 text-sm text-white/42">
        © {new Date().getFullYear()} {settings?.siteTitle || "Aurora Ministry"}. All rights reserved.
      </div>
    </footer>
  );
}
