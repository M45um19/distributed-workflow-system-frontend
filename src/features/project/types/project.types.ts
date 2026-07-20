import { z } from "zod";

export const projectSchema = z.object({
  id: z.string(),
  workspace_id: z.string(),
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  status: z.string(),
  created_by: z.string(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema>;

export const createProjectInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export interface ProjectListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Project[];
  meta?: {
    next_cursor?: string;
  };
}

export interface SingleProjectResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Project;
}
