import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/alerts/")({
  component: () => <div>Hello /alerts/!</div>,
});
