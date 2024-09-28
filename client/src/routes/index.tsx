import { Homepage } from "@/components/homepage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Homepage,
  loader({ context }) {
    const { auth } = context;
    return auth;
  },
});
