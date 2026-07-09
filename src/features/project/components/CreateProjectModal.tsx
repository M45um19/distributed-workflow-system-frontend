"use client";

import { useState } from "react";
import { FolderGit2, X, Loader2 } from "lucide-react";
import { useCreateProject } from "../hooks/use-project";
import axios from "axios";

interface CreateProjectModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ workspaceId, isOpen, onClose }: CreateProjectModalProps) {
  const createProjectMutation = useCreateProject(workspaceId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProjectMutation.mutateAsync({
        name,
        description: description || undefined,
      });
      setName("");
      setDescription("");
      onClose();
    } catch (err) {
      console.error("Project creation failed:", err);
    }
  };

  const errorMsg = createProjectMutation.error
    ? axios.isAxiosError(createProjectMutation.error)
      ? createProjectMutation.error.response?.data?.message || createProjectMutation.error.message
      : (createProjectMutation.error as Error).message || "An error occurred."
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
            <FolderGit2 className="w-5 h-5 text-primary" />
            Create Project
          </h3>
          <p className="text-xs text-zinc-400">
            Projects hold your workflow pipelines, tasks, and system triggers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 block">Project Name</label>
            <input
              type="text"
              required
              placeholder="e.g., E-Commerce Microservices Backend"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-primary/50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 block">Description (Optional)</label>
            <textarea
              placeholder="What is this project for?"
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
              disabled={createProjectMutation.isPending}
              className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer"
            >
              {createProjectMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Project</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
