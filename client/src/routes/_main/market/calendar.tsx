import { TradingCalendar } from "@/components/market/trade-calendar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/market/calendar")({
  component: TradingCalendar,
});
