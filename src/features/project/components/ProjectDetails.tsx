"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FolderGit2, ArrowLeft, Plus, Loader2, X, User, Calendar, AlertCircle, CheckCircle2, LayoutGrid, ChevronDown } from "lucide-react";
import { useProjects } from "../hooks/use-project";
import { useOwnedWorkspaces, useJoinedWorkspaces, useWorkspaceMembers } from "@/features/workspace/hooks/use-workspace";
import { useCreateTask, useTasks } from "@/features/task/hooks/use-task";
import { taskService } from "@/features/task/services/task.service";
import { Task } from "@/features/task/types/task.types";
import axios from "axios";



interface ProjectDetailsProps {
  workspaceId: string;
  projectId: string;
}

export default function ProjectDetails({ workspaceId, projectId }: ProjectDetailsProps) {
  const LIMIT = 5;

  const { data: projectsData, isLoading: isProjectsLoading } = useProjects(workspaceId);
  const { data: ownedData, isLoading: isOwnedLoading } = useOwnedWorkspaces(1, 100);
  const { data: joinedData, isLoading: isJoinedLoading } = useJoinedWorkspaces(1, 100);
  const { data: membersData, isLoading: isMembersLoading } = useWorkspaceMembers(workspaceId);
  const { data: tasksData, isLoading: isTasksLoading } = useTasks(projectId, { page: 1, limit: LIMIT });

  const createTaskMutation = useCreateTask(projectId);

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [assigneeId, setAssigneeId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const project = projectsData?.data?.find((p) => p.id === projectId);
  const workspace = ownedData?.data?.find((w) => w.id === workspaceId) || joinedData?.data?.find((w) => w.id === workspaceId);
  const members = membersData?.data || [];

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
      const response = await taskService.getTasks(projectId, {
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




  const handleOpenModal = () => {
    // Reset form states
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setAssigneeId(members[0]?.user_id || "");
    setDeadline("");
    setSuccessMessage("");
    createTaskMutation.reset();
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTaskMutation.mutateAsync({
        title,
        description: description || undefined,
        priority,
        assignee_id: assigneeId,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
      });

      setSuccessMessage("Task created successfully!");
      
      // Auto close modal after 1.5 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage("");
      }, 1500);
    } catch (err) {
      console.error("Task creation failed:", err);
    }
  };

  const errorMsg = createTaskMutation.error
    ? axios.isAxiosError(createTaskMutation.error)
      ? createTaskMutation.error.response?.data?.message || createTaskMutation.error.message
      : (createTaskMutation.error as Error).message || "An error occurred."
    : null;

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
          href={`/dashboard/workspace/${workspaceId}/projects`} 
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
          href={`/dashboard/workspace/${workspaceId}/projects`}
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
              <span className="text-primary">{project.name}</span>
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
            onClick={handleOpenModal}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer self-start md:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {(["TODO", "IN_PROGRESS", "REVIEW", "DONE"] as const).map((status) => {
          const tasksForStatus = columnTasks[status] || [];
          const displayStatusName =
            status === "TODO"
              ? "To Do"
              : status === "IN_PROGRESS"
              ? "In Progress"
              : status === "REVIEW"
              ? "In Review"
              : "Done";

          const colHeaderColor =
            status === "TODO"
              ? "border-t-zinc-600"
              : status === "IN_PROGRESS"
              ? "border-t-blue-500"
              : status === "REVIEW"
              ? "border-t-purple-500"
              : "border-t-emerald-500";

          const colDotColor =
            status === "TODO"
              ? "bg-zinc-400"
              : status === "IN_PROGRESS"
              ? "bg-blue-400"
              : status === "REVIEW"
              ? "bg-purple-400"
              : "bg-emerald-400";

          return (
            <div
              key={status}
              className={`flex flex-col bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 min-h-[500px] max-h-[700px] overflow-hidden border-t-4 ${colHeaderColor} transition-all duration-300 shadow-xl`}
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-900/60">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${colDotColor}`} />
                  <h3 className="text-sm font-bold text-white tracking-tight">{displayStatusName}</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {tasksForStatus.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
                {tasksForStatus.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-zinc-900 rounded-xl text-center">
                    <p className="text-[11px] text-zinc-500 font-medium">No tasks</p>
                  </div>
                ) : (
                  tasksForStatus.map((task) => {
                    const priorityColor =
                      task.priority === "LOW"
                        ? "bg-zinc-800/80 text-zinc-400 border-zinc-700/50"
                        : task.priority === "MEDIUM"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : task.priority === "HIGH"
                        ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"; // URGENT

                    return (
                      <div
                        key={task.id}
                        className="glass-panel-glow border border-white/5 bg-zinc-900/40 rounded-xl p-4 hover:border-primary/20 hover:scale-[1.01] transition-all duration-300 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <span className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded border ${priorityColor}`}>
                              {task.priority}
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-white leading-snug line-clamp-2">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-zinc-900/60 flex items-center justify-between gap-2 mt-auto">
                          {/* Assignee */}
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-[10px] font-bold text-primary uppercase shrink-0">
                              {task.assignee_name ? task.assignee_name.substring(0, 2) : "UN"}
                            </div>
                            <span className="text-[10px] text-zinc-400 truncate font-medium">
                              {task.assignee_name || "Unassigned"}
                            </span>
                          </div>

                          {/* Deadline */}
                          {task.deadline && (
                            <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-mono shrink-0">
                              <Calendar className="w-3 h-3 text-zinc-600" />
                              <span>{new Date(task.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Down Arrow / Load More Button */}
                {hasMore[status] && (
                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleLoadMore(status)}
                      disabled={loadingMore[status]}
                      className="flex items-center justify-center gap-1 w-full py-2 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-400 hover:text-white text-[11px] font-medium transition-all duration-300 cursor-pointer disabled:opacity-50"
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !createTaskMutation.isPending && setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={createTaskMutation.isPending}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add Task
              </h3>
              <p className="text-xs text-zinc-400">
                Create and assign tasks to workspace members.
              </p>
            </div>

            {successMessage ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <div className="p-3 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <p className="text-sm font-semibold text-white">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Integrate Auth Middleware"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-primary/50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">Description (Optional)</label>
                  <textarea
                    placeholder="Provide details about the task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-primary/50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300 block">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-primary/50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300 block">Deadline (Optional)</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-primary/50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Assignee</span>
                  </label>
                  {isMembersLoading ? (
                    <div className="flex items-center gap-2 text-xs text-zinc-500 py-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      Loading workspace members...
                    </div>
                  ) : members.length === 0 ? (
                    <div className="text-xs text-yellow-500 border border-yellow-500/20 bg-yellow-500/10 p-2 rounded-lg">
                      No members found in this workspace.
                    </div>
                  ) : (
                    <select
                      required
                      value={assigneeId}
                      onChange={(e) => setAssigneeId(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-primary/50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors cursor-pointer"
                    >
                      {assigneeId === "" && <option value="">Select Assignee</option>}
                      {members.map((member) => (
                        <option key={member.user_id} value={member.user_id}>
                          {member.full_name} ({member.email}) - {member.role}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={createTaskMutation.isPending}
                    className="px-4 py-2 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTaskMutation.isPending || (members.length === 0 && !assigneeId)}
                    className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer"
                  >
                    {createTaskMutation.isPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <span>Add Task</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
