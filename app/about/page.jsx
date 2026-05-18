import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { getSiteSettings } from "@/lib/data";

export const metadata = {
  title: "About | Aurora Ministry"
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container-shell pt-36">
      <SectionHeading
        kicker={settings.aboutPageKicker}
        title={settings.aboutPageTitle}
        description={settings.aboutText}
      />

      <section className="grid gap-6 py-16 md:grid-cols-3">
        {(settings.aboutValues || []).map((value, index) => (
          <Reveal key={`${value.title}-${index}`} delay={index * 0.08} className="rounded-[24px] border border-white/10 bg-white/[0.055] p-7">
            <h2 className="font-[var(--font-playfair)] text-3xl font-semibold">{value.title}</h2>
            <p className="mt-4 text-sm leading-7 text-white/60">{value.description}</p>
          </Reveal>
        ))}
      </section>

      <section className="py-12">
        <SectionHeading kicker="Leadership" title={settings.leadershipTitle} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {(settings.leaders || []).map((leader, index) => (
            <Reveal key={`${leader.name}-${index}`} delay={index * 0.08} className="overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.045]">
              <div
                className="aspect-[4/3] bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(135deg,rgba(216,184,106,0.18),rgba(125,38,61,0.2)),url('${leader.image}')` }}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold">{leader.name}</h3>
                <p className="mt-1 text-sm text-yellow-200">{leader.role}</p>
                <p className="mt-4 text-sm leading-7 text-white/58">{leader.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-16">
        <SectionHeading kicker="Story" title={settings.storyTitle} />
        <div className="mt-10 grid gap-5">
          {(settings.storyItems || []).map((item, index) => (
            <Reveal key={`${item.year}-${index}`} delay={index * 0.05} className="grid gap-4 rounded-[24px] border border-white/10 bg-white/[0.045] p-6 md:grid-cols-[120px_1fr]">
              <p className="gold-gradient text-2xl font-bold">{item.year}</p>
              <p className="text-white/66">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
