"use client";

import { useState, useEffect } from "react";
import { Plus, X, Loader2, User, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { useCreateTask } from "../hooks/use-task";
import { useWorkspaceMembers } from "@/features/workspace/hooks/use-workspace";
import axios from "axios";

interface CreateTaskModalProps {
  workspaceId: string;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ workspaceId, projectId, isOpen, onClose }: CreateTaskModalProps) {
  const createTaskMutation = useCreateTask(workspaceId, projectId);
  const { data: membersData, isLoading: isMembersLoading } = useWorkspaceMembers(workspaceId);
  const members = membersData?.data || [];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [assigneeId, setAssigneeId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDeadline("");
      setSuccessMessage("");
      createTaskMutation.reset();
      if (members.length > 0) {
        setAssigneeId(members[0].user_id);
      } else {
        setAssigneeId("");
      }
    }
  }, [isOpen, members]);

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
        onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !createTaskMutation.isPending && onClose()}
      />

      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6 overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={onClose}
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
                onClick={onClose}
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
  );
}
