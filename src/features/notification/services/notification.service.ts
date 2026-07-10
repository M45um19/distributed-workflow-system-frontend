import { apiClient } from "@/lib/api-client";
import { FetchNotificationsResponse, MarkNotificationsReadResponse } from "../types/notification.types";

export const notificationService = {
  async getNotifications(): Promise<FetchNotificationsResponse> {
    const response = await apiClient.get<FetchNotificationsResponse>("/notification");
    return response.data;
  },

  async markAsRead(notificationIds: string[]): Promise<MarkNotificationsReadResponse> {
    const response = await apiClient.patch<MarkNotificationsReadResponse>("/notification/read", {
      notificationIds,
    });
    return response.data;
  },
};
