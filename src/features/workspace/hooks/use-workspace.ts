import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "../services/workspace.service";
import { CreateWorkspaceInput } from "../types/workspace.types";

export function useWorkspaces(page?: number, limit?: number) {
  return useQuery({
    queryKey: ["workspaces", page, limit],
    queryFn: () => workspaceService.getWorkspaces(page, limit),
  });
}

export function useOwnedWorkspaces(page?: number, limit?: number) {
  return useQuery({
    queryKey: ["owned-workspaces", page, limit],
    queryFn: () => workspaceService.getOwnedWorkspaces(page, limit),
  });
}

export function useJoinedWorkspaces(page?: number, limit?: number) {
  return useQuery({
    queryKey: ["joined-workspaces", page, limit],
    queryFn: () => workspaceService.getJoinedWorkspaces(page, limit),
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
