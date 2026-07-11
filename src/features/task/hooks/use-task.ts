import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../services/task.service";
import { CreateTaskInput } from "../types/task.types";

export function useCreateTask(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskService.createTask(workspaceId, projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId, projectId] });
    },
  });
}

export function useTasks(
  workspaceId: string,
  projectId: string,
  params?: { page?: number; limit?: number; status?: string | string[] }
) {
  return useQuery({
    queryKey: ["tasks", workspaceId, projectId, params],
    queryFn: () => taskService.getTasks(workspaceId, projectId, params),
    enabled: !!projectId && !!workspaceId,
  });
}

