import { z } from "zod";

export const loginInputSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerInputSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters").max(50, "Full name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: AuthData;
}

export const refreshTokenInputSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenInputSchema>;

export interface RefreshTokenResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface LogoutResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: null;
}

