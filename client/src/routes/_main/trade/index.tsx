import MarketDataVisualization from "@/components/market";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/trade/")({
  component: MarketDataVisualization,
});
