"use client";

import { useState } from "react";
import { FolderKanban, X, Loader2 } from "lucide-react";
import { useCreateWorkspace } from "../hooks/use-workspace";
import axios from "axios";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
  const createWorkspaceMutation = useCreateWorkspace();

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
      onClose();
    } catch (err) {
      console.error("Workspace creation failed:", err);
    }
  };

  const errorMsg = createWorkspaceMutation.error
    ? axios.isAxiosError(createWorkspaceMutation.error)
      ? createWorkspaceMutation.error.response?.data?.message || createWorkspaceMutation.error.message
      : (createWorkspaceMutation.error as Error).message || "An error occurred."
    : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6 overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={onClose}
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
              onClick={onClose}
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
  );
}
