import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useAuth } from "./hooks/useAuth";
import { routeTree } from "./routeTree.gen";

export const App = () => {
  const auth = useAuth();
  const router = createRouter({ routeTree, context: { auth } });
  return <RouterProvider router={router} context={{ auth }} />;
};
