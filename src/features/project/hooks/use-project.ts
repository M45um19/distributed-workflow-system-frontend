import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../services/project.service";
import { CreateProjectInput } from "../types/project.types";

export function useProjects(workspaceId: string, page?: number, limit?: number) {
  return useQuery({
    queryKey: ["projects", workspaceId, page, limit],
    queryFn: () => projectService.getProjects(workspaceId, page, limit),
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
