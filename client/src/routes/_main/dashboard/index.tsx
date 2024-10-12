import TradingDashboard from "@/components/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/dashboard/")({
  component: TradingDashboard,
});
