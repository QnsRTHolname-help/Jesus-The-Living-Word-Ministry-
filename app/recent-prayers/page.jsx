import Link from "next/link";
import { ArrowRight, ArrowUpRight, Flame } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `${settings.prayersNavLabel || "Recent Prayers"} | ${settings.siteTitle || "Aurora Ministry"}`
  };
}

function resolveButtonHref(url) {
  const value = String(url || "").trim();
  if (!value) return "#";
  if (value.startsWith("/")) return value;
  return value;
}

function isExternalUrl(url) {
  return url.startsWith("http");
}

export default async function RecentPrayersPage() {
  const settings = await getSiteSettings();
  const entries = (settings.prayersEntries || []).filter((entry) => entry.title?.trim() || entry.text?.trim());
  const buttons = (settings.prayersButtons || []).filter((button) => button.label?.trim() && button.url?.trim());

  return (
    <div className="container-shell page-shell">
      <SectionHeading
        kicker={settings.prayersKicker || "Recent Prayers"}
        title={settings.prayersTitle || "Pray with us for what God is doing right now."}
        description={settings.prayersDescription}
      />

      {settings.prayersFocus?.trim() && (
        <Reveal className="mt-10">
          <div className="glass-panel flex flex-col gap-4 rounded-[28px] border border-yellow-200/20 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-8">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-yellow-200/12 text-yellow-200">
              <Flame size={22} />
            </span>
            <div>
              <p className="section-kicker">Prayer focus</p>
              <p className="mt-3 text-lg leading-8 text-white/78 md:text-xl">{settings.prayersFocus}</p>
            </div>
          </div>
        </Reveal>
      )}

      {settings.prayersBody?.trim() && (
        <Reveal className="mt-8 max-w-3xl">
          <p className="text-base leading-8 text-white/62 md:text-lg">{settings.prayersBody}</p>
        </Reveal>
      )}

      {entries.length > 0 && (
        <div className="mt-12 grid gap-4">
          {entries.map((entry, index) => (
            <Reveal key={`${entry.title}-${index}`} delay={index * 0.05}>
              <article className="rounded-[24px] border border-white/10 bg-white/[0.045] p-6 md:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="font-[var(--font-playfair)] text-2xl font-semibold">{entry.title}</h2>
                  {entry.date?.trim() && <p className="text-sm text-yellow-200/80">{entry.date}</p>}
                </div>
                {entry.text?.trim() && <p className="mt-4 text-base leading-8 text-white/64">{entry.text}</p>}
                {entry.url?.trim() && (
                  <a
                    href={entry.url}
                    {...(isExternalUrl(entry.url) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-yellow-200/90 hover:text-yellow-100"
                  >
                    Read more <ArrowRight size={16} />
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      )}

      {!entries.length && (
        <Reveal className="mt-12 rounded-[28px] border border-white/10 bg-white/[0.045] p-8 text-white/58">
          Prayer updates will appear here once they are added in the admin settings.
        </Reveal>
      )}

      {buttons.length > 0 && (
        <Reveal className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {buttons.map((button, index) => {
            const href = resolveButtonHref(button.url);
            const external = isExternalUrl(href);
            const className = button.style === "ghost" ? "btn-ghost" : "btn-primary";

            if (external) {
              return (
                <a key={`${button.label}-${index}`} href={href} target="_blank" rel="noopener noreferrer" className={className}>
                  {button.label}
                  <ArrowUpRight size={17} />
                </a>
              );
            }

            return (
              <Link key={`${button.label}-${index}`} href={href} className={className}>
                {button.label}
                <ArrowRight size={17} />
              </Link>
            );
          })}
        </Reveal>
      )}
    </div>
  );
}
