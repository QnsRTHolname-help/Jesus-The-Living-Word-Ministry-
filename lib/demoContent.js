export const fallbackGallery = [
  "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1528357136257-0c25517acfea?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80"
];

export const fallbackSettings = {
  _id: "demo-settings",
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
  contactImage: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
  contactEmail: "hello@auroraministry.org",
  contactPhone: "+1 (555) 204-1188",
  address: "124 Grace Avenue, Nashville, TN",
  footerText: "Lighting quiet paths toward renewal.",
  footerConnectTitle: "Connect",
  footerLinks: [
    { label: "Instagram", url: "https://instagram.com", icon: "instagram", imageUrl: "" },
    { label: "YouTube", url: "https://youtube.com", icon: "youtube", imageUrl: "" },
    { label: "Facebook", url: "https://facebook.com", icon: "facebook", imageUrl: "" },
    { label: "WhatsApp", url: "https://wa.me/", icon: "whatsapp", imageUrl: "" },
    { label: "TikTok", url: "https://tiktok.com", icon: "tiktok", imageUrl: "" },
    { label: "LinkedIn", url: "https://linkedin.com", icon: "linkedin", imageUrl: "" },
    { label: "Email", url: "", icon: "mail", imageUrl: "" }
  ],
  galleryImages: fallbackGallery,
  aboutPageKicker: "Our vision",
  aboutPageTitle: "We build spaces where attention becomes prayer.",
  aboutValues: [
    { title: "Vision", description: "A generation formed by stillness, mercy, courage, and joyful belonging." },
    { title: "Mission", description: "To host retreats and gatherings that help people encounter God and return renewed." },
    { title: "Posture", description: "Beautiful, uncluttered, honest, contemplative, and deeply hospitable." }
  ],
  leadershipTitle: "A small team carrying a spacious vision.",
  leaders: [
    {
      name: "Elena Grace",
      role: "Ministry Director",
      bio: "Spiritual formation, retreat design, and pastoral care.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Marcus Hale",
      role: "Worship Lead",
      bio: "Creating spacious worship environments with beauty and restraint.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Naomi Reed",
      role: "Community Pastor",
      bio: "Hospitality, small groups, and care for new guests.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
    }
  ],
  webexKicker: "Webex",
  webexTitle: "Online gatherings and virtual ministry.",
  webexDescription:
    "Join live sessions, prayer rooms, and teaching through Webex — separate from our in-person retreat schedule.",
  webexBody: "Use the buttons below to join a meeting room or open our Webex space in your browser.",
  webexButtons: [
    { label: "Join Sunday gathering", url: "https://webex.com", style: "primary" },
    { label: "Prayer room", url: "https://webex.com", style: "ghost" }
  ],
  prayersNavLabel: "Recent Prayers",
  prayersKicker: "Recent Prayers",
  prayersTitle: "Pray with us for what God is doing right now.",
  prayersDescription: "Fresh prayer points from our community — updated as the Spirit leads and needs arise.",
  prayersBody: "Submit a prayer request through our contact page, or join a live prayer gathering on Webex.",
  prayersFocus: "This week: wisdom for leaders, healing for families, and open doors for outreach.",
  prayersEntries: [
    {
      title: "Sunday worship coverage",
      date: "May 18, 2026",
      text: "Pray for unity, clarity in preaching, and hearts open to encounter God.",
      url: ""
    },
    {
      title: "Families in transition",
      date: "May 12, 2026",
      text: "Several households are facing relocation and job changes. Ask for provision and peace.",
      url: ""
    },
    {
      title: "City outreach teams",
      date: "May 5, 2026",
      text: "Teams serving downtown this month need stamina, safety, and meaningful conversations.",
      url: ""
    }
  ],
  prayersButtons: [
    { label: "Submit a prayer request", url: "/contact", style: "primary" },
    { label: "Join live prayer on Webex", url: "/webex", style: "ghost" }
  ],
  storyTitle: "From living-room prayer to citywide retreats.",
  storyItems: [
    { year: "2018", text: "A weekly prayer gathering begins with twelve friends around a table." },
    { year: "2020", text: "The ministry hosts its first guided silent retreat." },
    { year: "2023", text: "Formation cohorts, worship nights, and pastoral care partnerships expand." },
    { year: "Today", text: "Aurora serves churches and seekers through retreats, community, and creative hospitality." }
  ],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z"
};

export const fallbackRetreats = [
  {
    _id: "silent-waters-retreat",
    title: "Silent Waters Retreat",
    description:
      "A contemplative weekend shaped by silence, guided prayer, spiritual direction, and restful rhythms beside the lake.",
    date: "2026-07-18T00:00:00.000Z",
    location: "Lake Haven Retreat Center",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    _id: "ember-worship-weekend",
    title: "Ember Worship Weekend",
    description:
      "Two nights of intimate worship, scripture, teaching, and ministry for people hungry for renewed devotion.",
    date: "2026-09-05T00:00:00.000Z",
    location: "Nashville House of Prayer",
    image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    _id: "rule-of-life-intensive",
    title: "Rule of Life Intensive",
    description:
      "A practical formation intensive helping participants design sustainable rhythms of prayer, work, rest, and service.",
    date: "2026-10-24T00:00:00.000Z",
    location: "Aurora Ministry Studio",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
];
