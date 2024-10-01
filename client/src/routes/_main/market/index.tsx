import { MarketAssets } from "@/components/market";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/market/")({
  component: MarketAssets,
});
