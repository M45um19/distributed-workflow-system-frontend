"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { LayoutDashboard, LogOut, Loader2, Activity } from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout, isLoggingOut } = useAuth();

  const menuItems = [
    { name: "Workspace", href: "/dashboard/workspace", icon: LayoutDashboard },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-bg-dark border-r border-zinc-800/80 flex flex-col justify-between p-6 z-30">
      <div className="space-y-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group px-2">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 group-hover:border-primary transition-all duration-300">
            <Activity className="w-4.5 h-4.5 text-primary group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-lg font-bold tracking-wider text-white group-hover:text-primary transition-colors duration-300">
            FLOW<span className="text-primary">SYNC</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border ${isActive
                    ? "text-primary bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(255,1,79,0.08)] font-semibold"
                    : "text-zinc-400 border-transparent hover:text-white hover:bg-white/5"
                  }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "text-primary scale-110" : ""}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile card & Logout */}
      <div className="pt-6 border-t border-zinc-800/80 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shadow-[0_0_10px_rgba(255,1,79,0.1)] flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
              alt={user?.full_name || "Profile"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <span className="text-sm font-semibold text-white block truncate">
              {user?.full_name}
            </span>
            <span className="text-xs text-zinc-500 block truncate">
              {user?.email}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 bg-zinc-900/60 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/30 text-zinc-400 hover:text-red-400 font-medium py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs cursor-pointer"
        >
          {isLoggingOut ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LogOut className="w-3.5 h-3.5" />
          )}
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
