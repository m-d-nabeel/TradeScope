import { AuthService } from "@/services/auth.service";
import { User } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobalStore } from "./use-global-context";

export const useAuthQueries = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, setAuth, clearAuth } = useGlobalStore();

  const authStatusQuery = useQuery({
    queryKey: ["auth-status"],
    queryFn: AuthService.checkAuthStatus,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    retry: false,
    enabled: isAuthenticated,
  });

  const loginMutation = useMutation<User, Error, string | undefined>({
    mutationFn: AuthService.login,
    onSuccess: (user) => {
      queryClient.setQueryData(["auth-status"], { status: "Authenticated", user });
      setAuth();
    },
    onError: (error) => {
      console.error("[LOGIN_ERROR]: ", error);
      clearAuth();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth-status"], { status: "Unauthenticated", user: null });
      clearAuth();
    },
    onError: (error: any) => {
      console.error("[LOGOUT_ERROR]: ", error);
    },
    onSettled: () => {
      clearAuth();
    },
  });

  return {
    isAuthenticated: authStatusQuery.data?.status === "Authenticated",
    user: authStatusQuery.data?.user ?? null,
    isLoading: authStatusQuery.isLoading,
    login: (provider?: string) => loginMutation.mutate(provider),
    logout: () => logoutMutation.mutate(),
    refetch: authStatusQuery.refetch,
  };
};
