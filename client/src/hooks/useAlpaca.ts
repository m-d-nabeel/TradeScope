import { useAlpacaStore } from "@/store/alpaca-store";
import { useEffect } from "react";

export const useAlpaca = () => {
    const { account, assets, fetchAccount, fetchAssets, page, setPage, totalAssets, fetchTotalAssets } = useAlpacaStore();

    useEffect(() => {
        fetchAccount();
    }, [fetchAccount]);

    useEffect(() => {
        fetchAssets(page);
    }, [fetchAssets, page]);

    useEffect(() => {
        fetchTotalAssets();
    }, [fetchTotalAssets]);

    return { account, assets, page, setPage, totalAssets };
}