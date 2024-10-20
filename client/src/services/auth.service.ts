import axiosInstance from "@/config/axios-instance";
import { APP_CONFIG } from "@/config/constants";
import { AuthStatusApiResponse } from "@/types/api.types";
import { User } from "@/types/user.types";

export const AuthService = {
  async checkAuthStatus(): Promise<AuthStatusApiResponse> {
    const response = await axiosInstance.get<AuthStatusApiResponse>(`/auth/status`);
    return response.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post("/auth/logout/google");
  },

  // async login(provider?: string): Promise<void> {
  //   window.location.href = `${APP_CONFIG.API_BASE_URL}/auth/${provider ?? "google"}`;
  // },
  login(provider: string = "google"): Promise<User> {
    return new Promise((resolve, reject) => {
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2.5;

      // Generate a unique state value for CSRF protection
      const state = Math.random().toString(36).substring(2, 15);

      const popup = window.open(
        `${APP_CONFIG.API_BASE_URL}/auth/${provider}?state=${state}`,
        "OAuth Login",
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== APP_CONFIG.API_BASE_URL) return;

        try {
          const data = JSON.parse(event.data);
          if (data.type === "AUTH_SUCCESS") {
            if (data.state !== state) {
              throw new Error("Invalid state parameter");
            }
            window.removeEventListener("message", handleMessage);
            if (popup) popup.close();
            resolve(data.user);
          } else if (data.type === "AUTH_ERROR") {
            throw new Error(data.error);
          }
        } catch (error) {
          reject(error);
        }
      };

      window.addEventListener("message", handleMessage);

      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", handleMessage);
          reject(new Error("Authentication cancelled"));
        }
      }, 1000);
    });
  },

  async refreshToken() {
    return axiosInstance.post("/auth/refresh");
  },
};
