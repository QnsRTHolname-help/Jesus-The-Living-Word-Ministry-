"use client";

import { motion } from "framer-motion";
import { CalendarClock, CalendarDays, Clock3, Database, Inbox, Settings2 } from "lucide-react";

function formatDate(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}

export default function DashboardOverview({ retreats, settings, databaseStatus, contactStats }) {
  const now = new Date();
  const upcoming = retreats.filter((retreat) => new Date(retreat.date) >= now);
  const nextRetreat = upcoming[0];
  const cards = [
    { label: "Total retreats", value: retreats.length, icon: CalendarDays },
    { label: "Upcoming retreats", value: upcoming.length, icon: CalendarClock },
    { label: "Unread inbox", value: contactStats?.unread || 0, icon: Inbox },
    { label: "Next retreat", value: nextRetreat ? formatDate(nextRetreat.date) : "None", icon: Clock3 },
    { label: "Settings edited", value: formatDate(settings?.updatedAt), icon: Settings2 },
    { label: "Storage mode", value: databaseStatus?.ok ? "MongoDB" : "Local", icon: Database }
  ];

  return (
    <div className="grid gap-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[28px] border p-5 backdrop-blur-xl ${
          databaseStatus?.ok
            ? "border-emerald-300/20 bg-emerald-500/8"
            : "border-yellow-200/20 bg-yellow-500/8"
        }`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">Database status</p>
            <h2 className="mt-2 text-2xl font-semibold">{databaseStatus?.ok ? "MongoDB connected" : "Using local fallback"}</h2>
            <p className="mt-2 text-sm leading-6 text-white/58">
              {databaseStatus?.ok
                ? `Connected to ${databaseStatus.name} on ${databaseStatus.host}.`
                : "Atlas is not reachable yet, so admin edits are saved locally until MongoDB connects."}
            </p>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-semibold ${databaseStatus?.ok ? "bg-emerald-300 text-emerald-950" : "bg-yellow-200 text-black"}`}>
            {databaseStatus?.storage}
          </span>
        </div>
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={card.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              whileHover={{ y: -7, scale: 1.015 }}
              className="group rounded-[26px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition-colors hover:border-yellow-100/25 hover:bg-white/[0.075]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-yellow-200/12 text-yellow-100 transition group-hover:scale-110">
                <Icon size={20} />
              </span>
              <p className="mt-5 text-sm text-white/48">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold">{card.value}</p>
            </motion.article>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <motion.section
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 md:p-6"
        >
          <h2 className="text-xl font-semibold">Upcoming retreat pipeline</h2>
          <div className="mt-5 grid gap-3">
            {upcoming.slice(0, 5).map((retreat) => (
              <motion.div key={retreat._id} whileHover={{ x: 6 }} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/22 p-4">
                <img src={retreat.image} alt="" className="h-16 w-16 rounded-2xl object-cover" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{retreat.title}</p>
                  <p className="mt-1 text-sm text-white/48">{formatDate(retreat.date)} - {retreat.location}</p>
                </div>
              </motion.div>
            ))}
            {!upcoming.length && <p className="rounded-2xl border border-white/10 bg-black/22 p-4 text-sm text-white/52">No upcoming retreats yet.</p>}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 md:p-6"
        >
          <h2 className="text-xl font-semibold">Live content snapshot</h2>
          <div className="mt-5 grid gap-4 text-sm">
            <div className="rounded-2xl bg-black/22 p-4">
              <p className="text-white/42">Homepage title</p>
              <p className="mt-2 line-clamp-2 text-white/82">{settings?.heroTitle}</p>
            </div>
            <div className="rounded-2xl bg-black/22 p-4">
              <p className="text-white/42">Contact</p>
              <p className="mt-2 text-white/82">{settings?.contactEmail}</p>
              <p className="mt-1 text-white/58">{settings?.contactPhone}</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
