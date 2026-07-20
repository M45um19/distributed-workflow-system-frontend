import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "../services/workspace.service";
import { CreateWorkspaceInput, WorkspaceInviteInput, AcceptInviteInput } from "../types/workspace.types";

export function useWorkspaces(cursor?: string, limit?: number) {
  return useQuery({
    queryKey: ["workspaces", cursor, limit],
    queryFn: () => workspaceService.getWorkspaces(cursor, limit),
  });
}

export function useOwnedWorkspaces(cursor?: string, limit?: number) {
  return useQuery({
    queryKey: ["owned-workspaces", cursor, limit],
    queryFn: () => workspaceService.getOwnedWorkspaces(cursor, limit),
  });
}

export function useJoinedWorkspaces(cursor?: string, limit?: number) {
  return useQuery({
    queryKey: ["joined-workspaces", cursor, limit],
    queryFn: () => workspaceService.getJoinedWorkspaces(cursor, limit),
  });
}

export function useWorkspaceById(id: string) {
  return useQuery({
    queryKey: ["workspace", id],
    queryFn: () => workspaceService.getWorkspaceById(id),
    enabled: !!id,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceInput) => workspaceService.createWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["owned-workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["joined-workspaces"] });
    },
  });
}

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => workspaceService.getWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useInviteUser(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkspaceInviteInput) => workspaceService.inviteUser(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-members", workspaceId] });
    },
  });
}

export function useAcceptInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AcceptInviteInput) => workspaceService.acceptInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["owned-workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["joined-workspaces"] });
    },
  });
}

