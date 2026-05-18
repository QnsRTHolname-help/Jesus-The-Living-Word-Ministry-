import mongoose from "mongoose";

const FooterLinkSchema = new mongoose.Schema(
  {
    label: String,
    url: String,
    icon: {
      type: String,
      enum: ["instagram", "youtube", "facebook", "whatsapp", "tiktok", "mail", "twitter", "linkedin", "link"],
      default: "link"
    },
    imageUrl: { type: String, default: "" }
  },
  { _id: false }
);

const ExternalButtonSchema = new mongoose.Schema(
  {
    label: String,
    url: String,
    style: { type: String, enum: ["primary", "ghost"], default: "primary" }
  },
  { _id: false }
);

const QuickActionSchema = new mongoose.Schema(
  {
    label: String,
    url: String,
    icon: { type: String, default: "link" }
  },
  { _id: false }
);

const StatSchema = new mongoose.Schema(
  {
    value: String,
    label: String
  },
  { _id: false }
);

const RhythmItemSchema = new mongoose.Schema(
  {
    day: String,
    title: String,
    description: String
  },
  { _id: false }
);

const PrayerEntrySchema = new mongoose.Schema(
  {
    title: String,
    date: String,
    text: String,
    url: String
  },
  { _id: false }
);

const TextBlockSchema = new mongoose.Schema(
  {
    title: String,
    description: String
  },
  { _id: false }
);

const LeaderSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    bio: String,
    image: String
  },
  { _id: false }
);

const StoryItemSchema = new mongoose.Schema(
  {
    year: String,
    text: String
  },
  { _id: false }
);

const SiteSettingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, default: "Aurora Ministry" },
    heroKicker: { type: String, default: "Worship. Retreat. Renewal." },
    heroTitle: { type: String, default: "Encounter grace in the quiet fire of community." },
    heroDescription: {
      type: String,
      default: "Retreats, worship nights, and formation experiences for people seeking depth, healing, and renewed faith."
    },
    heroBackgroundImage: { type: String, default: "" },
    announcementEnabled: { type: Boolean, default: true },
    announcementLabel: { type: String, default: "Now open" },
    announcementText: { type: String, default: "Prayer requests and online gatherings are available this week." },
    announcementUrl: { type: String, default: "/recent-prayers" },
    quickActions: { type: [QuickActionSchema], default: [] },
    homepageStats: { type: [StatSchema], default: [] },
    rhythmTitle: { type: String, default: "A weekly rhythm built for formation." },
    rhythmDescription: { type: String, default: "Simple, repeatable spaces that help people stay rooted through the week." },
    rhythmItems: { type: [RhythmItemSchema], default: [] },
    logoUrl: { type: String, default: "" },
    aboutHeading: { type: String, default: "A sacred space designed for modern seekers." },
    aboutText: {
      type: String,
      default:
        "Aurora Ministry creates spaces where prayer becomes practical, community feels like shelter, and people can listen deeply for the voice of God."
    },
    aboutCards: { type: [TextBlockSchema], default: [] },
    galleryTitle: { type: String, default: "Moments of prayer, friendship, and quiet wonder." },
    galleryDescription: { type: String, default: "A living visual archive of retreats, worship nights, and ministry gatherings." },
    testimonialQuote: { type: String, default: "This ministry helped me hear God again without pressure, performance, or noise." },
    testimonialName: { type: String, default: "Maya R., retreat participant" },
    contactHeading: { type: String, default: "Start a conversation." },
    contactImage: { type: String, default: "" },
    contactEmail: { type: String, default: "hello@auroraministry.org" },
    contactPhone: { type: String, default: "+1 (555) 204-1188" },
    address: { type: String, default: "124 Grace Avenue, Nashville, TN" },
    footerText: { type: String, default: "Lighting quiet paths toward renewal." },
    footerConnectTitle: { type: String, default: "Connect" },
    footerLinks: { type: [FooterLinkSchema], default: [] },
    galleryImages: { type: [String], default: [] },
    aboutPageKicker: { type: String, default: "Our vision" },
    aboutPageTitle: { type: String, default: "We build spaces where attention becomes prayer." },
    aboutValues: { type: [TextBlockSchema], default: [] },
    leadershipTitle: { type: String, default: "A small team carrying a spacious vision." },
    leaders: { type: [LeaderSchema], default: [] },
    storyTitle: { type: String, default: "From living-room prayer to citywide retreats." },
    storyItems: { type: [StoryItemSchema], default: [] },
    webexKicker: { type: String, default: "Webex" },
    webexTitle: { type: String, default: "Online gatherings and virtual ministry." },
    webexDescription: {
      type: String,
      default: "Join live sessions, prayer rooms, and teaching through Webex — separate from our in-person retreat schedule."
    },
    webexBody: { type: String, default: "" },
    webexButtons: { type: [ExternalButtonSchema], default: [] },
    prayersNavLabel: { type: String, default: "Recent Prayers" },
    prayersKicker: { type: String, default: "Recent Prayers" },
    prayersTitle: { type: String, default: "Pray with us for what God is doing right now." },
    prayersDescription: {
      type: String,
      default: "Fresh prayer points from our community — updated as the Spirit leads and needs arise."
    },
    prayersBody: {
      type: String,
      default: "Submit a prayer request through our contact page, or join a live prayer gathering on Webex."
    },
    prayersFocus: { type: String, default: "This week: wisdom for leaders, healing for families, and open doors for outreach." },
    prayersEntries: { type: [PrayerEntrySchema], default: [] },
    prayersButtons: { type: [ExternalButtonSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
