import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import SettingsEditor from "@/components/admin/SettingsEditor";
import { getAuthCookieName, verifyToken } from "@/lib/auth";
import { getSiteSettings } from "@/lib/data";

export const metadata = {
  title: "Settings Admin"
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const admin = verifyToken(cookieStore.get(getAuthCookieName())?.value);

  if (!admin) redirect("/admin/login");

  const settings = await getSiteSettings();

  return (
    <AdminShell title={`${settings.siteTitle} Settings`} eyebrow="Live content editor" adminEmail={admin.email} settings={settings}>
      <SettingsEditor initialSettings={settings} />
    </AdminShell>
  );
}
