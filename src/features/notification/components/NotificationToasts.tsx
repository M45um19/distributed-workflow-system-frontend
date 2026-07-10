"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { useNotificationContext } from "../context/NotificationContext";

const toastStyles = {
  INFO: {
    border: "border-blue-500/30",
    bg: "bg-blue-950/20",
    text: "text-blue-400",
    icon: Info,
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
  },
  SUCCESS: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-950/20",
    text: "text-emerald-400",
    icon: CheckCircle2,
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
  },
  WARN: {
    border: "border-amber-500/30",
    bg: "bg-amber-950/20",
    text: "text-amber-400",
    icon: AlertTriangle,
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
  },
  ERROR: {
    border: "border-rose-500/30",
    bg: "bg-rose-950/20",
    text: "text-rose-400",
    icon: XCircle,
    glow: "shadow-[0_0_15px_rgba(244,63,94,0.15)]",
  },
};

export default function NotificationToasts() {
  const { toasts, removeToast } = useNotificationContext();

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = toastStyles[toast.type] || toastStyles.INFO;
          const Icon = style.icon;

          return (
            <motion.div
              key={toast.toastId}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto w-full bg-zinc-950/95 border ${style.border} backdrop-blur-md rounded-xl p-4 flex gap-3.5 ${style.glow} shadow-2xl relative overflow-hidden group`}
            >
              {/* Colored left strip */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.text.replace("text-", "bg-")}`} />
              
              <div className="flex-shrink-0">
                <div className={`p-1.5 rounded-lg bg-white/5 border border-white/10 ${style.text}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 pr-6 space-y-1">
                <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                  {toast.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.toastId)}
                className="absolute top-3 right-3 p-1 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer rounded-lg hover:bg-white/5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
