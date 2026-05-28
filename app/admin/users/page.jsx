import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import AdminUserManager from "@/components/admin/AdminUserManager";
import { getAuthCookieName, verifyToken } from "@/lib/auth";
import { getSiteSettings } from "@/lib/data";

export const metadata = {
  title: "Admin Users"
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const admin = verifyToken(cookieStore.get(getAuthCookieName())?.value);

  if (!admin) redirect("/admin/login");

  const settings = await getSiteSettings();

  return (
    <AdminShell title="Admin Users" eyebrow="Access and permissions" adminEmail={admin.email} settings={settings}>
      <AdminUserManager />
    </AdminShell>
  );
}
