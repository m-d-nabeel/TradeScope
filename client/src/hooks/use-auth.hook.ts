import { AuthService } from "@/services/auth.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobalStore } from "./use-global-context";

export const useAuthQueries = () => {
  const queryClient = useQueryClient();

  const authStatusQuery = useQuery({
    queryKey: ["auth-status"],
    queryFn: AuthService.checkAuthStatus,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });
      useGlobalStore.setState({ isAuthenticated: true });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth-status"], null);
      useGlobalStore.setState({ isAuthenticated: false });
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
