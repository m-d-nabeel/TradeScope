import { useAlpacaStore } from "@/store/alpaca-store";
import { AlpacaAccount, AlpacaAsset } from "@/types/alpaca.types";
import { useEffect } from "react";

export interface AlpacaStoreInterface {
    account: AlpacaAccount;
    totalAssets: AlpacaAsset[];
}

export const useAlpaca = () => {
    const { account, fetchAccount, totalAssets, fetchTotalAssets } = useAlpacaStore();

    useEffect(() => {
        fetchAccount();
    }, [fetchAccount]);


    useEffect(() => {
        fetchTotalAssets();
    }, [fetchTotalAssets]);

    return { account, totalAssets };
}