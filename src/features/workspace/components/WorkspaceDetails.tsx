"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Briefcase, UserPlus, X, Mail, Copy, Check, AlertCircle } from "lucide-react";
import { useOwnedWorkspaces, useJoinedWorkspaces, useInviteUser } from "../hooks/use-workspace";
import ProjectList from "@/features/project/components/ProjectList";
import axios from "axios";

export default function WorkspaceDetails({ id }: { id: string }) {
  const { data: ownedData, isLoading: isOwnedLoading } = useOwnedWorkspaces(1, 100);
  const { data: joinedData, isLoading: isJoinedLoading } = useJoinedWorkspaces(1, 100);
  const inviteMutation = useInviteUser(id);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER" | "VIEWER">("MEMBER");
  const [inviteResultUrl, setInviteResultUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const workspace = ownedData?.data?.find((w) => w.id === id) || joinedData?.data?.find((w) => w.id === id);
  const isWorkspaceLoading = isOwnedLoading || isJoinedLoading;

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await inviteMutation.mutateAsync({
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteResultUrl(result.data.invite_url);
    } catch (err) {
      console.error("Failed to send invitation:", err);
    }
  };

  const handleCopyLink = () => {
    if (!inviteResultUrl) return;
    navigator.clipboard.writeText(inviteResultUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isWorkspaceLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-zinc-400 text-sm">Loading workspace details...</p>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="text-center py-12 space-y-4">
        <h3 className="text-lg font-semibold text-white">Workspace not found</h3>
        <p className="text-sm text-zinc-400">The workspace you are looking for does not exist or you do not have permission to view it.</p>
        <Link href="/dashboard/workspace" className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" />
          Back to Workspaces
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button and title header */}
      <div className="space-y-4">
        <Link
          href="/dashboard/workspace"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Workspaces
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-primary" />
              {workspace.name}
            </h1>
            {workspace.description && (
              <p className="text-sm text-zinc-400 max-w-3xl mt-2">{workspace.description}</p>
            )}
          </div>
          <button
            onClick={() => {
              setInviteEmail("");
              setInviteRole("MEMBER");
              setInviteResultUrl(null);
              inviteMutation.reset();
              setIsInviteModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer self-start md:self-center"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      {/* Projects List feature component */}
      <ProjectList workspaceId={id} />

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !inviteMutation.isPending && setIsInviteModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setIsInviteModalOpen(false)}
                disabled={inviteMutation.isPending}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Invite Member
              </h3>
              <p className="text-xs text-zinc-400">
                Send an invitation link to collaborate in this workspace.
              </p>
            </div>

            {inviteResultUrl ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Invitation generated successfully! Share the URL below.</span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Invitation Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={inviteResultUrl}
                      className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center justify-center p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setIsInviteModalOpen(false)}
                    className="bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                {inviteMutation.error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {axios.isAxiosError(inviteMutation.error)
                        ? inviteMutation.error.response?.data?.message || inviteMutation.error.message
                        : (inviteMutation.error as Error).message || "Failed to send invitation."}
                    </span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      required
                      placeholder="colleague@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-primary/50 text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">Workspace Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as "ADMIN" | "MEMBER" | "VIEWER")}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-primary/50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="MEMBER">Member (Can edit and manage projects)</option>
                    <option value="ADMIN">Admin (Full access & manage settings)</option>
                    <option value="VIEWER">Viewer (Read-only access)</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    disabled={inviteMutation.isPending}
                    className="px-4 py-2 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteMutation.isPending}
                    className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer"
                  >
                    {inviteMutation.isPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Invitation</span>
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
