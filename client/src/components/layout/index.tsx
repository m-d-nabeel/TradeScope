import { Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen w-full bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex w-full flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
