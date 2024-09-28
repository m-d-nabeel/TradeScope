import { ErrorComponent } from "@/components/errors/error-component";
import NotFound from "@/components/errors/not-found";
import { useAlpaca } from "@/hooks/useAlpaca";
import { useAuth } from "@/hooks/useAuth";
import { createRootRouteWithContext } from "@tanstack/react-router";

export type AuthContext = ReturnType<typeof useAuth>;
export type AlpacaContext = ReturnType<typeof useAlpaca>;

export type RouterContext = {
  auth: AuthContext;
  alpaca: AlpacaContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});
