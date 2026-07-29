"use client";

import { useState } from "react";
import { Task } from "../types/task.types";
import { useTaskComments, useAddComment } from "../hooks/use-task";
import { X, MessageSquare, Send, Loader2, User, Clock, ChevronDown } from "lucide-react";

interface TaskCommentsModalProps {
  workspaceId: string;
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskCommentsModal({
  workspaceId,
  task,
  isOpen,
  onClose,
}: TaskCommentsModalProps) {
  const [content, setContent] = useState("");
  const taskId = task?.id || "";

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTaskComments(workspaceId, taskId, 10);

  const addCommentMutation = useAddComment(workspaceId, taskId);

  if (!isOpen || !task) return null;

  const comments = data?.pages.flatMap((page) => page.data || []) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    try {
      await addCommentMutation.mutateAsync({ content: trimmed });
      setContent("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

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
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "Recently";
      return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-zinc-950 border border-zinc-800/80 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-start justify-between gap-4 bg-zinc-900/40">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <span className="text-[10px] font-semibold bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700/50">
                {statusLabels[task.status] || task.status}
              </span>
              {task.assignee_name && (
                <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <User className="w-3 h-3 text-zinc-500" />
                  {task.assignee_name}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight line-clamp-2">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                {task.description}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Comments Section */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Post Comment Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!content.trim() || addCommentMutation.isPending}
                className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
              >
                {addCommentMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Post Comment</span>
              </button>
            </div>
            {addCommentMutation.isError && (
              <p className="text-xs text-red-400">
                Failed to post comment. Please try again.
              </p>
            )}
          </form>

          <div className="border-t border-zinc-800/60 pt-4 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span>Comments ({comments.length})</span>
            </div>

            {/* Comments List */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-zinc-500 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs">Loading comments...</span>
              </div>
            ) : isError ? (
              <div className="py-6 text-center text-xs text-red-400">
                Failed to load comments.
              </div>
            ) : comments.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-zinc-800/80 rounded-xl">
                <p className="text-xs text-zinc-500">
                  No comments yet. Be the first to leave a comment!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-2 hover:border-zinc-700/80 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-[10px] font-bold">
                          {comment.user_name?.[0]?.toUpperCase() || <User className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-semibold text-zinc-200">
                          {comment.user_name || "User"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(comment.created_at)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed pl-8">
                      {comment.content}
                    </p>
                  </div>
                ))}

                {/* Load More Button for Cursor Pagination */}
                {hasNextPage && (
                  <div className="pt-2">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="w-full py-2.5 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold transition-colors border border-zinc-800 cursor-pointer disabled:opacity-50"
                    >
                      {isFetchingNextPage ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                      )}
                      <span>Load More Comments</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
