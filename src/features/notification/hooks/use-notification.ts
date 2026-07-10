import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notification.service";
import { FetchNotificationsResponse } from "../types/notification.types";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getNotifications(),
    staleTime: 5 * 60 * 1000, // 5 minutes (updates dynamically with socket events)
  });
}

export function useMarkNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationIds: string[]) => notificationService.markAsRead(notificationIds),
    onMutate: async (notificationIds) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData<FetchNotificationsResponse>(["notifications"]);

      queryClient.setQueryData<FetchNotificationsResponse>(["notifications"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((notification) =>
            notificationIds.includes(notification._id)
              ? { ...notification, isRead: true }
              : notification
          ),
        };
      });

      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications"], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
