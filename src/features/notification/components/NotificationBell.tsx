"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Loader2, Info, CheckCircle2, AlertTriangle, XCircle, Inbox } from "lucide-react";
import { useNotifications, useMarkNotificationsAsRead } from "../hooks/use-notification";
import { AnimatePresence, motion } from "framer-motion";
import { Notification } from "../types/notification.types";

const typeStyles = {
  INFO: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    icon: Info,
  },
  SUCCESS: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    icon: CheckCircle2,
  },
  WARN: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    icon: AlertTriangle,
  },
  ERROR: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
    icon: XCircle,
  },
};

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function NotificationBell() {
  const { data, isLoading } = useNotifications();
  const markAsReadMutation = useMarkNotificationsAsRead();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen) {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);
      if (unreadIds.length > 0) {
        markAsReadMutation.mutate(unreadIds);
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all duration-300 cursor-pointer"
        aria-label="Toggle notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-lg shadow-primary/20 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3.5 w-80 sm:w-96 bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-semibold">
                    {unreadCount} unread
                  </span>
                )}
              </div>
            </div>

            {/* Content List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-zinc-900">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span className="text-xs text-zinc-500">Loading notifications...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-zinc-500">
                  <div className="p-3 bg-zinc-900/50 border border-zinc-800/40 rounded-full">
                    <Inbox className="w-6 h-6 text-zinc-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-zinc-400">All caught up!</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">No notifications yet.</p>
                  </div>
                </div>
              ) : (
                notifications.map((notification) => {
                  const style = typeStyles[notification.type] || typeStyles.INFO;
                  const Icon = style.icon;

                  return (
                    <div
                      key={notification._id}
                      className={`p-4 flex gap-3 transition-colors duration-200 relative group hover:bg-white/[0.02] ${
                        !notification.isRead ? "bg-primary/[0.01]" : ""
                      }`}
                    >
                      {/* Unread dot indicator */}
                      {!notification.isRead && (
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                      )}

                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className={`p-1.5 rounded-lg border ${style.bg} ${style.border} ${style.text}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-bold truncate ${!notification.isRead ? "text-white" : "text-zinc-300"}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-zinc-500 shrink-0 mt-0.5">
                            {notification.createdAt ? formatRelativeTime(notification.createdAt) : ""}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed break-words">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
