import { getRetreats, getSiteSettings } from "@/lib/data";

export default async function sitemap() {
  const [settings, retreats] = await Promise.all([getSiteSettings(), getRetreats()]);
  const baseUrl = settings.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();
  const staticRoutes = ["", "/about", "/retreats", "/gallery", "/contact", "/webex", "/recent-prayers"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : 0.75
    })),
    ...retreats.map((retreat) => ({
      url: `${baseUrl}/retreats/${retreat._id}`,
      lastModified: retreat.updatedAt ? new Date(retreat.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.7
    }))
  ];
}
