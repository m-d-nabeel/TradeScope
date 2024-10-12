import { PortfolioDashboard } from "@/components/portfolio";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/portfolio/")({
  component: PortfolioDashboard,
});
