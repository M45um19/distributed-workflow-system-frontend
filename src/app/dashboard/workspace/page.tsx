"use client";

import { LayoutDashboard, Plus } from "lucide-react";

export default function WorkspacePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workspaces</h1>
          <p className="text-sm text-zinc-400">Manage your active workspaces and teams</p>
        </div>
        <button className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          <span>New Workspace</span>
        </button>
      </div>

      <div className="glass-panel-glow border border-white/5 rounded-xl p-8 text-center max-w-2xl mx-auto mt-12 space-y-4">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 border border-primary/20 text-primary">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-white">No active workspaces</h3>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto">
          Create a workspace to start managing your projects, tasks, and team collaboration.
        </p>
        <button className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer">
          Get Started Tutorial
        </button>
      </div>
    </div>
  );
}
