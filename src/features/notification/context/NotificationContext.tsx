"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "@/utils/cookies";
import { useQueryClient } from "@tanstack/react-query";
import { Notification } from "../types/notification.types";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { createNotificationSocket } from "@/lib/notification-socket";

interface ToastNotification extends Notification {
  toastId: string;
}

interface NotificationContextProps {
  toasts: ToastNotification[];
  removeToast: (toastId: string) => void;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const removeToast = (toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  };

  useEffect(() => {
    if (!user) {
      setIsConnected(false);
      return;
    }

    const token = getCookie("accessToken");
    if (!token) return;

    // Connect to the socket server
    const socket = createNotificationSocket(token);

    socket.on("connect", () => {
      console.log("[NotificationSocket] Connected to server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("[NotificationSocket] Disconnected from server");
      setIsConnected(false);
    });

    socket.on("notification-received", (notification: Notification) => {

      // 1. Trigger dynamic toast alert
      const toastId = notification._id || Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { ...notification, toastId }]);

      // Auto remove toast after 5 seconds
      setTimeout(() => {
        removeToast(toastId);
      }, 5000);

      // 2. Update TanStack Query Cache
      queryClient.setQueryData(["notifications"], (oldData: any) => {
        if (!oldData) {
          return {
            statusCode: 200,
            success: true,
            message: "Notifications fetched successfully",
            data: [notification],
            meta: { total: 1 }
          };
        }

        // Avoid adding duplicates if socket event triggers twice
        const exists = oldData.data.some((n: Notification) => n._id === notification._id);
        if (exists) return oldData;

        return {
          ...oldData,
          data: [notification, ...oldData.data],
          meta: {
            ...oldData.meta,
            total: (oldData.meta?.total || 0) + 1
          }
        };
      });
    });

    return () => {
      socket.close();
    };
  }, [user, queryClient]);

  return (
    <NotificationContext.Provider value={{ toasts, removeToast, isConnected }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationContext must be used within a NotificationProvider");
  }
  return context;
}
