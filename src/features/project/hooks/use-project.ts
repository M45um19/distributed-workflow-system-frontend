import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../services/project.service";
import { CreateProjectInput } from "../types/project.types";

export function useProjects(workspaceId: string, cursor?: string, limit?: number) {
  return useQuery({
    queryKey: ["projects", workspaceId, cursor, limit],
    queryFn: () => projectService.getProjects(workspaceId, cursor, limit),
    enabled: !!workspaceId,
  });
}

export function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput) => projectService.createProject(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
}
