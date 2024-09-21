import { AlpacaService } from "@/services/api/alpaca.service";
import { AlpacaAccount } from "@/types/alpaca.types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


interface AlpacaState {
    account: AlpacaAccount | null;
    assets: { [page: number]: any } | null;
    setAccount: (account: AlpacaAccount) => void;
    fetchAccount: () => Promise<void>;
    fetchAssets: (page: number) => Promise<void>;
}

export const useAlpacaStore = create<AlpacaState>()(
    persist(
        (set, get) => ({
            account: null,
            assets: {},
            setAccount: (account) => set({ account }),

            async fetchAccount() {
                const cachedAccount = get().account;
                if (cachedAccount) {
                    return;
                }
                try {
                    const response = await AlpacaService.getAccount();
                    set({ account: response });
                } catch (error: any) {
                    console.info("Error fetching account: ", error?.message);
                }
            },

            async fetchAssets(page: number) {
                const cachedAssets = get().assets?.[page];
                if (cachedAssets) {
                    return;
                }
                try {
                    const assets = await AlpacaService.getAssets(page);
                    set((state) => ({
                        assets: {
                            ...state.assets,
                            [page]: assets,
                        },
                    }));
                } catch (error: any) {
                    console.info("Error fetching assets: ", error?.message);
                }
            },
        }),
        {
            name: "alpaca-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);