import { AlpacaService } from "@/services/alpaca.service";
import { AlpacaMarketService } from "@/services/market.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAlpacaQueries = () => {
  const accountQuery = useQuery({
    queryKey: ["alpaca_account"],
    queryFn: AlpacaService.getAccount,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const assetsQuery = useQuery({
    queryKey: ["alpaca_assets"],
    queryFn: AlpacaService.getAllAssets,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const barsMutation = useMutation({
    mutationFn: AlpacaMarketService.getBars,
  });

  const auctionMutation = useMutation({
    mutationFn: AlpacaMarketService.getAuctions,
  });

  return {
    accountQuery,
    assetsQuery,
    barsMutation,
    auctionMutation,
  };
};
