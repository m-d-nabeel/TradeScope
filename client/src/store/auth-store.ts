import { APP_CONFIG } from "@/config/constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


interface UserInterface {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
}

export interface AuthStoreInterface {
    isAuthenticated: boolean;
    user: UserInterface | null;
    logout: () => void;
    setAuth: (isAuthenticated: boolean, user: any | null) => void;
    login: (provider: string) => void;
}

export const useAuthStore = create<AuthStoreInterface>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            setAuth: (isAuthenticated, user) => set({ isAuthenticated, user }),
            logout: () => set({ isAuthenticated: false, user: null }),
            login: (provider) => {
                window.location.href = `${APP_CONFIG.API_BASE_URL}/auth/${provider}`;
            }
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
