"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FolderGit2, ArrowLeft, Plus, Loader2, ChevronDown, User } from "lucide-react";
import { useProjects } from "../hooks/use-project";
import { useOwnedWorkspaces, useJoinedWorkspaces } from "@/features/workspace/hooks/use-workspace";
import { useTasks } from "@/features/task/hooks/use-task";
import { taskService } from "@/features/task/services/task.service";
import { Task } from "@/features/task/types/task.types";
import CreateTaskModal from "@/features/task/components/CreateTaskModal";

interface ProjectDetailsProps {
  workspaceId: string;
  projectId: string;
}

export default function ProjectDetails({ workspaceId, projectId }: ProjectDetailsProps) {
  const LIMIT = 5;

  const { data: projectsData, isLoading: isProjectsLoading } = useProjects(workspaceId);
  const { data: ownedData, isLoading: isOwnedLoading } = useOwnedWorkspaces(1, 100);
  const { data: joinedData, isLoading: isJoinedLoading } = useJoinedWorkspaces(1, 100);
  const { data: tasksData, isLoading: isTasksLoading } = useTasks(workspaceId, projectId, { page: 1, limit: LIMIT });

  const [columnTasks, setColumnTasks] = useState<Record<"TODO" | "IN_PROGRESS" | "REVIEW" | "DONE", Task[]>>({
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: [],
  });

  const [pages, setPages] = useState<Record<"TODO" | "IN_PROGRESS" | "REVIEW" | "DONE", number>>({
    TODO: 1,
    IN_PROGRESS: 1,
    REVIEW: 1,
    DONE: 1,
  });

  const [hasMore, setHasMore] = useState<Record<"TODO" | "IN_PROGRESS" | "REVIEW" | "DONE", boolean>>({
    TODO: false,
    IN_PROGRESS: false,
    REVIEW: false,
    DONE: false,
  });

  const [loadingMore, setLoadingMore] = useState<Record<"TODO" | "IN_PROGRESS" | "REVIEW" | "DONE", boolean>>({
    TODO: false,
    IN_PROGRESS: false,
    REVIEW: false,
    DONE: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const project = projectsData?.data?.find((p) => p.id === projectId);
  const workspace = ownedData?.data?.find((w) => w.id === workspaceId) || joinedData?.data?.find((w) => w.id === workspaceId);

  const isWorkspaceLoading = isOwnedLoading || isJoinedLoading;
  const isLoading = isProjectsLoading || isWorkspaceLoading || isTasksLoading;

  useEffect(() => {
    if (tasksData?.data) {
      setColumnTasks({
        TODO: tasksData.data.TODO || [],
        IN_PROGRESS: tasksData.data.IN_PROGRESS || [],
        REVIEW: tasksData.data.REVIEW || [],
        DONE: tasksData.data.DONE || [],
      });
      setPages({
        TODO: 1,
        IN_PROGRESS: 1,
        REVIEW: 1,
        DONE: 1,
      });
      setHasMore({
        TODO: (tasksData.data.TODO || []).length === LIMIT,
        IN_PROGRESS: (tasksData.data.IN_PROGRESS || []).length === LIMIT,
        REVIEW: (tasksData.data.REVIEW || []).length === LIMIT,
        DONE: (tasksData.data.DONE || []).length === LIMIT,
      });
    }
  }, [tasksData]);

  const handleLoadMore = async (status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE") => {
    if (loadingMore[status] || !hasMore[status]) return;

    setLoadingMore((prev) => ({ ...prev, [status]: true }));
    const nextPage = pages[status] + 1;

    try {
      const response = await taskService.getTasks(workspaceId, projectId, {
        status: [status],
        page: nextPage,
        limit: LIMIT,
      });

      const newTasks = response.data?.[status] || [];

      setColumnTasks((prev) => ({
        ...prev,
        [status]: [...prev[status], ...newTasks],
      }));

      setPages((prev) => ({
        ...prev,
        [status]: nextPage,
      }));

      setHasMore((prev) => ({
        ...prev,
        [status]: newTasks.length === LIMIT,
      }));
    } catch (err) {
      console.error(`Failed to load more tasks for status ${status}:`, err);
    } finally {
      setLoadingMore((prev) => ({ ...prev, [status]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-zinc-400 text-sm">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12 space-y-4">
        <h3 className="text-lg font-semibold text-white">Project not found</h3>
        <p className="text-sm text-zinc-400">The project you are looking for does not exist or you do not have permission to view it.</p>
        <Link 
          href={`/dashboard/workspace/${workspaceId}`} 
          className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button and breadcrumbs */}
      <div className="space-y-4">
        <Link
          href={`/dashboard/workspace/${workspaceId}`}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to {workspace?.name || "Workspace"} Projects
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-zinc-500 font-mono">
              <span>{workspace?.name}</span>
              <span>/</span>
              <span className="text-zinc-400">{project.name}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <FolderGit2 className="w-8 h-8 text-primary" />
              {project.name}
            </h1>
            {project.description && (
              <p className="text-sm text-zinc-400 max-w-3xl mt-2">{project.description}</p>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer self-start md:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {(["TODO", "IN_PROGRESS", "REVIEW", "DONE"] as const).map((status) => {
          const tasks = columnTasks[status] || [];
          const statusLabels: Record<string, string> = {
            TODO: "To Do",
            IN_PROGRESS: "In Progress",
            REVIEW: "In Review",
            DONE: "Completed",
          };

          const statusColors: Record<string, string> = {
            TODO: "border-t-zinc-500 bg-zinc-500/5",
            IN_PROGRESS: "border-t-sky-500 bg-sky-500/5",
            REVIEW: "border-t-amber-500 bg-amber-500/5",
            DONE: "border-t-emerald-500 bg-emerald-500/5",
          };

          const badgeColors: Record<string, string> = {
            TODO: "bg-zinc-800 text-zinc-400 border-zinc-700",
            IN_PROGRESS: "bg-sky-500/10 text-sky-400 border-sky-500/20",
            REVIEW: "bg-amber-500/10 text-amber-400 border-amber-500/20",
            DONE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          };

          return (
            <div
              key={status}
              className={`glass-panel-glow border border-white/5 border-t-2 rounded-xl p-4 flex flex-col gap-4 min-h-[300px] ${statusColors[status]}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-sm font-bold text-white">{statusLabels[status]}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColors[status]}`}>
                  {tasks.length}
                </span>
              </div>

              {/* Task Items */}
              <div className="flex flex-col gap-3 flex-1">
                {tasks.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center border border-dashed border-zinc-800/80 rounded-lg p-6 text-center">
                    <p className="text-xs text-zinc-500">No tasks</p>
                  </div>
                ) : (
                  tasks.map((task) => {
                    const priorityColors: Record<string, string> = {
                      LOW: "bg-zinc-800 text-zinc-400 border-zinc-700/50",
                      MEDIUM: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                      HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
                    };

                    return (
                      <div
                        key={task.id}
                        className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-4 hover:border-zinc-700 transition-colors space-y-3 cursor-pointer"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-semibold text-zinc-200 line-clamp-2">{task.title}</h4>
                        </div>
                        {task.description && (
                          <p className="text-xs text-zinc-400 line-clamp-2">{task.description}</p>
                        )}

                        <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${priorityColors[task.priority]}`}>
                              {task.priority}
                            </span>
                            {task.assignee_name && (
                              <div className="flex items-center gap-1 text-[10px] text-zinc-400 min-w-0" title={`Assigned to ${task.assignee_name}`}>
                                <User className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                                <span className="truncate max-w-[100px]">{task.assignee_name}</span>
                              </div>
                            )}
                          </div>
                          {task.deadline && (
                            <span className="text-[9px] text-zinc-500 font-mono flex-shrink-0">
                              Due: {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Load More Button */}
                {hasMore[status] && (
                  <div className="pt-2">
                    <button
                      onClick={() => handleLoadMore(status)}
                      disabled={loadingMore[status]}
                      className="w-full py-1.5 flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800/80 text-zinc-400 hover:text-white rounded-lg text-[10px] font-semibold transition-all border border-zinc-800 cursor-pointer disabled:opacity-50"
                    >
                      {loadingMore[status] ? (
                        <Loader2 className="w-3 h-3 animate-spin text-primary" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
                      )}
                      <span>Load More</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <CreateTaskModal
        workspaceId={workspaceId}
        projectId={projectId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
