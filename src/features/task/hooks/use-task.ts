import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../services/task.service";
import { CreateTaskInput, UpdateTaskInput } from "../types/task.types";

export function useCreateTask(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskService.createTask(workspaceId, projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId, projectId] });
    },
  });
}

export function useUpdateTask(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskInput }) =>
      taskService.updateTask(workspaceId, taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId, projectId] });
    },
  });
}

export function useTasks(
  workspaceId: string,
  projectId: string,
  params?: { cursor?: string; limit?: number; status?: string | string[] }
) {
  return useQuery({
    queryKey: ["tasks", workspaceId, projectId, params],
    queryFn: () => taskService.getTasks(workspaceId, projectId, params),
    enabled: !!projectId && !!workspaceId,
  });
}

export function useUpdateTaskStatus(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      taskService.updateTaskStatus(workspaceId, taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId, projectId] });
    },
  });
}

