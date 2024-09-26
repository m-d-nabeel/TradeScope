import { Layout } from "@/components/layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main")({
  component: Layout,
});
