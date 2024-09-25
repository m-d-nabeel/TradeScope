import { ErrorComponent } from "@/components/error-component";
import { Home } from "@/components/home";
import NotFound from "@/components/not-found";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";

export type RouterContext = {
  auth: ReturnType<typeof useAuth>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Home,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});
