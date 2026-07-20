import { apiClient } from "@/lib/api-client";
import { CreateProjectInput, ProjectListResponse, SingleProjectResponse } from "../types/project.types";

export const projectService = {
  async getProjects(workspaceId: string, cursor?: string, limit?: number): Promise<ProjectListResponse> {
    const response = await apiClient.get<ProjectListResponse>(`/workspace/${workspaceId}/projects`, {
      params: { cursor, limit },
    });
    return response.data;
  },

  async createProject(workspaceId: string, data: CreateProjectInput): Promise<SingleProjectResponse> {
    const response = await apiClient.post<SingleProjectResponse>(`/workspace/${workspaceId}/projects`, data);
    return response.data;
  },
};
