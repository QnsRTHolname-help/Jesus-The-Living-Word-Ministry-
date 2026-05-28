import { getSiteSettings } from "@/lib/data";

export default async function robots() {
  const settings = await getSiteSettings();
  const baseUrl = settings.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
