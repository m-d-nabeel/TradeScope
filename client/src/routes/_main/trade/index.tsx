import TradeVisualisation from "@/components/trade";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/trade/")({
  component: TradeVisualisation,
});
