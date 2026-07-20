import { apiClient } from "@/lib/api-client";
import { CreateWorkspaceInput, WorkspaceResponse, SingleWorkspaceResponse, WorkspaceMembersResponse, WorkspaceInviteInput, WorkspaceInviteResponse, AcceptInviteInput, AcceptInviteResponse } from "../types/workspace.types";

export const workspaceService = {
  async getWorkspaces(cursor?: string, limit?: number): Promise<WorkspaceResponse> {
    const response = await apiClient.get<WorkspaceResponse>("/workspace", {
      params: { cursor, limit },
    });
    return response.data;
  },

  async getOwnedWorkspaces(cursor?: string, limit?: number): Promise<WorkspaceResponse> {
    const response = await apiClient.get<WorkspaceResponse>("/workspace/owned", {
      params: { cursor, limit },
    });
    return response.data;
  },

  async getJoinedWorkspaces(cursor?: string, limit?: number): Promise<WorkspaceResponse> {
    const response = await apiClient.get<WorkspaceResponse>("/workspace/joined", {
      params: { cursor, limit },
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

  async inviteUser(workspaceId: string, data: WorkspaceInviteInput): Promise<WorkspaceInviteResponse> {
    const response = await apiClient.post<WorkspaceInviteResponse>(`/workspace/${workspaceId}/invites`, data);
    return response.data;
  },

  async acceptInvite(data: AcceptInviteInput): Promise<AcceptInviteResponse> {
    const response = await apiClient.post<AcceptInviteResponse>("/workspace/invites/accept", data);
    return response.data;
  },
};

