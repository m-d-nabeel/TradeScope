import { ErrorComponent } from "@/components/error-component";
import NotFound from "@/components/not-found";
import { useAuth } from "@/hooks/useAuth";
import { createRootRouteWithContext } from "@tanstack/react-router";

export type RouterContext = {
  auth: ReturnType<typeof useAuth>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});
