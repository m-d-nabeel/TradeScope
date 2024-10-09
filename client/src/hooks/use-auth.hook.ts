import { AuthService } from "@/services/auth.service";
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
  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });
      setAuth();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await AuthService.logout()
      } catch (error: any) {
        console.log("[LOGOUT_ERROR]: ", error);
      }
    },
    onSettled: () => {
      queryClient.setQueryData(["auth-status"], null);
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
