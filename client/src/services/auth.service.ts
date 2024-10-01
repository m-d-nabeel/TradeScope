import axiosInstance from "@/config/axios-instance";
import { APP_CONFIG } from "@/config/constants";
import { AuthStatusApiResponse } from "@/types/api.types";

export const AuthService = {
  async checkAuthStatus(): Promise<AuthStatusApiResponse> {
    const response =
      await axiosInstance.get<AuthStatusApiResponse>(`/auth/status`);
    return response.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post("/auth/logout/google");
  },

  async login(provider?: string): Promise<void> {
    window.location.href = `${APP_CONFIG.API_BASE_URL}/auth/${provider ?? "google"}`;
  },

  async refreshToken() {
    return axiosInstance.post("/auth/refresh");
  },
};
