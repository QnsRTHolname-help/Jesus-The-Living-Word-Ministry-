import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, getAuthCookieName } from "@/lib/auth";
import { getContactStats, getRetreats, getSiteSettings } from "@/lib/data";
import { getDatabaseStatus } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import DashboardOverview from "@/components/admin/DashboardOverview";

export const metadata = {
  title: "Admin Dashboard"
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value;
  const admin = verifyToken(token);

  if (!admin) {
    redirect("/admin/login");
  }

  const [settings, retreats, databaseStatus, contactStats] = await Promise.all([getSiteSettings(), getRetreats(), getDatabaseStatus(), getContactStats()]);

  return (
    <AdminShell title={`${settings.siteTitle} Dashboard`} eyebrow="Ministry command center" adminEmail={admin.email} settings={settings}>
      <DashboardOverview settings={settings} retreats={retreats} databaseStatus={databaseStatus} contactStats={contactStats} />
    </AdminShell>
  );
}
