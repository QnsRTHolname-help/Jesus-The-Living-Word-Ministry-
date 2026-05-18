import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import RetreatManager from "@/components/admin/RetreatManager";
import { getAuthCookieName, verifyToken } from "@/lib/auth";
import { getRetreats, getSiteSettings } from "@/lib/data";

export const metadata = {
  title: "Retreats Admin"
};

export const dynamic = "force-dynamic";

export default async function AdminRetreatsPage() {
  const cookieStore = await cookies();
  const admin = verifyToken(cookieStore.get(getAuthCookieName())?.value);

  if (!admin) redirect("/admin/login");

  const [retreats, settings] = await Promise.all([getRetreats(), getSiteSettings()]);

  return (
    <AdminShell title={`${settings.siteTitle} Retreats`} eyebrow="Create and publish" adminEmail={admin.email} settings={settings}>
      <RetreatManager initialRetreats={retreats} />
    </AdminShell>
  );
}
