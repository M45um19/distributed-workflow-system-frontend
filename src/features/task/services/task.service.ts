import { apiClient } from "@/lib/api-client";
import { CreateTaskInput, SingleTaskResponse, TaskListResponse } from "../types/task.types";

export const taskService = {
  async createTask(workspaceId: string, projectId: string, data: CreateTaskInput): Promise<SingleTaskResponse> {
    const response = await apiClient.post<SingleTaskResponse>(`/workspace/${workspaceId}/projects/${projectId}/tasks`, data);
    return response.data;
  },

  async getTasks(
    workspaceId: string,
    projectId: string,
    params?: { page?: number; limit?: number; status?: string | string[] }
  ): Promise<TaskListResponse> {
    const statusParam = Array.isArray(params?.status) ? params.status.join(",") : params?.status;
    const response = await apiClient.get<TaskListResponse>(`/workspace/${workspaceId}/projects/${projectId}/tasks`, {
      params: {
        ...params,
        status: statusParam,
      },
    });
    return response.data;
  },
};
