"use client";

import { Task } from "../types/task.types";
import { X, User, Calendar, Clock, MessageSquare, Tag, AlertCircle } from "lucide-react";

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenComments: (task: Task) => void;
}

export default function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onOpenComments,
}: TaskDetailsModalProps) {
  if (!isOpen || !task) return null;

  const priorityColors: Record<string, string> = {
    LOW: "bg-zinc-800 text-zinc-400 border-zinc-700/50",
    MEDIUM: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const statusLabels: Record<string, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    REVIEW: "In Review",
    DONE: "Done",
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-zinc-950 border border-zinc-800/80 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between gap-4 bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${priorityColors[task.priority]}`}>
              {task.priority} Priority
            </span>
            <span className="text-[10px] font-semibold bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-md border border-zinc-700/50">
              {statusLabels[task.status] || task.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Full Task Details */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Full Title */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight leading-snug break-words">
              {task.title}
            </h2>
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
              Description
            </h4>
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-4 min-h-[80px]">
              {task.description ? (
                <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed break-words">
                  {task.description}
                </p>
              ) : (
                <p className="text-xs text-zinc-500 italic">No description provided for this task.</p>
              )}
            </div>
          </div>

          {/* Task Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 border-t border-zinc-800/60 pt-4">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                Assignee
              </span>
              <p className="text-xs font-semibold text-zinc-200">
                {task.assignee_name || "Unassigned"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                Due Date
              </span>
              <p className="text-xs font-semibold text-zinc-200">
                {formatDate(task.deadline)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                Created At
              </span>
              <p className="text-xs font-semibold text-zinc-200">
                {formatDate(task.created_at)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-zinc-400" />
                Task ID
              </span>
              <p className="text-[11px] font-mono text-zinc-400 truncate" title={task.id}>
                {task.id}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenComments(task);
            }}
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comments</span>
          </button>

          <button
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
