import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface GlobalStore {
  isAuthenticated: boolean;
  setAuth: () => void;
  clearAuth: () => void;
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setAuth: () => set({ isAuthenticated: true }),
      clearAuth: () => set({ isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
