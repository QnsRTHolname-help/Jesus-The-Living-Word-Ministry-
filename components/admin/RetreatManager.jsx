"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarPlus, ImageUp, LoaderCircle, Pencil, Save, Trash2, X } from "lucide-react";
import Toast from "@/components/admin/Toast";

const emptyRetreat = {
  title: "",
  description: "",
  date: "",
  location: "",
  image: "",
  registrationEnabled: false,
  googleSheetWebhook: ""
};

function validateRetreat(form) {
  if (!form.title.trim()) return "Retreat title is required.";
  if (!form.description.trim()) return "Retreat description is required.";
  if (!form.date) return "Retreat date is required.";
  if (!form.location.trim()) return "Retreat location is required.";
  if (form.registrationEnabled && !form.googleSheetWebhook.trim()) return "Google Sheet Webhook URL is required when registration is enabled.";
  return "";
}

export default function RetreatManager({ initialRetreats }) {
  const router = useRouter();
  const [retreats, setRetreats] = useState(initialRetreats);
  const [form, setForm] = useState(emptyRetreat);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const sortedRetreats = useMemo(() => [...retreats].sort((a, b) => new Date(a.date) - new Date(b.date)), [retreats]);

  function notify(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }

  async function uploadFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify("Please upload an image file.", "error");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await response.json();
    setUploading(false);

    if (!response.ok) {
      notify(data.message || "Image upload failed.", "error");
      return;
    }

    setForm((current) => ({ ...current, image: data.url }));
    notify("Image uploaded.");
  }

  async function saveRetreat(event) {
    event.preventDefault();
    const validationError = validateRetreat(form);
    if (validationError) {
      notify(validationError, "error");
      return;
    }

    setSaving(true);
    const response = await fetch(editingId ? `/api/retreats/${editingId}` : "/api/retreats", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      notify(data.message || "Unable to save retreat.", "error");
      return;
    }

    setRetreats((items) => (editingId ? items.map((item) => (item._id === editingId ? data.retreat : item)) : [data.retreat, ...items]));
    setForm(emptyRetreat);
    setEditingId(null);
    router.refresh();
    notify(editingId ? "Retreat updated." : "Retreat created.");
  }

  async function deleteRetreat() {
    if (!confirmDelete) return;
    const response = await fetch(`/api/retreats/${confirmDelete._id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      notify(data.message || "Unable to delete retreat.", "error");
      return;
    }

    setRetreats((items) => items.filter((item) => item._id !== confirmDelete._id));
    setConfirmDelete(null);
    router.refresh();
    notify("Retreat deleted.");
  }

  function editRetreat(retreat) {
    setEditingId(retreat._id);
    setForm({
      title: retreat.title,
      description: retreat.description,
      date: retreat.date?.slice(0, 10),
      location: retreat.location,
      image: retreat.image || "",
      registrationEnabled: retreat.registrationEnabled || false,
      googleSheetWebhook: retreat.googleSheetWebhook || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <motion.section whileHover={{ y: -3 }} className="h-fit rounded-[28px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <CalendarPlus className="text-yellow-200" size={22} />
            {editingId ? "Edit retreat" : "Create retreat"}
          </h2>
          <form onSubmit={saveRetreat} className="mt-6 grid gap-4">
            <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="input-field min-h-36 resize-y" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid gap-4 md:grid-cols-2">
              <input className="input-field" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <input className="input-field" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
              <label className="mb-3 flex items-center gap-2 text-sm text-white/62">
                <ImageUp size={17} className="text-yellow-200" />
                Cover image
              </label>
              <input className="input-field" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <input
                className="mt-3 block w-full text-sm text-white/52 file:mr-4 file:rounded-full file:border-0 file:bg-yellow-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
                type="file"
                accept="image/*"
                onChange={(e) => uploadFile(e.target.files?.[0])}
              />
              {uploading && <p className="mt-3 flex items-center gap-2 text-sm text-yellow-100/70"><LoaderCircle className="animate-spin" size={16} /> Uploading image...</p>}
              {form.image && <img src={form.image} alt="" className="mt-4 aspect-video w-full rounded-2xl object-cover" />}
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-black/24 p-4 mt-2">
              <label className="flex items-center gap-3 text-sm font-semibold text-white/90">
                <input
                  type="checkbox"
                  checked={form.registrationEnabled}
                  onChange={(e) => setForm({ ...form, registrationEnabled: e.target.checked })}
                  className="h-5 w-5 rounded border-white/20 bg-black/40 text-yellow-200 focus:ring-yellow-200/50"
                />
                Enable Registration
              </label>
              
              {form.registrationEnabled && (
                <div className="mt-4 animate-in slide-in-from-top-2">
                  <p className="text-sm text-white/62 mb-2">Google Sheet Webhook URL</p>
                  <input
                    className="input-field"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={form.googleSheetWebhook}
                    onChange={(e) => setForm({ ...form, googleSheetWebhook: e.target.value })}
                  />
                  <p className="text-xs text-white/42 mt-2">
                    Enter the URL from your Google Apps Script deployment to send registrations directly to a Google Sheet.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-2">
              <button className="btn-primary" disabled={saving}>
                {saving ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}
                {saving ? "Saving..." : "Save retreat"}
              </button>
              {editingId && (
                <button type="button" className="btn-ghost" onClick={() => { setEditingId(null); setForm(emptyRetreat); }}>
                  <X size={17} /> Cancel
                </button>
              )}
            </div>
          </form>
        </motion.section>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-xl font-semibold">Published retreats</h2>
          <div className="mt-5 grid gap-4">
            {sortedRetreats.map((retreat) => (
              <motion.article
                key={retreat._id}
                whileHover={{ y: -3 }}
                className="grid gap-4 rounded-2xl border border-white/10 bg-black/24 p-4 md:grid-cols-[128px_1fr_auto] md:items-center"
              >
                <img src={retreat.image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80"} alt="" className="h-28 w-full rounded-xl object-cover md:w-32" />
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{retreat.title}</h3>
                  <p className="mt-1 text-sm text-yellow-100/70">{new Date(retreat.date).toLocaleDateString()} - {retreat.location}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-white/52">{retreat.description}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => editRetreat(retreat)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-yellow-200/20" aria-label="Edit">
                    <Pencil size={17} />
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(retreat)} className="grid h-10 w-10 place-items-center rounded-full bg-red-500/12 text-red-200 hover:bg-red-500/20" aria-label="Delete">
                    <Trash2 size={17} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#10100f] p-6 shadow-2xl">
            <h3 className="text-xl font-semibold">Delete retreat?</h3>
            <p className="mt-3 text-sm leading-7 text-white/58">This will remove "{confirmDelete.title}" from the admin dashboard and public website.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="btn-ghost min-h-10 px-4" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-red-500 px-4 text-sm font-semibold text-white hover:bg-red-400" onClick={deleteRetreat}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
