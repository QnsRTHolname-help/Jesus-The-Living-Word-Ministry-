"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check, Trash2, MailOpen, AlertCircle, Clock } from "lucide-react";

export default function NotificationManager() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.submissions || []);
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        // Trigger a global custom event to update the sidebar unread count immediately
        window.dispatchEvent(new Event("notificationsUpdated"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        window.dispatchEvent(new Event("notificationsUpdated"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        window.dispatchEvent(new Event("notificationsUpdated"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-200 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-100">
        <AlertCircle />
        <p>{error}</p>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Contact Messages</h2>
          <p className="text-sm text-white/58">
            You have {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-medium text-white/82 hover:bg-white/[0.085] hover:text-white"
          >
            <Check size={16} />
            Mark all read
          </button>
        )}
      </div>

      <div className="grid gap-4">
        <AnimatePresence initial={false}>
          {notifications.map((notif) => (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -2 }}
              className={`relative overflow-hidden rounded-[24px] border p-5 backdrop-blur-xl transition-all ${
                notif.isRead
                  ? "border-white/10 bg-white/[0.025] hover:bg-white/[0.04]"
                  : "border-yellow-200/20 bg-[radial-gradient(circle_at_0%_0%,rgba(216,184,106,0.1),transparent_30rem)] bg-white/[0.055] hover:bg-white/[0.07]"
              }`}
            >
              {!notif.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-yellow-200" />
              )}
              
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`grid h-8 w-8 place-items-center rounded-full ${
                      notif.isRead ? "bg-white/5 text-white/42" : "bg-yellow-200/12 text-yellow-100"
                    }`}>
                      {notif.isRead ? <MailOpen size={15} /> : <Mail size={15} />}
                    </span>
                    <h3 className="font-semibold text-white/90">{notif.name}</h3>
                    <span className="text-sm text-white/42">&lt;{notif.email}&gt;</span>
                  </div>

                  <h4 className="mt-3 text-lg font-medium text-white/82">
                    {notif.subject || "(No Subject)"}
                  </h4>
                  
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/64">
                    {notif.message}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-white/42">
                    <Clock size={12} />
                    <span>{formatDate(notif.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2 self-end md:self-start">
                  {!notif.isRead && (
                    <button
                      onClick={() => markAsRead(notif._id)}
                      title="Mark as read"
                      className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.045] text-white/62 hover:bg-white/[0.085] hover:text-white"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif._id)}
                    title="Delete message"
                    className="grid h-10 w-10 place-items-center rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.035] p-12 text-center backdrop-blur-xl">
            <MailOpen className="h-12 w-12 text-white/32" />
            <h3 className="mt-4 font-semibold text-white/82">No messages</h3>
            <p className="mt-2 text-sm text-white/48">
              All quiet here. You don't have any contact form submissions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
