import Link from "next/link";
import { ArrowRight, Calendar, HeartHandshake, Quote, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import RetreatCard from "@/components/RetreatCard";
import GalleryGrid from "@/components/GalleryGrid";
import { getRetreats, getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, retreats] = await Promise.all([getSiteSettings(), getRetreats(3)]);

  return (
    <>
      <section
        className="cinema-bg relative flex min-h-[92vh] items-center overflow-hidden pt-24"
        style={
          settings.heroBackgroundImage
            ? {
                backgroundImage: `linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.62) 46%, rgba(5,5,5,0.92) 100%), url(${settings.heroBackgroundImage})`
              }
            : undefined
        }
      >
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050505] to-transparent" />
        <div className="container-shell relative z-10 grid items-end gap-12 pb-16 pt-20 lg:grid-cols-[1.1fr_0.7fr]">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/72 backdrop-blur-xl">
              <Sparkles size={16} className="text-yellow-200" />
              {settings.heroKicker}
            </div>
            <h1 className="mt-7 max-w-4xl font-[var(--font-playfair)] text-5xl font-semibold leading-[1.02] text-balance md:text-7xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68 md:text-xl">{settings.heroDescription}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/retreats" className="btn-primary">
                View retreats <ArrowRight size={18} />
              </Link>
              <Link href="/about" className="btn-ghost">
                Our story
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.16} className="glass-panel rounded-[32px] p-6">
            <div className="flex items-center gap-3 text-yellow-100">
              <Calendar size={20} />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">Next gathering</span>
            </div>
            <p className="mt-5 font-[var(--font-playfair)] text-3xl font-semibold">
              {retreats[0]?.title || "No retreats scheduled"}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/62">
              {retreats[0]?.description || "Create your first retreat in the admin dashboard and it will appear here automatically."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-shell py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading kicker="About the ministry" title={settings.aboutHeading} description={settings.aboutText} />
          <div className="grid gap-4 sm:grid-cols-2">
            {(settings.aboutCards || []).map((card, index) => (
              <Reveal key={`${card.title}-${index}`} delay={index * 0.06} className="rounded-[24px] border border-white/10 bg-white/[0.045] p-6">
                <HeartHandshake className="text-yellow-200" size={24} />
                <h3 className="mt-5 text-lg font-semibold">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{card.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading kicker="Upcoming retreats" title="Designed for deep rest and holy attention." />
          <Link href="/retreats" className="btn-ghost self-start md:self-auto">
            All retreats <ArrowRight size={18} />
          </Link>
        </div>
        {retreats.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {retreats.map((retreat) => (
              <RetreatCard key={retreat._id} retreat={retreat} />
            ))}
          </div>
        ) : (
          <Reveal className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.045] p-8 text-white/62">
            No retreats have been published yet.
          </Reveal>
        )}
      </section>

      <section className="container-shell py-20">
        <SectionHeading
          kicker="Gallery"
          title={settings.galleryTitle}
          description={settings.galleryDescription}
          align="center"
        />
        <div className="mt-10">
          <GalleryGrid images={(settings.galleryImages || []).slice(0, 6)} />
        </div>
      </section>

      <section className="container-shell py-20">
        <Reveal className="glass-panel rounded-[32px] p-8 md:p-12">
          <Quote className="text-yellow-200" size={34} />
          <p className="mt-7 max-w-4xl font-[var(--font-playfair)] text-3xl leading-tight text-balance md:text-5xl">
            "{settings.testimonialQuote}"
          </p>
          <p className="mt-6 text-white/54">{settings.testimonialName}</p>
        </Reveal>
      </section>

      <section className="container-shell py-16">
        <div className="grid overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] lg:grid-cols-2">
          <div className="p-8 md:p-12">
            <p className="section-kicker">Contact</p>
            <h2 className="mt-4 font-[var(--font-playfair)] text-4xl font-semibold">{settings.contactHeading}</h2>
            <p className="mt-5 text-white/62">{settings.contactEmail}</p>
            <p className="mt-2 text-white/62">{settings.contactPhone}</p>
            <Link href="/contact" className="btn-primary mt-8">
              Contact us <ArrowRight size={18} />
            </Link>
          </div>
          <div
            className="min-h-[320px] bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(135deg,rgba(216,184,106,0.18),rgba(125,38,61,0.28)),url('${settings.contactImage}')` }}
          />
        </div>
      </section>
    </>
  );
}
