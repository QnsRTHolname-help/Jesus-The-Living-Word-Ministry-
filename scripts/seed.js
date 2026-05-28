const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("dns");

dns.setServers((process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1").split(",").map((server) => server.trim()));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ministry_website";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ministry.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";
const SEED_DEMO_RETREATS = process.env.SEED_DEMO_RETREATS === "true";

const AdminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "owner" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date
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

const SiteSettingsSchema = new mongoose.Schema({}, { timestamps: true, strict: false });

async function run() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });

  const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
  const Retreat = mongoose.models.Retreat || mongoose.model("Retreat", RetreatSchema);
  const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);

  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await Admin.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    {
      name: "Owner Admin",
      email: ADMIN_EMAIL.toLowerCase(),
      password,
      role: "owner",
      isActive: true
    },
    { upsert: true }
  );

  await SiteSettings.findOneAndUpdate(
    {},
    {
      siteTitle: "Aurora Ministry",
      heroKicker: "Worship. Retreat. Renewal.",
      heroTitle: "Encounter grace in the quiet fire of community.",
      heroDescription:
        "Retreats, worship nights, and formation experiences for people seeking depth, healing, and renewed faith.",
      heroBackgroundImage: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=2400&q=85",
      announcementEnabled: true,
      announcementLabel: "Now open",
      announcementText: "Prayer requests and online gatherings are available this week.",
      announcementUrl: "/recent-prayers",
      navigationLinks: [
        { href: "/", label: "Home", highlight: false },
        { href: "/about", label: "About", highlight: false },
        { href: "/webex", label: "Webex", highlight: true },
        { href: "/recent-prayers", label: "Recent Prayers", highlight: true },
        { href: "/retreats", label: "Retreats", highlight: true },
        { href: "/gallery", label: "Gallery", highlight: false },
        { href: "/contact", label: "Contact", highlight: false }
      ],
      quickActions: [
        { label: "Prayer", url: "/recent-prayers", icon: "flame" },
        { label: "Webex", url: "/webex", icon: "video" },
        { label: "Contact", url: "/contact", icon: "mail" }
      ],
      homepageStats: [
        { value: "12+", label: "Retreat rhythms" },
        { value: "300+", label: "People welcomed" },
        { value: "24/7", label: "Prayer posture" }
      ],
      rhythmTitle: "A weekly rhythm built for formation.",
      rhythmDescription: "Simple, repeatable spaces that help people stay rooted through the week.",
      rhythmItems: [
        { day: "Sunday", title: "Worship gathering", description: "Scripture, prayer, communion, and ministry." },
        { day: "Wednesday", title: "Prayer room", description: "A guided online space for intercession and care." },
        { day: "Monthly", title: "Formation night", description: "Teaching and practices for spiritual maturity." }
      ],
      logoUrl: "",
      aboutHeading: "A sacred space designed for modern seekers.",
      aboutText:
        "Aurora Ministry creates spaces where prayer becomes practical, community feels like shelter, and people can listen deeply for the voice of God.",
      aboutCards: [
        { title: "Formation", description: "Teaching and practices that help faith become embodied." },
        { title: "Retreats", description: "Immersive weekends for stillness, restoration, and discernment." },
        { title: "Community", description: "Gatherings shaped by hospitality, beauty, and honest prayer." },
        { title: "Mission", description: "Serving the city through mercy, presence, and creative witness." }
      ],
      galleryTitle: "Moments of prayer, friendship, and quiet wonder.",
      galleryDescription: "A living visual archive of retreats, worship nights, and ministry gatherings.",
      testimonialQuote: "This ministry helped me hear God again without pressure, performance, or noise.",
      testimonialName: "Maya R., retreat participant",
      contactHeading: "Start a conversation.",
      contactIntro: "Reach out for retreat registration, speaking invitations, prayer, pastoral care, or partnership.",
      contactSuccessMessage: "Your message has been received. Our team will respond soon.",
      contactImage: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
      contactEmail: "hello@auroraministry.org",
      contactPhone: "+1 (555) 204-1188",
      address: "124 Grace Avenue, Nashville, TN",
      footerText: "Lighting quiet paths toward renewal.",
      footerConnectTitle: "Connect",
      footerLinks: [
        { label: "Instagram", url: "https://instagram.com", icon: "instagram", imageUrl: "" },
        { label: "YouTube", url: "https://youtube.com", icon: "youtube", imageUrl: "" },
        { label: "Email", url: "", icon: "mail", imageUrl: "" }
      ],
      galleryImages: [
        "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1528357136257-0c25517acfea?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80"
      ],
      aboutPageKicker: "Our vision",
      aboutPageTitle: "We build spaces where attention becomes prayer.",
      aboutValues: [
        { title: "Vision", description: "A generation formed by stillness, mercy, courage, and joyful belonging." },
        { title: "Mission", description: "To host retreats and gatherings that help people encounter God and return renewed." },
        { title: "Posture", description: "Beautiful, uncluttered, honest, contemplative, and deeply hospitable." }
      ],
      leadershipTitle: "A small team carrying a spacious vision.",
      leaders: [],
      storyTitle: "From living-room prayer to citywide retreats.",
      storyItems: [],
      webexKicker: "Webex",
      webexTitle: "Online gatherings and virtual ministry.",
      webexDescription: "Join live sessions, prayer rooms, and teaching through Webex.",
      webexBody: "Use the buttons below to join a meeting room or open our Webex space in your browser.",
      webexButtons: [
        { label: "Join Sunday gathering", url: "https://webex.com", style: "primary" },
        { label: "Prayer room", url: "https://webex.com", style: "ghost" }
      ],
      prayersNavLabel: "Recent Prayers",
      prayersKicker: "Recent Prayers",
      prayersTitle: "Pray with us for what God is doing right now.",
      prayersDescription: "Fresh prayer points from our community.",
      prayersBody: "Submit a prayer request through our contact page, or join a live prayer gathering on Webex.",
      prayersFocus: "This week: wisdom for leaders, healing for families, and open doors for outreach.",
      prayersEntries: [],
      prayersButtons: [
        { label: "Submit a prayer request", url: "/contact", style: "primary" },
        { label: "Join live prayer on Webex", url: "/webex", style: "ghost" }
      ],
      seoTitle: "Aurora Ministry",
      seoDescription: "A premium ministry platform for retreats, worship, prayer, formation, and community.",
      seoImage: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=85",
      seoKeywords: "ministry, retreats, worship, prayer, church, formation",
      siteUrl: "http://localhost:3000",
      notificationEmailEnabled: true,
      adminNotificationEmail: "",
      autoresponderEnabled: true,
      autoresponderSubject: "We received your message",
      autoresponderBody: "Thank you for reaching out. Our ministry team has received your message and will respond soon.",
      whatsappNotificationsEnabled: false,
      adminWhatsappNumber: "",
      themeMode: "dark",
      accentColor: "#d8b86a",
      fontStyle: "classic"
    },
    { upsert: true, setDefaultsOnInsert: true }
  );

  const count = await Retreat.countDocuments();
  if (count === 0 && SEED_DEMO_RETREATS) {
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
