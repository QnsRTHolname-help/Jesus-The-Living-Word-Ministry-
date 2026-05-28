"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, LoaderCircle, Plus, ShieldCheck, Trash2, UserRound, XCircle } from "lucide-react";

const emptyForm = { name: "", email: "", password: "", role: "admin" };

export default function AdminUserManager() {
  const [admins, setAdmins] = useState([]);
  const [currentAdminEmail, setCurrentAdminEmail] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState(null);

  function showNotice(message, type = "success") {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 3500);
  }

  async function loadAdmins() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to load admins.");
      setAdmins(data.admins || []);
      setCurrentAdminEmail(data.currentAdminEmail || "");
    } catch (error) {
      showNotice(error.message || "Unable to load admins.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function createAdmin(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to create admin.");
      setAdmins((current) => [...current, data.admin]);
      setForm(emptyForm);
      showNotice("Admin account created.");
    } catch (error) {
      showNotice(error.message || "Unable to create admin.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function updateAdmin(id, payload) {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to update admin.");
      setAdmins((current) => current.map((admin) => (admin._id === id ? data.admin : admin)));
      showNotice("Admin updated.");
    } catch (error) {
      showNotice(error.message || "Unable to update admin.", "error");
    } finally {
      setBusyId("");
    }
  }

  async function deleteAdmin(id) {
    if (!window.confirm("Delete this admin account?")) return;
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to delete admin.");
      setAdmins((current) => current.filter((admin) => admin._id !== id));
      showNotice("Admin deleted.");
    } catch (error) {
      showNotice(error.message || "Unable to delete admin.", "error");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="grid gap-6">
      {notice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 rounded-2xl border p-4 text-sm ${
            notice.type === "error" ? "border-red-400/20 bg-red-500/10 text-red-100" : "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"
          }`}
        >
          {notice.type === "error" ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
          {notice.message}
        </motion.div>
      )}

      <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-yellow-200/12 text-yellow-100">
            <ShieldCheck size={20} />
          </span>
          <div>
            <p className="section-kicker">Admin access</p>
            <h2 className="mt-2 text-2xl font-semibold">Create another admin</h2>
            <p className="mt-2 text-sm leading-6 text-white/52">
              Add trusted people who can sign in, manage content, retreats, inbox messages, and settings.
            </p>
          </div>
        </div>

        <form onSubmit={createAdmin} className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_150px_auto] lg:items-end">
          <Field label="Name">
            <input className="input-field" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} placeholder="Admin name" />
          </Field>
          <Field label="Email">
            <input className="input-field" type="email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} placeholder="person@example.com" required />
          </Field>
          <Field label="Password">
            <input className="input-field" type="password" value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} placeholder="Minimum 8 characters" required minLength={8} />
          </Field>
          <Field label="Role">
            <select className="input-field" value={form.role} onChange={(e) => setForm((current) => ({ ...current, role: e.target.value }))}>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </Field>
          <button className="btn-primary w-full" disabled={saving}>
            {saving ? <LoaderCircle className="animate-spin" size={17} /> : <Plus size={17} />}
            Add
          </button>
        </form>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Team</p>
            <h2 className="mt-2 text-2xl font-semibold">Admin accounts</h2>
          </div>
          <p className="text-sm text-white/42">{admins.length} account{admins.length === 1 ? "" : "s"}</p>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-24 animate-pulse rounded-2xl bg-white/[0.055]" />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {admins.map((admin) => {
              const isCurrent = admin.email === currentAdminEmail;
              return (
                <motion.article
                  key={admin._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-4 rounded-[24px] border border-white/10 bg-black/24 p-4 lg:grid-cols-[1fr_150px_130px_auto] lg:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/8 text-white/62">
                      <UserRound size={19} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white/86">{admin.name || "Admin"} {isCurrent && <span className="text-yellow-100">(you)</span>}</p>
                      <p className="break-all text-sm text-white/48">{admin.email}</p>
                      <p className="mt-1 text-xs text-white/34">Created {formatDate(admin.createdAt)}</p>
                    </div>
                  </div>

                  <select
                    className="input-field"
                    value={admin.role}
                    disabled={busyId === admin._id}
                    onChange={(e) => updateAdmin(admin._id, { role: e.target.value })}
                  >
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>

                  <button
                    type="button"
                    disabled={busyId === admin._id || isCurrent}
                    onClick={() => updateAdmin(admin._id, { isActive: !admin.isActive })}
                    className={`rounded-full px-4 py-3 text-sm font-semibold transition disabled:opacity-45 ${
                      admin.isActive ? "bg-emerald-300/14 text-emerald-100" : "bg-red-500/12 text-red-100"
                    }`}
                  >
                    {admin.isActive ? "Active" : "Disabled"}
                  </button>

                  <button
                    type="button"
                    disabled={busyId === admin._id || isCurrent}
                    onClick={() => deleteAdmin(admin._id)}
                    className="grid h-11 w-11 place-items-center rounded-full border border-red-400/20 bg-red-500/10 text-red-100 transition hover:bg-red-500/18 disabled:opacity-45"
                    aria-label="Delete admin"
                  >
                    {busyId === admin._id ? <LoaderCircle className="animate-spin" size={17} /> : <Trash2 size={17} />}
                  </button>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/52">{label}</span>
      {children}
    </label>
  );
}

function formatDate(value) {
  if (!value) return "recently";
  return new Date(value).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}
