import Link from "next/link";
import { ArrowRight, Calendar, Clock3, HeartHandshake, Quote, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import RetreatCard from "@/components/RetreatCard";
import GalleryGrid from "@/components/GalleryGrid";
import { getRetreats, getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settingsResolved, retreatsResolved] = await Promise.all([getSiteSettings(), getRetreats(3)]);

  return (
    <>
      <section
        className="cinema-bg relative flex min-h-[min(100dvh,920px)] items-end overflow-hidden pt-[calc(5rem+env(safe-area-inset-top,0px))] sm:min-h-[92vh] sm:items-center sm:pt-24"
        style={
          settingsResolved.heroBackgroundImage
            ? {
                backgroundImage: `linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.62) 46%, rgba(5,5,5,0.92) 100%), url(${settingsResolved.heroBackgroundImage})`
              }
            : undefined
        }
      >
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent sm:h-44" />
        <div className="container-shell relative z-10 grid w-full max-w-full items-end gap-8 pb-10 pt-6 sm:gap-12 sm:pb-16 sm:pt-20 lg:grid-cols-[1.1fr_0.7fr] lg:items-end">
          <Reveal>
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs text-white/72 backdrop-blur-xl sm:px-4 sm:text-sm">
              <Sparkles size={15} className="shrink-0 text-yellow-200 sm:h-4 sm:w-4" />
              <span className="truncate">{settingsResolved.heroKicker}</span>
            </div>
            {settingsResolved.announcementEnabled && settingsResolved.announcementText && (
              <Link
                href={settingsResolved.announcementUrl || "/recent-prayers"}
                className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-yellow-200/24 bg-yellow-200/10 px-3 py-2 text-xs text-yellow-50 shadow-[0_14px_50px_rgba(216,184,106,0.12)] backdrop-blur-xl transition hover:border-yellow-200/45 hover:bg-yellow-200/15 sm:text-sm"
              >
                <span className="rounded-full bg-yellow-200 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black">
                  {settingsResolved.announcementLabel}
                </span>
                <span className="truncate">{settingsResolved.announcementText}</span>
                <ArrowRight size={15} className="shrink-0" />
              </Link>
            )}
            <h1 className="heading-display mt-5 max-w-4xl font-[var(--font-playfair)] font-semibold text-balance sm:mt-7">
              {settingsResolved.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl md:leading-9">
              {settingsResolved.heroDescription}
            </p>
            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:flex-wrap">
              <Link href="/retreats" className="btn-primary w-full justify-center sm:w-auto">
                View retreats <ArrowRight size={18} />
              </Link>
              <Link href="/about" className="btn-ghost w-full justify-center sm:w-auto">
                Our story
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="glass-panel rounded-[clamp(1.25rem,3vw,2rem)] p-5 sm:p-6 lg:rounded-[32px]">
            <div className="flex items-center gap-3 text-yellow-100">
              <Calendar size={19} className="shrink-0 sm:h-5 sm:w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm">Next gathering</span>
            </div>
            <p className="mt-4 font-[var(--font-playfair)] text-2xl font-semibold leading-snug sm:mt-5 sm:text-3xl">
              {retreatsResolved[0]?.title || "No retreats scheduled"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/62 sm:leading-7">
              {retreatsResolved[0]?.description ||
                "Create your first retreat in the admin dashboard and it will appear here automatically."}
            </p>
          </Reveal>
        </div>
      </section>

      {!!settingsResolved.homepageStats?.length && (
        <section className="container-shell -mt-8 relative z-20 sm:-mt-10">
          <Reveal className="grid gap-3 rounded-[clamp(1.25rem,3vw,2rem)] border border-white/10 bg-black/44 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.36)] backdrop-blur-2xl sm:grid-cols-3 sm:p-4">
            {settingsResolved.homepageStats.slice(0, 4).map((stat, index) => (
              <div key={`${stat.value}-${index}`} className="shine-card rounded-[1.1rem] border border-white/10 bg-white/[0.045] p-5 text-center">
                <p className="gold-gradient text-3xl font-black sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-sm text-white/58">{stat.label}</p>
              </div>
            ))}
          </Reveal>
        </section>
      )}

      <section className="section-y container-shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <SectionHeading
            kicker="About the ministry"
            title={settingsResolved.aboutHeading}
            description={settingsResolved.aboutText}
          />
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {(settingsResolved.aboutCards || []).map((card, index) => (
              <Reveal
                key={`${card.title}-${index}`}
                delay={index * 0.06}
                className="shine-card rounded-[clamp(1rem,2.5vw,1.5rem)] border border-white/10 bg-white/[0.045] p-5 sm:p-6"
              >
                <HeartHandshake className="text-yellow-200" size={22} />
                <h3 className="mt-4 text-base font-semibold sm:mt-5 sm:text-lg">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/58 sm:mt-3 sm:leading-7">{card.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {!!settingsResolved.rhythmItems?.length && (
        <section className="section-y container-shell">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <SectionHeading kicker="Weekly rhythm" title={settingsResolved.rhythmTitle} description={settingsResolved.rhythmDescription} />
            <div className="grid gap-4">
              {settingsResolved.rhythmItems.map((item, index) => (
                <Reveal
                  key={`${item.day}-${index}`}
                  delay={index * 0.05}
                  className="group grid gap-4 rounded-[clamp(1rem,2.5vw,1.5rem)] border border-white/10 bg-white/[0.045] p-5 transition hover:border-yellow-200/25 hover:bg-white/[0.065] sm:grid-cols-[120px_1fr] sm:p-6"
                >
                  <div className="flex items-center gap-2 text-yellow-100">
                    <Clock3 size={18} />
                    <span className="font-semibold">{item.day}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/58">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-y container-shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading kicker="Upcoming retreats" title="Designed for deep rest and holy attention." />
          <Link href="/retreats" className="btn-ghost w-full shrink-0 justify-center self-stretch md:w-auto md:self-auto">
            All retreats <ArrowRight size={18} />
          </Link>
        </div>
        {retreatsResolved.length ? (
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {retreatsResolved.map((retreat) => (
              <RetreatCard key={retreat._id} retreat={retreat} />
            ))}
          </div>
        ) : (
          <Reveal className="mt-8 rounded-[clamp(1rem,2.5vw,1.75rem)] border border-white/10 bg-white/[0.045] p-6 text-white/62 sm:mt-10 sm:p-8">
            No retreats have been published yet.
          </Reveal>
        )}
      </section>

      <section className="section-y container-shell">
        <SectionHeading
          kicker="Gallery"
          title={settingsResolved.galleryTitle}
          description={settingsResolved.galleryDescription}
          align="center"
        />
        <div className="mt-8 sm:mt-10">
          <GalleryGrid images={(settingsResolved.galleryImages || []).slice(0, 6)} />
        </div>
      </section>

      <section className="section-y container-shell">
        <Reveal className="glass-panel rounded-[clamp(1.25rem,3vw,2rem)] p-6 sm:p-8 md:p-12">
          <Quote className="text-yellow-200" size={30} />
          <p className="mt-6 max-w-4xl font-[var(--font-playfair)] text-2xl font-semibold leading-snug text-balance sm:mt-7 sm:text-3xl md:text-4xl md:leading-tight lg:text-5xl">
            &ldquo;{settingsResolved.testimonialQuote}&rdquo;
          </p>
          <p className="mt-5 text-sm text-white/54 sm:mt-6 sm:text-base">{settingsResolved.testimonialName}</p>
        </Reveal>
      </section>

      <section className="section-y container-shell pb-[max(3rem,calc(2rem+env(safe-area-inset-bottom)))]">
        <div className="grid overflow-hidden rounded-[clamp(1.25rem,3vw,2rem)] border border-white/10 bg-white/[0.045] lg:grid-cols-2">
          <div className="flex flex-col justify-center p-6 sm:p-8 md:p-12">
            <p className="section-kicker">Contact</p>
            <h2 className="heading-section mt-3 font-[var(--font-playfair)] font-semibold sm:mt-4">{settingsResolved.contactHeading}</h2>
            <p className="mt-4 break-words text-sm text-white/62 sm:mt-5 sm:text-base">{settingsResolved.contactEmail}</p>
            <p className="mt-2 text-sm text-white/62 sm:text-base">{settingsResolved.contactPhone}</p>
            <Link href="/contact" className="btn-primary mt-6 w-full justify-center sm:mt-8 sm:w-auto">
              Contact us <ArrowRight size={18} />
            </Link>
          </div>
          <div
            className="min-h-[220px] bg-cover bg-center sm:min-h-[280px] lg:min-h-[320px]"
            style={{
              backgroundImage: `linear-gradient(135deg,rgba(216,184,106,0.18),rgba(125,38,61,0.28)),url('${settingsResolved.contactImage}')`
            }}
          />
        </div>
      </section>
    </>
  );
}
