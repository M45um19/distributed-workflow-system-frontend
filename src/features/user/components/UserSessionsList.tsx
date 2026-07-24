"use client";

import { useEffect, useState } from "react";
import { useUserSessions } from "../hooks/use-user";
import { getCookie } from "@/utils/cookies";
import {
  KeyRound,
  ShieldCheck,
  Laptop,
  Smartphone,
  Globe,
  RefreshCw,
  AlertCircle,
  Cpu,
  Wifi,
  CheckCircle2,
} from "lucide-react";

export default function UserSessionsList() {
  const { data: sessionsResponse, isLoading, isError, error, refetch, isFetching } = useUserSessions();
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

  const sessions = sessionsResponse?.data || [];

  useEffect(() => {
    const token = getCookie("refreshToken") || getCookie("accessToken");
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length >= 2) {
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const parsed = JSON.parse(jsonPayload);
          const deviceId = parsed.deviceId || parsed.device_id || null;
          setCurrentDeviceId(deviceId);
        }
      } catch (err) {
        console.error("Failed to parse token for deviceId:", err);
      }
    }
  }, []);

  const getDeviceIcon = (deviceName: string) => {
    const lowerName = deviceName.toLowerCase();
    if (lowerName.includes("mobile") || lowerName.includes("android") || lowerName.includes("iphone") || lowerName.includes("phone")) {
      return <Smartphone className="w-5 h-5 text-primary" />;
    }
    return <Laptop className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-[0_0_15px_rgba(255,1,79,0.15)]">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Active Sessions
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary">
                {isLoading ? "..." : sessions.length} Active
              </span>
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              Manage and view devices currently logged into your account.
            </p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-zinc-200 text-sm font-medium transition-all duration-300 hover:border-primary/40 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Device Connections
          </h2>
          <span className="text-xs text-zinc-500">
            Automated session verification
          </span>
        </div>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 animate-pulse flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 shrink-0" />
                  <div className="space-y-2">
                    <div className="w-40 h-4 bg-zinc-800 rounded" />
                    <div className="w-28 h-3 bg-zinc-800/60 rounded" />
                  </div>
                </div>
                <div className="w-24 h-6 bg-zinc-800 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-300">
                Failed to load user sessions
              </p>
              <p className="text-xs text-red-400/80 mt-1">
                {(error as Error)?.message || "An unexpected error occurred while fetching sessions."}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-medium bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-lg transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && sessions.length === 0 && (
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-500 mx-auto">
              <KeyRound className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-semibold text-zinc-200">
                No active sessions found
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                We couldn&apos;t locate any active login tokens associated with your account.
              </p>
            </div>
          </div>
        )}

        {/* Sessions List */}
        {!isLoading && !isError && sessions.length > 0 && (
          <div className="grid gap-4">
            {sessions.map((session, index) => {
              const isThisDevice = Boolean(
                currentDeviceId && session.deviceId && session.deviceId === currentDeviceId
              );

              return (
                <div
                  key={session.deviceId || index}
                  className={`group relative bg-zinc-900/50 hover:bg-zinc-900/80 border rounded-xl p-5 transition-all duration-300 shadow-md hover:shadow-lg ${
                    isThisDevice
                      ? "border-emerald-500/40 bg-emerald-950/10 hover:border-emerald-500/60 shadow-emerald-900/10"
                      : "border-zinc-800/80 hover:border-primary/40 hover:shadow-primary/5"
                  } flex flex-col md:flex-row md:items-center justify-between gap-4`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-primary/30 transition-all duration-300">
                      {getDeviceIcon(session.deviceName || "")}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                          {session.deviceName || "Unknown Device"}
                        </h3>
                        {isThisDevice && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> This Device Session
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-zinc-400 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <Wifi className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="font-mono text-zinc-300">{session.ip || "N/A"}</span>
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="font-mono text-zinc-400 text-[11px]">
                            Device ID: {session.deviceId ? `${session.deviceId.slice(0, 12)}...` : "N/A"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-xs font-medium text-zinc-300">
                      <Globe className="w-3.5 h-3.5 text-primary/80" />
                      Active Token
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
