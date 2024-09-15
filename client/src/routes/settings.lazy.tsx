import { createLazyFileRoute } from "@tanstack/react-router";
import { Settings } from "../components/settings";

export const Route = createLazyFileRoute("/settings")({
  component: Settings,
});
