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

export const metadata = {
  title: "Aurora Ministry",
  description: "A modern ministry website for retreats, worship, formation, and community.",
  openGraph: {
    title: "Aurora Ministry",
    description: "Retreats, worship, formation, and community.",
    type: "website"
  }
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  );
}
