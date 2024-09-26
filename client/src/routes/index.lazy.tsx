import { Homepage } from "@/components/homepage";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Homepage,
});
