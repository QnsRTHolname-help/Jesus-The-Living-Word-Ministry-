import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import RetreatShare from "@/components/RetreatShare";
import { getRetreat } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const retreat = await getRetreat(id);
  if (!retreat) {
    return { title: "Retreat" };
  }
  const description = retreat.description
    ? retreat.description.replace(/\s+/g, " ").trim().slice(0, 160)
    : undefined;
  return {
    title: retreat.title,
    description,
    openGraph: {
      title: retreat.title,
      description,
      type: "article"
    }
  };
}

export default async function RetreatDetailPage({ params }) {
  const { id } = await params;
  const retreat = await getRetreat(id);
  if (!retreat) notFound();

  const date = new Date(retreat.date).toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <article className="container-shell page-shell--compact">
      <Link href="/retreats" className="btn-ghost inline-flex min-h-11 px-4 text-sm sm:min-h-10">
        <ArrowLeft size={17} /> Back to retreats
      </Link>
      <RetreatShare title={retreat.title} />
      <div className="mt-6 overflow-hidden rounded-[clamp(1.25rem,3vw,2.125rem)] border border-white/10 bg-white/[0.045] sm:mt-8">
        <div
          className="relative min-h-[min(55vh,380px)] bg-cover bg-center sm:min-h-[420px] md:min-h-[460px]"
          style={{ backgroundImage: `url(${retreat.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
          <div className="absolute bottom-0 max-w-4xl p-5 sm:p-8 md:p-12">
            <h1 className="heading-display font-[var(--font-playfair)] font-semibold leading-tight text-balance">
              {retreat.title}
            </h1>
          </div>
        </div>
        <div className="grid gap-6 p-5 sm:gap-8 sm:p-8 md:grid-cols-[1fr_300px] md:p-12 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="whitespace-pre-line text-base leading-relaxed text-white/68 sm:text-lg sm:leading-9">{retreat.description}</p>
          </div>
          <aside className="h-fit rounded-[clamp(1rem,2vw,1.5rem)] border border-white/10 bg-black/28 p-5 sm:p-6">
            <p className="flex items-start gap-2 text-sm text-white/72 sm:text-base">
              <CalendarDays size={18} className="mt-0.5 shrink-0 text-yellow-200" />
              {date}
            </p>
            <p className="mt-4 flex items-start gap-2 text-sm text-white/72 sm:text-base">
              <MapPin size={18} className="mt-0.5 shrink-0 text-yellow-200" />
              <span className="leading-snug">{retreat.location}</span>
            </p>
            <a href="/contact" className="btn-primary mt-6 w-full sm:mt-7">
              Register interest
            </a>
          </aside>
        </div>
      </div>
    </article>
  );
}
