import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useAuth } from "./hooks/useAuth";
import { routeTree } from "./routeTree.gen";

export const App = () => {
  const auth = useAuth();
  const router = createRouter({ routeTree, context: { auth } });
  // async function demoForViteProxy() {
  //   const response = await fetch("/api/auth/status");
  //   const data = await response.json();
  //   console.log(data);
  // }
  // demoForViteProxy();

  return <RouterProvider router={router} context={{ auth }} />;
};
