import mongoose from "mongoose";

const FooterLinkSchema = new mongoose.Schema(
  {
    label: String,
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
    footerLinks: { type: [FooterLinkSchema], default: [] },
    galleryImages: { type: [String], default: [] },
    aboutPageKicker: { type: String, default: "Our vision" },
    aboutPageTitle: { type: String, default: "We build spaces where attention becomes prayer." },
    aboutValues: { type: [TextBlockSchema], default: [] },
    leadershipTitle: { type: String, default: "A small team carrying a spacious vision." },
    leaders: { type: [LeaderSchema], default: [] },
    storyTitle: { type: String, default: "From living-room prayer to citywide retreats." },
    storyItems: { type: [StoryItemSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
