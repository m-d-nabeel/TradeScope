import TradeVisualisation from "@/components/trade";
// import { AlpacaMarketService } from "@/services/market.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/trade/")({
  component: TradeVisualisation,
  // loaderDeps: ({ search: { symbols } }) => ({ symbols }),
  // loader: async ({ deps: { symbols } }) => {
  //   try {
  //     const data = await AlpacaMarketService.getAuctions({
  //       symbols: symbols.split(","),
  //       start: new Date("2022-01-01").toISOString(),
  //       end: new Date("2023-12-31").toISOString(),
  //     });

  //     console.log("data", data);
  //     console.log("symbols", symbols);

  //     if (!data || !data.auctions) {
  //       return {
  //         symbol: symbols[0],
  //         auctionData: null,
  //       };
  //     }

  //     return {
  //       symbol: symbols[0],
  //       auctionData: data.auctions[symbols[0]],
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     return {
  //       symbol: symbols[0],
  //       auctionData: null,
  //     };
  //   }
  // },
});
