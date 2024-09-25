import { APP_CONFIG } from "@/config/constants";
import { useAuthStore } from "@/store/auth-store";
import { axiosInstance } from "../api/api.service";

export const AuthService = {
    async checkAuthStatus() {
        try {
            const response = await axiosInstance.get(`${APP_CONFIG.API_BASE_URL}/auth/status`);
            useAuthStore.getState().setAuth(true, response.data.user);
            return true;
        } catch (error: any) {
            console.info("Error checking auth status: ", error?.message);
            useAuthStore.getState().setAuth(false, null);
            return false;
        }
    },

    async logout() {
        try {
            const { logout } = useAuthStore.getState();
            await axiosInstance.post("/auth/logout/google", {});
            logout();
            return true;
        } catch (error: any) {
            console.info("Error during logout: ", error?.message);
            return false;
        }
    },

    getLoginUrl(provider: string) {
        return `${APP_CONFIG.API_BASE_URL}/auth/${provider}`;
    },
}