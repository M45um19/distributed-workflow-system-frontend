"use client";

import Link from "next/link";
import { Loader2, ArrowLeft, Briefcase } from "lucide-react";
import { useOwnedWorkspaces, useJoinedWorkspaces } from "../hooks/use-workspace";
import ProjectList from "@/features/project/components/ProjectList";

export default function WorkspaceDetails({ id }: { id: string }) {
  const { data: ownedData, isLoading: isOwnedLoading } = useOwnedWorkspaces(1, 100);
  const { data: joinedData, isLoading: isJoinedLoading } = useJoinedWorkspaces(1, 100);

  const workspace = ownedData?.data?.find((w) => w.id === id) || joinedData?.data?.find((w) => w.id === id);
  const isWorkspaceLoading = isOwnedLoading || isJoinedLoading;

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
        </div>
      </div>

      {/* Projects List feature component */}
      <ProjectList workspaceId={id} />
    </div>
  );
}
