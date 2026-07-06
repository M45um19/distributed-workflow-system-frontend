"use client";

import { CheckSquare, Plus } from "lucide-react";

export default function TaskPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tasks</h1>
          <p className="text-sm text-zinc-400">View and prioritize your active action items</p>
        </div>
        <button className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </div>

      <div className="glass-panel-glow border border-white/5 rounded-xl p-8 text-center max-w-2xl mx-auto mt-12 space-y-4">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 border border-primary/20 text-primary">
          <CheckSquare className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-white">No active tasks</h3>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto">
          Add tasks to assign responsibilities, set milestones, and run workflow loops.
        </p>
        <button className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer">
          Create First Task
        </button>
      </div>
    </div>
  );
}
