import SectionHeading from "@/components/SectionHeading";
import RetreatCard from "@/components/RetreatCard";
import { getRetreats } from "@/lib/data";

export const metadata = {
  title: "Retreats | Aurora Ministry"
};

export const dynamic = "force-dynamic";

export default async function RetreatsPage() {
  const retreats = await getRetreats();

  return (
    <div className="container-shell pt-36">
      <SectionHeading
        kicker="Retreats"
        title="Upcoming experiences for renewal, silence, worship, and formation."
        description="Each retreat is intentionally designed with space for guided prayer, friendship, rest, and practical formation."
      />
      {retreats.length ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {retreats.map((retreat) => (
            <RetreatCard key={retreat._id} retreat={retreat} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-[28px] border border-white/10 bg-white/[0.045] p-8 text-white/62">
          No retreats have been published yet.
        </div>
      )}
    </div>
  );
}
