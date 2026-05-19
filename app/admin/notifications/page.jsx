import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import NotificationManager from "@/components/admin/NotificationManager";
import { getAuthCookieName, verifyToken } from "@/lib/auth";
import { getSiteSettings } from "@/lib/data";

export const metadata = {
  title: "Notifications Admin"
};

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const cookieStore = await cookies();
  const admin = verifyToken(cookieStore.get(getAuthCookieName())?.value);

  if (!admin) redirect("/admin/login");

  const settings = await getSiteSettings();

  return (
    <AdminShell title="Notifications Center" eyebrow="User Contact Submissions" adminEmail={admin.email} settings={settings}>
      <NotificationManager />
    </AdminShell>
  );
}
