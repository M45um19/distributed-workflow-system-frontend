"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderGit2, Plus, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useProjects, useCreateProject } from "../hooks/use-project";
import axios from "axios";

interface ProjectListProps {
  workspaceId: string;
}

export default function ProjectList({ workspaceId }: ProjectListProps) {
  const [page, setPage] = useState(1);
  const LIMIT = 6;

  const { data: projectsData, isLoading: isProjectsLoading } = useProjects(workspaceId, page, LIMIT);
  const createProjectMutation = useCreateProject(workspaceId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const projects = projectsData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProjectMutation.mutateAsync({
        name,
        description: description || undefined,
      });
      setName("");
      setDescription("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Project creation failed:", err);
    }
  };

  const errorMsg = createProjectMutation.error
    ? axios.isAxiosError(createProjectMutation.error)
      ? createProjectMutation.error.response?.data?.message || createProjectMutation.error.message
      : (createProjectMutation.error as Error).message || "An error occurred."
    : null;

  if (isProjectsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
        <p className="text-zinc-400 text-xs">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Projects Title and Add Button */}
      <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Projects
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="glass-panel-glow border border-white/5 rounded-xl p-8 text-center max-w-2xl mx-auto mt-6 space-y-4">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-white">No active projects</h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Create a project within this workspace to start organizing your workflows.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/workspace/${workspaceId}/projects/${project.id}`}
                className="glass-panel-glow border border-white/5 rounded-xl p-6 hover:border-primary/30 hover:scale-[1.01] transition-all duration-300 space-y-4 flex flex-col justify-between block cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white truncate">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-zinc-400 line-clamp-2">{project.description}</p>
                  )}
                </div>
                <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}

          </div>

          {/* Pagination Arrows */}
          <div className="flex justify-end items-center gap-3 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-primary/30 disabled:opacity-40 disabled:hover:border-zinc-800 text-zinc-300 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={projects.length < LIMIT}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-primary/30 disabled:opacity-40 disabled:hover:border-zinc-800 text-zinc-300 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

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
                  onClick={() => setIsModalOpen(false)}
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
      )}
    </div>
  );
}
