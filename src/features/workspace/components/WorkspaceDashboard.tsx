"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Plus, Loader2, X, FolderKanban, ChevronLeft, ChevronRight } from "lucide-react";
import { useOwnedWorkspaces, useJoinedWorkspaces, useCreateWorkspace } from "../hooks/use-workspace";
import axios from "axios";

export default function WorkspaceDashboard() {
  const [activeTab, setActiveTab] = useState<"owned" | "joined">("owned");
  const [ownedPage, setOwnedPage] = useState(1);
  const [joinedPage, setJoinedPage] = useState(1);
  const LIMIT = 6;

  const { data: ownedData, isLoading: isOwnedLoading } = useOwnedWorkspaces(ownedPage, LIMIT);
  const { data: joinedData, isLoading: isJoinedLoading } = useJoinedWorkspaces(joinedPage, LIMIT);
  const createWorkspaceMutation = useCreateWorkspace();

  const ownedWorkspaces = ownedData?.data || [];
  const joinedWorkspaces = joinedData?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isManualSlug, setIsManualSlug] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isManualSlug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsManualSlug(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWorkspaceMutation.mutateAsync({
        name,
        slug,
        description: description || undefined,
      });
      // Reset state and close modal
      setName("");
      setSlug("");
      setDescription("");
      setIsManualSlug(false);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Workspace creation failed:", err);
    }
  };

  const errorMsg = createWorkspaceMutation.error
    ? axios.isAxiosError(createWorkspaceMutation.error)
      ? createWorkspaceMutation.error.response?.data?.message || createWorkspaceMutation.error.message
      : (createWorkspaceMutation.error as Error).message || "An error occurred."
    : null;

  const isCurrentTabLoading = activeTab === "owned" ? isOwnedLoading : isJoinedLoading;
  const currentWorkspaces = activeTab === "owned" ? ownedWorkspaces : joinedWorkspaces;
  const currentPage = activeTab === "owned" ? ownedPage : joinedPage;
  const setCurrentPage = activeTab === "owned" ? setOwnedPage : setJoinedPage;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workspaces</h1>
          <p className="text-sm text-zinc-400">Manage your active workspaces and teams</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer"
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
                href={`/dashboard/workspace/${workspace.id}/projects`}
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
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-primary/30 disabled:opacity-40 disabled:hover:border-zinc-800 text-zinc-300 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentWorkspaces.length < LIMIT}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-primary/30 disabled:opacity-40 disabled:hover:border-zinc-800 text-zinc-300 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Workspace Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-primary" />
                Create Workspace
              </h3>
              <p className="text-xs text-zinc-400">
                Workspaces are where you and your team can collaborate and build pipelines.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">Workspace Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Acme Corp"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-primary/50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">Workspace Slug</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-zinc-500 text-sm select-none">/</span>
                  <input
                    type="text"
                    required
                    placeholder="acme-corp"
                    value={slug}
                    onChange={handleSlugChange}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-primary/50 text-white rounded-lg pl-6 pr-3 py-2 text-sm focus:outline-none transition-colors"
                  />
                </div>
                <p className="text-[10px] text-zinc-500">
                  This will be used in your workspace URL (lowercase letters, numbers, and dashes only).
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">Description (Optional)</label>
                <textarea
                  placeholder="What is this workspace for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-primary/50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createWorkspaceMutation.isPending}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer"
                >
                  {createWorkspaceMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Workspace</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
