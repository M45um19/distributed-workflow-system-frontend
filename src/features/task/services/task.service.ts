import { apiClient } from "@/lib/api-client";
import {
  CommentCreateInput,
  CommentListResponse,
  CreateTaskInput,
  SingleCommentResponse,
  SingleTaskResponse,
  TaskListResponse,
  UpdateTaskInput,
} from "../types/task.types";

export const taskService = {
  async createTask(workspaceId: string, projectId: string, data: CreateTaskInput): Promise<SingleTaskResponse> {
    const response = await apiClient.post<SingleTaskResponse>(`/workspace/${workspaceId}/projects/${projectId}/tasks`, data);
    return response.data;
  },

  async updateTask(
    workspaceId: string,
    taskId: string,
    data: UpdateTaskInput
  ): Promise<SingleTaskResponse> {
    const response = await apiClient.put<SingleTaskResponse>(
      `/workspace/${workspaceId}/tasks/${taskId}`,
      data
    );
    return response.data;
  },

  async getTasks(
    workspaceId: string,
    projectId: string,
    params?: { cursor?: string; limit?: number; status?: string | string[] }
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

  async updateTaskStatus(
    workspaceId: string,
    taskId: string,
    status: string
  ): Promise<SingleTaskResponse> {
    const response = await apiClient.patch<SingleTaskResponse>(
      `/workspace/${workspaceId}/tasks/${taskId}/status`,
      { status }
    );
    return response.data;
  },

  async addComment(
    workspaceId: string,
    taskId: string,
    data: CommentCreateInput
  ): Promise<SingleCommentResponse> {
    const response = await apiClient.post<SingleCommentResponse>(
      `/workspace/${workspaceId}/tasks/${taskId}/comments`,
      data
    );
    return response.data;
  },

  async getComments(
    workspaceId: string,
    taskId: string,
    params?: { cursor?: string; limit?: number }
  ): Promise<CommentListResponse> {
    const response = await apiClient.get<CommentListResponse>(
      `/workspace/${workspaceId}/tasks/${taskId}/comments`,
      { params }
    );
    return response.data;
  },
};

