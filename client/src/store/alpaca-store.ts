import { AlpacaService } from "@/services/api/alpaca.service";
import { AlpacaAccount, AlpacaAsset } from "@/types/alpaca.types";
import { create } from "zustand";


interface AlpacaState {
  account: AlpacaAccount | null;
  page: number;
  assets: Record<number, AlpacaAsset[]>;
  setAccount: (account: AlpacaAccount) => void;
  fetchAccount: () => Promise<void>;
  fetchAssets: (page: number) => Promise<void>;
  setPage: (page: number) => void;
}

export const useAlpacaStore = create<AlpacaState>()(
  (set, get) => ({
    account: null,
    assets: {},
    setAccount: (account) => set({ account }),
    page: 1,
    setPage: (page) => set({ page }),

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
  })
);