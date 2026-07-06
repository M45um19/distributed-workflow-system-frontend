"use client";

import { Shield, User, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-400">Configure your account preferences and integrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-primary bg-primary/10 border border-primary/20 text-left">
            <User className="w-4 h-4" />
            <span>Profile & Account</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent text-left cursor-pointer">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent text-left cursor-pointer">
            <Shield className="w-4 h-4" />
            <span>Security & API Keys</span>
          </button>
        </div>

        <div className="md:col-span-2 glass-panel-glow border border-white/5 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Account Preferences</h3>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Theme Mode
              </label>
              <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary w-full">
                <option>Dark Mode (Default)</option>
                <option disabled>Light Mode (Coming Soon)</option>
                <option disabled>AMOLED Black</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Default Workspace
              </label>
              <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary w-full">
                <option>None Selected</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
