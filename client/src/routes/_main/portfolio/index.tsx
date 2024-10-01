import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/portfolio/")({
  component: () => <div>Hello /portfolio/!</div>,
});
