import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../services/task.service";
import { CreateTaskInput } from "../types/task.types";

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskService.createTask(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}

export function useTasks(
  projectId: string,
  params?: { page?: number; limit?: number; status?: string | string[] }
) {
  return useQuery({
    queryKey: ["tasks", projectId, params],
    queryFn: () => taskService.getTasks(projectId, params),
    enabled: !!projectId,
  });
}

