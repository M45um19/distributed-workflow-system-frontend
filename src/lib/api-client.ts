import axios from "axios";
import { env } from "@/config/env.config";
import { getCookie, setCookie, deleteCookie } from "@/utils/cookies";

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface QueueItem {
  resolve: (value: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and the request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      const url = originalRequest.url || "";
      // Don't refresh if it's already an auth endpoint (except logout)
      if (
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/refresh-token")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getCookie("refreshToken");
      if (!refreshToken) {
        isRefreshing = false;
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("user");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = response.data?.data?.accessToken;
        if (!newAccessToken) {
          throw new Error("No token returned from refresh endpoint");
        }

        // Set access token cookie (expires in 1 day or session)
        setCookie("accessToken", newAccessToken, 1);

        apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("user");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
