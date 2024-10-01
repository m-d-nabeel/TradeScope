import TradeVisualisation from "@/components/trade";
import { AlpacaMarketService } from "@/services/market.service";
import { createFileRoute } from "@tanstack/react-router";

interface TradeSearchParams {
  symbols: string;
}

export const Route = createFileRoute("/_main/trade/")({
  component: TradeVisualisation,
  validateSearch: (search: Record<string, unknown>): TradeSearchParams => {
    const symbols = typeof search.symbols === "string" ? search.symbols : "";
    return { symbols };
  },
  loaderDeps: ({ search }: { search: TradeSearchParams }) => ({
    symbols: search.symbols,
  }),
  loader: async ({ deps: { symbols } }: { deps: { symbols: string } }) => {
    try {
      const data = await AlpacaMarketService.getAuctions({
        symbols: symbols.split(","),
        start: new Date("2022-01-01").toISOString(),
        end: new Date("2023-12-31").toISOString(),
      });

      console.log("data", data);
      console.log("symbols", symbols);

      if (!data || !data.auctions) {
        return {
          symbol: symbols.split(",")[0],
          auctionData: null,
        };
      }

      return {
        symbol: symbols.split(",")[0],
        auctionData: data.auctions[symbols.split(",")[0]],
      };
    } catch (error) {
      console.error(error);
      return {
        symbol: symbols.split(",")[0],
        auctionData: null,
      };
    }
  },
});
