import MarketDataVisualization from "@/components/market";
import { AlpacaMarketService } from "@/services/api/alpaca-market.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/trade/")({
  component: MarketDataVisualization,
  loader: async () => {
    const data = await AlpacaMarketService.getAuctions({
      start: "2022-01-01T00:00:00Z",
      symbols: ["AAPL"],
    });
    return { data };
  },
});
