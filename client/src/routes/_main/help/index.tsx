import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/help/")({
  component: () => <div>Hello /help/!</div>,
});
