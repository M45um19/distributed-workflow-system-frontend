import { z } from "zod";

export const workspaceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  description: z.string().optional(),
  owner_id: z.string(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export type Workspace = z.infer<typeof workspaceSchema>;

export const createWorkspaceInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  description: z.string().max(500).optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceInputSchema>;

export interface WorkspaceResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Workspace[];
}

export interface SingleWorkspaceResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Workspace;
}

export const workspaceMemberSchema = z.object({
  user_id: z.string(),
  full_name: z.string(),
  email: z.string().email(),
  role: z.string(),
  joined_at: z.string(),
});

export type WorkspaceMember = z.infer<typeof workspaceMemberSchema>;

export interface WorkspaceMembersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: WorkspaceMember[];
}

