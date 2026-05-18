import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Webex | ${settings.siteTitle || "Aurora Ministry"}`
  };
}

export default async function WebexPage() {
  const settings = await getSiteSettings();
  const buttons = (settings.webexButtons || []).filter((button) => button.label?.trim() && button.url?.trim());

  return (
    <div className="container-shell page-shell">
      <SectionHeading
        kicker={settings.webexKicker || "Webex"}
        title={settings.webexTitle || "Online gatherings and virtual ministry."}
        description={settings.webexDescription}
      />

      {settings.webexBody?.trim() && (
        <Reveal className="mt-10 max-w-3xl">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-7 md:p-8">
            <p className="whitespace-pre-line text-base leading-8 text-white/68 md:text-lg">{settings.webexBody}</p>
          </div>
        </Reveal>
      )}

      {buttons.length > 0 && (
        <Reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {buttons.map((button, index) => (
            <a
              key={`${button.label}-${index}`}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              className={button.style === "ghost" ? "btn-ghost" : "btn-primary"}
            >
              {button.label}
              <ArrowUpRight size={17} />
            </a>
          ))}
        </Reveal>
      )}
    </div>
  );
}
