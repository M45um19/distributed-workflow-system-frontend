"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useOwnedWorkspaces, useJoinedWorkspaces } from "../hooks/use-workspace";
import CreateWorkspaceModal from "./CreateWorkspaceModal";

export default function WorkspaceDashboard() {
  const [activeTab, setActiveTab] = useState<"owned" | "joined">("owned");
  const [ownedCursorHistory, setOwnedCursorHistory] = useState<(string | undefined)[]>([undefined]);
  const [joinedCursorHistory, setJoinedCursorHistory] = useState<(string | undefined)[]>([undefined]);
  const LIMIT = 6;

  const currentOwnedCursor = ownedCursorHistory[ownedCursorHistory.length - 1];
  const currentJoinedCursor = joinedCursorHistory[joinedCursorHistory.length - 1];

  const { data: ownedData, isLoading: isOwnedLoading } = useOwnedWorkspaces(currentOwnedCursor, LIMIT);
  const { data: joinedData, isLoading: isJoinedLoading } = useJoinedWorkspaces(currentJoinedCursor, LIMIT);

  const ownedWorkspaces = ownedData?.data || [];
  const joinedWorkspaces = joinedData?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCurrentTabLoading = activeTab === "owned" ? isOwnedLoading : isJoinedLoading;
  const currentWorkspaces = activeTab === "owned" ? ownedWorkspaces : joinedWorkspaces;

  const canGoPrevious = activeTab === "owned"
    ? ownedCursorHistory.length > 1
    : joinedCursorHistory.length > 1;

  const nextCursor = activeTab === "owned"
    ? ownedData?.meta?.next_cursor
    : joinedData?.meta?.next_cursor;

  const canGoNext = Boolean(nextCursor);

  const handleNextPage = () => {
    if (!nextCursor) return;
    if (activeTab === "owned") {
      setOwnedCursorHistory((prev) => [...prev, nextCursor]);
    } else {
      setJoinedCursorHistory((prev) => [...prev, nextCursor]);
    }
  };

  const handlePreviousPage = () => {
    if (activeTab === "owned") {
      if (ownedCursorHistory.length > 1) {
        setOwnedCursorHistory((prev) => prev.slice(0, -1));
      }
    } else {
      if (joinedCursorHistory.length > 1) {
        setJoinedCursorHistory((prev) => prev.slice(0, -1));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workspaces</h1>
          <p className="text-sm text-zinc-400">Manage your active workspaces and teams</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Workspace</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800/80 gap-6">
        <button
          onClick={() => setActiveTab("owned")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "owned"
              ? "border-primary text-white font-bold"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Owned Workspaces
        </button>
        <button
          onClick={() => setActiveTab("joined")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "joined"
              ? "border-primary text-white font-bold"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Joined Workspaces
        </button>
      </div>

      {isCurrentTabLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
          <p className="text-zinc-400 text-sm">Loading workspaces...</p>
        </div>
      ) : currentWorkspaces.length === 0 ? (
        activeTab === "owned" ? (
          <div className="glass-panel-glow border border-white/5 rounded-xl p-8 text-center max-w-2xl mx-auto mt-12 space-y-4">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white">No owned workspaces</h3>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto">
              Create a workspace to start managing your projects, tasks, and team collaboration.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
            >
              Create Your First Workspace
            </button>
          </div>
        ) : (
          <div className="glass-panel-glow border border-white/5 rounded-xl p-8 text-center max-w-2xl mx-auto mt-12 space-y-4">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white">No joined workspaces</h3>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto">
              You {"haven't"} joined any workspaces yet. Ask your team administrator to send you an invitation!
            </p>
          </div>
        )
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentWorkspaces.map((workspace) => (
              <Link
                key={workspace.id}
                href={`/dashboard/workspace/${workspace.id}`}
                className="glass-panel-glow border border-white/5 rounded-xl p-6 hover:border-primary/30 hover:scale-[1.01] transition-all duration-300 block cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                    Active
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white truncate">{workspace.name}</h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">/{workspace.slug}</p>
                {workspace.description && (
                  <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{workspace.description}</p>
                )}
              </Link>
            ))}
          </div>

          {/* Pagination Arrows */}
          <div className="flex justify-end items-center gap-3 pt-4">
            <button
              onClick={handlePreviousPage}
              disabled={!canGoPrevious}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-primary/30 disabled:opacity-40 disabled:hover:border-zinc-800 text-zinc-300 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={!canGoNext}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-primary/30 disabled:opacity-40 disabled:hover:border-zinc-800 text-zinc-300 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
