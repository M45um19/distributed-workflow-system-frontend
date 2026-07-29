import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().max(1000).optional(),
  status: z.string().default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  assignee_id: z.string().min(1, "Assignee is required"),
  assignee_name: z.string().optional(),
  deadline: z.string().optional(),
  created_at: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

export const createTaskInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().max(1000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  assignee_id: z.string().min(1, "Assignee is required"),
  deadline: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const updateTaskInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().max(1000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  assignee_id: z.string().min(1, "Assignee is required"),
  deadline: z.string().optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

export interface SingleTaskResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Task;
}

export interface TaskListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    TODO: Task[];
    IN_PROGRESS: Task[];
    REVIEW: Task[];
    DONE: Task[];
  };
  meta?: {
    next_cursors?: Record<string, string>;
  };
}

export interface UpdateTaskStatusInput {
  status: string;
}

export const taskCommentSchema = z.object({
  id: z.string(),
  workspace_id: z.string().optional(),
  task_id: z.string().optional(),
  user_id: z.string().optional(),
  user_name: z.string().optional(),
  content: z.string().min(1, "Comment content is required"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type TaskComment = z.infer<typeof taskCommentSchema>;

export const commentCreateInputSchema = z.object({
  content: z.string().min(1, "Comment content is required").max(1000, "Comment cannot exceed 1000 characters"),
});

export type CommentCreateInput = z.infer<typeof commentCreateInputSchema>;

export interface SingleCommentResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: TaskComment;
}

export interface CommentListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: TaskComment[];
  meta?: {
    next_cursor?: string;
  };
}


