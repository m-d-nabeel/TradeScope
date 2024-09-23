import { AlpacaAccountDisplay } from "@/components/account";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/accountstats")({
  component: AlpacaAccountDisplay,
});