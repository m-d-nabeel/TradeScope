import { useAlpacaStore } from "@/store/alpaca-store";
import { useEffect, useState } from "react";

export const useAlpaca = () => {
    const { account, assets, fetchAccount, fetchAssets } = useAlpacaStore();
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        fetchAccount();
    }, [fetchAccount]);

    useEffect(() => {
        fetchAssets(pageNumber);
    }, [fetchAssets, pageNumber]);


    return { account, assets, setPageNumber, pageNumber };
}