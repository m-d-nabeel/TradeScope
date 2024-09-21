import { AuthStore } from "@/store/auth-store";
import { Link, useRouteContext } from "@tanstack/react-router";
import { Fragment } from "react";
import { Button } from "./ui/button";

export const Navbar = () => {
  const { auth }: { auth: AuthStore } = useRouteContext({ from: "" });
  const { user, logout, login } = auth;
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              Home
            </Link>
            {!!user && (
              <Fragment>
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
              </Fragment>
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
  );
};
