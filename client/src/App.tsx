import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useGlobalStore } from "./hooks/use-global-context";
import { routeTree } from "./routeTree.gen";

export const App = () => {
  const globalCtx = useGlobalStore();
  const router = createRouter({ routeTree, context: { globalCtx } });
  return <RouterProvider basepath="TradeScope" router={router} context={{ globalCtx }} />;
};
