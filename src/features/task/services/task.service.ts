import { apiClient } from "@/lib/api-client";
import { CreateTaskInput, SingleTaskResponse, TaskListResponse } from "../types/task.types";

export const taskService = {
  async createTask(projectId: string, data: CreateTaskInput): Promise<SingleTaskResponse> {
    const response = await apiClient.post<SingleTaskResponse>(`/workspace/projects/${projectId}/tasks`, data);
    return response.data;
  },

  async getTasks(
    projectId: string,
    params?: { page?: number; limit?: number; status?: string | string[] }
  ): Promise<TaskListResponse> {
    const statusParam = Array.isArray(params?.status) ? params.status.join(",") : params?.status;
    const response = await apiClient.get<TaskListResponse>(`/workspace/projects/${projectId}/tasks`, {
      params: {
        ...params,
        status: statusParam,
      },
    });
    return response.data;
  },
};
