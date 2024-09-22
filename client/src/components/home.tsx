import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Navbar } from "./navbar";

export function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
}
