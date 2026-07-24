import { apiClient } from "@/lib/api-client";
import { UserProfileResponse, UpdateProfileInput, UserSessionsResponse } from "../types/user.types";

export const userService = {
  async getProfile(): Promise<UserProfileResponse> {
    const response = await apiClient.get<UserProfileResponse>("/users/profile");
    return response.data;
  },

  async updateProfile(data: UpdateProfileInput): Promise<UserProfileResponse> {
    const response = await apiClient.put<UserProfileResponse>("/users/profile", data);
    return response.data;
  },

  async getSessions(): Promise<UserSessionsResponse> {
    const response = await apiClient.get<UserSessionsResponse>("/users/sessions");
    return response.data;
  },
};

