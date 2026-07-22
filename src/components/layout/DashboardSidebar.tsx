"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useOwnedWorkspaces, useJoinedWorkspaces } from "@/features/workspace/hooks/use-workspace";
import { LayoutDashboard, Briefcase, Settings, User, KeyRound, LogOut, Loader2, Activity, X, Crown, Users } from "lucide-react";

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout, isLoggingOut } = useAuth();

  const { data: ownedData, isLoading: ownedLoading } = useOwnedWorkspaces(undefined, 6);
  const { data: joinedData, isLoading: joinedLoading } = useJoinedWorkspaces(undefined, 6);

  const ownedWorkspaces = ownedData?.data?.slice(0, 3) || [];
  const joinedWorkspaces = joinedData?.data?.slice(0, 3) || [];

  useEffect(() => {
    if (isOpen && onClose) {
      onClose();
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-25 transition-opacity duration-300"
        />
      )}

      <aside
        className={`w-64 h-screen fixed left-0 top-0 bg-bg-dark border-r border-zinc-800/80 flex flex-col justify-between p-6 z-30 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6 overflow-y-auto flex-1 pr-1 custom-scrollbar">
          {/* Logo & Close button */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group px-2">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 group-hover:border-primary transition-all duration-300">
                <Activity className="w-4.5 h-4.5 text-primary group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-lg font-bold tracking-wider text-white group-hover:text-primary transition-colors duration-300">
                FLOW<span className="text-primary">SYNC</span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="md:hidden p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            {/* Dashboard Overview Link */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border ${
                pathname === "/dashboard"
                  ? "text-primary bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(255,1,79,0.08)] font-semibold"
                  : "text-zinc-400 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard
                className={`w-4 h-4 transition-transform duration-300 ${
                  pathname === "/dashboard" ? "text-primary scale-110" : ""
                }`}
              />
              <span>Dashboard</span>
            </Link>

            {/* Workspaces Section */}
            <div className="space-y-1">
              {/* Main Workspaces Link */}
              <Link
                href="/dashboard/workspace"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border ${
                  pathname?.startsWith("/dashboard/workspace")
                    ? "text-primary bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(255,1,79,0.08)] font-semibold"
                    : "text-zinc-400 border-transparent hover:text-white hover:bg-white/5"
                }`}
              >
                <Briefcase
                  className={`w-4 h-4 transition-transform duration-300 ${
                    pathname?.startsWith("/dashboard/workspace") ? "text-primary scale-110" : ""
                  }`}
                />
                <span>Workspaces</span>
              </Link>

              {/* Sub-tabs container */}
              <div className="pl-3 pr-1 pt-2 space-y-4 border-l border-zinc-800/80 ml-5">
                {/* Category 1: Owned Workspaces */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 px-2 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                    <Crown className="w-3 h-3 text-primary/80" />
                    <span>Owned</span>
                  </div>

                  {ownedLoading ? (
                    <div className="px-2 py-1 flex items-center gap-2 text-xs text-zinc-600">
                      <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />
                      <span className="text-[11px]">Loading...</span>
                    </div>
                  ) : ownedWorkspaces.length > 0 ? (
                    ownedWorkspaces.map((ws) => {
                      const isWsActive = pathname === `/dashboard/workspace/${ws.id}`;
                      return (
                        <Link
                          key={ws.id}
                          href={`/dashboard/workspace/${ws.id}`}
                          title={ws.name}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                            isWsActive
                              ? "text-white bg-primary/15 border-l-2 border-primary pl-2 shadow-[0_0_10px_rgba(255,1,79,0.15)] font-semibold"
                              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isWsActive ? "bg-primary shadow-[0_0_8px_rgba(255,1,79,0.8)]" : "bg-zinc-600"
                            }`}
                          />
                          <span className="truncate">{ws.name}</span>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="px-2 py-1 text-[11px] text-zinc-600 italic">No owned workspaces</div>
                  )}
                </div>

                {/* Category 2: Member / Joined Workspaces */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center gap-1.5 px-2 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                    <Users className="w-3 h-3 text-primary/80" />
                    <span>Member</span>
                  </div>

                  {joinedLoading ? (
                    <div className="px-2 py-1 flex items-center gap-2 text-xs text-zinc-600">
                      <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />
                      <span className="text-[11px]">Loading...</span>
                    </div>
                  ) : joinedWorkspaces.length > 0 ? (
                    joinedWorkspaces.map((ws) => {
                      const isWsActive = pathname === `/dashboard/workspace/${ws.id}`;
                      return (
                        <Link
                          key={ws.id}
                          href={`/dashboard/workspace/${ws.id}`}
                          title={ws.name}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                            isWsActive
                              ? "text-white bg-primary/15 border-l-2 border-primary pl-2 shadow-[0_0_10px_rgba(255,1,79,0.15)] font-semibold"
                              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isWsActive ? "bg-primary shadow-[0_0_8px_rgba(255,1,79,0.8)]" : "bg-zinc-600"
                            }`}
                          />
                          <span className="truncate">{ws.name}</span>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="px-2 py-1 text-[11px] text-zinc-600 italic">No joined workspaces</div>
                  )}
                </div>
              </div>
            </div>

            {/* Settings Section & Subtabs */}
            <div className="space-y-1">
              <Link
                href="/dashboard/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border ${
                  pathname?.startsWith("/dashboard/settings")
                    ? "text-primary bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(255,1,79,0.08)] font-semibold"
                    : "text-zinc-400 border-transparent hover:text-white hover:bg-white/5"
                }`}
              >
                <Settings
                  className={`w-4 h-4 transition-transform duration-300 ${
                    pathname?.startsWith("/dashboard/settings") ? "text-primary scale-110" : ""
                  }`}
                />
                <span>Settings</span>
              </Link>

              {/* Settings Sub-tabs container */}
              <div className="pl-3 pr-1 pt-1 space-y-1 border-l border-zinc-800/80 ml-5">
                <Link
                  href="/dashboard/settings/profile"
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    pathname === "/dashboard/settings/profile"
                      ? "text-white bg-primary/15 border-l-2 border-primary pl-2 shadow-[0_0_10px_rgba(255,1,79,0.15)] font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-primary/80" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/dashboard/settings/session"
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    pathname === "/dashboard/settings/session"
                      ? "text-white bg-primary/15 border-l-2 border-primary pl-2 shadow-[0_0_10px_rgba(255,1,79,0.15)] font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-primary/80" />
                  <span>Session</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* User profile card & Logout */}
        <div className="pt-6 border-t border-zinc-800/80 space-y-4 shrink-0">
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
    </>
  );
}

