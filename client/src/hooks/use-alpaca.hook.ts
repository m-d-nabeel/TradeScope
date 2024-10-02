import { AlpacaService } from "@/services/alpaca.service";
import { AlpacaMarketService } from "@/services/market.service";
import { useQuery } from "@tanstack/react-query";

interface MarketQuery {
  symbols: string[];
  start: string;
  end?: string;
  limit?: number;
}

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

  const stocksExchangesQuery = useQuery({
    queryKey: ["alpaca_stocks_exchanges"],
    queryFn: AlpacaMarketService.getStocksExchanges,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  return {
    accountQuery,
    assetsQuery,
    stocksExchangesQuery,
  };
};


export const useMarketQueries = (params: MarketQuery) => {
  const auctionQuery = useQuery({
    queryKey: ["alpaca_auction", params],
    queryFn: () => AlpacaMarketService.getAuctions(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const barsQuery = useQuery({
    queryKey: ["alpaca_bars", params],
    queryFn: () => AlpacaMarketService.getBars(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  return {
    auctionQuery,
    barsQuery,
  };
}