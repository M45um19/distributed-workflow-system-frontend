import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import { UpdateProfileInput } from "../types/user.types";
import { setCookie, getCookie } from "@/utils/cookies";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userService.getProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => userService.updateProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      if (response.data) {
        const storedUser = getCookie("user");
        let parsedUser: Record<string, unknown> = {};
        if (storedUser) {
          try {
            parsedUser = JSON.parse(storedUser);
          } catch {
            parsedUser = {};
          }
        }

        const updatedUser = {
          ...parsedUser,
          full_name: response.data.full_name,
          email: response.data.email,
          avatar_url: response.data.avatar_url,
          role: response.data.role,
        };

        setCookie("user", JSON.stringify(updatedUser), 7);
        queryClient.setQueryData(["auth-user"], updatedUser);
      }
    },
  });
}
