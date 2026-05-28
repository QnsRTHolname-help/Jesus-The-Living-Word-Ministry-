"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  Check,
  Inbox,
  LoaderCircle,
  Mail,
  MailOpen,
  RefreshCw,
  Reply,
  Search,
  Send,
  Trash2,
  Undo2
} from "lucide-react";

const filters = [
  { value: "active", label: "Inbox" },
  { value: "unread", label: "Unread" },
  { value: "archived", label: "Archived" }
];

export default function NotificationManager() {
  const [notifications, setNotifications] = useState([]);
  const [totals, setTotals] = useState({ total: 0, unread: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("active");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [replyBody, setReplyBody] = useState("");

  const selected = useMemo(
    () => notifications.find((notification) => notification._id === selectedId) || notifications[0],
    [notifications, selectedId]
  );

  const fetchNotifications = async () => {
    setError("");
    try {
      const params = new URLSearchParams({ filter, search });
      const res = await fetch(`/api/admin/notifications?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch notifications");
      setNotifications(data.submissions || []);
      setTotals(data.totals || { total: 0, unread: 0, archived: 0 });
      setSelectedId((current) => {
        if (current && data.submissions?.some((item) => item._id === current)) return current;
        return data.submissions?.[0]?._id || "";
      });
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchNotifications();
  }, [filter]);

  useEffect(() => {
    const timeout = setTimeout(fetchNotifications, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  async function mutate(id, action, extra = {}) {
    setBusyId(`${action}-${id || "all"}`);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, ...extra })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to update message.");
      await fetchNotifications();
      window.dispatchEvent(new Event("notificationsUpdated"));
      if (action === "reply") setReplyBody("");
    } catch (err) {
      setError(err.message || "Unable to update message.");
    } finally {
      setBusyId("");
    }
  }

  async function deleteNotification(id) {
    if (!window.confirm("Delete this message permanently?")) return;
    setBusyId(`delete-${id}`);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to delete message.");
      await fetchNotifications();
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (err) {
      setError(err.message || "Unable to delete message.");
    } finally {
      setBusyId("");
    }
  }

  const unreadCount = totals.unread || 0;

  return (
    <div className="grid gap-5">
      <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="section-kicker">Live inbox</p>
            <h2 className="mt-2 text-2xl font-semibold">Contact and prayer messages</h2>
            <p className="mt-2 text-sm text-white/52">
              {unreadCount} unread, {totals.archived || 0} archived, {totals.total || 0} total saved in MongoDB.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex rounded-full border border-white/10 bg-black/24 p-1">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`rounded-full px-3 py-2 text-sm transition ${
                    filter === item.value ? "bg-yellow-200 text-black" : "text-white/62 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={fetchNotifications}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.055] text-white/70 hover:text-white"
              aria-label="Refresh inbox"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-black/24 px-4">
            <Search size={17} className="text-white/38" />
            <input
              className="input-reset"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, subject, or message"
            />
          </label>
          {unreadCount > 0 && (
            <button type="button" onClick={() => mutate(null, "markAllRead")} className="btn-ghost w-full md:w-auto">
              <Check size={17} />
              Mark all read
            </button>
          )}
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <InboxSkeleton />
      ) : (
        <div className="grid min-h-[32rem] gap-5 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
          <section className="grid content-start gap-3">
            <AnimatePresence initial={false}>
              {notifications.map((notification) => (
                <MessageRow
                  key={notification._id}
                  notification={notification}
                  active={selected?._id === notification._id}
                  onClick={() => setSelectedId(notification._id)}
                />
              ))}
            </AnimatePresence>

            {!notifications.length && (
              <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-10 text-center">
                <Inbox className="mx-auto h-12 w-12 text-white/32" />
                <h3 className="mt-4 font-semibold text-white/82">No messages here</h3>
                <p className="mt-2 text-sm text-white/48">Try another filter or wait for a new contact form submission.</p>
              </div>
            )}
          </section>

          <MessageDetail
            selected={selected}
            busyId={busyId}
            replyBody={replyBody}
            setReplyBody={setReplyBody}
            mutate={mutate}
            onDelete={deleteNotification}
          />
        </div>
      )}
    </div>
  );
}

function MessageRow({ notification, active, onClick }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[24px] border p-4 text-left transition ${
        active
          ? "border-yellow-200/35 bg-yellow-200/10"
          : notification.isRead
            ? "border-white/10 bg-white/[0.035] hover:bg-white/[0.055]"
            : "border-yellow-200/18 bg-white/[0.065] hover:bg-white/[0.08]"
      }`}
    >
      {!notification.isRead && <span className="absolute left-0 top-0 h-full w-1 bg-yellow-200" />}
      <div className="flex items-start gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${notification.isRead ? "bg-white/8 text-white/48" : "bg-yellow-200/14 text-yellow-100"}`}>
          {notification.isRead ? <MailOpen size={17} /> : <Mail size={17} />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate font-semibold text-white/88">{notification.name}</p>
            <p className="shrink-0 text-[11px] text-white/38">{formatDate(notification.createdAt)}</p>
          </div>
          <p className="mt-1 truncate text-xs text-white/42">{notification.email}</p>
          <p className="mt-3 line-clamp-2 text-sm text-white/62">{notification.subject || notification.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{notification.requestType || "general"}</Badge>
            {notification.priority === "high" && <Badge tone="gold">priority</Badge>}
            {notification.replies?.length > 0 && <Badge tone="green">replied</Badge>}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function MessageDetail({ selected, busyId, replyBody, setReplyBody, mutate, onDelete }) {
  if (!selected) {
    return (
      <section className="hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-8 xl:block">
        <p className="text-white/52">Select a message to view details.</p>
      </section>
    );
  }

  return (
    <motion.section
      key={selected._id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_90%_0%,rgba(216,184,106,0.1),transparent_22rem)] bg-white/[0.045] p-4 backdrop-blur-xl sm:p-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="section-kicker">{selected.requestType || "message"}</p>
          <h3 className="mt-3 break-words text-2xl font-semibold">{selected.subject || "Contact message"}</h3>
          <p className="mt-2 break-all text-sm text-white/50">{selected.name} - {selected.email}</p>
          {selected.phone && <p className="mt-1 text-sm text-white/45">{selected.phone}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton busy={busyId === `read-${selected._id}`} onClick={() => mutate(selected._id, selected.isRead ? "unread" : "read")}>
            {selected.isRead ? <Mail size={16} /> : <Check size={16} />}
            {selected.isRead ? "Unread" : "Read"}
          </ActionButton>
          <ActionButton busy={busyId === `archive-${selected._id}` || busyId === `unarchive-${selected._id}`} onClick={() => mutate(selected._id, selected.isArchived ? "unarchive" : "archive")}>
            {selected.isArchived ? <Undo2 size={16} /> : <Archive size={16} />}
            {selected.isArchived ? "Restore" : "Archive"}
          </ActionButton>
          <button type="button" onClick={() => onDelete(selected._id)} className="btn-ghost border-red-400/20 bg-red-500/10 text-red-100 hover:bg-red-500/15">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-black/24 p-5">
        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-white/72 sm:text-base">{selected.message}</p>
      </div>

      <div className="mt-5 grid gap-3 text-xs text-white/42 sm:grid-cols-3">
        <Info label="Received" value={new Date(selected.createdAt).toLocaleString()} />
        <Info label="Admin email" value={selected.notificationStatus?.adminEmail || "not_configured"} />
        <Info label="Auto reply" value={selected.notificationStatus?.autoReply || "not_configured"} />
      </div>

      {!!selected.replies?.length && (
        <div className="mt-6 grid gap-3">
          <p className="text-sm font-semibold text-white/72">Reply history</p>
          {selected.replies.map((reply, index) => (
            <div key={`${reply.sentAt}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="whitespace-pre-wrap text-sm leading-6 text-white/68">{reply.body}</p>
              <p className="mt-3 text-xs text-white/38">
                {reply.sentBy} - {reply.sentAt ? new Date(reply.sentAt).toLocaleString() : "Recorded"} - {reply.deliveryStatus}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-[24px] border border-white/10 bg-black/24 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/76">
          <Reply size={17} className="text-yellow-200" />
          Reply from dashboard
        </div>
        <textarea
          className="input-field mt-4 min-h-32 resize-y"
          value={replyBody}
          onChange={(event) => setReplyBody(event.target.value)}
          placeholder="Write a pastoral, clear reply..."
        />
        <button
          type="button"
          disabled={!replyBody.trim() || busyId === `reply-${selected._id}`}
          onClick={() => mutate(selected._id, "reply", { replyBody })}
          className="btn-primary mt-4 w-full disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
        >
          {busyId === `reply-${selected._id}` ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={17} />}
          {busyId === `reply-${selected._id}` ? "Sending..." : "Send reply"}
        </button>
        <p className="mt-3 text-xs leading-5 text-white/42">
          If Resend email is not configured, the reply is still recorded in the inbox with delivery status "not_configured".
        </p>
      </div>
    </motion.section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <p className="uppercase tracking-[0.12em]">{label}</p>
      <p className="mt-2 break-words text-white/68">{value}</p>
    </div>
  );
}

function Badge({ children, tone = "default" }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
      tone === "gold"
        ? "bg-yellow-200/14 text-yellow-100"
        : tone === "green"
          ? "bg-emerald-300/12 text-emerald-100"
          : "bg-white/8 text-white/48"
    }`}>
      {children}
    </span>
  );
}

function ActionButton({ children, busy, onClick }) {
  return (
    <button type="button" onClick={onClick} disabled={busy} className="btn-ghost disabled:pointer-events-none disabled:opacity-60">
      {busy ? <LoaderCircle className="animate-spin" size={16} /> : children}
    </button>
  );
}

function InboxSkeleton() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
      <div className="grid gap-3">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-[24px] border border-white/10 bg-white/[0.045]" />
        ))}
      </div>
      <div className="h-[32rem] animate-pulse rounded-[28px] border border-white/10 bg-white/[0.045]" />
    </div>
  );
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en", { month: "short", day: "numeric" });
}
