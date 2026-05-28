import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import SiteSettings from "@/lib/models/SiteSettings";
import { getAdminFromRequest } from "@/lib/auth";
import { getSiteSettings } from "@/lib/data";
import { updateLocalSettings } from "@/lib/localStore";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let body;

  try {
    body = await request.json();

    if (!String(body.heroTitle || "").trim() || !String(body.heroDescription || "").trim()) {
      return NextResponse.json({ message: "Homepage title and description are required." }, { status: 400 });
    }

    await connectDb();
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      {
        siteTitle: body.siteTitle,
        heroKicker: body.heroKicker,
        heroTitle: body.heroTitle,
        heroDescription: body.heroDescription,
        heroBackgroundImage: body.heroBackgroundImage,
        announcementEnabled: body.announcementEnabled,
        announcementLabel: body.announcementLabel,
        announcementText: body.announcementText,
        announcementUrl: body.announcementUrl,
        navigationLinks: body.navigationLinks,
        quickActions: body.quickActions,
        homepageStats: body.homepageStats,
        rhythmTitle: body.rhythmTitle,
        rhythmDescription: body.rhythmDescription,
        rhythmItems: body.rhythmItems,
        logoUrl: body.logoUrl,
        aboutHeading: body.aboutHeading,
        aboutText: body.aboutText,
        aboutCards: body.aboutCards,
        galleryTitle: body.galleryTitle,
        galleryDescription: body.galleryDescription,
        testimonialQuote: body.testimonialQuote,
        testimonialName: body.testimonialName,
        contactHeading: body.contactHeading,
        contactIntro: body.contactIntro,
        contactSuccessMessage: body.contactSuccessMessage,
        contactImage: body.contactImage,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        address: body.address,
        footerText: body.footerText,
        footerConnectTitle: body.footerConnectTitle,
        footerLinks: body.footerLinks,
        galleryImages: body.galleryImages,
        aboutPageKicker: body.aboutPageKicker,
        aboutPageTitle: body.aboutPageTitle,
        aboutValues: body.aboutValues,
        leadershipTitle: body.leadershipTitle,
        leaders: body.leaders,
        storyTitle: body.storyTitle,
        storyItems: body.storyItems,
        webexKicker: body.webexKicker,
        webexTitle: body.webexTitle,
        webexDescription: body.webexDescription,
        webexBody: body.webexBody,
        webexButtons: body.webexButtons,
        prayersNavLabel: body.prayersNavLabel,
        prayersKicker: body.prayersKicker,
        prayersTitle: body.prayersTitle,
        prayersDescription: body.prayersDescription,
        prayersBody: body.prayersBody,
        prayersFocus: body.prayersFocus,
        prayersEntries: body.prayersEntries,
        prayersButtons: body.prayersButtons,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        seoImage: body.seoImage,
        seoKeywords: body.seoKeywords,
        siteUrl: body.siteUrl,
        notificationEmailEnabled: body.notificationEmailEnabled,
        adminNotificationEmail: body.adminNotificationEmail,
        autoresponderEnabled: body.autoresponderEnabled,
        autoresponderSubject: body.autoresponderSubject,
        autoresponderBody: body.autoresponderBody,
        whatsappNotificationsEnabled: body.whatsappNotificationsEnabled,
        adminWhatsappNumber: body.adminWhatsappNumber,
        themeMode: body.themeMode,
        accentColor: body.accentColor,
        fontStyle: body.fontStyle
      },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({
      settings: {
        ...settings,
        _id: settings._id.toString(),
        createdAt: settings.createdAt instanceof Date ? settings.createdAt.toISOString() : settings.createdAt,
        updatedAt: settings.updatedAt instanceof Date ? settings.updatedAt.toISOString() : settings.updatedAt
      }
    });
  } catch {
    if (!body) return NextResponse.json({ message: "Unable to update settings." }, { status: 503 });
    const settings = await updateLocalSettings(body);
    return NextResponse.json({ settings, storage: "local" });
  }
}
