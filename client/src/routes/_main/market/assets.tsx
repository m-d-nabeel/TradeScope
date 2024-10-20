import { MarketAssets } from "@/components/market/assets";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/market/assets")({
  component: MarketAssets,
});
