import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { LoginInput, RegisterInput, User } from "../types/auth.types";
import { useRouter } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from "@/utils/cookies";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading: isUserLoading } = useQuery<User | null>({
    queryKey: ["auth-user"],
    queryFn: () => {
      const storedUser = getCookie("user");
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch {
          return null;
        }
      }
      return null;
    },
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (response) => {
      setCookie("accessToken", response.data.accessToken, 7);
      setCookie("refreshToken", response.data.refreshToken, 7);
      setCookie("user", JSON.stringify(response.data.user), 7);
      queryClient.setQueryData(["auth-user"], response.data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (response) => {
      setCookie("accessToken", response.data.accessToken, 7);
      setCookie("refreshToken", response.data.refreshToken, 7);
      setCookie("user", JSON.stringify(response.data.user), 7);
      queryClient.setQueryData(["auth-user"], response.data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("user");
      queryClient.setQueryData(["auth-user"], null);
      router.push("/login");
    },
    onError: () => {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("user");
      queryClient.setQueryData(["auth-user"], null);
      router.push("/login");
    },
  });

  return {
    user,
    isLoading: isUserLoading,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    registerError: registerMutation.error,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    isAuthenticated: !!user,
  };
}
