"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import AuthGuard from "@/features/auth/components/AuthGuard";
import { Menu } from "lucide-react";
import { NotificationProvider } from "@/features/notification/context/NotificationContext";
import NotificationBell from "@/features/notification/components/NotificationBell";
import NotificationToasts from "@/features/notification/components/NotificationToasts";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <NotificationProvider>
        <div className="min-h-screen bg-bg-dark flex">
          {/* Mobile Header / Top Bar */}
          <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-bg-dark/90 backdrop-blur-md border-b border-zinc-800/50 z-20 px-6 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-md font-bold tracking-wider text-white">
              FLOW<span className="text-primary">SYNC</span>
            </span>
            <NotificationBell />
          </div>

          {/* Left Sidebar */}
          <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content Area */}
          <div className="flex-grow pl-0 md:pl-64 pt-16 md:pt-0 min-h-screen flex flex-col transition-all duration-300">
            {/* Desktop Header */}
            <header className="hidden md:flex h-16 border-b border-zinc-800/50 px-10 items-center justify-end bg-bg-dark/40 backdrop-blur-md sticky top-0 z-20 shrink-0">
              <NotificationBell />
            </header>

            <main className="flex-grow p-6 md:p-10 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>

        {/* Global Notifications Toast Panel */}
        <NotificationToasts />
      </NotificationProvider>
    </AuthGuard>
  );
}
