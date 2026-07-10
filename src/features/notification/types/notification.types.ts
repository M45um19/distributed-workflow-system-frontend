import { z } from "zod";

export const notificationSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(["INFO", "SUCCESS", "WARN", "ERROR"]),
  isRead: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Notification = z.infer<typeof notificationSchema>;

export interface FetchNotificationsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Notification[];
  meta: {
    total: number;
  };
}

export interface MarkNotificationsReadResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: null;
}

