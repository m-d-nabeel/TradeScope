import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useAlpaca } from "./hooks/useAlpaca";
import { useAuth } from "./hooks/useAuth";
import { routeTree } from "./routeTree.gen";

export const App = () => {
  const auth = useAuth();
  const alpaca = useAlpaca();
  const router = createRouter({ routeTree, context: { auth, alpaca } });
  return <RouterProvider router={router} context={{ auth, alpaca }} />;
};
