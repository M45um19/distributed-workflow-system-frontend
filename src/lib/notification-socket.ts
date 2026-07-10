import { io, Socket } from "socket.io-client";
import { env } from "@/config/env.config";

export const createNotificationSocket = (token: string): Socket => {
  return io(env.NEXT_PUBLIC_SOCKET_URL, {
    path: "/api/v1/notification/socket.io",
    auth: {
      token: `Bearer ${token}`,
    },
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });
};
