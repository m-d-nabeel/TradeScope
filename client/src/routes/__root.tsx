import { ErrorComponent } from "@/components/error-component";
import NotFound from "@/components/not-found";
import { useAlpaca } from "@/hooks/useAlpaca";
import { useAuth } from "@/hooks/useAuth";
import { createRootRouteWithContext } from "@tanstack/react-router";

export type RouterContext = {
  auth: ReturnType<typeof useAuth>;
  alpaca: ReturnType<typeof useAlpaca>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});
