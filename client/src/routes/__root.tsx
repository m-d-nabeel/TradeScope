import { ErrorComponent } from "@/components/common/error-component";
import NotFound from "@/components/common/not-found";
import { GlobalStore } from "@/hooks/use-global-context";
import { createRootRouteWithContext } from "@tanstack/react-router";

export type RouterContext = {
  globalCtx: GlobalStore;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});
