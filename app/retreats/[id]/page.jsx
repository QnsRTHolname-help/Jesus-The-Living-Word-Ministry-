import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { getRetreat } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const retreat = await getRetreat(id);
  return {
    title: retreat ? `${retreat.title} | Aurora Ministry` : "Retreat | Aurora Ministry"
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
    <article className="container-shell pt-32">
      <Link href="/retreats" className="btn-ghost min-h-10 px-4 text-sm">
        <ArrowLeft size={17} /> Back to retreats
      </Link>
      <div className="mt-8 overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.045]">
        <div className="relative min-h-[420px] bg-cover bg-center" style={{ backgroundImage: `url(${retreat.image})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
          <div className="absolute bottom-0 max-w-4xl p-8 md:p-12">
            <h1 className="font-[var(--font-playfair)] text-5xl font-semibold leading-tight md:text-7xl">{retreat.title}</h1>
          </div>
        </div>
        <div className="grid gap-8 p-8 md:grid-cols-[1fr_320px] md:p-12">
          <div>
            <p className="whitespace-pre-line text-lg leading-9 text-white/68">{retreat.description}</p>
          </div>
          <aside className="h-fit rounded-[24px] border border-white/10 bg-black/28 p-6">
            <p className="flex items-center gap-2 text-white/72">
              <CalendarDays size={18} className="text-yellow-200" />
              {date}
            </p>
            <p className="mt-4 flex items-center gap-2 text-white/72">
              <MapPin size={18} className="text-yellow-200" />
              {retreat.location}
            </p>
            <a href="/contact" className="btn-primary mt-7 w-full">
              Register interest
            </a>
          </aside>
        </div>
      </div>
    </article>
  );
}
