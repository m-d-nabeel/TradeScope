import { useAlpacaStore } from "@/store/alpaca-store";
import { useEffect } from "react";

export const useAlpaca = () => {
    const { account, assets, fetchAccount, fetchAssets, page, setPage } = useAlpacaStore();

    useEffect(() => {
        fetchAccount();
    }, [fetchAccount]);

    console.log(assets);
    

    useEffect(() => {
        fetchAssets(page);
    }, [fetchAssets, page]);

    return { account, assets, page, setPage };
}