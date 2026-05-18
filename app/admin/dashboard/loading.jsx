export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#050505] p-6 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <div className="h-[calc(100vh-48px)] rounded-[28px] border border-white/10 bg-white/[0.045]" />
        <div className="grid gap-6">
          <div className="h-40 rounded-[28px] border border-white/10 bg-white/[0.045]" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-36 animate-pulse rounded-[26px] bg-white/[0.055]" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
