import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { getSiteSettings } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const siteTitle = settings.seoTitle || settings.siteTitle || "Ministry Website";
  const description =
    settings.seoDescription || settings.heroDescription || "A modern ministry website for retreats, worship, formation, and community.";
  const siteUrl = settings.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const images = settings.seoImage ? [{ url: settings.seoImage, width: 1600, height: 900, alt: siteTitle }] : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`
    },
    description,
    keywords: settings.seoKeywords || undefined,
    openGraph: {
      title: siteTitle,
      description,
      url: siteUrl,
      siteName: settings.siteTitle || siteTitle,
      images,
      type: "website"
    },
    twitter: {
      card: settings.seoImage ? "summary_large_image" : "summary",
      title: siteTitle,
      description,
      images: settings.seoImage ? [settings.seoImage] : undefined
    }
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505"
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  const settings = await getSiteSettings();
  const accentColor = /^#[0-9a-f]{6}$/i.test(settings?.accentColor || "") ? settings.accentColor : "#d8b86a";

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
        data-theme={settings?.themeMode || "dark"}
        data-font-style={settings?.fontStyle || "classic"}
        style={{ "--gold": accentColor }}
      >
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  );
}
