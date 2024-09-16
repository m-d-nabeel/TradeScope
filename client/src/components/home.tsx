import { useAuth } from "@/contexts";
import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Button } from "./ui/button";
import React from "react";

export const Home = () => {
  const { user, login, logout } = useAuth();
  console.log("User:", user);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                Home
              </Link>
              {user && (
                <React.Fragment>
                  <Link
                    to="/dashboard"
                    className="ml-6 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="ml-6 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="ml-6 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Settings
                  </Link>
                </React.Fragment>
              )}
            </div>
            <div className="flex items-center">
              <Button onClick={user ? logout : () => login("google")}>
                {user ? "Sign Out" : "Sign In with Google"}
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  );
};
