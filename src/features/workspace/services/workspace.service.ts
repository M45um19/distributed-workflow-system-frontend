import { apiClient } from "@/lib/api-client";
import { CreateWorkspaceInput, WorkspaceResponse, SingleWorkspaceResponse, WorkspaceMembersResponse } from "../types/workspace.types";

export const workspaceService = {
  async getWorkspaces(page?: number, limit?: number): Promise<WorkspaceResponse> {
    const response = await apiClient.get<WorkspaceResponse>("/workspace", {
      params: { page, limit },
    });
    return response.data;
  },

  async getOwnedWorkspaces(page?: number, limit?: number): Promise<WorkspaceResponse> {
    const response = await apiClient.get<WorkspaceResponse>("/workspace/owned", {
      params: { page, limit },
    });
    return response.data;
  },

  async getJoinedWorkspaces(page?: number, limit?: number): Promise<WorkspaceResponse> {
    const response = await apiClient.get<WorkspaceResponse>("/workspace/joined", {
      params: { page, limit },
    });
    return response.data;
  },

  async createWorkspace(data: CreateWorkspaceInput): Promise<SingleWorkspaceResponse> {
    const response = await apiClient.post<SingleWorkspaceResponse>("/workspace", data);
    return response.data;
  },

  async getWorkspaceById(id: string): Promise<SingleWorkspaceResponse> {
    const response = await apiClient.get<SingleWorkspaceResponse>(`/workspace/${id}`);
    return response.data;
  },

  async deleteWorkspace(id: string): Promise<void> {
    await apiClient.delete(`/workspace/${id}`);
  },

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMembersResponse> {
    const response = await apiClient.get<WorkspaceMembersResponse>(`/workspace/${workspaceId}/members`);
    return response.data;
  },
};

