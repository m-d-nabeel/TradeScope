// import { User } from "@/types/user.types";
// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";

// export interface AuthStoreInterface {
//     isAuthenticated: boolean;
//     user: User | null;
//     setAuth: (isAuthenticated: boolean, user: User | null) => void;
//     clearAuth: () => void;
// }

// export const useAuthStore = create<AuthStoreInterface>()(
//     persist(
//         (set) => ({
//             isAuthenticated: false,
//             user: null,
//             setAuth: (isAuthenticated, user) => set({ isAuthenticated, user }),
//             clearAuth: () => set({ isAuthenticated: false, user: null }),
//         }),
//         {
//             name: "auth-storage",
//             storage: createJSONStorage(() => sessionStorage),
//         }
//     )
// );