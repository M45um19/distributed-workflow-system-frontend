"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Mail, User as UserIcon, Shield, CheckCircle, Activity } from "lucide-react";

export default function DashboardOverview() {
  const { user } = useAuth();

  return (
    <div className="relative space-y-8 overflow-hidden">
      <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Welcome Banner */}
        <div className="glass-panel-glow rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/5">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_rgba(255,1,79,0.3)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                alt={user?.full_name || "User Avatar"}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider block">
                Workspace Dashboard
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
                Welcome back, {user?.full_name}!
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Your session is active and secured.
              </p>
            </div>
          </div>
        </div>

        {/* Info & Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel-glow rounded-xl p-6 shadow-lg border border-white/5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                  Identity Provider
                </span>
                <span className="text-sm font-bold text-white mt-2 block break-all">
                  {user?.email}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                <Mail className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center gap-1.5 text-xs text-zinc-500">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Email verified
            </div>
          </div>

          <div className="glass-panel-glow rounded-xl p-6 shadow-lg border border-white/5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                  Unique User ID
                </span>
                <span className="text-xs font-mono text-zinc-300 mt-2 block break-all">
                  {user?.id}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                <UserIcon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center gap-1.5 text-xs text-zinc-500">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              Access Role: USER
            </div>
          </div>

          <div className="glass-panel-glow rounded-xl p-6 shadow-lg border border-white/5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                  System Security
                </span>
                <span className="text-sm font-bold text-white mt-2 block">
                  JWT / AES-256
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center gap-1.5 text-xs text-zinc-500">
              <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
              Sliding Session Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
