const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("dns");

dns.setServers((process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1").split(",").map((server) => server.trim()));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ministry_website";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ministry.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

const RetreatSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: String
  },
  { timestamps: true }
);

const SiteSettingsSchema = new mongoose.Schema(
  {
    siteTitle: String,
    heroTitle: String,
    heroDescription: String,
    logoUrl: String,
    aboutText: String,
    contactEmail: String,
    contactPhone: String,
    address: String,
    footerText: String,
    footerLinks: [{ label: String, url: String }],
    galleryImages: [String]
  },
  { timestamps: true }
);

async function run() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });

  const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
  const Retreat = mongoose.models.Retreat || mongoose.model("Retreat", RetreatSchema);
  const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);

  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await Admin.findOneAndUpdate({ email: ADMIN_EMAIL }, { email: ADMIN_EMAIL, password }, { upsert: true });

  await SiteSettings.findOneAndUpdate(
    {},
    {
      siteTitle: "Aurora Ministry",
      heroTitle: "Encounter grace in the quiet fire of community.",
      heroDescription:
        "Retreats, worship nights, and formation experiences for people seeking depth, healing, and renewed faith.",
      aboutText:
        "Aurora Ministry creates spaces where prayer becomes practical, community feels like shelter, and people can listen deeply for the voice of God.",
      contactEmail: "hello@auroraministry.org",
      contactPhone: "+1 (555) 204-1188",
      address: "124 Grace Avenue, Nashville, TN",
      footerText: "Lighting quiet paths toward renewal.",
      footerLinks: [
        { label: "Instagram", url: "https://instagram.com" },
        { label: "YouTube", url: "https://youtube.com" }
      ],
      galleryImages: [
        "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1528357136257-0c25517acfea?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    { upsert: true }
  );

  const count = await Retreat.countDocuments();
  if (count === 0) {
    await Retreat.insertMany([
      {
        title: "Silent Waters Retreat",
        description:
          "A contemplative weekend shaped by silence, guided prayer, spiritual direction, and restful rhythms beside the lake.",
        date: new Date("2026-07-18"),
        location: "Lake Haven Retreat Center",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
      },
      {
        title: "Ember Worship Weekend",
        description:
          "Two nights of intimate worship, scripture, teaching, and ministry for people hungry for renewed devotion.",
        date: new Date("2026-09-05"),
        location: "Nashville House of Prayer",
        image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80"
      },
      {
        title: "Rule of Life Intensive",
        description:
          "A practical formation intensive helping participants design sustainable rhythms of prayer, work, rest, and service.",
        date: new Date("2026-10-24"),
        location: "Aurora Ministry Studio",
        image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80"
      }
    ]);
  }

  console.log(`Seed complete. Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
