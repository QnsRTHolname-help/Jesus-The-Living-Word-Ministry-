"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ImageUp, Images, LoaderCircle, Plus, Save, Trash2, Type, Users } from "lucide-react";
import Toast from "@/components/admin/Toast";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/52">{label}</span>
      {children}
    </label>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-[28px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
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
        <Panel title="Brand and hero" icon={Type}>
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
        </Panel>

        <Panel title="Homepage sections" icon={Images}>
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

        <Panel title="About page" icon={Users}>
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

        <Panel title="Contact and footer" icon={ImageUp}>
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
          <Field label="Footer text">
            <input className="input-field" value={settings.footerText || ""} onChange={(e) => patch("footerText", e.target.value)} />
          </Field>
          <ImageField
            label="Contact section photo"
            value={settings.contactImage || ""}
            uploading={uploading === "contact"}
            onChange={(value) => patch("contactImage", value)}
            onUpload={(file) => uploadImage(file, "contact", (url) => patch("contactImage", url))}
          />
        </Panel>

        <div className="sticky bottom-4 z-20 rounded-[24px] border border-white/10 bg-black/72 p-4 backdrop-blur-xl">
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
