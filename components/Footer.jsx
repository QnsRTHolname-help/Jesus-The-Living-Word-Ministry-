import Link from "next/link";
import FooterSocialIcon, { normalizeFooterLinks, resolveFooterHref } from "@/components/FooterSocialIcon";
import { fallbackSettings } from "@/lib/demoContent";

const defaultFooterLinks = normalizeFooterLinks(fallbackSettings.footerLinks);

export default function Footer({ settings }) {
  const links = normalizeFooterLinks(settings?.footerLinks?.length ? settings.footerLinks : defaultFooterLinks);
  const connectTitle = settings?.footerConnectTitle || "Connect";
  const contactEmail = settings?.contactEmail || "hello@auroraministry.org";

  return (
    <footer className="mt-16 border-t border-white/10 bg-gradient-to-b from-black/25 to-black/50 pb-[env(safe-area-inset-bottom,0px)] sm:mt-20 lg:mt-24">
      <div className="container-shell grid gap-10 py-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 sm:py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)_minmax(0,1.1fr)] lg:gap-14">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-[var(--font-playfair)] text-xl font-semibold sm:text-2xl">{settings?.siteTitle || "Aurora Ministry"}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/58 sm:text-[0.9375rem] sm:leading-8">
            {settings?.footerText || "A quiet, cinematic space for retreats, worship, renewal, and formation in community."}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/90 sm:text-sm sm:normal-case sm:tracking-normal">Explore</p>
          <div className="mt-4 grid gap-1.5 text-sm text-white/58 sm:gap-2">
            <Link href="/about" className="min-h-10 touch-manipulation rounded-lg py-2 transition-colors hover:text-white/88 sm:inline-block sm:min-h-0 sm:py-0">
              About
            </Link>
            <Link href="/webex" className="min-h-10 touch-manipulation rounded-lg py-2 transition-colors hover:text-white/88 sm:inline-block sm:min-h-0 sm:py-0">
              Webex
            </Link>
            <Link href="/recent-prayers" className="min-h-10 touch-manipulation rounded-lg py-2 transition-colors hover:text-white/88 sm:inline-block sm:min-h-0 sm:py-0">
              {settings?.prayersNavLabel || "Recent Prayers"}
            </Link>
            <Link href="/retreats" className="min-h-10 touch-manipulation rounded-lg py-2 transition-colors hover:text-white/88 sm:inline-block sm:min-h-0 sm:py-0">
              Retreats
            </Link>
            <Link href="/gallery" className="min-h-10 touch-manipulation rounded-lg py-2 transition-colors hover:text-white/88 sm:inline-block sm:min-h-0 sm:py-0">
              Gallery
            </Link>
            <Link href="/contact" className="min-h-10 touch-manipulation rounded-lg py-2 transition-colors hover:text-white/88 sm:inline-block sm:min-h-0 sm:py-0">
              Contact
            </Link>
          </div>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/90 sm:text-sm sm:normal-case sm:tracking-normal">{connectTitle}</p>
          <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-4 sm:gap-y-4">
            {links.map((link, index) => {
              const href = resolveFooterHref(link, contactEmail);
              const opensNewTab = href.startsWith("http");
              const label = link.label?.trim() || "Link";

              return (
                <a
                  key={`${label}-${index}`}
                  href={href}
                  {...(opensNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={label}
                  className="group flex flex-col items-center gap-2 text-center touch-manipulation sm:w-[4.75rem]"
                >
                  <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/8 text-white/72 transition group-active:scale-95 group-hover:border-yellow-200/30 group-hover:bg-yellow-200/15 group-hover:text-yellow-100 sm:h-11 sm:w-11">
                    {link.imageUrl ? (
                      <img src={link.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <FooterSocialIcon name={link.icon} size={19} />
                    )}
                  </span>
                  <span className="max-w-[4.5rem] text-[11px] leading-tight text-white/52 transition group-hover:text-white/78 sm:text-xs">{label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="container-shell border-t border-white/10 py-4 text-center text-xs text-white/42 sm:py-5 sm:text-left sm:text-sm">
        © {new Date().getFullYear()} {settings?.siteTitle || "Aurora Ministry"}. All rights reserved.
      </div>
    </footer>
  );
}
