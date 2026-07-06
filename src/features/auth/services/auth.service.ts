import { apiClient } from "@/lib/api-client";
import { LoginInput, RegisterInput, AuthResponse, LogoutResponse, RefreshTokenResponse } from "../types/auth.types";

export const authService = {
  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  async logout(): Promise<LogoutResponse> {
    const response = await apiClient.post<LogoutResponse>("/auth/logout");
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>("/auth/refresh-token", { refreshToken });
    return response.data;
  },
};
