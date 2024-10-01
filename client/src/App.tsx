import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useGlobalStore } from "./hooks/useGlobal";
import { routeTree } from "./routeTree.gen";

export const App = () => {
  const globalCtx = useGlobalStore();
  const router = createRouter({ routeTree, context: { globalCtx } });
  return <RouterProvider router={router} context={{ globalCtx }} />;
};
