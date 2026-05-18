import { connectDb } from "@/lib/db";
import Retreat from "@/lib/models/Retreat";
import SiteSettings from "@/lib/models/SiteSettings";
import { fallbackGallery, fallbackSettings } from "@/lib/demoContent";
import { getLocalRetreat, getLocalRetreats, getLocalSettings } from "@/lib/localStore";

export async function getSiteSettings() {
  try {
    await connectDb();
    let settings = await SiteSettings.findOne().lean();

    if (!settings) {
      settings = await SiteSettings.create({
        footerLinks: fallbackSettings.footerLinks,
        galleryImages: fallbackGallery
      });
      settings = settings.toObject();
    }

    return {
      ...fallbackSettings,
      ...settings,
      _id: settings._id?.toString(),
      createdAt: settings.createdAt instanceof Date ? settings.createdAt.toISOString() : settings.createdAt,
      updatedAt: settings.updatedAt instanceof Date ? settings.updatedAt.toISOString() : settings.updatedAt,
      galleryImages: settings.galleryImages?.length ? settings.galleryImages : fallbackGallery
    };
  } catch {
    return getLocalSettings();
  }
}

export async function getRetreats(limit) {
  try {
    await connectDb();
    const query = Retreat.find({}).sort({ date: 1, createdAt: -1 });
    if (limit) query.limit(limit);
    const retreats = await query.lean();
    return retreats.map(serializeRetreat);
  } catch {
    return getLocalRetreats(limit);
  }
}

export async function getRetreat(id) {
  try {
    await connectDb();
    const retreat = await Retreat.findById(id).lean();
    return retreat ? serializeRetreat(retreat) : null;
  } catch {
    return getLocalRetreat(id);
  }
}

export function serializeRetreat(retreat) {
  return {
    ...retreat,
    _id: retreat._id.toString(),
    date: retreat.date instanceof Date ? retreat.date.toISOString() : retreat.date,
    createdAt: retreat.createdAt instanceof Date ? retreat.createdAt.toISOString() : retreat.createdAt,
    updatedAt: retreat.updatedAt instanceof Date ? retreat.updatedAt.toISOString() : retreat.updatedAt
  };
}
