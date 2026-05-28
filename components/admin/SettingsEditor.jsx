"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Flame, ImageUp, Images, LoaderCircle, MonitorPlay, Palette, Plus, Save, SearchCheck, Trash2, Type, Users } from "lucide-react";
import FooterSocialIcon, { footerIconOptions } from "@/components/FooterSocialIcon";
import Toast from "@/components/admin/Toast";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/52">{label}</span>
      {children}
    </label>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex min-h-[4rem] items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/24 p-4">
      <span className="text-sm font-medium text-white/72">{label}</span>
      <span className={`relative h-7 w-12 rounded-full border transition ${checked ? "border-yellow-200/50 bg-yellow-200/80" : "border-white/12 bg-white/10"}`}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-lg transition ${checked ? "left-6" : "left-1"}`} />
      </span>
    </label>
  );
}

const settingSections = [
  { id: "brand", label: "Brand" },
  { id: "home", label: "Home" },
  { id: "about-page", label: "About" },
  { id: "webex", label: "Webex" },
  { id: "prayers", label: "Prayers" },
  { id: "contact-footer", label: "Contact" },
  { id: "notifications", label: "Notifications" },
  { id: "seo", label: "SEO" },
  { id: "theme", label: "Theme" }
];

function Panel({ id, title, icon: Icon, children }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="scroll-mt-24 rounded-[28px] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl sm:p-6"
    >
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <Icon size={21} className="text-yellow-200" />
        {title}
      </h2>
      <div className="mt-5 grid gap-4">{children}</div>
    </motion.section>
  );
}

export default function SettingsEditor({ initialSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");
  const [toast, setToast] = useState(null);

  function notify(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }

  function patch(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function updateArray(key, index, value) {
    patch(
      key,
      (settings[key] || []).map((item, itemIndex) => (itemIndex === index ? value : item))
    );
  }

  function addArrayItem(key, value) {
    patch(key, [...(settings[key] || []), value]);
  }

  function removeArrayItem(key, index) {
    patch(
      key,
      (settings[key] || []).filter((_, itemIndex) => itemIndex !== index)
    );
  }

  async function uploadImage(file, label, onUrl) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify("Please upload an image file.", "error");
      return;
    }

    setUploading(label);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await response.json();
    setUploading("");

    if (!response.ok) {
      notify(data.message || "Image upload failed.", "error");
      return;
    }

    onUrl(data.url);
    notify("Image uploaded.");
  }

  async function saveSettings(event) {
    event.preventDefault();
    if (!settings.heroTitle?.trim() || !settings.heroDescription?.trim()) {
      notify("Homepage title and description are required.", "error");
      return;
    }

    setSaving(true);
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      notify(data.message || "Unable to save settings.", "error");
      return;
    }

    setSettings(data.settings);
    router.refresh();
    notify("Website updated.");
  }

  return (
    <>
      <form onSubmit={saveSettings} className="grid gap-6">
        <div className="sticky top-3 z-30 rounded-[24px] border border-white/10 bg-black/72 p-3 shadow-2xl shadow-black/25 backdrop-blur-2xl lg:top-4">
          <div className="nav-pills-scroll flex gap-2 overflow-x-auto">
            {settingSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/68 transition hover:border-yellow-200/35 hover:bg-yellow-200/10 hover:text-yellow-50"
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>

        <Panel id="brand" title="Brand and hero" icon={Type}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Site title">
              <input className="input-field" value={settings.siteTitle || ""} onChange={(e) => patch("siteTitle", e.target.value)} />
            </Field>
            <Field label="Hero kicker">
              <input className="input-field" value={settings.heroKicker || ""} onChange={(e) => patch("heroKicker", e.target.value)} />
            </Field>
          </div>
          <Field label="Homepage title">
            <input className="input-field" value={settings.heroTitle || ""} onChange={(e) => patch("heroTitle", e.target.value)} />
          </Field>
          <Field label="Homepage description">
            <textarea className="input-field min-h-28 resize-y" value={settings.heroDescription || ""} onChange={(e) => patch("heroDescription", e.target.value)} />
          </Field>
          <ImageField
            label="Logo"
            value={settings.logoUrl || ""}
            uploading={uploading === "logo"}
            onChange={(value) => patch("logoUrl", value)}
            onUpload={(file) => uploadImage(file, "logo", (url) => patch("logoUrl", url))}
          />
          <ImageField
            label="Hero background photo"
            value={settings.heroBackgroundImage || ""}
            uploading={uploading === "hero"}
            onChange={(value) => patch("heroBackgroundImage", value)}
            onUpload={(file) => uploadImage(file, "hero", (url) => patch("heroBackgroundImage", url))}
          />
          <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white/72">Homepage announcement</p>
                <p className="mt-1 text-sm text-white/45">Shown as a small highlighted pill in the hero.</p>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-white/62">
                <input
                  type="checkbox"
                  checked={Boolean(settings.announcementEnabled)}
                  onChange={(e) => patch("announcementEnabled", e.target.checked)}
                />
                Enabled
              </label>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[160px_1fr_1fr]">
              <input className="input-field" value={settings.announcementLabel || ""} placeholder="Label" onChange={(e) => patch("announcementLabel", e.target.value)} />
              <input className="input-field" value={settings.announcementText || ""} placeholder="Announcement text" onChange={(e) => patch("announcementText", e.target.value)} />
              <input className="input-field" value={settings.announcementUrl || ""} placeholder="/recent-prayers" onChange={(e) => patch("announcementUrl", e.target.value)} />
            </div>
          </div>
          <NavigationList
            items={settings.navigationLinks || []}
            onAdd={() => addArrayItem("navigationLinks", { label: "New link", href: "/", highlight: false })}
            onRemove={(index) => removeArrayItem("navigationLinks", index)}
            onChange={(index, item) => updateArray("navigationLinks", index, item)}
          />
        </Panel>

        <Panel id="home" title="Homepage sections" icon={Images}>
          <Field label="About heading">
            <input className="input-field" value={settings.aboutHeading || ""} onChange={(e) => patch("aboutHeading", e.target.value)} />
          </Field>
          <Field label="About text">
            <textarea className="input-field min-h-28 resize-y" value={settings.aboutText || ""} onChange={(e) => patch("aboutText", e.target.value)} />
          </Field>
          <TextBlockList
            title="Homepage about cards"
            items={settings.aboutCards || []}
            onAdd={() => addArrayItem("aboutCards", { title: "New card", description: "Write a short detail." })}
            onRemove={(index) => removeArrayItem("aboutCards", index)}
            onChange={(index, item) => updateArray("aboutCards", index, item)}
          />
          <StatList
            items={settings.homepageStats || []}
            onAdd={() => addArrayItem("homepageStats", { value: "100+", label: "New stat" })}
            onRemove={(index) => removeArrayItem("homepageStats", index)}
            onChange={(index, item) => updateArray("homepageStats", index, item)}
          />
          <Field label="Weekly rhythm title">
            <input className="input-field" value={settings.rhythmTitle || ""} onChange={(e) => patch("rhythmTitle", e.target.value)} />
          </Field>
          <Field label="Weekly rhythm description">
            <textarea className="input-field min-h-20 resize-y" value={settings.rhythmDescription || ""} onChange={(e) => patch("rhythmDescription", e.target.value)} />
          </Field>
          <RhythmList
            items={settings.rhythmItems || []}
            onAdd={() => addArrayItem("rhythmItems", { day: "Day", title: "Gathering title", description: "Short description" })}
            onRemove={(index) => removeArrayItem("rhythmItems", index)}
            onChange={(index, item) => updateArray("rhythmItems", index, item)}
          />
          <QuickActionList
            items={settings.quickActions || []}
            onAdd={() => addArrayItem("quickActions", { label: "New action", url: "/contact", icon: "link" })}
            onRemove={(index) => removeArrayItem("quickActions", index)}
            onChange={(index, item) => updateArray("quickActions", index, item)}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Gallery title">
              <input className="input-field" value={settings.galleryTitle || ""} onChange={(e) => patch("galleryTitle", e.target.value)} />
            </Field>
            <Field label="Testimonial name">
              <input className="input-field" value={settings.testimonialName || ""} onChange={(e) => patch("testimonialName", e.target.value)} />
            </Field>
          </div>
          <Field label="Gallery description">
            <textarea className="input-field min-h-24 resize-y" value={settings.galleryDescription || ""} onChange={(e) => patch("galleryDescription", e.target.value)} />
          </Field>
          <Field label="Testimonial quote">
            <textarea className="input-field min-h-24 resize-y" value={settings.testimonialQuote || ""} onChange={(e) => patch("testimonialQuote", e.target.value)} />
          </Field>
          <ImageList
            items={settings.galleryImages || []}
            uploading={uploading}
            onAdd={() => addArrayItem("galleryImages", "")}
            onRemove={(index) => removeArrayItem("galleryImages", index)}
            onChange={(index, value) => updateArray("galleryImages", index, value)}
            onUpload={(index, file) => uploadImage(file, `gallery-${index}`, (url) => updateArray("galleryImages", index, url))}
          />
        </Panel>

        <Panel id="about-page" title="About page" icon={Users}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="About page kicker">
              <input className="input-field" value={settings.aboutPageKicker || ""} onChange={(e) => patch("aboutPageKicker", e.target.value)} />
            </Field>
            <Field label="Leadership title">
              <input className="input-field" value={settings.leadershipTitle || ""} onChange={(e) => patch("leadershipTitle", e.target.value)} />
            </Field>
          </div>
          <Field label="About page title">
            <input className="input-field" value={settings.aboutPageTitle || ""} onChange={(e) => patch("aboutPageTitle", e.target.value)} />
          </Field>
          <TextBlockList
            title="Vision / mission / values"
            items={settings.aboutValues || []}
            onAdd={() => addArrayItem("aboutValues", { title: "New value", description: "Write the value description." })}
            onRemove={(index) => removeArrayItem("aboutValues", index)}
            onChange={(index, item) => updateArray("aboutValues", index, item)}
          />
          <LeaderList
            items={settings.leaders || []}
            uploading={uploading}
            onAdd={() => addArrayItem("leaders", { name: "New leader", role: "Role", bio: "Short bio", image: "" })}
            onRemove={(index) => removeArrayItem("leaders", index)}
            onChange={(index, item) => updateArray("leaders", index, item)}
            onUpload={(index, file) => uploadImage(file, `leader-${index}`, (url) => updateArray("leaders", index, { ...settings.leaders[index], image: url }))}
          />
          <Field label="Story title">
            <input className="input-field" value={settings.storyTitle || ""} onChange={(e) => patch("storyTitle", e.target.value)} />
          </Field>
          <StoryList
            items={settings.storyItems || []}
            onAdd={() => addArrayItem("storyItems", { year: "Year", text: "Story detail" })}
            onRemove={(index) => removeArrayItem("storyItems", index)}
            onChange={(index, item) => updateArray("storyItems", index, item)}
          />
        </Panel>

        <Panel id="webex" title="Webex page" icon={MonitorPlay}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Page kicker">
              <input className="input-field" value={settings.webexKicker || ""} onChange={(e) => patch("webexKicker", e.target.value)} />
            </Field>
            <Field label="Page title">
              <input className="input-field" value={settings.webexTitle || ""} onChange={(e) => patch("webexTitle", e.target.value)} />
            </Field>
          </div>
          <Field label="Short description">
            <textarea
              className="input-field min-h-24 resize-y"
              value={settings.webexDescription || ""}
              onChange={(e) => patch("webexDescription", e.target.value)}
            />
          </Field>
          <Field label="Page body (optional)">
            <textarea
              className="input-field min-h-32 resize-y"
              value={settings.webexBody || ""}
              onChange={(e) => patch("webexBody", e.target.value)}
              placeholder="Extra text shown below the heading..."
            />
          </Field>
          <ExternalButtonList
            items={settings.webexButtons || []}
            hint="Each button opens another website in a new tab (for example a Webex meeting link)."
            onAdd={() =>
              addArrayItem("webexButtons", {
                label: "New button",
                url: "https://",
                style: "primary"
              })
            }
            onRemove={(index) => removeArrayItem("webexButtons", index)}
            onChange={(index, item) => updateArray("webexButtons", index, item)}
          />
        </Panel>

        <Panel id="prayers" title="Recent Prayers page" icon={Flame}>
          <Field label="Navigation label (title bar)">
            <input
              className="input-field"
              value={settings.prayersNavLabel || ""}
              onChange={(e) => patch("prayersNavLabel", e.target.value)}
              placeholder="Recent Prayers"
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Page kicker">
              <input className="input-field" value={settings.prayersKicker || ""} onChange={(e) => patch("prayersKicker", e.target.value)} />
            </Field>
            <Field label="Page title">
              <input className="input-field" value={settings.prayersTitle || ""} onChange={(e) => patch("prayersTitle", e.target.value)} />
            </Field>
          </div>
          <Field label="Short description">
            <textarea
              className="input-field min-h-24 resize-y"
              value={settings.prayersDescription || ""}
              onChange={(e) => patch("prayersDescription", e.target.value)}
            />
          </Field>
          <Field label="Weekly prayer focus (highlighted)">
            <textarea
              className="input-field min-h-20 resize-y"
              value={settings.prayersFocus || ""}
              onChange={(e) => patch("prayersFocus", e.target.value)}
              placeholder="This week: ..."
            />
          </Field>
          <Field label="Page body (optional)">
            <textarea
              className="input-field min-h-28 resize-y"
              value={settings.prayersBody || ""}
              onChange={(e) => patch("prayersBody", e.target.value)}
            />
          </Field>
          <PrayerEntryList
            items={settings.prayersEntries || []}
            onAdd={() =>
              addArrayItem("prayersEntries", {
                title: "New prayer point",
                date: new Date().toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" }),
                text: "Describe what to pray for.",
                url: ""
              })
            }
            onRemove={(index) => removeArrayItem("prayersEntries", index)}
            onChange={(index, item) => updateArray("prayersEntries", index, item)}
          />
          <ExternalButtonList
            items={settings.prayersButtons || []}
            hint="Use /contact or /webex for internal pages, or https:// for external sites."
            onAdd={() =>
              addArrayItem("prayersButtons", {
                label: "New button",
                url: "/contact",
                style: "primary"
              })
            }
            onRemove={(index) => removeArrayItem("prayersButtons", index)}
            onChange={(index, item) => updateArray("prayersButtons", index, item)}
          />
        </Panel>

        <Panel id="contact-footer" title="Contact and footer" icon={ImageUp}>
          <Field label="Contact intro text">
            <textarea
              className="input-field min-h-20 resize-y"
              value={settings.contactIntro || ""}
              onChange={(e) => patch("contactIntro", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Contact heading">
              <input className="input-field" value={settings.contactHeading || ""} onChange={(e) => patch("contactHeading", e.target.value)} />
            </Field>
            <Field label="Contact email">
              <input className="input-field" type="email" value={settings.contactEmail || ""} onChange={(e) => patch("contactEmail", e.target.value)} />
            </Field>
            <Field label="Contact phone">
              <input className="input-field" value={settings.contactPhone || ""} onChange={(e) => patch("contactPhone", e.target.value)} />
            </Field>
            <Field label="Address">
              <input className="input-field" value={settings.address || ""} onChange={(e) => patch("address", e.target.value)} />
            </Field>
          </div>
          <Field label="Contact success message">
            <input
              className="input-field"
              value={settings.contactSuccessMessage || ""}
              onChange={(e) => patch("contactSuccessMessage", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Footer text">
              <input className="input-field" value={settings.footerText || ""} onChange={(e) => patch("footerText", e.target.value)} />
            </Field>
            <Field label="Connect section title">
              <input
                className="input-field"
                value={settings.footerConnectTitle || ""}
                onChange={(e) => patch("footerConnectTitle", e.target.value)}
                placeholder="Connect"
              />
            </Field>
          </div>
          <FooterLinkList
            items={settings.footerLinks || []}
            uploading={uploading}
            onAdd={() =>
              addArrayItem("footerLinks", {
                label: "New link",
                url: "https://",
                icon: "link",
                imageUrl: ""
              })
            }
            onRemove={(index) => removeArrayItem("footerLinks", index)}
            onChange={(index, item) => updateArray("footerLinks", index, item)}
            onUpload={(index, file) =>
              uploadImage(file, `footer-${index}`, (url) => updateArray("footerLinks", index, { ...settings.footerLinks[index], imageUrl: url }))
            }
          />
          <ImageField
            label="Contact section photo"
            value={settings.contactImage || ""}
            uploading={uploading === "contact"}
            onChange={(value) => patch("contactImage", value)}
            onUpload={(file) => uploadImage(file, "contact", (url) => patch("contactImage", url))}
          />
        </Panel>

        <Panel id="notifications" title="Notifications and email" icon={Bell}>
          <div className="grid gap-4 md:grid-cols-2">
            <ToggleField
              label="Email notifications to admin"
              checked={Boolean(settings.notificationEmailEnabled)}
              onChange={(value) => patch("notificationEmailEnabled", value)}
            />
            <ToggleField
              label="Auto-reply confirmation email"
              checked={Boolean(settings.autoresponderEnabled)}
              onChange={(value) => patch("autoresponderEnabled", value)}
            />
          </div>
          <Field label="Admin notification email">
            <input
              className="input-field"
              type="email"
              value={settings.adminNotificationEmail || ""}
              onChange={(e) => patch("adminNotificationEmail", e.target.value)}
              placeholder="Leave blank to use contact/admin email"
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Auto-reply subject">
              <input
                className="input-field"
                value={settings.autoresponderSubject || ""}
                onChange={(e) => patch("autoresponderSubject", e.target.value)}
              />
            </Field>
            <Field label="WhatsApp admin number">
              <input
                className="input-field"
                value={settings.adminWhatsappNumber || ""}
                onChange={(e) => patch("adminWhatsappNumber", e.target.value)}
                placeholder="whatsapp:+15551234567"
              />
            </Field>
          </div>
          <Field label="Auto-reply body">
            <textarea
              className="input-field min-h-28 resize-y"
              value={settings.autoresponderBody || ""}
              onChange={(e) => patch("autoresponderBody", e.target.value)}
            />
          </Field>
          <ToggleField
            label="WhatsApp notifications"
            checked={Boolean(settings.whatsappNotificationsEnabled)}
            onChange={(value) => patch("whatsappNotificationsEnabled", value)}
          />
          <div className="rounded-2xl border border-yellow-200/15 bg-yellow-200/8 p-4 text-sm leading-6 text-yellow-50/72">
            Email uses Resend when <code>RESEND_API_KEY</code> is set. WhatsApp uses Twilio when the Twilio environment variables are set.
            The admin inbox still receives every message instantly even if external delivery is not configured.
          </div>
        </Panel>

        <Panel id="seo" title="SEO and sharing" icon={SearchCheck}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="SEO title">
              <input className="input-field" value={settings.seoTitle || ""} onChange={(e) => patch("seoTitle", e.target.value)} />
            </Field>
            <Field label="Public site URL">
              <input className="input-field" value={settings.siteUrl || ""} onChange={(e) => patch("siteUrl", e.target.value)} placeholder="https://example.com" />
            </Field>
          </div>
          <Field label="SEO description">
            <textarea className="input-field min-h-24 resize-y" value={settings.seoDescription || ""} onChange={(e) => patch("seoDescription", e.target.value)} />
          </Field>
          <Field label="SEO keywords">
            <input className="input-field" value={settings.seoKeywords || ""} onChange={(e) => patch("seoKeywords", e.target.value)} />
          </Field>
          <ImageField
            label="Open Graph share image"
            value={settings.seoImage || ""}
            uploading={uploading === "seo"}
            onChange={(value) => patch("seoImage", value)}
            onUpload={(file) => uploadImage(file, "seo", (url) => patch("seoImage", url))}
          />
        </Panel>

        <Panel id="theme" title="Theme controls" icon={Palette}>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Theme mode">
              <select className="input-field" value={settings.themeMode || "dark"} onChange={(e) => patch("themeMode", e.target.value)}>
                <option value="dark">Dark cinematic</option>
                <option value="light">Light editorial</option>
              </select>
            </Field>
            <Field label="Font style">
              <select className="input-field" value={settings.fontStyle || "classic"} onChange={(e) => patch("fontStyle", e.target.value)}>
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="editorial">Editorial</option>
              </select>
            </Field>
            <Field label="Accent color">
              <div className="flex gap-3">
                <input
                  className="h-[3.25rem] w-16 shrink-0 rounded-2xl border border-white/10 bg-white/8 p-1"
                  type="color"
                  value={settings.accentColor || "#d8b86a"}
                  onChange={(e) => patch("accentColor", e.target.value)}
                />
                <input className="input-field" value={settings.accentColor || ""} onChange={(e) => patch("accentColor", e.target.value)} />
              </div>
            </Field>
          </div>
          <p className="text-sm leading-6 text-white/48">
            These settings are stored now for CMS control and can be expanded into more visual presets as the platform grows.
          </p>
        </Panel>

        <div className="sticky bottom-20 z-20 rounded-[24px] border border-white/10 bg-black/72 p-4 backdrop-blur-xl lg:bottom-4">
          <button className="btn-primary" disabled={saving}>
            {saving ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}
            {saving ? "Updating..." : "Update live website"}
          </button>
        </div>
      </form>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}

function ImageField({ label, value, uploading, onChange, onUpload }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
      <label className="mb-3 flex items-center gap-2 text-sm text-white/62">
        <ImageUp size={17} className="text-yellow-200" />
        {label}
      </label>
      <input className="input-field" placeholder="Image URL" value={value} onChange={(e) => onChange(e.target.value)} />
      <input
        className="mt-3 block w-full text-sm text-white/52 file:mr-4 file:rounded-full file:border-0 file:bg-yellow-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
        type="file"
        accept="image/*"
        onChange={(e) => onUpload(e.target.files?.[0])}
      />
      {uploading && <p className="mt-3 flex items-center gap-2 text-sm text-yellow-100/70"><LoaderCircle className="animate-spin" size={16} /> Uploading...</p>}
      {value && <img src={value} alt="" className="mt-4 aspect-video w-full rounded-2xl object-cover" />}
    </div>
  );
}

function TextBlockList({ title, items, onAdd, onRemove, onChange }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
      <ListHeader title={title} onAdd={onAdd} />
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-white/[0.045] p-3 md:grid-cols-[1fr_1.4fr_auto]">
            <input className="input-field" value={item.title || ""} onChange={(e) => onChange(index, { ...item, title: e.target.value })} />
            <input className="input-field" value={item.description || ""} onChange={(e) => onChange(index, { ...item, description: e.target.value })} />
            <IconButton label="Remove" onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatList({ items, onAdd, onRemove, onChange }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
      <ListHeader title="Homepage stats" onAdd={onAdd} />
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-white/[0.045] p-3 md:grid-cols-[160px_1fr_auto]">
            <input className="input-field" value={item.value || ""} placeholder="12+" onChange={(e) => onChange(index, { ...item, value: e.target.value })} />
            <input className="input-field" value={item.label || ""} placeholder="People welcomed" onChange={(e) => onChange(index, { ...item, label: e.target.value })} />
            <IconButton label="Remove" onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RhythmList({ items, onAdd, onRemove, onChange }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
      <ListHeader title="Weekly rhythm cards" onAdd={onAdd} />
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-white/[0.045] p-3 md:grid-cols-[130px_1fr_1.4fr_auto]">
            <input className="input-field" value={item.day || ""} placeholder="Sunday" onChange={(e) => onChange(index, { ...item, day: e.target.value })} />
            <input className="input-field" value={item.title || ""} placeholder="Worship" onChange={(e) => onChange(index, { ...item, title: e.target.value })} />
            <input className="input-field" value={item.description || ""} placeholder="Short description" onChange={(e) => onChange(index, { ...item, description: e.target.value })} />
            <IconButton label="Remove" onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActionList({ items, onAdd, onRemove, onChange }) {
  const icons = ["flame", "video", "mail", "message", "whatsapp", "link"];
  return (
    <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
      <ListHeader title="Floating quick actions" onAdd={onAdd} />
      <p className="mt-2 text-sm text-white/48">Shown as the floating dock at the bottom of the public website.</p>
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-white/[0.045] p-3 md:grid-cols-[1fr_1.3fr_140px_auto]">
            <input className="input-field" value={item.label || ""} placeholder="Prayer" onChange={(e) => onChange(index, { ...item, label: e.target.value })} />
            <input className="input-field" value={item.url || ""} placeholder="/contact" onChange={(e) => onChange(index, { ...item, url: e.target.value })} />
            <select className="input-field" value={item.icon || "link"} onChange={(e) => onChange(index, { ...item, icon: e.target.value })}>
              {icons.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
            <IconButton label="Remove" onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function NavigationList({ items, onAdd, onRemove, onChange }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
      <ListHeader title="Website navigation" onAdd={onAdd} />
      <p className="mt-2 text-sm text-white/48">Edit labels, destinations, and which links appear in the highlighted ministry pill group.</p>
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-white/[0.045] p-3 md:grid-cols-[1fr_1.2fr_120px_auto]">
            <input className="input-field" value={item.label || ""} placeholder="Label" onChange={(e) => onChange(index, { ...item, label: e.target.value })} />
            <input className="input-field" value={item.href || ""} placeholder="/about" onChange={(e) => onChange(index, { ...item, href: e.target.value })} />
            <label className="flex items-center gap-2 rounded-[14px] border border-white/10 bg-black/20 px-3 text-sm text-white/62">
              <input type="checkbox" checked={Boolean(item.highlight)} onChange={(e) => onChange(index, { ...item, highlight: e.target.checked })} />
              Highlight
            </label>
            <IconButton label="Remove" onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageList({ items, uploading, onAdd, onRemove, onChange, onUpload }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
      <ListHeader title="Gallery photos" onAdd={onAdd} />
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-white/[0.045] p-3 lg:grid-cols-[120px_1fr_auto]">
            {item ? <img src={item} alt="" className="h-24 w-full rounded-xl object-cover" /> : <div className="h-24 rounded-xl bg-white/8" />}
            <div>
              <input className="input-field" value={item || ""} placeholder="Image URL" onChange={(e) => onChange(index, e.target.value)} />
              <input className="mt-3 block w-full text-sm text-white/52 file:mr-4 file:rounded-full file:border-0 file:bg-yellow-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black" type="file" accept="image/*" onChange={(e) => onUpload(index, e.target.files?.[0])} />
              {uploading === `gallery-${index}` && <p className="mt-2 text-sm text-yellow-100/70">Uploading...</p>}
            </div>
            <IconButton label="Remove" onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderList({ items, uploading, onAdd, onRemove, onChange, onUpload }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
      <ListHeader title="Leadership team" onAdd={onAdd} />
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-white/[0.045] p-3 lg:grid-cols-[140px_1fr_auto]">
            {item.image ? <img src={item.image} alt="" className="h-32 w-full rounded-xl object-cover" /> : <div className="h-32 rounded-xl bg-white/8" />}
            <div className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-2">
                <input className="input-field" value={item.name || ""} placeholder="Name" onChange={(e) => onChange(index, { ...item, name: e.target.value })} />
                <input className="input-field" value={item.role || ""} placeholder="Role" onChange={(e) => onChange(index, { ...item, role: e.target.value })} />
              </div>
              <textarea className="input-field min-h-20" value={item.bio || ""} placeholder="Bio" onChange={(e) => onChange(index, { ...item, bio: e.target.value })} />
              <input className="input-field" value={item.image || ""} placeholder="Image URL" onChange={(e) => onChange(index, { ...item, image: e.target.value })} />
              <input className="block w-full text-sm text-white/52 file:mr-4 file:rounded-full file:border-0 file:bg-yellow-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black" type="file" accept="image/*" onChange={(e) => onUpload(index, e.target.files?.[0])} />
              {uploading === `leader-${index}` && <p className="text-sm text-yellow-100/70">Uploading...</p>}
            </div>
            <IconButton label="Remove" onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function FooterLinkList({ items, uploading, onAdd, onRemove, onChange, onUpload }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
      <ListHeader title="Footer social links (icons + titles)" onAdd={onAdd} />
      <p className="mt-2 text-sm text-white/48">
        Shown at the bottom of every page. Pick an icon or upload a custom logo. For email, leave URL empty to use the contact email above.
      </p>
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-white/[0.045] p-3 lg:grid-cols-[72px_1fr_auto]">
            <div className="flex flex-col items-center gap-2">
              <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/8 text-white/72">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <FooterSocialIcon name={item.icon || "link"} size={20} />
                )}
              </span>
              <span className="max-w-[72px] truncate text-center text-[10px] text-white/45">{item.label || "Title"}</span>
            </div>
            <div className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="input-field"
                  value={item.label || ""}
                  placeholder="Title (e.g. Instagram)"
                  onChange={(e) => onChange(index, { ...item, label: e.target.value })}
                />
                <select
                  className="input-field"
                  value={item.icon || "link"}
                  onChange={(e) => onChange(index, { ...item, icon: e.target.value })}
                >
                  {footerIconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <input
                className="input-field"
                value={item.url || ""}
                placeholder="https://... (optional for email)"
                onChange={(e) => onChange(index, { ...item, url: e.target.value })}
              />
              <input
                className="input-field"
                value={item.imageUrl || ""}
                placeholder="Custom logo URL (optional)"
                onChange={(e) => onChange(index, { ...item, imageUrl: e.target.value })}
              />
              <input
                className="block w-full text-sm text-white/52 file:mr-4 file:rounded-full file:border-0 file:bg-yellow-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
                type="file"
                accept="image/*"
                onChange={(e) => onUpload(index, e.target.files?.[0])}
              />
              {uploading === `footer-${index}` && <p className="text-sm text-yellow-100/70">Uploading...</p>}
            </div>
            <IconButton label="Remove" onClick={() => onRemove(index)} />
          </div>
        ))}
        {!items.length && <p className="text-sm text-white/48">No social links yet. Add Instagram, YouTube, or other platforms.</p>}
      </div>
    </div>
  );
}

function PrayerEntryList({ items, onAdd, onRemove, onChange }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
      <ListHeader title="Prayer updates" onAdd={onAdd} />
      <p className="mt-2 text-sm text-white/48">Each entry appears as a card on the Recent Prayers page.</p>
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-white/[0.045] p-3">
            <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
              <input
                className="input-field"
                value={item.title || ""}
                placeholder="Title"
                onChange={(e) => onChange(index, { ...item, title: e.target.value })}
              />
              <input
                className="input-field"
                value={item.date || ""}
                placeholder="Date"
                onChange={(e) => onChange(index, { ...item, date: e.target.value })}
              />
              <IconButton label="Remove" onClick={() => onRemove(index)} />
            </div>
            <textarea
              className="input-field min-h-24 resize-y"
              value={item.text || ""}
              placeholder="Prayer details"
              onChange={(e) => onChange(index, { ...item, text: e.target.value })}
            />
            <input
              className="input-field"
              value={item.url || ""}
              placeholder="Optional link (https://... or /page)"
              onChange={(e) => onChange(index, { ...item, url: e.target.value })}
            />
          </div>
        ))}
        {!items.length && <p className="text-sm text-white/48">No prayer updates yet.</p>}
      </div>
    </div>
  );
}

function ExternalButtonList({ items, hint, onAdd, onRemove, onChange }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
      <ListHeader title="Link buttons" onAdd={onAdd} />
      <p className="mt-2 text-sm text-white/48">{hint}</p>
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-white/[0.045] p-3 md:grid-cols-[1fr_1.4fr_140px_auto]">
            <input
              className="input-field"
              value={item.label || ""}
              placeholder="Button label"
              onChange={(e) => onChange(index, { ...item, label: e.target.value })}
            />
            <input
              className="input-field"
              value={item.url || ""}
              placeholder="https://..."
              onChange={(e) => onChange(index, { ...item, url: e.target.value })}
            />
            <select
              className="input-field"
              value={item.style || "primary"}
              onChange={(e) => onChange(index, { ...item, style: e.target.value })}
            >
              <option value="primary">Gold button</option>
              <option value="ghost">Outline button</option>
            </select>
            <IconButton label="Remove" onClick={() => onRemove(index)} />
          </div>
        ))}
        {!items.length && <p className="text-sm text-white/48">No buttons yet. Add one to link visitors to Webex or another site.</p>}
      </div>
    </div>
  );
}

function StoryList({ items, onAdd, onRemove, onChange }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
      <ListHeader title="Timeline story" onAdd={onAdd} />
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-white/[0.045] p-3 md:grid-cols-[140px_1fr_auto]">
            <input className="input-field" value={item.year || ""} onChange={(e) => onChange(index, { ...item, year: e.target.value })} />
            <input className="input-field" value={item.text || ""} onChange={(e) => onChange(index, { ...item, text: e.target.value })} />
            <IconButton label="Remove" onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ListHeader({ title, onAdd }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-semibold text-white/72">{title}</p>
      <button type="button" onClick={onAdd} className="inline-flex h-9 items-center gap-2 rounded-full bg-white/10 px-3 text-sm text-white hover:bg-yellow-200/20">
        <Plus size={15} /> Add
      </button>
    </div>
  );
}

function IconButton({ label, onClick }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="grid h-10 w-10 place-items-center rounded-full bg-red-500/12 text-red-200 hover:bg-red-500/20">
      <Trash2 size={16} />
    </button>
  );
}
