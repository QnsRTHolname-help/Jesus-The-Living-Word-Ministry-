import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, getAuthCookieName } from "@/lib/auth";
import { getRetreats, getSiteSettings } from "@/lib/data";
import { getDatabaseStatus } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import DashboardOverview from "@/components/admin/DashboardOverview";

export const metadata = {
  title: "Admin Dashboard | Aurora Ministry"
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value;
  const admin = verifyToken(token);

  if (!admin) {
    redirect("/admin/login");
  }

  const [settings, retreats, databaseStatus] = await Promise.all([getSiteSettings(), getRetreats(), getDatabaseStatus()]);

  return (
    <AdminShell title={`${settings.siteTitle} Dashboard`} eyebrow="Ministry command center" adminEmail={admin.email} settings={settings}>
      <DashboardOverview settings={settings} retreats={retreats} databaseStatus={databaseStatus} />
    </AdminShell>
  );
}
